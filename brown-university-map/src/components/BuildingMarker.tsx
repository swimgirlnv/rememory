import React from 'react';
import { Marker, Popup } from 'react-leaflet';

interface BuildingMarkerProps {
  position: [number, number];
  name: string;
  memory: string;
}

const BuildingMarker: React.FC<BuildingMarkerProps> = ({ position, name, memory }) => (
  <Marker position={position}>
    <Popup>
      <h3>{name}</h3>
      <p>{memory}</p>
    </Popup>
  </Marker>
);

export default BuildingMarker;