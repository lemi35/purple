import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import userContext from "../../contexts/UserContext";
import UserType from "../../types/UserType";

const Login = () => {
  const context = useContext(userContext);

  if (!context) {
    throw new Error("Login must be used within a userContext.Provider");
  }

  const {
    setContextUsername,
    setContextRole,
    setCurrentUser,   // ✅ IMPORTANT
  } = context;

  const navigate = useNavigate();
  const baseurl = import.meta.env.VITE_API_URL;

  // ✅ DO NOT USE null HERE
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleErrorTimer = (msg: string) => {
    setLoginError(true);
    setErrorMessage(msg);
    setTimeout(() => {
      setLoginError(false);
      setErrorMessage("");
    }, 3000);
  };

  const handleLoginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log("LOGIN STARTED");

      // 1️⃣ LOGIN (sets cookie)
      const loginResponse = await fetch(`${baseurl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        handleErrorTimer("Invalid username or password");
        return;
      }

      console.log("LOGIN SUCCESS");
      const data = await loginResponse.json(); // actual response from backend
      console.log("Registration response:", data);

      // 2️⃣ FETCH CURRENT USER
      const meResponse = await fetch(`${baseurl}/users/me`, {
        credentials: "include",
      });

      if (!meResponse.ok) {
        handleErrorTimer("Failed to fetch current user");
        return;
      }

      const user: UserType = await meResponse.json();

      console.log("USER FROM /me:", user);

      // 3️⃣ SET FULL USER IN CONTEXT
      setCurrentUser(user);
      setContextUsername(user.username);
      setContextRole(user.role);

      // 4️⃣ NAVIGATE HOME
      navigate("/");

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      handleErrorTimer("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login">
      <div className="login-card">
        <div>
          <h2>Welcome to Purple!</h2>

          {loginError && (
            <div className="div-error">
              <h5>{errorMessage}</h5>
            </div>
          )}

          <h2>Log in</h2>

          <form onSubmit={handleLoginUser}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Log in</button>
          </form>

          <hr />

          <p>Don't have an account?</p>
          <Link to="/register">
            <button>Create a new account</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
