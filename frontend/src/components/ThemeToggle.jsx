import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className = "" }) {
  // Always derive initial state from the actual DOM class applied by index.html / localStorage
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  // Synchronize across multiple toggle instances on the same page
  useEffect(() => {
    const handleSync = (e) => {
      if (typeof e.detail?.isDark === "boolean") {
        setIsDark(e.detail.isDark);
      }
    };
    window.addEventListener("interviewai_theme_changed", handleSync);
    return () => window.removeEventListener("interviewai_theme_changed", handleSync);
  }, []);

  function handleToggle() {
    // 1. Read true current state from DOM
    const currentlyDark = document.documentElement.classList.contains("dark");
    const nextDark = !currentlyDark;

    // 2. Immediate synchronous DOM update — changes instantaneously on the 1st click!
    const root = document.documentElement;
    if (nextDark) {
      root.classList.add("dark");
      localStorage.setItem("interviewai_theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("interviewai_theme", "light");
    }

    // 3. Update React state
    setIsDark(nextDark);

    // 4. Notify any sibling ThemeToggle instances
    window.dispatchEvent(
      new CustomEvent("interviewai_theme_changed", { detail: { isDark: nextDark } })
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer ${className}`}
      aria-label="Toggle dark/light theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform rotate-0 scale-100" />
      )}
    </button>
  );
}
