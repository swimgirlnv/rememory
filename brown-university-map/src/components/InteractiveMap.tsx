import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { MarkerData, PathData } from "../data/types";
import { v4 as uuidv4 } from "uuid";
import L from "leaflet";
import ViewDetailsModal from "./ViewDetails";
import GeoSearch from "./GeoSearch";

const InteractiveMap: React.FC<{
  isEditingMode: boolean;
  isPathEditMode: boolean;
  markers: MarkerData[];
  paths: PathData[];
  selectedMarkers: string[];
  setSelectedMarkers: React.Dispatch<React.SetStateAction<string[]>>;
  onAddMarker: (newMarker: MarkerData) => void;
  onDeleteMarker: (markerId: string) => void;
  onAddPath: (newPath: PathData) => void;
  onDeletePath: (pathId: string) => void;
  onEditPath: (pathId: string) => void;
  onEditMarker: (markerId: string) => void;
  currentUser: { uid: string; email: string };
}> = ({
  isEditingMode,
  isPathEditMode,
  markers,
  paths,
  selectedMarkers,
  setSelectedMarkers,
  onAddMarker,
  onDeleteMarker,
  onDeletePath,
  onEditPath,
  onEditMarker,
  currentUser,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  const [selectedPathDetails, setSelectedPathDetails] = useState<PathData | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<{
    type: "marker" | "path";
    data: {
      name: string;
      memory: string;
      year: number;
      classYear: string;
      media: { url: string; type: "image" | "video" | "audio" }[];
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
          });
        }
      },
    });
    return null;
  };

  const wandIcon = L.icon({
    iconUrl:
      "https://images.ctfassets.net/3prze68gbwl1/assetglossary-17su9wok1ui0z7w/c4c4bdcdf0d0f86447d3efc450d1d081/map-marker.png",
    iconSize: [30, 30],
    iconAnchor: [25, 25],
    popupAnchor: [-10, 0],
  });


  const getPopupPosition = (path: PathData): LatLngExpression | undefined => {
    const firstMarker = markers.find((m) => m.id === path.markers[0]);
    return firstMarker ? [firstMarker.lat, firstMarker.lng] : undefined;
  };

  return (
    <>
      <MapContainer center={[41.8268, -71.4025]} zoom={15} className="leaflet-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoSearch />
        <MapClickHandler />

        {/* Render existing markers */}
        {markers.map((marker) => (
          <Marker key={marker.id} icon={wandIcon} position={[marker.lat, marker.lng]}>
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
                        setSelectedMarkers((prev) =>
                          prev.includes(marker.id)
                            ? prev.filter((id) => id !== marker.id)
                            : [...prev, marker.id]
                        )
                      }
                    >
                      {selectedMarkers.includes(marker.id) ? "Deselect" : "Select"}
                    </button>
                  )}
                </>
              )}
            </Popup>
          </Marker>
        ))}

        {/* Render paths */}
        {paths.map((path) => {
          const positions = path.markers
            .map((id) => {
              const marker = markers.find((m) => m.id === id);
              return marker?.lat !== undefined && marker?.lng !== undefined
                ? [marker.lat, marker.lng]
                : null;
            })
            .filter((position): position is [number, number] => position !== null);

          return (
            <Polyline
              key={path.id}
              positions={positions}
              color="blue"
              eventHandlers={{
                click: () => {
                  if (isPathEditMode) {
                    setSelectedPathId(path.id);
                  }
                  setSelectedPathDetails(path);
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
                ?.markers.map((id) => {
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
            >
              Delete
            </button>
          </Popup>
        )}

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