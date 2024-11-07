import L from 'leaflet';
import React from 'react';
import ReactMarkdown from 'react-markdown';
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

const wandIcon = L.icon({
    iconUrl: 'https://images.ctfassets.net/3prze68gbwl1/assetglossary-17su9wok1ui0z7w/c4c4bdcdf0d0f86447d3efc450d1d081/map-marker.png',
    iconSize: [30, 30],
    iconAnchor: [25, 25],
    popupAnchor: [-10, 0]
});

const BuildingMarker: React.FC<BuildingMarkerProps> = ({ position, name, memory, onClick, onReadMore }) => (
    <Marker position={position} icon={wandIcon} eventHandlers={{ click: onClick }}>
      <Popup maxWidth={500}>
        <h3>{name}</h3>
        <ReactMarkdown>
          {memory.length > 100 ? `${memory.slice(0, 100)}...` : memory}
        </ReactMarkdown>
        {memory.length > 100 && (
          <button onClick={onReadMore} style={{ marginTop: '10px' }}>Read More</button>
        )}
      </Popup>
    </Marker>
);

export default BuildingMarker;