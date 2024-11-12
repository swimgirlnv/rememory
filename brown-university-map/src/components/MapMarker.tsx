import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface BuildingMarkerProps {
  position: [number, number];
  name: string;
  memory: string;
  year: Date;
  classYear: '' | 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  color: string;
  isEditingMode: boolean;
  isSelected: boolean;
  onClick: () => void;
  onReadMore: () => void;
  onDelete: () => void;
  onEdit: () => void;
  media?: {
    images?: string[];
    videoUrl?: string;
    audioUrl?: string;
  };
}

const wandIcon = L.icon({
  iconUrl: 'https://images.ctfassets.net/3prze68gbwl1/assetglossary-17su9wok1ui0z7w/c4c4bdcdf0d0f86447d3efc450d1d081/map-marker.png',
  iconSize: [30, 30],
  iconAnchor: [25, 25],
  popupAnchor: [-10, 0],
});

const MapMarker: React.FC<BuildingMarkerProps> = ({
  position,
  name,
  memory,
  year,
  classYear,
  isEditingMode,
  isSelected,
  onClick,
  onReadMore,
  onDelete,
  onEdit,
  media,
}) => (
  <Marker
    position={position}
    icon={wandIcon}
    eventHandlers={{
      click: () => {
        if (isEditingMode) {
          onClick();
        } else {
          onReadMore();
        }
      },
    }}
    opacity={isSelected ? 0.7 : 1} // Adjust opacity or add a custom style to show selection
  >
    <Popup>
      <h3>{name}</h3>
      <p>{memory.length > 100 ? `${memory.slice(0, 100)}...` : memory}</p>

      {/* Conditionally render edit/delete buttons in editing mode */}
      {isEditingMode ? (
        <>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </>
      ) : (
        memory.length > 100 && <button onClick={onReadMore}>Read More</button>
      )}

      {/* Display media if available */}
      {media?.audioUrl && <audio src={media.audioUrl} controls />}
      {media?.videoUrl && <video src={media.videoUrl} controls />}
    </Popup>
  </Marker>
);

export default MapMarker;