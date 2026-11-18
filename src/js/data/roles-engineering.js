(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  const ENGINEERING_QUESTIONS = {
    'Backend Java Developer': [
      {
        id: 'bjd-01',
        role: 'Backend Java Developer',
        category: 'System Design',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'A core REST API suddenly receives 10× its normal traffic and p99 latency spikes. How would you investigate the bottleneck and keep the service reliable?',
        context: 'Interviewers want a disciplined diagnostic order rather than a random list of scaling tools.',
        hint: 'Start with telemetry (latency, error rate, saturation), isolate whether the bottleneck is JVM, DB, or downstream, then discuss targeted fixes and trade-offs.',
        concepts: [
          { label: 'Metrics & tracing', terms: ['metrics', 'tracing', 'latency', 'p95', 'p99', 'telemetry', 'observability'] },
          { label: 'Profiling', terms: ['profiling', 'profiler', 'thread dump', 'cpu', 'thread pool'] },
          { label: 'Database analysis', terms: ['database', 'slow query', 'index', 'indexes', 'connection pool', 'db'] },
          { label: 'Caching strategy', terms: ['caching', 'cache', 'redis', 'ttl', 'invalidation'] },
          { label: 'Load balancing', terms: ['load balanc', 'horizontal', 'autoscal', 'scale out', 'replicas'] },
          { label: 'Rate limiting', terms: ['rate limit', 'throttl', 'load shed', 'circuit breaker', 'backpressure'] }
        ],
        answer: 'I would start by establishing a baseline from application telemetry: request rate, error rate, p95/p99 latency, JVM CPU and memory, thread pools, and database connection pools. Using distributed tracing and logs, I would pinpoint whether time is being spent in the JVM, a slow downstream dependency, or the database.\n\nIf database reads are saturated, I would inspect slow queries, missing indexes, and pool sizing before adding a cache with a clear TTL and invalidation rule. For sustained traffic, I would scale stateless instances horizontally behind a load balancer and protect critical endpoints with rate limiting or graceful load shedding.\n\nBefore rolling out changes broadly, I would run a representative load test, monitor error budgets during deployment, and keep a clean rollback path. Adding caching blindly before proving the database is the bottleneck often introduces stale-data bugs without solving the real issue.'
      },
      {
        id: 'bjd-02',
        role: 'Backend Java Developer',
        category: 'Java & JVM',
        difficulty: 'Entry level',
        estimatedMinutes: 4,
        question: 'A Java service gradually slows down over six hours even though request volume remains flat. How would you diagnose a suspected memory or garbage collection issue?',
        context: 'Show how you move from an observed symptom to concrete heap evidence.',
        hint: 'Compare heap retention after major GC cycles, review GC logs, capture a heap dump, and confirm root cause before tuning JVM flags.',
        concepts: [
          { label: 'Heap trend', terms: ['heap', 'old gen', 'memory usage', 'retention', 'allocation'] },
          { label: 'Garbage collection', terms: ['garbage collection', 'gc pause', 'gc logs', 'g1', 'zgc', 'major gc'] },
          { label: 'Heap dump', terms: ['heap dump', 'jmap', 'mat', 'visualvm', 'jfr', 'flight recorder'] },
          { label: 'Memory leak causes', terms: ['memory leak', 'unbounded cache', 'static', 'reference', 'listener', 'retained'] },
          { label: 'Soak verification', terms: ['soak test', 'reproduce', 'verify', 'stabilis', 'stabiliz', 'monitor'] }
        ],
        answer: 'First, I would correlate heap usage, GC pause duration, allocation rate, CPU, and request latency across the six-hour window. If post-GC heap usage climbs steadily without returning to baseline, objects are likely being retained rather than freed.\n\nNext, I would inspect GC logs and capture a heap dump or Java Flight Recorder profile from an affected node to inspect dominator trees and retaining references. Common culprits include unbounded in-memory caches, static collections, unclosed streams, or listeners that never deregister.\n\nOnce the retention bug is fixed, I would run a soak test under steady traffic to confirm memory flattens out after repeated collections. I would only adjust collector settings or heap flags after eliminating code-level retention and measuring real allocation patterns.'
      },
      {
        id: 'bjd-03',
        role: 'Backend Java Developer',
        category: 'Databases & Concurrency',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'Two concurrent API requests attempt to debit the same account balance at the same moment. How would you prevent lost updates while keeping the endpoint safe under retries?',
        context: 'Prioritise financial correctness first, then address contention, deadlocks, and client retries.',
        hint: 'Define the transaction boundary, compare optimistic vs pessimistic locking, and explain idempotency keys for retried writes.',
        concepts: [
          { label: 'Transactions', terms: ['transaction', 'acid', 'atomic', 'isolation'] },
          { label: 'Optimistic locking', terms: ['optimistic', 'version', 'compare-and-swap', 'cas'] },
          { label: 'Pessimistic locking', terms: ['pessimistic', 'select for update', 'row lock', 'lock order'] },
          { label: 'Conflict & retry', terms: ['retry', 'conflict', 'deadlock', 'backoff', 'timeout'] },
          { label: 'Idempotency', terms: ['idempoten', 'duplicate request', 'unique key', 'deduplicat'] }
        ],
        answer: 'I would wrap the balance read, validation, and update inside a single database transaction with an appropriate isolation level. Under moderate contention, optimistic locking using a version column works well: the UPDATE checks the expected version and, if zero rows are updated, the application retries cleanly with a bounded backoff.\n\nFor hot accounts with heavy contention, a short pessimistic row lock (SELECT ... FOR UPDATE) avoids excessive retry churn, at the trade-off of lower concurrency and a need for lock timeouts and consistent lock ordering to avoid deadlocks.\n\nAt the API layer, I would require an idempotency key stored in a unique table constraint so network retries cannot debit the account twice. I would validate the flow with concurrent integration tests simulating race conditions and mid-flight failures.'
      },
      {
        id: 'bjd-04',
        role: 'Backend Java Developer',
        category: 'Architecture',
        difficulty: 'Senior level',
        estimatedMinutes: 6,
        question: 'Your team plans to extract services out of a large Spring Boot monolith. How do you define service boundaries and avoid ending up with a distributed monolith?',
        context: 'Senior answers balance domain boundaries, incremental migration, operational overhead, and team ownership.',
        hint: 'Focus on business capabilities and data ownership first, then cover strangler-fig migration, async contracts, and operational readiness.',
        concepts: [
          { label: 'Bounded contexts', terms: ['bounded context', 'domain', 'business capability', 'cohesion'] },
          { label: 'Data ownership', terms: ['data ownership', 'own database', 'shared table', 'schema'] },
          { label: 'Incremental migration', terms: ['strangler', 'incremental', 'gradual', 'canary', 'shadow'] },
          { label: 'Async & consistency', terms: ['event', 'asynchronous', 'eventual consistency', 'outbox', 'saga', 'distributed transaction'] },
          { label: 'Observability & resilience', terms: ['observability', 'tracing', 'timeout', 'circuit breaker', 'ownership', 'slo'] }
        ],
        answer: 'I would avoid slicing by technical layer and instead map business capabilities and bounded contexts where rules, vocabulary, and change cadence belong together. Each extracted service must own its data exclusively; sharing tables across services creates tight coupling and recreates a distributed monolith.\n\nBefore splitting anything, I would confirm whether a modular monolith solves the team bottleneck with less operational cost. When extraction is justified, I would use the strangler-fig pattern: introduce a clean contract, shadow or route a small share of traffic, verify parity, and migrate incrementally.\n\nFor cross-service workflows, I would prefer asynchronous domain events with an outbox pattern and idempotent consumers instead of synchronous chains or distributed two-phase commits. Structured logging, distributed tracing, strict timeouts, and clear service ownership need to exist from day one.'
      }
    ],

    'Frontend Developer': [
      {
        id: 'fe-01',
        role: 'Frontend Developer',
        category: 'Web Performance',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'A customer-facing web app feels sluggish on initial load on mid-range mobile devices. How would you diagnose the bottleneck and prioritise fixes?',
        context: 'Connect user-perceived speed to measurable lab and field signals.',
        hint: 'Reference Core Web Vitals (LCP, INP, CLS), real-user vs throttled profiling, bundle splitting, asset optimisation, and regression checks.',
        concepts: [
          { label: 'Core Web Vitals', terms: ['lcp', 'inp', 'cls', 'web vitals', 'fcp', 'ttfb'] },
          { label: 'Measurement & profiling', terms: ['measure', 'lighthouse', 'devtools', 'rum', 'real user', 'throttl', 'profil'] },
          { label: 'Bundle & code splitting', terms: ['bundle', 'code split', 'dynamic import', 'tree shak', 'lazy load'] },
          { label: 'Assets & network', terms: ['image', 'webp', 'avif', 'preload', 'font', 'cache', 'cdn', 'network'] },
          { label: 'Main-thread rendering', terms: ['main thread', 'render', 'hydration', 'third-party', 'long task'] }
        ],
        answer: 'I would start by measuring real-user metrics (LCP, INP, TTFB) segmented by device and connection speed, then reproduce on a throttled mid-tier mobile profile in DevTools. That tells us whether the bottleneck is server latency, render-blocking assets, oversized JavaScript, or main-thread execution.\n\nIf JavaScript parse and execution dominate, I would audit the bundle, split route-level and heavy below-the-fold modules, and defer non-critical third-party scripts. For LCP, I would prioritise the hero image with proper dimensions, modern formats, and fetchpriority while eliminating unnecessary web font blocking.\n\nAfter each targeted change, I would compare lab traces and watch field percentiles post-release, adding a CI performance budget so regressions get caught early. I avoid blanket memoisation unless profiling proves wasted re-renders.'
      },
      {
        id: 'fe-02',
        role: 'Frontend Developer',
        category: 'Async UI & React',
        difficulty: 'Entry level',
        estimatedMinutes: 4,
        question: 'A live search input fires an API call on every keystroke and occasionally overwrites fresh results with an older, slower response. How would you fix this reliably?',
        context: 'Address both request volume and out-of-order network responses.',
        hint: 'Cover debouncing, AbortController or request sequence IDs, explicit UI states, and cleanup on unmount.',
        concepts: [
          { label: 'Debouncing', terms: ['debounce', 'delay', 'throttle', 'keystroke'] },
          { label: 'Request cancellation', terms: ['abortcontroller', 'abort', 'cancel', 'signal'] },
          { label: 'Race condition guard', terms: ['race condition', 'stale', 'out of order', 'request id', 'latest'] },
          { label: 'UI states', terms: ['loading', 'empty', 'error state', 'cleared', 'fallback'] },
          { label: 'Cleanup & testing', terms: ['cleanup', 'unmount', 'test', 'slow network'] }
        ],
        answer: 'First, I would debounce the input by roughly 250–300ms so we only query after a brief pause in typing, reducing unnecessary load on the backend. To prevent out-of-order responses from corrupting the UI, I would pass an AbortController signal to fetch and abort the previous in-flight request inside the effect cleanup whenever the query changes or the component unmounts.\n\nAs an extra safeguard, tracking a monotonically increasing request ID ensures only the response matching the latest query updates state. When the input is cleared, I cancel any active request and reset results immediately.\n\nFinally, I would render clear loading, empty, and error states—ignoring AbortError as an expected cancellation—and test fast typing over throttled networks to confirm stale results never flash on screen.'
      },
      {
        id: 'fe-03',
        role: 'Frontend Developer',
        category: 'Accessibility',
        difficulty: 'Mid level',
        estimatedMinutes: 4,
        question: 'You inherit a custom dropdown built with divs that works with a mouse but breaks for keyboard and screen reader users. How would you remediate it?',
        context: 'Treat accessibility as core interaction design, not a last-minute ARIA patch.',
        hint: 'Evaluate native <select> first, then walk through keyboard patterns, focus management, ARIA roles/states, and assistive-tech testing.',
        concepts: [
          { label: 'Native HTML first', terms: ['native', 'select', 'semantic', 'button', 'html'] },
          { label: 'Keyboard navigation', terms: ['keyboard', 'arrow', 'escape', 'enter', 'space', 'tab', 'home'] },
          { label: 'Focus management', terms: ['focus', 'focus-visible', 'roving', 'active descendant', 'trap'] },
          { label: 'ARIA semantics', terms: ['aria', 'aria-expanded', 'aria-controls', 'listbox', 'role', 'label'] },
          { label: 'Manual & AT testing', terms: ['screen reader', 'voiceover', 'nvda', 'contrast', 'test'] }
        ],
        answer: 'My first question would be whether a native <select> element satisfies the UX requirements—native controls give consistent keyboard, mobile, and screen reader behaviour for free. If custom styling or rich option content requires a custom combobox or listbox, I would rebuild the trigger as a real <button> and follow the WAI-ARIA Authoring Practices.\n\nThat includes opening with Enter/Space/Arrow keys, navigating options with Up/Down/Home/End, closing on Escape, returning focus cleanly to the trigger, and wiring aria-expanded, aria-controls, aria-activedescendant, and accessible labels accurately.\n\nI would also verify visible focus outlines, colour contrast, and 200% zoom behaviour. Automated tools like axe catch basic issues, so I would test keyboard-only flows and verify announcements in VoiceOver or NVDA before signing off.'
      },
      {
        id: 'fe-04',
        role: 'Frontend Developer',
        category: 'Frontend Architecture',
        difficulty: 'Senior level',
        estimatedMinutes: 6,
        question: 'A growing React application has 40+ screens and teams keep introducing stale-data and synchronisation bugs. How would you establish clear state-management boundaries?',
        context: 'Focus on durable team conventions and state ownership rather than arguing for one library.',
        hint: 'Separate local UI state, URL state, server cache, and shared client state. Discuss invalidation, ownership, and onboarding conventions.',
        concepts: [
          { label: 'State taxonomy', terms: ['local state', 'url state', 'server state', 'shared state', 'client state'] },
          { label: 'Server cache & sync', terms: ['cache', 'invalidation', 'deduplicat', 'stale', 'react query', 'swr', 'source of truth'] },
          { label: 'URL shareability', terms: ['url', 'query param', 'search param', 'refresh', 'bookmark', 'filter'] },
          { label: 'Ownership & conventions', terms: ['ownership', 'convention', 'document', 'code review', 'boundary', 'colocat'] },
          { label: 'Trade-offs & migration', terms: ['trade-off', 'migration', 'incremental', 'duplicat', 'complexity'] }
        ],
        answer: 'I would classify state by lifetime, ownership, and whether it comes from the server. Ephemeral UI state like modal toggles or form drafts stays colocated inside components. State that should survive a reload or be shareable—filters, sorting, pagination, active tab—belongs in the URL.\n\nRemote server data should live in a dedicated server-state cache with explicit query keys, background refresh, and mutation invalidation rather than being copied into a global Redux or Context store, which creates duplicate sources of truth. True global client state should be reserved for genuinely cross-cutting concerns like authenticated user session or workspace preferences.\n\nTo make this stick across teams, I would document lightweight decision rules with concrete examples, add lint or PR review checklists, and migrate high-churn screens incrementally rather than pausing product work for a full rewrite.'
      }
    ],

    'Full Stack Developer': [
      {
        id: 'fs-01',
        role: 'Full Stack Developer',
        category: 'End-to-End Design',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'Design a document upload and viewing flow for user profiles from browser to storage. How do you keep uploads reliable and files properly secured?',
        context: 'Cover UX, API contract, storage architecture, authorisation, and failure recovery.',
        hint: 'Discuss client + server validation, direct object storage with pre-signed URLs, access checks, progress/retry UX, and orphan cleanup.',
        concepts: [
          { label: 'API contract & validation', terms: ['api contract', 'validation', 'mime', 'content-type', 'file size', 'allowlist'] },
          { label: 'Object storage', terms: ['object storage', 's3', 'blob', 'bucket', 'metadata'] },
          { label: 'Signed URLs & authz', terms: ['signed url', 'presigned', 'permission', 'authori', 'access control', 'ownership'] },
          { label: 'Upload UX', terms: ['progress', 'retry', 'cancel', 'duplicate', 'loading'] },
          { label: 'Failure & security', terms: ['malware', 'scan', 'cleanup', 'orphan', 'timeout', 'error handling'] }
        ],
        answer: 'First, I would define the API contract: accepted file types, max size, error codes, and metadata schema. On the frontend, I would validate file type and size immediately for fast feedback, display upload progress, prevent duplicate clicks, and support cancellation or retry.\n\nBecause client validation is never a security boundary, the backend must re-verify file size, magic bytes/content type, and user permissions. Rather than streaming large binaries through application servers into a SQL database, I would issue short-lived pre-signed URLs to upload directly to private object storage, store metadata and owner IDs in the database, and serve downloads via authorised short-lived signed URLs.\n\nI would handle partial or abandoned uploads with a background lifecycle cleanup policy, scan untrusted files asynchronously if required, and test cross-user authorisation boundaries alongside normal upload paths.'
      },
      {
        id: 'fs-02',
        role: 'Full Stack Developer',
        category: 'Debugging',
        difficulty: 'Entry level',
        estimatedMinutes: 4,
        question: 'A feature works reliably on your laptop but fails immediately after deploying to production. Walk through your debugging process step by step.',
        context: 'Demonstrate a calm, repeatable isolation workflow instead of guessing.',
        hint: 'Check impact and rollback option, compare environment configs/migrations, trace a single failing request end-to-end, and add a regression test.',
        concepts: [
          { label: 'Impact & triage', terms: ['reproduce', 'impact', 'rollback', 'severity', 'release'] },
          { label: 'Environment diff', terms: ['environment variable', 'config', 'secret', 'feature flag', 'migration', 'version'] },
          { label: 'Request tracing', terms: ['network', 'logs', 'trace', 'request id', 'console', 'stack trace'] },
          { label: 'Layer isolation', terms: ['frontend', 'api', 'backend', 'database', 'cors', 'cache'] },
          { label: 'Fix & prevention', terms: ['staging', 'regression test', 'verify', 'monitor'] }
        ],
        answer: 'First, I would assess user impact—if a critical path is broken, rolling back the release takes priority over live debugging. Next, I would capture an exact failing request with status code, request ID, and timestamp.\n\nThen I would compare local and production differences systematically: environment variables, secrets, runtime versions, CORS or proxy headers, build flags, and pending database migrations. Following the request ID from the browser Network tab through API logs and database queries isolates which boundary is failing.\n\nOnce reproduced in staging, I would apply the smallest safe fix, add an automated regression test covering the missed condition, and watch error rates and key user flows after redeployment to confirm recovery.'
      },
      {
        id: 'fs-03',
        role: 'Full Stack Developer',
        category: 'Authentication & Security',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'You are building session authentication for a web app with an API backend. How would you handle tokens, refresh flows, and protection against common web attacks?',
        context: 'Explain concrete security trade-offs rather than repeating buzzwords.',
        hint: 'Compare HttpOnly cookies vs localStorage, short-lived access tokens + rotating refresh tokens, CSRF/XSS defences, and logout revocation.',
        concepts: [
          { label: 'Cookie storage', terms: ['httponly', 'secure', 'samesite', 'cookie', 'localstorage'] },
          { label: 'Token lifecycle', terms: ['access token', 'refresh token', 'expir', 'rotation', 'revocation', 'session'] },
          { label: 'XSS & CSRF defence', terms: ['xss', 'csrf', 'csp', 'content security policy', 'origin'] },
          { label: 'Logout & compromise', terms: ['logout', 'revoke', 'blacklist', 'invalidate', 'compromise'] },
          { label: 'Rate limit & audit', terms: ['rate limit', 'brute force', 'audit', 'logging', 'mfa'] }
        ],
        answer: 'I would store session identifiers or tokens in HttpOnly, Secure, SameSite cookies rather than localStorage, because any XSS vulnerability can read localStorage directly. If using JWT access tokens, I would keep them short-lived (for example 10–15 minutes) paired with server-tracked rotating refresh tokens so sessions can be revoked on logout or suspicious reuse.\n\nWith cookies, CSRF protection becomes essential, so I would combine SameSite=Lax/Strict with origin checks or anti-CSRF tokens on state-changing requests, alongside strict Content Security Policy headers and output encoding to mitigate XSS.\n\nI would rate-limit login and refresh endpoints, avoid leaking whether an email exists in error messages, and write integration tests verifying expired sessions, refresh rotation, and revoked-token rejection.'
      },
      {
        id: 'fs-04',
        role: 'Full Stack Developer',
        category: 'API Evolution',
        difficulty: 'Senior level',
        estimatedMinutes: 6,
        question: 'A single backend API serves web, iOS, Android, and internal tools. How do you evolve the contract safely without forcing synchronised releases across teams?',
        context: 'Balance fast product iteration with backwards compatibility for older mobile clients.',
        hint: 'Discuss additive evolution, expand-and-contract migrations, schema/contract tests, deprecation telemetry, and clear ownership.',
        concepts: [
          { label: 'Backwards compatibility', terms: ['backwards compat', 'backward compat', 'additive', 'non-breaking', 'expand'] },
          { label: 'Versioning & deprecation', terms: ['versioning', 'deprecat', 'sunset', 'older client', 'mobile'] },
          { label: 'Contract testing', terms: ['contract test', 'schema', 'openapi', 'consumer', 'ci'] },
          { label: 'Idempotency & errors', terms: ['idempoten', 'pagination', 'error code', 'rate limit', 'timeout'] },
          { label: 'Observability & comms', terms: ['telemetry', 'usage', 'documentation', 'changelog', 'ownership'] }
        ],
        answer: 'I would design the contract around domain capabilities rather than mirroring one frontend screen. By default, changes should be additive and backwards-compatible—new optional fields instead of renaming or removing fields in place—because mobile users often stay on older app versions for months.\n\nWhen a breaking change is unavoidable, I would use an expand-and-contract workflow or explicit versioned endpoints, publish a clear deprecation timeline, and track client-version telemetry so we know when old consumers have actually migrated before retiring legacy fields.\n\nTo prevent accidental breakage, I would enforce OpenAPI or schema diff checks and consumer contract tests in CI, keep pagination and error envelopes consistent across endpoints, and pair releases with clear changelogs and owner contacts.'
      }
    ],

    'QA Automation Engineer': [
      {
        id: 'qa-01',
        role: 'QA Automation Engineer',
        category: 'Test Strategy',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'An end-to-end UI suite takes 45 minutes in CI, fails intermittently, and still misses production bugs. How would you overhaul the test strategy?',
        context: 'Confidence and fast feedback matter far more than raw UI test count.',
        hint: 'Audit escaped defects, shift logic down the test pyramid, quarantine/fix flaky tests, parallelise CI, and track meaningful quality metrics.',
        concepts: [
          { label: 'Test pyramid', terms: ['test pyramid', 'unit test', 'api test', 'integration', 'contract test'] },
          { label: 'Risk-based E2E', terms: ['critical journey', 'risk-based', 'smoke', 'e2e', 'end-to-end'] },
          { label: 'Flaky test ownership', terms: ['flaky', 'quarantine', 'ownership', 'root cause', 'trust'] },
          { label: 'CI speed & parallel', terms: ['parallel', 'ci', 'pipeline', 'feedback time', 'shard'] },
          { label: 'Quality metrics', terms: ['escaped defect', 'coverage', 'failure rate', 'metric', 'measure'] }
        ],
        answer: 'I would start by analysing recent production escapes alongside CI failure logs to see which risks lack coverage and which UI tests merely duplicate business rules better checked lower down. Moving validation and edge cases into fast unit, component, and API tests immediately cuts runtime while raising signal.\n\nI would keep a focused, reliable set of end-to-end tests strictly for critical revenue and user journeys, run them in parallel across CI shards, and separate a fast PR smoke gate from broader nightly regressions. Flaky tests erode team trust, so I would track flake rates, assign owners to fix timing or data issues, and avoid papering over instability with blind retries.\n\nSuccess would be measured by shorter PR feedback time, lower flake rate, and fewer escaped defects in critical flows—not by total test count.'
      },
      {
        id: 'qa-02',
        role: 'QA Automation Engineer',
        category: 'Test Reliability',
        difficulty: 'Entry level',
        estimatedMinutes: 4,
        question: 'An automated browser test passes 100% locally but fails randomly in CI. How would you investigate and eliminate the flakiness?',
        context: 'Zero in on timing, shared state, data setup, and environment differences.',
        hint: 'Inspect CI artefacts (trace, video, console/network logs), replace fixed sleeps with explicit waits, isolate test data, and stress-test in a loop.',
        concepts: [
          { label: 'CI diagnostics', terms: ['logs', 'screenshot', 'trace', 'video', 'console', 'network'] },
          { label: 'Explicit waits', terms: ['explicit wait', 'sleep', 'timeout', 'assertion', 'condition', 'locator'] },
          { label: 'Data & test isolation', terms: ['isolation', 'test data', 'unique', 'cleanup', 'parallel', 'order'] },
          { label: 'Race conditions', terms: ['race condition', 'async', 'timing', 'animation', 'hydration'] },
          { label: 'Repeat verification', terms: ['repeat', 'burn-in', 'loop', 'reproduc', 'retries'] }
        ],
        answer: 'First, I would inspect the exact CI failure artefacts—Playwright/Cypress traces, screenshots, browser console errors, and network responses—rather than guessing from the error message alone. Environment speed, viewport size, and parallel execution often expose timing bugs hidden on a fast local machine.\n\nNext, I would replace hard-coded sleeps with auto-retrying assertions or waits tied to observable UI or network readiness, use stable semantic or data-testid locators, and ensure every test provisions its own isolated test data so parallel runs cannot collide.\n\nAfter fixing the root cause, I would run the test 20–30 times consecutively under CI-like CPU constraints to verify determinism. Adding retries can mask a genuine app race condition, so retries should only be a temporary diagnostic safeguard, never the fix.'
      },
      {
        id: 'qa-03',
        role: 'QA Automation Engineer',
        category: 'API & Contract Testing',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'Backend services update schemas frequently and occasionally break frontend or mobile clients. How would you introduce API and contract testing without slowing teams down?',
        context: 'Show practical integration into developer workflows rather than heavy manual QA gates.',
        hint: 'Cover schema validation, consumer-driven contracts, mock verification, CI feedback on pull requests, and clear ownership.',
        concepts: [
          { label: 'Schema validation', terms: ['schema', 'openapi', 'json schema', 'payload', 'status code'] },
          { label: 'Contract testing', terms: ['contract test', 'pact', 'consumer', 'provider', 'breaking change'] },
          { label: 'CI integration', terms: ['ci', 'pull request', 'pipeline', 'fast feedback', 'automate'] },
          { label: 'Test data & mocks', terms: ['mock', 'stub', 'seed', 'fixture', 'deterministic'] },
          { label: 'Team adoption', terms: ['ownership', 'incremental', 'high-risk', 'documentation', 'developer'] }
        ],
        answer: 'I would start with the highest-churn or highest-impact API endpoints rather than trying to cover every route at once. At the provider side, automated OpenAPI schema diff checks and API integration tests in CI can catch unintended field removals, type changes, and error-contract regressions on every pull request.\n\nWhere multiple clients depend on one backend, consumer-driven contract tests let frontend or mobile teams specify the exact fields and status codes they rely on, which the backend pipeline verifies before merging—without needing a slow shared staging environment.\n\nTo keep adoption smooth, I would keep contract suites fast with deterministic fixtures, provide reusable templates for developers, and measure reduction in integration regressions across releases.'
      },
      {
        id: 'qa-04',
        role: 'QA Automation Engineer',
        category: 'Release Quality',
        difficulty: 'Senior level',
        estimatedMinutes: 6,
        question: 'How would you design a quality and release-confidence strategy for a product deploying to production multiple times a day?',
        context: 'Quality must be continuous and shared across engineering, not a manual end-of-sprint gate.',
        hint: 'Connect risk classification, layered automation, progressive delivery (feature flags/canaries), synthetic & real-user monitoring, and incident feedback loops.',
        concepts: [
          { label: 'Risk assessment', terms: ['risk', 'blast radius', 'criticality', 'impact', 'proportionate'] },
          { label: 'Layered CI checks', terms: ['unit', 'contract', 'integration', 'smoke', 'pipeline', 'ci'] },
          { label: 'Progressive delivery', terms: ['feature flag', 'canary', 'gradual rollout', 'rollback', 'blue-green'] },
          { label: 'Production observability', terms: ['monitoring', 'synthetic', 'alert', 'error rate', 'slo', 'latency'] },
          { label: 'Incident learning', terms: ['incident', 'postmortem', 'regression', 'shared ownership', 'feedback loop'] }
        ],
        answer: 'In continuous delivery, a manual pre-release QA bottleneck will not scale. Instead, I would align testing depth with change risk and blast radius: every PR runs fast unit, lint, and contract checks, while high-risk areas trigger targeted integration and critical-journey tests.\n\nBeyond pre-merge checks, release safety depends on progressive delivery—using feature flags, canary rollouts, and automated rollback triggers tied to error rate, latency, and key business funnels. Lightweight synthetic checks in production verify core sign-in and checkout paths continuously.\n\nWhenever an incident or escaped defect occurs, engineering and QA review it jointly to add the cheapest test layer that would have caught it and refine the risk checklist. Quality becomes a measurable engineering system rather than a last-minute sign-off.'
      }
    ],

    'DevOps Engineer': [
      {
        id: 'do-01',
        role: 'DevOps Engineer',
        category: 'Reliability & SRE',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'A production service breaches its latency SLO every evening during peak traffic. How do you mitigate the immediate risk and prevent recurrence?',
        context: 'Separate safe short-term stabilisation from durable root-cause remediation.',
        hint: 'Check SLIs and user impact first, inspect saturation and dependencies, apply safe mitigation, then address capacity/root cause and document follow-ups.',
        concepts: [
          { label: 'SLIs & SLOs', terms: ['slo', 'sli', 'error budget', 'p95', 'p99', 'latency', 'error rate'] },
          { label: 'Saturation signals', terms: ['saturation', 'cpu', 'memory', 'queue', 'connection pool', 'downstream'] },
          { label: 'Immediate mitigation', terms: ['mitigat', 'scale', 'load shed', 'rate limit', 'rollback', 'canary'] },
          { label: 'Autoscaling & limits', terms: ['autoscal', 'hpa', 'resource limit', 'warm-up', 'capacity'] },
          { label: 'Root cause & postmortem', terms: ['root cause', 'load test', 'postmortem', 'alert', 'owner'] }
        ],
        answer: 'First, I would quantify user impact through SLIs—p95/p99 latency, error rate, and error-budget burn—and check whether a recent deployment or dependency slowdown coincides with peak hours. Next, I would examine saturation signals across compute, thread/connection pools, queues, and downstream databases.\n\nFor immediate mitigation, I would pre-scale capacity ahead of the predictable evening ramp or shed non-critical background work, while checking whether autoscaling triggers are reacting too slowly or hitting resource ceilings. Once stable, I would correlate traces to fix the underlying hotspot—such as slow queries or cold starts—and validate under a load test matching peak concurrency.\n\nFinally, I would document the findings in a blameless review with named owners for capacity planning, refined alerting thresholds, and scheduled scaling rules.'
      },
      {
        id: 'do-02',
        role: 'DevOps Engineer',
        category: 'CI/CD',
        difficulty: 'Entry level',
        estimatedMinutes: 4,
        question: 'A deployment pipeline fails right after the test stage, yet deploying the app manually succeeds. How do you debug and fix the pipeline?',
        context: 'Compare both execution paths methodically and avoid turning manual deploys into a habit.',
        hint: 'Inspect failing step logs/exit code, diff environment/secrets/IAM permissions/build artefacts, reproduce in an isolated container, and verify rollback.',
        concepts: [
          { label: 'Logs & exit codes', terms: ['logs', 'exit code', 'failing step', 'stderr', 'output'] },
          { label: 'Environment & secrets', terms: ['environment', 'secret', 'variable', 'credential', 'token', 'config'] },
          { label: 'Permissions & network', terms: ['permission', 'iam', 'role', 'firewall', 'vpc', 'network'] },
          { label: 'Artifact parity', terms: ['artifact', 'artefact', 'image', 'build', 'version', 'digest'] },
          { label: 'Reproducible pipeline', terms: ['reproduc', 'container', 'rollback', 'manual', 'validation'] }
        ],
        answer: 'I would begin with the exact failing stage in the CI logs, capturing the command, exit code, and inputs. Next, I would systematically diff the pipeline runner against the manual environment: runtime versions, environment variables, injected secrets, IAM/deploy permissions, network egress rules, and the exact build artifact or container digest.\n\nA common mistake is that the manual deploy uses cached local credentials or a slightly different artifact. I would reproduce the pipeline command inside a clean container matching the CI image to confirm the exact discrepancy.\n\nOnce fixed, I would verify an automated deploy and rollback in a non-production environment and add a pre-deploy validation check for required config or credentials. Manual deployments can serve as an emergency break-glass step, never as the ongoing workflow.'
      },
      {
        id: 'do-03',
        role: 'DevOps Engineer',
        category: 'Containers & Kubernetes',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'Pods in a Kubernetes deployment start restarting with OOMKilled after a routine release. How would you triage, stabilise, and prevent this?',
        context: 'Look beyond blindly doubling memory limits—check app behaviour, requests/limits, and rollout guards.',
        hint: 'Check rollout status and rollback if customer-facing, inspect pod events/metrics/previous logs, compare memory requests vs limits, and tune probes/budgets.',
        concepts: [
          { label: 'Triage & rollback', terms: ['rollback', 'rollout', 'describe', 'events', 'previous logs', 'crashloop'] },
          { label: 'Memory analysis', terms: ['oomkilled', 'memory limit', 'memory leak', 'working set', 'heap', 'metrics'] },
          { label: 'Requests & limits', terms: ['requests', 'limits', 'jvm', 'cgroup', 'vpa', 'right-siz'] },
          { label: 'Probes & availability', terms: ['readiness', 'liveness', 'pdb', 'disruption budget', 'maxunavailable'] },
          { label: 'Prevention in CI', terms: ['load test', 'alert', 'canary', 'baseline', 'regression'] }
        ],
        answer: 'First, if user-facing availability is degraded, I would roll back the deployment to restore service immediately while preserving diagnostics from one failing pod. Using pod events, container exit code 137, previous logs, and memory working-set graphs, I would verify whether memory spiked immediately on startup or climbed steadily under traffic.\n\nNext, I would check recent code or dependency changes for memory regressions and confirm runtime memory settings—such as JVM heap limits respecting container cgroup limits—rather than blindly raising Kubernetes limits and hiding a leak.\n\nTo prevent future outages, I would ensure memory requests and limits reflect measured peak usage with sensible headroom, configure readiness probes and PodDisruptionBudgets, and add memory-usage checks during staging load tests or canary rollouts.'
      },
      {
        id: 'do-04',
        role: 'DevOps Engineer',
        category: 'Infrastructure as Code',
        difficulty: 'Senior level',
        estimatedMinutes: 6,
        question: 'Your organisation manages cloud infrastructure mostly by hand and wants to adopt Infrastructure as Code. How would you lead the migration safely?',
        context: 'Show pragmatic sequencing, state safety, drift detection, and team enablement.',
        hint: 'Cover resource inventory, remote state/locking/secrets, small reusable modules, PR plan reviews, low-risk pilot import, and drift detection.',
        concepts: [
          { label: 'Inventory & scope', terms: ['inventory', 'audit', 'owner', 'dependency', 'pilot', 'low-risk'] },
          { label: 'State & secrets', terms: ['state', 'locking', 'remote backend', 'backup', 'secrets', 'access control'] },
          { label: 'Modular design', terms: ['module', 'reusable', 'pattern', 'abstraction', 'environment'] },
          { label: 'Plan & policy review', terms: ['plan', 'code review', 'policy', 'ci', 'promotion', 'approval'] },
          { label: 'Drift & incrementalism', terms: ['drift', 'import', 'incremental', 'rollback', 'runbook'] }
        ],
        answer: 'I would start with an inventory of critical cloud resources, owners, and blast radius rather than attempting a big-bang rewrite. Before importing anything, I would establish foundational guardrails: encrypted remote state with locking, backup policies, least-privilege CI roles, and strict separation of secrets from code.\n\nNext, I would pick a low-risk non-production service as a pilot, import existing resources cleanly, and verify a zero-diff plan before enabling automated plan-on-PR reviews and policy checks. I would build small, well-documented modules around real recurring patterns instead of over-engineering a giant wrapper upfront.\n\nAs teams adopt IaC incrementally, I would schedule automated drift detection alerts, restrict ad-hoc console edits in production, and document recovery procedures. The goal is safer, auditable changes—not 100% conversion overnight.'
      }
    ]
  };

  SmartPrep.EngineeringQuestions = ENGINEERING_QUESTIONS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENGINEERING_QUESTIONS;
  }
})(typeof window !== 'undefined' ? window : globalThis);
