import { useEffect, useState } from "react";

import API from "./apiConfig";
const CATEGORIES = [
  "Resume and introduction",
  "HR and behavioral",
  "Programming language fundamentals",
  "Data structures and algorithms",
  "Frameworks and tools",
  "Database and SQL",
  "Project deep dive",
  "System design",
];

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text, message: text };
  }
}

function SessionEvaluation({ question, onRetry, retrying }) {
  return (
    <section className="session-evaluation" aria-label="Answer evaluation">
      <div className="session-evaluation-heading">
        <h4>Answer feedback</h4>
        <strong>{question.score}/10</strong>
        {question.evaluationMode === "mock" && (
          <span className="mock-evaluation-label">Mock Evaluation — Demo Mode</span>
        )}
        {question.evaluationMode === "rule-based-fallback" && (
          <span className="fallback-evaluation-label">Rule-based fallback · AI unavailable</span>
        )}
      </div>
      <p>{question.correctnessFeedback}</p>
      <h5>Strengths</h5>
      <ul>{question.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
      <h5>Concepts to strengthen</h5>
      {question.missingConcepts.length
        ? <ul>{question.missingConcepts.map((item) => <li key={item}>{item}</li>)}</ul>
        : <p>No reference concepts were marked missing.</p>}
      <h5>Suggestions</h5>
      <ul>{question.improvementSuggestions.map((item) => <li key={item}>{item}</li>)}</ul>
      <h5>Suggested answer</h5>
      <p className="session-sample-answer">{question.sampleAnswer}</p>
      {question.followUpQuestion && (
        <div className="follow-up-question">
          <strong>Follow-up question</strong>
          <p>{question.followUpQuestion}</p>
        </div>
      )}
      {question.evaluationMode === "rule-based-fallback" && (
        <button className="quiet-button" type="button" onClick={onRetry} disabled={retrying}>
          {retrying ? "Retrying evaluation…" : "Retry evaluation"}
        </button>
      )}
    </section>
  );
}

function InterviewWorkspace({ token, onSessionExpired }) {
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerDrafts, setAnswerDrafts] = useState({});
  const [targetRole, setTargetRole] = useState("");
  const [profile, setProfile] = useState(null);
  const [scope, setScope] = useState("GENERAL");
  const [focus, setFocus] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(10);
  const [categories, setCategories] = useState([
    "Resume and introduction",
    "Programming language fundamentals",
    "Frameworks and tools",
    "Database and SQL",
    "Project deep dive",
  ]);
  const [loading, setLoading] = useState(false);
  const [savingAnswer, setSavingAnswer] = useState(false);
  const [error, setError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSessions() {
      setHistoryLoading(true);
      try {
        const response = await fetch(`${API}/api/interviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await readResponse(response);
        if (response.status === 401 || response.status === 403) {
          onSessionExpired();
          return;
        }
        if (!response.ok) throw new Error(data.detail || data.message || "Could not load interview history.");
        if (active) setSessions(Array.isArray(data) ? data : []);
      } catch (loadError) {
        if (active) setError(loadError.message || "Could not connect to the backend.");
      } finally {
        if (active) setHistoryLoading(false);
      }
    }
    loadSessions();
    return () => { active = false; };
  }, [token, onSessionExpired]);

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      try {
        const response = await fetch(`${API}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await readResponse(response);
        if (response.status === 401 || response.status === 403) {
          onSessionExpired();
          return;
        }
        if (!response.ok) throw new Error(data.detail || data.message || "Could not load resume profile.");
        if (active) {
          setProfile(data);
          if (data.resume) {
            setScope("RESUME");
          } else {
            setScope("GENERAL");
          }
        }
      } catch (loadError) {
        if (active) setError(loadError.message || "Could not load resume profile.");
      }
    }
    loadProfile();
    return () => { active = false; };
  }, [token, onSessionExpired]);

  async function startInterview(event) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/api/interviews`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole,
          difficulty,
          questionCount,
          categories,
          scope: scope === "GENERAL" ? null : scope,
          focus: (scope === "RESUME" || scope === "GENERAL") ? null : focus,
        }),
      });
      const data = await readResponse(response);
      if (response.status === 401 || response.status === 403) {
        onSessionExpired();
        return;
      }
      if (!response.ok) throw new Error(data.detail || data.message || "Could not prepare this interview.");
      setSession(data);
      setQuestionIndex(0);
      setSessions((old) => [data, ...old.filter((item) => item.id !== data.id)]);
      setAnswerDrafts({});
    } catch (startError) {
      setError(startError.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(event) {
    event?.preventDefault();
    if (!answerDraft.trim()) {
      setError("Add an answer before submitting it.");
      return;
    }
    const question = session.questions[questionIndex];
    setSavingAnswer(true);
    setError("");
    try {
      const response = await fetch(
        `${API}/api/interviews/${session.id}/questions/${question.id}/answer`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answerText: answerDraft }),
        }
      );
      const data = await readResponse(response);
      if (response.status === 401 || response.status === 403) {
        onSessionExpired();
        return;
      }
      if (!response.ok) throw new Error(data.detail || data.message || "Could not save this answer.");
      setSession(data);
      setSessions((old) => old.map((item) => item.id === data.id ? data : item));
    } catch (submitError) {
      setError(submitError.message || "Could not connect to the backend.");
    } finally {
      setSavingAnswer(false);
    }
  }

  async function openSession(sessionId) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/api/interviews/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await readResponse(response);
      if (response.status === 401 || response.status === 403) {
        onSessionExpired();
        return;
      }
      if (!response.ok) throw new Error(data.detail || data.message || "Could not open this interview.");
      setSession(data);
      setQuestionIndex(0);
      setAnswerDrafts({});
    } catch (openError) {
      setError(openError.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  function toggleCategory(category) {
    setCategories((old) => old.includes(category)
      ? old.filter((item) => item !== category)
      : [...old, category]);
  }

  function sessionAverage(item) {
    const scores = item.questions.map((question) => question.score).filter(Number.isFinite);
    return scores.length
      ? (scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(1)
      : "—";
  }

  const evaluatedQuestions = sessions.flatMap((item) => item.questions)
    .filter((item) => Number.isFinite(item.score));
  const overallAverage = evaluatedQuestions.length
    ? (evaluatedQuestions.reduce((total, item) => total + item.score, 0) / evaluatedQuestions.length).toFixed(1)
    : "—";
  const topicScores = Object.entries(evaluatedQuestions.reduce((groups, item) => {
    const current = groups[item.category] || { total: 0, count: 0 };
    groups[item.category] = { total: current.total + item.score, count: current.count + 1 };
    return groups;
  }, {})).map(([category, values]) => ({
    category,
    average: values.total / values.count,
  }));
  const strongestTopic = topicScores.length
    ? [...topicScores].sort((left, right) => right.average - left.average)[0]
    : null;
  const weakestTopic = topicScores.length
    ? [...topicScores].sort((left, right) => left.average - right.average)[0]
    : null;

  const question = session?.questions?.[questionIndex];
  const answerDraft = question
    ? answerDrafts[question.id] ?? question.answerText ?? ""
    : "";

  return (
    <section className="interview-workspace" aria-labelledby="interview-setup-title">
      <div className="interview-workspace-heading">
        <div>
          <h2 id="interview-setup-title">Personalized interview</h2>
          <p>Questions combine the curated bank with details you provided in your profile.</p>
        </div>
        {session && <div className="interview-header-actions">
          <button className="quiet-button" type="button" onClick={() => startInterview()}>Regenerate questions</button>
          <button className="quiet-button" type="button" onClick={() => setSession(null)}>New interview</button>
        </div>}
      </div>

      {error && <p className="profile-error" role="alert">{error}</p>}

      <section className="interview-progress-summary" aria-label="Interview progress">
        <div><strong>{sessions.length}</strong><span>Sessions</span></div>
        <div><strong>{evaluatedQuestions.length}</strong><span>Answers evaluated</span></div>
        <div><strong>{overallAverage}/10</strong><span>Average score</span></div>
        <div><strong>{strongestTopic?.category || "—"}</strong><span>Strongest topic</span></div>
        <div><strong>{weakestTopic?.category || "—"}</strong><span>Next practice focus</span></div>
        {weakestTopic && (
          <p className="next-practice-suggestion">
            Suggested next session: practise {weakestTopic.category} questions at {difficulty} difficulty.
          </p>
        )}
      </section>

      {!session && (
        <div className="interview-start-layout">
          <form className="interview-setup-form" onSubmit={startInterview}>
            <label>Target role
              <input maxLength={120} value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="e.g. Backend Engineer" />
            </label>
            <label>Interview focus
              <select value={scope} onChange={(event) => { setScope(event.target.value); setFocus(""); }}>
                <option value="GENERAL">General practice (Profile & Curated question bank)</option>
                <option value="RESUME">Full resume</option>
                <option value="PROJECT">Specific project</option>
                <option value="SKILL">Specific technical skill</option>
              </select>
            </label>
            {scope !== "RESUME" && scope !== "GENERAL" && (
              <label>{scope === "PROJECT" ? "Project" : "Technical skill"}
                <select value={focus} onChange={(event) => setFocus(event.target.value)} required>
                  <option value="">Choose from your saved profile</option>
                  {(scope === "PROJECT" ? profile?.projects?.map((item) => item.name).filter(Boolean) : profile?.technicalSkills)?.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
            )}
            {scope !== "GENERAL" && !profile?.resume && (
              <p className="profile-warning">Upload a resume to generate questions grounded in your saved projects and skills, or choose "General practice" to begin immediately.</p>
            )}
            <div className="setup-inline-fields">
              <label>Difficulty
                <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                  {["Easy", "Medium", "Hard"].map((value) => <option key={value}>{value}</option>)}
                </select>
              </label>
              <label>Questions
                <input type="number" min="1" max="30" value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} />
              </label>
            </div>
            <fieldset className="interview-category-options">
              <legend>Interview categories</legend>
              {CATEGORIES.map((category) => (
                <label key={category}>
                  <input type="checkbox" checked={categories.includes(category)} onChange={() => toggleCategory(category)} />
                  {category}
                </label>
              ))}
            </fieldset>
            <button type="submit" disabled={loading || categories.length === 0 || (scope !== "GENERAL" && !profile?.resume) || (scope !== "RESUME" && scope !== "GENERAL" && !focus)}>
              {loading ? "Preparing questions…" : "Generate personalized questions"}
            </button>
          </form>

          <aside className="session-history-panel" aria-label="Previous interview sessions">
            <h3>Recent interviews</h3>
            {historyLoading && <p role="status">Loading sessions…</p>}
            {!historyLoading && sessions.length === 0 && <p>No interview sessions yet.</p>}
            <div className="session-history-list">
              {sessions.map((item) => (
                <button key={item.id} type="button" onClick={() => openSession(item.id)} disabled={loading}>
                  <strong>{item.targetRole || "Practice session"}</strong>
                  <span>{item.difficulty} · {item.questions.length} questions · average {sessionAverage(item)}/10</span>
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {session && question && (
        <section className="active-interview" aria-label="Interview question">
          {session.questions.some((item) => item.source === "RESUME_FALLBACK") && (
            <p className="profile-warning" role="status">AI question generation is unavailable for some or all questions. Rule-based questions are grounded in your saved profile.</p>
          )}
          <div className="interview-progress-row">
            <span>Question {questionIndex + 1} of {session.questions.length}</span>
            <span>{session.targetRole || "Practice interview"} · {session.difficulty}</span>
          </div>
          <div className="interview-progress-track" aria-hidden="true">
            <span style={{ width: `${((questionIndex + 1) / session.questions.length) * 100}%` }} />
          </div>
          <article className="interview-question-card">
            <div className="interview-question-tags">
              <span>{question.category}</span>
              <span className={question.source === "CURATED" ? "curated-tag" : question.source === "RESUME_AI" ? "ai-generated-tag" : "generated-tag"}>
                {question.source === "CURATED" ? "Question bank" : question.source === "RESUME_AI" ? "AI-generated from your resume" : question.source === "RESUME_FALLBACK" ? "Rule-based resume question" : "From your profile"}
              </span>
            </div>
            <h3>{question.questionText}</h3>
            <form onSubmit={submitAnswer}>
              <label>Your answer
                <textarea rows={7} maxLength={20000} value={answerDraft} onChange={(event) => setAnswerDrafts((old) => ({ ...old, [question.id]: event.target.value }))} placeholder="Explain your reasoning and use a concrete example where appropriate." />
              </label>
              <div className="interview-question-actions">
                <button type="submit" disabled={savingAnswer}>{savingAnswer ? "Evaluating…" : question.score === null ? "Submit answer" : "Update answer"}</button>
                {questionIndex > 0 && <button className="quiet-button" type="button" onClick={() => setQuestionIndex((index) => index - 1)}>Previous</button>}
                {questionIndex < session.questions.length - 1 && <button className="quiet-button" type="button" onClick={() => setQuestionIndex((index) => index + 1)}>Next question</button>}
              </div>
            </form>
            {question.score !== null && question.score !== undefined && (
              <SessionEvaluation question={question} onRetry={() => submitAnswer()} retrying={savingAnswer} />
            )}
            {question.score === null && (
              <details className="session-sample-details">
                <summary>View suggested answer outline</summary>
                <p>{question.sampleAnswer}</p>
              </details>
            )}
          </article>
        </section>
      )}
    </section>
  );
}

export default InterviewWorkspace;
