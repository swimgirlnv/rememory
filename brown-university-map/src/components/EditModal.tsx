import React, { useState } from 'react';
import TipTapEditor from './TipTapEditor';

const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: { name: string; memory: string }) => void;
  data: { id: string; name: string; memory: string } | null;
}> = ({ isOpen, onClose, onSave, data }) => {
  const [name, setName] = useState(data?.name || '');
  const [memory, setMemory] = useState(data?.memory || '');

  const handleSave = () => {
    onSave({ name, memory });
  };

  if (!isOpen || !data) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit {data.name}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <TipTapEditor initialContent={memory} onUpdate={setMemory} />
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditModal;
// // src/components/EditModal.tsx
// import React, { useEffect } from 'react';
// import TipTapEditor from './TipTapEditor';
// import { MarkerData } from '../data/types';

// interface EditModalProps {
//   title: string;
//   name: string;
//   memory: string;
//   classYear: '' | 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
//   year: Date;
//   onSave: (updatedMarker: MarkerData) => Promise<void>;
//   onCancel: () => void;
//   onNameChange: (newName: string) => void;
//   onMemoryChange: (newMemory: string) => void;
//   onYearChange: (newYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior') => void;
// }

// const EditModal: React.FC<EditModalProps> = ({
//   title,
//   name,
//   memory,
//   year,
//   classYear,
//   onSave,
//   onCancel,
//   onNameChange,
//   onMemoryChange,
//   onYearChange,
// }) => {
//   useEffect(() => {
//     onMemoryChange(memory); // Set initial memory value on load
//   }, [memory, onMemoryChange]);

//   return (
//     <div className="modal-overlay" onClick={onCancel}>
//       <div
//         className="modal-content"
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           justifyContent: 'center',
//           alignItems: 'center',
//           maxWidth: '600px',
//           maxHeight: '80vh',
//           overflow: 'auto',
//         }}
//       >
//         <h2>{title}</h2>

//         <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflowY: 'auto', padding: '10px' }}>
//           <label style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             Name:
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => onNameChange(e.target.value)}
//               style={{ marginLeft: '10px', width: '100%' }}
//             />
//           </label>

//           <label style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
//             Memory:
//             <div style={{ width: '100%' }}>
//               <TipTapEditor
//                 onUpdate={onMemoryChange}
//                 initialContent={memory} // Set initial content here
//               />
//             </div>
//           </label>

//           <label style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
//             Year:
//             <select
//               value={classYear}
//               onChange={(e) => onYearChange(e.target.value as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior')}
//               style={{ marginLeft: '10px' }}
//             >
//               <option value="Freshman">Freshman</option>
//               <option value="Sophomore">Sophomore</option>
//               <option value="Junior">Junior</option>
//               <option value="Senior">Senior</option>
//             </select>
//           </label>
//         </div>

//         <button onClick={() => onSave({
//             id: '', name, memory, year: new Date(year),
//             lat: 0,
//             lng: 0,
//             classYear: ''
//         })}>Save</button>
//         <button onClick={onCancel}>Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default EditModal;