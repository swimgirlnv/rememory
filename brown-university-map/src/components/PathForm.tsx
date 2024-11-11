import React, { useState } from 'react';
import { PathData } from '../data/types';

interface PathFormProps {
    selectedMarkers: string[];
    onSavePath: (name: string, memory: string, year: Date, classYear: PathData["classYear"]) => Promise<void>;
}

const PathForm: React.FC<PathFormProps> = ({ selectedMarkers, onSavePath }) => {
    const [name, setName] = useState('');
    const [memory, setMemory] = useState('');
    const [year, setYear] = useState('');
    const [classYear, setClassYear] = useState<"" | "Freshman" | "Sophomore" | "Junior" | "Senior">('');
    const [media, setMedia] = useState<File | null>(null);

    const handleSavePath = () => {
        // Save path data including the selected markers
        console.log({
            name,
            memory,
            year,
            classYear,
            media,
            markers: selectedMarkers,
        });
        onSavePath(name, memory, new Date(year), classYear); // Reset selected markers after saving
    };

    return (
        <div className="path-form">
            <h2>Create New Path</h2>
            <input
                type="text"
                placeholder="Path Name"
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
            <select value={classYear} onChange={(e) => setClassYear(e.target.value as "" | "Freshman" | "Sophomore" | "Junior" | "Senior")}>
                <option value="">Select Class Year</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
            </select>
            <input type="file" onChange={(e) => setMedia(e.target.files ? e.target.files[0] : null)} />
            <button onClick={handleSavePath}>Save Path</button>
        </div>
    );
};

export default PathForm;