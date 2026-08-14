<script>
  import { Handle, Position } from '@xyflow/svelte';

  // Every node gets four source handles and four target handles, one per side.
  // They are invisible (see app.css) and non-connectable — they exist purely as
  // named anchor points so edges in diagram.js can say "leave from the right,
  // arrive at the top" instead of letting the library guess.
  const sides = [
    ['t', Position.Top],
    ['r', Position.Right],
    ['b', Position.Bottom],
    ['l', Position.Left]
  ];
</script>

{#each sides as [key, position] (key)}
  <Handle type="source" id="s{key}" {position} isConnectable={false} />
  <Handle type="target" id="t{key}" {position} isConnectable={false} />
{/each}
