import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import 'leaflet-routing-machine';
import { buildings } from '../data/buildings';
import { routes } from '../data/routes';
import BuildingMarker from './BuildingMarker';
import MapRoute from './MapRoute';

interface MapComponentProps {
  selectedYears: string[];
  mapCenter: LatLngExpression;
  mapZoom: number;
  onBuildingClick: (buildingName: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedYears, mapCenter, mapZoom, onBuildingClick }) => {
  // Modal state for displaying detailed content
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string; media?: any } | null>(null);

  const handleReadMore = (title: string, content: string, media?: any) => {
    setModalContent({ title, content, media });
    setShowModal(true);
  };

  // Define colors for each year
  const routeColors: Record<string, string> = {
    Freshman: 'blue',
    Sophomore: 'green',
    Junior: 'orange',
    Senior: 'purple',
  };

  return (
    <>
      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {buildings
          .filter((building) => selectedYears.includes(building.year))
          .map((building, index) => (
            <BuildingMarker
              key={index}
              {...building}
              onClick={() => onBuildingClick(building.name)}
              onReadMore={() => handleReadMore(building.name, building.memory, building.media)}
              color={routeColors[building.year]}
            />
          ))}

        {/* Route Polylines based on selected year */}
        {routes
          .filter((route) => selectedYears.includes(route.year))
          .map((route, index) => (
            <MapRoute key={index} route={route} color={routeColors[route.year]} />
          ))}
      </MapContainer>

      {showModal && modalContent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{modalContent.title}</h2>
            <p>{modalContent.content}</p>
            {modalContent.media?.images &&
              modalContent.media.images.map((src: string, i: number) => <img key={i} src={src} alt="" />)}
            {modalContent.media?.videoUrl && (
              <video controls>
                <source src={modalContent.media.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {modalContent.media?.audioUrl && (
              <audio controls>
                <source src={modalContent.media.audioUrl} type="audio/mp3" />
                Your browser does not support the audio element.
              </audio>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MapComponent;