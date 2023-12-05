import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  let navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    axios
      .post("http://localhost:5000/api/users/login", {
        username: loginUsername,
        password: loginPassword,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      })
      .catch((error) => {
        setLoginError("Invalid credentials");
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterError("");

    axios
      .post("http://localhost:5000/api/users/register", {
        username: registerUsername,
        password: registerPassword,
      })
      .then((response) => {
        // Registration successful
      })
      .catch((error) => {
        setRegisterError(error.response.data.error || "Registration failed");
      });
  };

  return (
    <div>
      <form className="login-box" method="post" onSubmit={handleLogin}>
        <fieldset>
          <legend>Login</legend>
          <table>
            <tr>
              <td>
                <label>Username:</label>
              </td>
              <td>
                <input
                  type="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Password:</label>
              </td>
              <td>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="submit"></td>
              <td>
                <input type="submit" value="Login"></input>
                {loginError && <div className="error-msg">{loginError}</div>}
              </td>
            </tr>
          </table>
        </fieldset>
      </form>
      <form className="register-box" method="post" onSubmit={handleRegister}>
        <fieldset>
          <legend>Register</legend>
          <table>
            <tr>
              <td>
                <label>Username:</label>
              </td>
              <td>
                <input
                  type="username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Password:</label>
              </td>
              <td>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td className="submit"></td>
              <td>
                <input type="submit" value="Register"></input>
                {registerError && (
                  <div className="error-msg">{registerError}</div>
                )}
              </td>
            </tr>
          </table>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
