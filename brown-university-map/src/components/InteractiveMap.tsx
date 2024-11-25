import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { MarkerData, PathData } from "../data/types";
import { v4 as uuidv4 } from "uuid";
import L from "leaflet";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import ViewDetailsModal from "./ViewDetails";

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

  const GeoSearch = () => {
    const map = useMap();

    React.useEffect(() => {
      const provider = new OpenStreetMapProvider();

      const searchControl = new GeoSearchControl({
        provider,
        style: "bar",
        showMarker: false,
        retainZoomLevel: false,
        animateZoom: true,
      });

      map.addControl(searchControl);

      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);

    return null;
  };

  const getPopupPosition = (path: PathData): LatLngExpression | undefined => {
    const firstMarker = markers.find((m) => m.id === path.markers[0]);
    return firstMarker ? [firstMarker.lat, firstMarker.lng] : undefined;
  };

  return (
    <>
      <MapContainer center={[41.8268, -71.4025]} zoom={15} style={{ height: "100vh", width: "100%" }}>
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
            <p>{paths.find((p) => p.id === selectedPathId)?.name}</p>
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

        {/* Render path popup */}
        {selectedPathDetails && (
          <Popup
            position={getPopupPosition(selectedPathDetails)}
            onClose={() => setSelectedPathDetails(null)}
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
        data={selectedDetails?.data || null}
      />
    </>
  );
};

export default InteractiveMap;