'use strict';

/*
  SmartPrep — offline interview practice.
  Questions and model answers are hand-curated. The transparent evaluator is
  rule-based and runs entirely in the browser; no API or network calls are used.
*/

const QUESTION_BANK = {
  'Backend Java Developer': [
    {
      category: 'SYSTEM DESIGN', difficulty: 'MID LEVEL',
      question: 'Imagine a REST API that handles a sudden 10× increase in traffic. How would you investigate the bottleneck and keep the service reliable?',
      context: 'We’re looking for a calm, structured approach — not just a list of tools.',
      hint: 'Walk through how you would measure first, isolate the bottleneck, and choose a fix. Mention trade-offs rather than jumping straight to caching.',
      keywords: ['metrics', 'profiling', 'database', 'caching', 'load balancing', 'rate limiting', 'monitoring'],
      answer: 'I would start by establishing a baseline and checking request latency, throughput, error rate, CPU, memory, thread pools, and database connections. I would use distributed tracing and application metrics to identify whether the bottleneck is in the JVM, a downstream service, or the database.\n\nIf reads are the issue, I would consider caching frequently accessed data with a clear TTL and invalidation strategy. I would also review slow queries and indexes, and check whether connection pools are sized appropriately. At the infrastructure level, I would add horizontal capacity behind a load balancer and use rate limiting to protect the service from overload.\n\nI would load-test the proposed change, monitor p95/p99 latency and error rates during rollout, and keep a rollback path ready. I would avoid adding caching before confirming that the database is actually the bottleneck.'
    },
    {
      category: 'JAVA FUNDAMENTALS', difficulty: 'FOUNDATION',
      question: 'A Java service becomes slower over several hours, even though request volume stays roughly the same. How would you investigate a possible memory or garbage-collection issue?',
      context: 'The interviewer wants to hear how you move from a symptom to evidence.',
      hint: 'Talk about heap behaviour over time, GC logs, a heap dump, and how you would confirm the root cause before changing JVM flags.',
      keywords: ['heap', 'garbage collection', 'GC logs', 'heap dump', 'memory leak', 'profiling', 'metrics'],
      answer: 'I would first compare heap usage, allocation rate, GC pause time, CPU, and request latency over the same time window. A heap that keeps growing after major collections can indicate objects are being retained unexpectedly, while frequent long pauses may point to allocation pressure or an unsuitable heap configuration.\n\nI would enable or inspect GC logs and use a profiler or heap dump to identify which object types are consuming memory and who is retaining them. I would check common causes such as unbounded caches, collections that keep references, listeners that are never removed, and large request objects.\n\nAfter fixing the underlying retention or allocation problem, I would run a soak test with representative traffic and verify that post-GC heap usage stabilises and latency improves. I would only tune the collector or JVM flags after measuring the workload.'
    },
    {
      category: 'DATABASES', difficulty: 'MID LEVEL',
      question: 'Two requests try to update the same account balance at almost the same time. How would you prevent lost updates and keep the operation safe?',
      context: 'Think about correctness first, then performance and failure handling.',
      hint: 'Explain the transaction boundary, a concurrency-control approach, and what happens when a conflict or retry occurs.',
      keywords: ['transaction', 'isolation', 'optimistic locking', 'pessimistic locking', 'version', 'retry', 'idempotency'],
      answer: 'I would keep the read, validation, and balance update inside one database transaction. The right concurrency strategy depends on contention. With optimistic locking, I would add a version column and update only when the version still matches; if another request has changed the row, the update affects zero rows and the application can retry safely.\n\nFor a highly contended account, a short pessimistic row lock using SELECT FOR UPDATE may be more appropriate, though it can reduce throughput and needs careful timeout handling. I would use a consistent lock order to reduce deadlocks and keep transactions short.\n\nAt the API boundary, I would also consider an idempotency key so a client retry does not apply the same payment or adjustment twice. I would test concurrent updates and verify that the final balance is correct under retries and failures.'
    },
    {
      category: 'SPRING BOOT', difficulty: 'SENIOR LEVEL',
      question: 'You are splitting a large Spring Boot application into services. How would you decide service boundaries and avoid creating a distributed monolith?',
      context: 'A senior answer should show boundaries, migration judgement, and operational awareness.',
      hint: 'Start with business capabilities and data ownership. Then discuss migration sequence, communication, observability, and the cost of distributed transactions.',
      keywords: ['bounded context', 'domain', 'data ownership', 'deployment', 'events', 'observability', 'distributed transaction'],
      answer: 'I would not split the application by technical layers. I would first map the business capabilities and look for bounded contexts with cohesive rules, language, and data ownership. A service should own its data and expose a business-focused contract rather than sharing tables with other services.\n\nI would look at change frequency, team ownership, scaling needs, and failure boundaries before choosing a split. For migration, I would use a strangler approach: extract one capability behind an API or event contract, route a small amount of traffic, compare behaviour, and expand gradually.\n\nI would prefer asynchronous events for workflows that do not need an immediate response, design consumers to be idempotent, and make eventual consistency explicit. I would avoid pretending a cross-service transaction is a normal database transaction. Tracing, structured logs, service-level indicators, timeouts, retries with backoff, and clear ownership would be part of the design from the start.'
    }
  ],
  'Frontend Developer': [
    {
      category: 'PERFORMANCE', difficulty: 'MID LEVEL',
      question: 'A React page feels slow on first load, especially on mobile. How would you find the cause and improve the experience?',
      context: 'A good answer connects what the user feels to what you can measure.',
      hint: 'Mention real-user or lab measurements, bundle analysis, network costs, rendering, and how you would verify the improvement.',
      keywords: ['LCP', 'bundle', 'code splitting', 'lazy loading', 'network', 'rendering', 'measurement'],
      answer: 'I would first measure rather than guess. I would inspect Core Web Vitals, especially LCP and INP, using real-user data and a mobile throttled profile. In DevTools I would check whether the delay comes from the server response, large assets, JavaScript execution, or expensive rendering.\n\nIf the bundle is too large, I would analyse it and split routes or heavy components with dynamic imports. I would lazy-load below-the-fold content, optimise images with responsive formats and dimensions, and reduce unnecessary third-party scripts. I would also check whether the page blocks rendering on non-critical JavaScript or fonts.\n\nAfter each change, I would compare the same metrics on a representative device and watch real-user data after release. I would avoid adding memoisation everywhere unless profiling shows repeated work is the problem.'
    },
    {
      category: 'REACT', difficulty: 'FOUNDATION',
      question: 'A search box sends a request on every keystroke and sometimes shows results for an older query. How would you fix it?',
      context: 'The key is to handle both request volume and out-of-order responses.',
      hint: 'Consider debouncing, cancellation or request identity, loading states, and what should happen when the query is cleared.',
      keywords: ['debounce', 'AbortController', 'race condition', 'cleanup', 'loading state', 'stale response'],
      answer: 'I would debounce the input so a request is sent only after the user pauses typing, perhaps around 250–300 milliseconds. That reduces unnecessary network calls. In a React effect, I would either abort the previous fetch with AbortController during cleanup or track a request identifier and ignore responses that are no longer current.\n\nI would also handle loading, empty, and error states explicitly. If the query becomes empty, I would cancel any in-flight request and clear the results. The important detail is that the UI should only render a response that belongs to the latest query, so a slower earlier request cannot overwrite newer results.\n\nI would test fast typing, slow networks, clearing the field, and unmounting the component to make sure there are no stale updates.'
    },
    {
      category: 'ACCESSIBILITY', difficulty: 'MID LEVEL',
      question: 'You inherit a custom dropdown that works with a mouse but is difficult to use with a keyboard or screen reader. What would you change?',
      context: 'Show that accessibility is part of the interaction design, not a final polish step.',
      hint: 'Discuss native controls first, then keyboard behaviour, focus management, semantics, and testing with assistive technology.',
      keywords: ['native select', 'keyboard', 'focus', 'ARIA', 'screen reader', 'contrast', 'testing'],
      answer: 'I would first ask whether a native select can meet the design need. Native controls provide familiar keyboard and assistive-technology behaviour with much less custom code. If a custom listbox is necessary, I would follow the correct interaction pattern: arrow-key navigation, Home and End, Enter or Space to select, Escape to close, and predictable focus management.\n\nI would use semantic roles and states such as aria-expanded, aria-controls, and aria-selected only where appropriate, and make sure the trigger has an accessible name. I would not add ARIA to compensate for incorrect HTML. I would also check focus visibility, colour contrast, zoom, and touch targets.\n\nFinally, I would test with keyboard-only navigation and at least one screen reader, alongside automated checks. Accessibility is not proven by a passing automated scan alone.'
    },
    {
      category: 'STATE MANAGEMENT', difficulty: 'SENIOR LEVEL',
      question: 'A frontend application has grown to dozens of screens and teams keep introducing state bugs. How would you decide what belongs in local, URL, server, or shared state?',
      context: 'The interviewer is looking for a maintainable rule of thumb, not a favourite library.',
      hint: 'Separate ownership and lifetime of state. Talk about URL shareability, server cache, local UI state, and team conventions.',
      keywords: ['ownership', 'URL state', 'server state', 'local state', 'cache', 'invalidation', 'conventions'],
      answer: 'I would classify state by ownership, lifetime, and whether it needs to be shared. Ephemeral UI state such as an open menu or an input draft usually belongs close to the component. State that should survive refreshes or be shareable, such as filters, pagination, and selected tabs, often belongs in the URL.\n\nRemote data should have a clear server-state strategy with caching, loading and error states, deduplication, and invalidation after mutations. I would avoid copying server data into a global store unless there is a specific reason, because duplicated sources of truth become difficult to synchronise. Shared client state should be reserved for genuinely cross-cutting information such as session or workflow state.\n\nI would document conventions, provide small examples, and make ownership explicit in code review. The goal is not one state library for everything; it is one predictable place for each kind of state.'
    }
  ],
  'Data Analyst': [
    {
      category: 'BUSINESS ANALYSIS', difficulty: 'MID LEVEL',
      question: 'A product manager says weekly sales are down 18%. How would you investigate whether this is a real business problem or a data issue?',
      context: 'Start by clarifying the metric. Then work from the broad signal toward a useful explanation.',
      hint: 'Define the metric and comparison window, validate the pipeline, segment the change, and communicate uncertainty.',
      keywords: ['metric definition', 'data quality', 'baseline', 'segmentation', 'seasonality', 'source', 'validation'],
      answer: 'I would first confirm what “sales” means: orders, gross revenue, net revenue, or recognised revenue, and make sure the comparison uses the same days and time zone. I would check the baseline, date range, filters, refunds, late-arriving data, and whether any source or tracking change happened.\n\nOnce the number is validated, I would segment it by product, channel, geography, customer type, and device to see where the decline is concentrated. I would compare traffic, conversion rate, average order value, and cancellations to understand which part of the funnel changed. I would also check seasonality and campaigns before attributing the movement to a product change.\n\nI would share the evidence with a clear confidence level, separate facts from hypotheses, and recommend the next analysis or experiment. I would not present correlation as a proven cause.'
    },
    {
      category: 'SQL', difficulty: 'FOUNDATION',
      question: 'You have an orders table and a customers table. A report shows more orders after a join than before the join. What could be happening, and how would you debug it?',
      context: 'The interviewer wants to see whether you understand table grain and join cardinality.',
      hint: 'Check primary keys, duplicates, relationship cardinality, and row counts at each step. Avoid using DISTINCT to hide the problem.',
      keywords: ['grain', 'primary key', 'duplicate', 'cardinality', 'join', 'row count', 'validation'],
      answer: 'I would first identify the grain of each table. If customers is expected to have one row per customer but contains duplicate customer IDs, joining it to orders can multiply order rows. I would check whether the join key is unique and whether the relationship is one-to-one, one-to-many, or many-to-many.\n\nI would compare row counts before and after each join, count distinct order IDs, and inspect sample customer IDs that appear multiple times. I would also check for an incorrect join condition or a slowly changing dimension that needs an effective-date filter.\n\nI would fix the data model or define the correct deduplication/business rule before aggregating. Using DISTINCT as a quick fix can hide a data-quality issue and may remove legitimate records. I would add a validation check so the report catches unexpected row multiplication in the future.'
    },
    {
      category: 'EXPERIMENTATION', difficulty: 'MID LEVEL',
      question: 'An A/B test shows a 4% lift in conversion, but the result is not statistically significant. How would you explain this and decide what to do next?',
      context: 'Good analysis includes uncertainty and a decision that matches the cost of being wrong.',
      hint: 'Talk about sample size, confidence intervals, power, guardrail metrics, and avoiding repeated peeking.',
      keywords: ['sample size', 'confidence interval', 'statistical power', 'p-value', 'guardrail', 'duration', 'effect size'],
      answer: 'I would explain that the observed 4% lift is an estimate, not proof that the change caused an improvement. I would look at the confidence interval, p-value, pre-defined minimum detectable effect, and whether the experiment reached its planned sample size and duration. A non-significant result does not prove there is no effect; the test may simply be underpowered.\n\nI would check randomisation, sample-ratio mismatch, instrumentation, exposure rules, and guardrail metrics such as revenue, refunds, or retention. I would also confirm that the primary metric and analysis plan were defined before looking at results, rather than repeatedly checking until a result appears significant.\n\nIf the potential impact is meaningful and the cost of waiting is low, I would extend or redesign the experiment based on a power calculation. I would communicate the uncertainty and make a decision based on risk, not just the point estimate.'
    },
    {
      category: 'DASHBOARDS', difficulty: 'SENIOR LEVEL',
      question: 'Leadership wants one dashboard for every team. How would you design a reporting layer that stays consistent without flattening the needs of different teams?',
      context: 'This is about metric governance, self-service, and the trade-offs of centralisation.',
      hint: 'Discuss metric definitions, semantic layers, ownership, access, data freshness, and how you would keep dashboards actionable.',
      keywords: ['metric definitions', 'semantic layer', 'ownership', 'governance', 'data freshness', 'access control', 'self-service'],
      answer: 'I would start by agreeing on a small set of trusted business definitions for shared metrics such as active customer, conversion, and net revenue. I would document the grain, filters, exclusions, owner, and refresh expectation for each metric. A semantic layer or governed model can keep those definitions consistent while allowing teams to build their own views.\n\nI would separate executive-level outcomes from operational diagnostics. Each team should have a clear view of the decisions it needs to make, rather than one enormous dashboard. I would define ownership and a review process for metric changes, add data-quality checks, and show freshness or known limitations directly in the report.\n\nAccess control should follow data sensitivity and role needs. I would measure adoption and whether dashboards reduce repeated ad hoc questions, then retire reports that are unused or misleading. Consistency should make teams more independent, not force every team into the same workflow.'
    }
  ],
  'Full Stack Developer': [
    {
      category: 'API DESIGN', difficulty: 'MID LEVEL',
      question: 'You are building a feature that lets users upload profile documents and view them later. How would you design the frontend-to-backend flow?',
      context: 'Think end to end: user experience, API contract, storage, and failure cases.',
      hint: 'Cover validation, upload limits, object storage, permissions, progress/error states, and safe access to files.',
      keywords: ['validation', 'API contract', 'object storage', 'permissions', 'file size', 'error handling', 'signed URL'],
      answer: 'I would define an API contract first, including allowed file types, size limits, response shape, and clear error codes. On the frontend I would validate early for user experience, show upload progress, prevent accidental duplicate submissions, and provide retry and cancellation behaviour. The backend must repeat all validation because client-side checks are not a security boundary.\n\nI would store files in object storage rather than the application database, keep metadata and ownership in the database, and generate short-lived signed URLs for authorised downloads. I would enforce file size and content-type checks, inspect files where appropriate, and ensure a user can only access their own documents.\n\nI would design for failures such as a network interruption or storage timeout, clean up incomplete uploads, and log useful request IDs without exposing file contents. I would test permission boundaries and large-file behaviour as well as the happy path.'
    },
    {
      category: 'DEBUGGING', difficulty: 'FOUNDATION',
      question: 'A feature works on your machine but fails after deployment. What is your step-by-step debugging process?',
      context: 'Show a repeatable process rather than saying you would “check the logs”.',
      hint: 'Reproduce, compare environments, inspect a trace, isolate the layer, and verify a safe fix.',
      keywords: ['reproduce', 'logs', 'environment variables', 'network', 'database', 'rollback', 'regression test'],
      answer: 'I would first capture the exact failure, affected users, release version, and steps to reproduce. I would compare local and deployed configuration, including environment variables, secrets, feature flags, runtime versions, and database migrations.\n\nThen I would follow the request through the browser network panel, API logs, and backend traces to see whether the failure is in the frontend, API, dependency, or database. I would check recent changes and look for a reliable reproduction in a staging environment.\n\nOnce I identify the cause, I would make the smallest safe fix, add a regression test, and verify it in staging before releasing. If users are significantly affected, I would consider rolling back first while investigating. After release, I would watch error rates and key user flows to confirm the problem is resolved.'
    },
    {
      category: 'ARCHITECTURE', difficulty: 'SENIOR LEVEL',
      question: 'A new feature needs to work across web, mobile, and internal tools. How would you design the backend contract so teams can move independently?',
      context: 'A senior response balances stable contracts with room for product change.',
      hint: 'Talk about API boundaries, versioning, authentication, backwards compatibility, observability, and ownership.',
      keywords: ['contract', 'backwards compatibility', 'versioning', 'authentication', 'idempotency', 'documentation', 'observability'],
      answer: 'I would start with the domain capability and define a contract around user outcomes rather than mirroring one client’s screen structure. I would agree on request and response schemas, error semantics, authentication and authorisation rules, idempotency for retried writes, and clear ownership.\n\nI would prefer additive, backwards-compatible changes and use explicit versioning only when a breaking change cannot be avoided. Contract tests and representative consumer tests would catch accidental changes before release. I would publish examples and migration notes so web, mobile, and internal-tool teams can plan independently.\n\nI would also define rate limits, timeouts, pagination, and observability conventions. A stable API does not mean never changing; it means changes are intentional, communicated, measurable, and safe for existing consumers.'
    }
  ],
  'QA Automation Engineer': [
    {
      category: 'TEST STRATEGY', difficulty: 'MID LEVEL',
      question: 'A release has many UI tests, but production bugs still escape and the suite takes 45 minutes. How would you improve the test strategy?',
      context: 'The goal is confidence, not simply more tests.',
      hint: 'Discuss the test pyramid, flaky-test ownership, API/component coverage, risk-based selection, and feedback time.',
      keywords: ['test pyramid', 'unit tests', 'API tests', 'flaky tests', 'risk-based', 'CI', 'coverage'],
      answer: 'I would review failures and escaped defects to see which behaviours are not covered and which UI tests duplicate lower-level checks. I would move stable business-rule coverage toward unit and API tests, keep a smaller set of high-value end-to-end tests for critical user journeys, and use contract tests for service boundaries.\n\nI would classify flaky tests, track their failure rate, and assign ownership rather than repeatedly rerunning them. The CI pipeline should run a fast smoke and critical regression set on every change, with broader suites scheduled or triggered by risk. I would also parallelise independent tests and remove unnecessary waits.\n\nI would measure feedback time, escaped defects, flakiness, and coverage of critical risks instead of treating raw test count as quality. A faster, trustworthy suite is more useful than a large suite that teams learn to ignore.'
    },
    {
      category: 'AUTOMATION', difficulty: 'FOUNDATION',
      question: 'An automated test passes locally but fails randomly in CI. How would you investigate and make it reliable?',
      context: 'Think about timing, isolation, test data, and the environment.',
      hint: 'Mention reproducible evidence, explicit waits, deterministic data, parallel execution, and diagnostics.',
      keywords: ['logs', 'explicit wait', 'test data', 'isolation', 'race condition', 'screenshots', 'repeatability'],
      answer: 'I would first inspect the CI failure artefacts: logs, screenshots, browser console, network activity, and the exact build. I would rerun the test enough times to understand whether it is timing-related, data-dependent, or environment-specific.\n\nI would replace fixed sleeps with waits for an observable condition, make test data unique and deterministic, and ensure each test cleans up after itself. I would check for shared accounts or records that can collide during parallel runs, and remove dependencies on test order.\n\nOnce fixed, I would run the test repeatedly in CI-like conditions and keep useful diagnostics for future failures. I would not simply add retries as the solution, because retries can hide a race condition and make the suite look healthier than it is.'
    },
    {
      category: 'RELEASE QUALITY', difficulty: 'SENIOR LEVEL',
      question: 'How would you build a risk-based quality strategy for a product that releases multiple times a day?',
      context: 'The interviewer expects quality to be shared across engineering, not owned by a final QA gate.',
      hint: 'Connect risk analysis, automation layers, progressive delivery, production monitoring, and learning from incidents.',
      keywords: ['risk assessment', 'CI pipeline', 'contract tests', 'feature flags', 'canary', 'monitoring', 'incident learning'],
      answer: 'I would classify changes by user impact, data sensitivity, system criticality, and blast radius. Each change should have a proportionate test plan: fast unit and contract checks for all changes, integration coverage for affected boundaries, and end-to-end checks for critical workflows.\n\nI would integrate tests into CI with clear ownership and fast feedback, while using feature flags, canary releases, and automated rollback signals for higher-risk deployments. Production monitoring should include user-facing indicators such as error rate, latency, and conversion, not only infrastructure health.\n\nI would review incidents and escaped defects to update the risk model and add targeted regression coverage. The goal is a continuous feedback loop where developers, QA, and operations share responsibility for release confidence.'
    }
  ],
  'DevOps Engineer': [
    {
      category: 'RELIABILITY', difficulty: 'MID LEVEL',
      question: 'A service has started breaching its latency SLO during peak hours. What would you do first, and how would you prevent it happening again?',
      context: 'A good reliability answer distinguishes immediate mitigation from lasting prevention.',
      hint: 'Start with user impact and service indicators. Then talk about saturation, capacity, dependencies, and a follow-up action.',
      keywords: ['SLO', 'latency', 'saturation', 'metrics', 'capacity', 'autoscaling', 'postmortem'],
      answer: 'I would confirm the scope and user impact using the service-level indicators, especially p95/p99 latency and error rate, and check whether the SLO is currently at risk. I would look at saturation signals such as CPU, memory, queue depth, connection pools, and downstream latency.\n\nFor immediate mitigation I might scale capacity, reduce non-critical work, or apply load shedding, but only after identifying a safe action. I would verify that autoscaling policies and resource limits are not causing slow scale-up or contention.\n\nAfter service stabilises, I would correlate traces and deployment changes to find the root cause, run a representative load test, and update capacity planning or alert thresholds. I would document the incident and follow-up owners so the same peak-hour failure is less likely to recur.'
    },
    {
      category: 'CI/CD', difficulty: 'FOUNDATION',
      question: 'A deployment pipeline fails after the test stage, but the application works when deployed manually. How would you debug the pipeline?',
      context: 'Show how you would narrow down the difference between the two paths.',
      hint: 'Compare artefacts, credentials, environment, commands, permissions, and deployment steps. Avoid manually bypassing the pipeline as a permanent fix.',
      keywords: ['logs', 'environment', 'secrets', 'permissions', 'artifact', 'reproducible', 'rollback'],
      answer: 'I would start with the first failing pipeline step and inspect its logs, exit code, inputs, and generated artefacts. I would compare the pipeline environment with the manual deployment: runtime version, environment variables, secrets, permissions, network access, and the exact artifact being deployed.\n\nI would try to reproduce the step locally or in a disposable environment using the same command and configuration. I would check whether the pipeline is building a different artifact from the one used manually, or whether a required secret or permission is missing.\n\nAfter fixing the root cause, I would keep deployment repeatable through the pipeline, add a validation step where useful, and verify rollback behaviour. A manual workaround may restore service temporarily, but it should not become the normal release process.'
    },
    {
      category: 'INFRASTRUCTURE', difficulty: 'SENIOR LEVEL',
      question: 'Your organisation is moving from manually managed infrastructure to infrastructure as code. How would you lead the migration safely?',
      context: 'The strongest answers include a controlled adoption path and a way to detect drift.',
      hint: 'Discuss inventory, state management, modules, review controls, drift detection, and incremental adoption.',
      keywords: ['inventory', 'state', 'modules', 'drift detection', 'plan review', 'secrets', 'incremental migration'],
      answer: 'I would begin with an inventory of critical resources, owners, dependencies, and the current operational procedures. I would choose a tool and define state storage, locking, access controls, and secret handling before importing production resources.\n\nI would create small reusable modules around agreed patterns, but avoid building a large abstraction framework before teams have real usage. Changes would go through code review with a visible plan, policy checks, and environment promotion. I would start with a low-risk service, import existing resources carefully, and compare the planned state with reality before applying changes.\n\nI would add drift detection, state backup and recovery procedures, and clear ownership. The migration should be incremental, with rollback and incident procedures documented. The objective is repeatability and safer change, not merely converting every resource into code as quickly as possible.'
    }
  ],
  'Product Manager': [
    {
      category: 'PRIORITISATION', difficulty: 'MID LEVEL',
      question: 'Sales wants a feature urgently, engineering says the platform needs reliability work, and customers are asking for something else. How would you prioritise?',
      context: 'Show how you make a transparent decision when every stakeholder has a valid concern.',
      hint: 'Explain the objective, evidence, impact, effort, risk, and how you communicate what will not be done now.',
      keywords: ['business objective', 'customer impact', 'evidence', 'effort', 'risk', 'trade-off', 'communication'],
      answer: 'I would bring the discussion back to the current business objective and the cost of delaying each option. I would gather evidence: customer reach and severity, revenue opportunity, strategic value, engineering effort, operational risk, and any contractual commitments.\n\nI would make the trade-offs explicit rather than treating every request as equally urgent. If reliability work is protecting a critical workflow or preventing customer harm, it may be the highest-value choice even if it is less visible. I would compare options using a lightweight scoring approach, then validate assumptions with the relevant teams.\n\nI would communicate the decision, what is being deferred, why, and what evidence would cause us to revisit it. Prioritisation is an ongoing decision, not a one-time promise.'
    },
    {
      category: 'METRICS', difficulty: 'FOUNDATION',
      question: 'You launch a new onboarding flow. What would you measure to understand whether it is working?',
      context: 'The interviewer wants a clear link between product intent and measurable behaviour.',
      hint: 'Define the outcome, funnel steps, guardrails, segments, and a time window before looking at results.',
      keywords: ['activation', 'conversion rate', 'funnel', 'retention', 'guardrail', 'segmentation', 'baseline'],
      answer: 'I would start by defining what successful onboarding means for the product, such as reaching an activation event that predicts long-term value. I would measure the conversion rate through each funnel step, time to activation, and early retention, rather than relying only on completion of the final screen.\n\nI would also set guardrails such as support requests, error rate, and abandonment so a higher conversion rate does not hide a worse user experience. I would establish a baseline, segment by acquisition channel or device where relevant, and use a consistent measurement window.\n\nIf possible, I would compare the new flow with the old one through an experiment. I would review qualitative feedback alongside quantitative data to understand why users drop off, then prioritise the largest meaningful friction point.'
    },
    {
      category: 'STRATEGY', difficulty: 'SENIOR LEVEL',
      question: 'A product area has good usage but poor retention. How would you decide whether to improve the current experience, reposition it, or stop investing?',
      context: 'This is a strategy question: show how you separate activity from durable value.',
      hint: 'Discuss cohorts, user segments, jobs-to-be-done, opportunity cost, and explicit decision criteria.',
      keywords: ['cohort', 'retention', 'segments', 'customer problem', 'opportunity cost', 'hypothesis', 'decision criteria'],
      answer: 'I would first understand which users are returning, which are leaving, and when retention drops. Cohort analysis by acquisition source, use case, and customer segment can reveal whether the product is valuable to a specific audience but poorly positioned for others.\n\nI would combine behavioural data with interviews and support themes to understand the job users hired the product to do. Then I would test whether the retention problem comes from onboarding, product quality, missing capabilities, weak recurring value, or a mismatch in positioning.\n\nI would define decision criteria before committing more investment: a target segment, a retention outcome, a time horizon, and the evidence that would support continuing or stopping. I would compare the opportunity cost against other priorities and communicate the decision with clear assumptions. Usage alone is not proof of durable product value.'
    }
  ]
};

