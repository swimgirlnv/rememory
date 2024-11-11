import React, { useState } from 'react';

interface NewMarkerFormProps {
    lat: number;
    lng: number;
    onClose: () => void;
    onSave: () => void;
}

const NewMarkerForm: React.FC<NewMarkerFormProps> = ({ lat, lng, onClose }) => {
    const [name, setName] = useState('');
    const [memory, setMemory] = useState('');
    const [year, setYear] = useState('');
    const [classYear, setClassYear] = useState('');
    const [media, setMedia] = useState<File | null>(null);

    const handleSave = () => {
        // Save marker data to the database or app state
        console.log({ lat, lng, name, memory, year, classYear, media });
        onClose(); // Close form after saving
    };

    return (
        <div className="new-marker-form">
            <h2>Add New Marker</h2>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea
                placeholder="Memory"
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
            />
            <input
                type="date"
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
            <select value={classYear} onChange={(e) => setClassYear(e.target.value)}>
                <option value="">Select Class Year</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
            </select>
            <input type="file" onChange={(e) => setMedia(e.target.files ? e.target.files[0] : null)} />
            <button onClick={handleSave}>Save Marker</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default NewMarkerForm;