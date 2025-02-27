import React, { useState } from "react";
import { MarkerData, PinData } from "../data/types";
import "../styles/ControlPanel.css";

const ControlPanel: React.FC<{
  isEditingMode: boolean;
  isPathEditMode: boolean;
  selectedPins: string[];
  pins: PinData[];
  markers: MarkerData[];
  mapVisibility: "public" | "private";
  onFilter: (filter: { classYear?: string; year?: number }) => void;
  onEditModeToggle: () => void;
  onPathEditModeToggle: () => void;
  onCreatePath: () => void;
  onToggleVisibility: () => void;
}> = ({
  isEditingMode,
  isPathEditMode,
  selectedPins,
  pins,
  // markers,
  mapVisibility,
  onFilter,
  onEditModeToggle,
  onPathEditModeToggle,
  onCreatePath,
  onToggleVisibility,
}) => {
  const [classYear, setClassYear] = useState<string | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilter = () => onFilter({ classYear, year });

  return (
    <div className="control-panel-container">
      {/* Toggle Expand/Collapse */}
      <button className="expand-button" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? (
          <>
            Hide Controls
          </>
        ) : (
          <>
            Show Controls
          </>
        )}
      </button>

      {/* Control Panel Content */}
      <div className={`control-panel ${isExpanded ? "expanded" : "collapsed"}`}>
        <div className="visibility-toggle">
          <p>Map Visibility:</p>
          <button onClick={onToggleVisibility} className={`visibility-button ${mapVisibility}`}>
            {mapVisibility === "public" ? "Make Private" : "Make Public"}
          </button>
        </div>

        {isEditingMode ? (
          isPathEditMode ? (
            <div className="path-edit-mode">
              <button onClick={onPathEditModeToggle} className="toggle-button">
                Disable Path Editing
              </button>
              <h4>Selected Pins for Path</h4>
              <ul className="pin-list">
                {selectedPins.map((pinId) => {
                  const pin = pins.find((p) => p.id === pinId);
                  return <li key={pinId}>{pin?.name || "Unnamed Pin"}</li>;
                })}
              </ul>
              <button onClick={onCreatePath} className="create-path-button">
                Create Path
              </button>
            </div>
          ) : (
            <div className="edit-mode">
              <button onClick={onEditModeToggle} className="toggle-button">
                Disable Edit Mode
              </button>
              <button onClick={onPathEditModeToggle} className="toggle-button">
                Enable Path Editing
              </button>
            </div>
          )
        ) : (
          <div className="view-mode">
            <button onClick={onEditModeToggle} className="toggle-button">
              Enter Edit Mode
            </button>
            <div className="filter-section">
              <label>
                <p>Class Year:</p>
                <select
                  value={classYear || ""}
                  onChange={(e) => setClassYear(e.target.value || undefined)}
                >
                  <option value="">--</option>
                  {["Freshman", "Sophomore", "Junior", "Senior", "Alumni", "Faculty"].map((option) => (
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
              <button onClick={handleFilter} className="filter-button">
                Apply Filter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;