const LEVEL_EXPECTATIONS = {
  'Entry level': {
    depth: 'A clear explanation of the fundamentals and a sensible sequence of steps.',
    extra: ['basic reasoning', 'testing', 'clear steps']
  },
  'Mid level': {
    depth: 'Show ownership: explain trade-offs, failure cases, and how you would verify the result.',
    extra: ['trade-offs', 'failure handling', 'verification']
  },
  'Senior level': {
    depth: 'Show system-level judgement: constraints, risk, long-term operation, and why you chose one option over another.',
    extra: ['system-level trade-offs', 'risk', 'operational ownership']
  }
};

const state = {
  question: null,
  questionNumber: 0,
  lastEvaluation: null,
  toastTimer: null
};

const elements = {
  roleSelect: document.getElementById('roleSelect'),
  customRoleWrap: document.getElementById('customRoleWrap'),
  customRole: document.getElementById('customRole'),
  experienceSelect: document.getElementById('experienceSelect'),
  modePill: document.getElementById('modePill'),
  focusRole: document.getElementById('focusRole'),
  focusLevel: document.getElementById('focusLevel'),
  sessionNumber: document.getElementById('sessionNumber'),
  generateBtn: document.getElementById('generateBtn'),
  questionCategory: document.getElementById('questionCategory'),
  questionDifficulty: document.getElementById('questionDifficulty'),
  questionText: document.getElementById('questionText'),
  questionContext: document.getElementById('questionContext'),
  interviewerHint: document.getElementById('interviewerHint'),
  answerInput: document.getElementById('answerInput'),
  wordCount: document.getElementById('wordCount'),
  charCount: document.getElementById('charCount'),
  clearAnswerBtn: document.getElementById('clearAnswerBtn'),
  evaluateBtn: document.getElementById('evaluateBtn'),
  inlineMessage: document.getElementById('inlineMessage'),
  resultsSection: document.getElementById('resultsSection'),
  reviewSummary: document.getElementById('reviewSummary'),
  reviewMode: document.getElementById('reviewMode'),
  scoreRing: document.getElementById('scoreRing'),
  scoreValue: document.getElementById('scoreValue'),
  scoreLabel: document.getElementById('scoreLabel'),
  scoreDescription: document.getElementById('scoreDescription'),
  scoreScaleFill: document.getElementById('scoreScaleFill'),
  technicalScore: document.getElementById('technicalScore'),
  technicalBar: document.getElementById('technicalBar'),
  structureScore: document.getElementById('structureScore'),
  structureBar: document.getElementById('structureBar'),
  practicalScore: document.getElementById('practicalScore'),
  practicalBar: document.getElementById('practicalBar'),
  communicationScore: document.getElementById('communicationScore'),
  communicationBar: document.getElementById('communicationBar'),
  strengthList: document.getElementById('strengthList'),
  gapList: document.getElementById('gapList'),
  modelAnswerText: document.getElementById('modelAnswerText'),
  copyAnswerBtn: document.getElementById('copyAnswerBtn'),
  nextQuestionBtn: document.getElementById('nextQuestionBtn'),
  toast: document.getElementById('toast')
};

