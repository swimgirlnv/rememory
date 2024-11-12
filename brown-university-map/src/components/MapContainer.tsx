/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngExpression } from 'leaflet';
import { buildings } from '../data/buildings';
import { routes } from '../data/routes';
import MapMarker from './MapMarker';
import MapRoute from './MapRoute';
import { MarkerData } from '../data/types';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import EditModal from './EditModal';

interface MapComponentProps {
  selectedYears: string[];
  mapCenter: LatLngExpression;
  mapZoom: number;
  onBuildingClick: (buildingName: string) => void;
  isEditingMode: boolean;
  showPathModal: boolean;
  onMakePath: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedYears, mapCenter, mapZoom, onBuildingClick, isEditingMode, showPathModal, onMakePath }) => {
  // Modal state for displaying detailed content
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string; media?: any } | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [newMarker, setNewMarker] = useState<Partial<MarkerData> | null>(null);
  const [memory, setMemory] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [year, setYear] = useState<Date>(new Date());
  const [classYear, setClassYear] = useState<string>('');


  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      map.setView(mapCenter, mapZoom);
    }, [map, mapCenter, mapZoom]);

    return null;
  };

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

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);

  // Handler to open the modal for a specific marker
  const handleEditMarker = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setIsEditModalVisible(true);
  };

  // Close modal and reset selected marker
  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedMarker(null);
  };

  const handleDeleteMarker = async (id: string) => {
    await deleteDoc(doc(db, 'markers', id));
    setMarkers((prev) => prev.filter(marker => marker.id !== id));
  };

  const handleSaveMarker = async () => {
    if (newMarker?.lat && newMarker.lng && name && memory) {
      console.log("Saving new marker:", newMarker);
      const docRef = await addDoc(collection(db, 'markers'), { lat: newMarker.lat, lng: newMarker.lng, name, memory });
      setMarkers((prev) => [...prev, { id: docRef.id, lat: newMarker.lat, lng: newMarker.lng, name, memory } as MarkerData]);
      setNewMarker(null); // Reset new marker state after saving
      setName(''); // Reset name input
      setMemory(''); // Reset memory input
      setYear(new Date()); // Reset year input
      setClassYear(''); // Reset class year input
    } else {
      console.warn("Marker data is incomplete. Cannot save marker.");
    }
  };

  const handleSelectMarker = (id: string) => {
    if (isEditingMode) {
      setSelectedMarkers((prev) => (prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]));
    }
  };

  return (
    <>
      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100vh', width: '100%' }}>
        <MapUpdater />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* MapMarker instances with the onEdit prop */}
        {markers.map(marker => (
          <MapMarker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            name={marker.name}
            memory={marker.memory}
            year={marker.year}
            classYear={marker.classYear}
            isEditingMode={isEditingMode}
            isSelected={selectedMarkers.includes(marker.id)}
            onEdit={() => handleEditMarker(marker)}
            onDelete={() => handleDeleteMarker(marker.id)}
            onReadMore={() => handleReadMore(marker.name, marker.memory)}
            onClick={() => handleSelectMarker(marker.id)}
          />
        ))}

      {/* EditModal appears when isEditModalVisible is true */}
      {isEditModalVisible && selectedMarker && (
        <EditModal
          title="Edit Marker"
          name={selectedMarker.name}
          memory={selectedMarker.memory}
          year={selectedMarker.year}
          classYear={selectedMarker.classYear}
          onSave={async (updatedMarker: any) => {
            await handleSaveMarker(updatedMarker);
            handleCloseEditModal();
          }}
          onCancel={handleCloseEditModal}
          onNameChange={(newName: any) => setSelectedMarker({ ...selectedMarker, name: newName })}
          onMemoryChange={(newMemory: any) => setSelectedMarker({ ...selectedMarker, memory: newMemory })}
          onYearChange={(newYear: any) => setSelectedMarker({ ...selectedMarker, year: newYear })}
        />
      )}

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