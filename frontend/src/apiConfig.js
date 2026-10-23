const rawApi = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export const API = (rawApi.startsWith("http://") || rawApi.startsWith("https://"))
  ? rawApi.replace(/\/+$/, "")
  : `https://${rawApi}`.replace(/\/+$/, "");

export default API;
