import { useState, useMemo } from "react";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  PlusCircle,
  AlignLeft,
  Type,
  TrendingUp,
  LayoutTemplate,
  Award
} from "lucide-react";
import { extractDeepResumeInventory } from "../utils/conversationalEngine";

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    id: "stripe-backend",
    title: "Senior Backend Engineer (Stripe / Payments)",
    text: `We are looking for a Senior Backend Engineer to scale our global financial infrastructure.
Requirements:
- Strong experience in Java, Go, or Python building distributed, high-concurrency microservices.
- Deep expertise in relational databases (PostgreSQL / MySQL) with strong understanding of ACID transactions, indexing, and isolation levels.
- Familiarity with event-driven architectures, Kafka, Redis caching, and Docker/Kubernetes container orchestration.
- Proven track record of designing idempotent APIs, handling network partitions, and building fault-tolerant systems with zero data loss.
- Solid understanding of CI/CD, AWS/GCP cloud platforms, and distributed tracing.`,
  },
  {
    id: "aws-cloud",
    title: "Cloud Infrastructure SDE II (AWS)",
    text: `The AWS Platform team is seeking an SDE II to build high-scale cloud services.
Requirements:
- 3+ years experience with Java, Python, or TypeScript.
- Hands-on expertise with AWS services (EC2, S3, DynamoDB, Lambda, SQS, CloudWatch).
- Strong knowledge of Linux internals, containerization with Docker and Kubernetes, and infrastructure-as-code using Terraform.
- Experience with microservices, gRPC/REST APIs, distributed rate limiting, and automated canary deployments.
- Bachelor's degree in Computer Science or equivalent hands-on industry experience.`,
  },
  {
    id: "google-frontend",
    title: "Frontend Architect (Google / Web Platforms)",
    text: `Join Google to architect next-generation web platforms.
Requirements:
- Expert-level proficiency in TypeScript, JavaScript (ES6+), React, and modern state management.
- Deep understanding of browser rendering pipelines, V8 event loop, DOM virtualization, and Web Workers.
- Experience with GraphQL, WebSockets, performance profiling using Chrome DevTools, and Lighthouse web vitals optimization.
- Passion for writing clean, accessible (a11y) code, unit testing with Jest/Vitest, and monorepo tooling.`,
  },
];

const KNOWN_TECH_KEYWORDS = [
  "python", "java", "javascript", "typescript", "c++", "c#", "go", "golang", "rust", "sql", "postgresql", "postgres", "mysql", "mongodb", "redis", "cassandra", "dynamodb",
  "react", "node.js", "nodejs", "spring boot", "spring", "fastapi", "django", "graphql", "rest", "grpc", "microservices",
  "docker", "kubernetes", "k8s", "aws", "azure", "gcp", "terraform", "ci/cd", "kafka", "rabbitmq", "linux", "git",
  "idempotency", "acid", "concurrency", "distributed systems", "caching", "rate limiting", "websocket", "tracing", "profiling"
];

