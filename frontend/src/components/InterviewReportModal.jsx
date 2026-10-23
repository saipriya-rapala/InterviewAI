import { useState, useMemo } from "react";
import {
  Award,
  Clock,
  Mic,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BarChart3,
  HelpCircle,
  FileText,
  Volume2,
  Download
} from "lucide-react";

const FILLER_KEYWORDS = [
  "um",
  "uh",
  "like",
  "basically",
  "you know",
  "actually",
  "literally",
  "sort of",
  "kind of",
  "i mean",
  "honestly",
];

export default function InterviewReportModal({
  session,
  speakingSeconds = 0,
  onClose,
  onBackToDashboard,
  onRestart,
}) {
  const [selectedQuestionTab, setSelectedQuestionTab] = useState(0);

  // Compute question metrics
  const questions = session?.questions || [];
  const scoredQuestions = questions.filter((q) => q.score !== null);
  const totalQuestions = questions.length;

  // Consolidated transcripts
  const allUserText = questions
    .map((q) => q.answerText || "")
    .filter(Boolean)
    .join(" ");

  const totalWords = useMemo(() => {
    return allUserText.trim().split(/\s+/).filter(Boolean).length;
  }, [allUserText]);

  const averageScore = scoredQuestions.length
    ? scoredQuestions.reduce((acc, q) => acc + q.score, 0) / scoredQuestions.length
    : totalWords > 20 ? 7.5 : 5.0;
  const overallPercentage = Math.min(Math.max(Math.round((averageScore / 10) * 100), 20), 100);

  // Words per minute (WPM)
  const effectiveSeconds = Math.max(speakingSeconds, 20);
  const wpm = Math.round((totalWords / effectiveSeconds) * 60);

  // Filler words detection
  const fillerAnalysis = useMemo(() => {
    const counts = {};
    let totalFillers = 0;
    const lower = allUserText.toLowerCase();

    FILLER_KEYWORDS.forEach((filler) => {
      const escaped = filler.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      const matches = lower.match(regex);
      if (matches) {
        counts[filler] = matches.length;
        totalFillers += matches.length;
      }
    });

    return { counts, totalFillers };
  }, [allUserText]);

  // STAR Method Analysis heuristics combined with rubric scores
  const starAnalysis = useMemo(() => {
    const lower = allUserText.toLowerCase();

    function scoreKeywordCluster(keywords, baseWeight) {
      let matches = 0;
      keywords.forEach((kw) => {
        if (lower.includes(kw)) matches++;
      });
      const ratio = Math.min(matches / 3, 1);
      const score = Math.round(baseWeight * 0.4 + ratio * 60);
      return Math.min(Math.max(score, 45), 98);
    }

    const baseWeight = overallPercentage || 70;

    const situation = scoreKeywordCluster(
      ["project", "when", "client", "context", "problem", "challenge", "company", "team"],
      baseWeight
    );
    const task = scoreKeywordCluster(
      ["goal", "objective", "needed to", "required", "responsible", "target", "task"],
      baseWeight
    );
    const action = scoreKeywordCluster(
      ["implemented", "designed", "created", "built", "configured", "refactored", "optimized", "used"],
      baseWeight
    );
    const result = scoreKeywordCluster(
      ["result", "outcome", "improved", "reduced", "increased", "%", "percent", "saved", "delivered", "latency"],
      baseWeight
    );

    return { situation, task, action, result };
  }, [allUserText, overallPercentage]);

  // Gauge circular ring math
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

  function formatTime(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const currentQ = questions[selectedQuestionTab] || questions[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Assessment Completed</span>
            </span>
            <span className="text-xs text-slate-400">
              {session?.targetRole || "Software Engineer"} · {session?.difficulty || "Medium"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Post-Interview Performance Scorecard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive rubric evaluation, STAR method breakdown, and vocal delivery telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs transition-colors cursor-pointer"
            title="Download Official PDF Report"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Download PDF</span>
          </button>

          {onRestart && (
            <button
              type="button"
              onClick={onRestart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>
          )}

          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <span>Save & Go to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* TOP KPI GRID: Overall Readiness Ring & Key Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Circular Overall Readiness Ring */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/50 via-slate-50 to-violet-50/30 dark:from-indigo-950/30 dark:via-slate-900 dark:to-violet-950/20 border border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center mb-3">
            <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 108 108">
              {/* Background track */}
              <circle
                cx="54"
                cy="54"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress ring */}
              <circle
                cx="54"
                cy="54"
                r={radius}
                className={`transition-all duration-1000 ease-out ${
                  overallPercentage >= 80
                    ? "stroke-emerald-500"
                    : overallPercentage >= 65
                    ? "stroke-indigo-600"
                    : overallPercentage >= 50
                    ? "stroke-amber-500"
                    : "stroke-rose-500"
                }`}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {overallPercentage}%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Readiness
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              {overallPercentage >= 85
                ? "Strong Hire Recommendation"
                : overallPercentage >= 70
                ? "Solid Technical Proficiency"
                : "Needs Targeted Practice"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scored {scoredQuestions.length} of {totalQuestions} questions ({averageScore.toFixed(1)}/10 avg)
            </p>
          </div>
        </div>

        {/* Card 2: STAR Method Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>STAR Method Coverage</span>
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">Target: &gt;75%</span>
          </div>

          <div className="space-y-3">
            {/* Situation */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold">S</strong>ituation (Context)
                </span>
                <span className="text-slate-600 dark:text-slate-400">{starAnalysis.situation}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${starAnalysis.situation}%` }}
                />
              </div>
            </div>

            {/* Task */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold">T</strong>ask (Objectives)
                </span>
                <span className="text-slate-600 dark:text-slate-400">{starAnalysis.task}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${starAnalysis.task}%` }}
                />
              </div>
            </div>

            {/* Action */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold">A</strong>ction (Implementation)
                </span>
                <span className="text-slate-600 dark:text-slate-400">{starAnalysis.action}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${starAnalysis.action}%` }}
                />
              </div>
            </div>

            {/* Result */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold">R</strong>esult (Metrics & Impact)
                </span>
                <span className="text-slate-600 dark:text-slate-400">{starAnalysis.result}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${starAnalysis.result}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Speech & Delivery Telemetry */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-rose-500" />
            <span>Speech & Delivery Telemetry</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Speaking Time</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                {formatTime(speakingSeconds)}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Cadence / WPM</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                {wpm} <span className="text-xs font-normal text-slate-400">wpm</span>
              </div>
            </div>
          </div>

          {/* Filler words breakdown */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Filler Words Count:
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  fillerAnalysis.totalFillers === 0
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : fillerAnalysis.totalFillers <= 3
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                }`}
              >
                {fillerAnalysis.totalFillers} detected
              </span>
            </div>

            {Object.keys(fillerAnalysis.counts).length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(fillerAnalysis.counts).map(([word, count]) => (
                  <span
                    key={word}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                  >
                    &ldquo;{word}&rdquo; ({count}x)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Exceptional vocal clarity! No common filler words detected.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE QUESTION REVIEW SECTION */}
      <div className="space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <span>Side-by-Side Question Review</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compare your spoken transcript directly against the AI recommended model answer.
            </p>
          </div>

          {/* Question Selector Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setSelectedQuestionTab(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedQuestionTab === idx
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Q{idx + 1} ({q.score !== null ? `${q.score}/10` : "Skip"})
              </button>
            ))}
          </div>
        </div>

        {currentQ && (
          <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Question {selectedQuestionTab + 1} · {currentQ.category}
                </span>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {currentQ.questionText}
                </h4>
              </div>

              {currentQ.score !== null ? (
                <div
                  className={`px-3 py-1.5 rounded-2xl text-xs font-extrabold ${
                    currentQ.score >= 8
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : currentQ.score >= 5
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                  }`}
                >
                  Score: {currentQ.score} / 10
                </div>
              ) : (
                <span className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  Skipped
                </span>
              )}
            </div>

            {/* Split Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Your Transcribed Answer */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Your Submitted Response</span>
                  </span>
                  <span>
                    {currentQ.answerText
                      ? `${currentQ.answerText.trim().split(/\s+/).filter(Boolean).length} words`
                      : "No response"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[140px]">
                  {currentQ.answerText || (
                    <span className="text-slate-400 italic">No answer provided for this question.</span>
                  )}
                </div>

                {currentQ.strengths?.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block mb-1.5">
                      Strengths Identified:
                    </span>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                      {currentQ.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: AI Model Answer & Improvements */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>AI Recommended Model Answer</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[140px]">
                  {currentQ.sampleAnswer || (
                    <span className="text-slate-400 italic">
                      Recommended structure: State the core principle, provide a production code/system example, and mention edge cases or tradeoffs.
                    </span>
                  )}
                </div>

                {/* Rubric Feedback & Missing Concepts */}
                {currentQ.correctnessFeedback && (
                  <div className="text-xs text-slate-700 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px] block mb-1">
                      Evaluator Notes:
                    </span>
                    <p>{currentQ.correctnessFeedback}</p>
                  </div>
                )}

                {currentQ.missingConcepts?.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block mb-1.5 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Missing Concepts to Include:</span>
                    </span>
                    <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                      {currentQ.missingConcepts.map((miss, idx) => (
                        <li key={idx}>{miss}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {/* Printable All-Questions Audit (visible only when printing PDF) */}
        <div className="hidden print:block space-y-6 pt-6 border-t border-slate-300">
          <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
            Complete Question-by-Question Audit
          </h3>
          {questions.map((q, idx) => (
            <div key={idx} className="print-card p-4 rounded-xl space-y-3 bg-white border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase text-indigo-700">
                  Question {idx + 1} ({q.category || "Technical Competency"})
                </span>
                <span className="font-bold text-xs">
                  Score: {q.score !== null ? `${q.score}/10` : "Skipped"}
                </span>
              </div>
              <p className="font-semibold text-sm text-slate-900">{q.questionText}</p>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-600 block">Candidate's Response:</span>
                <p className="text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 whitespace-pre-wrap">
                  {q.answerText || "No answer provided"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-indigo-700 block">Model Answer & Rubric:</span>
                <p className="text-xs text-slate-800 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100 whitespace-pre-wrap">
                  {q.sampleAnswer || "Standard technical breakdown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Return to Interview Prompt
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Download Official PDF</span>
          </button>

          <button
            type="button"
            onClick={onBackToDashboard}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Finish & Update Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
