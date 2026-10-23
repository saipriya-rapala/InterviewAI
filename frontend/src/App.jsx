import { useEffect, useState, useCallback } from "react";
import AuthView from "./components/AuthView";
import DashboardView from "./components/DashboardView";
import CandidateProfile from "./components/CandidateProfile";
import VoiceSimulator from "./components/VoiceSimulator";
import QuestionDrills from "./components/QuestionDrills";
import CompanyTracks from "./components/CompanyTracks";
import AtsResumeMatcher from "./components/AtsResumeMatcher";
import CodeStudio from "./components/CodeStudio";
import ThemeToggle from "./components/ThemeToggle";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  Sparkles,
  LayoutDashboard,
  User,
  Mic,
  BookOpen,
  Building2,
  Target,
  Code2,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export default function App() {
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard" | "profile" | "interview" | "practice"
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("interviewai_token") || "");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState(() => {
    try {
      const cached = sessionStorage.getItem("interviewai_active_profile");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem("interviewai_token");
    setToken("");
    setUser(null);
    setActiveProfile(null);
  }, []);

  // Restore authenticated session on page load
  useEffect(() => {
    if (!token) return;

    let active = true;
    async function restoreSession() {
      try {
        const response = await fetch(`${API}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await readResponse(response);
        if (!response.ok) throw new Error(data.message || "Session expired.");
        if (active) setUser({ name: data.name, email: data.email });
      } catch {
        if (active) logout();
      }
    }

    restoreSession();
    return () => {
      active = false;
    };
  }, [token, logout]);

  // Not logged in -> Show Auth View
  if (!user) {
    return (
      <AuthView
        apiBaseUrl={API}
        onAuthSuccess={(data) => {
          setToken(data.token);
          setUser({ name: data.name, email: data.email });
        }}
      />
    );
  }

  // Logged In -> Show Modern App Shell
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shrink-0 shadow-xs">
        <div className="flex items-center gap-3 xl:gap-5 min-w-0 mr-2 sm:mr-4">
          <div
            onClick={() => {
              setActiveView("dashboard");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 dark:from-white dark:via-slate-100 dark:to-indigo-200 bg-clip-text text-transparent">
              InterviewAI
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold overflow-x-auto shrink min-w-0">
            <button
              type="button"
              onClick={() => setActiveView("dashboard")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === "dashboard"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("profile")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === "profile"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Candidate Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("interview")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === "interview"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice Simulator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("practice")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === "practice"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Question Drills</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("tracks")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === "tracks"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Company Tracks</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("matcher")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === "matcher"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>ATS Matcher</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveView("code")}
              className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeView === "code"
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code Studio</span>
            </button>
          </nav>
        </div>

        {/* User Badge, Theme Toggle & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs shrink-0 max-w-[130px] lg:max-w-[150px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">
              {user.name || user.email}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0 cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 animate-fadeIn shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveView("dashboard");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === "dashboard"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("profile");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === "profile"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Candidate Profile</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("interview");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === "interview"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voice Simulator</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("practice");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === "practice"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Question Drills</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("tracks");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === "tracks"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Company Tracks (FAANG)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("matcher");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === "matcher"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>ATS Resume & JD Matcher</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView("code");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold ${
              activeView === "code"
                ? "bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Live Code Studio & DSA</span>
          </button>
        </div>
      )}

      {/* Main Content Area Wrapped in ErrorBoundary */}
      <main className="flex-1 p-4 sm:p-8">
        <ErrorBoundary onReset={() => setActiveView("dashboard")}>
          {activeView === "dashboard" ? (
            <DashboardView
              user={user}
              token={token}
              onNavigate={(view) => setActiveView(view)}
              onSessionExpired={logout}
            />
          ) : activeView === "profile" ? (
            <CandidateProfile
              token={token}
              onSessionExpired={logout}
              onStartInterview={(p) => {
                if (p) setActiveProfile(p);
                setActiveView("interview");
              }}
              onProfileReset={() => setActiveProfile(null)}
            />
          ) : activeView === "interview" ? (
            <VoiceSimulator
              key={activeProfile ? `${activeProfile.id || ""}-${activeProfile.targetRole || ""}-${activeProfile.resume ? "resume" : "general"}` : "default"}
              token={token}
              activeProfile={activeProfile}
              onSessionExpired={logout}
              onBackToDashboard={() => setActiveView("dashboard")}
            />
          ) : activeView === "practice" ? (
            <QuestionDrills
              token={token}
              onSessionExpired={logout}
            />
          ) : activeView === "tracks" ? (
            <CompanyTracks
              onLaunchTrack={(track) => {
                const trackProfile = {
                  ...(activeProfile || {}),
                  targetRole: `${track.company} ${track.targetRoles[0]}`,
                  trackName: track.company,
                };
                setActiveProfile(trackProfile);
                setActiveView("interview");
              }}
            />
          ) : activeView === "matcher" ? (
            <AtsResumeMatcher
              activeProfile={activeProfile}
              onUpdateProfile={(updated) => setActiveProfile(updated)}
              onNavigateToSimulator={() => setActiveView("interview")}
            />
          ) : (
            <CodeStudio />
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
