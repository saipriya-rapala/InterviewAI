import { useState, useEffect } from "react";
import {
  Mic,
  FileCheck,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  Play,
  Building2,
  Code2,
  Target,
  Download
} from "lucide-react";
import ReadinessReportModal from "./ReadinessReportModal";

import API from "../apiConfig";

async function readResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text, detail: text };
  }
}

export default function DashboardView({
  user,
  token,
  onNavigate,
  onSessionExpired
}) {
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadDashboardStats() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, sessionsRes] = await Promise.all([
          fetch(`${API}/api/profile`, { headers }),
          fetch(`${API}/api/interviews`, { headers }),
        ]);

        const [profileData, sessionsData] = await Promise.all([
          readResponse(profileRes),
          readResponse(sessionsRes),
        ]);

        if (ignore) return;

        if ([profileRes.status, sessionsRes.status].some((s) => s === 401 || s === 403)) {
          onSessionExpired();
          return;
        }

        if (profileRes.ok) setProfile(profileData);
        if (sessionsRes.ok && Array.isArray(sessionsData)) setSessions(sessionsData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      }
    }

    loadDashboardStats();
    return () => {
      ignore = true;
    };
  }, [token, onSessionExpired]);

  // Calculate Readiness Score metrics
  const hasResume = Boolean(profile?.resume);
  const skillCount = profile?.technicalSkills?.length || 0;
  const hasRole = Boolean(profile?.targetRole);
  const hasEducation = (profile?.education?.length || 0) > 0;

  let profileCompleteness = 20; // base account
  if (hasRole) profileCompleteness += 20;
  if (hasResume) profileCompleteness += 25;
  if (skillCount >= 3) profileCompleteness += 20;
  if (hasEducation) profileCompleteness += 15;

  const totalAnswered = sessions.reduce(
    (acc, s) => acc + (s.questions?.filter((q) => q.score !== null).length || 0),
    0
  );

  const scoredQuestions = sessions.flatMap((s) => s.questions || []).filter((q) => q.score !== null);
  const avgScore = scoredQuestions.length
    ? (scoredQuestions.reduce((a, b) => a + b.score, 0) / scoredQuestions.length).toFixed(1)
    : null;

  // Composite Readiness Score (0 - 100%)
  const scoreFactor = avgScore ? (Number(avgScore) / 10) * 50 : 25;
  const completenessFactor = (profileCompleteness / 100) * 50;
  const readinessScore = Math.min(100, Math.round(scoreFactor + completenessFactor));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Preparation Command Center</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || "Developer"}!
          </h2>
          <p className="text-slate-300 text-sm max-w-xl">
            Targeting: <strong className="text-white">{profile?.targetRole || "Software Engineer"}</strong> ({profile?.experienceLevel || "Mid-level"}). Keep your streak going with live voice simulation.
          </p>
        </div>

        {/* Quick stat chips */}
        <div className="relative z-10 flex items-center gap-3 flex-wrap">
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
            <div className="text-2xl font-black text-white">{sessions.length}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-300">Sessions</div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
            <div className="text-2xl font-black text-white">{totalAnswered}</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-300">Answered</div>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center min-w-[100px]">
            <div className="text-2xl font-black text-emerald-400">
              {avgScore ? `${avgScore}/10` : "—"}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-slate-300">Avg Score</div>
          </div>
        </div>
      </div>

      {/* QUICK ACTION CARDS & READINESS WIDGET (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD 1: Start Voice Mock Interview */}
        <div
          onClick={() => onNavigate("interview")}
          className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Voice Simulator
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Start Voice Mock Interview
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Practice answering out loud. Features live speech-to-text transcribing, timer, and AI rubric diagnostics.
              </p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Launch simulator</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 2: Resume ATS Review */}
        <div
          onClick={() => onNavigate("profile")}
          className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-violet-400 dark:hover:border-violet-600 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck className="w-6 h-6" />
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  hasResume
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                }`}
              >
                {hasResume ? "Resume Ingested" : "Needs Upload"}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Resume ATS Review & Tags
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ingest your resume to automatically extract core skills, target roles, and work experience as interactive tags.
              </p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between text-xs font-bold text-violet-600 dark:text-violet-400">
            <span>Manage resume profile</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* CARD 3: Readiness Score Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Readiness Score
                </span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {readinessScore}%
              </span>
            </div>

            {/* Circular / Progress visualizer */}
            <div className="space-y-3">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Profile Ingestion</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {hasResume ? "✓ Complete" : "Pending upload"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Catalog Skill Match</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {skillCount} extracted
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Average Rubric Accuracy</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {avgScore ? `${avgScore} / 10` : "No mocks yet"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:hover:bg-indigo-900/70 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Report (PDF)</span>
            </button>
            <div className="text-[10px] text-slate-400 text-center">
              Official verified evaluation certificate
            </div>
          </div>
        </div>
      </div>

      {/* ADVANCED ENTERPRISE CAREER TOOLS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Specialized Interview Prep Modules
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Module 1: Company Tracks */}
          <div
            onClick={() => onNavigate("tracks")}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  FAANG & Top Tech
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Company-Specific Tracks
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Tailored rubrics for Google, Amazon Bar Raiser (16 Principles), Meta, Stripe, and TCS/Infosys campus.
                </p>
              </div>
            </div>

            <div className="pt-5 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 border-t border-slate-100 dark:border-slate-800 mt-4">
              <span>Explore company tracks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 2: ATS Resume Matcher */}
          <div
            onClick={() => onNavigate("matcher")}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Google XYZ Rewriter
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  ATS Resume & JD Matcher
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Paste any job description to calculate keyword match compatibility and rewrite weak resume bullets with metrics.
                </p>
              </div>
            </div>

            <div className="pt-5 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 border-t border-slate-100 dark:border-slate-800 mt-4">
              <span>Optimize resume for JD</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Module 3: Live Code Editor & DSA Sandbox */}
          <div
            onClick={() => onNavigate("code")}
            className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Big-O Reviewer
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Live Code Studio & DSA
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Solve coding challenges in Python, Java, or JS. Run test cases with AI complexity critique ($O(N)$ vs $O(N^2)$).
                </p>
              </div>
            </div>

            <div className="pt-5 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 border-t border-slate-100 dark:border-slate-800 mt-4">
              <span>Open code sandbox</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT SESSIONS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Mock Interview Sessions
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("interview")}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Launch New Mock &rarr;
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Play className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No interview sessions recorded yet
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click &quot;Start Voice Mock Interview&quot; above to practice questions tailored to your target role.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase text-slate-400">
                  <th className="pb-3">Role / Focus</th>
                  <th className="pb-3">Difficulty</th>
                  <th className="pb-3">Questions</th>
                  <th className="pb-3">Average Score</th>
                  <th className="pb-3">Created</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sessions.slice(0, 5).map((s) => {
                  const answered = s.questions?.filter((q) => q.score !== null) || [];
                  const sessionAvg = answered.length
                    ? (answered.reduce((a, b) => a + b.score, 0) / answered.length).toFixed(1)
                    : null;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 font-semibold text-slate-900 dark:text-white">
                        {s.targetRole || "General Practice"}
                      </td>
                      <td className="py-3.5">
                        <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {s.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 text-xs text-slate-500">
                        {answered.length} / {s.questions?.length || 0} answered
                      </td>
                      <td className="py-3.5">
                        {sessionAvg ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {sessionAvg} / 10
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Incomplete</span>
                        )}
                      </td>
                      <td className="py-3.5 text-xs text-slate-400">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => onNavigate("interview")}
                          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Review &rarr;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showReportModal && (
        <ReadinessReportModal
          user={user}
          profile={profile}
          readinessScore={readinessScore}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
