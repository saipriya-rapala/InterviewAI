import { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, Eye, EyeOff, Zap, KeyRound } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function AuthView({ onAuthSuccess, apiBaseUrl }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // "error" | "success"

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      let endpoint = "/api/auth/login";
      let bodyData = { email, password };

      if (mode === "register") {
        endpoint = "/api/auth/register";
        bodyData = { name, email, password };
      } else if (mode === "forgot") {
        endpoint = "/api/auth/reset-password";
        bodyData = { email, password };
      }

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      let data = {};
      const text = await response.text();
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }

      if (!response.ok) {
        throw new Error(data.message || data.detail || "Authentication failed.");
      }

      if (mode === "register") {
        setMessage({
          text: "Account created successfully! Please sign in with your credentials.",
          type: "success",
        });
        setMode("login");
        setPassword("");
      } else if (mode === "forgot") {
        setMessage({
          text: "Password reset successfully! Please sign in with your new password.",
          type: "success",
        });
        setMode("login");
        setPassword("");
      } else {
        localStorage.setItem("interviewai_token", data.token);
        onAuthSuccess(data);
      }
    } catch (err) {
      setMessage({
        text: err.message || "Unable to connect to the authentication server.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleOAuth(provider) {
    setMessage({
      text: `${provider} single sign-on is ready to connect with your enterprise OAuth client ID. Use email login for local practice.`,
      type: "info",
    });
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Brand Hero Panel (Left on desktop) */}
      <div className="relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 text-white overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                InterviewAI
              </span>
              <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-indigo-300/80 bg-indigo-900/60 px-2 py-0.5 rounded-full border border-indigo-700/50">
                v2.0
              </span>
            </div>
          </div>
          <div className="lg:hidden">
            <ThemeToggle className="text-white hover:bg-white/10" />
          </div>
        </div>

        <div className="relative z-10 my-12 lg:my-auto max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-medium mb-6">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Driven Mock Interviews & Live ATS Analytics</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.15] mb-6 max-w-lg">
            Master your next technical interview with confidence.
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
            Upload your resume once to unlock customized behavioral and technical interview questions, real-time voice speech analysis, and automated ATS readiness scores.
          </p>

          <div className="space-y-3.5 pt-2">
            {[
              "Resume-first parsing with interactive skill & project extraction",
              "Real-time voice speech-to-text with live response transcribing",
              "Instant rubric scoring: strengths, missed concepts, & ideal answers",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auth Form Card Panel (Right on desktop) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {/* Top desktop navigation / theme toggle */}
          <div className="hidden lg:flex justify-end mb-6">
            <ThemeToggle />
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-3xl p-8 sm:p-10 transition-all">
            {/* Segmented Switcher */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage({ text: "", type: "" });
                }}
                className={`py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer ${
                  mode === "login"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setMessage({ text: "", type: "" });
                }}
                className={`py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "register"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <span>Create Account</span>
                {mode === "login" && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 animate-pulse">
                    New User?
                  </span>
                )}
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                {mode === "forgot" && <KeyRound className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                {mode === "login"
                  ? "Welcome back"
                  : mode === "forgot"
                  ? "Reset Password"
                  : "Get started with InterviewAI"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {mode === "login"
                  ? "Enter your credentials to continue your prep session"
                  : mode === "forgot"
                  ? "Enter your email and new password to restore account access"
                  : "Start preparing for interviews with intelligent AI feedback"}
              </p>
            </div>

            {/* Social OAuth Buttons */}
            {mode !== "forgot" && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => handleOAuth("Google")}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={() => handleOAuth("GitHub")}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-medium border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            )}

            {mode !== "forgot" && (
              <div className="relative flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold whitespace-nowrap">
                  Or continue with email
                </span>
              </div>
            )}

            {/* Error or Success notification */}
            {message.text && (
              <div
                className={`p-3.5 rounded-2xl mb-5 text-sm flex flex-col gap-2 ${
                  message.type === "error"
                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                    : message.type === "success"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                    : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {message.type === "error" ? "⚠️" : message.type === "success" ? "✓" : "ℹ️"}
                  </div>
                  <div className="leading-snug">{message.text}</div>
                </div>

                {mode === "login" && message.type === "error" && (
                  <div className="pt-2 mt-0.5 border-t border-rose-200/60 dark:border-rose-900/60 flex items-center justify-between text-xs">
                    <span>New user?</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setMessage({ text: "", type: "" });
                      }}
                      className="font-bold underline hover:text-rose-900 dark:hover:text-rose-200 cursor-pointer"
                    >
                      Create Account now →
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    maxLength={100}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  maxLength={254}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {mode === "forgot" ? "New Password" : "Password"}
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setMessage({ text: "", type: "" });
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer bg-transparent border-none p-0"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "forgot" ? "Enter new password" : "••••••••"}
                    required
                    minLength={8}
                    maxLength={72}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm pr-10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === "login"
                        ? "Sign In to Dashboard"
                        : mode === "forgot"
                        ? "Reset & Update Password"
                        : "Create My Account"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom New User / Existing User Prompt */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              {mode === "forgot" ? (
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Remembered your password?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setMessage({ text: "", type: "" });
                    }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Back to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : mode === "login" ? (
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span>New to InterviewAI?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setMessage({ text: "", type: "" });
                    }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Create an account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setMessage({ text: "", type: "" });
                    }}
                    className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Sign in to your account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
