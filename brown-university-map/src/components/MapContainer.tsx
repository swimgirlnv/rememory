import React, { useState, useEffect } from "react";
import InteractiveMap from "./InteractiveMap";
import { locations } from "../data/locations";
import { MarkerData, PathData } from "../data/types";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import EditModal from "./EditModal";

const MapContainer: React.FC<{
  mapCenter: [number, number];
  mapZoom: number;
  onBuildingClick: (buildingName: string) => void;
  onLocationChange: (locationName: string) => void;
}> = ({ mapCenter, mapZoom, onBuildingClick, onLocationChange }) => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isPathEditMode, setIsPathEditMode] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>(["Freshman", "Sophomore", "Junior", "Senior"]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'marker' | 'path'; id: string } | null>(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "markers"));
        const markerData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MarkerData[];
        setMarkers(markerData);
      } catch (error) {
        console.error("Error fetching markers:", error);
      }
    };

    const fetchPaths = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "paths"));
        const pathData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PathData[];
        setPaths(pathData);
      } catch (error) {
        console.error("Error fetching paths:", error);
      }
    };

    fetchMarkers();
    fetchPaths();
  }, []);

  const toggleEditingMode = () => {
    setIsEditingMode((prev) => !prev);
    setIsPathEditMode(false); // Reset Path Edit Mode when exiting edit mode
    setSelectedMarkers([]); // Clear selected markers when exiting edit mode
  };

  const togglePathEditMode = () => {
    setIsPathEditMode((prev) => !prev);
  };

  const handleAddMarker = async (newMarker: MarkerData) => {
    try {
      const docRef = await addDoc(collection(db, "markers"), newMarker);
      setMarkers((prev) => [...prev, { ...newMarker, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding marker:", error);
    }
  };

  const handleCreatePath = async () => {
    if (selectedMarkers.length > 1) {
      const newPath: PathData = {
        id: uuidv4(),
        markers: selectedMarkers,
        name: `Path ${selectedMarkers.length} Markers`,
        memory: "",
        year: new Date().toISOString(),
        classYear: "",
      };

      try {
        const docRef = await addDoc(collection(db, "paths"), newPath);
        setPaths((prev) => [...prev, { ...newPath, id: docRef.id }]);
        setSelectedMarkers([]); // Clear selected markers after path creation
        console.log("Path created:", newPath);
      } catch (error) {
        console.error("Error creating path:", error);
      }
    } else {
      alert("Please select at least two markers to create a path.");
    }
  };

  const handleCheckboxChange = (year: string) => {
    setSelectedYears((prevYears) =>
      prevYears.includes(year) ? prevYears.filter((y) => y !== year) : [...prevYears, year]
    );
  };

  const handleEditPath = (pathId: string) => {
    console.log(`Editing path: ${pathId}`);
    // Add your logic to handle path editing (e.g., show a form to edit path details)
  };

  const openEditModal = (type: 'marker' | 'path', id: string) => {
    setEditingItem({ type, id });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData: { name: string; memory: string }) => {
    if (editingItem) {
      const { type, id } = editingItem;
  
      try {
        if (type === 'marker') {
          const markerIndex = markers.findIndex((m) => m.id === id);
          if (markerIndex !== -1) {
            const updatedMarker = { ...markers[markerIndex], ...updatedData };
            await updateDoc(doc(db, 'markers', id), updatedMarker);
            setMarkers((prev) =>
              prev.map((m) => (m.id === id ? updatedMarker : m))
            );
          }
        } else if (type === 'path') {
          const pathIndex = paths.findIndex((p) => p.id === id);
          if (pathIndex !== -1) {
            const updatedPath = { ...paths[pathIndex], ...updatedData };
            await updateDoc(doc(db, 'paths', id), updatedPath);
            setPaths((prev) =>
              prev.map((p) => (p.id === id ? updatedPath : p))
            );
          }
        }
  
        setIsEditModalOpen(false);
        setEditingItem(null);
      } catch (error) {
        console.error('Error updating Firestore:', error);
      }
    }
  };

  return (
    <div>
      {/* Editing Mode Toggle */}
      {!isPathEditMode && (
        <button onClick={toggleEditingMode}>
          {isEditingMode ? "Disable Editing Mode" : "Enable Editing Mode"}
        </button>
      )}
  
      {/* Path Edit Mode Toggle */}
      {isEditingMode && (
        <button onClick={togglePathEditMode}>
          {isPathEditMode ? "Disable Edit Path Mode" : "Enable Edit Path Mode"}
        </button>
      )}
  
      {/* Display Selected Markers and Create Path */}
      {isPathEditMode && (
        <div className="path-edit-display">
          <h3>Selected Markers for Path</h3>
          <ul>
            {selectedMarkers.map((markerId) => {
              const marker = markers.find((m) => m.id === markerId);
              return <li key={markerId}>{marker?.name || "Unnamed Marker"}</li>;
            })}
          </ul>
          <button onClick={handleCreatePath}>Create Path</button>
        </div>
      )}
  
      {/* Year Filters */}
      <div className="filters">
        {["Freshman", "Sophomore", "Junior", "Senior"].map((year) => (
          <label key={year}>
            <input
              type="checkbox"
              checked={selectedYears.includes(year)}
              onChange={() => handleCheckboxChange(year)}
            />
            {year}
          </label>
        ))}
      </div>
  
      {/* Location Selector */}
      <div className="location-selector">
        <select onChange={(e) => onLocationChange(e.target.value)}>
          {locations.map((loc) => (
            <option key={loc.name} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>
  
      {/* Interactive Map */}
      <InteractiveMap
        isEditingMode={isEditingMode}
        isPathEditMode={isPathEditMode}
        markers={markers}
        paths={paths}
        selectedMarkers={selectedMarkers}
        setSelectedMarkers={setSelectedMarkers}
        onAddMarker={handleAddMarker}
        onDeleteMarker={(markerId) =>
          setMarkers((prev) => prev.filter((marker) => marker.id !== markerId))
        }
        onAddPath={(newPath) => setPaths((prev) => [...prev, newPath])}
        onDeletePath={(pathId) =>
          setPaths((prev) => prev.filter((path) => path.id !== pathId))
        }
        onEditPath={(pathId) => openEditModal('path', pathId)} // Open modal for path
        onEditMarker={(markerId) => openEditModal('marker', markerId)} // Open modal for marker
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        data={
          editingItem
            ? editingItem.type === 'marker'
              ? markers.find((m) => m.id === editingItem.id) || null
              : paths.find((p) => p.id === editingItem.id) || null
            : null
        }
      />
    </div>
  );
}
export default MapContainer;