function getSelectedRole() {
  if (elements.roleSelect.value === 'custom') {
    return elements.customRole.value.trim() || 'Software Developer';
  }
  return elements.roleSelect.value;
}

function getQuestionPool(role) {
  if (QUESTION_BANK[role]) return QUESTION_BANK[role];
  // A custom role still receives a thoughtful general engineering/product prompt.
  return [
    {
      category: 'PROBLEM SOLVING', difficulty: 'MID LEVEL',
      question: `Tell me about a challenging problem you would expect to solve as a ${role}. How would you break it down, choose an approach, and know whether your solution worked?`,
      context: 'Use a real situation if you can. The interviewer is interested in your process as much as the outcome.',
      hint: 'Set the context, explain the options you considered, describe your decision, and finish with an observable result or lesson.',
      keywords: ['context', 'requirements', 'approach', 'trade-off', 'collaboration', 'testing', 'result'],
      answer: 'I would first clarify the problem, the user or business outcome, and any constraints such as time, quality, dependencies, or risk. I would break the work into smaller questions and gather evidence before deciding on an approach.\n\nI would compare realistic options, explain the trade-offs, and involve the people who own the relevant systems or decisions. I would choose the smallest approach that solves the important part of the problem without creating avoidable long-term cost.\n\nI would define how success will be measured, validate the solution with the right tests or feedback, and communicate progress and risks early. After delivery, I would review the result against the original goal and capture what I would improve next time.'
    },
    {
      category: 'SCENARIO', difficulty: 'MID LEVEL',
      question: `A project in your ${role} area is behind schedule and a key requirement is still unclear. What would you do in the next 24 hours?`,
      context: 'This prompt looks for prioritisation, communication, and calm execution under uncertainty.',
      hint: 'Clarify what is blocked, identify the decision owner, make risks visible, and propose a realistic next step.',
      keywords: ['clarify', 'scope', 'stakeholders', 'priority', 'risk', 'plan', 'communication'],
      answer: 'I would identify exactly which requirement is unclear and what work is blocked by it. I would gather the current understanding, list the assumptions, and speak with the decision owner or relevant stakeholders to resolve the highest-impact ambiguity.\n\nIn parallel, I would separate work that can safely continue from work that depends on the answer. I would make the schedule and delivery risks visible, propose options with their impact, and agree on a realistic priority rather than silently compressing quality.\n\nBy the end of the day I would aim to have a documented decision, a revised short-term plan, clear owners, and a communication point for the team. If the requirement remains unresolved, I would state the consequence and recommend the safest reversible path.'
    }
  ];
}

