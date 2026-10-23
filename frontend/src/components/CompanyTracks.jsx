import { useState, useMemo } from "react";
import {
  Building2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { COMPANY_TRACKS } from "../utils/companyTracksData";

export default function CompanyTracks({ onLaunchTrack }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [expandedTrackId, setExpandedTrackId] = useState("google");

  const filteredTracks = useMemo(() => {
    if (selectedFilter === "all") return COMPANY_TRACKS;
    if (selectedFilter === "faang") {
      return COMPANY_TRACKS.filter((t) => ["google", "amazon", "meta"].includes(t.id));
    }
    if (selectedFilter === "fintech") {
      return COMPANY_TRACKS.filter((t) => ["stripe", "microsoft"].includes(t.id));
    }
    if (selectedFilter === "services") {
      return COMPANY_TRACKS.filter((t) => ["tcs_infosys"].includes(t.id));
    }
    return COMPANY_TRACKS;
  }, [selectedFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Targeted Enterprise Preparation</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              FAANG & Top Tech Tracks
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
            Company-Specific Interview Tracks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Prepare for specific interview rubrics: Amazon Bar Raiser & 16 Leadership Principles, Google TrueTime & distributed systems, Stripe idempotent ledgers, or TCS/Infosys core CS.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold shrink-0">
          {[
            { id: "all", label: "All Companies" },
            { id: "faang", label: "FAANG / Top Tech" },
            { id: "fintech", label: "Fintech & Enterprise" },
            { id: "services", label: "IT Services / Campus" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTracks.map((track) => {
          const isExpanded = expandedTrackId === track.id;

          return (
            <div
              key={track.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
                {/* Card Top: Company Badge & Tier */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${track.accentColor} flex items-center justify-center text-white font-extrabold text-lg shadow-sm shrink-0`}
                    >
                      {track.company[0]}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {track.company}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate max-w-[180px]">
                        {track.tier}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${track.badgeColor}`}>
                    Active Track
                  </span>
                </div>

                {/* Tagline & Description */}
                <div>
                  <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 mb-1">
                    {track.tagline}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {track.description}
                  </p>
                </div>

                {/* Target Roles */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Target Roles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {track.targetRoles.map((role, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Core Competencies Checklist */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Evaluator Rubric:
                  </span>
                  <ul className="space-y-1">
                    {track.coreCompetencies.slice(0, 3).map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Question Preview Toggle */}
                {isExpanded && (
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Curated Track Questions:</span>
                    </span>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {track.sampleQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1"
                        >
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                            {q.type}
                          </span>
                          <p className="text-slate-700 dark:text-slate-200 text-[11px] leading-relaxed">
                            {q.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedTrackId(isExpanded ? "" : track.id)}
                  className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                >
                  {isExpanded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{isExpanded ? "Hide Preview" : "Preview Questions"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onLaunchTrack(track)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${track.accentColor} hover:opacity-95 shadow-sm transition-all cursor-pointer`}
                >
                  <span>Launch Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
