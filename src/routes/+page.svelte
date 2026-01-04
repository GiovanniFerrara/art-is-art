<script lang="ts">
  import MediaSlider from "$lib/components/MediaSlider.svelte";
  import type { Project } from "$lib/types";

  let { data } = $props();
  let selectedProject: Project = $state(data.projects[0]);

  function selectProject(project: Project) {
    selectedProject = project;
  }
</script>

<div class="home">
  <aside class="sidebar">
    <nav class="project-list">
      {#each data.projects as project (project.slug)}
        <button
          class="project-item"
          class:active={selectedProject.slug === project.slug}
          onclick={() => selectProject(project)}
        >
          <span class="title">{project.title}</span>
          <span class="category">{project.category}</span>
        </button>
      {/each}
    </nav>

    {#key selectedProject.slug}
      <div class="project-info">
        <p class="description">{selectedProject.description}</p>
        <span class="date">{new Date(selectedProject.date).getFullYear()}</span>
      </div>
    {/key}
  </aside>

  <main class="viewer">
    {#key selectedProject.slug}
      <MediaSlider media={selectedProject.media} title={selectedProject.title} />
    {/key}
  </main>
</div>

<style>
  .home {
    display: flex;
    height: calc(100vh - 8rem);
    min-height: 500px;
  }

  .sidebar {
    width: 320px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    border-right: 1px solid var(--card-bg);
  }

  .project-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .project-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.75rem 0;
    background: none;
    border: none;
    cursor: none;
    text-align: left;
    transition: opacity 0.2s ease;
  }

  .project-item:not(.active) {
    opacity: 0.4;
  }

  .project-item:hover {
    opacity: 1;
  }

  .project-item .title {
    font-size: 1rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: 0.02em;
  }

  .project-item .category {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: lowercase;
    letter-spacing: 0.1em;
  }

  .project-info {
    margin-top: auto;
    padding-top: 2rem;
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .description {
    font-size: 0.875rem;
    line-height: 1.7;
    color: var(--text);
    margin: 0 0 1rem;
  }

  .date {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.1em;
  }

  .viewer {
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 768px) {
    .home {
      flex-direction: column;
      height: auto;
      min-height: calc(100vh - 8rem);
    }

    .sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid var(--card-bg);
      padding: 1.5rem;
    }

    .project-list {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .project-item {
      padding: 0.5rem 0;
    }

    .project-info {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--card-bg);
    }

    .viewer {
      height: 60vh;
      min-height: 400px;
    }
  }
</style>