function updateSessionDetails() {
  const role = getSelectedRole();
  const level = elements.experienceSelect.value;
  elements.focusRole.textContent = role;
  elements.focusLevel.textContent = level;
  elements.customRoleWrap.hidden = elements.roleSelect.value !== 'custom';
  updateQuestionLevel();
}

function updateQuestionLevel() {
  if (!state.question) return;
  const level = elements.experienceSelect.value;
  const expectation = LEVEL_EXPECTATIONS[level] || LEVEL_EXPECTATIONS['Mid level'];
  elements.questionDifficulty.textContent = level.toUpperCase();
  elements.questionContext.textContent = `${state.question.context} ${expectation.depth}`;
}

function generateQuestion() {
  updateSessionDetails();
  const role = getSelectedRole();
  const pool = getQuestionPool(role);
  let nextQuestion;
  if (pool.length === 1) {
    nextQuestion = pool[0];
  } else {
    const currentId = state.question && state.question.question;
    const alternatives = pool.filter((item) => item.question !== currentId);
    nextQuestion = alternatives[Math.floor(Math.random() * alternatives.length)];
  }
  state.question = nextQuestion;
  state.questionNumber += 1;

  elements.questionCategory.textContent = nextQuestion.category;
  elements.questionText.textContent = nextQuestion.question;
  elements.interviewerHint.textContent = nextQuestion.hint;
  updateQuestionLevel();
  elements.sessionNumber.textContent = `Question ${String(state.questionNumber).padStart(2, '0')}`;

  elements.answerInput.value = '';
  updateWordCount();
  elements.inlineMessage.textContent = '';
  elements.resultsSection.hidden = true;
  state.lastEvaluation = null;
  elements.evaluateBtn.disabled = true;
  elements.answerInput.focus({ preventScroll: true });
}

