/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import InteractiveMap from "./InteractiveMap";
import ControlPanel from "./ControlPanel"; // Import Control Panel
import { MarkerData, PathData, MediaItem } from "../data/types";
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import EditModal from "./EditModal";
import AboutModal from "./AboutModal";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const MapContainer: React.FC = () => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [isPathEditMode, setIsPathEditMode] = useState(false);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [paths, setPaths] = useState<PathData[]>([]);
  const [filteredMarkers, setFilteredMarkers] = useState<MarkerData[]>([]);
  const [filteredPaths, setFilteredPaths] = useState<PathData[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ type: "marker" | "path"; id: string } | null>(null);
  const [viewMode] = useState<"markers" | "paths" | "both">("both");
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  
  // Monitor authenticated user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  // Fetch and listen for marker and path updates
  useEffect(() => {
    const unsubscribeMarkers = onSnapshot(collection(db, "markers"), (snapshot) => {
      const updatedMarkers = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "Unnamed Marker",
        lat: doc.data().lat || 0,
        lng: doc.data().lng || 0,
        memory: doc.data().memory || "",
        year: doc.data().year || new Date().getFullYear(),
        classYear: doc.data().classYear || "",
        media: doc.data().media || [],
      }));
      setMarkers(updatedMarkers as MarkerData[]);
    });

    const unsubscribePaths = onSnapshot(collection(db, "paths"), (snapshot) => {
      const updatedPaths = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name || "Unnamed Path",
        markers: doc.data().markers || [],
        memory: doc.data().memory || "",
        year: doc.data().year || new Date().getFullYear(),
        classYear: doc.data().classYear || "",
        media: doc.data().media || [],
      }));
      setPaths(updatedPaths as PathData[]);
    });

    return () => {
      unsubscribeMarkers();
      unsubscribePaths();
    };
  }, []);

  useEffect(() => {
    setFilteredMarkers(markers);
    setFilteredPaths(paths);
  }, [markers, paths]);

  const adminUsers = [
    { uid: "user-unique-id", email: "beccaqwaterson@gmail.com" },
    { uid: "owM9kxvXLLadr4lR0KkgifJRJda2", email: "j.r.locke20@gmail.com" },
  ];
  // Helper: Check if a user is an admin
  const isAdmin = adminUsers.some(
    (admin) => admin.uid === currentUser?.uid && admin.email === currentUser?.email
  );

  // Helper: Check if the current user owns an item
  const canEdit = (item: { createdBy: string }) => {
    const isCreatedByCurrentUser = item.createdBy === currentUser?.uid;
    console.log("Admin check:", isAdmin);
    console.log("Created by current user:", isCreatedByCurrentUser);
    return isAdmin || isCreatedByCurrentUser;
  };


  // Toggle Editing Mode
  const toggleEditingMode = () => {
    setIsEditingMode((prev) => !prev);
    setIsPathEditMode(false);
    setSelectedMarkers([]);
  };

  const togglePathEditMode = () => {
    setIsPathEditMode((prev) => !prev);
    if (!isPathEditMode) {
      setSelectedMarkers([]); // Clear selected markers when exiting Path Edit Mode
    }
  };

  // Create Path
  // const handleCreatePath = async () => {
  //   if (selectedMarkers.length < 2) {
  //     alert("Please select at least two markers to create a path.");
  //     return;
  //   }

  //   const newPath: PathData = {
  //     id: uuidv4(),
  //     markers: selectedMarkers,
  //     name: `Path with ${selectedMarkers.length} Markers`,
  //     memory: "",
  //     year: new Date().getFullYear(),
  //     classYear: "",
  //     media: [],
  //     createdBy: currentUser?.uid,
  //   };

  //   try {
  //     const docRef = await addDoc(collection(db, "paths"), newPath);
  //     setPaths((prev) => [...prev, { ...newPath, id: docRef.id }]);
  //     setSelectedMarkers([]); // Clear selected markers after path creation
  //   } catch (error) {
  //     console.error("Error creating path:", error);
  //   }
  // };
  const handleCreatePath = async () => {
    if (selectedMarkers.length < 2) {
      alert("Please select at least two markers to create a path.");
      return;
    }
  
    try {
      if (!currentUser) {
        console.error("User is not logged in!");
        return;
      }
  
      const newPath: PathData = {
        id: uuidv4(),
        markers: selectedMarkers,
        name: `Path with ${selectedMarkers.length} Markers`,
        memory: "",
        year: new Date().getFullYear(),
        classYear: "",
        media: [],
        createdBy: currentUser.uid, // Save the current user's UID
      };
  
      const docRef = await addDoc(collection(db, "paths"), newPath);
      setPaths((prev) => [...prev, { ...newPath, id: docRef.id }]);
      setSelectedMarkers([]); // Clear selected markers after path creation
    } catch (error) {
      console.error("Error creating path:", error);
    }
  };

  // Add Marker
  // const handleAddMarker = async (newMarker: MarkerData) => {
  //   try {
  //     const docRef = await addDoc(collection(db, "markers"), newMarker);
  //     setMarkers((prev) => [...prev, { ...newMarker, id: docRef.id }]);
  //   } catch (error) {
  //     console.error("Error adding marker:", error);
  //   }
  // };
  const handleAddMarker = async (newMarker: MarkerData) => {
    try {
      if (!currentUser) {
        console.error("User is not logged in!");
        return;
      }
  
      const docRef = await addDoc(collection(db, "markers"), {
        ...newMarker,
        createdBy: currentUser.uid, // Save the current user's UID
      });
      setMarkers((prev) => [...prev, { ...newMarker, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding marker:", error);
    }
  };

  // Delete Marker
  // const deleteMarker = async (markerId: string) => {
  //   try {
  //     const markerRef = doc(db, "markers", markerId);
  //     await deleteDoc(markerRef);
  //     setMarkers((prev) => prev.filter((m) => m.id !== markerId));
  //   } catch (error) {
  //     console.error("Error deleting marker:", error);
  //   }
  // };

  const deleteMarker = async (markerId: string) => {
    const marker = markers.find((m) => m.id === markerId);
    if (!marker || !canEdit(marker)) {
      alert("You are not authorized to delete this marker.");
      return;
    }
  
    try {
      const markerRef = doc(db, "markers", markerId);
      await deleteDoc(markerRef);
      setMarkers((prev) => prev.filter((m) => m.id !== markerId));
    } catch (error) {
      console.error("Error deleting marker:", error);
    }
  };

  // Delete Path
  // const deletePath = async (pathId: string) => {
  //   try {
  //     const pathRef = doc(db, "paths", pathId);
  //     await deleteDoc(pathRef);
  //     setPaths((prev) => prev.filter((p) => p.id !== pathId));
  //   } catch (error) {
  //     console.error("Error deleting path:", error);
  //   }
  // };
  const deletePath = async (pathId: string) => {
    const path = paths.find((p) => p.id === pathId);
    if (!path || !canEdit(path)) {
      alert("You are not authorized to delete this path.");
      return;
    }
  
    try {
      const pathRef = doc(db, "paths", pathId);
      await deleteDoc(pathRef);
      setPaths((prev) => prev.filter((p) => p.id !== pathId));
    } catch (error) {
      console.error("Error deleting path:", error);
    }
  };

  // Open Edit Modal
  // const openEditModal = (type: "marker" | "path", id: string) => {
  //   setEditingItem({ type, id });
  //   setIsEditModalOpen(true);
  // };
  const openEditModal = (type: "marker" | "path", id: string) => {
    const item =
      type === "marker"
        ? markers.find((m) => m.id === id)
        : paths.find((p) => p.id === id);
  
    if (item && canEdit(item)) {
      setEditingItem({ type, id });
      setIsEditModalOpen(true);
    } else {
      alert("You do not have permission to edit this item.");
    }
  };

  // Save Edits
  const handleSaveEdit = async (updatedData: {
    name: string;
    memory: string;
    media: MediaItem[];
    classYear: string;
    year: number;
  }) => {
    if (!editingItem) return;

    const { type, id } = editingItem;

    try {
      const docRef = doc(db, type === "marker" ? "markers" : "paths", id);

      const sanitizedData = {
        name: updatedData.name,
        memory: updatedData.memory,
        media: updatedData.media || [],
        classYear: updatedData.classYear,
        year: updatedData.year,
      };

      await updateDoc(docRef, sanitizedData);
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  // Filter
  const handleFilter = (filter: { classYear?: string; year?: number }) => {
    const { classYear, year } = filter;

    const filteredMarkers = markers.filter((marker) => {
      const matchesClassYear = classYear ? marker.classYear === classYear : true;
      const matchesYear = year ? marker.year === year : true;
      return matchesClassYear && matchesYear;
    });

    const filteredPaths = paths.filter((path) => {
      const matchesClassYear = classYear ? path.classYear === classYear : true;
      const matchesYear = year ? path.year === year : true;
      return matchesClassYear && matchesYear;
    });

    setFilteredMarkers(filteredMarkers);
    setFilteredPaths(filteredPaths);
  };

  return (
    <div>
      <div className="testing-map">
        <ControlPanel
          isEditingMode={isEditingMode}
          isPathEditMode={isPathEditMode}
          selectedMarkers={selectedMarkers}
          markers={markers}
          onFilter={handleFilter}
          onEditModeToggle={toggleEditingMode}
          onPathEditModeToggle={togglePathEditMode}
          onCreatePath={handleCreatePath}
          onAboutOpen={() => setIsAboutModalOpen(true)}
        />
        <InteractiveMap
          isEditingMode={isEditingMode}
          isPathEditMode={isPathEditMode}
          markers={viewMode === "paths" ? [] : filteredMarkers}
          paths={viewMode === "markers" ? [] : filteredPaths}
          selectedMarkers={selectedMarkers}
          setSelectedMarkers={setSelectedMarkers}
          onAddMarker={handleAddMarker}
          onDeleteMarker={deleteMarker}
          onAddPath={(newPath) => setPaths((prev) => [...prev, newPath])}
          onDeletePath={deletePath}
          onEditMarker={(markerId) => openEditModal("marker", markerId)}
          onEditPath={(pathId) => openEditModal("path", pathId)}
        />
      </div>
      <EditModal
        key={editingItem?.id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        data={
          editingItem
            ? editingItem.type === "marker"
              ? {
                  id: markers.find((m) => m.id === editingItem.id)?.id || "unknown-id",
                  name: markers.find((m) => m.id === editingItem.id)?.name || "Unnamed Marker",
                  memory: markers.find((m) => m.id === editingItem.id)?.memory || "",
                  media: markers.find((m) => m.id === editingItem.id)?.media || [], // Default to an empty array
                  classYear: markers.find((m) => m.id === editingItem.id)?.classYear || "Unknown Class Year",
                  year: markers.find((m) => m.id === editingItem.id)?.year || new Date().getFullYear(),
                }
              : {
                  id: paths.find((p) => p.id === editingItem.id)?.id || "unknown-id",
                  name: paths.find((p) => p.id === editingItem.id)?.name || "Unnamed Path",
                  memory: paths.find((p) => p.id === editingItem.id)?.memory || "",
                  media: paths.find((p) => p.id === editingItem.id)?.media || [], // Default to an empty array
                  classYear: paths.find((p) => p.id === editingItem.id)?.classYear || "Unknown Class Year",
                  year: paths.find((p) => p.id === editingItem.id)?.year || new Date().getFullYear(),
                }
            : null
        }
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};

export default MapContainer;