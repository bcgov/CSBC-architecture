<script>
  import {
    SvelteFlow,
    Background,
    Controls,
    MiniMap,
    useSvelteFlow,
    useNodesInitialized
  } from '@xyflow/svelte';

  import { initialNodes, initialEdges } from './diagram.js';
  import { content } from './content.js';

  import ZoneNode from './nodes/ZoneNode.svelte';
  import GroupNode from './nodes/GroupNode.svelte';
  import BoxNode from './nodes/BoxNode.svelte';
  import NoteNode from './nodes/NoteNode.svelte';

  let { onselect } = $props();

  // $state.raw, not $state. Svelte Flow reassigns these arrays constantly
  // (every pan, selection and measurement pass). Deep reactivity would wrap
  // every node object in a proxy and cost you frames on a diagram this size.
  let nodes = $state.raw(initialNodes);
  let edges = $state.raw(initialEdges);

  const nodeTypes = { zone: ZoneNode, group: GroupNode, box: BoxNode, note: NoteNode };

  const { fitView } = useSvelteFlow();
  const nodesInitialized = useNodesInitialized();

  // The `fitView` prop on <SvelteFlow> runs on mount, before text-sized nodes
  // (the annotations) have been measured — so it fits to bounds that are too
  // small and the diagram overflows. Waiting for `nodesInitialized` and
  // fitting manually is the reliable version.
  let hasFit = $state(false);
  $effect(() => {
    if (nodesInitialized.current && !hasFit) {
      hasFit = true;
      fitView({ padding: 0.06 });
    }
  });

  function select(id) {
    // Silently ignore anything with no authored content — decorative
    // elements shouldn't pop an empty panel.
    if (content[id]) onselect(id);
  }
</script>

<SvelteFlow
  bind:nodes
  bind:edges
  {nodeTypes}
  minZoom={0.2}
  maxZoom={2.5}
  nodesDraggable={false}
  nodesConnectable={false}
  elevateNodesOnSelect={false}
  onnodeclick={({ node }) => select(node.id)}
  onedgeclick={({ edge }) => select(edge.id)}
  onpaneclick={() => onselect(null)}
>
  <Background bgColor="#f7f7f9" patternColor="#dfe0e6" gap={22} size={1} />
  <Controls showLock={false} position="bottom-left" />
  <MiniMap
    pannable
    zoomable
    position="bottom-right"
    width={150}
    height={100}
    nodeColor={(n) => (n.type === 'zone' ? '#c7cad6' : '#8e93a3')}
  />
</SvelteFlow>
