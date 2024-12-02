import React, { useState } from "react";
import { MarkerData, PinData } from "../data/types";
import { useAuth } from "./AuthContext";


const ControlPanel: React.FC<{
  isEditingMode: boolean;
  isPathEditMode: boolean;
  selectedPins: string[];
  pins: PinData[];
  markers: MarkerData[];
  onFilter: (filter: { classYear?: string; year?: number }) => void;
  onEditModeToggle: () => void;
  onPathEditModeToggle: () => void;
  onCreatePath: () => void;
  onAboutOpen: () => void;
}> = ({
  isEditingMode,
  isPathEditMode,
  selectedPins,
  pins,
  onFilter,
  onEditModeToggle,
  onPathEditModeToggle,
  onCreatePath,
  onAboutOpen,
}) => {
  const [classYear, setClassYear] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const { currentUser, isAdmin, login, logout } = useAuth();

  const parseFirstNameFromEmail = (email: string) => {
    if (!email) return "User";
    const firstPart = email.split("@")[0];
    const nameParts = firstPart.split(/[._]/); // Split by dot or underscore
    return nameParts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part
      .join(" ");
  };

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
    "Faculty",
  ];

  return (
    <div className="control-panel">
      <div className='logo'>
        <img src="https://i.imgur.com/wjbC06J.png" alt="Brown University Logo" />
        <h1>ReMemory</h1>
      </div>
      {currentUser ? (
        <div style={{ maxWidth: "160px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <p>Welcome, {parseFirstNameFromEmail(currentUser.email)}</p>
          <button onClick={logout} className="logout">Logout</button>
        </div>
      ) : (
        <button onClick={login} className="enter">Login</button>
      )}
      {isAdmin && <p>You are an admin!</p>}
      <button onClick={onAboutOpen}>About</button>
      {isEditingMode ? (
        <>
          {!isPathEditMode ? (
            <>
              {/* Editing Mode Active, Path Editing Disabled */}
              <button onClick={onEditModeToggle} className='exit'>Disable Edit Mode</button>
              <button onClick={onPathEditModeToggle} className='enter'>Enable Path Editing Mode</button>
            </>
          ) : (
            <>
              {/* Path Editing Mode Active */}
              <button onClick={onPathEditModeToggle} className='exit'>Disable Path Editing Mode</button>
              <div>
                <h4>Selected Pins for Path</h4>
                <ul>
                  {selectedPins.map((pinId) => {
                    const pin = pins.find((p) => p.id === pinId);
                    return <li key={pinId}>{pin?.name || "Unnamed Pin"}</li>;
                  })}
                </ul>
                <button onClick={onCreatePath}>Create Path</button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* View Mode */}
          <button onClick={onEditModeToggle} className="enter">Enter Edit Mode</button>

          {/* Filter Section */}
          <div>
            <label>
              <p>Class Year:</p>
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
              <p>Year:</p>
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
    </div>
  );
};

export default ControlPanel;