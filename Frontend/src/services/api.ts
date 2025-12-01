import ApiClient from "./ApiClient";

// Create an instance with your backend API base URL
// Replace this with your actual backend URL or use an environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = new ApiClient(API_BASE_URL);

export default api;
