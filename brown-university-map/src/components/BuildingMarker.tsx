import React from 'react';
import { Marker, Popup } from 'react-leaflet';

interface BuildingMarkerProps {
  position: [number, number];
  name: string;
  memory: string;
  color: string;
  media?: {
    images?: string[];
    videoUrl?: string;
    audioUrl?: string;
  };
  onClick: () => void;
  onReadMore: () => void;
}

const BuildingMarker: React.FC<BuildingMarkerProps> = ({ position, name, memory, onClick, onReadMore }) => (
  <Marker position={position} eventHandlers={{ click: onClick }}>
    <Popup>
      <h3>{name}</h3>
      <p>{memory.length > 100 ? `${memory.slice(0, 100)}...` : memory}</p>
      {memory.length > 100 && (
        <button onClick={onReadMore}>Read More</button>
      )}
    </Popup>
  </Marker>
);

export default BuildingMarker;