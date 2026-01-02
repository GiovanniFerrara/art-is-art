<script lang="ts">
</script>

<div class="content">
	<h1>art is art</h1>

	<!-- Temporary content to see the overlay effect -->
	<div class="demo-grid">
		{#each Array(12) as _, i}
			<div class="demo-card" style:--hue={i * 30}>
				<div class="demo-image"></div>
				<p>Project {i + 1}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		padding: 2rem;
	}

	h1 {
		font-size: clamp(2rem, 8vw, 4rem);
		font-weight: 200;
		letter-spacing: 0.1em;
		color: #333;
		text-transform: lowercase;
		margin-bottom: 3rem;
		margin-top: 2rem;
	}

	.demo-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
		width: 100%;
		max-width: 1200px;
		padding: 1rem;
	}

	.demo-card {
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.demo-image {
		aspect-ratio: 4/3;
		background: linear-gradient(
			135deg,
			hsl(var(--hue, 0), 70%, 80%),
			hsl(calc(var(--hue, 0) + 40), 60%, 70%)
		);
	}

	.demo-card p {
		padding: 1rem;
		font-size: 0.9rem;
		color: #666;
	}
</style>
