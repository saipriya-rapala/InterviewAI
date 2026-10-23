import { useEffect, useRef, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const EXPERIENCE_LEVELS = ["Student / Entry-level", "Junior", "Mid-level", "Senior", "Lead"];

function readJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { detail: text, message: text };
  }
}

function linesToList(value) {
  return value.split(/[\n,;]/).map((item) => item.trim()).filter(Boolean);
}

function ProfileWorkspace({ token, onSessionExpired, onStartInterview }) {
  const [profile, setProfile] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [retryingAnalysis, setRetryingAnalysis] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [warnings, setWarnings] = useState([]);
  const fileInput = useRef(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileResponse, catalogResponse] = await Promise.all([
          fetch(`${API}/api/profile`, { headers }),
          fetch(`${API}/api/profile/technologies`, { headers }),
        ]);
        const [profileData, catalogData] = await Promise.all([
          readResponse(profileResponse),
          readResponse(catalogResponse),
        ]);

        if ([profileResponse.status, catalogResponse.status].some((status) => status === 401 || status === 403)) {
          onSessionExpired();
          return;
        }
        if (!profileResponse.ok || !catalogResponse.ok) {
          throw new Error(profileData.message || profileData.detail || catalogData.message || catalogData.detail || "Could not load your candidate profile.");
        }
        if (active) {
          setProfile(profileData);
          setTechnologies(Array.isArray(catalogData) ? catalogData : []);
        }
      } catch (loadError) {
        if (active) setError(loadError.message || "Could not connect to the backend.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();
    return () => { active = false; };
  }, [token, onSessionExpired]);

  function updateField(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function updateList(field, value) {
    updateField(field, linesToList(value));
  }

  function toggleTechnology(name) {
    const selected = profile.technicalSkills || [];
    updateField(
      "technicalSkills",
      selected.includes(name)
        ? selected.filter((skill) => skill !== name)
        : [...selected, name]
    );
  }

  function updateProject(index, field, value) {
    const projects = [...(profile.projects || [])];
    projects[index] = { ...projects[index], [field]: value };
    updateField("projects", projects);
  }

  function updateExperience(index, field, value) {
    const workExperience = [...(profile.workExperience || [])];
    workExperience[index] = { ...workExperience[index], [field]: value };
    updateField("workExperience", workExperience);
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const cleanProfile = { ...profile };
      delete cleanProfile.id;
      delete cleanProfile.resume;
      delete cleanProfile.resumeAnalysisSummary;
      delete cleanProfile.resumeAnalysisMode;

      const response = await fetch(`${API}/api/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanProfile),
      });
      const data = await readResponse(response);
      if (response.status === 401 || response.status === 403) {
        onSessionExpired();
        return;
      }
      if (!response.ok) throw new Error(data.message || data.detail || "Could not save your profile.");
      setProfile(data);
      setNotice("Profile saved.");
    } catch (saveError) {
      setError(saveError.message || "Could not connect to the backend.");
    } finally {
      setSaving(false);
    }
  }

  function uploadResume(event) {
    event.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (!file) {
      setError("Choose a PDF or DOCX file first.");
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx"].includes(extension)) {
      setError("Choose a PDF or DOCX resume.");
      return;
    }
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      setError("Resume files must be between 1 byte and 10 MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");
    setNotice("");
    setWarnings([]);

    const request = new XMLHttpRequest();
    request.open("POST", `${API}/api/profile/resume`);
    request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.upload.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) {
        setUploadProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
      }
    };
    request.onload = () => {
      const data = readJson(request.responseText);
      if (request.status === 401 || request.status === 403) {
        onSessionExpired();
      } else if (request.status < 200 || request.status >= 300) {
        setError(data.message || data.detail || "The resume could not be uploaded.");
      } else {
        setProfile(data.profile);
        setWarnings(data.warnings || []);
        setNotice(data.extractionStatus === "NO_SELECTABLE_TEXT"
          ? "Upload saved, but no selectable text was found. OCR is not enabled."
          : "Resume parsed and analysis saved to your profile.");
      }
    };
    request.onerror = () => setError("Upload failed. Check your connection and try again.");
    request.onloadend = () => setUploading(false);

    const formData = new FormData();
    formData.append("file", file);
    request.send(formData);
  }

  async function removeResume() {
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API}/api/profile/resume`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await readResponse(response);
      if (response.status === 401 || response.status === 403) {
        onSessionExpired();
        return;
      }
      if (!response.ok) throw new Error(data.message || data.detail || "Could not remove the resume.");
      setProfile(data);
      setNotice("Resume removed. Your reviewed profile remains available.");
    } catch (removeError) {
      setError(removeError.message || "Could not connect to the backend.");
    }
  }

  async function retryAnalysis() {
    setRetryingAnalysis(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`${API}/api/profile/resume/analysis/regenerate`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await readResponse(response);
      if (response.status === 401 || response.status === 403) {
        onSessionExpired();
        return;
      }
      if (!response.ok) throw new Error(data.message || data.detail || "AI analysis could not be regenerated.");
      setProfile(data);
      setNotice("AI resume analysis updated.");
    } catch (retryError) {
      setError(retryError.message || "Could not connect to the backend.");
    } finally {
      setRetryingAnalysis(false);
    }
  }

  if (loading) return <p className="profile-status" role="status">Loading your profile…</p>;
  if (!profile) return <p className="profile-error" role="alert">{error || "Profile unavailable."}</p>;

  const groupedTechnologies = technologies.reduce((groups, item) => {
    groups[item.category] = [...(groups[item.category] || []), item];
    return groups;
  }, {});

  return (
    <section className="profile-workspace" aria-labelledby="profile-title">
      <div className="profile-title-row">
        <div>
          <h2 id="profile-title">Candidate profile</h2>
          <p>Use a resume or build your profile manually. Review extracted details before saving.</p>
        </div>
      </div>

      <section className="profile-upload-section" aria-labelledby="resume-title">
        <div className="profile-section-heading">
          <div>
            <h3 id="resume-title">Resume</h3>
            <p>PDF or DOCX · maximum 10 MB · stored privately</p>
          </div>
          {profile.resume && <span className="resume-file-name">{profile.resume.fileName}</span>}
        </div>
        <form className="resume-upload-form" onSubmit={uploadResume}>
          <input
            ref={fileInput}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            disabled={uploading}
            aria-label="Choose PDF or DOCX resume"
          />
          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading…" : "Upload and parse"}
          </button>
          {profile.resume && (
            <button className="quiet-button" type="button" onClick={removeResume} disabled={uploading}>
              Remove resume
            </button>
          )}
        </form>
        {uploading && (
          <div className="upload-progress" role="status">
            <progress max="100" value={uploadProgress} />
            <span>{uploadProgress}% · extracting text and sections…</span>
          </div>
        )}
      </section>

      {error && <p className="profile-error" role="alert">{error}</p>}
      {notice && <p className="profile-notice" role="status">{notice}</p>}
      {warnings.map((warning) => <p className="profile-warning" key={warning}>{warning}</p>)}

      {profile.resumeAnalysisSummary && (
        <section className="resume-analysis-section" aria-labelledby="resume-analysis-title">
          <div className="profile-section-heading">
            <div>
              <h3 id="resume-analysis-title">Resume analysis</h3>
              <span className={profile.resumeAnalysisMode === "openai" ? "analysis-mode ai-mode" : "analysis-mode"}>
                {profile.resumeAnalysisMode === "openai" ? "AI-generated" : "Rule-based summary"}
              </span>
            </div>
            <button className="quiet-button" type="button" onClick={onStartInterview}>Generate interview questions</button>
            {profile.resume && profile.resumeAnalysisMode !== "openai" && (
              <button className="quiet-button" type="button" onClick={retryAnalysis} disabled={retryingAnalysis}>
                {retryingAnalysis ? "Retrying AI analysis…" : "Retry AI analysis"}
              </button>
            )}
          </div>
          {profile.resumeAnalysisMode !== "openai" && (
            <p className="profile-warning">AI analysis is unavailable. This summary only reorganizes extracted profile facts and marks missing details.</p>
          )}
          <div className="resume-analysis-summary">{profile.resumeAnalysisSummary}</div>
          <div className="resume-analysis-facts">
            <div>
              <h4>Extracted skills</h4>
              {profile.technicalSkills?.length
                ? <ul className="resume-skill-list">{profile.technicalSkills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                : <p>No technical skills were confidently extracted.</p>}
            </div>
            <div>
              <h4>Projects</h4>
              {profile.projects?.length
                ? profile.projects.map((project, index) => (
                  <article className="resume-project-summary" key={`${project.name}-${index}`}>
                    <strong>{project.name || "Project"}</strong>
                    {project.technologies && <span>{project.technologies}</span>}
                    <p>{project.description || "No project description was confidently extracted."}</p>
                  </article>
                ))
                : <p>No projects were confidently extracted.</p>}
            </div>
          </div>
        </section>
      )}

      <form className="profile-form" onSubmit={saveProfile}>
        <section className="profile-section">
          <h3>Personal and interview goals</h3>
          <div className="profile-fields-grid">
            <label>Candidate name<input maxLength={100} value={profile.candidateName || ""} onChange={(event) => updateField("candidateName", event.target.value)} /></label>
            <label>Contact email<input type="email" maxLength={254} value={profile.contactEmail || ""} onChange={(event) => updateField("contactEmail", event.target.value)} /></label>
            <label>Phone<input maxLength={80} value={profile.phone || ""} onChange={(event) => updateField("phone", event.target.value)} /></label>
            <label>Target role<input maxLength={120} placeholder="e.g. Backend Engineer" value={profile.targetRole || ""} onChange={(event) => updateField("targetRole", event.target.value)} /></label>
            <label>Experience level
              <select value={profile.experienceLevel || ""} onChange={(event) => updateField("experienceLevel", event.target.value)}>
                <option value="">Select experience level</option>
                {EXPERIENCE_LEVELS.map((level) => <option key={level}>{level}</option>)}
                {profile.experienceLevel && !EXPERIENCE_LEVELS.includes(profile.experienceLevel) && <option>{profile.experienceLevel}</option>}
              </select>
            </label>
            <label>Preferred language
              <select value={profile.preferredLanguage || ""} onChange={(event) => updateField("preferredLanguage", event.target.value)}>
                <option value="">Choose a language</option>
                {(groupedTechnologies["Programming languages"] || []).map((item) => <option key={item.name}>{item.name}</option>)}
                {profile.preferredLanguage && !(groupedTechnologies["Programming languages"] || []).some((item) => item.name === profile.preferredLanguage) && <option>{profile.preferredLanguage}</option>}
              </select>
            </label>
            <label>Interview difficulty
              <select value={profile.interviewDifficulty || "Medium"} onChange={(event) => updateField("interviewDifficulty", event.target.value)}>
                {["Easy", "Medium", "Hard"].map((level) => <option key={level}>{level}</option>)}
              </select>
            </label>
          </div>
          <label className="profile-wide-field">Professional summary<textarea rows={4} maxLength={5000} value={profile.professionalSummary || ""} onChange={(event) => updateField("professionalSummary", event.target.value)} /></label>
        </section>

        <section className="profile-section">
          <h3>Skills and practice topics</h3>
          {Object.entries(groupedTechnologies).map(([category, items]) => (
            <fieldset className="technology-group" key={category}>
              <legend>{category}</legend>
              <div className="technology-options">
                {items.map((item) => (
                  <label className="technology-option" key={item.name}>
                    <input
                      type="checkbox"
                      checked={(profile.technicalSkills || []).includes(item.name)}
                      onChange={() => toggleTechnology(item.name)}
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <label className="profile-wide-field">Other technical skills<textarea rows={2} placeholder="One per line" value={(profile.technicalSkills || []).filter((skill) => !technologies.some((item) => item.name === skill)).join("\n")} onChange={(event) => {
            const catalogSkills = (profile.technicalSkills || []).filter((skill) => technologies.some((item) => item.name === skill));
            updateField("technicalSkills", [...catalogSkills, ...linesToList(event.target.value)]);
          }} /></label>
          <div className="profile-fields-grid">
            <label>Soft skills<textarea rows={3} placeholder="One per line" value={(profile.softSkills || []).join("\n")} onChange={(event) => updateList("softSkills", event.target.value)} /></label>
            <label>Topics to practise<textarea rows={3} placeholder="One per line" value={(profile.topicsToPractice || []).join("\n")} onChange={(event) => updateList("topicsToPractice", event.target.value)} /></label>
            <label>Education<textarea rows={3} placeholder="One entry per line" value={(profile.education || []).join("\n")} onChange={(event) => updateList("education", event.target.value)} /></label>
            <label>Certifications<textarea rows={3} placeholder="One entry per line" value={(profile.certifications || []).join("\n")} onChange={(event) => updateList("certifications", event.target.value)} /></label>
            <label>Achievements<textarea rows={3} placeholder="One entry per line" value={(profile.achievements || []).join("\n")} onChange={(event) => updateList("achievements", event.target.value)} /></label>
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <h3>Projects</h3>
            <button className="quiet-button" type="button" onClick={() => updateField("projects", [...(profile.projects || []), { name: "", description: "", technologies: "", responsibilities: "" }])}>Add project</button>
          </div>
          {(profile.projects || []).map((project, index) => (
            <div className="profile-entry" key={`project-${index}`}>
              <div className="profile-fields-grid">
                <label>Project name<input value={project.name || ""} onChange={(event) => updateProject(index, "name", event.target.value)} /></label>
                <label>Technologies<input value={project.technologies || ""} onChange={(event) => updateProject(index, "technologies", event.target.value)} /></label>
              </div>
              <label>Description<textarea rows={3} value={project.description || ""} onChange={(event) => updateProject(index, "description", event.target.value)} /></label>
              <label>Responsibilities<textarea rows={2} value={project.responsibilities || ""} onChange={(event) => updateProject(index, "responsibilities", event.target.value)} /></label>
              <button className="quiet-button" type="button" onClick={() => updateField("projects", profile.projects.filter((_, itemIndex) => itemIndex !== index))}>Remove project</button>
            </div>
          ))}
          {(profile.projects || []).length === 0 && <p className="profile-status">No projects added.</p>}
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <h3>Work experience and internships</h3>
            <button className="quiet-button" type="button" onClick={() => updateField("workExperience", [...(profile.workExperience || []), { title: "", organization: "", period: "", details: "" }])}>Add experience</button>
          </div>
          {(profile.workExperience || []).map((item, index) => (
            <div className="profile-entry" key={`experience-${index}`}>
              <div className="profile-fields-grid">
                <label>Role<input value={item.title || ""} onChange={(event) => updateExperience(index, "title", event.target.value)} /></label>
                <label>Organization<input value={item.organization || ""} onChange={(event) => updateExperience(index, "organization", event.target.value)} /></label>
                <label>Period<input value={item.period || ""} onChange={(event) => updateExperience(index, "period", event.target.value)} /></label>
              </div>
              <label>Details<textarea rows={3} value={item.details || ""} onChange={(event) => updateExperience(index, "details", event.target.value)} /></label>
              <button className="quiet-button" type="button" onClick={() => updateField("workExperience", profile.workExperience.filter((_, itemIndex) => itemIndex !== index))}>Remove experience</button>
            </div>
          ))}
          {(profile.workExperience || []).length === 0 && <p className="profile-status">No experience entries added.</p>}
        </section>

        <div className="profile-save-row">
          <button type="submit" disabled={saving || uploading}>{saving ? "Saving…" : "Save profile"}</button>
          {notice && <span role="status">{notice}</span>}
        </div>
      </form>
    </section>
  );
}

export default ProfileWorkspace;
