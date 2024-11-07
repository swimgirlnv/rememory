/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// InteractiveMap.tsx

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, Polyline } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig.ts';
import { MarkerData, PathData } from '../data/types';
import TipTapEditor from './TipTapEditor.ts';

const wandIcon = L.icon({
    iconUrl: 'https://images.ctfassets.net/3prze68gbwl1/assetglossary-17su9wok1ui0z7w/c4c4bdcdf0d0f86447d3efc450d1d081/map-marker.png',
    iconSize: [30, 30],
    iconAnchor: [25, 25],
    popupAnchor: [-10, 0]
  });
  
  const InteractiveMap: React.FC = () => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
    const [newMarker, setNewMarker] = useState<Partial<MarkerData> | null>(null);
    const [memory, setMemory] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  
    // Toggle editing mode
    const toggleEditingMode = () => {
      setIsEditingMode((prev) => !prev);
      setNewMarker(null); // Clear any unsaved marker when toggling
      setSelectedMarkers([]); // Clear selected markers for paths
    };
  
    // Add new marker on map click if in editing mode
    const MapClickHandler: React.FC = () => {
      useMapEvents({
        click: (e) => {
          if (isEditingMode) {
            const { lat, lng } = e.latlng;
            setNewMarker({ lat, lng, name: '', memory: '' });
          }
        },
      });
      return null;
    };
  
    const handleSaveMarker = async () => {
      if (newMarker?.lat && newMarker.lng && name && memory) {
        const docRef = await addDoc(collection(db, 'markers'), { ...newMarker, name, memory });
        setMarkers((prev) => [...prev, { id: docRef.id, ...newMarker, name, memory } as MarkerData]);
        setNewMarker(null);
      }
    };
  
    const handleDeleteMarker = async (id: string) => {
      await deleteDoc(doc(db, 'markers', id));
      setMarkers((prev) => prev.filter(marker => marker.id !== id));
    };
  
    const handleSelectMarker = (id: string) => {
      if (isEditingMode) {
        setSelectedMarkers((prev) => (prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]));
      }
    };
  
    const handleCreatePath = async () => {
      if (selectedMarkers.length > 1) {
        const pathData: PathData = { markers: selectedMarkers, name, memory };
        await addDoc(collection(db, 'paths'), pathData);
        setSelectedMarkers([]);
      }
    };
  
    return (
      <>
        <button onClick={toggleEditingMode}>
          {isEditingMode ? "Disable Editing Mode" : "Enable Editing Mode"}
        </button>
  
        <MapContainer center={[41.8268, -71.4025]} zoom={15} style={{ height: '100vh', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
          {/* Add existing markers */}
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={[marker.lat, marker.lng] as LatLngExpression}
              icon={wandIcon}
              eventHandlers={{
                click: () => {
                  if (isEditingMode) {
                    handleSelectMarker(marker.id as string);
                  } else {
                    // Open popup in viewing mode
                    // eslint-disable-next-line no-self-assign
                    marker.name = marker.name;
                  }
                }
              }}
            >
              <Popup maxWidth={500}>
                <h3>{marker.name}</h3>
                {isEditingMode ? (
                  <TipTapEditor content={marker.memory} setContent={setMemory} />
                ) : (
                  <p>{marker.memory}</p>
                )}
                {isEditingMode && (
                  <button onClick={() => handleDeleteMarker(marker.id as string)}>Delete</button>
                )}
              </Popup>
            </Marker>
          ))}
  
          {/* Render new marker with form if user clicks on the map in editing mode */}
          {newMarker && isEditingMode && (
            <Marker position={[newMarker.lat!, newMarker.lng!] as LatLngExpression} icon={wandIcon}>
              <Popup maxWidth={500}>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TipTapEditor content={memory} setContent={setMemory} />
                <button onClick={handleSaveMarker}>Save</button>
                <button onClick={() => setNewMarker(null)}>Cancel</button>
              </Popup>
            </Marker>
          )}
  
          {/* Draw a polyline if multiple markers are selected */}
          {selectedMarkers.length > 1 && (
            <Polyline
              positions={selectedMarkers.map(id => {
                const marker = markers.find(m => m.id === id);
                return [marker?.lat, marker?.lng] as LatLngExpression;
              })}
              color="blue"
            />
          )}
  
          <button onClick={handleCreatePath} disabled={selectedMarkers.length < 2}>
            Create Path with Selected Markers
          </button>
  
          {/* Add click handler to the map */}
          <MapClickHandler />
        </MapContainer>
      </>
    );
  };
  
  export default InteractiveMap;