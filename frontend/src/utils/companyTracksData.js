/**
 * InterviewAI - Curated Company-Specific Interview Tracks
 * Modeled after real-world interview rubrics for FAANG, Top Tech, Fintech, and Mass Recruiters.
 */

export const COMPANY_TRACKS = [
  {
    id: "google",
    company: "Google",
    tier: "Tier-1 FAANG / Systems",
    tagline: "Scalability, Distributed Systems & Googliness",
    accentColor: "from-blue-600 via-indigo-600 to-sky-500",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    targetRoles: ["L4 / L5 Software Engineer", "Distributed Systems Engineer", "Site Reliability Engineer"],
    interviewRounds: ["System Design (100k+ QPS)", "Algorithmic Efficiency & DSA", "Googliness & Leadership"],
    description: "Evaluates your ability to engineer globally distributed, fault-tolerant infrastructure, navigate deep ambiguity, and reason about trade-offs with intellectual humility.",
    coreCompetencies: [
      "Global distributed consistency (Google Spanner / TrueTime API)",
      "High-throughput non-blocking concurrency (gRPC, Protocol Buffers)",
      "Algorithmic space/time complexity optimization ($O(N)$ vs $O(N^2)$)",
      "Googliness: navigating ambiguity, collaborative consensus & blameless culture",
    ],
    sampleQuestions: [
      {
        type: "System Design",
        text: "How do you design a globally distributed rate limiter that coordinates across 5 geographic regions with p99 latency < 10ms without centralized database lock contention?",
      },
      {
        type: "Technical Depth",
        text: "Walk me through how Google Spanner achieves external consistency without distributed locking using synchronized atomic clocks (TrueTime API).",
      },
      {
        type: "Googliness (HR)",
        text: "Tell me about a time you took on a deeply ambiguous problem with no established roadmap. How did you break it down, communicate risks, and build team alignment?",
      },
    ],
  },
  {
    id: "amazon",
    company: "Amazon",
    tier: "Tier-1 FAANG / Cloud",
    tagline: "16 Leadership Principles & Bar Raiser Round",
    accentColor: "from-amber-600 via-orange-600 to-yellow-500",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    targetRoles: ["SDE II (Fullstack / Backend)", "AWS Cloud Architect", "DevOps Systems Engineer"],
    interviewRounds: ["Customer Obsession & Ownership", "Bar Raiser Cross-Functional", "AWS Architecture & Scaling"],
    description: "Rigorous focus on Amazon's 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action, Dive Deep, Earn Trust, Have Backbone). Every technical answer must reflect production ownership.",
    coreCompetencies: [
      "Customer Obsession: working backwards from customer pain points",
      "Bias for Action: making two-way door decisions with 60% incomplete data",
      "Event-driven cloud architecture (SQS, SNS, DynamoDB Streams, Lambda)",
      "Dive Deep: analyzing root-cause telemetry, heap dumps, and p99 latency",
    ],
    sampleQuestions: [
      {
        type: "Leadership Principle (STAR)",
        text: "Using the STAR method: Tell me about a time you made a high-stakes architectural decision with only 60% of the required data available (Bias for Action). What was the outcome?",
      },
      {
        type: "Ownership & Outage",
        text: "Describe a production outage where the root cause originated outside your direct team's codebase. How did you demonstrate extreme Ownership to resolve it and prevent recurrence?",
      },
      {
        type: "Cloud Architecture",
        text: "How do you implement the transactional outbox pattern with DynamoDB Streams and SQS to guarantee at-least-once message delivery without distributed two-phase commit?",
      },
    ],
  },
  {
    id: "meta",
    company: "Meta",
    tier: "Tier-1 FAANG / Social Graph",
    tagline: "Rapid Product Execution & High-Throughput APIs",
    accentColor: "from-sky-600 via-blue-600 to-indigo-700",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    targetRoles: ["E4 / E5 Product Software Engineer", "Frontend Architect", "Infrastructure SWE"],
    interviewRounds: ["Rapid Product Architecture", "GraphQL & Live WebSocket Scaling", "Move Fast & Iterate"],
    description: "Evaluates high-velocity product delivery, real-time data streaming to billions of users, eliminating client waterfall queries, and optimizing web/mobile rendering performance.",
    coreCompetencies: [
      "Social graph fan-out write amplification mitigation",
      "Real-time WebSocket & Live Query streaming architectures",
      "Frontend performance: virtualization, React Server Components, and bundle optimization",
      "Pragmatic engineering: shipping MVP iteratively while managing technical debt",
    ],
    sampleQuestions: [
      {
        type: "Product Architecture",
        text: "Design a real-time live video commenting service supporting 5 million concurrent viewers on a single livestream. How do you throttle writes and broadcast deltas without crashing client DOMs?",
      },
      {
        type: "Frontend & API Optimization",
        text: "In a complex single-page application with deeply nested component hierarchies, how do you eliminate network request waterfalls and manage client-side cache normalization?",
      },
      {
        type: "Behavioral (HR)",
        text: "Tell me about a situation where you chose to ship an imperfect MVP quickly to validate market hypotheses. How did you structure the follow-up sprint to pay down technical debt?",
      },
    ],
  },
  {
    id: "microsoft",
    company: "Microsoft",
    tier: "Enterprise Cloud & Developer Platform",
    tagline: "Enterprise Reliability, Azure Cloud & Collaboration",
    accentColor: "from-cyan-600 via-teal-600 to-emerald-600",
    badgeColor: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
    targetRoles: ["SDE II Cloud Services", "Full-Stack Engineer (.NET / Java / TS)", "Azure Platform SDE"],
    interviewRounds: ["Multi-Tenant Cloud Design", "Enterprise Zero-Downtime Migration", "Team Mentorship & Alignment"],
    description: "Focuses on building backward-compatible, mission-critical enterprise SaaS applications on Azure, multi-tenant security isolation, and cross-team developer enablement.",
    coreCompetencies: [
      "Multi-tenant database schema isolation (Row-Level Security vs Database-per-tenant)",
      "Zero-downtime database schema migrations with continuous write traffic",
      "Asynchronous non-blocking pipelines in modern .NET / Java with reactive streams",
      "Inclusive engineering culture and mentoring junior developers",
    ],
    sampleQuestions: [
      {
        type: "Cloud Architecture",
        text: "How do you design multi-tenant data isolation in a B2B enterprise SaaS platform balancing connection pool efficiency, tenant noisy-neighbor problems, and regulatory compliance?",
      },
      {
        type: "Zero-Downtime Deployment",
        text: "Walk me through how you execute a non-trivial relational database schema migration (e.g. splitting a 50-million row column) with zero customer downtime and zero write locking.",
      },
      {
        type: "Culture & Mentorship",
        text: "Tell me about a time you helped elevate a struggling teammate or unblocked cross-team architectural deadlock through empathetic technical mentorship.",
      },
    ],
  },
  {
    id: "stripe",
    company: "Stripe",
    tier: "Tier-1 Fintech & Infrastructure",
    tagline: "Idempotent Financial Ledgers & Zero Data Loss",
    accentColor: "from-violet-600 via-purple-600 to-indigo-600",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    targetRoles: ["Fintech Backend Engineer", "Payment Infrastructure Specialist", "Core Platform SDE"],
    interviewRounds: ["Double-Entry Accounting System", "Idempotency & Network Partitions", "Financial API Ergonomics"],
    description: "Gold standard for financial infrastructure. Zero tolerance for double-charges, lost transactions, or race conditions. Heavy focus on idempotency, database isolation, and API design.",
    coreCompetencies: [
      "Idempotency keys and atomic distributed lock mitigation",
      "Double-entry bookkeeping: immutable ledger append-only models",
      "Database isolation levels (Serializable vs Read Committed) and write-skew anomalies",
      "Designing resilient developer-facing APIs with automated webhook retry backoff",
    ],
    sampleQuestions: [
      {
        type: "Financial Systems",
        text: "Suppose a client initiates an API charge request, the payment gateway executes successfully, but the network drops before returning the 200 OK. How do you design an idempotency layer to guarantee the user is never double-charged upon retry?",
      },
      {
        type: "Ledger Architecture",
        text: "Explain how a double-entry ledger database maintains invariant balance conservation across currency conversions and concurrent merchant payouts under heavy write contention.",
      },
      {
        type: "Failure Scenarios",
        text: "Under network partition (CAP theorem), how do you trade off consistency vs availability for payment authorization versus end-of-day settlement reporting?",
      },
    ],
  },
  {
    id: "tcs_infosys",
    company: "TCS & Infosys Track",
    tier: "Global IT Services & Mass Recruiter",
    tagline: "Core CS Fundamentals, OOPs, DBMS & Aptitude",
    accentColor: "from-emerald-600 via-teal-600 to-green-600",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    targetRoles: ["Associate Software Engineer", "Digital Specialist Engineer", "Systems Engineer"],
    interviewRounds: ["4 OOPs Pillars & Exception Handling", "DBMS Joins & Normalization", "Problem Solving & HR Fit"],
    description: "Essential for campus placements and national qualifier tests (TCS NQT, Infosys InfyTQ). Focuses on strong conceptual clarity in Object-Oriented Programming, SQL queries, and professional communication.",
    coreCompetencies: [
      "The 4 pillars of OOPs: Polymorphism (overloading/overriding), Inheritance, Encapsulation, Abstraction",
      "SQL Joins (INNER, LEFT, RIGHT, FULL) and ACID properties in relational DBMS",
      "Exception handling: checked vs unchecked exceptions and try-catch-finally guarantees",
      "Professional behavioral etiquette, team collaboration, and willingness to learn new technologies",
    ],
    sampleQuestions: [
      {
        type: "Core OOPs",
        text: "Explain the difference between Method Overloading (Compile-Time) and Method Overriding (Run-Time) with concrete code examples. Can static or private methods be overridden? Why?",
      },
      {
        type: "SQL & DBMS",
        text: "What is the difference between WHERE and HAVING in SQL? Write a query using GROUP BY and HAVING to find all departments having more than 5 employees.",
      },
      {
        type: "HR & Adaptability",
        text: "If assigned to a project using a programming language or legacy stack you have never used before, how would you ramp up and deliver results within the first 2 weeks?",
      },
    ],
  },
];
