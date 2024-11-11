// CreatePathButton.tsx

import React from 'react';
import { MarkerData } from '../data/types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

interface CreatePathButtonProps {
  selectedMarkers: string[];
  markers: MarkerData[];
  onCreate: () => void;
}

const CreatePathButton: React.FC<CreatePathButtonProps> = ({ selectedMarkers, markers, onCreate }) => {
  const handleCreatePath = async () => {
    const pathMarkers = markers.filter(marker => selectedMarkers.includes(marker.id || ''));
    const pathCoordinates = pathMarkers.map(marker => ({
      lat: marker.lat,
      lng: marker.lng,
    }));

    const newPath = {
      name: "New Path",
      memory: "Path memory or details here",
      year: "Freshman",
      coordinates: pathCoordinates,
    };

    await addDoc(collection(db, 'paths'), newPath);
    onCreate();
  };

  return (
    <button onClick={handleCreatePath} disabled={selectedMarkers.length < 2}>
      Create Path with Selected Markers
    </button>
  );
}

export default CreatePathButton;