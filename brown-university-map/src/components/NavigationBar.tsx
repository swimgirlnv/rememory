import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { FaMapMarkedAlt, FaUserFriends, FaUser, FaHome, FaInfoCircle, FaMap } from "react-icons/fa";
import "../styles/NavigationBar.css";

const NavigationBar: React.FC<{ onAboutOpen: () => void }> = () => {
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, isAdmin, login, logout } = useAuth();
  const [profileName, setProfileName] = useState("User");
  const [profilePicture, setProfilePicture] = useState("/default-avatar.png");

  // Fetch user's name & profile picture from Firestore if not in `displayName`
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;

      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setProfileName(userData.name || currentUser.displayName || "User");
        setProfilePicture(userData.profilePicture || "/default-avatar.png");
      } else {
        setProfileName(currentUser.displayName || "User");
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
      {/* Logo */}
      <div className="logo">
        <img src="https://i.imgur.com/wjbC06J.png" alt="Brown University Logo" />
        <Link to="/home">Re-Memory</Link>
      </div>

      {/* Navigation Icons with Tooltips */}
      <div className="nav-links">
        <Link to="/home" className="nav-icon" title="Home">
          <FaHome />
        </Link>
        <Link to="/globalmap" className="nav-icon" title="Global Map">
          <FaMapMarkedAlt />
        </Link>
        <Link to="/maps" className="nav-icon" title="My Maps">
          <FaMap />
        </Link>
        <Link to="/friends" className="nav-icon" title="Friends">
          <FaUserFriends />
        </Link>
        <Link to="/profile" className="nav-icon" title="Profile">
          <FaUser />
        </Link>
        <Link to="/about" className="nav-icon" title="About">
          <FaInfoCircle />
        </Link>
      </div>

      {/* User Info & Login/Logout */}
      <div className="user-info">
        {currentUser ? (
          <>
            <div className="profile-section-nav">
              <img src={profilePicture} alt="Profile" className="profile-picture" />
              <p className="welcome-message">
                {isAdmin && <span className="admin-badge">Admin</span>}
                {profileName}
              </p>
            </div>
            <button onClick={logout} className="nav-button">Logout</button>
          </>
        ) : (
          <button onClick={login} className="nav-button">Login</button>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;