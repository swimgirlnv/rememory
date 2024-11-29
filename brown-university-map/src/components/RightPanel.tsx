import React, { useState } from "react";
import { MarkerData, PathData } from "../data/types";

const RightPanel: React.FC<{
  markers: MarkerData[];
  paths: PathData[];
  onMarkerClick: (markerData: MarkerData) => void;
  onPathClick: (pathData: PathData) => void;
  filteredByZoom?: boolean; // Optional filter for zoomed-in pins
  mapBounds?: { north: number; south: number; east: number; west: number }; // Optional map bounds
}> = ({ markers, paths, onMarkerClick, onPathClick, mapBounds }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

  // Group markers by tags
  const groupedByTags = markers.reduce((acc: Record<string, MarkerData[]>, marker) => {
    marker.tags?.forEach((tag) => {
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(marker);
    });
    return acc;
  }, {});

  // Filter markers by search term and map bounds (if applicable)
  const markersOutsideBounds = markers.filter((marker) => {
    const inBounds =
      mapBounds &&
      marker.lat >= mapBounds.south &&
      marker.lat <= mapBounds.north &&
      marker.lng >= mapBounds.west &&
      marker.lng <= mapBounds.east;
  
    return !inBounds; // Only show markers outside the bounds
  });

  // Filter markers by search term and those outside bounds
  const filteredMarkers = markersOutsideBounds.filter((marker) =>
    marker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter paths by search term
  const filteredPaths = paths.filter((path) =>
    path.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const toggleTagExpansion = (tag: string) => {
    setExpandedTags((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  return (
    <div className="right-panel">
      <h3>Pins & Pathways</h3>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search hidden pins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grouped by Tags */}
      <div className="tags-section">
        <h4>Tags</h4>
        {Object.keys(groupedByTags).length === 0 ? (
          <p>No tags available</p>
        ) : (
          <ul>
            {Object.entries(groupedByTags).map(([tag, markers]) => (
              <li key={tag} style={{fontSize:'.8rem'}}>
                <div
                  className="tag-header"
                  onClick={() => toggleTagExpansion(tag)}
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                >
                  {expandedTags[tag] ? "▼" : "▶"} {tag}
                </div>
                {expandedTags[tag] && (
                  <ul style={{fontSize:'.6rem'}}>
                    {markers.map((marker) => (
                      <li
                        key={marker.id}
                        onClick={() =>
                          onMarkerClick(marker)
                        }
                      >
                        {marker.name || "Unnamed Marker"}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pins List */}
      <div className="list-section">
        <h4>Hidden Pins</h4>
        <ul>
        {filteredMarkers.map((marker) => (
          <li
            key={marker.id}
            onClick={() => onMarkerClick(marker)}
            style={{ fontSize: ".8rem", cursor: "pointer" }}
          >
            {marker.name || "Unnamed Marker"}
          </li>
        ))}
        </ul>
      </div>

      {/* Pathways List */}
      <div className="list-section">
        <h4>All Pathways</h4>
        <ul>
          {filteredPaths.map((path) => (
            <li
              key={path.id}
              onClick={() =>
                onPathClick(path)
              }
              style={{fontSize:'.8rem'}}
            >
              {path.name || "Unnamed Path"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RightPanel;