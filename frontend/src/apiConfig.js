export const CLOUD_API_URL = "https://interviewai-backend-jywj.onrender.com";
export const LOCAL_API_URL = "http://localhost:8081";

export function getApiTarget() {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedTarget = window.localStorage.getItem("interviewai_api_target");
    if (storedTarget === "cloud" || storedTarget === "local") {
      return storedTarget;
    }
  }
  return "cloud"; // Default to cloud so users don't need a local Spring Boot server running
}

export function resolveApiUrl() {
  // 1. Explicit override in localStorage
  if (typeof window !== "undefined" && window.localStorage) {
    const storedUrl = window.localStorage.getItem("interviewai_api_url");
    if (storedUrl && (storedUrl.startsWith("http://") || storedUrl.startsWith("https://"))) {
      return storedUrl.replace(/\/+$/, "");
    }
  }

  // 2. Target preference (cloud vs local)
  const target = getApiTarget();
  if (target === "local") {
    return LOCAL_API_URL;
  }

  // 3. Environment variable if explicitly set
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
  if (envUrl && (envUrl.includes(".") || envUrl.includes("localhost"))) {
    const trimmed = envUrl.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed.replace(/\/+$/, "");
    }
    return `https://${trimmed}`.replace(/\/+$/, "");
  }

  // 4. Default to cloud backend
  return CLOUD_API_URL;
}

export function switchApiTarget(target) {
  if (typeof window !== "undefined" && window.localStorage) {
    if (target === "local") {
      window.localStorage.setItem("interviewai_api_target", "local");
      window.localStorage.setItem("interviewai_api_url", LOCAL_API_URL);
    } else {
      window.localStorage.setItem("interviewai_api_target", "cloud");
      window.localStorage.setItem("interviewai_api_url", CLOUD_API_URL);
    }
  }
}

export const API = resolveApiUrl();
export default API;
