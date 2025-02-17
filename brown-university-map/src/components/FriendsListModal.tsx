import React, { useState } from "react";
import "../styles/FriendsListModal.css";

interface FriendsListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FriendsListModal: React.FC<FriendsListModalProps> = ({ isOpen, onClose }) => {
  const [friends, setFriends] = useState<string[]>(["Alice", "Bob", "Charlie"]);

  const handleAddFriend = () => {
    const newFriend = prompt("Enter the name of the friend to add:");
    if (newFriend) {
      setFriends((prev) => [...prev, newFriend]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Friends List</h2>
        <ul>
          {friends.map((friend, index) => (
            <li key={index}>{friend}</li>
          ))}
        </ul>
        <button onClick={handleAddFriend}>Add Friend</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default FriendsListModal;