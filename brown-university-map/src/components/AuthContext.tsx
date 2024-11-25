/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export type AuthContextType = {
  currentUser: { uid: string; email: string } | null;
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
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const adminUsers = [
    { uid: "user-unique-id", email: "beccaqwaterson@gmail.com" },
    { uid: "owM9kxvXLLadr4lR0KkgifJRJda2", email: "j.r.locke20@gmail.com" },
  ];

  const checkIfAdmin = (user: { uid: string; email: string } | null) => {
    if (!user) return false;
    return adminUsers.some(
      (admin) => admin.uid === user.uid && admin.email.toLowerCase() === user.email.toLowerCase()
    );
  };

  // Save or update user data in Firestore
  const saveUserToFirestore = async (user: { uid: string; email: string }) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Save new user data
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          createdAt: new Date().toISOString(),
          isAdmin: checkIfAdmin(user), // Include admin status
        });
        console.log("New user saved to Firestore:", user);
      } else {
        // Update existing user data if necessary
        console.log("User already exists in Firestore:", userDoc.data());
      }
    } catch (error: any) {
      console.error("Error saving user to Firestore:", error.message);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const userData = { uid: user.uid, email: user.email || "" };
        setCurrentUser(userData);
        setIsAdmin(checkIfAdmin(userData)); // Check admin status
        await saveUserToFirestore(userData); // Save user data to Firestore
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = { uid: user.uid, email: user.email || "" };
        setCurrentUser(userData);
        setIsAdmin(checkIfAdmin(userData)); // Update admin status
        saveUserToFirestore(userData); // Save or update user data on auth state change
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