// In MapContainer.tsx
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

interface MapComponentProps {
    mapCenter: [number, number];
    mapZoom: number;
    isEditMode: boolean;
    children?: React.ReactNode; // Allow children to be passed in
}

const MapComponent: React.FC<MapComponentProps> = ({ mapCenter, mapZoom, isEditMode, children }) => {
    return (
        <div className="map-container">
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '60vh', width: '80vw' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {children}
            </MapContainer>
        </div>
    );
};


export default MapComponent;