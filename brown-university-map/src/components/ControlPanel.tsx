import React, { useState } from "react";
import { MarkerData } from "../data/types";
import { useAuth } from "./AuthContext";


const ControlPanel: React.FC<{
  isEditingMode: boolean;
  isPathEditMode: boolean;
  selectedMarkers: string[];
  markers: MarkerData[];
  onFilter: (filter: { classYear?: string; year?: number }) => void;
  onEditModeToggle: () => void;
  onPathEditModeToggle: () => void;
  onCreatePath: () => void;
  onAboutOpen: () => void;
}> = ({
  isEditingMode,
  isPathEditMode,
  selectedMarkers,
  markers,
  onFilter,
  onEditModeToggle,
  onPathEditModeToggle,
  onCreatePath,
  onAboutOpen,
}) => {
  const [classYear, setClassYear] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const { currentUser, isAdmin, login, logout } = useAuth();


  const handleFilter = () => {
    onFilter({ classYear, year });
  };

  const classYearOptions = [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Grad Year 1",
    "Grad Year 2",
    "Grad Year 3",
    "Grad Year 4",
    "Grad Year 5",
    "Alumni",
  ];

  const selectedMarkerNames = selectedMarkers
    .map((markerId) => markers.find((marker) => marker.id === markerId)?.name || "Unnamed Marker");

  return (
    <div className="control-panel">
      <h3>Control Panel</h3>

      {currentUser ? (
        <div>
          <p>Welcome, {currentUser.email}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}

      {isAdmin && <p>You are an admin!</p>}

      {isEditingMode ? (
        <>
          {!isPathEditMode ? (
            <>
              {/* Editing Mode Active, Path Editing Disabled */}
              <button onClick={onEditModeToggle}>Disable Edit Mode</button>
              <button onClick={onPathEditModeToggle}>Enable Path Editing Mode</button>
            </>
          ) : (
            <>
              {/* Path Editing Mode Active */}
              <button onClick={onPathEditModeToggle}>Disable Path Editing Mode</button>
              <div>
                <h4>Selected Markers for Path</h4>
                <ul>
                  {selectedMarkerNames.map((name, index) => (
                    <li key={index}>{name}</li>
                  ))}
                </ul>
                <button onClick={onCreatePath}>Create Path</button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* View Mode */}
          <button onClick={onEditModeToggle}>Enter Edit Mode</button>

          {/* Filter Section */}
          <div>
            <h4>Filter</h4>
            <label>
              Class Year:
              <select
                value={classYear || ""}
                onChange={(e) => setClassYear(e.target.value || undefined)}
              >
                <option value="">--</option>
                {classYearOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Year:
              <input
                type="number"
                placeholder="e.g., 2023"
                value={year || ""}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </label>
            <button onClick={handleFilter}>Apply Filter</button>
          </div>
        </>
      )}

      <button onClick={onAboutOpen}>About</button>
    </div>
  );
};

export default ControlPanel;