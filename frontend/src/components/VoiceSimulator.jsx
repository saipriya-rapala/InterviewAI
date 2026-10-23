import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Award,
  Clock,
  Send,
  Layers,
  Lightbulb,
  Bot,
  User,
  ShieldCheck,
  Terminal,
  Database,
  PlusCircle,
  Code2,
  Sparkles,
  Check,
  FileText,
} from "lucide-react";
import InterviewReportModal from "./InterviewReportModal";
import {
  SUPPORTED_LANGUAGES,
  buildContinuousCompetencyQueue,
  generateConversationalOpening,
  generateDynamicQuestion,
  evaluateAnswerAndGenerateAdaptiveFollowUp,
  generateNextContinuousTopic,
  generateEliteModelAnswer,
  extractDeepResumeInventory,
} from "../utils/conversationalEngine";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

function getCachedProfile() {
  try {
    const cached = sessionStorage.getItem("interviewai_active_profile");
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

async function readResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text, detail: text };
  }
}

export default function VoiceSimulator({
  token,
  activeProfile: propProfile,
  onSessionExpired,
  onBackToDashboard,
}) {
  // Use propProfile if available, otherwise check sessionStorage
  const [profile, setProfile] = useState(() => propProfile || getCachedProfile());
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 1000000));

  // Language Selection & Interview Round State (TR vs HR vs All)
  const initialInventory = useMemo(
    () => extractDeepResumeInventory(propProfile || getCachedProfile()),
    [propProfile]
  );

  const [selectedLanguages, setSelectedLanguages] = useState(() => {
    if (initialInventory.languages.length > 0) {
      return initialInventory.languages.slice(0, 3);
    }
    return ["Java", "Python"];
  });

  const [roundType, setRoundType] = useState("all"); // "all" | "tr" | "hr"

  const hasResume = useMemo(() => {
    const p = profile;
    return Boolean(
      p?.resume ||
      p?.resumeFileName ||
      (p?.projects && p.projects.length > 0 && p.technicalSkills?.length > 0) ||
      sessionStorage.getItem("interviewai_has_resume")
    );
  }, [profile]);

  const [showManualConfig, setShowManualConfig] = useState(false);

  // Continuous Competency Queue tailored to selected languages & roundType
  const [competencies, setCompetencies] = useState(() =>
    buildContinuousCompetencyQueue(
      propProfile || getCachedProfile(),
      initialInventory.languages.length > 0 ? initialInventory.languages.slice(0, 3) : ["Java", "Python"],
      "all"
    )
  );
  const [currentCompIdx, setCurrentCompIdx] = useState(0);

  // Conversational Dialogue State
  const [dialogue, setDialogue] = useState(() => {
    const initProfile = propProfile || getCachedProfile();
    const initLangs =
      initialInventory.languages.length > 0 ? initialInventory.languages.slice(0, 3) : ["Java", "Python"];
    const initComps = buildContinuousCompetencyQueue(initProfile, initLangs, "all");
    return [
      {
        id: "ai-msg-0",
        role: "ai",
        text: generateConversationalOpening(initProfile, initLangs, "all"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        topicLabel: initComps[0]?.label || "Architecture Overview",
        probed: false,
      },
    ];
  });

  const [inputText, setInputText] = useState("");
  const [aiTyping, setAiTyping] = useState(false);

  // Audio & Speech-to-Text
  const [isRecording, setIsRecording] = useState(false);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [speechSupported] = useState(() => {
    return Boolean(
      typeof window !== "undefined" &&
        (window.SpeechRecognition || window.webkitSpeechRecognition)
    );
  });
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSpeakingAi, setIsSpeakingAi] = useState(false);

  // Session clock
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // STAR quality tip (<20 words)
  const [showQualityWarning, setShowQualityWarning] = useState(false);

  // Post-Interview Scorecard Modal
  const [showScorecard, setShowScorecard] = useState(false);
  const [savedSessionData, setSavedSessionData] = useState(null);

  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll chat to bottom smoothly
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [dialogue, aiTyping, scrollToBottom]);

  // Load fresh candidate profile from backend if not available
  useEffect(() => {
    if (propProfile) return;
    let ignore = false;
    async function fetchProfile() {
      try {
        const res = await fetch(`${API}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await readResponse(res);
        if (ignore) return;

        if (res.status === 401 || res.status === 403) {
          onSessionExpired?.();
          return;
        }

        if (res.ok && data) {
          setProfile(data);
          // If dialogue is just starting, personalize with fresh data
          setDialogue((prev) => {
            if (prev.length <= 1) {
              const freshInventory = extractDeepResumeInventory(data);
              const freshLangs =
                freshInventory.languages.length > 0 ? freshInventory.languages.slice(0, 3) : ["Java", "Python"];
              const freshComps = buildContinuousCompetencyQueue(data, freshLangs, "all");
              setCompetencies(freshComps);
              return [
                {
                  id: "ai-msg-0",
                  role: "ai",
                  text: generateConversationalOpening(data, freshLangs, "all"),
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  topicLabel: freshComps[0]?.label || "Architecture Overview",
                  probed: false,
                },
              ];
            }
            return prev;
          });
        }
      } catch (err) {
        console.warn("Could not fetch profile in simulator:", err);
      }
    }

    fetchProfile();
    return () => {
      ignore = true;
    };
  }, [token, onSessionExpired, propProfile]);

  // Web Speech Recognition (Microphone)
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + " ";
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setInterimTranscript(interim);

        if (final) {
          setInputText((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setInterimTranscript("");
      };

      recognition.onend = () => {
        setIsRecording(false);
        setInterimTranscript("");
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Timer intervals
  useEffect(() => {
    let interval = null;
    if (timerActive && !showScorecard) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, showScorecard]);

  useEffect(() => {
    let interval = null;
    if (isRecording) {
      interval = setInterval(() => setSpeakingSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  function toggleSpeechRecording() {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript("");
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch {
        setIsRecording(false);
      }
    }
  }

  function toggleAiVoice(text) {
    if (!window.speechSynthesis) return;
    if (isSpeakingAi) {
      window.speechSynthesis.cancel();
      setIsSpeakingAi(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#$`]/g, ""));
      utterance.onend = () => setIsSpeakingAi(false);
      utterance.onerror = () => setIsSpeakingAi(false);
      setIsSpeakingAi(true);
      window.speechSynthesis.speak(utterance);
    }
  }

  // Toggle Language Selection
  const handleToggleLanguage = useCallback(
    (lang) => {
      setSelectedLanguages((prev) => {
        let updated;
        if (prev.includes(lang)) {
          if (prev.length === 1) return prev; // keep at least 1 language
          updated = prev.filter((l) => l !== lang);
        } else {
          updated = [...prev, lang];
        }

        const newComps = buildContinuousCompetencyQueue(profile, updated, roundType);
        setCompetencies(newComps);
        setCurrentCompIdx(0);

        const nextQ = generateDynamicQuestion(newComps[0], profile, Date.now(), {
          selectedLanguages: updated,
          roundType,
        });

        const roundLabel =
          roundType === "hr"
            ? "HR Behavioral"
            : roundType === "tr"
            ? "Technical Review (TR)"
            : "Technical (TR) & HR";

        const switchMessage = {
          id: `ai-lang-switch-${Date.now()}`,
          role: "ai",
          text: `Target language stack updated to **${updated.join(", ")}** for **${roundLabel}**.\n\n${nextQ}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          topicLabel: newComps[0]?.label || "Language Focus",
          probed: false,
        };

        setDialogue((d) => [...d, switchMessage]);
        scrollToBottom();
        return updated;
      });
    },
    [profile, roundType, scrollToBottom]
  );

  // Change Round Mode (All vs TR vs HR)
  const handleChangeRoundType = useCallback(
    (newRound) => {
      setRoundType(newRound);
      const newComps = buildContinuousCompetencyQueue(profile, selectedLanguages, newRound);
      setCompetencies(newComps);
      setCurrentCompIdx(0);

      const nextQ = generateDynamicQuestion(newComps[0], profile, Date.now(), {
        selectedLanguages,
        roundType: newRound,
      });

      const roundName =
        newRound === "hr"
          ? "HR & Behavioral Leadership"
          : newRound === "tr"
          ? "Technical Review (TR) Deep-Dive"
          : "Combined TR & HR";

      const switchMessage = {
        id: `ai-round-switch-${Date.now()}`,
        role: "ai",
        text: `Switched interview format to **${roundName}** for **${selectedLanguages.join(", ")}**.\n\n${nextQ}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        topicLabel: newComps[0]?.label || "Round Focus",
        probed: false,
      };

      setDialogue((d) => [...d, switchMessage]);
      scrollToBottom();
    },
    [profile, selectedLanguages, scrollToBottom]
  );

  // Jump to or probe any competency from the live list
  const handleSelectCompetency = useCallback(
    (targetIdx) => {
      if (targetIdx < 0 || targetIdx >= competencies.length || aiTyping) return;
      const targetComp = competencies[targetIdx];

      setCurrentCompIdx(targetIdx);

      setCompetencies((prev) =>
        prev.map((c, i) => ({
          ...c,
          inProgress: i === targetIdx,
        }))
      );

      const newQuestion = generateDynamicQuestion(
        targetComp,
        profile,
        sessionSeed + targetIdx * 17,
        { selectedLanguages, roundType }
      );

      const transitionText = targetComp.covered
        ? `Revisiting **${targetComp.label}** with a deeper scenario:\n\n${newQuestion}`
        : `Switching focus to **${targetComp.label}**:\n\n${newQuestion}`;

      const aiMessage = {
        id: `ai-jump-${Date.now()}`,
        role: "ai",
        text: transitionText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        topicLabel: targetComp.label,
        probed: false,
      };

      setDialogue((prev) => [...prev, aiMessage]);
      scrollToBottom();
    },
    [competencies, aiTyping, profile, sessionSeed, selectedLanguages, roundType, scrollToBottom]
  );

  // Add a continuous new topic to the queue for endless practicing
  const handleAddMoreQuestions = useCallback(() => {
    const nextTopic = generateNextContinuousTopic(
      competencies.length,
      profile,
      selectedLanguages,
      roundType
    );
    setCompetencies((prev) => [...prev, nextTopic]);
    handleSelectCompetency(competencies.length);
  }, [competencies.length, profile, selectedLanguages, roundType, handleSelectCompetency]);

  // Advance to next question in queue (or append dynamic continuous topic if queue finished)
  const handleAdvanceToNextQuestion = useCallback(() => {
    if (aiTyping) return;
    if (currentCompIdx + 1 < competencies.length) {
      handleSelectCompetency(currentCompIdx + 1);
    } else {
      handleAddMoreQuestions();
    }
  }, [aiTyping, currentCompIdx, competencies.length, handleSelectCompetency, handleAddMoreQuestions]);

  // Send Candidate Response & Drive Conversational AI Loop
  async function handleSendAnswer() {
    const rawAnswer = inputText.trim();
    if (!rawAnswer || aiTyping) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const words = rawAnswer.split(/\s+/).filter(Boolean).length;

    // Gentle STAR quality check if answer is very brief (< 20 words)
    if (words < 20 && !showQualityWarning) {
      setShowQualityWarning(true);
      return;
    }

    setShowQualityWarning(false);
    setInputText("");
    setInterimTranscript("");

    const userMessageId = `user-${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      role: "candidate",
      text: rawAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedDialogue = [...dialogue, userMessage];
    setDialogue(updatedDialogue);
    setAiTyping(true);

    // AI thinking delay (650ms - 850ms) for realistic feel
    await new Promise((r) => setTimeout(r, 750));

    const currentComp = competencies[currentCompIdx];
    const lastAiMsg = dialogue.filter((m) => m.role === "ai").slice(-1)[0];
    const isProbedAlready = Boolean(lastAiMsg?.probed);

    // Evaluate answer with conversational engine
    const evaluation = evaluateAnswerAndGenerateAdaptiveFollowUp(
      rawAnswer,
      currentComp?.label || "Technical Topic",
      profile,
      dialogue.length,
      selectedLanguages,
      roundType
    );

    let aiReplyText;
    let isProbe = false;
    let nextCompIndex = currentCompIdx;

    if (evaluation.isProbe && !isProbedAlready) {
      isProbe = true;
      aiReplyText = evaluation.response;
    } else {
      setCompetencies((prev) =>
        prev.map((c, i) =>
          i === currentCompIdx
            ? { ...c, covered: true, inProgress: false }
            : c
        )
      );

      if (currentCompIdx + 1 < competencies.length) {
        nextCompIndex = currentCompIdx + 1;
        setCompetencies((prev) =>
          prev.map((c, i) =>
            i === nextCompIndex ? { ...c, inProgress: true } : c
          )
        );
      } else {
        const freshTopic = generateNextContinuousTopic(
          competencies.length,
          profile,
          selectedLanguages,
          roundType
        );
        setCompetencies((prev) => [...prev, freshTopic]);
        nextCompIndex = competencies.length;
      }

      setCurrentCompIdx(nextCompIndex);

      const targetComp =
        competencies[nextCompIndex] ||
        generateNextContinuousTopic(nextCompIndex, profile, selectedLanguages, roundType);

      const nextQuestion = generateDynamicQuestion(
        targetComp,
        profile,
        sessionSeed + nextCompIndex * 47,
        { selectedLanguages, roundType }
      );

      const ackPhrase = evaluation.acknowledgment || "Great breakdown.";
      aiReplyText = `${ackPhrase}\n\nMoving forward to **${targetComp.label}**:\n${nextQuestion}`;
    }

    const aiMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      text: aiReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      topicLabel: competencies[nextCompIndex]?.label || "Engineering Competency",
      probed: isProbe,
    };

    setDialogue([...updatedDialogue, aiMessage]);
    setAiTyping(false);
  }

  // Finish & Evaluate Interview Session On-Demand
  async function handleFinishAndEvaluate() {
    setTimerActive(false);
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const pairedExchanges = [];
    for (let i = 0; i < dialogue.length; i++) {
      if (dialogue[i].role === "ai") {
        const questionText = dialogue[i].text;
        const candidateResponse =
          dialogue[i + 1]?.role === "candidate" ? dialogue[i + 1].text : "";
        const words = candidateResponse.trim().split(/\s+/).filter(Boolean).length;
        const score = candidateResponse
          ? Math.min(Math.max(Math.round(words / 12) + 5, 5), 10)
          : null;

        const topic = dialogue[i].topicLabel || "Technical Competency";
        const eliteAnswer = generateEliteModelAnswer(questionText, topic);

        pairedExchanges.push({
          id: i + 1,
          order: i + 1,
          category: topic,
          questionText,
          answerText: candidateResponse,
          score,
          correctnessFeedback: candidateResponse
            ? words >= 35
              ? "Comprehensive response demonstrating solid architectural trade-offs, concurrency handling, and failure mitigation."
              : "Good fundamental response. Consider enriching with concrete metrics (QPS, p99 latency) and production recovery mechanisms."
            : "Question unattempted.",
          strengths: candidateResponse
            ? [
                "Decomposed problem into logical system layers",
                "Recognized critical performance constraints",
                "Clear technical vocabulary and architectural intuition",
              ]
            : [],
          missingConcepts:
            candidateResponse && words < 45
              ? [
                  "Quantitative metrics (p99 latency, throughput, memory bounds)",
                  "Concrete edge-case failure mitigation (circuit breakers, deadlocks)",
                ]
              : [],
          sampleAnswer: eliteAnswer,
        });
      }
    }

    const completedSession = {
      id: Date.now(),
      targetRole: profile?.targetRole || "Software Engineer",
      difficulty: profile?.interviewDifficulty || "Medium",
      createdAt: new Date().toISOString(),
      categories: Array.from(new Set(competencies.map((c) => c.label))),
      questions: pairedExchanges,
      speakingSeconds,
    };

    try {
      await fetch(`${API}/api/interviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole: profile?.targetRole || "Software Engineer",
          difficulty: "Medium",
          questionCount: Math.min(Math.max(pairedExchanges.length, 3), 15),
          categories: ["TR Technical Review", "HR Leadership & Behavioral"],
        }),
      });
    } catch (err) {
      console.warn("Could not persist session to backend:", err);
    }

    setSavedSessionData(completedSession);
    setShowScorecard(true);
  }

  function formatTime(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  const coveredCount = competencies.filter((c) => c.covered).length;
  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Session Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Voice Interview Studio
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {profile?.targetRole || "Software Engineer"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ChatGPT / Gemini AI Engine</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {hasResume
                ? "Grounded in your resume: Automated question grilling on your projects, stack, and experience."
                : "No resume attached: Select languages and format below to practice."}
            </p>
          </div>
        </div>

        {/* Action Controls & Session Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{formatTime(seconds)}</span>
            <button
              type="button"
              onClick={() => setTimerActive(!timerActive)}
              className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              title={timerActive ? "Pause clock" : "Resume clock"}
            >
              {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleFinishAndEvaluate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/20 transition-all shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Finish & Evaluate</span>
          </button>
        </div>
      </div>

      {/* WHEN RESUME IS PRESENT AND MANUAL OVERRIDE IS CLOSED: CLEAN RESUME-GROUNDED BANNER */}
      {hasResume && !showManualConfig ? (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 rounded-3xl border border-emerald-200 dark:border-emerald-800/80 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm text-emerald-950 dark:text-emerald-100">
                  Grounded in Your Uploaded Resume
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                  Automated AI Mode
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 mt-0.5 truncate">
                Role: <strong>{initialInventory.targetRole}</strong> · Stack: <strong>{initialInventory.languages.join(", ")}</strong> · Projects: <strong>{initialInventory.projects.map((p) => p.name).join(", ")}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowManualConfig(true)}
            className="px-3.5 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white/80 dark:bg-slate-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold hover:bg-emerald-100/50 transition-colors cursor-pointer self-start sm:self-center shrink-0"
          >
            ⚙️ Custom Override
          </button>
        </div>
      ) : (
        /* MANUAL SELECTION PANEL (ONLY FOR NON-RESUME MODE OR WHEN CUSTOM OVERRIDE CLICKED) */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Round Mode Toggle (TR vs HR vs All) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Interview Format & Focus</span>
                </span>
                {hasResume && (
                  <button
                    type="button"
                    onClick={() => setShowManualConfig(false)}
                    className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer ml-3"
                  >
                    ✕ Return to Resume Mode
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => handleChangeRoundType("all")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    roundType === "all"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>⚡ Combined (TR + HR)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeRoundType("tr")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    roundType === "tr"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>💻 TR (Technical Round)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleChangeRoundType("hr")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    roundType === "hr"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-300 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>🤝 HR (Behavioral & Leadership)</span>
                </button>
              </div>
            </div>

            {/* Quick Info Badge */}
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                Active Languages:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {selectedLanguages.join(", ")}
                </strong>
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Click any language below to add or remove it from your interview
              </div>
            </div>
          </div>

          {/* Language Multi-Select Chips Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Choose Languages (Multi-Select):
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleToggleLanguage(lang)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25 ring-2 ring-indigo-400/40"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Studio Layout: Dialogue Stream (Left 2 cols) + Dynamic Competency Queue (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Conversational Dialogue Stream */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scrollable Dialogue Window */}
          <div
            ref={chatContainerRef}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm min-h-[460px] max-h-[560px] overflow-y-auto space-y-5"
          >
            {dialogue.map((msg) => {
              const isAi = msg.role === "ai";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 animate-fadeIn ${isAi ? "justify-start" : "justify-end"}`}
                >
                  {isAi && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`space-y-1.5 max-w-[85%] ${isAi ? "" : "text-right"}`}>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {isAi ? "AI Interviewer (ChatGPT / Gemini Engine)" : profile?.candidateName || "Candidate"}
                      </span>
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                      {msg.topicLabel && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                          {msg.topicLabel}
                        </span>
                      )}
                      {msg.probed && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          Adaptive Follow-up
                        </span>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-left shadow-xs ${
                        isAi
                          ? "bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                          : "bg-indigo-600 text-white font-mono"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {isAi && (
                      <button
                        type="button"
                        onClick={() => toggleAiVoice(msg.text)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 pt-0.5 cursor-pointer"
                      >
                        {isSpeakingAi ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isSpeakingAi ? "Mute Voice" : "Listen Aloud"}</span>
                      </button>
                    )}
                  </div>

                  {!isAi && (
                    <div className="w-9 h-9 rounded-2xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 shadow-xs mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {aiTyping && (
              <div className="flex items-center gap-3 animate-fadeIn">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px]">Interviewer is analyzing your response & formulating next question...</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Answer Input Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Your Answer / Response
              </span>

              {speechSupported ? (
                <button
                  type="button"
                  onClick={toggleSpeechRecording}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                    isRecording
                      ? "bg-rose-500 text-white shadow-rose-500/25 ring-2 ring-rose-400/40"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Recording Audio</span>
                      <span className="mini-soundbar ml-1 text-white">
                        <span className="mini-soundbar-bar" />
                        <span className="mini-soundbar-bar" />
                        <span className="mini-soundbar-bar" />
                        <span className="mini-soundbar-bar" />
                        <span className="mini-soundbar-bar" />
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Speak Answer (Web-to-Text)</span>
                    </>
                  )}
                </button>
              ) : (
                <span className="text-xs text-slate-400">Type response mode</span>
              )}
            </div>

            {isRecording && (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-pink-950/30 border border-indigo-200 dark:border-indigo-900 animate-fadeIn text-xs">
                <span className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>Listening... Speak your response clearly</span>
                </span>
                <span className="font-mono text-slate-500">{formatTime(speakingSeconds)}</span>
              </div>
            )}

            <div className="relative">
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => {
                  setShowQualityWarning(false);
                  setInputText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendAnswer();
                  }
                }}
                placeholder="Type your answer or speak using the mic. Use the STAR method for HR or discuss trade-offs for TR... (Press Enter to send)"
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white text-xs sm:text-sm font-mono leading-relaxed transition-all placeholder:text-slate-400"
              />

              {interimTranscript && (
                <div className="text-xs text-indigo-500 italic px-2 pt-1 truncate">
                  Streaming: {interimTranscript}
                </div>
              )}
            </div>

            {showQualityWarning && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200 space-y-1.5 animate-fadeIn">
                <div className="flex items-start gap-2 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Answer Depth Notice:</strong> Your answer is brief ({wordCount} words). Consider adding specific metrics, constraints, or the STAR Result before sending.
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 pl-6">
                  <button
                    type="button"
                    onClick={() => setShowQualityWarning(false)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 cursor-pointer"
                  >
                    Keep Elaborating
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowQualityWarning(false);
                      handleSendAnswer();
                    }}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-900 dark:text-amber-200 hover:underline cursor-pointer"
                  >
                    Send Anyway &rarr;
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className={`text-xs ${wordCount < 20 && wordCount > 0 ? "text-amber-500 font-semibold" : "text-slate-400"}`}>
                {wordCount} words
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAdvanceToNextQuestion}
                  disabled={aiTyping}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Advance to next question in the queue"
                >
                  <span>Skip / Next Scenario &rarr;</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendAnswer}
                  disabled={aiTyping || !inputText.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Competency Coverage Tracker & Interactive Questions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Dynamic Competency Queue</span>
                </h4>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {coveredCount} Completed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tailored for {selectedLanguages.join(", ")} ({roundType.toUpperCase()}). Click any topic to switch to it immediately.
              </p>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((coveredCount / Math.max(competencies.length, 1)) * 100, 100)}%`,
                }}
              />
            </div>

            <div
              className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1"
              role="list"
              aria-label="Interview questions and competency checklist"
            >
              {competencies.map((comp, idx) => {
                const isCurrent = idx === currentCompIdx;
                const isCovered = comp.covered;

                return (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => handleSelectCompetency(idx)}
                    role="listitem"
                    aria-current={isCurrent ? "true" : undefined}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isCovered
                        ? "bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400 dark:hover:border-emerald-700 text-emerald-950 dark:text-emerald-100"
                        : isCurrent
                        ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 dark:border-indigo-600 ring-2 ring-indigo-500/20 text-indigo-950 dark:text-indigo-100 shadow-sm"
                        : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 shadow-xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            isCovered
                              ? "bg-emerald-100 dark:bg-emerald-900/70 text-emerald-600 dark:text-emerald-300"
                              : isCurrent
                              ? "bg-indigo-600 text-white shadow-xs"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/80 group-hover:text-indigo-600"
                          }`}
                        >
                          {comp.isHr ? (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          ) : comp.label.toLowerCase().includes("database") || comp.label.toLowerCase().includes("sql") ? (
                            <Database className="w-3.5 h-3.5" />
                          ) : comp.label.toLowerCase().includes("project") ? (
                            <Layers className="w-3.5 h-3.5" />
                          ) : (
                            <Terminal className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex items-center gap-1.5 flex-wrap">
                            <span>{comp.label}</span>
                            {comp.isHighFrequency && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                ⭐ Mostly Expected
                              </span>
                            )}
                          </div>
                          {comp.subtitle && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                              {comp.subtitle}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {isCovered ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Covered</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-600 text-white shadow-xs animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span>Probing Now</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-100/60 dark:group-hover:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-all">
                            <span>Ask Now</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddMoreQuestions}
              className="w-full py-2.5 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Next Dynamic Scenario (+1)</span>
            </button>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleFinishAndEvaluate}
                className="w-full py-3 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Finish & Evaluate Interview</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Generates your STAR Breakdown, Speech Telemetry & Elite Model Answers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE POST-INTERVIEW SCORECARD MODAL */}
      {showScorecard && savedSessionData && (
        <InterviewReportModal
          session={savedSessionData}
          speakingSeconds={speakingSeconds}
          onClose={() => setShowScorecard(false)}
          onBackToDashboard={onBackToDashboard}
          onRestart={() => {
            setShowScorecard(false);
            const freshComps = buildContinuousCompetencyQueue(profile, selectedLanguages, roundType);
            setCompetencies(freshComps);
            setDialogue([
              {
                id: "ai-msg-0",
                role: "ai",
                text: generateConversationalOpening(profile, selectedLanguages, roundType),
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                topicLabel: freshComps[0]?.label || "Architecture Overview",
                probed: false,
              },
            ]);
            setSeconds(0);
            setSpeakingSeconds(0);
            setTimerActive(true);
            setCurrentCompIdx(0);
          }}
        />
      )}
    </div>
  );
}
