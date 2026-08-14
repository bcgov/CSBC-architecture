<script>
  let { entry, onclose } = $props();

  let dialogEl = $state(null);

  // Move focus into the panel when it opens so keyboard and screen-reader
  // users land somewhere sensible, and Escape has something to close.
  $effect(() => {
    if (entry && dialogEl) dialogEl.focus();
  });

  function onkeydown(event) {
    if (event.key === 'Escape') onclose();
  }
</script>

<svelte:window {onkeydown} />

{#if entry}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" onclick={onclose}>
    <div
      class="panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      bind:this={dialogEl}
      onclick={(e) => e.stopPropagation()}
    >
      <header>
        <span class="kind">{entry.kind}</span>
        <h2 id="modal-title">{entry.title}</h2>
        <button class="close" onclick={onclose} aria-label="Close">×</button>
      </header>

      <div class="body">
        {#each entry.body.split('\n\n') as paragraph}
          <p>{paragraph}</p>
        {/each}
      </div>

      {#if entry.facts?.length}
        <dl class="facts">
          {#each entry.facts as [term, value]}
            <dt>{term}</dt>
            <dd>{value}</dd>
          {/each}
        </dl>
      {/if}

      {#if entry.links?.length}
        <nav class="links">
          {#each entry.links as link}
            <a href={link.href}>{link.label} →</a>
          {/each}
        </nav>
      {/if}
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(15, 20, 30, 0.42);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    z-index: 50;
    padding: 24px;
  }

  .panel {
    width: min(460px, 100%);
    max-height: calc(100vh - 48px);
    overflow-y: auto;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.28);
    padding: 26px 28px 28px;
    outline: none;
    animation: slide 160ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes slide {
    from {
      opacity: 0;
      transform: translateX(16px);
    }
  }

  header {
    position: relative;
    margin-bottom: 14px;
  }

  .kind {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #5b6070;
    margin-bottom: 6px;
  }

  h2 {
    margin: 0;
    font-size: 22px;
    line-height: 1.25;
    padding-right: 34px;
    color: #14141a;
  }

  .close {
    position: absolute;
    top: -4px;
    right: -6px;
    border: none;
    background: transparent;
    font-size: 26px;
    line-height: 1;
    color: #6b7280;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
  }

  .close:hover {
    background: #f1f2f6;
    color: #14141a;
  }

  .body p {
    margin: 0 0 12px;
    font-size: 14.5px;
    line-height: 1.6;
    color: #33343d;
  }

  .facts {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 6px 18px;
    margin: 18px 0 0;
    padding-top: 16px;
    border-top: 1px solid #e8e9ee;
    font-size: 13.5px;
  }

  dt {
    color: #6b7280;
  }

  dd {
    margin: 0;
    color: #14141a;
  }

  .links {
    margin-top: 18px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .links a {
    font-size: 13.5px;
    color: #2563eb;
    text-decoration: none;
  }

  .links a:hover {
    text-decoration: underline;
  }
</style>
