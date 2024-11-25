import React from "react";
import { MarkerData, PathData } from "../data/types";

const RightPanel: React.FC<{
  markers: MarkerData[];
  paths: PathData[];
  onMarkerClick: (markerData: {
    name: string;
    memory: string;
    year: number;
    classYear: string;
    media: { url: string; type: "image" | "video" | "audio" }[];
  }) => void;
  onPathClick: (pathData: {
    name: string;
    memory: string;
    year: number;
    classYear: string;
    media: { url: string; type: "image" | "video" | "audio" }[];
  }) => void;
}> = ({ markers, paths, onMarkerClick, onPathClick }) => {
  return (
    <div className="right-panel">
      <h3>Pins & Pathways</h3>
      <div className="list-container">
        <h4>Pins</h4>
        <ul>
          {markers.map((marker) => (
            <li
              key={marker.id}
              onClick={() =>
                onMarkerClick({
                  name: marker.name || "Unnamed Marker",
                  memory: marker.memory || "",
                  year: marker.year,
                  classYear: marker.classYear || "Unknown Class Year",
                  media: marker.media || [],
                })
              }
              style={{ fontSize: '.8em'}}
            >
              {marker.name || "Unnamed Marker"}
            </li>
          ))}
        </ul>
        <h4>Pathways</h4>
        <ul>
          {paths.map((path) => (
            <li
              key={path.id}
              onClick={() =>
                onPathClick({
                  name: path.name || "Unnamed Path",
                  memory: path.memory || "",
                  year: path.year,
                  classYear: path.classYear || "Unknown Class Year",
                  media: path.media || [],
                })
              }
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