export default function AtsResumeMatcher({ activeProfile, onUpdateProfile, onNavigateToSimulator }) {
  const profileInventory = useMemo(() => extractDeepResumeInventory(activeProfile), [activeProfile]);

  const [jobDescription, setJobDescription] = useState(SAMPLE_JOB_DESCRIPTIONS[0].text);
  const [candidateBullet, setCandidateBullet] = useState("Built payment integration API using Node.js and database.");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [addedNotice, setAddedNotice] = useState(false);

  // Parse keywords from target Job Description
  const parsedJd = useMemo(() => {
    const text = jobDescription.toLowerCase();
    const foundKeywords = new Set();

    KNOWN_TECH_KEYWORDS.forEach((kw) => {
      const regex = new RegExp(`\\b${kw.replace("+", "\\+")}\\b`, "i");
      if (regex.test(text)) {
        foundKeywords.add(kw);
      }
    });

    return Array.from(foundKeywords);
  }, [jobDescription]);

  // Compare with candidate profile keywords
  const candidateKeywordsLower = useMemo(() => {
    const list = [
      ...profileInventory.languages,
      ...profileInventory.skills,
      ...profileInventory.frameworksAndTools,
      ...profileInventory.databases,
      ...profileInventory.cloudAndInfra,
    ];
    return new Set(list.map((s) => s.toLowerCase()));
  }, [profileInventory]);

  const { matched, missing, matchScore } = useMemo(() => {
    if (parsedJd.length === 0) return { matched: [], missing: [], matchScore: 80 };

    const matchedList = [];
    const missingList = [];

    parsedJd.forEach((kw) => {
      let isPresent = false;
      for (const candKw of candidateKeywordsLower) {
        if (candKw.includes(kw) || kw.includes(candKw)) {
          isPresent = true;
          break;
        }
      }
      if (isPresent) {
        matchedList.push(kw);
      } else {
        missingList.push(kw);
      }
    });

    const score = Math.round((matchedList.length / parsedJd.length) * 100);
    return {
      matched: matchedList,
      missing: missingList,
      matchScore: Math.min(Math.max(score, 35), 98),
    };
  }, [parsedJd, candidateKeywordsLower]);

  // Google XYZ Formula Bullet Generator
  const rewrittenBullets = useMemo(() => {
    const raw = candidateBullet.trim() || "Engineered scalable cloud backend microservice.";
    const role = profileInventory.targetRole || "Software Engineer";
    const primarySkill = profileInventory.languages[0] || "core stack";

    return [
      `Architected high-throughput ${raw.replace(/^(built|created|worked on)\s+/i, "")} as lead ${role} in ${primarySkill}, reducing p99 API latency by 42% and processing $2.4M in daily transaction volume.`,
      `Engineered resilient ${raw.replace(/^(built|created|worked on)\s+/i, "")} with automated circuit breaking and Redis caching, slashing database connection exhaustion by 65% across 200,000 active users.`,
      `Designed and deployed distributed ${raw.replace(/^(built|created|worked on)\s+/i, "")} leveraging Docker containerization and CI/CD pipelines, increasing deployment frequency by 3.5x while sustaining 99.99% SLA.`,
    ];
  }, [candidateBullet, profileInventory]);

  // Path to 100% Score: Tailored Summary & Keywords Infused Text
  const path100Summary = useMemo(() => {
    const role = profileInventory.targetRole || "Software Engineer";
    const missingFormatted = missing.slice(0, 5).join(", ");
    const presentSkills = (profileInventory.skills || []).slice(0, 4).join(", ") || "software architecture";
    return `Results-driven ${role} with hands-on background in ${presentSkills}${
      missingFormatted ? ` alongside specialized expertise in ${missingFormatted}` : ""
    }. Proven track record of designing high-availability microservices, implementing automated CI/CD pipelines, and driving database performance optimizations that cut response latency by 35% while sustaining 99.99% uptime.`;
  }, [profileInventory, missing]);

  const [copiedSummary, setCopiedSummary] = useState(false);

  function handleCopy(text, idx) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  function handleAddMissingKeywords() {
    if (missing.length === 0) return;
    const currentSkills = activeProfile?.technicalSkills || [];
    const formatted = missing.map((m) => m.toUpperCase() === "AWS" || m.toUpperCase() === "SQL" ? m.toUpperCase() : m.charAt(0).toUpperCase() + m.slice(1));
    const merged = Array.from(new Set([...currentSkills, ...formatted]));

    if (onUpdateProfile) {
      onUpdateProfile({ ...activeProfile, technicalSkills: merged });
    }
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Applicant Tracking System (ATS) Intelligence</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              Google XYZ Formula
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            Interactive ATS Resume Optimizer & JD Matcher
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Compare your resume against any target Job Description from LinkedIn, Greenhouse, or Indeed. Identify critical keyword gaps and transform weak resume bullets into executive metric-driven statements.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToSimulator}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all shrink-0 cursor-pointer self-start sm:self-center"
        >
          <span>Practice Mock Interview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Left Column (Target JD Input) + Right Column (ATS Matcher Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Job Description Input & Sample Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Target Job Description (JD):</span>
              </h3>

              {/* Sample Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-semibold">Load Sample:</span>
                {SAMPLE_JOB_DESCRIPTIONS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setJobDescription(s.text)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 transition-colors cursor-pointer"
                  >
                    {s.title.split("(")[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description from LinkedIn, Indeed, or company careers page..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed font-mono"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>{parsedJd.length} technical keywords detected in target JD</span>
              <button
                type="button"
                onClick={() => setJobDescription("")}
                className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
              >
                Clear JD
              </button>
            </div>
          </div>

          {/* Card 2: Path to 100% Score Direct Suggestions */}
          <div className="bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/70 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/40 rounded-3xl border border-indigo-200/80 dark:border-indigo-800/80 p-5 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-indigo-100 dark:border-indigo-900/60 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    Path to 100% ATS Match: Tailored Executive Summary
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Pre-infused with missing JD keywords to close the scoring gap instantly.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(path100Summary);
                  setCopiedSummary(true);
                  setTimeout(() => setCopiedSummary(false), 2000);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs shadow-indigo-500/20 cursor-pointer self-start sm:self-auto shrink-0"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy 100% Summary</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-white/80 dark:bg-slate-950/60 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 shadow-inner">
              "{path100Summary}"
            </p>
          </div>

          {/* Google XYZ Formula Bullet Point Rewriter */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Google XYZ Formula Bullet Rewriter</span>
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Accomplished [X] measured by [Y] by doing [Z]
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter any weak or standard bullet point from your resume to transform it into an elite metric-driven statement:
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={candidateBullet}
                onChange={(e) => setCandidateBullet(e.target.value)}
                placeholder="e.g., Built backend authentication API with Node.js"
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            {/* Rewritten Variations */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                Recommended Impact Statements (Click to Copy):
              </span>
              {rewrittenBullets.map((bullet, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopy(bullet, idx)}
                  className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer flex items-start justify-between gap-3 group"
                >
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                    {bullet}
                  </p>
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors shrink-0"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: ATS Match Score & Keyword Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Circular Score Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ATS Compatibility Match
            </h4>

            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`transition-all duration-1000 ease-out ${
                    matchScore >= 80
                      ? "stroke-emerald-500"
                      : matchScore >= 60
                      ? "stroke-indigo-600"
                      : "stroke-amber-500"
                  }`}
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 - (matchScore / 100) * (2 * Math.PI * 40)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {matchScore}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  ATS Match
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                {matchScore >= 80
                  ? "High Interview Shortlist Probability"
                  : matchScore >= 60
                  ? "Moderate ATS Pass Rate"
                  : "Critical Keyword Gaps Detected"}
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target Role: <strong>{profileInventory.targetRole}</strong>
              </p>
            </div>
          </div>

          {/* Card 2: Matched Keywords */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Matched Skills ({matched.length})</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-600">Passed ATS Filter</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {matched.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>{kw}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Missing High-Priority Keywords */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Missing JD Keywords ({missing.length})</span>
              </span>
              <span className="text-[11px] font-semibold text-amber-600">Required by Employer</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              The ATS may filter out your application if these critical competencies are missing:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {missing.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                >
                  + {kw}
                </span>
              ))}
            </div>

            {missing.length > 0 && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAddMissingKeywords}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Missing Keywords to Candidate Profile</span>
                </button>
                {addedNotice && (
                  <p className="text-[11px] text-emerald-600 font-semibold text-center mt-1.5 animate-fadeIn">
                    ✓ Profile updated! Your upcoming mock interviews will include these keywords.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Card 4: ATS Formatting & Parser Compliance Audit */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <LayoutTemplate className="w-4 h-4 text-indigo-500" />
                <span>ATS Layout & Parser Diagnostics</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Taleo / Workday Compliant
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Alignment Diagnostic */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <AlignLeft className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>Text Alignment: Standard Left-Aligned</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">✓ Passed</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    ATS engines scan top-to-bottom, left-to-right. Avoid two-column tables, text boxes, and center-aligned headers which scramble text in Workday/Taleo.
                  </p>
                </div>
              </div>

              {/* Font Size & Typography */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <Type className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>Font Size & Font Family Specs</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold">Recommended</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    • <strong>Body Text</strong>: 10pt - 11.5pt (Calibri, Arial, Helvetica, Inter).<br />
                    • <strong>Section Titles</strong>: 13pt - 15pt bold.<br />
                    • <strong>Candidate Name</strong>: 16pt - 20pt bold.<br />
                    Avoid decorative or icon fonts that decode as unreadable symbols ("?") in OCR.
                  </p>
                </div>
              </div>

              {/* Quantitative Metric Density */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>Metrics & Action Verbs Density</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-extrabold">Important</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Every bullet point should feature at least one quantifiable number, percentage (%), or scale multiplier (e.g. 3.5x, 99.99% SLA, $2.4M).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
