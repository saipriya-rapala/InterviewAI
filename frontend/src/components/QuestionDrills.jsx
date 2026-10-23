import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Sparkles,
  Clock,
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  Shuffle,
  Eye,
  EyeOff,
  Send,
  Zap,
  Volume2,
  VolumeX,
  Layers,
  HelpCircle,
  Code2,
  ShieldCheck,
} from "lucide-react";

import API from "../apiConfig";

const TOPICS = [
  { id: "All", label: "All Topics", icon: Layers },
  { id: "Behavioral", label: "Behavioral", icon: Sparkles },
  { id: "Frontend", label: "Frontend", icon: Zap },
  { id: "Backend", label: "Backend", icon: Layers },
  { id: "System Design", label: "System Design", icon: Award },
  { id: "DSA", label: "DSA", icon: HelpCircle },
];

import {
  DRILL_LANGUAGES,
  INITIAL_CURATED_DRILLS,
  generateDynamicDrill,
} from "../utils/drillsData";

async function readResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text, detail: text };
  }
}

export default function QuestionDrills({ token, onSessionExpired }) {
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedRound, setSelectedRound] = useState("All"); // "All" | "TR" | "HR"
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showModelAnswer, setShowModelAnswer] = useState(false);

  // Rapid-Fire Mode (60 seconds)
  const [rapidFireActive, setRapidFireActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  // Audio / Speech-to-Text
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  // Evaluation state
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [drillsCompleted, setDrillsCompleted] = useState(0);

  // Custom AI-generated drills pool
  const [customDrills, setCustomDrills] = useState([]);
  const allDrills = useMemo(() => [...customDrills, ...INITIAL_CURATED_DRILLS], [customDrills]);

  // Filter questions by Topic, Language, Round Type (TR/HR), and Difficulty
  const filteredQuestions = useMemo(() => {
    const matched = allDrills.filter((q) => {
      const matchTopic = selectedTopic === "All" || q.topic === selectedTopic;
      const matchLang = selectedLanguage === "All" || q.language === selectedLanguage;
      const matchRound = selectedRound === "All" || q.roundType === selectedRound;
      const matchDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      return matchTopic && matchLang && matchRound && matchDiff;
    });

    if (matched.length > 0) return matched;

    // Graceful fallback: If exact 4-way filter yields 0 cards, preserve chosen language and round
    const relaxed = allDrills.filter((q) => {
      const matchLang = selectedLanguage === "All" || q.language === selectedLanguage;
      const matchRound = selectedRound === "All" || q.roundType === selectedRound;
      return matchLang && matchRound;
    });
    return relaxed.length > 0 ? relaxed : allDrills;
  }, [allDrills, selectedTopic, selectedLanguage, selectedRound, selectedDifficulty]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const switchQuestion = useCallback(
    (newIdx) => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
      }
      setCurrentIndex(newIdx);
      setAnswerText("");
      setShowHint(false);
      setShowModelAnswer(false);
      setEvaluation(null);
      setTimeLeft(60);
      setTimerRunning(rapidFireActive);
    },
    [rapidFireActive]
  );

  // Dynamic on-demand AI drill synthesis
  const handleGenerateAiDrill = useCallback(() => {
    const targetLang = selectedLanguage === "All" ? "Java" : selectedLanguage;
    const targetRound = selectedRound === "All" ? "TR" : selectedRound;
    const targetTopic = selectedTopic === "All" ? "Backend" : selectedTopic;
    const targetDiff = selectedDifficulty === "All" ? "Hard" : selectedDifficulty;

    const newDrill = generateDynamicDrill(targetLang, targetTopic, targetRound, targetDiff);
    setCustomDrills((prev) => [newDrill, ...prev]);
    switchQuestion(0);
  }, [selectedLanguage, selectedRound, selectedTopic, selectedDifficulty, switchQuestion]);

  // 60-Second Rapid-Fire countdown timer
  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  // Speech recognition setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + " ";
          }
        }
        if (final) {
          setAnswerText((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
        }
      };

      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  function toggleSpeech() {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  }

  function toggleReadAloud(text) {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#$`]/g, ""));
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  }

  // Handle instant AI drill evaluation
  const handleEvaluateAnswer = useCallback(async () => {
    if (!answerText.trim() || !currentQ) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setEvaluating(true);
    setEvaluation(null);

    try {
      let backendEvaluation = null;
      try {
        const res = await fetch(`${API}/api/evaluate`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId: 1,
            questionText: currentQ.questionText,
            category: currentQ.topic,
            difficulty: currentQ.difficulty,
            answer: answerText,
            targetRole: "Software Engineer",
          }),
        });
        if (res.status === 401 || res.status === 403) {
          onSessionExpired?.();
          return;
        }
        if (res.ok) {
          backendEvaluation = await readResponse(res);
        }
      } catch {
        // Fallback to local heuristic evaluator below
      }

      const words = answerText.trim().split(/\s+/).filter(Boolean).length;
      let score = 5;
      const strengthsList = [];
      const improvementsList = [];

      if (words >= 40) {
        score += 3;
        strengthsList.push("Thorough technical explanation with solid depth.");
      } else if (words >= 20) {
        score += 1.5;
        strengthsList.push("Clear and concise response.");
      } else {
        improvementsList.push("Answer is brief; elaborate with specific architectural details or STAR examples.");
      }

      const modelKeywords = (currentQ?.modelAnswer || "")
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 4);

      const userLower = answerText.toLowerCase();
      const matched = modelKeywords.filter((kw) => userLower.includes(kw));

      if (matched.length >= 3) {
        score += 2;
        strengthsList.push("Accurately highlighted key industry terminology.");
      } else {
        improvementsList.push(`Consider addressing core concepts: ${currentQ?.missingConcepts?.[0] || "edge cases and performance trade-offs"}.`);
      }

      const finalScore = Math.min(Math.round(score), 10);
      const consolidatedEvaluation = {
        score: backendEvaluation?.score || finalScore,
        strengths: backendEvaluation?.strengths?.length
          ? backendEvaluation.strengths
          : strengthsList.length
          ? strengthsList
          : currentQ?.strengths || ["Coherent thought process"],
        missingConcepts: backendEvaluation?.missingConcepts?.length
          ? backendEvaluation.missingConcepts
          : improvementsList.length
          ? improvementsList
          : currentQ?.missingConcepts || ["Trade-offs under high load"],
        feedback:
          backendEvaluation?.correctnessFeedback ||
          (finalScore >= 8
            ? "Excellent response! You demonstrated strong technical command and articulated key principles effectively."
            : finalScore >= 6
            ? "Solid answer with good fundamentals. Adding concrete metrics and edge cases will elevate your response."
            : "Good effort. Review the recommended model flashcard to bridge the missing conceptual gaps."),
      };

      setEvaluation(consolidatedEvaluation);
      setDrillsCompleted((prev) => prev + 1);
    } finally {
      setEvaluating(false);
    }
  }, [answerText, currentQ, isRecording, token, onSessionExpired]);

  function handleNext() {
    const nextIdx = currentIndex < filteredQuestions.length - 1 ? currentIndex + 1 : 0;
    switchQuestion(nextIdx);
  }

  function handlePrev() {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : filteredQuestions.length - 1;
    switchQuestion(prevIdx);
  }

  function handleShuffle() {
    const randomIdx = Math.floor(Math.random() * filteredQuestions.length);
    switchQuestion(randomIdx);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Interactive Flashcards & Drills
            </span>
            <span className="text-xs text-slate-400">
              {drillsCompleted} drill{drillsCompleted === 1 ? "" : "s"} completed this session
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Rapid Question Drills
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Choose your language stack and round (TR vs HR) to drill questions with instant AI feedback.
          </p>
        </div>

        {/* Action Controls: Generate AI Drill & 60s Rapid-Fire */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleGenerateAiDrill}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-sm shadow-indigo-500/25 transition-all cursor-pointer"
            title="Synthesize a brand-new AI question for this language"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>+ Generate AI Drill ({selectedLanguage === "All" ? "Adaptive" : selectedLanguage})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nextState = !rapidFireActive;
              setRapidFireActive(nextState);
              setTimeLeft(60);
              setTimerRunning(nextState);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
              rapidFireActive
                ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-amber-500/25 ring-2 ring-amber-400/40"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Clock className={`w-4 h-4 ${rapidFireActive ? "animate-spin" : "text-amber-500"}`} />
            <span>{rapidFireActive ? "60s Rapid-Fire Active" : "Enable 60s Rapid-Fire"}</span>
          </button>
        </div>
      </div>

      {/* COMPREHENSIVE FILTER PANEL: LANGUAGE + ROUND (TR/HR) + TOPIC + DIFFICULTY */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
        {/* Row 1: Language Stack Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
            <Code2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Language Stack:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {DRILL_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setSelectedLanguage(lang);
                  switchQuestion(0);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Topic Pills */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 shrink-0">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>Topic Category:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic.id;
              const Icon = topic.icon;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(topic.id);
                    switchQuestion(0);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{topic.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 2: Round Type Selector (All vs TR vs HR) & Difficulty */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
              Round Focus:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setSelectedRound("All");
                  switchQuestion(0);
                }}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedRound === "All"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Rounds
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRound("TR");
                  switchQuestion(0);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedRound === "TR"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>💻 TR (Technical)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRound("HR");
                  switchQuestion(0);
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedRound === "HR"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>🤝 HR (Behavioral)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1">
              Difficulty:
            </span>
            {["All", "Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => {
                  setSelectedDifficulty(diff);
                  switchQuestion(0);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-bold"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN FLASHCARD INTERFACE */}
      {currentQ ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-6">
          {/* Card Top Nav: Category, Card Number, Shuffle, 60s countdown */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {currentQ.language && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-xs">
                  {currentQ.language}
                </span>
              )}
              {currentQ.roundType && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  {currentQ.roundType === "TR" ? "💻 TR Round" : "🤝 HR Round"}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {currentQ.topic}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {currentQ.difficulty}
              </span>
              {currentQ.isHighFrequency && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>⭐ Mostly Expected in Interviews</span>
                </span>
              )}
              {currentQ.isAiGenerated && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  ✨ AI Synthesized
                </span>
              )}
              <span className="text-xs text-slate-400 ml-1">
                Card {currentIndex + 1} of {filteredQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleGenerateAiDrill}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xs transition-all cursor-pointer"
                title="Synthesize another unique AI question for this language"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>+ More Questions</span>
              </button>

              {rapidFireActive && (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-colors ${
                    timeLeft <= 10
                      ? "bg-rose-50 text-rose-600 border-rose-300 dark:bg-rose-950/50 dark:text-rose-400 animate-pulse"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleShuffle}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Shuffle Random Drill"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Question Text with Read Aloud */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.questionText}
              </h3>
              <button
                type="button"
                onClick={() => toggleReadAloud(currentQ.questionText)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors shrink-0 cursor-pointer"
                title={isSpeaking ? "Stop Voice" : "Listen Aloud"}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4 text-indigo-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {showHint && currentQ.hint && (
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200 text-xs sm:text-sm animate-fadeIn">
                <strong className="font-bold">Interviewer Hint: </strong>
                {currentQ.hint}
              </div>
            )}
          </div>

          {/* User Answer Area & Voice Recording */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Your Answer / Response
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {showHint ? "Hide Hint" : "Need a Hint?"}
                </button>

                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isRecording
                      ? "bg-rose-500 text-white shadow-xs animate-pulse"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-indigo-500" />}
                  <span>{isRecording ? "Recording..." : "Speak Answer"}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Structure your answer using the STAR method for behavioral questions or technical trade-offs for TR..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white text-xs sm:text-sm font-mono leading-relaxed transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Action Row: Evaluate & Toggle Model Answer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEvaluateAnswer}
                disabled={evaluating || !answerText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {evaluating ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit & Score Answer</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowModelAnswer(!showModelAnswer)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {showModelAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{showModelAnswer ? "Hide Model Flashcard" : "View Model Flashcard"}</span>
              </button>
            </div>

            {/* Prev / Next Card Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Previous Flashcard"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <span>Next Drill</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI SCORECARD / EVALUATION BREAKDOWN */}
          {evaluation && (
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-500" />
                  <span className="font-bold text-sm text-slate-900 dark:text-white">AI Evaluation Scorecard</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                  <span className="text-slate-500">Score:</span>
                  <span className={evaluation.score >= 8 ? "text-emerald-600" : evaluation.score >= 6 ? "text-amber-500" : "text-rose-500"}>
                    {evaluation.score} / 10
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {evaluation.feedback}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {evaluation.strengths?.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                    <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Key Strengths Identified</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluation.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.missingConcepts?.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                    <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Concepts to Incorporate</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1">
                      {evaluation.missingConcepts.map((gap, idx) => (
                        <li key={idx}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MODEL FLASHCARD ANSWER (TOGGLEABLE) */}
          {showModelAnswer && (
            <div className="p-5 sm:p-6 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900/80 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>Recommended Model Flashcard Answer</span>
                </span>
                <span className="text-[11px] font-mono text-indigo-500">Staff Engineer Standard</span>
              </div>

              <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {currentQ.modelAnswer}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 space-y-2">
          <p className="text-sm font-semibold">No drills match the selected filters.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedTopic("All");
              setSelectedLanguage("All");
              setSelectedRound("All");
              setSelectedDifficulty("All");
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
