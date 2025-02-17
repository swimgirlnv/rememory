// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useEffect } from "react";
// import InteractiveMap from "./InteractiveMap";
// import ControlPanel from "./ControlPanel"; // Import Control Panel
// import { MarkerData, PathData, MediaItem, PinData } from "../data/types";
// import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";
// import AboutModal from "./AboutModal";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import RightPanel from "./RightPanel";
// import ViewDetailsModal from "./ViewDetails";
// import { db } from "../../firebaseConfig";
// import EditPathModal from "./EditPathModal";
// import EditMarkerModal from "./EditMarkerModal";

// const MapContainer: React.FC = () => {
//   const [selectedDetails, setSelectedDetails] = useState<{
//     type: "marker" | "path";
//     data: {
//       name: string;
//       memory: string;
//       year: number;
//       classYear: string;
//       media: { url: string; type: "image" | "video" | "audio" }[];
//       tags?: string[];
//     };
//   } | null>(null);
//   const [isEditingMode, setIsEditingMode] = useState(false);
//   const [isPathEditMode, setIsPathEditMode] = useState(false);
//   const [markers, setMarkers] = useState<MarkerData[]>([]);
//   const [pins] = useState<PinData[]>([]);
//   const [paths, setPaths] = useState<PathData[]>([]);
//   const [filteredMarkers, setFilteredMarkers] = useState<MarkerData[]>([]);
//   const [filteredPaths, setFilteredPaths] = useState<PathData[]>([]);
//   const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
//   const [selectedPins, setSelectedPins] = useState<string[]>([]);
//   const [isMarkerEditModalOpen, setIsMarkerEditModalOpen] = useState(false);
//   const [isPathEditModalOpen, setIsPathEditModalOpen] = useState(false);
//   const [viewMode] = useState<"markers" | "paths" | "both">("both");
//   const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
//   const [currentUser, setCurrentUser] = useState<any>(null);
//   const [mapBounds, setMapBounds] = useState<{ north: number; south: number; east: number; west: number } | undefined>(undefined);
//   const [panTo, setPanTo] = useState<{ lat: number; lng: number } | null>(null); // New state
//   const [editingMarker, setEditingMarker] = useState<MarkerData | null>(null);
//   const [editingPath, setEditingPath] = useState<PathData | null>(null);

//   console.log(selectedMarkers);

//   const handleBoundsChange = (bounds: { north: number; south: number; east: number; west: number }) => {
//     setMapBounds(bounds);
//   };  
//   // Monitor authenticated user
//   useEffect(() => {
//     const auth = getAuth();
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setCurrentUser(user);
//       } else {
//         setCurrentUser(null);
//       }
//     });
//   }, []);

//   // Fetch and listen for marker and path updates
//   useEffect(() => {
//     const unsubscribeMarkers = onSnapshot(collection(db, "markers"), (snapshot) => {
//       const updatedMarkers = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name || "Unnamed Marker",
//         lat: doc.data().lat || 0,
//         lng: doc.data().lng || 0,
//         memory: doc.data().memory || "",
//         year: doc.data().year || new Date().getFullYear(),
//         classYear: doc.data().classYear || "",
//         media: doc.data().media || [],
//         createdBy: doc.data().createdBy,
//         tags: doc.data().tags || [],
//       }));
//       setMarkers(updatedMarkers as MarkerData[]);
//     });

//     const unsubscribePaths = onSnapshot(collection(db, "paths"), (snapshot) => {
//       const updatedPaths = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         name: doc.data().name || "Unnamed Path",
//         pins: doc.data().pins || [],
//         memory: doc.data().memory || "",
//         year: doc.data().year || new Date().getFullYear(),
//         classYear: doc.data().classYear || "",
//         media: doc.data().media || [],
//         createdBy: doc.data().createdBy,
//         tags: doc.data().tags || [],
//       }));
//       setPaths(updatedPaths as PathData[]);
//     });

//     return () => {
//       unsubscribeMarkers();
//       unsubscribePaths();
//     };
//   }, []);

