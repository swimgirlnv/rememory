import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { MarkerData, PathData, PinData } from "../data/types";
import { v4 as uuidv4 } from "uuid";
import L from "leaflet";
import ViewDetailsModal from "./ViewDetails";
import GeoSearch from "./GeoSearch";
import { addDoc, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebaseConfig";


// Helper component to pan and zoom
const PanToMarker = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15); // Pan to the marker and adjust the zoom level
    }
  }, [lat, lng, map]);

  return null;
};


const InteractiveMap: React.FC<{
  isEditingMode: boolean;
  isPathEditMode: boolean;
  viewMode: "markers" | "paths" | "both";
  markers: MarkerData[];
  paths: PathData[];
  selectedPins: string[];
  setSelectedPins: React.Dispatch<React.SetStateAction<string[]>>;
  onAddMarker: (newMarker: MarkerData) => void;
  onDeleteMarker: (markerId: string) => void;
  onAddPath: (newPath: PathData) => void;
  onDeletePath: (pathId: string) => void;
  onEditPath: (pathId: string) => void;
  onEditMarker: (markerId: string) => void;
  currentUser: { uid: string; email: string };
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void;
  panTo: { lat: number; lng: number } | null;
}> = ({
  isEditingMode,
  isPathEditMode,
  markers,
  paths,
  selectedPins,
  setSelectedPins,
  onAddMarker,
  onDeleteMarker,
  onDeletePath,
  onEditPath,
  onEditMarker,
  currentUser,
  onBoundsChange,
  panTo,
}) => {

  useEffect(() => {
    const unsubscribePins = onSnapshot(collection(db, "pins"), (snapshot) => {
      const updatedPins = snapshot.docs.map((doc) => ({
        id: doc.id,
        lat: doc.data().lat,
        lng: doc.data().lng,
        name: doc.data().name || "Unnamed Pin",
        createdBy: doc.data().createdBy,
      }));
      setPins(updatedPins);
    });
  
    return () => unsubscribePins();
  }, []);
  
  const MapEventsHandler = () => {
    const map = useMapEvents({
      moveend: () => {
        const bounds = map.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      },
      zoomend: () => {
        const bounds = map.getBounds();
        onBoundsChange({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      },
    });
  
    return null;
  };

  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [pins, setPins] = useState<PinData[]>([]);
  const [selectedPathDetails, setSelectedPathDetails] = useState<PathData | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<{
    type: "marker" | "path";
    data: {
      name: string;
      memory: string;
      year: number;
      classYear: string;
      media: { url: string; type: "image" | "video" | "audio" }[];
      tags: string[];
      connectedMarkers?: string[];
    };
  } | null>(null);

  const closeModal = () => setSelectedDetails(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (isEditingMode && !isPathEditMode) {
          onAddMarker({
            id: uuidv4(),
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            name: "Unnamed Marker",
            memory: "",
            year: new Date().getFullYear(),
            classYear: "",
            media: [],
            createdBy: currentUser.uid,
            tags: [],
            status: "approved",
            dismissedBy: [],
          });
        }
      },
    });
    return null;
  };

  const getMarkerIcon = (classYear: string): L.Icon => {
    const gradientMap: { [key: string]: { start: string; end: string } } = {
      Freshman: { start: "#8b4513", end: "#5c4033" }, // Darker Sienna to DarkBrown
      Sophomore: { start: "#b5651d", end: "#8b4513" }, // Darker Peru to SaddleBrown
      Junior: { start: "#b37a4c", end: "#8b5a2b" }, // Darker BurlyWood to SaddleBrown
      Senior: { start: "#a07850", end: "#8b5a2b" }, // Darker Tan to Peru
      Alumni: { start: "#d2691e", end: "#8b4513" }, // Darker SandyBrown to SaddleBrown
      "Grad Year 1": { start: "#b8860b", end: "#5c4033" }, // Darker GoldenRod to DarkBrown
      "Grad Year 2": { start: "#cc7a6a", end: "#8b4513" }, // Darker DarkSalmon to SaddleBrown
      "Grad Year 3": { start: "#a37575", end: "#8b4513" }, // Darker RosyBrown to SaddleBrown
      "Grad Year 4": { start: "#8b4513", end: "#3c2f2f" }, // SaddleBrown to VeryDarkBrown
      "Grad Year 5": { start: "#5c4033", end: "#2c1f1f" }, // DarkBrown to VeryVeryDarkBrown
      "Faculty": { start: "#2c1f1f", end: "#8b4513" }, // Darker Sienna to DarkBrown
      Default: { start: "#8b4513", end: "#5c4033" }, // Default: Darker Sienna to DarkBrown
    };
  
    const gradient = gradientMap[classYear] || gradientMap.Default;
  
    // Define an SVG for a pin shape with gradient
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:${gradient.start};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${gradient.end};stop-opacity:1" />
          </linearGradient>
        </defs>
        <path 
          d="M16 0 C24.837 0 32 7.163 32 16 C32 26 16 48 16 48 C16 48 0 26 0 16 C0 7.163 7.163 0 16 0 Z" 
          fill="url(#grad1)" 
        />
        <circle cx="16" cy="16" r="8" fill="white" />
      </svg>
    `;
  
  
    // Encode the SVG as a data URI
    const iconUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  
    return L.icon({
      iconUrl,
      iconSize: [18, 18], // Adjust the size for better visibility
      iconAnchor: [9, 9], // Anchor the icon at the bottom
      popupAnchor: [0, 0], // Position the popup above the icon
    });
  };


  const getPopupPosition = (path: PathData): LatLngExpression | undefined => {
    const firstMarker = markers.find((m) => m.id === path.pins[0]);
    return firstMarker ? [firstMarker.lat, firstMarker.lng] : undefined;
  };

  const handleAddPin = async (lat: number, lng: number) => {
    const newPin: PinData = {
      id: uuidv4(),
      lat,
      lng,
      name: "Unnamed Pin",
      createdBy: currentUser.uid,
    };
  
    try {
      const docRef = await addDoc(collection(db, "pins"), newPin);
      setPins((prev) => [...prev, { ...newPin, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding pin:", error);
    }
  };

  const PathEditHandler = () => {
    useMapEvents({
      click(e) {
        handleAddPin(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const handleDeletePin = async (pinId: string) => {
    const pin = pins.find((p) => p.id === pinId);
    if (!pin || pin.createdBy !== currentUser.uid) {
      alert("You are not authorized to delete this pin.");
      return;
    }
  
    try {
      await deleteDoc(doc(db, "pins", pinId)); // Delete from Firestore
      setPins((prev) => prev.filter((p) => p.id !== pinId)); // Update local state
    } catch (error) {
      console.error("Error deleting pin:", error);
    }
  };

  const unselectedPinIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path
        d="M16 0 C24.837 0 32 7.163 32 16 C32 26 16 48 16 48 C16 48 0 26 0 16 C0 7.163 7.163 0 16 0 Z"
        fill="#8B4513" />
      <circle cx="16" cy="16" r="8" fill="white" />
    </svg>`)}
  `;
  
  const selectedPinIcon = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
      <path
        d="M16 0 C24.837 0 32 7.163 32 16 C32 26 16 48 16 48 C16 48 0 26 0 16 C0 7.163 7.163 0 16 0 Z"
        fill="#FFD700" stroke="#FF4500" stroke-width="2" />
      <circle cx="16" cy="16" r="8" fill="white" />
    </svg>`)}
  `;
  return (
    <>
      <MapContainer center={[41.8268, -71.4025]} zoom={15} className="leaflet-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEventsHandler />
        <GeoSearch />
        <MapClickHandler />

        {panTo && <PanToMarker lat={panTo.lat} lng={panTo.lng} />}

        {/* Render existing markers */}
        {!isPathEditMode && markers.map((marker) => (
          <Marker key={marker.id} icon={getMarkerIcon(marker.classYear)} position={[marker.lat, marker.lng]}>
            <Popup>
              <p>{marker.name}</p>
              {!isEditingMode && (
                <button
                  onClick={() =>
                    setSelectedDetails({
                      type: "marker",
                      data: {
                        name: marker.name,
                        memory: marker.memory,
                        year: marker.year,
                        classYear: marker.classYear,
                        media: marker.media || [],
                        tags: marker.tags || [],
                      },
                    })
                  }
                >
                  Read More
                </button>
              )}
              {isEditingMode && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteMarker(marker.id);
                    }}
                    className="delete"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditMarker(marker.id);
                    }}
                  >
                    Edit
                  </button>
                  {isPathEditMode && (
                    <button
                      onClick={() =>
                        setSelectedPins((prev) =>
                          prev.includes(marker.id)
                            ? prev.filter((id) => id !== marker.id)
                            : [...prev, marker.id]
                        )
                      }
                    >
                      {selectedPins.includes(marker.id) ? "Deselect" : "Select"}
                    </button>
                  )}
                </>
              )}
            </Popup>
          </Marker>
        ))}

        {/* Render paths */}
        {paths.map((path) => {
          const positions = path.pins
            .map((pinId) => {
              const pin = pins.find((p) => p.id === pinId);
              return pin ? [pin.lat, pin.lng] : null;
            })
            .filter((position): position is [number, number] => position !== null);

          if (positions.length < 2) return null; // Skip paths with insufficient positions

          return (
            <Polyline
              key={path.id}
              positions={positions}
              color="#8B4513"
              weight={1.5}
              eventHandlers={{
                click: () => {
                  if (isPathEditMode) {
                    // Open Edit Modal
                    onEditPath(path.id);
                  } else {
                    // Open View Modal
                    setSelectedDetails({
                      type: "path",
                      data: {
                        name: path.name,
                        memory: path.memory,
                        year: path.year,
                        classYear: path.classYear,
                        media: path.media || [],
                        tags: path.tags || [],
                      },
                    });
                  }
                },
              }}
            />
          );
        })}

        {/* Render path popup */}
        {selectedPathDetails && isPathEditMode && (
          <Popup
            position={
              paths
                .find((p) => p.id === selectedPathId)
                ?.pins.map((id) => {
                  const marker = markers.find((m) => m.id === id);
                  return [marker?.lat || 0, marker?.lng || 0];
                })?.[0] as LatLngExpression
            }
            eventHandlers={{
              popupclose: () => setSelectedPathId(null),
            }}
          >
            <p>{paths.find((p) => p.id === selectedPathId)?.name}</p>
            <button onClick={() => onEditPath(selectedPathDetails.id)}>Edit</button>
            <button
              onClick={() => {
                onDeletePath(selectedPathDetails.id);
                setSelectedPathId(null);
              }}
              className="delete"
            >
              Delete
            </button>
          </Popup>
        )}

        {isPathEditMode && <PathEditHandler />}
        {isPathEditMode &&
          pins.map((pin) => (
            <Marker
              key={pin.id}
              position={[pin.lat, pin.lng]}
              icon={
                selectedPins.includes(pin.id)
                  ? L.icon({ iconUrl: selectedPinIcon, iconSize: [25, 25] }) // Use a different icon for selected pins
                  : L.icon({ iconUrl: unselectedPinIcon, iconSize: [20, 20] }) // Default icon
              }
              eventHandlers={{
                click: () => {
                  if (isPathEditMode) {
                    setSelectedPins((prev) =>
                      prev.includes(pin.id)
                        ? prev.filter((id) => id !== pin.id) // Deselect if already selected
                        : [...prev, pin.id] // Select if not selected
                    );
                  }
                },
              }}
            >
              <Popup>
                {isPathEditMode && (
                  <p>{selectedPins.includes(pin.id) ? "Selected for Path" : "Click to Select"}</p>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent interfering with the map click
                    handleDeletePin(pin.id); // Call the delete function
                  }}
                  className="delete"
                >
                  Delete Pin
                </button>
              </Popup>
            </Marker>
          ))}

        {/* Render path popup */}
        {selectedPathDetails && !isPathEditMode && (
          <Popup
            position={getPopupPosition(selectedPathDetails)}
            eventHandlers={{
              remove: () => setSelectedPathDetails(null),
            }}
          >
            <p>{selectedPathDetails.name}</p>
            <button
              onClick={() =>
                setSelectedDetails({
                  type: "path",
                  data: {
                    name: selectedPathDetails.name,
                    memory: selectedPathDetails.memory,
                    year: selectedPathDetails.year,
                    classYear: selectedPathDetails.classYear,
                    media: selectedPathDetails.media || [],
                    tags: selectedPathDetails.tags || [],
                  },
                })
              }
            >
              Read More
            </button>
          </Popup>
        )}
      </MapContainer>

      <ViewDetailsModal
        isOpen={!!selectedDetails}
        onClose={closeModal}
        data={
          selectedDetails?.data
            ? {
                ...selectedDetails.data,
                media: {
                  images: Array.isArray(selectedDetails.data.media)
                    ? selectedDetails.data.media
                        ?.filter((item) => item.type === "image")
                        .map((item) => item.url)
                    : [], // Fallback to empty array if media is not an array
                  videoUrl: Array.isArray(selectedDetails.data.media)
                    ? selectedDetails.data.media
                        ?.find((item) => item.type === "video")
                        ?.url || null
                    : null, // Fallback to null
                  audioUrl: Array.isArray(selectedDetails.data.media)
                    ? selectedDetails.data.media
                        ?.find((item) => item.type === "audio")
                        ?.url || null
                    : null, // Fallback to null
                },
              }
            : null
        }
      />
    </>
  );
};

export default InteractiveMap;