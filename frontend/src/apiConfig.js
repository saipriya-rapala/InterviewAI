export function resolveApiUrl() {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

  // If envUrl is provided and contains a valid domain with a dot or is localhost
  if (envUrl && (envUrl.includes(".") || envUrl.includes("localhost"))) {
    const trimmed = envUrl.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed.replace(/\/+$/, "");
    }
    return `https://${trimmed}`.replace(/\/+$/, "");
  }

  // If running in browser and NOT on localhost / 127.0.0.1, fallback to deployed backend URL
  if (typeof window !== "undefined" && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== "localhost" && host !== "127.0.0.1") {
      return "https://interviewai-backend-jywj.onrender.com";
    }
  }

  return "http://localhost:8081";
}

export const API = resolveApiUrl();
export default API;
