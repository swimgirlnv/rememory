import React, { useState } from "react";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { sendInvitationEmail } from "../scripts/emailService";

const ShareMapModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  mapId: string;
}> = ({ isOpen, onClose, mapId }) => {
  const [input, setInput] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleShare = async () => {
    if (!input.trim()) {
      setError("Please enter a valid user ID or email.");
      return;
    }

    setIsSharing(true);
    setError(null);

    try {
      if (input.includes("@")) {
        // Sharing via email
        const userQuery = query(collection(db, "users"), where("email", "==", input));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          // User exists, share directly
          const user = userSnapshot.docs[0];
          await updateMapSharing(user.id);
        } else {
          // Send invitation email if the user is not found
          await sendInvitationEmail(input, mapId);
          alert("Invitation sent to email!");
        }
      } else {
        // Sharing via user ID
        await updateMapSharing(input);
      }

      setInput("");
      alert("Map shared successfully!");
    } catch (error) {
      console.error("Error sharing map:", error);
      setError("Failed to share the map. Please try again.");
    } finally {
      setIsSharing(false);
    }
  };

  const updateMapSharing = async (userId: string) => {
    const mapRef = doc(db, "maps", mapId);
    await updateDoc(mapRef, {
      [`sharedWith.${userId}`]: true,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Share Map</h2>
        <input
          type="text"
          placeholder="Enter user ID or email"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button onClick={handleShare} disabled={isSharing}>
          {isSharing ? "Sharing..." : "Share"}
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ShareMapModal;