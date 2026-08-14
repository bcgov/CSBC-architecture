# Interactive Reference Architecture — Svelte Flow

An architecture diagram rendered as a pan/zoom canvas where every box, zone and
connector opens a detail panel.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/ — deploy anywhere
```

Stack: Svelte 5 (runes) · Vite · `@xyflow/svelte` v1 (MIT).

---

## The shape of it

```
src/
  App.svelte              shell — owns "which modal is open"
  app.css                 global resets + Svelte Flow overrides
  lib/
    Diagram.svelte        the canvas: node types, event wiring, fitView
    diagram.js            LAYOUT — coordinates, sizes, edges. No prose.
    content.js            CONTENT — id → { title, body, facts, links }. No coordinates.
    Modal.svelte          the detail panel
    nodes/
      ZoneNode.svelte     the big coloured containers
      GroupNode.svelte    inner containers (Authentication, Data Mesh)
      BoxNode.svelte      white rounded boxes, incl. dashed + stacked variants
      NoteNode.svelte     the margin annotations
      NodeHandles.svelte  the four invisible anchor points every node gets
```

The one structural decision worth defending: **`diagram.js` and `content.js`
never mention each other's concerns.** They're joined only by shared ids. An
architect can rewrite every description in `content.js` without being able to
break the layout, and you can move a box without touching a word of prose.
It also means `content.js` can become a CMS fetch or a folder of Markdown
later without changing anything else.

---

## Step 1 — Everything is a node, including the containers

Svelte Flow has no separate concept of a "container". The purple Client
Experience panel is a node; so are the four boxes inside it. Nesting is
declared on the *child*:

```js
{ id: 'bcsc-app', type: 'box', parentId: 'client-experience', position: { x: 18, y: 110 }, ... }
```

Two rules that will bite you if you don't know them:

1. **A parent must appear before its children in the `nodes` array.** Svelte
   Flow builds the tree in a single pass; a child that arrives first is
   silently orphaned.
2. **A child's `position` is relative to its parent's top-left corner**, not to
   the canvas. So the whole zone moves as one unit when you nudge the parent.

`extent: 'parent'` clamps a child inside its parent's bounds. It only matters
while dragging is enabled, but it's cheap insurance against a stray edit.

### Where the model and the picture disagree

`BCSC / CSSO` spans *both* the Authentication and Identity Resolution groups,
because it does both jobs. It can't be a child of either, so it's a child of
the Backing Services zone with an explicit `zIndex` that floats it above the
two group boxes.

This is worth calling out because it's the general case: **nesting in Svelte
Flow is a containment claim, and the layout has to be able to honour it.**
When something genuinely straddles two groups, parent it to the nearest common
ancestor and position it manually rather than fighting the tree.

---

## Step 2 — Custom node components own their entire appearance

Register them once, by string key:

```js
const nodeTypes = { zone: ZoneNode, group: GroupNode, box: BoxNode, note: NoteNode };
```

Each component receives `data` (whatever you put in the node object) and
`selected` (managed by the library — use it for the focus ring). Variants are
data, not new components: `data.dashed`, `data.stacked`, `data.titleAlign`.
Four node types cover this entire diagram.

Svelte Flow paints a default border, background and padding on every node
wrapper. Strip those once in `app.css` rather than fighting them per-component:

```css
.svelte-flow__node { border: none; background: transparent; padding: 0; }
```

The annotations being nodes rather than absolutely-positioned DOM is a small
thing that pays off immediately — they pan and zoom with the diagram for free.

---

## Step 3 — Handles are anchor points, not connectors

Edges attach to handles. In an editor you'd show them as draggable dots; here
they exist only so an edge can say *leave from the right, arrive at the top*
instead of letting the library pick. Every node gets eight — a source and a
target on each side — from one shared component:

```svelte
<Handle type="source" id="s{key}" {position} isConnectable={false} />
<Handle type="target" id="t{key}" {position} isConnectable={false} />
```

Then hide them globally in `app.css` (`opacity: 0`), and reference them by id:

```js
{ source: 'lob-apps', sourceHandle: 'sr', target: 'bff', targetHandle: 'tl', type: 'smoothstep' }
```

If you skip handles entirely, edges still render — they just float to whatever
side Svelte Flow prefers, which on a hand-composed diagram looks wrong
immediately.

---

## Step 4 — Making thin lines clickable

This is the part people usually get wrong. A 1.5px stroke is a miserable click
target. Svelte Flow solves it for you with **`interactionWidth`** — an
invisible wider path rendered under each edge:

```js
{ ...edge, interactionWidth: 24 }
```

Set it on every edge (`diagram.js` maps it over the whole array so you can't
forget one), then give hover and selection a visible response in CSS:

```css
.svelte-flow__edge:hover .svelte-flow__edge-path { stroke: #2563eb; stroke-width: 2.5; }
```

Bidirectional connectors are just `markerStart` **and** `markerEnd`. Dashed
lines are `stroke-dasharray` in the edge's `style` string — no special edge
type needed.

---

## Step 5 — Wiring the modal

```svelte
onnodeclick={({ node }) => select(node.id)}
onedgeclick={({ edge }) => select(edge.id)}
onpaneclick={() => onselect(null)}
```

Note the **destructured object** argument — `{ node, event }`, not
`(event, node)`. That's a Svelte Flow v1 difference from React Flow, and it's
the single most common thing to trip on when porting an example across.

Two behaviours worth knowing:

- **Clicks don't bubble from child node to parent node.** Svelte Flow renders
  all nodes as flat siblings in the DOM, positioned absolutely. Clicking
  `BCeID` fires once, for `BCeID`. You get correct behaviour without any
  `stopPropagation`.
- **Look up content, don't require it.** `select()` ignores ids with no entry
  in `content.js`, so decorative nodes never pop an empty panel. Adding
  detail to something is a matter of adding a key — no wiring.

---

## Step 6 — `fitView` and the measurement race

The `fitView` **prop** runs on mount, before text-sized nodes (the
annotations, which have a width but no fixed height) have been measured. It
fits to bounds that are too small and the diagram overflows the viewport.

The reliable version waits for measurement:

```js
const { fitView } = useSvelteFlow();
const nodesInitialized = useNodesInitialized();

$effect(() => {
  if (nodesInitialized.current && !hasFit) { hasFit = true; fitView({ padding: 0.06 }); }
});
```

Both hooks read from context, so they only work **inside** a
`<SvelteFlowProvider>` — not in the component that renders it. That's the only
reason `Diagram.svelte` is split out from `App.svelte`.

---

## Step 7 — State

```js
let nodes = $state.raw(initialNodes);
let edges = $state.raw(initialEdges);
```

`$state.raw`, not `$state`. Svelte Flow reassigns these arrays on every pan,
selection and measurement pass. Deep reactivity would wrap every node object
in a proxy and you'd feel it while panning. `bind:nodes` still works — the
library replaces the array wholesale rather than mutating in place.

---

## Extending it

This build covers Client Experience, the Event Stream, Business Domains and
Backing Services. **Data Services and Connectivity are the same three
patterns** — a `zone`, a dashed `group` inside it, `box` children — so they're
copy-and-adjust rather than new work:

```js
zone('data-services', 'Data Services', { x: 0, y: 360 }, 435, 315, '#3b82f6', '#e7f0fe'),
{ id: 'data-mesh', type: 'group', parentId: 'data-services',
  position: { x: 12, y: 55 }, width: 205, height: 195,
  data: { label: 'Data Mesh', dashed: true }, zIndex: 1 },
box('compute', 'Compute', 'data-services', { x: 24, y: 105 }, 90, 42),
```

**Positioning workflow:** set `nodesDraggable={true}` in `Diagram.svelte`, drag
things where you want them, then read the coordinates back out
(`console.log(JSON.stringify(nodes.map(n => [n.id, n.position])))`) and paste
them into `diagram.js`. Much faster than guessing pixel values.

**Deep links** are a ~10-line addition and worth it for a diagram people will
cite in meetings: read `location.hash` on mount to set `openId`, and push the
id to the hash whenever the modal opens. Now `…/#event-stream` opens the
diagram with that panel already up.

**Static hosting** — `npm run build` produces a `dist/` folder with no server
requirement. Drop it on GitHub Pages, Netlify, or any static bucket.
