// PathCreationModal.tsx
import React, { useState } from 'react';
import '../styles/PathCreationModal.css';

interface PathCreationModalProps {
  onSave: (name: string, memory: string, year: string) => void;
  onClose: () => void;
}

const PathCreationModal: React.FC<PathCreationModalProps> = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [memory, setMemory] = useState('');
  const [year, setYear] = useState('Freshman');

  const handleSave = () => {
    if (name && memory) {
      onSave(name, memory, year);
      onClose();
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Path</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Memory:
          <textarea value={memory} onChange={(e) => setMemory(e.target.value)} />
        </label>
        <label>
          Year:
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PathCreationModal;