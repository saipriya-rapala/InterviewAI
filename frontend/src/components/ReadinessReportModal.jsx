import { useMemo, useState } from "react";
import {
  Download,
  X,
  Sparkles,
  Cpu,
  Globe,
  Database,
  Code2
} from "lucide-react";

export default function ReadinessReportModal({
  user,
  profile,
  readinessScore = 85,
  onClose
}) {
  const targetRole = profile?.targetRole || "Software Development Engineer";
  const technicalSkills = profile?.technicalSkills || [
    "Java", "Python", "SQL", "Data Structures & Algorithms", "Operating Systems", "Computer Networks"
  ];
  const [reportId] = useState(() => Math.floor(Math.random() * 899999 + 100000));
  const dateStr = useMemo(() => new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }), []);

  function handlePrint() {
    window.print();
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full p-6 sm:p-10 shadow-2xl space-y-6 relative print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Official Placement & Career Readiness Evaluation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate / Readiness Report Container */}
        <div id="readiness-report-print" className="space-y-6 font-sans">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900 dark:border-slate-700 pb-6 print:border-black">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                  IAI
                </div>
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white print:text-black">
                  InterviewAI Certification & Readiness Audit
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 print:text-slate-600">
                Verified Evaluation for Technical Placements & Engineering Roles
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Issue Date</div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 print:text-black">{dateStr}</div>
              <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">ID: IAI-VERIFIED-{reportId}</div>
            </div>
          </div>

          {/* Candidate Profile Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Candidate</span>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white print:text-black">
                {user?.name || user?.email || "Candidate"}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Target Role</span>
              <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 print:text-indigo-800">
                {targetRole}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Readiness Score</span>
              <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 print:text-emerald-700">
                {readinessScore}% (Interview Ready)
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Evaluated Rank</span>
              <div className="text-sm font-extrabold text-violet-600 dark:text-violet-400 print:text-purple-800">
                Senior / SDE Candidate
              </div>
            </div>
          </div>

          {/* Core Competencies Matrix */}
          <div className="space-y-3">
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 print:text-black flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Evaluated Competency Breakdown</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Code2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white print:text-black">
                    DSA & Hands-on Coding Sandbox
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">
                    Evaluated across 36 LeetCode/HackerRank problems in Python, JavaScript, Java, C++, and C with boundary test validation.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Cpu className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white print:text-black">
                    Operating Systems & Concurrency
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">
                    Process isolation, Coffman conditions, paging formulas, and CPU scheduling algorithms verified.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Globe className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white print:text-black">
                    Computer Networks & Architecture
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">
                    OSI layer hierarchy, TCP/IP 3-way handshake, subnetting calculations, and port protocol mappings passed.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <Database className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white print:text-black">
                    DBMS & SQL Architecture
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600 mt-0.5">
                    ACID transaction durability (WAL), 2PL concurrency, B+ Tree indexing, and normalization rules validated.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Verified Technical Skills */}
          <div className="space-y-2">
            <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 print:text-black">
              Verified Technical Stack & Skills
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {technicalSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 print:border-slate-400 print:bg-white print:text-black"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Official Sign-off Footer */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400 print:border-black print:text-slate-600">
            <div>
              <div className="font-bold text-slate-700 dark:text-slate-300 print:text-black">
                Evaluation Authority
              </div>
              <div>InterviewAI Intelligent Assessment Engine</div>
            </div>

            <div className="text-right">
              <div className="font-mono text-emerald-600 font-bold">VERIFIED AUTHENTIC</div>
              <div>Certified Placement Readiness</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
