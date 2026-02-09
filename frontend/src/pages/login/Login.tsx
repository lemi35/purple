import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.scss";
import userContext from "../../contexts/UserContext";

const Login = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("Login must be used within a userContext.Provider");
  }

  const { contextUsername, setContextUsername, contextRole, setContextRole } = context;
  const navigate = useNavigate();
  const baseurl = "http://localhost:3001";

  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
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
      const response = await fetch(`${baseurl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      setContextUsername(data.username);
      setContextRole(data.role);
      navigate("/");
    } catch (error) {
      console.error(error);
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
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
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
