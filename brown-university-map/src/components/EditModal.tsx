import React from 'react';

interface EditModalProps {
  title: string;
  name: string;
  memory: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (newName: string) => void;
  onMemoryChange: (newMemory: string) => void;
  onYearChange: (newYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior') => void;
}

const EditModal: React.FC<EditModalProps> = ({
  title,
  name,
  memory,
  year,
  onSave,
  onCancel,
  onNameChange,
  onMemoryChange,
  onYearChange,
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      >
        <h2>{title}</h2>
        <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </label>
        <label style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          Memory:
          <textarea
            value={memory}
            onChange={(e) => onMemoryChange(e.target.value)}
          />
        </label>
        <label style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          Year:
          <select
            value={year}
            onChange={(e) => onYearChange(e.target.value as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior')}
          >
            <option value="Freshman">Freshman</option>
            <option value="Sophomore">Sophomore</option>
            <option value="Junior">Junior</option>
            <option value="Senior">Senior</option>
          </select>
        </label>
        <button onClick={onSave}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default EditModal;