import { useState, useMemo, useEffect, useCallback } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Lightbulb,
  Copy,
  Check,
  Search,
  Filter,
  BrainCircuit,
  Terminal,
  Trophy,
  Building2,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import {
  TECHNICAL_MCQS,
  MCQ_LANGUAGES,
  MCQ_COMPANIES
} from "../utils/technicalMcqData";

export default function TechnicalMcqStudio() {
  // Modes: 'practice' | 'timed' | 'results'
  const [mode, setMode] = useState("practice");

  // Filter States
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Bookmarking State (persisted to localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const stored = localStorage.getItem("interviewai_mcq_bookmarks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  function toggleBookmark(id) {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("interviewai_mcq_bookmarks", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
  }

  // Practice Mode State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [codeCopied, setCodeCopied] = useState(false);

  // Timed Exam Mode State
  const [timedExamQuestions, setTimedExamQuestions] = useState([]);
  const [timedExamIndex, setTimedExamIndex] = useState(0);
  const [timedAnswers, setTimedAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [examActive, setExamActive] = useState(false);

  // Filtered Questions for Practice Mode
  const filteredQuestions = useMemo(() => {
    return TECHNICAL_MCQS.filter((q) => {
      const matchLang = selectedLanguage === "All" || q.language === selectedLanguage;
      const matchDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      const matchCompany =
        selectedCompany === "All Companies" ||
        (q.companies && q.companies.includes(selectedCompany));
      const matchBookmark = !onlyBookmarked || bookmarkedIds.includes(q.id);
      const matchSearch =
        searchQuery.trim() === "" ||
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.code && q.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (q.companies && q.companies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchLang && matchDiff && matchCompany && matchBookmark && matchSearch;
    });
  }, [selectedLanguage, selectedDifficulty, selectedCompany, onlyBookmarked, bookmarkedIds, searchQuery]);

  // Safe index clamped to filteredQuestions range
  const safeQuestionIndex =
    filteredQuestions.length > 0 && currentQuestionIndex < filteredQuestions.length
      ? currentQuestionIndex
      : 0;

  const currentQuestion = filteredQuestions[safeQuestionIndex] || TECHNICAL_MCQS[0];

  // Practice Stats
  const practiceStats = useMemo(() => {
    let answeredCount = 0;
    let correctCount = 0;

    filteredQuestions.forEach((q) => {
      if (userAnswers[q.id] !== undefined) {
        answeredCount++;
        if (userAnswers[q.id] === q.correctIndex) {
          correctCount++;
        }
      }
    });

    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    return { answeredCount, correctCount, accuracy, total: filteredQuestions.length };
  }, [filteredQuestions, userAnswers]);

  // Timed Exam Timer
  const submitTimedExam = useCallback(() => {
    setExamActive(false);
    setMode("results");
  }, []);

  useEffect(() => {
    let timer;
    if (mode === "timed" && examActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            submitTimedExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, examActive, timeLeft, submitTimedExam]);

  // Start Timed Exam
  function startTimedExam() {
    // Pick 10 random questions (or all if < 10)
    const shuffled = [...TECHNICAL_MCQS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setTimedExamQuestions(selected);
    setTimedExamIndex(0);
    setTimedAnswers({});
    setTimeLeft(300); // 5 mins
    setExamActive(true);
    setMode("timed");
  }

  function handleSelectOption(optionIndex) {
    if (mode === "practice") {
      // In practice mode, record answer for current question
      if (!currentQuestion) return;
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: optionIndex
      }));
    } else if (mode === "timed") {
      const activeQ = timedExamQuestions[timedExamIndex];
      if (!activeQ) return;
      setTimedAnswers((prev) => ({
        ...prev,
        [activeQ.id]: optionIndex
      }));
    }
  }

  function handleCopyCode(codeText) {
    if (!codeText) return;
    navigator.clipboard.writeText(codeText);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  function handleResetPractice() {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  }

  function handleRandomQuestion() {
    if (filteredQuestions.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * filteredQuestions.length);
    if (nextIdx === currentQuestionIndex) {
      nextIdx = (nextIdx + 1) % filteredQuestions.length;
    }
    setCurrentQuestionIndex(nextIdx);
  }

  // Formatting timer display mm:ss
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Language Color Scheme Helper
  function getLangColor(lang) {
    switch (lang) {
      case "Python":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "JavaScript":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Java":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      case "C++":
        return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
      case "C":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
      case "SQL":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "DSA & Algorithms":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "Operating Systems (OS)":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Computer Networks (CN)":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "DBMS & Database Architecture":
        return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
      case "OOPs & Software Design":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
    }
  }

  function getDiffColor(diff) {
    switch (diff) {
      case "Beginner":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Intermediate":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "Advanced":
        return "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 flex items-center gap-1.5">
              <BrainCircuit className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Technical Languages & Core CS Subjects Arena</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {TECHNICAL_MCQS.length} Core Subjects & Placement Traps
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              OS • CN • DBMS • OOPs • Languages
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Core CS Subjects & Technical Output Prediction Assessment
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Prepare for campus placements, technical interviews, and GATE with high-frequency MCQs across <strong>Operating Systems, Computer Networks, DBMS, OOPs, Software Engineering</strong>, and programming languages.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode("practice");
              setExamActive(false);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === "practice"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Practice Mode</span>
          </button>

          <button
            type="button"
            onClick={startTimedExam}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              mode === "timed" || mode === "results"
                ? "bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timed Challenge (10 Qs)</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PRACTICE MODE VIEW */}
      {/* ========================================================= */}
      {mode === "practice" && (
        <div className="space-y-5">
          {/* Filters & Control Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs space-y-3">
            {/* Row 1: Search & Dropdown Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search company (TCS, Infosys...), concept, or snippet..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {/* Company + Language + Difficulty Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />

                {/* Company Filter */}
                <select
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  {MCQ_COMPANIES.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>

                {/* Domain / Language Filter */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  {MCQ_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === "All" ? "All Domains" : lang}
                    </option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                {/* Saved / Bookmark Filter */}
                <button
                  type="button"
                  onClick={() => setOnlyBookmarked((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    onlyBookmarked
                      ? "bg-amber-500 text-white border-amber-500 shadow-xs shadow-amber-500/20"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60"
                  }`}
                  title="Filter bookmarked questions"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved ({bookmarkedIds.length})</span>
                </button>
              </div>
            </div>

            {/* Row 2: Question Dropdown Navigator & Stats Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Question Dropdown Selector */}
              <div className="flex items-center gap-2 flex-1 max-w-xl">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                  Jump to Question:
                </span>
                <select
                  value={safeQuestionIndex}
                  onChange={(e) => setCurrentQuestionIndex(Number(e.target.value))}
                  className="flex-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none truncate cursor-pointer"
                >
                  {filteredQuestions.map((q, idx) => {
                    const isAnswered = userAnswers[q.id] !== undefined;
                    const isCorrect = isAnswered && userAnswers[q.id] === q.correctIndex;
                    const mark = isAnswered ? (isCorrect ? "✓ " : "✗ ") : "";
                    return (
                      <option key={q.id} value={idx}>
                        {mark}Q{idx + 1}. {q.topic}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Practice Progress Stats */}
              <div className="flex items-center gap-3 self-end md:self-auto text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Solved:{" "}
                  <strong className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {practiceStats.answeredCount}/{practiceStats.total}
                  </strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <span className="text-slate-500 dark:text-slate-400">
                  Accuracy:{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {practiceStats.accuracy}%
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={handleResetPractice}
                  title="Reset practice progress"
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Question Card */}
          {filteredQuestions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-12 text-center">
              <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                No MCQs match your filter
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try selecting "All Languages" or clearing your search keywords.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
              {/* Question Meta Header */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getLangColor(
                      currentQuestion.language
                    )}`}
                  >
                    {currentQuestion.language}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getDiffColor(
                      currentQuestion.difficulty
                    )}`}
                  >
                    {currentQuestion.difficulty}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Topic: {currentQuestion.topic}
                  </span>
                </div>

                {/* Question index indicator & actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(currentQuestion.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      bookmarkedIds.includes(currentQuestion.id)
                        ? "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
                        : "text-slate-500 hover:text-amber-600 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    title="Bookmark question for revision"
                  >
                    {bookmarkedIds.includes(currentQuestion.id) ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRandomQuestion}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Random</span>
                  </button>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                    Question {safeQuestionIndex + 1} of {filteredQuestions.length}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-2">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQuestion.question}
                </h4>

                {/* Company Tags */}
                {currentQuestion.companies && currentQuestion.companies.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Asked in:</span>
                    </span>
                    {currentQuestion.companies.map((comp) => (
                      <span
                        key={comp}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Code Snippet Box (If present) */}
              {currentQuestion.code && (
                <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-inner">
                  <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-slate-400 text-xs">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-mono text-[11px] text-slate-300">
                        {currentQuestion.language} Snippet
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(currentQuestion.code)}
                      className="flex items-center gap-1 text-[11px] hover:text-white transition-colors cursor-pointer"
                    >
                      {codeCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed">
                    <code>{currentQuestion.code}</code>
                  </pre>
                </div>
              )}

              {/* Options Grid */}
              <div className="space-y-2.5">
                {currentQuestion.options.map((option, optIdx) => {
                  const hasAnswered = userAnswers[currentQuestion.id] !== undefined;
                  const isSelected = userAnswers[currentQuestion.id] === optIdx;
                  const isCorrect = optIdx === currentQuestion.correctIndex;

                  let optionStyle =
                    "border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-slate-900/60";
                  let badgeStyle =
                    "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";

                  if (hasAnswered) {
                    if (isCorrect) {
                      optionStyle =
                        "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs";
                      badgeStyle = "bg-emerald-500 text-white font-bold";
                    } else if (isSelected && !isCorrect) {
                      optionStyle =
                        "border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 shadow-xs";
                      badgeStyle = "bg-rose-500 text-white font-bold";
                    } else {
                      optionStyle =
                        "opacity-60 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30";
                    }
                  }

                  const letterLabel = ["A", "B", "C", "D"][optIdx] || optIdx + 1;

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span
                          className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${badgeStyle}`}
                        >
                          {letterLabel}
                        </span>
                        <span className="font-mono text-xs leading-relaxed">{option}</span>
                      </div>

                      {hasAnswered && (
                        <div className="shrink-0 flex items-center gap-1.5">
                          {isCorrect && (
                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>Correct</span>
                            </span>
                          )}
                          {isSelected && !isCorrect && (
                            <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold text-xs">
                              <XCircle className="w-4 h-4 text-rose-500" />
                              <span>Your Choice</span>
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Detailed Technical Explanation (Revealed when answered) */}
              {userAnswers[currentQuestion.id] !== undefined && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 to-violet-50/80 dark:from-indigo-950/40 dark:to-violet-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    <Lightbulb className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>Technical Architecture & Runtime Breakdown:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-6">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Prev / Next Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={safeQuestionIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-slate-400">
                  {safeQuestionIndex + 1} / {filteredQuestions.length}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(filteredQuestions.length - 1, prev + 1)
                    )
                  }
                  disabled={safeQuestionIndex === filteredQuestions.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs shadow-indigo-500/20"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TIMED EXAM MODE VIEW */}
      {/* ========================================================= */}
      {mode === "timed" && (
        <div className="space-y-5">
          {/* Top Exam Status Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Technical Aptitude Exam in Progress
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  10 randomized questions across all supported programming languages.
                </p>
              </div>
            </div>

            {/* Timer and Submit Action */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold border ${
                  timeLeft <= 60
                    ? "bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <button
                type="button"
                onClick={submitTimedExam}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs shadow-rose-500/20"
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Exam Question Card */}
          {timedExamQuestions.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-6">
              {/* Question Meta */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getLangColor(
                      timedExamQuestions[timedExamIndex].language
                    )}`}
                  >
                    {timedExamQuestions[timedExamIndex].language}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Topic: {timedExamQuestions[timedExamIndex].topic}
                  </span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Question {timedExamIndex + 1} of {timedExamQuestions.length}
                </span>
              </div>

              {/* Question Text */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {timedExamQuestions[timedExamIndex].question}
              </h4>

              {/* Code Snippet if present */}
              {timedExamQuestions[timedExamIndex].code && (
                <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-inner">
                  <div className="px-3.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-300">
                    {timedExamQuestions[timedExamIndex].language} Snippet
                  </div>
                  <pre className="p-4 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed">
                    <code>{timedExamQuestions[timedExamIndex].code}</code>
                  </pre>
                </div>
              )}

              {/* Option Choices (no answers revealed until exam finish) */}
              <div className="space-y-2.5">
                {timedExamQuestions[timedExamIndex].options.map((option, optIdx) => {
                  const currentQId = timedExamQuestions[timedExamIndex].id;
                  const isSelected = timedAnswers[currentQId] === optIdx;
                  const letterLabel = ["A", "B", "C", "D"][optIdx];

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 text-xs sm:text-sm font-medium ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {letterLabel}
                      </span>
                      <span className="font-mono text-xs leading-relaxed">{option}</span>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Bar inside exam */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setTimedExamIndex((prev) => Math.max(0, prev - 1))}
                  disabled={timedExamIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Question dots indicator */}
                <div className="flex items-center gap-1.5">
                  {timedExamQuestions.map((q, idx) => {
                    const isAnswered = timedAnswers[q.id] !== undefined;
                    const isCurrent = idx === timedExamIndex;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setTimedExamIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                          isCurrent
                            ? "ring-2 ring-indigo-500 bg-indigo-600 scale-125"
                            : isAnswered
                            ? "bg-indigo-400 dark:bg-indigo-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                        title={`Go to Question ${idx + 1}`}
                      />
                    );
                  })}
                </div>

                {timedExamIndex === timedExamQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={submitTimedExam}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-xs shadow-emerald-500/20"
                  >
                    <span>Finish & Review</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setTimedExamIndex((prev) =>
                        Math.min(timedExamQuestions.length - 1, prev + 1)
                      )
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs shadow-indigo-500/20"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TIMED EXAM RESULTS & REVIEW VIEW */}
      {/* ========================================================= */}
      {mode === "results" && (
        <div className="space-y-6">
          {/* Result Score Card */}
          {(() => {
            let correctCount = 0;
            timedExamQuestions.forEach((q) => {
              if (timedAnswers[q.id] === q.correctIndex) {
                correctCount++;
              }
            });
            const total = timedExamQuestions.length || 1;
            const pct = Math.round((correctCount / total) * 100);

            let rank = "Beginner Developer";
            let rankColor = "text-amber-600 dark:text-amber-400";
            if (pct >= 80) {
              rank = "Senior Software Engineer";
              rankColor = "text-emerald-600 dark:text-emerald-400";
            } else if (pct >= 60) {
              rank = "Intermediate Software Engineer";
              rankColor = "text-indigo-600 dark:text-indigo-400";
            }

            return (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        Exam Scorecard & Performance Review
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Evaluated against {total} technical output prediction and internals questions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={startTimedExam}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs shadow-indigo-500/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Exam</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("practice")}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      Back to Practice
                    </button>
                  </div>
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Score
                    </span>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                      {correctCount} / {total}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Accuracy
                    </span>
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {pct}%
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 col-span-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Evaluated Rank
                    </span>
                    <div className={`text-base sm:text-lg font-black mt-0.5 ${rankColor}`}>
                      {rank}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Breakdown Review of all questions in exam */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Detailed Question-by-Question Review
            </h4>

            {timedExamQuestions.map((q, idx) => {
              const selectedOpt = timedAnswers[q.id];
              const isCorrect = selectedOpt === q.correctIndex;
              const hasAnswered = selectedOpt !== undefined;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border bg-white dark:bg-slate-900 space-y-4 shadow-xs ${
                    isCorrect
                      ? "border-emerald-300 dark:border-emerald-900"
                      : "border-rose-300 dark:border-rose-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">Q{idx + 1}.</span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getLangColor(
                          q.language
                        )}`}
                      >
                        {q.language}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {q.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct (+1)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
                          <XCircle className="w-4 h-4" />
                          <span>{hasAnswered ? "Incorrect" : "Unanswered"} (0)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {q.question}
                  </p>

                  {q.companies && q.companies.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-indigo-400" />
                        <span>Asked in:</span>
                      </span>
                      {q.companies.map((comp) => (
                        <span
                          key={comp}
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Code snippet if present */}
                  {q.code && (
                    <div className="rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 p-3 font-mono text-xs text-indigo-200">
                      <code>{q.code}</code>
                    </div>
                  )}

                  {/* Options status */}
                  <div className="space-y-1.5 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isUserPick = selectedOpt === optIdx;
                      const isAnswer = q.correctIndex === optIdx;

                      let style =
                        "border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400";
                      if (isAnswer) {
                        style =
                          "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold";
                      } else if (isUserPick && !isAnswer) {
                        style =
                          "border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-semibold";
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 font-mono ${style}`}
                        >
                          <span>{opt}</span>
                          <span className="shrink-0 text-[10px] uppercase font-bold">
                            {isAnswer && "✓ Correct Answer"}
                            {isUserPick && !isAnswer && "✗ Your Pick"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-indigo-600 dark:text-indigo-400">
                      Why this happens:{" "}
                    </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
