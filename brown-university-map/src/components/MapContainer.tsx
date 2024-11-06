import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { buildings } from '../data/buildings';
import BuildingMarker from './BuildingMarker';

const MapComponent: React.FC = () => {
    const center: LatLngExpression = [41.8268, -71.4025]; // Explicitly typed as LatLngExpression
  
    return (
      <MapContainer center={center} zoom={15} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {buildings.map((building, index) => (
          <BuildingMarker key={index} {...building} />
        ))}
      </MapContainer>
    );
  };
  
  export default MapComponent;