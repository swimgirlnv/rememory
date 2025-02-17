import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebaseConfig";
import "../styles/ProfilePage.css";

const ProfilePage: React.FC = () => {
  const auth = getAuth();
  const storage = getStorage();
  const currentUser = auth.currentUser;

  const [userName, setUserName] = useState(currentUser?.displayName || "");
  const [profilePicture, setProfilePicture] = useState(currentUser?.photoURL || "/default-avatar.png");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch user data from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name || currentUser.displayName || "");
          setProfilePicture(userData.profilePicture || currentUser.photoURL || "/default-avatar.png");
          setStartYear(userData.startYear || "");
          setEndYear(userData.endYear || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Handle Profile Update
  const handleUpdateProfile = async () => {
    try {
      if (currentUser) {
        // Update Firebase Auth Profile
        await updateProfile(currentUser, {
          displayName: userName,
          photoURL: profilePicture,
        });

        // Update Firestore User Document
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(
          userRef,
          {
            name: userName,
            profilePicture,
            startYear,
            endYear,
          },
          { merge: true }
        );

        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle Profile Picture Upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !currentUser) return;
    setUploading(true);

    const file = event.target.files[0];
    const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);

    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setProfilePicture(downloadURL);
      setUploading(false);
      alert("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="title">My Profile</h1>
      <div className="profile-section">
        <div className="profile-picture-container">
          <img src={profilePicture} alt="Profile" className="profile-picture" />
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          {uploading && <p>Uploading...</p>}
        </div>
        <label>
          Name:
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </label>
        <label>
          Start Year:
          <input type="number" value={startYear} onChange={(e) => setStartYear(e.target.value)} placeholder="e.g., 2021" />
        </label>
        <label>
          End Year:
          <input type="number" value={endYear} onChange={(e) => setEndYear(e.target.value)} placeholder="e.g., 2025" />
        </label>
        <button onClick={handleUpdateProfile} className="update-button">Update Profile</button>
      </div>
    </div>
  );
};

export default ProfilePage;