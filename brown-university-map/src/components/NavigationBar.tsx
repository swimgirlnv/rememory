import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../styles/NavigationBar.css";

const NavigationBar: React.FC<{ onAboutOpen: () => void }> = () => {
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, isAdmin, login, logout } = useAuth();

  const parseFirstNameFromEmail = (email: string) => {
    if (!email) return "User";
    const firstPart = email.split("@")[0];
    const nameParts = firstPart.split(/[._]/);
    return nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" ");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <img src="https://i.imgur.com/wjbC06J.png" alt="Brown University Logo" />
        <Link to="/home">Re-Memory</Link>
      </div>

      <div className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/globalmap">Global Map</Link>
        <Link to="/maps">My Maps</Link>
        <Link to="/friends">Friends</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/about">About</Link>
      </div>

      <div className="user-info">
        <div className="user-details">
          {currentUser ? (
            <>
              <p className="welcome-message">Hello, {isAdmin && <p className="admin-badge">Admin</p>}{parseFirstNameFromEmail(currentUser.email)}</p>
              <button onClick={logout} className="nav-button">Logout</button>
            </>
          ) : (
            <button onClick={login} className="nav-button">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;