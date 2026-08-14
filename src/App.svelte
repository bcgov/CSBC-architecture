<script>
  import { SvelteFlowProvider } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';

  import Diagram from './lib/Diagram.svelte';
  import Modal from './lib/Modal.svelte';
  import { content } from './lib/content.js';

  // The id of whatever is open; null means no modal.
  let openId = $state(null);
  let entry = $derived(openId ? content[openId] : null);
</script>

<div class="canvas">
  <!-- The Provider is what lets Diagram.svelte call useSvelteFlow() /
       useNodesInitialized(). Those hooks read from context, so they only work
       in a component *inside* the provider — not in the one that renders it. -->
  <SvelteFlowProvider>
    <Diagram onselect={(id) => (openId = id)} />
  </SvelteFlowProvider>

  <header class="title">
    <h1>Reference Architecture</h1>
    <p>Click any box, zone or connector for detail. Scroll to zoom, drag to pan.</p>
  </header>
</div>

<Modal {entry} onclose={() => (openId = null)} />

<style>
  .canvas {
    position: relative;
    width: 100vw;
    height: 100vh;
  }

  .title {
    position: absolute;
    top: 20px;
    left: 24px;
    z-index: 5;
    pointer-events: none;
  }

  .title h1 {
    margin: 0;
    font-size: 19px;
    font-weight: 600;
    color: #14141a;
  }

  .title p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #6b7280;
  }
</style>