//   useEffect(() => {
//     setFilteredMarkers(markers);
//     setFilteredPaths(paths);
//   }, [markers, paths]);

//   const adminUsers = [
//     { uid: "user-unique-id", email: "beccaqwaterson@gmail.com" },
//     { uid: "owM9kxvXLLadr4lR0KkgifJRJda2", email: "j.r.locke20@gmail.com" },
//   ];
//   // Helper: Check if a user is an admin
//   const isAdmin = adminUsers.some(
//     (admin) => admin.uid === currentUser?.uid && admin.email === currentUser?.email
//   );

//   // Helper: Check if the current user owns an item
//   const canEdit = (item: { createdBy: string }) => {
//     if (!currentUser) {
//       return false; // User must be logged in
//     }
//     const isCreatedByCurrentUser = item.createdBy === currentUser?.uid;
//     console.log("Admin check:", isAdmin);
//     console.log("Created by current user:", isCreatedByCurrentUser);
//     return isAdmin || isCreatedByCurrentUser;
//   };


//   // Toggle Editing Mode
//   const toggleEditingMode = () => {
//     setIsEditingMode((prev) => !prev);
//     setIsPathEditMode(false);
//     setSelectedMarkers([]);
//   };

//   const togglePathEditMode = () => {
//     setIsPathEditMode((prev) => !prev);
//     if (!isPathEditMode) {
//       setSelectedPins([]); // Clear selected markers when exiting Path Edit Mode
//     }
//   };

//   // Create Path
//   const handleCreatePath = async () => {
//     if (selectedPins.length < 2) {
//       alert("Please select at least two pins to create a path.");
//       return;
//     }
  
//     const newPath: PathData = {
//       id: uuidv4(),
//       pins: selectedPins,
//       name: `Path with ${selectedPins.length} Pins`,
//       memory: "",
//       year: new Date().getFullYear(),
//       classYear: "",
//       media: [],
//       createdBy: currentUser.uid,
//       tags: [],
//       status: "approved",
//       dismissedBy: [],
//     };
  
//     try {
//       await addDoc(collection(db, "paths"), newPath);
//       setPaths((prev) => [...prev, newPath]);
//       setSelectedPins([]); // Clear selected pins after creating the path
//     } catch (error) {
//       console.error("Error creating path:", error);
//     }
//   };

//   // Add Marker
//   const handleAddMarker = async (newMarker: MarkerData) => {
//     try {
//       if (!currentUser) {
//         console.error("User is not logged in!");
//         return;
//       }
  
//       const docRef = await addDoc(collection(db, "markers"), {
//         ...newMarker,
//         createdBy: currentUser.uid, // Save the current user's UID
//       });
//       setMarkers((prev) => [...prev, { ...newMarker, id: docRef.id }]);
//     } catch (error) {
//       console.error("Error adding marker:", error);
//     }
//   };

//   // Delete Marker
//   const deleteMarker = async (markerId: string) => {
//     const marker = markers.find((m) => m.id === markerId);
//     if (!marker || !canEdit(marker)) {
//       alert("You are not authorized to delete this marker.");
//       return;
//     }
  
//     try {
//       const markerRef = doc(db, "markers", markerId);
//       await deleteDoc(markerRef);
//       setMarkers((prev) => prev.filter((m) => m.id !== markerId));
//     } catch (error) {
//       console.error("Error deleting marker:", error);
//     }
//   };

//   // Delete Path
//   const deletePath = async (pathId: string) => {
//     const path = paths.find((p) => p.id === pathId);
//     if (!path || !canEdit(path)) {
//       alert("You are not authorized to delete this path.");
//       return;
//     }
  
//     try {
//       const pathRef = doc(db, "paths", pathId);
//       await deleteDoc(pathRef);
//       setPaths((prev) => prev.filter((p) => p.id !== pathId));
//     } catch (error) {
//       console.error("Error deleting path:", error);
//     }
//   };

//   const openMarkerEditModal = (id: string) => {
//     const marker = markers.find((m) => m.id === id);
//     if (marker && canEdit(marker)) {
//       setEditingMarker(marker);
//       setIsMarkerEditModalOpen(true);
//     } else {
//       alert("You do not have permission to edit this marker.");
//     }
//   };

