import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { loginUser,registerUser,getLoggedInUser } from "../../services/authService";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loggedUser = getLoggedInUser();
  const navigate = useNavigate();
  const theme = useTheme();

   const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });

      // save token
      localStorage.setItem("token", res.data.token);

      alert("Login successful!");

      if (loggedUser.role === "Admin") navigate("/dashboard");
      else navigate("/user-dashboard"); // dashboard
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  const handleRegister = async () => {
  try {
    await registerUser({
      fullName: userName,
      email: email,
      password: password
    });

    alert("Registration successful! Please login.");
    setIsRegister(false); // switch back to login
  } catch (err) {
    alert(err.response?.data || "Registration failed");
  }
};

  return (
    // <div className="auth-container">
     <div className={`auth-container ${theme.palette.mode === "light" ? "light-theme" : ""}`}>
      <div className={`auth-card ${isRegister ? "register-mode" : ""}`}>
        <div className="auth-inner">

          {/* ===== LOGIN SIDE (RIGHT) ===== */}
          <div className="face login-face">
            <div className="welcome-panel">
              <h1>WELCOME BACK!</h1>
              <button onClick={() => setIsRegister(true)}>Sign Up</button>
            </div>

            <div className="form-panel">
              <h2>Login</h2>
              <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="main-btn" onClick={handleLogin}>LOGIN</button>

              <p>
                Don’t have an account?
                <span onClick={() => setIsRegister(true)}> Sign Up</span>
              </p>
            </div>
          </div>

          {/* ===== REGISTER SIDE (LEFT) ===== */}
          <div className="face register-face">
            <div className="form-panel">
              <h2>Register</h2>
              <input type="text" placeholder="Username"  value={userName} onChange={(e) => setUserName(e.target.value)}/>
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="main-btn" onClick={handleRegister}>REGISTER</button>

              <p>
                Already have an account?
                <span onClick={() => setIsRegister(false)}> Log In</span>
              </p>
            </div>

            <div className="welcome-panel">
              <h1>WELCOME!</h1>
              <button onClick={() => setIsRegister(false)}>Log In</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
