<script lang="ts">
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  let isHovering = $state(false);
  let mouseX = 0.5;
  let mouseY = 0.5;
  let isDarkTheme = $state(true);

  onMount(() => {
    // Watch for theme changes
    const observer = new MutationObserver(() => {
      isDarkTheme = !document.documentElement.classList.contains("light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    // Vertex shader - simple fullscreen quad
    const vertexShaderSource = `
			attribute vec2 a_position;
			varying vec2 v_uv;
			void main() {
				v_uv = a_position * 0.5 + 0.5;
				gl_Position = vec4(a_position, 0.0, 1.0);
			}
		`;

    // Fragment shader - iridescent soap bubble effect
    const fragmentShaderSource = `
			precision highp float;

			varying vec2 v_uv;
			uniform float u_time;
			uniform vec2 u_resolution;
			uniform vec2 u_mouse;
			uniform float u_hover;
			uniform float u_isDark;

			#define PI 3.14159265359

			// Simplex noise for organic movement
			vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
			vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
			vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

			float snoise(vec2 v) {
				const vec4 C = vec4(0.211324865405187, 0.366025403784439,
					-0.577350269189626, 0.024390243902439);
				vec2 i  = floor(v + dot(v, C.yy));
				vec2 x0 = v - i + dot(i, C.xx);
				vec2 i1;
				i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
				vec4 x12 = x0.xyxy + C.xxzz;
				x12.xy -= i1;
				i = mod289(i);
				vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
					+ i.x + vec3(0.0, i1.x, 1.0));
				vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
					dot(x12.zw,x12.zw)), 0.0);
				m = m*m;
				m = m*m;
				vec3 x = 2.0 * fract(p * C.www) - 1.0;
				vec3 h = abs(x) - 0.5;
				vec3 ox = floor(x + 0.5);
				vec3 a0 = x - ox;
				m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
				vec3 g;
				g.x = a0.x * x0.x + h.x * x0.y;
				g.yz = a0.yz * x12.xz + h.yz * x12.yw;
				return 130.0 * dot(m, g);
			}

			// Thin film interference - attempt to model soap bubble iridescence
			vec3 thinFilmInterference(float thickness, float cosAngle) {
				// Attempt wavelengths for RGB
				float waveR = 650.0;
				float waveG = 510.0;
				float waveB = 475.0;

				float n = 1.33; // refractive index of soap film
				float d = thickness * 400.0 + 100.0; // film thickness in nm

				// Path difference
				float pathDiff = 2.0 * n * d * cosAngle;

				// Interference intensity for each color
				float r = pow(cos(PI * pathDiff / waveR), 2.0);
				float g = pow(cos(PI * pathDiff / waveG), 2.0);
				float b = pow(cos(PI * pathDiff / waveB), 2.0);

				return vec3(r, g, b);
			}

			void main() {
				vec2 uv = v_uv;
				vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);

				// Time-based animation with multiple frequencies for organic feel
				float t1 = u_time * 0.15;
				float t2 = u_time * 0.23;
				float t3 = u_time * 0.17;

				// Create flowing noise field for thickness variation
				float noise1 = snoise(uv * 2.0 + vec2(t1, t2 * 0.7)) * 0.5;
				float noise2 = snoise(uv * 4.0 - vec2(t2 * 0.8, t1)) * 0.25;
				float noise3 = snoise(uv * 8.0 + vec2(t3, -t1 * 0.5)) * 0.125;

				// Combine for film thickness
				float thickness = 0.5 + noise1 + noise2 + noise3;

				// Add wave ripples
				float wave1 = sin(uv.x * 6.0 + uv.y * 4.0 + t1 * 2.0) * 0.1;
				float wave2 = sin(uv.x * 8.0 - uv.y * 6.0 + t2 * 1.5) * 0.08;
				float wave3 = sin(length((uv - 0.5) * aspect) * 12.0 - u_time * 0.5) * 0.06;

				thickness += wave1 + wave2 + wave3;

				// View angle simulation (center = perpendicular, edges = glancing)
				vec2 center = vec2(0.5);
				float distFromCenter = length((uv - center) * aspect);
				float cosAngle = cos(distFromCenter * 0.8);

				// Calculate iridescent color
				vec3 iridescence = thinFilmInterference(thickness, cosAngle);

				// Edge highlight (Fresnel-like)
				float fresnel = pow(1.0 - cosAngle, 3.0) * 0.2;

				// Combine colors
				vec3 color = iridescence * 0.4 + vec3(fresnel);

				// Very subtle overall tint
				color = mix(color, vec3(0.95, 0.98, 1.0), 0.1);

				// Transparency - mostly transparent with subtle color
				float alpha = 0.08 + length(iridescence - 0.5) * 0.15 + fresnel;
				alpha = clamp(alpha, 0.0, 0.35);

				// Fluid displacement - bubble pushed aside by cursor
				vec2 mouseOffset = (uv - u_mouse) * aspect;
				float mouseDist = length(mouseOffset);
				vec2 mouseDir = mouseDist > 0.001 ? normalize(mouseOffset) : vec2(0.0);

				// Displacement radius and strength
				float displaceRadius = 0.1 * u_hover;
				float displaceStrength = smoothstep(displaceRadius, 0.0, mouseDist);

				// Push the film outward - thins in center, thickens at rim
				float rimDist = abs(mouseDist - displaceRadius * 0.7);
				float rim = smoothstep(0.08, 0.0, rimDist) * u_hover;

				// Fade alpha in the displacement zone (thinning film)
				float thinning = smoothstep(0.0, displaceRadius, mouseDist);
				thinning = mix(0.1, 1.0, thinning); // very thin at center, normal outside

				// Thicken and brighten the rim where material bunches up
				float rimThickness = rim * 0.6;
				vec3 rimIridescence = thinFilmInterference(thickness + rimThickness, cosAngle * 0.8);
				color = mix(color, rimIridescence * 0.6 + vec3(0.1), rim * 0.8);

				// Add rim highlight (light catching the bunched-up edge)
				float rimHighlight = rim * 0.25;
				color += vec3(rimHighlight);

				// Apply thinning to alpha
				alpha *= thinning;
				// Boost alpha at rim
				alpha = mix(alpha, min(alpha + 0.15, 0.4), rim);

				// Ripple cursor - expanding rings from mouse position
				float rippleSpeed = 0.35;
				float rippleCount = 2.0;
				float rippleSpacing = 0.022;
				float rippleWidth = 0.0025;

				for (float i = 0.0; i < 2.0; i++) {
					// Each ripple expands outward over time, then resets
					float rippleTime = fract(u_time * rippleSpeed - i / rippleCount);
					float rippleRadius = rippleTime * rippleSpacing * rippleCount;

					// Fade out as ripple expands
					float rippleFade = 1.0 - rippleTime;
					rippleFade = rippleFade * rippleFade; // ease out

					// Ring shape
					float ringDist = abs(mouseDist - rippleRadius);
					float ring = smoothstep(rippleWidth, 0.0, ringDist);

					// Iridescent ring color
					vec3 rippleColor = thinFilmInterference(rippleTime + i * 0.3, 0.8) * 0.6 + 0.4;

					// Apply ripple
					float rippleAlpha = ring * rippleFade * u_hover * 0.45;
					color = mix(color, rippleColor, rippleAlpha);
					alpha = max(alpha, rippleAlpha * 0.6);
				}

				// Center dot - white on dark theme, black on light theme
				float dotRadius = 0.00475;
				float dot = smoothstep(dotRadius, dotRadius * 0.3, mouseDist);
				vec3 dotColor = mix(vec3(0.0), vec3(1.0), u_isDark);
				color = mix(color, dotColor, dot * u_hover * 0.9);
				alpha = max(alpha, dot * u_hover * 0.85);

				gl_FragColor = vec4(color, alpha);
			}
		`;

    function createShader(
      gl: WebGLRenderingContext,
      type: number,
      source: string
    ) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    // Fullscreen quad
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const hoverLoc = gl.getUniformLocation(program, "u_hover");
    const isDarkLoc = gl.getUniformLocation(program, "u_isDark");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let animationId: number;
    let startTime = performance.now();
    let currentHover = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function render() {
      const time = (performance.now() - startTime) / 1000;

      // Smooth hover transition
      const targetHover = isHovering ? 1 : 0;
      currentHover += (targetHover - currentHover) * 0.08;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLoc, time);
      gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
      gl.uniform2f(mouseLoc, mouseX, 1.0 - mouseY);
      gl.uniform1f(hoverLoc, currentHover);
      gl.uniform1f(isDarkLoc, isDarkTheme ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId = requestAnimationFrame(render);
    }

    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      isHovering = true;
    }

    function handleMouseLeave() {
      isHovering = false;
    }

    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    resize();
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
    };
  });
</script>

<canvas bind:this={canvas} class="bubble-overlay" aria-hidden="true"></canvas>

<style>
  .bubble-overlay {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1000;
  }
</style>