//   const openPathEditModal = (id: string) => {
//     const path = paths.find((p) => p.id === id);
//     if (path && canEdit(path)) {
//       setEditingPath(path);
//       setIsPathEditModalOpen(true);
//     } else {
//       alert("You do not have permission to edit this path.");
//     }
//   };

  
//   const handleSaveMarkerEdit = async (updatedData: { name: string; memory: string; media: MediaItem[]; classYear: string; year: number; createdBy: string; tags: string[]; }) => {
//     if (!editingMarker) return;
//     const updatedMarker: MarkerData = { ...editingMarker, ...updatedData };
//     try {
//       const docRef = doc(db, "markers", updatedMarker.id);
//       await updateDoc(docRef, { ...updatedMarker });

//       setMarkers((prev) =>
//         prev.map((marker) =>
//           marker.id === updatedMarker.id ? updatedMarker : marker
//         )
//       );

//       setEditingMarker(null);
//       setIsMarkerEditModalOpen(false);
//     } catch (error) {
//       console.error("Error saving marker:", error);
//     }
//   };

//   const handleSavePathEdit = async (updatedData: { name: string; memory: string; media: MediaItem[]; classYear: string; year: number; createdBy: string; tags: string[]; pins: string[]; }) => {
//     if (!editingPath) return;
//     const updatedPath: PathData = { ...editingPath, ...updatedData };
//     try {
//       const docRef = doc(db, "paths", updatedPath.id);
//       await updateDoc(docRef, { ...updatedPath });

//       setPaths((prev) =>
//         prev.map((path) =>
//           path.id === updatedPath.id ? updatedPath : path
//         )
//       );

//       setEditingPath(null);
//       setIsPathEditModalOpen(false);
//     } catch (error) {
//       console.error("Error saving path:", error);
//     }
//   };

//   // Filter
//   const handleFilter = (filter: { classYear?: string; year?: number }) => {
//     const { classYear, year } = filter;

//     const filteredMarkers = markers.filter((marker) => {
//       const matchesClassYear = classYear ? marker.classYear === classYear : true;
//       const matchesYear = year ? marker.year === year : true;
//       return matchesClassYear && matchesYear;
//     });

//     const filteredPaths = paths.filter((path) => {
//       const matchesClassYear = classYear ? path.classYear === classYear : true;
//       const matchesYear = year ? path.year === year : true;
//       return matchesClassYear && matchesYear;
//     });

//     setFilteredMarkers(filteredMarkers);
//     setFilteredPaths(filteredPaths);
//   };
  
//   function getDefaultPathData(path: PathData | null): {
//     id: string;
//     name: string;
//     memory: string;
//     media: MediaItem[];
//     classYear: string;
//     year: number;
//     createdBy: string;
//     tags: string[];
//     pins: string[];
//   } | null {
//     if (!path) return null;
  
//     return {
//       id: path.id || "unknown-id",
//       name: path.name || "Unnamed Path",
//       memory: path.memory || "",
//       media: path.media || [],
//       classYear: path.classYear || "--",
//       year: path.year || new Date().getFullYear(),
//       createdBy: path.createdBy || "unknown-creator",
//       tags: path.tags || [],
//       pins: path.pins || [],
//     };
//   }

//   function getDefaultMarkerData(marker: MarkerData | null): {
//     id: string;
//     name: string;
//     memory: string;
//     media: MediaItem[];
//     classYear: string;
//     year: number;
//     createdBy: string;
//     tags: string[];
//   } | null {
//     if (!marker) return null;
  
//     return {
//       id: marker.id || "unknown-id",
//       name: marker.name || "Unnamed Marker",
//       memory: marker.memory || "",
//       media: marker.media || [],
//       classYear: marker.classYear || "--",
//       year: marker.year || new Date().getFullYear(),
//       createdBy: marker.createdBy || "unknown-creator",
//       tags: marker.tags || [],
//     };
//   }

