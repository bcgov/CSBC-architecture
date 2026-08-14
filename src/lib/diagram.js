import { MarkerType, Position } from '@xyflow/svelte';

/**
 * LAYOUT ONLY. What each thing *means* lives in content.js, keyed by the same id.
 *
 * Two rules from Svelte Flow that shape this file:
 *
 *  1. A parent node MUST appear before its children in this array.
 *  2. A child's `position` is relative to its parent's top-left corner,
 *     not to the canvas.
 *
 * Everything is `draggable: false` because this is a published diagram, not an
 * editor. Flip that in App.svelte while you're nudging things into place, then
 * paste the new coordinates back here.
 */

const zone = (id, label, position, width, height, accent, fill, titleAlign = 'top') => ({
  id,
  type: 'zone',
  position,
  width,
  height,
  data: { label, accent, fill, titleAlign },
  draggable: false,
  zIndex: 0
});

const box = (id, label, parentId, position, width, height, extra = {}) => ({
  id,
  type: 'box',
  parentId,
  extent: parentId ? 'parent' : undefined,
  position,
  width,
  height,
  data: { label, ...extra },
  draggable: false
});

export const initialNodes = [
  // ── Client Experience ────────────────────────────────────────────────────
  zone('client-experience', 'Client Experience', { x: 500, y: 20 }, 530, 205, '#8b5cf6', '#f3effe'),
  box('unified-gov', 'Unified Government Experience', 'client-experience', { x: 18, y: 52 }, 492, 44),
  box('bcsc-app', 'BC Services Card Mobile App', 'client-experience', { x: 18, y: 110 }, 132, 74),
  box('digital-gateway', 'Single Digital Gateway (service portal, navigation root)', 'client-experience', { x: 160, y: 110 }, 172, 74),
  box('service-delivery', 'Service Delivery Experience', 'client-experience', { x: 342, y: 110 }, 168, 74),

  // ── Event Stream (top-level, deliberately not inside any zone) ───────────
  box('event-stream', 'Event Stream', null, { x: 518, y: 252 }, 530, 36, { dashed: true }),

  // ── Business Domains ─────────────────────────────────────────────────────
  zone('business-domains', 'Business Domains', { x: 476, y: 360 }, 415, 205, '#3b82f6', '#e7f0fe', 'bottom'),
  box('lob-apps', 'LoB Business Applications', 'business-domains', { x: 20, y: 26 }, 158, 84, {
    sublabel: 'ADRs live here',
    stacked: true
  }),
  box('bff', 'Service Provision Journey BFFs', 'business-domains', { x: 232, y: 22 }, 152, 76, { stacked: true }),
  box('mcp', 'MCP', 'business-domains', { x: 328, y: 128 }, 62, 60, { dashed: true }),

  // ── Backing Services ─────────────────────────────────────────────────────
  zone('backing-services', 'Backing Services', { x: 935, y: 310 }, 465, 480, '#14b8a6', '#dcfaf6'),

  // Groups render behind the boxes that overlap them, hence the explicit zIndex.
  {
    id: 'auth-group',
    type: 'group',
    parentId: 'backing-services',
    extent: 'parent',
    position: { x: 45, y: 62 },
    width: 160,
    height: 238,
    data: { label: 'Authentication' },
    draggable: false,
    zIndex: 1
  },
  {
    id: 'identity-group',
    type: 'group',
    parentId: 'backing-services',
    extent: 'parent',
    position: { x: 248, y: 62 },
    width: 175,
    height: 238,
    data: { label: 'Identity Resolution' },
    draggable: false,
    zIndex: 1
  },

  // BCSC / CSSO deliberately spans BOTH groups, so it is a child of the zone
  // rather than of either group. Nesting is a containment claim — don't make
  // one the layout can't honour.
  { ...box('bcsc-csso', 'BCSC / CSSO', 'backing-services', { x: 58, y: 118 }, 355, 46), zIndex: 2 },
  { ...box('entra', 'Entra', 'backing-services', { x: 58, y: 180 }, 136, 44), zIndex: 2 },
  { ...box('bceid', 'BCeID', 'backing-services', { x: 58, y: 238 }, 136, 44), zIndex: 2 },
  { ...box('onehealthid', 'OneHealthID', 'backing-services', { x: 261, y: 180 }, 150, 44), zIndex: 2 },

  box('ai-systems', 'AI Systems', 'backing-services', { x: 92, y: 312 }, 136, 48),
  box('doc-gen', 'Document Generation', 'backing-services', { x: 240, y: 312 }, 136, 48),
  box('notifications', 'Notifications & Messaging', 'backing-services', { x: 92, y: 370 }, 136, 48),
  box('app-hosting', 'Application Hosting', 'backing-services', { x: 240, y: 370 }, 136, 48),
  box('workflows', 'Automated Workflows', 'backing-services', { x: 92, y: 428 }, 136, 48),
  box('verified-creds', 'Verified Credentials', 'backing-services', { x: 240, y: 428 }, 136, 48),

  // ── Annotations ──────────────────────────────────────────────────────────
  {
    id: 'note-ux',
    type: 'note',
    position: { x: 1050, y: 22 },
    width: 350,
    data: {
      label:
        'Service UX is constrained by the tech - compliance checking is automated. AI is trained on design standards.'
    },
    draggable: false,
    selectable: false
  },
  {
    id: 'note-events',
    type: 'note',
    position: { x: 1050, y: 228 },
    width: 355,
    data: {
      label:
        'Event stream contains both life events and administrative events, downstream systems elect how to respond and can only "decode" events they should.'
    },
    draggable: false,
    selectable: false
  },
  {
    id: 'note-below',
    type: 'note',
    position: { x: 160, y: 240 },
    width: 345,
    data: { label: 'Nothing below the Event Stream presents an end-user facing UI' },
    draggable: false,
    selectable: false
  }
];

