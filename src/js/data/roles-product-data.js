(function (root) {
  'use strict';

  const SmartPrep = root.SmartPrep || (root.SmartPrep = {});

  const PRODUCT_DATA_QUESTIONS = {
    'Data Analyst': [
      {
        id: 'da-01',
        role: 'Data Analyst',
        category: 'Root-Cause Analysis',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'A product manager flags that weekly sales dropped 18% week over week. How do you determine whether this is a real business drop or a data pipeline problem?',
        context: 'Clarify definitions and data integrity before hypothesising about user behaviour.',
        hint: 'Confirm metric definition and time window, audit pipeline freshness/tracking changes, segment across dimensions, and separate facts from hypotheses.',
        concepts: [
          { label: 'Metric definition', terms: ['metric definition', 'gross', 'net', 'orders', 'revenue', 'time zone', 'refund'] },
          { label: 'Data quality & pipeline', terms: ['data quality', 'pipeline', 'etl', 'tracking', 'late-arriving', 'source', 'freshness', 'logging'] },
          { label: 'Baseline & seasonality', terms: ['baseline', 'seasonality', 'holiday', 'campaign', 'promo', 'comparison'] },
          { label: 'Segmentation & funnel', terms: ['segment', 'channel', 'geography', 'device', 'funnel', 'conversion', 'aov'] },
          { label: 'Evidence & confidence', terms: ['hypothesis', 'correlation', 'confidence', 'validate', 'recommend'] }
        ],
        answer: 'First, I would verify the exact metric definition—whether "sales" means completed orders, gross revenue, or net revenue after refunds—and confirm we are comparing identical day-of-week windows and time zones. Before jumping into business explanations, I would audit data quality: pipeline freshness, row-count anomalies, missing upstream partitions, and recent event-tracking or payment-provider changes.\n\nOnce the data is verified, I would decompose sales into traffic, conversion rate, average order value, and cancellations, then segment by channel, product category, geography, and device to isolate where the 18% drop lives. I would also check seasonality, ended promotions, or pricing changes.\n\nFinally, I would present a concise summary clearly separating confirmed facts from open hypotheses, along with the next diagnostic query or stakeholder check needed to confirm causality.'
      },
      {
        id: 'da-02',
        role: 'Data Analyst',
        category: 'SQL & Data Modelling',
        difficulty: 'Entry level',
        estimatedMinutes: 4,
        question: 'After joining an orders table with a customers table, your report shows significantly more orders than exist in the raw orders table. What is likely happening and how would you debug it?',
        context: 'Show clear understanding of table grain, join cardinality, and safe remediation.',
        hint: 'Check primary-key uniqueness on the right-hand table, inspect duplicate keys or SCD history rows, verify row counts per step, and avoid masking with SELECT DISTINCT.',
        concepts: [
          { label: 'Table grain', terms: ['grain', 'granularity', 'one row per', 'entity'] },
          { label: 'Cardinality & duplicates', terms: ['duplicate', 'cardinality', 'one-to-many', 'many-to-many', 'fan-out', 'primary key'] },
          { label: 'Row-count checks', terms: ['row count', 'count(distinct', 'before and after', 'group by', 'having'] },
          { label: 'Join & SCD filters', terms: ['join condition', 'slowly changing', 'scd', 'effective date', 'is_current', 'active'] },
          { label: 'Proper fix & guard', terms: ['distinct', 'deduplicat', 'data model', 'test', 'validation', 'assertion'] }
        ],
        answer: 'This is a classic join fan-out caused by mismatched table grain. If the customers table is assumed to have one row per customer_id but actually contains duplicates—or multiple historical records from a slowly changing dimension—joining it to orders multiplies order rows.\n\nTo debug, I would compare total rows and COUNT(DISTINCT order_id) before and after the join, then run a GROUP BY customer_id HAVING COUNT(*) > 1 query on customers to inspect sample duplicate records. I would also double-check the join predicates for missing keys such as tenant_id or effective date ranges.\n\nRather than slapping SELECT DISTINCT onto the query—which hides broken upstream assumptions and can drop legitimate rows—I would filter to the valid current record or deduplicate explicitly with a documented business rule, then add an automated uniqueness check in the pipeline.'
      },
      {
        id: 'da-03',
        role: 'Data Analyst',
        category: 'Experimentation',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'An A/B test shows a +4% conversion lift, but the p-value is 0.14 (not statistically significant). How would you explain this to stakeholders and guide the next decision?',
        context: 'Communicate statistical uncertainty clearly and tie next steps to business risk.',
        hint: 'Cover confidence intervals, statistical power/sample size, peeking risks, SRM/guardrails, and risk-weighted next actions.',
        concepts: [
          { label: 'Confidence interval & p-value', terms: ['confidence interval', 'p-value', 'uncertainty', 'noise', 'chance'] },
          { label: 'Power & sample size', terms: ['sample size', 'statistical power', 'underpowered', 'mde', 'minimum detectable', 'duration'] },
          { label: 'Experiment hygiene', terms: ['randomis', 'randomiz', 'srm', 'sample ratio', 'peeking', 'instrumentation'] },
          { label: 'Guardrail metrics', terms: ['guardrail', 'refund', 'retention', 'latency', 'revenue', 'secondary'] },
          { label: 'Risk-based decision', terms: ['risk', 'cost', 'extend', 'redesign', 'trade-off', 'decision'] }
        ],
        answer: 'I would explain in plain language that a +4% point estimate with p = 0.14 means the true effect could plausibly be positive, zero, or slightly negative—it is not proof of no effect, nor strong enough proof of a lift. Showing the 95% confidence interval helps stakeholders see the range of plausible outcomes.\n\nNext, I would verify whether the test reached its planned sample size and duration for the minimum detectable effect, check for sample-ratio mismatch or instrumentation bugs, review guardrail metrics (revenue per user, refunds, error rate), and confirm we did not stop early after peeking.\n\nFrom there, the decision depends on risk and opportunity cost: if the engineering risk is low and the upside is meaningful, we can run a properly powered follow-up test; if the potential gain is too small to justify waiting, we document the learning and move on.'
      },
      {
        id: 'da-04',
        role: 'Data Analyst',
        category: 'BI & Governance',
        difficulty: 'Senior level',
        estimatedMinutes: 6,
        question: 'Executives ask for "one single dashboard for the entire company." How do you design a reporting layer that keeps metrics consistent without becoming unusable for individual teams?',
        context: 'Address metric governance, semantic consistency, self-service ergonomics, and lifecycle management.',
        hint: 'Separate governed metric definitions (semantic layer) from audience-specific views; cover ownership, freshness indicators, permissions, and pruning unused reports.',
        concepts: [
          { label: 'Governed definitions', terms: ['metric definition', 'source of truth', 'glossary', 'certified', 'governance'] },
          { label: 'Semantic layer', terms: ['semantic layer', 'dbt', 'model', 'reusable', 'consistent'] },
          { label: 'Layered views', terms: ['executive', 'operational', 'self-service', 'audience', 'decision'] },
          { label: 'Freshness & quality', terms: ['freshness', 'data quality', 'sla', 'ownership', 'owner', 'review'] },
          { label: 'Access & adoption', terms: ['access control', 'permission', 'pii', 'adoption', 'retire', 'deprecat'] }
        ],
        answer: 'One giant dashboard usually ends up serving nobody well—what leadership actually wants is one consistent set of numbers. I would separate metric governance from presentation by defining core company metrics (active users, conversion, net revenue) once in a governed semantic or transformation layer with documented grain, exclusions, and owners.\n\nOn top of that shared foundation, I would build a focused executive summary for top-level outcomes alongside lighter, team-specific operational views designed around each team’s recurring decisions. Every report should display data freshness, definition tooltips, and a clear owner, backed by automated data-quality tests.\n\nFinally, I would enforce role-based access control for sensitive data, track dashboard usage to see whether ad-hoc requests drop, and periodically archive stale dashboards so the reporting catalogue stays trustworthy.'
      }
    ],

    'Product Manager': [
      {
        id: 'pm-01',
        role: 'Product Manager',
        category: 'Prioritisation',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'Sales is pushing for an enterprise feature to close a deal, engineering insists on reliability work, and existing customers want UX improvements. How do you decide what goes into the next quarter?',
        context: 'Show structured trade-off reasoning and transparent stakeholder communication.',
        hint: 'Anchor to quarterly goals, gather comparable evidence (impact, effort, risk, opportunity cost), make explicit trade-offs, and communicate what is deferred and why.',
        concepts: [
          { label: 'Strategic objective', terms: ['objective', 'goal', 'okr', 'north star', 'strategy', 'outcome'] },
          { label: 'Evidence & sizing', terms: ['evidence', 'data', 'customer impact', 'revenue', 'reach', 'effort', 'cost of delay'] },
          { label: 'Risk & reliability', terms: ['reliability', 'risk', 'debt', 'outage', 'churn', 'sla'] },
          { label: 'Explicit trade-offs', terms: ['trade-off', 'opportunity cost', 'prioriti', 'rank', 'score', 'scope'] },
          { label: 'Stakeholder alignment', terms: ['stakeholder', 'communicat', 'defer', 'revisit', 'transparent', 'align'] }
        ],
        answer: 'I would start by anchoring all three requests to our primary company objectives for the quarter and the real cost of delaying each one. Rather than debating opinions, I would gather concrete evidence: how repeatable the sales deal is versus a one-off custom request, what customer harm or churn risk engineering’s reliability gap carries, and how broadly the UX friction affects retention.\n\nNext, I would evaluate impact, effort, and downside risk side by side. If reliability threatens core workflows or enterprise trust, protecting that foundation comes first; meanwhile, a scoped phase-one slice of a repeatable sales capability might still fit alongside it.\n\nOnce the trade-off is made with leadership and engineering, I would communicate clearly what we are doing, what we are explicitly deferring, and what new evidence would trigger a reprioritisation—so every team understands the reasoning even if their item waits.'
      },
      {
        id: 'pm-02',
        role: 'Product Manager',
        category: 'Product Metrics',
        difficulty: 'Entry level',
        estimatedMinutes: 4,
        question: 'Your team is launching a redesigned onboarding flow. What metrics would you define before launch to evaluate whether it actually improved the product?',
        context: 'Connect onboarding steps to meaningful activation and retention, not vanity completion rates.',
        hint: 'Define the activation milestone, funnel step conversion, time-to-value, guardrails (support tickets, errors), segmentation, and baseline/experiment comparison.',
        concepts: [
          { label: 'Activation milestone', terms: ['activation', 'aha', 'core value', 'value moment', 'first value'] },
          { label: 'Funnel & velocity', terms: ['funnel', 'conversion', 'drop-off', 'time to', 'completion'] },
          { label: 'Early retention', terms: ['retention', 'day 7', 'week 1', 'returning', 'repeat'] },
          { label: 'Guardrail metrics', terms: ['guardrail', 'support', 'ticket', 'error', 'abandon', 'churn'] },
          { label: 'Baseline & qualitative', terms: ['baseline', 'experiment', 'a/b', 'segment', 'interview', 'feedback'] }
        ],
        answer: 'I would define success around reaching a real activation event—the action that predicts users stick around—rather than simply clicking through the last onboarding screen. My primary metrics would be activation rate within a set window (for example, 7 days), step-by-step funnel conversion, time to first value, and early week-1/week-4 retention.\n\nTo make sure a slicker flow does not cause downstream issues, I would track guardrails such as onboarding support tickets, validation errors, and skip/abandonment rates. I would establish a clean pre-launch baseline or run a controlled A/B experiment segmented by acquisition source and platform.\n\nFinally, I would pair funnel drop-off data with session replays or quick user interviews to understand why people hesitate at specific steps and prioritise follow-up iterations.'
      },
      {
        id: 'pm-03',
        role: 'Product Manager',
        category: 'Discovery & Execution',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: 'A major customer requests a complex feature and threatens to churn without it. How do you investigate whether to build it as requested, solve the underlying need differently, or say no?',
        context: 'Demonstrate customer empathy without letting one loud account hijack the roadmap.',
        hint: 'Dig past the requested solution to the underlying job-to-be-done, check broader market demand, assess maintenance cost, explore lighter workarounds, and align with account owners.',
        concepts: [
          { label: 'Root problem discovery', terms: ['underlying problem', 'why', 'job to be done', 'workflow', 'interview', 'pain point'] },
          { label: 'Market generality', terms: ['other customers', 'segment', 'repeatable', 'market', 'one-off', 'custom'] },
          { label: 'Cost & complexity', terms: ['maintenance', 'engineering', 'complexity', 'opportunity cost', 'roadmap'] },
          { label: 'Alternative options', terms: ['workaround', 'api', 'integration', 'mvp', 'scoped', 'phased'] },
          { label: 'Revenue & comms', terms: ['arr', 'churn', 'account', 'transparent', 'trade-off', 'no'] }
        ],
        answer: 'First, I would meet directly with the customer’s actual end users—not just the executive sponsor—to understand the workflow problem behind the feature request. Customers often prescribe a specific solution when a simpler capability or existing integration would solve the real pain point.\n\nNext, I would check support logs, win/loss notes, and other accounts in our target segment to learn whether this is a broad market need or a bespoke requirement, while sizing engineering build and ongoing maintenance cost. If the request is genuinely one-off and high complexity, building it blindly creates long-term product drag.\n\nI would explore middle-ground options—such as a generalisable core primitive, API hook, or phased deliverable—weigh the churn impact with leadership, and give the customer an honest answer with clear timelines rather than vague promises.'
      },
      {
        id: 'pm-04',
        role: 'Product Manager',
        category: 'Product Strategy',
        difficulty: 'Senior level',
        estimatedMinutes: 6,
        question: 'A product area has healthy initial adoption but weak 90-day retention. How do you decide whether to invest in fixing it, reposition it for a narrower segment, or sunset it?',
        context: 'Separate surface activity from durable value and establish clear decision criteria.',
        hint: 'Run cohort & segment retention analysis, pair with churn interviews, diagnose value vs positioning vs quality gaps, weigh opportunity cost, and set time-boxed kill/scale criteria.',
        concepts: [
          { label: 'Cohort & segment analysis', terms: ['cohort', 'retention', 'segment', 'power user', 'churn', 'curve'] },
          { label: 'Qualitative diagnosis', terms: ['interview', 'jobs-to-be-done', 'jtbd', 'support', 'feedback', 'friction'] },
          { label: 'Root-cause buckets', terms: ['positioning', 'onboarding', 'recurring value', 'quality', 'missing'] },
          { label: 'Opportunity cost', terms: ['opportunity cost', 'investment', 'alternative', 'roi', 'focus'] },
          { label: 'Explicit decision criteria', terms: ['decision criteria', 'hypothesis', 'time horizon', 'sunset', 'kill', 'milestone'] }
        ],
        answer: 'Healthy top-of-funnel usage with weak 90-day retention usually signals a gap between what users expect and the recurring value they receive. First, I would break retention cohorts down by acquisition channel, company size, and use case to see whether one specific segment actually retains well while others churn.\n\nNext, I would pair cohort data with interviews of both retained and churned users to pinpoint whether the issue is poor onboarding, product reliability, missing recurring triggers, or targeting the wrong audience. If a clear niche retains strongly, repositioning and focusing the experience around that segment can unlock product-market fit.\n\nBefore committing another quarter of engineering, I would set explicit, time-boxed decision criteria—target segment, retention benchmark, and testable hypotheses—and weigh the opportunity cost against our other bets. If those thresholds are missed, sunsetting cleanly frees the team for higher-leverage work.'
      }
    ]
  };

  function getCustomRoleQuestions(roleName) {
    const cleanRole = (roleName || 'Software Professional').trim();
    return [
      {
        id: 'custom-01',
        role: cleanRole,
        category: 'Problem Solving',
        difficulty: 'Mid level',
        estimatedMinutes: 5,
        question: `Describe a complex technical or operational challenge typical for a ${cleanRole}. How would you break it down, choose between options, and verify that your solution worked?`,
        context: 'Ground your answer in a concrete example or realistic scenario with clear decision points.',
        hint: 'Establish context and constraints, compare at least two realistic approaches with trade-offs, and close with measurable validation.',
        concepts: [
          { label: 'Context & constraints', terms: ['context', 'constraint', 'requirement', 'goal', 'scope'] },
          { label: 'Structured breakdown', terms: ['break down', 'step', 'priorit', 'isolate', 'approach'] },
          { label: 'Options & trade-offs', terms: ['trade-off', 'alternative', 'option', 'risk', 'cost'] },
          { label: 'Collaboration', terms: ['stakeholder', 'team', 'collaborat', 'align', 'review'] },
          { label: 'Verification & outcome', terms: ['test', 'measure', 'metric', 'verify', 'result', 'outcome'] }
        ],
        answer: 'I would begin by clarifying the core problem, the desired user or business outcome, and key constraints such as deadlines, reliability targets, and team dependencies. Breaking the ambiguity into smaller verifiable questions keeps us from solving the wrong problem.\n\nNext, I would evaluate two or three realistic options, explicitly weighing delivery speed, risk, maintainability, and cost, and align with the people who own adjacent systems. I favour the smallest reversible step that addresses the highest-impact bottleneck.\n\nFinally, I would define observable success metrics up front, test the change thoroughly before rollout, monitor outcomes after launch, and capture lessons learned for the team.'
      },
      {
        id: 'custom-02',
        role: cleanRole,
        category: 'Execution Under Ambiguity',
        difficulty: 'Mid level',
        estimatedMinutes: 4,
        question: `A high-priority ${cleanRole} deliverable is slipping behind schedule and a critical requirement is still ambiguous. What do you do over the next 24 hours?`,
        context: 'Demonstrate calm ownership, risk visibility, and crisp stakeholder communication.',
        hint: 'Pinpoint exactly what is blocked vs unblocked, identify the decision owner, present concrete options with schedule impact, and document the agreed plan.',
        concepts: [
          { label: 'Clarify blockers', terms: ['clarify', 'blocked', 'ambiguit', 'assumption', 'scope'] },
          { label: 'Decision ownership', terms: ['stakeholder', 'owner', 'decision', 'align', 'escalat'] },
          { label: 'Parallel progress', terms: ['parallel', 'unblocked', 'priority', 'de-risk', 'reversible'] },
          { label: 'Options & schedule risk', terms: ['risk', 'trade-off', 'option', 'timeline', 'quality'] },
          { label: 'Written follow-up', terms: ['document', 'plan', 'communicat', 'update', 'next step'] }
        ],
        answer: 'First, I would pinpoint the exact ambiguous requirement, list our current assumptions, and separate tasks that are truly blocked from work that can safely proceed in parallel. That prevents the whole team from stalling.\n\nNext, I would go directly to the decision owner with two concrete options—each showing its impact on scope, timeline, and quality—rather than asking an open-ended question. I would avoid silently cutting testing or quality to hit a date without surfacing the risk.\n\nBy the end of the day, I would share a short written recap capturing the decision (or the safest reversible path if unresolved), updated milestones, owners, and the next check-in point.'
      },
      {
        id: 'custom-03',
        role: cleanRole,
        category: 'Technical Communication',
        difficulty: 'Senior level',
        estimatedMinutes: 5,
        question: `As a ${cleanRole}, you discover a significant hidden risk in a plan leadership already approved. How do you raise it and guide the team to a better path?`,
        context: 'Show constructive candour, evidence-based persuasion, and practical alternatives.',
        hint: 'Validate the evidence first, quantify user/business impact in plain language, bring constructive options rather than just objections, and align on next steps.',
        concepts: [
          { label: 'Verified evidence', terms: ['evidence', 'data', 'verify', 'reproduce', 'fact'] },
          { label: 'Business impact framing', terms: ['impact', 'risk', 'customer', 'cost', 'consequence'] },
          { label: 'Constructive options', terms: ['option', 'alternative', 'mitigat', 'proposal', 'trade-off'] },
          { label: 'Early alignment', terms: ['early', 'stakeholder', 'leadership', 'collaborat', 'transparent'] },
          { label: 'Follow-through', terms: ['plan', 'measure', 'milestone', 'decision', 'owner'] }
        ],
        answer: 'I would first double-check the evidence so I am raising a concrete, verified risk rather than a hunch. When communicating with leadership, I translate technical or operational risks into clear business terms—potential customer impact, delivery delay, or ongoing cost.\n\nInstead of simply blocking the approved plan, I would bring two or three viable alternatives: for example, mitigating the risk with an added safeguard, narrowing initial scope, or sequencing the rollout in phases—each with clear trade-offs.\n\nI would share this early with the key stakeholders before a wider meeting when possible, agree on a clear decision owner, and follow up in writing with agreed mitigations and review checkpoints.'
      }
    ];
  }

  SmartPrep.ProductDataQuestions = PRODUCT_DATA_QUESTIONS;
  SmartPrep.getCustomRoleQuestions = getCustomRoleQuestions;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PRODUCT_DATA_QUESTIONS, getCustomRoleQuestions };
  }
})(typeof window !== 'undefined' ? window : globalThis);
