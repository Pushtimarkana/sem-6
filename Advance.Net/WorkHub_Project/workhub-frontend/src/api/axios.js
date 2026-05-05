import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7039/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

//intercept for token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");

//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

api.interceptors.request.use((config) => {
  const isLoginRequest = config.url.includes("/Auth/login");
 
  if (isLoginRequest) {
    // ✅ Always strip the Authorization header on login requests
    // so a stale token from a previous user never gets sent
    delete config.headers.Authorization;
    return config;
  }
 
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 
  return config;
});

// 🔥 Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLoginRequest = error.config?.url?.includes("/Auth/login");

   if (status === 401) {
      if (isLoginRequest) {
        // ✅ Wrong credentials on login — do NOT redirect, do NOT clear storage.
        // Just let the error bubble up so your Login page can show "Invalid credentials".
        return Promise.reject(error);
      }
 
      // 401 on a protected route → session expired, clear and redirect
      localStorage.clear();
      localStorage.setItem("errorStatus", 401);
      window.location.replace(`/error?code=${status}`);
      return Promise.reject(error);
    }

    if (status === 403) {
      localStorage.setItem("errorStatus", 403);
      window.location.replace(`/error?code=${status}`);;
    }

    if (status === 500) {
      localStorage.setItem("errorStatus", 500);
      window.location.replace(`/error?code=${status}`);;
    }

    return Promise.reject(error);
  }
);



export default api;
