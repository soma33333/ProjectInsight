import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/Login.css"; 
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Login = () => {
  const { setIsLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [newotp, setnewotp] = useState("");
  const [genotp, setgenotp] = useState("");
  const [error, setError] = useState("");
  const [forgot, setForgot] = useState(false); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/login`,
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      setIsLoggedIn(true);
      alert("Your are Logged  In ...");
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed.");
    }
  };

  var otp;
  const handleotp = async () => {
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/get-otp`,
        {
          email,
        },
      );
      setgenotp(response.data);
      setError("OTP has sent");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send reset link.");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setError("");
    if (genotp == newotp) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/setpassword`,
          {
            email,
            newpassword,
          },
        );

        alert("New password is updated.");
        navigate("/login");
        setForgot(false);
        setnewotp(0);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to send reset link.");
      }
    } else {
      setError("wrong otp");
    }
  };

  return (
    <div className="login-container">
      <h2>{forgot ? "Forgot Password" : "Login"}</h2>
      <form onSubmit={forgot ? handleForgot : handleLogin}>
        {forgot ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="number"
              maxLength={6}
              value={newotp}
              onChange={(e) => setnewotp(e.target.value)}
              placeholder="OTP"
            ></input>
            <button onClick={handleotp}>Get OTP</button>
            <input
              type="password"
              placeholder="NewPassword"
              value={newpassword}
              onChange={(e) => setnewpassword(e.target.value)}
              required
            />
            <br></br>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}
        {error && <p className="error">{error}</p>}{" "}
        <button type="submit">{forgot ? "Change password" : "Login"}</button>
        <p>
          Don't have an account?{" "}
          <Link className="link" to="/">
            Sign Up
          </Link>
        </p>
        {!forgot && (
          <p>
            <Link className="link" to="#" onClick={() => setForgot(true)}>
              Forgot password?
            </Link>
          </p>
        )}
        {forgot && (
          <p>
            <Link className="link" to="#" onClick={() => setForgot(false)}>
              Back to Login
            </Link>
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
