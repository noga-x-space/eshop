import React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
// import { useHistory } from "react-router-dom";
import "./design/Auth.scss";

const Auth = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [isLogin, setIsLogin] = useState(true);
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [focusedButton, setFocusedButton] = useState("login");

  // const history = useHistory();

  const viewLogin = (status) => {
    setError(null);
    setIsLogin(status);
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError("Make sure passwords match!");
      return;
    }

    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}:8000/${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      }
    );
    const data = await response.json();

    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("UserName", data.userName);
      setCookie("AuthToken", data.token);
      // history.push("/");
    }
  };

  const handleButtonToggle = (button) => {
    setFocusedButton(button);
  };

  return (
    <div className="auth-container">
      {!cookies.UserName ? (
        <>
          <form>
            <h2>{isLogin ? "Log in" : "Register"}</h2>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            )}
            <input
              type="submit"
              onClick={(e) => handleSubmit(e, isLogin ? "login" : "signup")}
              className="create-btn"
              value="Submit"
            />
            {error && <p className="error-message">{error}</p>}
          </form>
          {isLogin && (
            <label className="forgot-password">Forgot password?</label>
          )}
          <div className="auth-options">
            <button
              className={`auth-button ${
                focusedButton === "signup" ? "active" : ""
              }`}
              onClick={() => {
                viewLogin(false);
                handleButtonToggle("signup");
              }}
            >
              Sign Up
            </button>
            <button
              className={`auth-button ${
                focusedButton === "login" ? "active" : ""
              }`}
              onClick={() => {
                viewLogin(true);
                handleButtonToggle("login");
              }}
            >
              Login
            </button>
          </div>
        </>
      ) : (
        <h3>
          You are currently logged in as{" "}
          <span className="highlighted-username">{cookies.UserName}</span>.
          Please logout before logging in with a different account.
        </h3>
      )}
    </div>
  );
};

export default Auth;
