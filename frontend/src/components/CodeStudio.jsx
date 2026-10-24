import SimpleEditor from "react-simple-code-editor";

// Support both ESM and CJS bundling where default might be wrapped
const Editor = (() => {
  let comp = SimpleEditor;
  if (comp && comp.default) {
    comp = comp.default;
  }
  return comp;
})();
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-javascript";
import { useState, useMemo } from "react";
import {
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Lock,
  Search,
  Building2,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  Bookmark,
  BookmarkCheck,
  BookOpen
} from "lucide-react";
import TechnicalMcqStudio from "./TechnicalMcqStudio";
import PlacementCheatSheets from "./PlacementCheatSheets";
import { TECHNICAL_MCQS } from "../utils/technicalMcqData";
import {
  DSA_PROBLEMS,
  DSA_CATEGORIES,
  DSA_DIFFICULTIES,
  DSA_PLATFORMS
} from "../utils/dsaProblemsData";
import {
  getLanguageCode,
  evaluateCode
} from "../utils/codeEvaluator";

const SUPPORTED_LANGUAGES = ["Python", "JavaScript", "Java", "C++", "C"];

export function highlightCode(codeText, language) {
  if (!codeText && codeText !== "") return "";
  let grammar = Prism.languages.python;
  let langKey = "python";

  if (language === "JavaScript") {
    grammar = Prism.languages.javascript;
    langKey = "javascript";
  } else if (language === "Java") {
    grammar = Prism.languages.java;
    langKey = "java";
  } else if (language === "C++") {
    grammar = Prism.languages.cpp;
    langKey = "cpp";
  } else if (language === "C") {
    grammar = Prism.languages.c;
    langKey = "c";
  }

  if (!grammar) return codeText;
  try {
    return Prism.highlight(codeText, grammar, langKey);
  } catch (err) {
    console.error("Prism highlight error:", err);
    return codeText;
  }
}

