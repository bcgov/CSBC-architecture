<script>
  import NodeHandles from './NodeHandles.svelte';

  let { data, selected } = $props();
</script>

<!-- `stacked` renders the two offset shadow cards behind the box that the
     source diagram uses to mean "there are many of these". They're pure
     decoration, so they sit outside the clickable surface. -->
{#if data.stacked}
  <div class="stack stack-2" aria-hidden="true"></div>
  <div class="stack stack-1" aria-hidden="true"></div>
{/if}

<div class="box" class:selected class:dashed={data.dashed}>
  <span class="label">{data.label}</span>
  {#if data.sublabel}
    <span class="sublabel">{data.sublabel}</span>
  {/if}
</div>

<NodeHandles />

<style>
  .box {
    position: relative;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1.5px solid #4b5563;
    border-radius: 7px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 6px 10px;
    text-align: center;
    cursor: pointer;
    transition: box-shadow 120ms ease, transform 120ms ease;
  }

  .box.dashed {
    border-style: dashed;
  }

  .box:hover {
    box-shadow: 0 2px 10px rgba(15, 23, 42, 0.18);
    transform: translateY(-1px);
  }

  .box.selected {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.45);
  }

  .label {
    font-size: 13.5px;
    line-height: 1.25;
    color: #14141a;
  }

  .sublabel {
    font-size: 12px;
    font-style: italic;
    color: #5b6070;
  }

  .stack {
    position: absolute;
    inset: 0;
    border: 1.5px solid #4b5563;
    border-radius: 7px;
    background: #ffffff;
  }

  .stack-1 {
    transform: translate(6px, 6px);
  }

  .stack-2 {
    transform: translate(12px, 12px);
  }
</style>