function updateWordCount() {
  const value = elements.answerInput.value;
  const trimmed = value.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  elements.wordCount.textContent = String(words);
  elements.charCount.textContent = String(value.length);
  elements.evaluateBtn.disabled = words < 5 || !state.question;
}

function countWords(value) {
  const matches = value.match(/[a-zA-Z0-9+#.-]+/g);
  return matches ? matches.length : 0;
}

function includesSignal(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function evaluateLocally(answer, question, level) {
  const lower = answer.toLowerCase();
  const wordCount = countWords(answer);
  const matched = question.keywords.filter((keyword) => lower.includes(keyword.toLowerCase()));
  const missing = question.keywords.filter((keyword) => !matched.includes(keyword));
  const hasOpening = includesSignal(lower, [/\b(first|initially|to start|i would begin|start by|my approach)\b/]);
  const hasSequence = includesSignal(lower, [/\b(then|next|after that|once|following|finally)\b/]);
  const hasExample = includesSignal(lower, [/\b(example|for instance|in my last|in a previous|we had|i worked|project)\b/]);
  const hasTesting = includesSignal(lower, [/\b(test|validate|verify|measure|monitor|track|metric|logging|log)\b/]);
  const hasTradeoff = includesSignal(lower, [/\b(trade.?off|however|whereas|instead|depends|risk|cost|benefit|drawback)\b/]);
  const hasOutcome = includesSignal(lower, [/\b(result|outcome|improv|reduc|increas|learned|impact|success)\w*\b/]);

  // The visible 40/25/25/10 rubric is the actual scoring formula below.
  const technical = 40 * (matched.length / Math.max(question.keywords.length, 1));
  const structureSignals = Number(hasOpening) + Number(hasSequence);
  const structure = 25 * (structureSignals / 2);
  const practicalSignals = Number(hasExample) + Number(hasTesting) + Number(hasTradeoff) + Number(hasOutcome);
  const practical = 25 * (practicalSignals / 4);
  const communication = 10 * Math.min(wordCount / 100, 1);
  const breakdown = {
    technical: Math.round(technical),
    structure: Math.round(structure),
    practical: Math.round(practical),
    communication: Math.round(communication)
  };

  let score = (breakdown.technical + breakdown.structure + breakdown.practical + breakdown.communication) / 10;
  if (level === 'Senior level' && !hasTradeoff) score -= 0.25;
  if (level === 'Senior level' && !hasTesting) score -= 0.25;
  if (wordCount < 25) score = Math.min(score, 3.5);
  score = Math.max(1, Math.min(10, Math.round(score * 2) / 2));

  const strengths = [];
  if (matched.length >= 2) strengths.push(`You addressed relevant concepts such as ${matched.slice(0, 3).join(', ')}.`);
  if (hasOpening && hasSequence) strengths.push('Your answer follows a clear sequence, making your thinking easier to follow.');
  else if (hasOpening || hasSequence) strengths.push('You signposted part of your approach. Add a clear beginning and next steps to make the flow even stronger.');
  if (hasExample) strengths.push('You included practical context instead of keeping the answer purely theoretical.');
  if (hasTesting) strengths.push('You explained how you would validate or measure the result.');
  if (hasTradeoff) strengths.push('You acknowledged a trade-off, risk, or alternative rather than presenting one solution as universal.');
  if (hasOutcome) strengths.push('You connected the approach to an outcome or learning.');
  if (strengths.length === 0) strengths.push('You have started addressing the question. Build on this by naming the key concepts and explaining your decision process.');
  if (strengths.length > 4) strengths.length = 4;

  const gaps = [];
  if (missing.length) gaps.push(`Concepts to consider: ${missing.slice(0, 4).join(', ')}.`);
  if (!hasOpening || !hasSequence) gaps.push('Structure the response: state your first step, explain what happens next, and finish with a conclusion.');
  if (!hasExample) gaps.push('Add a real project example or a specific hypothetical situation to show how you apply the idea.');
  if (!hasTesting) gaps.push('Explain how you would test, validate, or measure whether the solution worked.');
  if (level !== 'Entry level' && !hasTradeoff) gaps.push(`At ${level.toLowerCase()}, mention a trade-off, risk, or alternative you considered.`);
  if (wordCount < 55) gaps.push('Your answer is brief. Aim for around 90–160 words so the interviewer can hear your reasoning.');
  if (gaps.length === 0) gaps.push('No major rubric gaps stood out. Keep supporting each point with concrete evidence.');
  if (gaps.length > 4) gaps.length = 4;

  let label;
  let description;
  if (score >= 9) {
    label = 'Interview-ready thinking';
    description = 'A strong, considered response. Keep the same clarity when the interviewer asks a follow-up.';
  } else if (score >= 7.5) {
    label = 'Strong foundation';
    description = 'You have the important pieces. One or two sharper details could make this a standout answer.';
  } else if (score >= 5.5) {
    label = 'Good direction';
    description = 'The thinking is heading somewhere useful. Add evidence and make the decision-making more explicit.';
  } else if (score >= 3.5) {
    label = 'Getting there';
    description = 'You have a starting point. Slow down, structure the response, and address the key parts of the scenario.';
  } else {
    label = 'Let’s build this up';
    description = 'Treat this as a first draft. Start with the basic approach, then explain how you would validate it.';
  }

  const expectation = LEVEL_EXPECTATIONS[level] || LEVEL_EXPECTATIONS['Mid level'];
  const summary = `Offline rubric review for ${level.toLowerCase()}. ${expectation.depth}`;

  return {
    score, breakdown, label, description, summary, strengths, gaps,
    modelAnswer: question.answer,
    mode: 'OFFLINE RUBRIC'
  };
}

function setLoading(isLoading) {
  elements.evaluateBtn.classList.toggle('is-loading', isLoading);
  elements.evaluateBtn.disabled = isLoading || countWords(elements.answerInput.value) < 5;
  elements.generateBtn.disabled = isLoading;
  elements.clearAnswerBtn.disabled = isLoading;
  elements.evaluateBtn.querySelector('.button-label').textContent = isLoading ? 'Reviewing your answer…' : 'Evaluate my answer';
}

function renderList(target, items) {
  target.replaceChildren();
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    target.appendChild(li);
  });
}

function renderEvaluation(result) {
  state.lastEvaluation = result;
  const score = Math.max(0, Math.min(10, Number(result.score)));
  const degree = score * 36;
  elements.scoreValue.textContent = Number.isInteger(score) ? String(score) : score.toFixed(1);
  elements.scoreRing.style.background = `conic-gradient(#466b52 0deg, #466b52 ${degree}deg, #e8e5dc ${degree}deg)`;
  elements.scoreLabel.textContent = result.label;
  elements.scoreDescription.textContent = result.description;
  elements.scoreScaleFill.style.width = `${score * 10}%`;
  const breakdown = result.breakdown || { technical: 0, structure: 0, practical: 0, communication: 0 };
  elements.technicalScore.textContent = `${breakdown.technical}/40`;
  elements.technicalBar.style.width = `${(breakdown.technical / 40) * 100}%`;
  elements.structureScore.textContent = `${breakdown.structure}/25`;
  elements.structureBar.style.width = `${(breakdown.structure / 25) * 100}%`;
  elements.practicalScore.textContent = `${breakdown.practical}/25`;
  elements.practicalBar.style.width = `${(breakdown.practical / 25) * 100}%`;
  elements.communicationScore.textContent = `${breakdown.communication}/10`;
  elements.communicationBar.style.width = `${(breakdown.communication / 10) * 100}%`;
  elements.reviewSummary.textContent = result.summary;
  elements.reviewMode.textContent = result.mode;
  renderList(elements.strengthList, result.strengths);
  renderList(elements.gapList, result.gaps);
  elements.modelAnswerText.textContent = result.modelAnswer;
  elements.resultsSection.hidden = false;
  elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  window.clearTimeout(state.toastTimer);
  state.toastTimer = window.setTimeout(() => elements.toast.classList.remove('show'), 2600);
}

async function handleEvaluation() {
  const answer = elements.answerInput.value.trim();
  if (!state.question) {
    elements.inlineMessage.textContent = 'Generate a question before asking for a review.';
    return;
  }
  if (countWords(answer) < 5) {
    elements.inlineMessage.textContent = 'Add a little more detail first — at least five words is enough to get started.';
    return;
  }

  elements.inlineMessage.textContent = '';
  setLoading(true);
  // A short delay makes the local review feel deliberate; no request is sent.
  await new Promise((resolve) => window.setTimeout(resolve, 850));
  renderEvaluation(evaluateLocally(answer, state.question, elements.experienceSelect.value));
  setLoading(false);
}

async function copyModelAnswer() {
  const text = elements.modelAnswerText.textContent.trim();
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Model answer copied to clipboard.');
  } catch (_) {
    const temporary = document.createElement('textarea');
    temporary.value = text;
    temporary.style.position = 'fixed';
    temporary.style.opacity = '0';
    document.body.appendChild(temporary);
    temporary.select();
    const copied = document.execCommand('copy');
    temporary.remove();
    showToast(copied ? 'Model answer copied to clipboard.' : 'Copy was blocked by the browser.');
  }
}

function initialise() {
  updateSessionDetails();
  generateQuestion();
  elements.roleSelect.addEventListener('change', () => {
    updateSessionDetails();
    if (state.questionNumber > 0) generateQuestion();
  });
  elements.customRole.addEventListener('change', () => {
    updateSessionDetails();
    if (elements.roleSelect.value === 'custom' && state.questionNumber > 0) generateQuestion();
  });
  elements.experienceSelect.addEventListener('change', () => {
    updateSessionDetails();
  });
  elements.generateBtn.addEventListener('click', generateQuestion);
  elements.nextQuestionBtn.addEventListener('click', () => {
    generateQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  elements.answerInput.addEventListener('input', updateWordCount);
  elements.answerInput.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !elements.evaluateBtn.disabled) {
      event.preventDefault();
      handleEvaluation();
    }
  });
  elements.clearAnswerBtn.addEventListener('click', () => {
    elements.answerInput.value = '';
    updateWordCount();
    elements.answerInput.focus();
  });
  elements.evaluateBtn.addEventListener('click', handleEvaluation);
  elements.copyAnswerBtn.addEventListener('click', copyModelAnswer);
}

document.addEventListener('DOMContentLoaded', initialise);