//   const handleMarkerClick = (marker: MarkerData) => {
//     setPanTo({ lat: marker.lat, lng: marker.lng }); // Set coordinates to pan to
//   };

//   return (
//     <div>
//       <div className="testing-map">
//         <ControlPanel
//           isEditingMode={isEditingMode}
//           isPathEditMode={isPathEditMode}
//           selectedPins={selectedPins}
//           pins={pins}
//           markers={markers}
//           onFilter={handleFilter}
//           onEditModeToggle={toggleEditingMode}
//           onPathEditModeToggle={togglePathEditMode}
//           onCreatePath={handleCreatePath}
//           onAboutOpen={() => setIsAboutModalOpen(true)}
//         />
//         <InteractiveMap
//           isEditingMode={isEditingMode}
//           isPathEditMode={isPathEditMode}
//           viewMode={viewMode}
//           markers={viewMode === "paths" ? [] : filteredMarkers}
//           paths={viewMode === "markers" ? [] : filteredPaths}
//           selectedPins={selectedPins}
//           setSelectedPins={setSelectedPins}
//           onAddMarker={handleAddMarker}
//           onDeleteMarker={deleteMarker}
//           onAddPath={(newPath) => setPaths((prev) => [...prev, newPath])}
//           onDeletePath={deletePath}
//           onEditMarker={(markerId) => openMarkerEditModal(markerId)}
//           onEditPath={(pathId) => openPathEditModal(pathId)}
//           currentUser={currentUser}
//           onBoundsChange={handleBoundsChange}
//           panTo={panTo}
//         />
//         {/* Right-side list panel */}
//         <RightPanel
//           markers={markers}
//           paths={paths}
//           onMarkerClick={(markerData) => {
//             setSelectedDetails({
//               type: "marker",
//               data: {
//                 ...markerData,
//                 media: markerData.media || [],
//               },
//             })
//             handleMarkerClick(markerData)
//           }
//           }
//           onPathClick={(pathData) =>
//             setSelectedDetails({ type: "path", data: { ...pathData, media: pathData.media || [] } })
//           }
//           filteredByZoom={true} // Enable filtering by zoom
//           mapBounds={mapBounds} // Pass map bounds for filtering
//         />
//       </div>
//       {/* Edit Marker Modal */}
//       <EditMarkerModal
//         isOpen={isMarkerEditModalOpen}
//         onClose={() => setIsMarkerEditModalOpen(false)}
//         onSave={handleSaveMarkerEdit}
//         onDelete={() => deleteMarker(editingMarker?.id || "")}
//         data={getDefaultMarkerData(editingMarker)}
//       />

//       {/* Edit Path Modal */}
//       <EditPathModal
//         isOpen={isPathEditModalOpen}
//         onClose={() => setIsPathEditModalOpen(false)}
//         onSave={handleSavePathEdit}
//         onDelete={() => deletePath(editingPath?.id || "")}
//         data={getDefaultPathData(editingPath)}
//       />
//       <AboutModal
//         isOpen={isAboutModalOpen}
//         onClose={() => setIsAboutModalOpen(false)}
//       />
//       {selectedDetails && (
//   <ViewDetailsModal
//     isOpen={!!selectedDetails}
//     onClose={() => setSelectedDetails(null)}
//     data={
//       selectedDetails?.data
//         ? {
//             ...selectedDetails.data,
//             media: {
//               images: Array.isArray(selectedDetails.data.media)
//                 ? selectedDetails.data.media
//                     .filter((item) => item.type === "image")
//                     .map((item) => item.url)
//                 : [], // Default to empty array if media is not an array
//               videoUrl: Array.isArray(selectedDetails.data.media)
//                 ? selectedDetails.data.media.find((item) => item.type === "video")?.url || null
//                 : null, // Fallback to null if not found
//               audioUrl: Array.isArray(selectedDetails.data.media)
//                 ? selectedDetails.data.media.find((item) => item.type === "audio")?.url || null
//                 : null, // Fallback to null if not found
//             },
//           }
//         : null
//     }
//   />
// )}
//     </div>
//   );
// };

// export default MapContainer;