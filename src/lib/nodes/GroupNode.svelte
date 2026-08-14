<script>
  import NodeHandles from './NodeHandles.svelte';

  let { data, selected } = $props();
</script>

<div class="group" class:selected class:dashed={data.dashed}>
  <span class="group-title">{data.label}</span>
</div>

<NodeHandles />

<style>
  .group {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 2px solid #4b5563;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.55);
    padding: 8px 12px;
    cursor: pointer;
    transition: box-shadow 120ms ease;
  }

  /* The dashed variant is how the source diagram marks conceptual
     groupings (Data Mesh) rather than deployable things. */
  .group.dashed {
    border-style: dashed;
    border-color: #2563eb;
    background: rgba(255, 255, 255, 0.35);
  }

  .group:hover {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18);
  }

  .group.selected {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.4);
  }

  .group-title {
    font-size: 17px;
    font-weight: 500;
    color: #1c1c22;
  }
</style>
