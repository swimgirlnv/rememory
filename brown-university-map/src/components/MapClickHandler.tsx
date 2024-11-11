/* eslint-disable @typescript-eslint/no-explicit-any */
// MapClickHandler.tsx

import React from 'react';
// import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  isEditMode: boolean;
  setNewMarker: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ isEditMode, setNewMarker }) => {

    const handleMapClick = (event: any) => {
        if (!isEditMode) return;

        // Get latitude and longitude from the event
        const { latLng } = event;
        const lat = latLng.lat();
        const lng = latLng.lng();

        // Trigger the add marker function passed as a prop
        setNewMarker(lat, lng);
    };

    return (
        <div className="map-click-handler" onClick={handleMapClick}>
            {/* This div captures map clicks */}
        </div>
    );
//   useMapEvents({
//     click: (e) => {
//       if (isEditMode) {
//         setNewMarker(e.latlng.lat, e.latlng.lng);
//       }
//     },
//   });
//   return null;
};

export default MapClickHandler;