import React, { useState, useEffect } from "react";
import InteractiveMap from "./InteractiveMap";
import { locations } from "../data/locations";
import { MarkerData, PathData } from "../data/types";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import EditModal from "./EditModal";

const MapContainer: React.FC<{
  mapCenter: [number, number];
  mapZoom: number;
  onBuildingClick: (buildingName: string) => void;
  onLocationChange: (locationName: string) => void;
}> = ({ onLocationChange }) => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isPathEditMode, setIsPathEditMode] = useState(false);
  const [selectedYears, setSelectedYears] = useState<string[]>(["Freshman", "Sophomore", "Junior", "Senior"]);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: 'marker' | 'path'; id: string } | null>(null);

  useEffect(() => {
    const unsubscribeMarkers = onSnapshot(collection(db, "markers"), (snapshot) => {
      const updatedMarkers = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "Unnamed Marker", // Provide default value
        lat: doc.data().lat || 0, // Default to 0 if missing
        lng: doc.data().lng || 0, // Default to 0 if missing
        memory: doc.data().memory || "",
        year: doc.data().year || "",
        classYear: doc.data().classYear || "",
      }));
      setMarkers(updatedMarkers as MarkerData[]); // Cast to MarkerData[]
    });
  
    const unsubscribePaths = onSnapshot(collection(db, "paths"), (snapshot) => {
      const updatedPaths = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "Unnamed Path", // Provide default value
        markers: doc.data().markers || [], // Default to empty array
        memory: doc.data().memory || "",
        year: doc.data().year || "",
        classYear: doc.data().classYear || "",
      }));
      setPaths(updatedPaths as PathData[]); // Cast to PathData[]
    });
  
    return () => {
      unsubscribeMarkers();
      unsubscribePaths();
    };
  }, []);
  
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
        year: new Date(),
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

  const openEditModal = (type: 'marker' | 'path', id: string) => {
    setEditingItem({ type, id });
    setIsEditModalOpen(true);
  };

  const sanitizeData = (data: Record<string, any>) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
  };
  
  const handleSaveEdit = async (updatedData: { name: string; memory: string; media: string[] }) => {
    if (!editingItem) return;
  
    const { type, id } = editingItem;
    const sanitizedMedia = {
      images: updatedData.media.filter((url) => /\.(jpeg|jpg|png|gif)$/i.test(url)),
      videoUrl: updatedData.media.find((url) => /\.(mp4|mov)$/i.test(url)) || null,
      audioUrl: updatedData.media.find((url) => /\.(mp3|wav)$/i.test(url)) || null,
    };
  
    const sanitizedData =
      type === "marker"
        ? sanitizeData({ ...markers.find((m) => m.id === id), ...updatedData, media: sanitizedMedia })
        : sanitizeData({ ...paths.find((p) => p.id === id), ...updatedData, media: sanitizedMedia });
  
    try {
      const ref = doc(db, type === "marker" ? "markers" : "paths", id);
      await updateDoc(ref, sanitizedData);
      console.log(`${type} updated successfully.`);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  // Update Marker
const updateMarker = async (markerId: string, updatedData: Partial<MarkerData>) => {
  try {
    const markerRef = doc(db, "markers", markerId);
    await updateDoc(markerRef, updatedData);
    console.log("Marker updated:", markerId);
  } catch (error) {
    console.error("Error updating marker:", error);
  }
};

// Update Path
const updatePath = async (pathId: string, updatedData: Partial<PathData>) => {
  try {
    const pathRef = doc(db, "paths", pathId);
    await updateDoc(pathRef, updatedData);
    console.log("Path updated:", pathId);
  } catch (error) {
    console.error("Error updating path:", error);
  }
};

// Delete Marker
const deleteMarker = async (markerId: string) => {
  try {
    const markerRef = doc(db, "markers", markerId);
    await deleteDoc(markerRef);
    console.log("Marker deleted from Firestore:", markerId);
    // Update local state manually
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
  } catch (error) {
    console.error("Error deleting marker:", error);
  }
};

// Delete Path
const deletePath = async (pathId: string) => {
  try {
    const pathRef = doc(db, "paths", pathId);
    await deleteDoc(pathRef);
    console.log("Path deleted:", pathId);
    setPaths((prev) => prev.filter((p) => p.id !== pathId)); // Update local state
  } catch (error) {
    console.error("Error deleting path:", error);
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
        onAddMarker={handleAddMarker} // Existing
        onDeleteMarker={deleteMarker}
        onAddPath={(newPath) => setPaths((prev) => [...prev, newPath])} // Existing
        onDeletePath={deletePath}
        onEditMarker={(markerId) => openEditModal("marker", markerId)} // Trigger edit modal for marker
        onEditPath={(pathId) => openEditModal("path", pathId)} // Trigger edit modal for path
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