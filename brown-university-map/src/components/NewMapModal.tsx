import React, { useState } from "react";

interface NewMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewMapModal: React.FC<NewMapModalProps> = ({ isOpen, onClose }) => {
  const [mapName, setMapName] = useState("");

  const handleCreateMap = () => {
    if (!mapName.trim()) {
      alert("Map name is required!");
      return;
    }
    // Add logic to save the new map to the database
    console.log("New map created:", mapName);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Map</h2>
        <label>
          Map Name:
          <input
            type="text"
            value={mapName}
            onChange={(e) => setMapName(e.target.value)}
          />
        </label>
        <button onClick={handleCreateMap}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default NewMapModal;