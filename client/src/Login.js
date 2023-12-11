import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");
  const [messageType, setMessageType] = useState("success");

  let navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginMsg("Logging in...");
    setMessageType("success");

    axios
      .post("http://localhost:5000/api/users/login", {
        username: loginUsername,
        password: loginPassword,
      })
      .then((response) => {
        setTimeout(() => {
          localStorage.setItem("username", loginUsername);
          localStorage.setItem("token", response.data.token);
          navigate("/home");
        }, Math.floor(Math.random() * (1000 - 500 + 1) + 500)); // Adjust the timeout duration as needed
      })
      .catch((error) => {
        setTimeout(() => {
          setLoginMsg("Invalid credentials");
          setMessageType("error");
          setTimeout(() => setLoginMsg(""), 2000);
        }, Math.floor(Math.random() * (1000 - 500 + 1) + 500)); // Adjust the timeout duration as needed
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setRegisterMsg("Registering...");
    setMessageType("success");

    axios
      .post("http://localhost:5000/api/users/register", {
        username: registerUsername,
        password: registerPassword,
      })
      .then((response) => {
        // Show "Registering..." for some time and then show "Registration successful"
        setTimeout(() => {
          localStorage.setItem("username", registerUsername);
          localStorage.setItem("token", response.data.token);

          setRegisterMsg("Registration completed!");
          // After showing "Registration successful", navigate to home
          setTimeout(() => {
            navigate("/home");
          }, Math.floor(Math.random() * (1000 - 500 + 1) + 500)); // Adjust time as needed
        }, Math.floor(Math.random() * (1000 - 500 + 1) + 500)); // Adjust time as needed for "Registering..."
      })
      .catch((error) => {
        // Show error message for some time before clearing it
        setTimeout(() => {
          setRegisterMsg(error.response.data.error || "Registration failed");
          setMessageType("error");
          setTimeout(() => setRegisterMsg(""), 2000); // Clear the message after some time
        }, Math.floor(Math.random() * (1000 - 500 + 1) + 500)); // Adjust time as needed for showing "Registering..."
      });
  };

  return (
    <div className="Login">
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
                <div
                  className={`msg ${
                    messageType === "error" ? "msg-error" : "msg-success"
                  }`}
                >
                  {loginMsg}
                </div>
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
                <div
                  className={`msg ${
                    messageType === "error" ? "msg-error" : "msg-success"
                  }`}
                >
                  {registerMsg}
                </div>
              </td>
            </tr>
          </table>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
