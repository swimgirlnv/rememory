import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { addDoc, collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { MarkerData, PathData } from '../data/types';
import L from 'leaflet';
import TipTapEditor from './TipTapEditor';
import { v4 as uuidv4 } from 'uuid';
import MapClickHandler from './MapClickHandler';


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
  const [year, setYear] = useState<Date>(new Date());
  const [classYear, setClassYear] = useState<string>('');
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);

  // Fetch markers from Firestore in real-time
  useEffect(() => {
    const unsubscribeMarkers = onSnapshot(collection(db, 'markers'), (snapshot) => {
      const markerData: MarkerData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as MarkerData[];
      setMarkers(markerData);
    });

    return () => unsubscribeMarkers();
  }, []);

  // Toggle editing mode
  const toggleEditingMode = () => {
    setIsEditingMode((prev) => !prev);
    setNewMarker(null); // Clear any unsaved marker when toggling
    setSelectedMarkers([]); // Clear selected markers for paths
  };

  const MapClickHandler: React.FC = () => {
    useMapEvents({
      click: (e) => {
        if (isEditingMode) {
          const { lat, lng } = e.latlng;
          setNewMarker({ lat, lng, name: '', memory: '', year: new Date(), classYear: '', id: '' });
        }
      },
    });
    return null;
  };


  // Save the new marker to Firestore and update state
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
      const pathData: PathData = {
        id: uuidv4(), // Generate a unique ID for the path
        markers: selectedMarkers,
        name,
        memory,
        year: new Date(), // Default to the current date
        classYear: '', // Set default value or allow user to select
      };
      
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

        {/* Existing markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng] as LatLngExpression}
            icon={wandIcon}
            eventHandlers={{
              click: () => {
                if (isEditingMode) {
                  handleSelectMarker(marker.id);
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
                <button onClick={() => handleDeleteMarker(marker.id)}>Delete</button>
              )}
            </Popup>
          </Marker>
        ))}

        {/* Render new marker with form */}
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

        {/* Draw polyline for selected markers */}
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

        {/* Add click handler */}
        <MapClickHandler />
      </MapContainer>
    </>
  );
};

export default InteractiveMap;