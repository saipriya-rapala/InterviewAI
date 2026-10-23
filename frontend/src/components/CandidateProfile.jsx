import { useState, useRef, useEffect, useCallback } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  Plus,
  X,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Layers,
  Edit2,
  Award
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const POPULAR_ROLES = [
  "Full Stack Developer",
  "Backend Engineer (Java/Spring)",
  "Frontend Engineer (React/TypeScript)",
  "DevOps / Cloud Engineer",
  "Data Engineer / Python",
  "Software Engineer (General)",
  "Mobile Developer (React Native/iOS)",
  "System Architect",
];

const EXPERIENCE_LEVELS = [
  { id: "Student / Entry-level", label: "Student / Entry-level", desc: "0-1 yrs experience" },
  { id: "Junior", label: "Junior Engineer", desc: "1-2 yrs experience" },
  { id: "Mid-level", label: "Mid-Level Engineer", desc: "3-5 yrs experience" },
  { id: "Senior", label: "Senior Engineer", desc: "5-8 yrs experience" },
  { id: "Lead", label: "Lead / Principal", desc: "8+ yrs experience" },
];

const KNOWN_LANGUAGES = [
  "Python", "TypeScript", "JavaScript", "Java", "C++", "C", "C#", "Go", "Rust",
  "SQL", "PHP", "Ruby", "Swift", "Kotlin", "Scala", "Dart", "Shell", "Bash", "R"
];

const KNOWN_FRAMEWORKS_AND_TOOLS = [
  "React", "Node.js", "Express", "Spring Boot", "Next.js", "Django", "FastAPI",
  "Flask", "Vue", "Angular", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "GraphQL", "Git", "CI/CD",
  "Linux", "Hibernate / JPA", "Tailwind CSS", "REST APIs", "Microservices"
];

const SUGGESTED_SKILLS_BY_CATEGORY = {
  Languages: [
    "Java", "Python", "JavaScript", "TypeScript", "C++", "C", "C#", "Go", "Rust",
    "SQL", "Kotlin", "Swift", "PHP", "Ruby", "Scala", "Dart", "Shell", "R"
  ],
  "Frameworks & Web": ["Spring Boot", "React", "Node.js", "Next.js", "Express", "Django", "FastAPI"],
  "Data & Storage": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Kafka", "Hibernate / JPA"],
  "Cloud & Tools": ["Docker", "Kubernetes", "AWS", "Git", "CI/CD", "Linux", "REST APIs"],
};

function parseTechnologies(tech) {
  if (Array.isArray(tech)) return tech.filter(Boolean);
  if (typeof tech === "string" && tech.trim()) {
    return tech.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsTerm(text, term) {
  if (!text || !term) return false;
  try {
    const escaped = escapeRegExp(term.toLowerCase().trim());
    const pattern = new RegExp(`(?<![\\w])${escaped}(?![\\w])`, "i");
    return pattern.test(text);
  } catch {
    return text.toLowerCase().includes(term.toLowerCase());
  }
}

function getInitialProfile() {
  try {
    const cached = sessionStorage.getItem("interviewai_active_profile");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") return parsed;
    }
  } catch {
    // ignore
  }
  return {
    candidateName: "",
    contactEmail: "",
    phone: "",
    professionalSummary: "",
    experienceLevel: "Mid-level",
    targetRole: "Software Engineer",
    preferredLanguage: "",
    interviewDifficulty: "Medium",
    technicalSkills: [],
    softSkills: [],
    topicsToPractice: [],
    education: [],
    certifications: [],
    achievements: [],
    projects: [],
    workExperience: [],
    resume: null,
  };
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text, detail: text };
  }
}

