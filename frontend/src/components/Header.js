import React from "react";
import "./css/Header.css";
import { useAuth } from "../context/AuthContext"; 
import axios from "axios";
import { Link, useNavigate, Outlet } from "react-router-dom";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, user, setUser } = useAuth();
  const navigate = useNavigate();

  const handle_logout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/logout`,
        {},
        { withCredentials: true },
      );
      setUser([]);
      setIsLoggedIn(false);
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      <header className="header-container">
        <div className="header-left">
          <Link to="/" className="link">
            <h2 className="Project_name">Project_Insight</h2>
          </Link>
        </div>

        <div className="header-right">
          {isLoggedIn ? (
            <>
            <span className="profile-name">{user?.name || "Loading..."}</span>
              <Link to="/createnewpost" className="button-link">Create New Post</Link>
              <button onClick={handle_logout} className="button-link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="button-link">Login</Link>
              <Link to="/register" className="button-link">Register</Link>
            </>
          )}
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default Header;
