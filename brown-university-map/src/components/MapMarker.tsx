

import L from 'leaflet';
import React from 'react';
import { Marker, Popup } from 'react-leaflet';

interface MapMarkerProps {
  isEditMode: boolean;
  marker: { id: string; lat: number; lng: number; name: string; memory: string; year: Date; classYear: string };
  onEdit: (markerId: string) => void;
  filterYear: Date | null;
  filterClassYear: string | null;
  handleSelectMarkerForPath?: (markerId: string) => void; // Make it optional
}

// Define a custom icon if desired
const customIcon = new L.Icon({
  iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
  shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
  iconSize: [20, 50],
  iconAnchor: [10, 40],
  popupAnchor: [-3, -76],
  shadowSize: [25, 50],
  shadowAnchor: [0, 40]
});

// Update MapMarker to use handleSelectMarkerForPath if provided
const MapMarker: React.FC<MapMarkerProps> = ({ isEditMode, marker, onEdit, filterYear, filterClassYear, handleSelectMarkerForPath }) => {
  const handleMarkerClick = () => {
      if (isEditMode) {
          onEdit(marker.id);
      } else if (handleSelectMarkerForPath) {
          handleSelectMarkerForPath(marker.id.toString());
      }
  };

  // Filter markers based on Year and ClassYear
  const isVisible =
      (!filterYear || marker.year === filterYear) &&
      (!filterClassYear || marker.classYear === filterClassYear);

  return isVisible ? (
    <Marker position={[marker.lat, marker.lng]} icon={customIcon} eventHandlers={{ click: handleMarkerClick }}>
      <Popup>
          <strong>{marker.name}</strong>
          <p>{marker.memory}</p>
      </Popup>
    </Marker>
  ) : null;
};

export default MapMarker;

// import React from 'react';
// import { Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// // import TipTapEditor from './TipTapEditor';

// interface MapMarkerProps {
//   position: [number, number];
//   name: string;
//   memory: string;
//   year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
//   color: string;
//   isEditingMode: boolean;
//   isSelected: boolean;
//   onClick: () => void;
//   onReadMore: () => void;
//   onDelete: () => void;
//   onEdit: () => void;
//   media?: {
//     images?: string[];
//     videoUrl?: string;
//     audioUrl?: string;
//   };
// }

// const wandIcon = L.icon({
//   iconUrl: 'https://images.ctfassets.net/3prze68gbwl1/assetglossary-17su9wok1ui0z7w/c4c4bdcdf0d0f86447d3efc450d1d081/map-marker.png',
//   iconSize: [30, 30],
//   iconAnchor: [15, 30],
//   popupAnchor: [0, -30],
// });

// const MapMarker: React.FC<MapMarkerProps> = ({
//   position,
//   name,
//   memory,
//   year,
//   isEditingMode,
//   isSelected,
//   onClick,
//   onReadMore,
//   onDelete,
//   onEdit,
//   media,
// }) => (
//   <Marker
//     position={position}
//     icon={wandIcon}
//     eventHandlers={{
//       click: () => {
//         if (isEditingMode) {
//           onClick(); // Selecting marker for path creation
//         } else {
//           onReadMore(); // Open "Read More" modal
//         }
//       },
//     }}
//     opacity={isSelected ? 0.7 : 1} // Adjust opacity to indicate selection
//   >
//     <Popup>
//       <h3>{name} ({year})</h3>
//       <p>{memory.length > 100 ? `${memory.slice(0, 100)}...` : memory}</p>

//       {/* Display media if available */}
//       {media?.audioUrl && <audio src={media.audioUrl} controls />}
//       {media?.videoUrl && <video src={media.videoUrl} controls />}

//       {/* Conditionally render edit/delete buttons in editing mode */}
//       {isEditingMode ? (
//         <>
//           {/* <TipTapEditor content={memory} setContent={() => {}} onUpdate={() => {}} /> */}
//           <button onClick={onEdit}>Edit</button>
//           <button onClick={onDelete}>Delete</button>
//         </>
//       ) : (
//         memory.length > 100 && <button onClick={onReadMore}>Read More</button>
//       )}
//     </Popup>
//   </Marker>
// );

// export default MapMarker;