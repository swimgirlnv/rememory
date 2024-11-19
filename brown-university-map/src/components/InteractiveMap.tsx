import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { MarkerData, PathData } from "../data/types";
import { v4 as uuidv4 } from "uuid";

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
  onEditPath: (pathId: string) => void; // Callback to handle path editing
  onEditMarker: (markerId: string) => void; // Callback to handle marker editing
}> = ({
  isEditingMode,
  isPathEditMode,
  markers,
  paths,
  selectedMarkers,
  setSelectedMarkers,
  onAddMarker,
  onDeleteMarker,
  onAddPath,
  onDeletePath,
  onEditPath,
  onEditMarker,
}) => {
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (isEditingMode && !isPathEditMode) { // Prevent marker creation in Path Edit Mode
          onAddMarker({
            id: uuidv4(),
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            name: "Unnamed Marker",
            memory: "",
            year: new Date(),
            classYear: "",
          });
        }
      },
    });
    return null;
  };

  return (
    <MapContainer center={[41.8268, -71.4025]} zoom={15} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />

      {/* Render existing markers */}
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>
            <p>{marker.name}</p>
            {isEditingMode && (
              <>
                <button onClick={() => onDeleteMarker(marker.id)}>Delete</button>
                <button onClick={() => onEditMarker(marker.id)}>Edit</button>
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
        const positions = Array.isArray(path.markers)
        ? path.markers
            .map((id) => {
              const marker = markers.find((m) => m.id === id);
              return marker?.lat !== undefined && marker?.lng !== undefined
                ? [marker.lat, marker.lng]
                : null; // Return null for invalid markers
            })
            .filter((position): position is [number, number] => position !== null) // Ensure valid LatLngTuple
        : []; // Default to an empty array if path.markers is not valid

        return (
          <Polyline
            key={path.id}
            positions={positions}
            color="blue"
            eventHandlers={{
              click: () => {
                if (isPathEditMode) {
                  setSelectedPathId(path.id); // Track the selected path
                }
              },
            }}
          />
        );
      })}

      {/* Render path popup */}
      {isPathEditMode && selectedPathId && paths.find((p) => p.id === selectedPathId) && (
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
          <p>Path Options</p>
          <button onClick={() => onEditPath(selectedPathId)}>Edit</button>
          <button
            onClick={() => {
              onDeletePath(selectedPathId);
              setSelectedPathId(null);
            }}
          >
            Delete
          </button>
        </Popup>
      )}
    </MapContainer>
  );
};

export default InteractiveMap;