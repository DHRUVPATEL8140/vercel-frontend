// // src/components/Register.js
// import React, {useState} from "react";
// import api from "../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function Register(){
//   const [username,setUsername] = useState("");
//   const [password,setPassword] = useState("");
//   const [email,setEmail] = useState("");
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("auth/register/", { username, password, email });
//       alert("Registered. Please login.");
//       navigate("/login");
//     } catch (err) {
//       console.error(err);
//       alert("Registration failed");
//     }
//   };

//   return (
//     <form onSubmit={submit}>
//       <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
//       <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
//       <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
//       <button type="submit">Register</button>
//     </form>
//   );
// }
// src/components/Register.js
import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaArrowLeft } from "react-icons/fa";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    setErrors({});

    try {
      await api.post("auth/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      setSuccess(true);
    } catch (err) {
      console.error("Registration error:", err);
      setErrors({
        server: err.response?.data?.message || 
               err.response?.data?.detail || 
               "Registration failed. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.successIcon}>
            <svg viewBox="0 0 24 24" width="64" height="64" fill="#40916c">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 style={styles.title}>Registration Successful!</h2>
          <p style={styles.successText}>
            Your account has been created successfully. Please login to continue.
          </p>
          <button 
            onClick={() => navigate("/login")} 
            style={styles.button}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <button 
          onClick={() => navigate(-1)} 
          style={styles.backButton}
        >
          <FaArrowLeft /> Back
        </button>
        
        <h2 style={styles.title}>Create an Account</h2>
        <p style={styles.subtitle}>Join us today</p>
        
        {errors.server && (
          <div style={styles.errorAlert}>
            {errors.server}
          </div>
        )}

        <form onSubmit={submit} style={styles.form}>
          <div style={styles.inputGroup}>
            <div style={styles.icon}>
              <FaUser />
            </div>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              style={{
                ...styles.input,
                ...(errors.username ? styles.inputError : {})
              }}
            />
            {errors.username && (
              <span style={styles.errorText}>{errors.username}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.icon}>
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {})
              }}
            />
            {errors.email && (
              <span style={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.icon}>
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {})
              }}
            />
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <div style={styles.icon}>
              <FaLock />
            </div>
            <input
              typex="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              style={{
                ...styles.input,
                ...(errors.confirmPassword ? styles.inputError : {})
              }}
            />
            {errors.confirmPassword && (
              <span style={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            style={styles.button}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner style={styles.spinner} />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{" "}
            <a 
              href="/login" 
              style={styles.footerLink}
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Sign in
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
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "40px",
    width: "100%",
    maxWidth: "450px",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: "15px",
    left: "15px",
    background: "none",
    border: "none",
    color: "#718096",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    fontSize: "0.9rem",
    ":hover": {
      color: "#40916c",
    },
  },
  title: {
    color: "#2d3748",
    textAlign: "center",
    marginBottom: "5px",
    fontSize: "1.8rem",
  },
  subtitle: {
    color: "#718096",
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "1rem",
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
    gap: "15px",
  },
  inputGroup: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  icon: {
    position: "absolute",
    left: "12px",
    top: "12px",
    color: "#718096",
  },
  input: {
    width: "100%",
    padding: "12px 12px 12px 40px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "1rem",
    transition: "all 0.2s",
    ":focus": {
      outline: "none",
      borderColor: "#40916c",
      boxShadow: "0 0 0 3px rgba(64, 145, 108, 0.2)",
    },
  },
  inputError: {
    borderColor: "#e53e3e",
    ":focus": {
      borderColor: "#e53e3e",
      boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.2)",
    },
  },
  errorText: {
    color: "#e53e3e",
    fontSize: "0.8rem",
    marginTop: "5px",
  },
  button: {
    backgroundColor: "#40916c",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    marginTop: "10px",
    ":hover": {
      backgroundColor: "#2d6a4f",
    },
    ":disabled": {
      backgroundColor: "#a0aec0",
      cursor: "not-allowed",
    },
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
    ":hover": {
      textDecoration: "underline",
    },
  },
  successIcon: {
    textAlign: "center",
    marginBottom: "20px",
  },
  successText: {
    color: "#4a5568",
    textAlign: "center",
    marginBottom: "30px",
    lineHeight: "1.5",
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