/**
 * CONTENT ONLY — no coordinates, no styling.
 *
 * Keys match node ids and edge ids in diagram.js. Anything missing from this
 * map simply doesn't open a modal, which is what you want for decorative
 * elements. Keeping this file separate is the whole trick: an architect can
 * edit it without ever touching layout code, and you could swap it for a CMS
 * fetch or a folder of Markdown files later without changing anything else.
 */

export const content = {
  // ── Zones ────────────────────────────────────────────────────────────────
  'client-experience': {
    kind: 'Zone',
    title: 'Client Experience',
    body: `Everything a member of the public or a staff user actually sees. This is the only layer permitted to present an end-user interface.

Service UX here is constrained by the platform rather than by convention: compliance checking is automated, and assistive AI is trained against the published design standards, so teams cannot ship an experience that silently diverges.`,
    facts: [
      ['Owner', 'Digital Experience Division'],
      ['Presents UI', 'Yes — exclusively'],
      ['Talks to', 'Event Stream only']
    ],
    links: [{ label: 'BC Design System', href: '#' }]
  },

  'business-domains': {
    kind: 'Zone',
    title: 'Business Domains',
    body: `Line-of-business capability, owned by the ministry that owns the policy. Domains publish and consume events; they never render UI.

Architecture Decision Records for a domain live with that domain's applications, not in a central repository.`,
    facts: [
      ['Owner', 'Individual ministries'],
      ['Presents UI', 'No'],
      ['ADRs', 'Co-located with the LoB application']
    ]
  },

  'backing-services': {
    kind: 'Zone',
    title: 'Backing Services',
    body: `Shared, centrally-operated capability that domains consume rather than rebuild. Treated as commodity: a domain team should never be writing its own notification dispatcher or document renderer.`,
    facts: [
      ['Owner', 'Platform Services'],
      ['Consumption model', 'Self-serve, API-first'],
      ['SLA', 'Tiered per service']
    ]
  },

  // ── Boxes ────────────────────────────────────────────────────────────────
  'event-stream': {
    kind: 'Backbone',
    title: 'Event Stream',
    body: `The spine of the architecture, and the boundary between what the public sees and what it doesn't.

Carries both life events (birth, death, change of address, incarceration) and administrative events (application submitted, eligibility re-assessed). Downstream systems elect how — and whether — to respond. Critically, a consumer can only decode the events it is entitled to see, so subscribing to the stream is not the same as being authorised to read it.`,
    facts: [
      ['Delivery', 'At-least-once'],
      ['Payload', 'Encrypted per-consumer'],
      ['Schema registry', 'Mandatory']
    ]
  },

  'digital-gateway': {
    kind: 'Component',
    title: 'Single Digital Gateway',
    body: `The service portal and navigation root — the canonical front door to government services. Owns wayfinding and service discovery, not service delivery itself.`,
    facts: [
      ['Type', 'Web application'],
      ['Auth', 'BC Services Card / BCeID']
    ]
  },

  'bcsc-app': {
    kind: 'Component',
    title: 'BC Services Card Mobile App',
    body: `Native mobile client. Doubles as the authenticator for the BC Services Card identity, and as the wallet for verifiable credentials issued by government.`,
    facts: [
      ['Platforms', 'iOS, Android'],
      ['Roles', 'Authenticator, credential wallet']
    ]
  },

  'service-delivery': {
    kind: 'Component',
    title: 'Service Delivery Experience',
    body: `Where an applicant actually transacts — form-filling, upload, status tracking. Composed from domain BFFs but presented under a single consistent shell.`
  },

  'unified-gov': {
    kind: 'Principle',
    title: 'Unified Government Experience',
    body: `A binding constraint rather than a component: whatever the channel, the experience should read as one government. The three clients beneath it inherit shared navigation, shared design tokens, and shared accessibility conformance.`
  },

  'lob-apps': {
    kind: 'Component',
    title: 'LoB Business Applications',
    body: `The systems of record for each line of business. Deliberately drawn as a stack — there are many, they vary enormously in age and technology, and the architecture does not require them to converge.

Architecture Decision Records live here, with the team that has to live with the consequences.`,
    facts: [
      ['Count', 'Many (per-ministry)'],
      ['Convergence required', 'No'],
      ['ADRs', 'Yes — co-located']
    ]
  },

  bff: {
    kind: 'Component',
    title: 'Service Provision Journey BFFs',
    body: `Backend-for-frontend per service journey. Aggregates whatever a single journey needs from domain systems and backing services, and publishes journey milestones back to the event stream.

One BFF per journey, not per application — the unit of design is the thing a person is trying to accomplish.`,
    facts: [
      ['Granularity', 'One per service journey'],
      ['Publishes events', 'Yes'],
      ['Presents UI', 'No']
    ]
  },

  mcp: {
    kind: 'Interface',
    title: 'MCP',
    body: `Model Context Protocol surface. Exposes domain capability to AI agents under the same authorisation rules as any other consumer — an agent is a client, not an exception.

Drawn dashed because it is an emerging interface rather than a settled commitment.`,
    facts: [
      ['Status', 'Emerging'],
      ['Authorisation', 'Same as human clients']
    ]
  },

  'bcsc-csso': {
    kind: 'Component',
    title: 'BCSC / CSSO',
    body: `BC Services Card combined with the Common Single Sign-On service. Spans both Authentication and Identity Resolution because it does both jobs: it proves who you are, and it resolves you to a durable identifier.`,
    facts: [
      ['Assurance', 'Up to LOA3'],
      ['Serves', 'Authentication and identity resolution']
    ]
  },

  entra: { kind: 'Component', title: 'Entra', body: 'Workforce identity for internal staff.' },
  bceid: {
    kind: 'Component',
    title: 'BCeID',
    body: 'Business and basic identity for organisations and lower-assurance citizen use.'
  },
  onehealthid: {
    kind: 'Component',
    title: 'OneHealthID',
    body: 'Health-sector identity resolution — clinician and patient identifiers.'
  },
  'ai-systems': { kind: 'Component', title: 'AI Systems', body: 'Shared model hosting, evaluation and guardrail tooling.' },
  'doc-gen': { kind: 'Component', title: 'Document Generation', body: 'Templated correspondence and statutory document rendering.' },
  notifications: { kind: 'Component', title: 'Notifications & Messaging', body: 'Email, SMS and in-app delivery with per-channel preference handling.' },
  'app-hosting': { kind: 'Component', title: 'Application Hosting', body: 'Managed container platform and the paved road onto it.' },
  workflows: { kind: 'Component', title: 'Automated Workflows', body: 'Long-running orchestration and human-in-the-loop task routing.' },
  'verified-creds': { kind: 'Component', title: 'Verified Credentials', body: 'Issuance and verification of digital credentials held in the citizen wallet.' },

  // ── Groups ───────────────────────────────────────────────────────────────
  'auth-group': {
    kind: 'Capability',
    title: 'Authentication',
    body: 'Proving that a party is who they claim to be. Three providers, chosen by audience rather than by team preference.'
  },
  'identity-group': {
    kind: 'Capability',
    title: 'Identity Resolution',
    body: 'Resolving an authenticated party to the right durable record, including across sectors that historically kept separate identifiers.'
  },

  // ── Edges ────────────────────────────────────────────────────────────────
  'ce-events': {
    kind: 'Connection',
    title: 'Client Experience ↔ Event Stream',
    body: `Bidirectional and, notably, the *only* path between the client layer and everything else. Client applications publish user-initiated events and subscribe to the ones they are entitled to decode.

There is no direct call from a screen to a line-of-business system.`,
    facts: [
      ['Direction', 'Bidirectional'],
      ['Protocol', 'Event stream'],
      ['Bypass permitted', 'No']
    ]
  },
  'bff-events': {
    kind: 'Connection',
    title: 'BFFs → Event Stream',
    body: 'Journey BFFs publish milestone and administrative events. Dashed because it is asynchronous — nothing blocks on the publish.',
    facts: [['Direction', 'Publish'], ['Synchronous', 'No']]
  },
  'bff-backing': {
    kind: 'Connection',
    title: 'BFFs → Backing Services',
    body: 'Direct, authenticated calls to shared platform capability. The one place a domain reaches sideways rather than through the stream.',
    facts: [['Direction', 'Request/response'], ['Synchronous', 'Yes']]
  },
  'lob-bff': {
    kind: 'Connection',
    title: 'LoB Applications → BFFs',
    body: 'Domain systems of record expose capability to the journey BFF that needs it. Solid because it is a synchronous, contracted API call.',
    facts: [['Direction', 'Request/response'], ['Contract', 'OpenAPI, versioned']]
  },
  'bff-mcp': {
    kind: 'Connection',
    title: 'BFFs → MCP',
    body: 'The BFF exposes its journey capability over MCP so agents can act on a citizen\'s behalf without a bespoke integration per agent.',
    facts: [['Status', 'Emerging']]
  }
};
