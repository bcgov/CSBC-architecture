<script>
  import NodeHandles from './NodeHandles.svelte';

  // `data` is whatever we put in the node object in diagram.js.
  // `selected` is managed by Svelte Flow — we use it to draw the focus ring.
  let { data, selected } = $props();

  // Zone titles sit at the top in most zones but at the bottom in
  // "Business Domains" / "Connectivity", so it's a data-driven choice.
  let titleAtBottom = $derived(data.titleAlign === 'bottom');
</script>

<div
  class="zone"
  class:selected
  class:bottom={titleAtBottom}
  style:--zone-accent={data.accent}
  style:--zone-fill={data.fill}
>
  <span class="zone-title">{data.label}</span>
</div>

<NodeHandles />

<style>
  .zone {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 2px solid var(--zone-accent);
    background: var(--zone-fill);
    border-radius: 10px;
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    cursor: pointer;
    transition: box-shadow 120ms ease, border-color 120ms ease;
  }

  .zone.bottom {
    justify-content: flex-end;
  }

  .zone:hover {
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--zone-accent) 22%, transparent);
  }

  .zone.selected {
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--zone-accent) 45%, transparent);
  }

  .zone-title {
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: #1c1c22;
    /* Only the title text should swallow clicks meant for the zone itself —
       the large empty interior stays click-through so it doesn't steal
       clicks aimed at the diagram background. */
    pointer-events: auto;
  }
</style>
