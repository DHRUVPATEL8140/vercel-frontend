// // src/components/Login.js
// import React, {useState} from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Login(){
//   const [username,setUsername] = useState("");
//   const [password,setPassword] = useState("");
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post("auth/token/", { username, password });
//       localStorage.setItem("access_token", res.data.access);
//       localStorage.setItem("refresh_token", res.data.refresh);
//       localStorage.setItem("username", username);
//       navigate("/");
//     } catch (err) {
//       alert("Login failed");
//     }
//   };

//   return (
//     <form onSubmit={submit}>
//       <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
//       <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
//       <button type="submit">Login</button>
//     </form>
//   );
// }
// src/components/Login.js
 // src/components/Login.js
import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";
import { useUser } from './UserContext'; // Fixed import path

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser(); // Use login function from context

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("auth/token/", { username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.setItem("username", username);
      
      // Fetch user info after login and update context
      const userRes = await api.get('auth/user/');
      login(res.data.access, userRes.data); // Use login function from context
      
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h2 style={styles.title}>Login to Your Account</h2>
        
        {error && (
          <div style={styles.errorAlert}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.icon}>
              <FaUser />
            </div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.icon}>
              <FaLock />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner style={styles.spinner} />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{" "}
            <a 
              href="/register" 
              style={styles.footerLink}
              onClick={(e) => {
                e.preventDefault();
                navigate("/register");
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f7fa",
    padding: "20px",
  },
  loginCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    color: "#2d3748",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "1.5rem",
  },
  errorAlert: {
    backgroundColor: "#fff5f5",
    color: "#e53e3e",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "0.9rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: "12px",
    color: "#718096",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "1rem",
    transition: "all 0.2s",
  },
  button: {
    backgroundColor: "#40916c",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
  },
  spinner: {
    animation: "spin 1s linear infinite",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
  },
  footerText: {
    color: "#718096",
    fontSize: "0.9rem",
  },
  footerLink: {
    color: "#40916c",
    fontWeight: "500",
    textDecoration: "none",
  },
};

// Add spin animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);