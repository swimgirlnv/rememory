import React, { useState, useEffect } from 'react';
import MapContainer from './MapContainer';
import MapClickHandler from './MapClickHandler';
import MapMarker from './MapMarker';
import MapRoute from './MapRoute';
import NewMarkerForm from './NewMarkerForm';
import EditModal from './EditModal';
import PathForm from './PathForm';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { MarkerData, PathData } from '../data/types';

interface InteractiveMapProps {
    isEditMode: boolean;
    mapCenter: [number, number];
    mapZoom: number;
    markers: MarkerData[];
    setMarkers: (markers: MarkerData[]) => void;
    paths: PathData[];
    setPaths: (paths: PathData[]) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ isEditMode, mapCenter, mapZoom, markers, setMarkers, paths, setPaths }) => {
    const [newMarkerLocation, setNewMarkerLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isPathCreationMode, setIsPathCreationMode] = useState(false);
    const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
    const [editMarkerId, setEditMarkerId] = useState<string | null>(null);
    const [filterYear, setFilterYear] = useState<Date | null>(null);
    const [filterClassYear, setFilterClassYear] = useState<"" | "Freshman" | "Sophomore" | "Junior" | "Senior">("");

    useEffect(() => {
        // Fetch markers and paths from Firestore
        const fetchMarkers = async () => {
            const querySnapshot = await getDocs(collection(db, 'markers'));
            const loadedMarkers: MarkerData[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as MarkerData));
            setMarkers(loadedMarkers);
        };

        const fetchPaths = async () => {
            const querySnapshot = await getDocs(collection(db, 'paths'));
            const loadedPaths: PathData[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as PathData));
            setPaths(loadedPaths);
        };

        fetchMarkers();
        fetchPaths();
    }, [setMarkers, setPaths]);

    const togglePathCreationMode = () => {
        setIsPathCreationMode((prev) => !prev);
        setSelectedMarkers([]);
    };

    const handleAddMarker = (lat: number, lng: number) => {
        setNewMarkerLocation({ lat, lng });
    };

    const handleFormClose = () => {
        setNewMarkerLocation(null);
    };

    const handleSelectMarkerForPath = (markerId: string) => {
        setSelectedMarkers((prevMarkers) =>
            prevMarkers.includes(markerId) ? prevMarkers.filter(id => id !== markerId) : [...prevMarkers, markerId]
        );
    };

    const handleEditMarker = (markerId: string) => {
        const marker = markers.find(m => m.id === markerId) || null;
        setSelectedMarker(marker);
        setEditMarkerId(markerId);
    };

    const closeEditModal = () => {
        setEditMarkerId(null);
        setSelectedMarker(null);
    };

    const handleSaveMarkerEdit = async (updatedMarker: MarkerData) => {
        if (!updatedMarker.id) return;

        await updateDoc(doc(db, 'markers', updatedMarker.id), {
            name: updatedMarker.name,
            memory: updatedMarker.memory,
            year: updatedMarker.year,
            classYear: updatedMarker.classYear,
            lat: updatedMarker.lat,
            lng: updatedMarker.lng,
        });

        setMarkers((prevMarkers) => prevMarkers.map((m) => (m.id === updatedMarker.id ? updatedMarker : m)));
        closeEditModal();
    };

    const handleSaveNewMarker = async () => {
        if (newMarkerLocation) {
          const newMarker = {
            position: newMarkerLocation,
            name: '',
            memory: '',
            year: 'Freshman',
            media: {},
          };
    
          const docRef = await addDoc(collection(db, 'markers'), {
            lat: newMarkerLocation.lat,
            lng: newMarkerLocation.lng,
            name: newMarker.name,
            memory: newMarker.memory,
            year: newMarker.year,
          });
    
          setMarkers([...markers, { ...newMarker, id: docRef.id, year: newMarker.year as 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' }]);
          setNewMarkerLocation(null);
        }
      };

    const handleSavePath = async (name: string, memory: string, year: Date, classYear: PathData["classYear"]) => {
        const pathData: Omit<PathData, 'id'> = {
            name,
            memory,
            year,
            classYear,
            markers: selectedMarkers,
        };

        const docRef = await addDoc(collection(db, 'paths'), pathData);
        setPaths([...paths, { id: docRef.id, ...pathData }]);
        setSelectedMarkers([]);
        setIsPathCreationMode(false);
    };

    const [editMarker, setEditMarker] = useState<MarkerData | null>(null);

    const handleNameChange = (newName: string) => {
        if (editMarker) setEditMarker({ ...editMarker, name: newName });
      };
      
      const handleMemoryChange = (newMemory: string) => {
        if (editMarker) setEditMarker({ ...editMarker, memory: newMemory });
      };
      
      const handleYearChange = (newYear: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior') => {
        if (editMarker) setEditMarker({ ...editMarker, classYear: newYear });
      };
      

    return (
        <div className="interactive-map">
            {isEditMode && <MapClickHandler isEditMode={isEditMode} setNewMarker={handleAddMarker} />}

            {!isEditMode && (
                <div className="filter-controls">
                    <label>
                        Year:
                        <input type="date" onChange={(e) => setFilterYear(e.target.valueAsDate || null)} />
                    </label>
                    <label>
                        Class Year:
                        <select onChange={(e) => setFilterClassYear(e.target.value as MarkerData['classYear'])}>
                            <option value="">All</option>
                            <option value="Freshman">Freshman</option>
                            <option value="Sophomore">Sophomore</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                        </select>
                    </label>
                </div>
            )}

            <MapContainer mapCenter={mapCenter} mapZoom={mapZoom} isEditMode={isEditMode}>
                {markers
                    .filter(marker => (!filterYear || marker.year.getFullYear() === filterYear.getFullYear()) &&
                                      (!filterClassYear || marker.classYear === filterClassYear))
                    .map((marker) => (
                        <MapMarker
                            key={marker.id}
                            isEditMode={isEditMode}
                            marker={marker}
                            onEdit={() => handleEditMarker(marker.id)}
                            handleSelectMarkerForPath={isPathCreationMode ? handleSelectMarkerForPath : undefined}
                            filterYear={filterYear}
                            filterClassYear={filterClassYear}
                        />
                    ))}
                {paths.map((path) => (
                    <MapRoute
                        key={path.id}
                        path={path}
                        isEditMode={isEditMode}
                        markers={markers}
                        filterYear={filterYear}
                        filterClassYear={filterClassYear}
                    />
                ))}
            </MapContainer>

            {newMarkerLocation && <NewMarkerForm lat={newMarkerLocation.lat} lng={newMarkerLocation.lng} onClose={handleFormClose} onSave={handleSaveNewMarker} />}

            {isEditMode && (
                <>
                    <button onClick={togglePathCreationMode}>
                        {isPathCreationMode ? 'Exit Path Creation Mode' : 'Enter Path Creation Mode'}
                    </button>
                    {isPathCreationMode && selectedMarkers.length > 1 && (
                        <PathForm
                            selectedMarkers={selectedMarkers}
                            onSavePath={(name, memory, year, classYear) => handleSavePath(name, memory, year, classYear)}
                        />
                    )}
                </>
            )}

            {editMarkerId && selectedMarker && (
                <EditModal
                    title="Edit Marker"
                    name={editMarker ? editMarker.name : ''}
                    memory={editMarker ? editMarker.memory : ''}
                    year={editMarker ? editMarker.classYear : 'Freshman'}
                    onSave={handleSaveMarkerEdit}
                    onCancel={() => setEditMarker(null)}
                    onNameChange={handleNameChange}
                    onMemoryChange={handleMemoryChange}
                    onYearChange={handleYearChange}
              />
            )}
        </div>
    );
};

export default InteractiveMap;