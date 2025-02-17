import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (error) {
      console.error("Error signing in:", error);
      alert("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="landing-page">
      <h1 className="title">Brown University Re-Memory</h1>
      <p className="subtitle">Capture, explore, and share your university memories.</p>
      <button onClick={handleGoogleSignIn} className="sign-in-button">
        Sign In with Google
      </button>
    </div>
  );
};

export default LandingPage;