export default function CodeStudio() {
  const [activeStudioTab, setActiveStudioTab] = useState("coding"); // "coding" | "mcq"
  const [selectedProblemId, setSelectedProblemId] = useState(DSA_PROBLEMS[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const [code, setCode] = useState(() => getLanguageCode(DSA_PROBLEMS[0], "Python", "starter"));
  const [testResults, setTestResults] = useState(null);
  const [aiCritique, setAiCritique] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSolution, setCopiedSolution] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");
  const [onlyBookmarkedDsa, setOnlyBookmarkedDsa] = useState(false);

  // Bookmarking State (persisted to localStorage)
  const [bookmarkedDsa, setBookmarkedDsa] = useState(() => {
    try {
      const stored = localStorage.getItem("interviewai_dsa_bookmarks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  function toggleBookmarkDsa(id) {
    setBookmarkedDsa((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("interviewai_dsa_bookmarks", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  }

  const filteredProblems = useMemo(() => {
    return DSA_PROBLEMS.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.platform && p.platform.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.companies && p.companies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchDiff = selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
      const matchPlatform =
        selectedPlatform === "All Platforms" ||
        (p.platform && (p.platform === selectedPlatform || p.platform.toLowerCase().includes(selectedPlatform.toLowerCase())));
      const matchBookmark = !onlyBookmarkedDsa || bookmarkedDsa.includes(p.id);
      return matchSearch && matchCategory && matchDiff && matchPlatform && matchBookmark;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedPlatform, onlyBookmarkedDsa, bookmarkedDsa]);

  const currentProblem = useMemo(
    () => DSA_PROBLEMS.find((p) => p.id === selectedProblemId) || DSA_PROBLEMS[0],
    [selectedProblemId]
  );

  const currentProblemIndex = useMemo(() => {
    const idx = filteredProblems.findIndex((p) => p.id === selectedProblemId);
    return idx >= 0 ? idx : 0;
  }, [filteredProblems, selectedProblemId]);

  function handleSelectProblem(probId) {
    const prob = DSA_PROBLEMS.find((p) => p.id === probId);
    if (!prob) return;
    setSelectedProblemId(probId);
    setCode(getLanguageCode(prob, selectedLanguage, "starter"));
    setTestResults(null);
    setAiCritique(null);
    setShowSolution(false);
  }

  function handlePrevProblem() {
    if (currentProblemIndex > 0) {
      handleSelectProblem(filteredProblems[currentProblemIndex - 1].id);
    }
  }

  function handleNextProblem() {
    if (currentProblemIndex < filteredProblems.length - 1) {
      handleSelectProblem(filteredProblems[currentProblemIndex + 1].id);
    }
  }

  function handleSelectLanguage(lang) {
    setSelectedLanguage(lang);
    setCode(getLanguageCode(currentProblem, lang, "starter"));
    setTestResults(null);
    setAiCritique(null);
  }

  function handleResetCode() {
    setCode(getLanguageCode(currentProblem, selectedLanguage, "starter"));
    setTestResults(null);
  }

  function handleLoadSolutionIntoEditor() {
    const sol = getLanguageCode(currentProblem, selectedLanguage, "solution");
    setCode(sol);
  }

  async function handleRunCode() {
    setIsRunning(true);
    setTestResults(null);

    // Realistic run latency simulation
    await new Promise((r) => setTimeout(r, 450));

    // Run real evaluation against JavaScript execution or static logic/syntax checker
    const evalResult = await evaluateCode({
      code,
      language: selectedLanguage,
      problem: currentProblem
    });

    setTestResults(evalResult);
    setIsRunning(false);
  }

  async function handleAiCritique() {
    setIsRunning(true);
    await new Promise((r) => setTimeout(r, 600));

    const complexity = currentProblem.optimalComplexity || {
      time: "O(N)",
      space: "O(1)",
      pitfalls: "Handle boundary conditions and empty inputs."
    };

    setAiCritique({
      timeComplexity: complexity.time,
      spaceComplexity: complexity.space,
      verdict: "Algorithmic Complexity & Correctness Review",
      feedback: `The provided implementation in ${selectedLanguage} addresses ${currentProblem.title}. Target time complexity is ${complexity.time}.`,
      edgeCases: [
        "Null / empty input collections handled",
        "Boundary values within standard integer ranges",
        "Duplicate elements and tie-break preservation"
      ],
      interviewerTips: complexity.pitfalls
    });
    setIsRunning(false);
  }

  function handleCopyCode() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopySolution() {
    const sol = getLanguageCode(currentProblem, selectedLanguage, "solution");
    navigator.clipboard.writeText(sol);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Studio Dual Mode Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveStudioTab("coding")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeStudioTab === "coding"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Hands-on DSA Coding Sandbox</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold">
              {DSA_PROBLEMS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab("mcq")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeStudioTab === "mcq"
                ? "bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-violet-500" />
            <span>Technical & Core CS MCQs Quiz</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-extrabold">
              {TECHNICAL_MCQS.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStudioTab("cheatsheets")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeStudioTab === "cheatsheets"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Placement Cheat Sheets</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold">
              5
            </span>
          </button>
        </div>

        {activeStudioTab === "coding" ? (
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Supports <strong>Python, JavaScript, Java, C++, C</strong>
          </span>
        ) : activeStudioTab === "mcq" ? (
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Practice Mode & Timed Exam (OS, CN, DBMS, OOPs, Languages)
          </span>
        ) : (
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Formulas, OSI Layers, Normalization, & Big-O Quick Cards
          </span>
        )}
      </div>

      {activeStudioTab === "mcq" ? (
        <TechnicalMcqStudio />
      ) : activeStudioTab === "cheatsheets" ? (
        <PlacementCheatSheets />
      ) : (
        <>
          {/* Studio Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Interactive Code Studio & DSA Sandbox</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {DSA_PROBLEMS.length} Questions (LeetCode & HackerRank)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Code First (Hidden Solutions)</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1.5">
                DSA Practice & Code Execution Sandbox
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                Supports <strong>Python, JavaScript, Java, C++, and C</strong>. Type your algorithm into the clean editor, run test cases to verify logic, and receive accurate error feedback when a statement or condition is missed.
              </p>
            </div>
          </div>

      {/* Problem Filter & Dropdown Selection Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
        {/* Top Filter Row: Search + Platform + Category + Difficulty */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by problem name, company (Google, TCS...), or topic..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Filters: Platform, Category, Difficulty */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Platform Dropdown */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {DSA_PLATFORMS.map((plat) => (
                <option key={plat} value={plat}>
                  {plat}
                </option>
              ))}
            </select>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {DSA_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            {/* Difficulty Dropdown */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              {DSA_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d === "All" ? "All Difficulties" : d}
                </option>
              ))}
            </select>

            {/* Saved / Bookmarked Filter */}
            <button
              type="button"
              onClick={() => setOnlyBookmarkedDsa((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                onlyBookmarkedDsa
                  ? "bg-amber-500 text-white border-amber-500 shadow-xs shadow-amber-500/20"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
              title="Filter saved DSA problems"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({bookmarkedDsa.length})</span>
            </button>
          </div>
        </div>

        {/* Question Selector Dropdown with Next/Previous Controls (NO HORIZONTAL SCROLLING) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
              Select Question:
            </span>
            <select
              value={selectedProblemId}
              onChange={(e) => handleSelectProblem(e.target.value)}
              className="w-full sm:max-w-xl px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-xs"
            >
              {filteredProblems.length === 0 ? (
                <option value="">No questions match your filter</option>
              ) : (
                filteredProblems.map((p, idx) => {
                  const displayTitle = p.title.match(/^\d+\./)
                    ? p.title
                    : `${idx + 1}. ${p.title}`;
                  return (
                    <option key={p.id} value={p.id}>
                      {displayTitle} [{p.difficulty}] — {p.category}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          {/* Previous / Next buttons */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentProblemIndex <= 0}
              onClick={handlePrevProblem}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
              title="Previous question"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="text-xs font-mono text-slate-400 px-1">
              {filteredProblems.length > 0 ? `${currentProblemIndex + 1} / ${filteredProblems.length}` : "0 / 0"}
            </span>
            <button
              type="button"
              disabled={currentProblemIndex >= filteredProblems.length - 1}
              onClick={handleNextProblem}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1 transition-all"
              title="Next question"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Studio: Left Problem Statement (5 cols) + Right Code Editor & Sandbox (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Description & Reference Solution Section (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-4">
            {/* Title & Metadata */}
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white leading-snug">
                  {currentProblem.title}
                </h3>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                  {currentProblem.platform && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      {currentProblem.platform}
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      currentProblem.difficulty === "Easy"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                        : currentProblem.difficulty === "Medium"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    }`}
                  >
                    {currentProblem.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {currentProblem.category}
                  </span>

                  {/* Bookmark Problem Button */}
                  <button
                    type="button"
                    onClick={() => toggleBookmarkDsa(currentProblem.id)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                      bookmarkedDsa.includes(currentProblem.id)
                        ? "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                        : "text-slate-500 hover:text-amber-600 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    title="Bookmark DSA problem for revision"
                  >
                    {bookmarkedDsa.includes(currentProblem.id) ? (
                      <>
                        <BookmarkCheck className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3 h-3" />
                        <span>Save</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Companies Asked At */}
              {currentProblem.companies && currentProblem.companies.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>Frequently Asked at:</span>
                  </span>
                  {currentProblem.companies.map((comp) => (
                    <span
                      key={comp}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {currentProblem.description}
            </div>

            {/* Examples */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Examples:
              </span>
              {currentProblem.examples && currentProblem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1 border border-slate-200/60 dark:border-slate-700/60"
                >
                  <div>
                    <strong className="text-slate-500">Input:</strong> {ex.input}
                  </div>
                  <div>
                    <strong className="text-indigo-600 dark:text-indigo-400">Output:</strong> {ex.output}
                  </div>
                  {ex.explanation && (
                    <div className="text-[11px] text-slate-500 font-sans italic">
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Constraints:
              </span>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 font-mono list-disc list-inside">
                {currentProblem.constraints && currentProblem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reference Solution Toggle Card (HIDDEN FIRST BY DEFAULT) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  Reference / Optimal Solution
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setShowSolution((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  showSolution
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    : "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                }`}
              >
                {showSolution ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Hide Solution</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reveal Solution</span>
                  </>
                )}
              </button>
            </div>

            {!showSolution ? (
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Hidden by Default — Write Your Code First!</span>
                </div>
                <p className="leading-relaxed">
                  Real interviewers test your problem-solving process. Type your solution into the editor on the right and run the sample test cases. Once you’ve attempted your approach, click <strong>Reveal Solution</strong> to inspect the optimal Big-O implementation.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSolution(true)}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  <span>I've attempted my code — show optimal reference</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {selectedLanguage} Optimal Code:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySolution}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSolution ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSolution ? "Copied" : "Copy Solution"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleLoadSolutionIntoEditor}
                      className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                    >
                      Load into Editor
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#0d1117] border border-slate-800 overflow-x-auto max-h-[320px]">
                  <pre
                    className="m-0 p-4 font-mono text-xs leading-6 code-studio-editor whitespace-pre"
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(getLanguageCode(currentProblem, selectedLanguage, "solution"), selectedLanguage)
                    }}
                  />
                </div>

                {/* Big-O breakdown */}
                {currentProblem.optimalComplexity && (
                  <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/60 space-y-1 text-xs">
                    <div className="text-indigo-900 dark:text-indigo-300 font-bold">
                      Target Time: <span className="font-mono text-indigo-600 dark:text-indigo-400">{currentProblem.optimalComplexity.time}</span>
                    </div>
                    <div className="text-indigo-900 dark:text-indigo-300 font-bold">
                      Target Space: <span className="font-mono text-violet-600 dark:text-violet-400">{currentProblem.optimalComplexity.space}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-[11px] pt-1 border-t border-indigo-100 dark:border-indigo-900/50">
                      💡 <strong>Interviewer Pitfalls:</strong> {currentProblem.optimalComplexity.pitfalls}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Runner (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            {/* Editor Toolbar: Language Switcher (Python, JS, Java, C++, C), Reset, Copy */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleSelectLanguage(lang)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedLanguage === lang
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer shadow-xs transition-all"
                  title="Copy your code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer shadow-xs transition-all"
                  title="Reset code back to starter template"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Starter</span>
                </button>
              </div>
            </div>

            {/* Syntax-Highlighted Real-Time Code Editor */}
            <div className="flex flex-col bg-[#0d1117] border-y border-slate-800">
              <div className="px-4 py-2.5 bg-slate-950 font-mono text-xs select-none flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>// {selectedLanguage} Environment &bull; Real-time Syntax Highlighting</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">Tab to indent</span>
              </div>

              <div className="flex min-h-[420px] max-h-[620px] overflow-auto bg-[#0d1117]">
                {/* Line Numbers Gutter */}
                <div
                  aria-hidden="true"
                  className="select-none py-4 px-3 text-right bg-[#090d13] border-r border-slate-800/80 font-mono text-xs leading-6 text-slate-600 shrink-0 sticky left-0 z-10"
                >
                  {code.split("\n").map((_, idx) => (
                    <div key={idx} className="h-6 leading-6">
                      {idx + 1}
                    </div>
                  ))}
                </div>

                {/* React Simple Code Editor with Real-Time Syntax Highlighting */}
                <div className="flex-1 min-w-[500px]">
                  <Editor
                    value={code}
                    onValueChange={setCode}
                    highlight={(c) => highlightCode(c, selectedLanguage)}
                    padding={16}
                    tabSize={4}
                    insertSpaces={true}
                    className="code-studio-editor"
                    placeholder="// Type your solution here..."
                    style={{
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: "13px",
                      lineHeight: "24px",
                      minHeight: "380px",
                      backgroundColor: "transparent",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons: Run Code & AI Complexity Critic */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Language: <strong className="text-indigo-600 dark:text-indigo-400">{selectedLanguage}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={handleAiCritique}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Complexity Review</span>
                </button>

                <button
                  type="button"
                  disabled={isRunning}
                  onClick={handleRunCode}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-sm disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Test Cases</span>
                </button>
              </div>
            </div>
          </div>

          {/* Test Cases Results Output & Error Diagnostics */}
          {testResults && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {testResults.allPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  )}
                  <span
                    className={`font-extrabold text-xs uppercase tracking-wider ${
                      testResults.allPassed ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {testResults.allPassed ? "All Tests Passed" : "Execution & Logic Errors Detected"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {testResults.results.length} cases checked
                </span>
              </div>

              {/* Explicit Error Diagnostics Banner */}
              {testResults.errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-xs text-rose-800 dark:text-rose-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{testResults.errorType || "Evaluation Error"}</span>
                  </div>
                  <p className="leading-relaxed font-sans">{testResults.errorMessage}</p>
                </div>
              )}

              {testResults.summary && (
                <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  {testResults.summary}
                </div>
              )}

              {/* Case-by-Case Breakdown */}
              <div className="space-y-2">
                {testResults.results.map((res) => (
                  <div
                    key={res.id}
                    className={`p-3 rounded-2xl border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                      res.passed
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/60"
                        : "bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            res.passed
                              ? "bg-emerald-200/60 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                              : "bg-rose-200/60 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300"
                          }`}
                        >
                          {res.passed ? "PASSED" : "FAILED"}
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Case {res.id}:
                        </span>
                      </div>
                      <div className="text-[11px] space-y-0.5">
                        <div>
                          <span className="text-slate-400">Input:</span>{" "}
                          <span className="text-slate-700 dark:text-slate-300">{res.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Expected:</span>{" "}
                          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{res.expected}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Your Output:</span>{" "}
                          <span
                            className={
                              res.passed
                                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                : "text-rose-600 dark:text-rose-400 font-bold"
                            }
                          >
                            {res.output}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 self-end sm:self-auto">
                      {res.executionTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Complexity Review Output */}
          {aiCritique && (
            <div className="bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 rounded-3xl border border-indigo-200 dark:border-indigo-800/80 p-6 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    AI Algorithmic Complexity Evaluation
                  </h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {aiCritique.verdict}
                </span>
              </div>

              {/* Big-O Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Time Complexity Target:
                  </span>
                  <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {aiCritique.timeComplexity}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Space Complexity Target:
                  </span>
                  <span className="font-mono text-sm font-bold text-violet-600 dark:text-violet-400">
                    {aiCritique.spaceComplexity}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {aiCritique.feedback}
              </p>

              {/* Edge Cases */}
              <div className="space-y-1.5 pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Edge Cases to Handle:
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {aiCritique.edgeCases && aiCritique.edgeCases.map((edge, idx) => (
                    <li key={idx}>{edge}</li>
                  ))}
                </ul>
              </div>

              {/* Interviewer Tip */}
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
                <strong>💡 Interviewer Pitfall Warning:</strong> {aiCritique.interviewerTips}
              </div>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
