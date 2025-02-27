import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../firebaseConfig";
import "../styles/FriendsPage.css";

interface Friend {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

const FriendsPage: React.FC = () => {
  const [, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeFriends = onSnapshot(
      collection(db, `users/${currentUser.uid}/friends`),
      (snapshot) => {
        setFriends(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Friend)));
      }
    );

    const unsubscribeRequests = onSnapshot(
      collection(db, `users/${currentUser.uid}/pendingRequests`),
      (snapshot) => {
        setPendingRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Friend)));
      }
    );

    return () => {
      unsubscribeFriends();
      unsubscribeRequests();
    };
  }, [currentUser]);

  const handleSendFriendRequest = async () => {
    if (!newFriendEmail || !currentUser || !currentUser.uid) {
      alert("You must be signed in to send a friend request.");
      return;
    }
  
    try {
      console.log("Searching for user with email:", newFriendEmail);
  
      // 🔹 Query Firestore to find the user by email
      const usersCollection = collection(db, "users");
      const userQuery = query(usersCollection, where("email", "==", newFriendEmail));
      const userSnapshot = await getDocs(userQuery);
  
      if (userSnapshot.empty) {
        alert("User not found!");
        return;
      }
  
      const newFriendDoc = userSnapshot.docs[0];
      const newFriend = newFriendDoc.data();
      const newFriendId = newFriendDoc.id;
  
      if (!newFriendId) {
        console.error("Friend user ID is undefined.");
        alert("Error: Could not find user.");
        return;
      }
  
      console.log("Found user:", newFriend);
  
      // 🔹 Check if request already exists
      const pendingRef = doc(db, `pendingRequests/${currentUser.uid}_${newFriendId}`);
      const pendingDoc = await getDoc(pendingRef);
      if (pendingDoc.exists()) {
        alert("Friend request already sent.");
        return;
      }
  
      // ✅ Send the friend request
      await setDoc(pendingRef, {
        senderId: currentUser.uid,
        recipientId: newFriendId,
        senderName: currentUser.displayName || "Unknown",
        senderEmail: currentUser.email || "",
        senderProfilePicture: currentUser.photoURL || "",
        status: "pending",
      });
  
      alert("Friend request sent!");
      setNewFriendEmail("");
    } catch (error) {
      console.error("🔥 Error sending friend request:", error);
      alert("Failed to send friend request. Check Firestore permissions.");
    }
  };

  const handleAcceptFriendRequest = async (friend: Friend) => {
    if (!currentUser) return;

    try {
      // Move the request to the friends list
      const friendRef = doc(db, `users/${currentUser.uid}/friends/${friend.id}`);
      await setDoc(friendRef, friend);

      // Add yourself to the friend's friends list
      const currentUserRef = doc(db, `users/${friend.id}/friends/${currentUser.uid}`);
      await setDoc(currentUserRef, {
        id: currentUser.uid,
        name: currentUser.displayName || "Unknown",
        email: currentUser.email || "",
        profilePicture: currentUser.photoURL || "",
      });

      // Remove request from pendingRequests
      await deleteDoc(doc(db, `users/${currentUser.uid}/pendingRequests/${friend.id}`));

      alert("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      alert("Error accepting request.");
    }
  };

  // const handleRemoveFriend = async (friendId: string) => {
  //   if (!currentUser) return;

  //   try {
  //     await deleteDoc(doc(db, `users/${currentUser.uid}/friends/${friendId}`));
  //     await deleteDoc(doc(db, `users/${friendId}/friends/${currentUser.uid}`));
  //     alert("Friend removed.");
  //   } catch (error) {
  //     console.error("Error removing friend:", error);
  //   }
  // };

  return (
    <div className="friends-page">
      <h1 className="title">My Friends</h1>

      {/* Pending Friend Requests */}
      {pendingRequests.length > 0 && (
        <div className="pending-requests">
          <h2>Pending Requests</h2>
          {pendingRequests.map((friend) => (
            <div key={friend.id} className="friend-card">
              <img src={friend.profilePicture || "/default-avatar.png"} alt={friend.name} className="friend-avatar" />
              <div className="friend-info">
                <h3>{friend.name}</h3>
                <p>{friend.email}</p>
                <button onClick={() => handleAcceptFriendRequest(friend)} className="accept-friend-button">
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Friend */}
      <div className="add-friend-section">
        <input type="email" placeholder="Enter friend's email" value={newFriendEmail} onChange={(e) => setNewFriendEmail(e.target.value)} />
        <button onClick={handleSendFriendRequest} className="add-friend-button">
          Send Friend Request
        </button>
      </div>
    </div>
  );
};

export default FriendsPage;