/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { UserData } from "../data/types";

export type AuthContextType = {
  currentUser: UserData | null;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin users list (for manual admin control)
  const adminUsers = [
    { uid: "owM9kxvXLLadr4lR0KkgifJRJda2", email: "j.r.locke20@gmail.com" },
  ];

  const checkIfAdmin = (user: UserData | null) => {
    if (!user) return false;
    return adminUsers.some(
      (admin) =>
        admin.uid === user.uid && admin.email.toLowerCase() === user.email.toLowerCase()
    );
  };

  // Save or update user data in Firestore
  const saveUserToFirestore = async (user: User) => {
    try {
      if (!user.email) {
        console.error("User email is missing, cannot save to Firestore.");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      const userData: UserData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split("@")[0], // Default to email prefix if no name
        photoURL: user.photoURL || "/default-avatar.png",
        isAdmin: checkIfAdmin({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split("@")[0],
          photoURL: user.photoURL || "/default-avatar.png",
          isAdmin: false,
          friends: [],
          myMaps: [],
          invitedMaps: [],
        }),
        friends: [],
        myMaps: [],
        invitedMaps: [],
      };

      if (!userDoc.exists()) {
        await setDoc(userDocRef, userData);
        console.log("New user saved to Firestore:", userData);
      } else {
        console.log("User already exists in Firestore:", userDoc.data());
      }

      setCurrentUser(userData);
      setIsAdmin(userData.isAdmin);
    } catch (error: any) {
      console.error("Error saving user to Firestore:", error.message);
    }
  };

  // Google login
  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await saveUserToFirestore(result.user); // Save user data to Firestore
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await saveUserToFirestore(user);
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = { currentUser, isAdmin, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};