/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import BuildingMarker from './BuildingMarker';

interface MapComponentProps {
  selectedYears: string[];
  mapCenter: [number, number];
  mapZoom: number;
  isEditingMode: boolean;
  showPathModal: boolean;
  onMakePath: () => void;
  onBuildingClick: (buildingName: string) => void;
}

interface MarkerData {
  id?: string;
  position: [number, number];
  name: string;
  memory: string;
  media?: { imageUrl?: string; videoUrl?: string; audioUrl?: string };
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
}

interface PathData {
  id: string;
  name: string;
  memory: string;
  year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
  media?: { audioUrl?: string; videoUrl?: string };
  coordinates: { lat: number; lng: number }[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  selectedYears,
  mapCenter,
  mapZoom,
  isEditingMode,
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selectedPath, setSelectedPath] = useState<PathData | null>(null);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newMarkerPosition, setNewMarkerPosition] = useState<[number, number] | null>(null);

  // Fetch markers from Firestore
  useEffect(() => {
    const fetchMarkers = async () => {
      const querySnapshot = await getDocs(collection(db, 'markers'));
      const loadedMarkers: MarkerData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        position: [doc.data().lat, doc.data().lng] as [number, number],
        name: doc.data().name,
        memory: doc.data().memory,
        media: doc.data().media,
        year: doc.data().year,
      }));
      setMarkers(loadedMarkers);
    };
    fetchMarkers();
  }, []);

  // Fetch paths from Firestore
  useEffect(() => {
    const fetchPaths = async () => {
      const querySnapshot = await getDocs(collection(db, 'paths'));
      const loadedPaths: PathData[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          memory: data.memory || '',
          year: data.year || 'Freshman',
          media: data.media || { audioUrl: '', videoUrl: '' },
          coordinates: Array.isArray(data.coordinates)
            ? data.coordinates.map((coord: any) => ({ lat: coord.lat, lng: coord.lng }))
            : [],
        };
      });
      setPaths(loadedPaths);
    };
    fetchPaths();
  }, []);

  const handleMarkerSelect = (marker: MarkerData) => {
    if (isEditingMode) {
      setSelectedMarkers((prevSelected) =>
        prevSelected.includes(marker.id!)
          ? prevSelected.filter((id) => id !== marker.id)
          : [...prevSelected, marker.id!]
      );
    }
  };

  const handleEditMarker = (marker: MarkerData) => {
    setSelectedMarker(marker);
    setShowEditModal(true);
  };

  // Delete a marker
  const handleDeleteMarker = async (markerId: string) => {
    await deleteDoc(doc(db, 'markers', markerId));
    setMarkers((prevMarkers) => prevMarkers.filter((marker) => marker.id !== markerId));
  };

  // Delete a path
  const handleDeletePath = async (pathId: string) => {
    await deleteDoc(doc(db, 'paths', pathId));
    setPaths((prevPaths) => prevPaths.filter((path) => path.id !== pathId));
  };

  // Save edited marker details to Firestore
  const handleSaveMarkerEdit = async () => {
    if (selectedMarker && selectedMarker.id) {
      const markerData: Partial<MarkerData> = {
        name: selectedMarker.name,
        memory: selectedMarker.memory,
        year: selectedMarker.year,
        media: {
          ...(selectedMarker.media?.audioUrl ? { audioUrl: selectedMarker.media.audioUrl } : {}),
          ...(selectedMarker.media?.videoUrl ? { videoUrl: selectedMarker.media.videoUrl } : {}),
          ...(selectedMarker.media?.imageUrl ? { imageUrl: selectedMarker.media.imageUrl } : {}),
        },
      };

      // Update marker in Firestore
      await updateDoc(doc(db, 'markers', selectedMarker.id), markerData);
      
      // Update local state
      setMarkers((prevMarkers) =>
        prevMarkers.map((m) => (m.id === selectedMarker.id ? selectedMarker : m))
      );
      setShowEditModal(false);
    }
  };

  // Function to handle saving a new marker
  const handleSaveNewMarker = async () => {
    if (newMarkerPosition) {
      const newMarker = {
        position: newMarkerPosition,
        name: '',
        memory: '',
        year: 'Freshman',
        media: {},
      };

      const docRef = await addDoc(collection(db, 'markers'), {
        lat: newMarkerPosition[0],
        lng: newMarkerPosition[1],
        name: newMarker.name,
        memory: newMarker.memory,
        year: newMarker.year,
      });

      setMarkers([...markers, { ...newMarker, id: docRef.id, year: newMarker.year as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' }]);
      setNewMarkerPosition(null);
      setShowEditModal(false);
    }
  };

  // Event listener to handle map clicks for creating new markers
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isEditingMode) {
          setNewMarkerPosition([e.latlng.lat, e.latlng.lng]);
          setShowEditModal(true);
        }
      },
    });
    return null;
  };

  return (
    <>
      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Handle map clicks for creating new markers */}
        <MapClickHandler />

        {/* Display markers */}
        {markers
          .filter((marker) => selectedYears.includes(marker.year))
          .map((marker) => (
            <BuildingMarker
                key={marker.id}
                position={marker.position}
                name={marker.name}
                memory={marker.memory}
                year={marker.year}
                color="blue"
                isEditingMode={isEditingMode}
                isSelected={selectedMarkers.includes(marker.id || '')}
                onClick={() => handleMarkerSelect(marker)}
                onReadMore={() => {}}
                onDelete={() => handleDeleteMarker(marker.id || '')}
                onEdit={() => handleEditMarker(marker)}
            />
          ))}

        {/* Display paths */}
        {paths.map((path) => (
          <Polyline
            key={path.id}
            positions={path.coordinates.map(coord => [coord.lat, coord.lng]) as [number, number][]}
            color="purple"
          >
            <Popup>
              <h3>{path.name}</h3>
              <p>{path.memory}</p>
              {isEditingMode ? (
                <>
                  <button onClick={() => { setSelectedPath(path); setShowEditModal(true); }}>Edit</button>
                  <button onClick={() => handleDeletePath(path.id)}>Delete</button>
                </>
              ) : (
                <p>Year: {path.year}</p>
              )}
            </Popup>
          </Polyline>
        ))}
      </MapContainer>

      {/* Modal for editing or adding markers */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{newMarkerPosition ? 'Add New Marker' : 'Edit Marker'}</h2>
            <label>
              Name:
              <input
                type="text"
                value={selectedMarker ? selectedMarker.name : ''}
                onChange={(e) =>
                  selectedMarker
                    ? setSelectedMarker({ ...selectedMarker, name: e.target.value })
                    : setSelectedMarker({ name: e.target.value, memory: '', year: 'Freshman', position: newMarkerPosition! })
                }
              />
            </label>
            <label>
              Memory:
              <textarea
                value={selectedMarker ? selectedMarker.memory : ''}
                onChange={(e) =>
                  selectedMarker
                    ? setSelectedMarker({ ...selectedMarker, memory: e.target.value })
                    : setSelectedMarker({ name: '', memory: e.target.value, year: 'Freshman', position: newMarkerPosition! })
                }
              />
            </label>
            <label>
              Year:
              <select
                value={selectedMarker ? selectedMarker.year : 'Freshman'}
                onChange={(e) =>
                  selectedMarker
                    ? setSelectedMarker({ ...selectedMarker, year: e.target.value as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' })
                    : setSelectedMarker({ name: '', memory: '', year: e.target.value as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior', position: newMarkerPosition! })
                }
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </label>
            <button onClick={newMarkerPosition ? handleSaveNewMarker : handleSaveMarkerEdit}>Save</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MapComponent;