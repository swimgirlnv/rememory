import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';
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
  showPathModal,
  onMakePath,
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
  const [selectedPath, setSelectedPath] = useState<PathData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

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
      await updateDoc(doc(db, 'markers', selectedMarker.id), {
        name: selectedMarker.name,
        memory: selectedMarker.memory,
        year: selectedMarker.year,
        media: selectedMarker.media,
      });
      setMarkers((prevMarkers) =>
        prevMarkers.map((m) => (m.id === selectedMarker.id ? selectedMarker : m))
      );
      setShowEditModal(false);
    }
  };

  // Save edited path details to Firestore
  const handleSavePathEdit = async () => {
    if (selectedPath && selectedPath.id) {
      await updateDoc(doc(db, 'paths', selectedPath.id), {
        name: selectedPath.name,
        memory: selectedPath.memory,
        year: selectedPath.year,
        media: selectedPath.media,
      });
      setPaths((prevPaths) => prevPaths.map((p) => (p.id === selectedPath.id ? selectedPath : p)));
      setShowEditModal(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: string; media?: any } | null>(null);

  const handleReadMore = (title: string, content: string, media?: any) => {
    setModalContent({ title, content, media });
    setShowModal(true);
  };

  return (
    <>
      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

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
                onClick={() => setSelectedMarker(marker)}
                onReadMore={() => handleReadMore(marker.name, marker.memory, marker.media)}
                >
              <Popup>
                <h3>{marker.name}</h3>
                <p>{marker.memory}</p>
                {isEditingMode ? (
                  <>
                    <button onClick={() => { setSelectedMarker(marker); setShowEditModal(true); }}>Edit</button>
                    <button onClick={() => handleDeleteMarker(marker.id || '')}>Delete</button>
                  </>
                ) : (
                  <>
                    <p>Year: {marker.year}</p>
                    {marker.media?.audioUrl && <audio src={marker.media.audioUrl} controls />}
                    {marker.media?.videoUrl && <video src={marker.media.videoUrl} controls />}
                  </>
                )}
              </Popup>
            </BuildingMarker>
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
                <>
                  <p>Year: {path.year}</p>
                  {path.media?.audioUrl && <audio src={path.media.audioUrl} controls />}
                  {path.media?.videoUrl && <video src={path.media.videoUrl} controls />}
                </>
              )}
            </Popup>
          </Polyline>
        ))}
      </MapContainer>

      {/* Modal for editing marker/path */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit {selectedMarker ? 'Marker' : 'Path'}</h2>
            <label>
              Name:
              <input
                type="text"
                value={selectedMarker ? selectedMarker.name : selectedPath?.name}
                onChange={(e) =>
                  selectedMarker
                    ? setSelectedMarker({ ...selectedMarker, name: e.target.value })
                    : setSelectedPath({ ...selectedPath!, name: e.target.value })
                }
              />
            </label>
            <label>
              Memory:
              <textarea
                value={selectedMarker ? selectedMarker.memory : selectedPath?.memory}
                onChange={(e) =>
                  selectedMarker
                    ? setSelectedMarker({ ...selectedMarker, memory: e.target.value })
                    : setSelectedPath({ ...selectedPath!, memory: e.target.value })
                }
              />
            </label>
            <label>
              Year:
              <select
                value={selectedMarker ? selectedMarker.year : selectedPath?.year}
                onChange={(e) =>
                  selectedMarker
                    ? setSelectedMarker({ ...selectedMarker, year: e.target.value as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' })
                    : setSelectedPath({ ...selectedPath!, year: e.target.value as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' })
                }
              >
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </label>
            <button onClick={selectedMarker ? handleSaveMarkerEdit : handleSavePathEdit}>Save</button>
            <button onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MapComponent;