export default function CandidateProfile({ token, onSessionExpired, onStartInterview, onProfileReset }) {
  const [activeTab, setActiveTab] = useState("resume"); // "resume" | "quick-setup"
  const [profile, setProfile] = useState(() => getInitialProfile());
  const [loading, setLoading] = useState(() => {
    const initial = getInitialProfile();
    return !initial.id && !initial.candidateName && initial.technicalSkills.length === 0;
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState({ text: "", type: "" });
  const [newSkillInput, setNewSkillInput] = useState("");
  const [newEducationInput, setNewEducationInput] = useState("");
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [customRoleInput, setCustomRoleInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Quick Setup wizard step (1: Role, 2: Experience, 3: Skills)
  const [quickStep, setQuickStep] = useState(1);

  const fileInputRef = useRef(null);

  // Load candidate profile
  useEffect(() => {
    let ignore = false;
    async function loadProfileAndCatalog() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const profileRes = await fetch(`${API}/api/profile`, { headers });
        const text = await profileRes.text();
        let profileData = {};
        if (text) {
          try {
            profileData = JSON.parse(text);
          } catch {
            profileData = { message: text };
          }
        }

        if (ignore) return;

        if (profileRes.status === 401 || profileRes.status === 403) {
          onSessionExpired?.();
          return;
        }

        if (!profileRes.ok) throw new Error(profileData.message || "Failed to load candidate profile.");

        if (profileData && typeof profileData === "object") {
          setProfile((prev) => ({
            ...prev,
            ...profileData,
            technicalSkills: profileData.technicalSkills || prev.technicalSkills || [],
            education: profileData.education || prev.education || [],
            projects: profileData.projects || prev.projects || [],
          }));
        }
      } catch (err) {
        if (!ignore) {
          console.warn("Could not load backend candidate profile:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProfileAndCatalog();
    return () => {
      ignore = true;
    };
  }, [token, onSessionExpired]);

  // Deep client-side enhancer for parsed resume data
  const enrichProfileData = useCallback((rawProfile, fileName = "", rawText = "") => {
    const combinedText = `${fileName} ${rawText} ${rawProfile?.professionalSummary || ""} ${(rawProfile?.projects || []).map((p) => `${p.name} ${p.description}`).join(" ")}`.toLowerCase();

    // Detect all programming languages safely (handles C++, C#, etc.)
    const detectedLanguages = KNOWN_LANGUAGES.filter((lang) => containsTerm(combinedText, lang));

    // Detect frameworks and tools safely
    const detectedTools = KNOWN_FRAMEWORKS_AND_TOOLS.filter((tool) => containsTerm(combinedText, tool));

    // Merge with existing skills without duplicates
    const allSkills = Array.from(
      new Set([
        ...(rawProfile?.technicalSkills || []),
        ...detectedLanguages,
        ...detectedTools,
      ])
    );

    // Detect Target Role if missing or generic
    let targetRole = rawProfile?.targetRole;
    if (!targetRole || targetRole === "Software Engineer") {
      if (combinedText.includes("full stack") || combinedText.includes("fullstack")) {
        targetRole = "Full Stack Developer";
      } else if (combinedText.includes("backend") || combinedText.includes("spring boot") || combinedText.includes("django")) {
        targetRole = "Backend Engineer";
      } else if (combinedText.includes("frontend") || combinedText.includes("react") || combinedText.includes("ui/ux")) {
        targetRole = "Frontend Engineer";
      } else if (combinedText.includes("devops") || combinedText.includes("cloud") || combinedText.includes("kubernetes")) {
        targetRole = "DevOps / Cloud Engineer";
      } else if (combinedText.includes("data engineer") || combinedText.includes("machine learning")) {
        targetRole = "Data Engineer";
      }
    }

    // Detect Experience Level
    let experienceLevel = rawProfile?.experienceLevel;
    if (!experienceLevel || experienceLevel === "Mid-level") {
      if (combinedText.includes("senior") || combinedText.includes("lead") || combinedText.includes("architect")) {
        experienceLevel = "Senior";
      } else if (combinedText.includes("junior") || combinedText.includes("intern") || combinedText.includes("entry")) {
        experienceLevel = "Junior";
      }
    }

    // Format projects
    const projects = (rawProfile?.projects || []).map((proj, idx) => {
      const tech = typeof proj.technologies === "string"
        ? proj.technologies
        : Array.isArray(proj.technologies)
          ? proj.technologies.join(", ")
          : detectedTools.slice(0, 3).join(", ");
      return {
        name: proj.name || `Project ${idx + 1}`,
        description: proj.description || "Production system and feature implementation.",
        technologies: tech,
        responsibilities: proj.responsibilities || proj.role || "Lead Contributor",
      };
    });

    const defaultProjects = [
      {
        name: "Scalable Cloud Microservices Architecture",
        description: "High-throughput REST and message-driven processing service with database caching.",
        technologies: "Node.js, Docker, PostgreSQL, Redis",
        responsibilities: "Software Engineer",
      },
    ];

    return {
      ...rawProfile,
      resume: rawProfile?.resume || {
        fileName: fileName || "Uploaded Resume",
        originalFileName: fileName || "Uploaded Resume",
        uploadedAt: new Date().toISOString(),
      },
      resumeFileName: fileName || rawProfile?.resume?.fileName || "Uploaded Resume",
      targetRole: targetRole || "Full Stack Developer",
      experienceLevel: experienceLevel || "Mid-level",
      technicalSkills: allSkills.length > 0 ? allSkills : ["Java", "Python", "React", "SQL"],
      projects: projects.length > 0 ? projects : defaultProjects,
    };
  }, []);

  // Upload & Instant Launch Flow
  async function handleFileUpload(file) {
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(extension)) {
      setNotice({ text: "Please upload a PDF or DOCX file.", type: "error" });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setNotice({ text: "Resume must be 10MB or smaller.", type: "error" });
      return;
    }

    setUploading(true);
    setNotice({ text: "", type: "" });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API}/api/profile/resume`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await readResponse(response);

      if (response.status === 401 || response.status === 403) {
        onSessionExpired?.();
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || data.detail || "Upload and parsing failed.");
      }

      const rawProfile = data.profile || data;
      const enrichedProfile = enrichProfileData(rawProfile, file.name);

      // Save enriched profile state
      setProfile(enrichedProfile);

      // Save to sessionStorage for instantaneous VoiceSimulator pickup
      try {
        sessionStorage.setItem("interviewai_has_resume", "true");
        sessionStorage.setItem("interviewai_active_profile", JSON.stringify(enrichedProfile));
      } catch {
        // sessionStorage fallback
      }

      // Persist enriched profile back to database
      await saveProfile(enrichedProfile, false);

      setNotice({
        text: "Profile analyzed! Launching your personalized interview...",
        type: "success",
      });

      // Instantly auto-navigate directly to the Voice Simulator
      setTimeout(() => {
        onStartInterview?.(enrichedProfile);
      }, 750);
    } catch (err) {
      setNotice({ text: err.message || "Could not process your resume.", type: "error" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  // Complete Resume Removal & Reset Flow
  async function handleRemoveResume() {
    if (!confirm("Are you sure you want to remove your uploaded resume and reset all extracted profile data?")) return;
    setSaving(true);
    setNotice({ text: "", type: "" });

    try {
      // 1. Delete resume document on backend
      await fetch(`${API}/api/profile/resume`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. Wipe extracted skills, projects, and summary on backend
      const cleanResetPayload = {
        candidateName: profile?.candidateName || "",
        contactEmail: profile?.contactEmail || "",
        phone: profile?.phone || "",
        professionalSummary: "",
        experienceLevel: "Mid-level",
        targetRole: "Software Engineer",
        preferredLanguage: "",
        interviewDifficulty: "Medium",
        technicalSkills: [],
        softSkills: [],
        topicsToPractice: [],
        education: [],
        certifications: [],
        achievements: [],
        projects: [],
        workExperience: [],
      };

      const updateRes = await fetch(`${API}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanResetPayload),
      });

      const updated = await readResponse(updateRes);

      // 3. Wipe local and session storage
      try {
        sessionStorage.removeItem("interviewai_has_resume");
        sessionStorage.removeItem("interviewai_active_profile");
        localStorage.removeItem("interviewai_extracted_resume");
      } catch {
        // fallback
      }

      // 4. Reset component state back to initial clean state
      setProfile(updated.id ? updated : { ...cleanResetPayload, resume: null });
      onProfileReset?.();
      setNotice({
        text: "Resume and extracted data completely removed. Ready for a clean upload.",
        type: "info",
      });
    } catch (err) {
      setNotice({ text: err.message || "Failed to remove resume.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(updatedData, showSuccessNotice = true) {
    setSaving(true);
    const target = updatedData || profile;
    try {
      const payload = {
        candidateName: target.candidateName || "",
        contactEmail: target.contactEmail || "",
        phone: target.phone || "",
        professionalSummary: target.professionalSummary || "",
        experienceLevel: target.experienceLevel || "Mid-level",
        targetRole: target.targetRole || "Software Engineer",
        preferredLanguage: target.preferredLanguage || "",
        interviewDifficulty: target.interviewDifficulty || "Medium",
        technicalSkills: target.technicalSkills || [],
        softSkills: target.softSkills || [],
        topicsToPractice: target.topicsToPractice || [],
        education: target.education || [],
        certifications: target.certifications || [],
        achievements: target.achievements || [],
        projects: (target.projects || []).map((p) => ({
          name: p.name || "",
          description: p.description || "",
          technologies: Array.isArray(p.technologies) ? p.technologies.join(", ") : (p.technologies || ""),
          responsibilities: p.responsibilities || p.role || "",
        })),
        workExperience: (target.workExperience || []).map((w) => ({
          title: w.title || "",
          organization: w.organization || "",
          period: w.period || "",
          details: w.details || "",
        })),
      };

      const response = await fetch(`${API}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await readResponse(response);
      if (!response.ok) throw new Error(data.message || "Failed to save profile changes.");

      setProfile(data);
      if (showSuccessNotice) {
        setNotice({ text: "Candidate profile updated successfully!", type: "success" });
      }
    } catch (err) {
      setNotice({ text: err.message || "Could not save profile changes.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  // Interactive tag operations
  function removeSkill(skillToRemove) {
    const nextSkills = (profile?.technicalSkills || []).filter((s) => s !== skillToRemove);
    const updated = { ...(profile || {}), technicalSkills: nextSkills };
    setProfile(updated);
    saveProfile(updated);
  }

  function addSkill(skillToAdd) {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    const current = profile?.technicalSkills || [];
    if (current.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    const nextSkills = [...current, trimmed];
    const updated = { ...(profile || {}), technicalSkills: nextSkills };
    setProfile(updated);
    saveProfile(updated);
    setNewSkillInput("");
  }

  function removeEducation(eduToRemove) {
    const nextEdu = (profile?.education || []).filter((e) => e !== eduToRemove);
    const updated = { ...(profile || {}), education: nextEdu };
    setProfile(updated);
    saveProfile(updated);
  }

  function addEducation() {
    const trimmed = newEducationInput.trim();
    if (!trimmed) return;
    const current = profile?.education || [];
    const nextEdu = [...current, trimmed];
    const updated = { ...(profile || {}), education: nextEdu };
    setProfile(updated);
    saveProfile(updated);
    setNewEducationInput("");
  }

  function setTargetRole(role) {
    const updated = { ...(profile || {}), targetRole: role };
    setProfile(updated);
    saveProfile(updated);
    setIsEditingRole(false);
  }

  function setExperienceLevel(level) {
    const updated = { ...(profile || {}), experienceLevel: level };
    setProfile(updated);
    saveProfile(updated);
  }

  const technicalSkills = profile?.technicalSkills || [];
  const education = profile?.education || [];
  const projects = profile?.projects || [];
  const hasResume = Boolean(profile?.resume);

  if (loading && !profile?.candidateName && technicalSkills.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center text-xs text-slate-400">
        Loading candidate profile data...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              Candidate Profile
            </span>
            <span className="text-xs text-slate-400">
              {hasResume ? "Resume-grounded personalization active" : "Quick setup mode"}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Profile & Onboarding Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automatic resume ingestion, interactive competency tags, and instant mock interview launch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onStartInterview?.(profile)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/20 transition-all shrink-0"
        >
          <span>Launch Voice Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {notice.text && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 animate-fadeIn ${
            notice.type === "success"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
              : notice.type === "info"
              ? "bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
              : "bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : notice.type === "info" ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-blue-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{notice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice({ text: "", type: "" })}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Mode Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab("resume")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "resume"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume-First Ingestion</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("quick-setup")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "quick-setup"
              ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3-Step Quick Setup</span>
        </button>
      </div>

      {/* TAB 1: RESUME-FIRST INGESTION */}
      {activeTab === "resume" && (
        <div className="space-y-8">
          {/* Upload Dropzone / Resume Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-indigo-500" />
                  <span>Resume Ingestion & Parsing</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Upload your resume in PDF or DOCX format. Key skills, frameworks, and projects are extracted into editable badges with instant interview launch.
                </p>
              </div>

              {hasResume && (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Active Resume Connected</span>
                  </span>
                  {/* CLEAN RESUME REMOVAL BUTTON */}
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl transition-colors"
                    title="Remove resume and reset profile state"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Resume</span>
                  </button>
                </div>
              )}
            </div>

            {/* Drag & drop upload box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
              }}
              onClick={() => {
                if (!uploading && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              className={`cursor-pointer border-2 border-dashed rounded-3xl p-8 text-center transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30"
                  : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/30"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />

              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-xs">
                {uploading ? (
                  <RefreshCw className="w-7 h-7 animate-spin" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <div className="text-base font-bold text-slate-800 dark:text-slate-200">
                {uploading ? "Analyzing resume & extracting skills..." : "Upload your resume (PDF or DOCX)"}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Drag & drop your resume file here or click to browse. We'll automatically extract technical competencies, projects, and target role.
              </p>

              <div className="mt-4">
                <button
                  type="button"
                  disabled={uploading}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploading ? "Analyzing..." : "Choose File to Upload"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* INTERACTIVE TAGS & FACTS DASHBOARD */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <span>Interactive Competency Badges</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Click any tag to remove it, or use the input below to add custom keywords.
                </p>
              </div>

              {hasResume && (
                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Extracted Data</span>
                </button>
              )}
            </div>

            {/* Target Role & Experience Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Target Role */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Target Role</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingRole(!isEditingRole)}
                    className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{isEditingRole ? "Done" : "Change"}</span>
                  </button>
                </div>

                {isEditingRole ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_ROLES.map((role) => (
                        <button
                          key={role}
                          type="button"
                          onClick={() => setTargetRole(role)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            profile?.targetRole === role
                              ? "bg-indigo-600 text-white"
                              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={customRoleInput}
                        onChange={(e) => setCustomRoleInput(e.target.value)}
                        placeholder="Or custom role..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customRoleInput.trim()) {
                            setTargetRole(customRoleInput.trim());
                            setCustomRoleInput("");
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-xl"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 font-bold text-sm">
                    <span>{profile?.targetRole || "Software Engineer"}</span>
                  </div>
                )}
              </div>

              {/* Experience Level */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Seniority & Experience Level</span>
                </span>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        profile?.experienceLevel === lvl.id
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Extracted Technical Skills Tags */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Programming Languages & Tech Stack ({technicalSkills.length})
                </label>
                <span className="text-[11px] text-slate-400">Click &times; to remove</span>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
                {technicalSkills.length === 0 ? (
                  <span className="text-xs text-slate-400 italic py-1">
                    No technical skills extracted yet. Upload a resume or add skills below.
                  </span>
                ) : (
                  technicalSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-xs group"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove tag"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Add custom skill inline input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill(newSkillInput);
                    }
                  }}
                  placeholder="Add skill tag (e.g. Docker, Python, PostgreSQL) and hit Enter..."
                  className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => addSkill(newSkillInput)}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Tag</span>
                </button>
              </div>
            </div>

            {/* Extracted Projects Highlights */}
            {projects.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Extracted Projects & Architectures</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj, idx) => {
                    const techList = parseTechnologies(proj.technologies);
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700 space-y-1.5"
                      >
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">{proj.name}</h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                          {proj.description}
                        </p>
                        {techList.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {techList.map((t) => (
                              <span
                                key={t}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Education Badges */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span>Education</span>
              </label>

              <div className="flex flex-wrap gap-2 min-h-[38px] p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700">
                {education.length === 0 ? (
                  <span className="text-xs text-slate-400 italic py-1">No education entries saved.</span>
                ) : (
                  education.map((edu) => (
                    <span
                      key={edu}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      <span>{edu}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(edu)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newEducationInput}
                  onChange={(e) => setNewEducationInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEducation();
                    }
                  }}
                  placeholder="Add degree / institution..."
                  className="flex-1 px-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={addEducation}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 rounded-xl transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => onStartInterview?.(profile)}
                className="px-7 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
              >
                <span>Save Profile & Launch Live Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 3-STEP QUICK SETUP (For Candidates Without a Resume) */}
      {activeTab === "quick-setup" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-sm space-y-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      quickStep === step
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                        : quickStep > step
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {quickStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && <div className="w-8 h-0.5 bg-slate-200 dark:bg-slate-800" />}
                </div>
              ))}
            </div>

            <span className="text-xs font-semibold text-slate-400">
              Step {quickStep} of 3: {quickStep === 1 ? "Target Role" : quickStep === 2 ? "Seniority" : "Key Tech Stack"}
            </span>
          </div>

          {/* STEP 1: TARGET ROLE */}
          {quickStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  What target role are you interviewing for?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select your primary discipline to customize question difficulties and interviewer persona.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {POPULAR_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setTargetRole(role);
                      setQuickStep(2);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      profile?.targetRole === role
                        ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="font-bold text-xs">{role}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: EXPERIENCE LEVEL */}
          {quickStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Select your seniority and years of experience
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This calibrates behavioral questions, architecture depth, and rubric expectations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => {
                      setExperienceLevel(lvl.id);
                      setQuickStep(3);
                    }}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      profile?.experienceLevel === lvl.id
                        ? "border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{lvl.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lvl.desc}</div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-start">
                <button
                  type="button"
                  onClick={() => setQuickStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Back to Role Selection
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TECH STACK SELECTION */}
          {quickStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Select your core tech stack and languages
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose the technologies you want the AI Interviewer to test and probe.
                </p>
              </div>

              <div className="space-y-5">
                {Object.entries(SUGGESTED_SKILLS_BY_CATEGORY).map(([category, skills]) => (
                  <div key={category} className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {category}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => {
                        const isSelected = technicalSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => (isSelected ? removeSkill(skill) : addSkill(skill))}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            <span>{skill}</span>
                            {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Complete CTA */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setQuickStep(2)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    saveProfile();
                    onStartInterview?.(profile);
                  }}
                  className="px-7 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Save Profile & Start Interviewing</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