const arrow = { type: MarkerType.ArrowClosed, width: 14, height: 14 };

export const initialEdges = [
  // Bidirectional: markerStart AND markerEnd.
  {
    id: 'ce-events',
    source: 'client-experience',
    sourceHandle: 'sb',
    target: 'event-stream',
    targetHandle: 'tt',
    type: 'straight',
    markerEnd: { ...arrow, color: '#7c3aed' },
    markerStart: { ...arrow, color: '#7c3aed' },
    style: 'stroke: #7c3aed; stroke-width: 2;'
  },
  {
    id: 'bff-events',
    source: 'bff',
    sourceHandle: 'st',
    target: 'event-stream',
    targetHandle: 'tb',
    type: 'smoothstep',
    markerEnd: arrow,
    style: 'stroke: #4b5563; stroke-width: 1.5; stroke-dasharray: 5 4;'
  },
  {
    id: 'bff-backing',
    source: 'bff',
    sourceHandle: 'sr',
    target: 'backing-services',
    targetHandle: 'tl',
    type: 'smoothstep',
    markerEnd: arrow,
    style: 'stroke: #4b5563; stroke-width: 1.5; stroke-dasharray: 5 4;'
  },
  {
    id: 'lob-bff',
    source: 'lob-apps',
    sourceHandle: 'sr',
    target: 'bff',
    targetHandle: 'tl',
    type: 'smoothstep',
    markerEnd: arrow,
    style: 'stroke: #4b5563; stroke-width: 1.5;'
  },
  {
    id: 'bff-mcp',
    source: 'bff',
    sourceHandle: 'sb',
    target: 'mcp',
    targetHandle: 'tt',
    type: 'smoothstep',
    markerEnd: arrow,
    style: 'stroke: #4b5563; stroke-width: 1.5; stroke-dasharray: 5 4;'
  }
].map((edge) => ({
  ...edge,
  // Widens the invisible click target around each line to 24px so thin
  // strokes are still comfortably clickable. This is the single most
  // important prop for making edges feel interactive.
  interactionWidth: 24,
  selectable: true
}));

export { Position };
