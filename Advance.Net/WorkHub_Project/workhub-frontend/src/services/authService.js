import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

export const loginUser = async (credentials) => {
  localStorage.clear(); // clean previous session

  const res = await api.post("/Auth/login", credentials);
  const data = res.data;

  if (data.token) localStorage.setItem("token", data.token);

  // store user info properly
  const user = {
    userId: data.userId,
    fullName: data.fullName,
    email: data.email,
    role: data.role
  };

  localStorage.setItem("user", JSON.stringify(user));

  return res;
};

// ── Logout ────────────────────────────────────────────────────
export const logoutUser = () => {
  localStorage.clear();
  sessionStorage.clear();
  delete api.defaults.headers.common["Authorization"];
};
export const registerUser = (data) => api.post("/Auth/register", data);

export const getLoggedInUser = () => {
  const user = localStorage.getItem("user");

  if (user) {
    return JSON.parse(user);
  }

  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = jwtDecode(token);

  return {
    userId: Number(
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
    ),
    role:
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    email:
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]
  };
};