import React, { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeFriends = onSnapshot(collection(db, `users/${currentUser.uid}/friends`), (snapshot) => {
      setFriends(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Friend)));
    });

    const unsubscribeRequests = onSnapshot(collection(db, `users/${currentUser.uid}/pendingRequests`), (snapshot) => {
      setPendingRequests(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Friend)));
    });

    return () => {
      unsubscribeFriends();
      unsubscribeRequests();
    };
  }, [currentUser]);

  const handleSendFriendRequest = async () => {
    if (!newFriendEmail || !currentUser) return;

    try {
      // Find the user by email
      const usersCollection = collection(db, "users");
      const snapshot = await getDoc(doc(usersCollection, newFriendEmail));
      if (!snapshot.exists()) {
        alert("User not found!");
        return;
      }
      const newFriend = snapshot.data();

      // Add request to the recipient's pendingRequests
      const recipientRef = doc(db, `users/${newFriend.uid}/pendingRequests`, currentUser.uid);
      await setDoc(recipientRef, {
        id: currentUser.uid,
        name: currentUser.displayName || "Unknown",
        email: currentUser.email || "",
        profilePicture: currentUser.photoURL || "",
      });

      alert("Friend request sent!");
      setNewFriendEmail("");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const handleAcceptFriendRequest = async (friend: Friend) => {
    if (!currentUser) return;

    try {
      // Move the request to the friends list
      const friendRef = doc(db, `users/${currentUser.uid}/friends`, friend.id);
      await setDoc(friendRef, friend);

      // Add yourself to the friend's friends list
      const currentUserRef = doc(db, `users/${friend.id}/friends`, currentUser.uid);
      await setDoc(currentUserRef, {
        id: currentUser.uid,
        name: currentUser.displayName || "Unknown",
        email: currentUser.email || "",
        profilePicture: currentUser.photoURL || "",
      });

      // Remove request from pendingRequests
      await updateDoc(doc(db, `users/${currentUser.uid}/pendingRequests`, friend.id), {});

      alert("Friend request accepted!");
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, `users/${currentUser.uid}/friends`, friendId), {});
      alert("Friend removed.");
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

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
                <button onClick={() => handleAcceptFriendRequest(friend)} className="accept-friend-button">Accept</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Friend List */}
      <div className="friend-list">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <img src={friend.profilePicture || "/default-avatar.png"} alt={friend.name} className="friend-avatar" />
              <div className="friend-info">
                <h3>{friend.name}</h3>
                <p>{friend.email}</p>
                <button onClick={() => handleRemoveFriend(friend.id)} className="remove-friend-button">Remove</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-friends-message">You have no friends yet. Add some friends!</p>
        )}
      </div>

      {/* Add Friend */}
      <div className="add-friend-section">
        <input
          type="email"
          placeholder="Enter friend's email"
          value={newFriendEmail}
          onChange={(e) => setNewFriendEmail(e.target.value)}
        />
        <button onClick={handleSendFriendRequest} className="add-friend-button">Send Friend Request</button>
      </div>
    </div>
  );
};

export default FriendsPage;