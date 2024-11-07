import { useState } from 'react';
import './styles/App.css';
import MapComponent from './components/MapContainer';
import { locations } from './data/locations';
import { scavengerHuntSteps } from './data/scavengerHunt';

function App() {
  const [selectedYears, setSelectedYears] = useState<string[]>(['Freshman', 'Sophomore', 'Junior', 'Senior']);
  const [mapCenter, setMapCenter] = useState<[number, number]>(locations[0].coordinates);
  const [mapZoom, setMapZoom] = useState<number>(locations[0].zoom);
  const [currentHuntStep, setCurrentHuntStep] = useState<number>(0);
  const [huntCompleted, setHuntCompleted] = useState<boolean>(false);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false); // Editing mode state
  const [showPathModal, setShowPathModal] = useState(false); // Path creation modal state

  const currentClue = scavengerHuntSteps[currentHuntStep]?.clue;

  const handleBuildingClick = (buildingName: string) => {
    if (!isEditingMode && scavengerHuntSteps[currentHuntStep].targetBuilding === buildingName) {
      console.log(`Congrats! ${scavengerHuntSteps[currentHuntStep].reward}`);
      if (currentHuntStep + 1 < scavengerHuntSteps.length) {
        setCurrentHuntStep(currentHuntStep + 1);
      } else {
        setHuntCompleted(true);
      }
    } else if (!isEditingMode) {
      console.log("That's not the correct location. Keep looking!");
    }
  };

  const handleCheckboxChange = (year: string) => {
    setSelectedYears((prevYears) =>
      prevYears.includes(year) ? prevYears.filter((y) => y !== year) : [...prevYears, year]
    );
  };

  const handleLocationChange = (locationName: string) => {
    const location = locations.find((loc) => loc.name === locationName);
    if (location) {
      setMapCenter(location.coordinates);
      setMapZoom(location.zoom);
    }
  };

  const toggleEditingMode = () => {
    setIsEditingMode((prev) => !prev);
    if (isEditingMode) {
      setCurrentHuntStep(0);
      setHuntCompleted(false);
    }
  };

  const handleMakePathClick = () => {
    setShowPathModal(true); // Show path creation modal
  };

  return (
    <div className="App">
      <div className='body'>
        <div className="controls">
          <div className="filters">
            {['Freshman', 'Sophomore', 'Junior', 'Senior'].map((year) => (
              <label key={year}>
                <input
                  type="checkbox"
                  checked={selectedYears.includes(year)}
                  onChange={() => handleCheckboxChange(year)}
                />
                {year}
              </label>
            ))}
          </div>

          <div className="location-selector">
            <select onChange={(e) => handleLocationChange(e.target.value)}>
              {locations.map((loc) => (
                <option key={loc.name} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Editing Mode Toggle Button */}
          <button onClick={toggleEditingMode} className="editing-mode-toggle">
            {isEditingMode ? "Disable Editing Mode" : "Enable Editing Mode"}
          </button>
        </div>

        {!isEditingMode && (
          <div className="scavenger-hunt">
            {huntCompleted ? (
              <p>Congratulations! You've completed the scavenger hunt!</p>
            ) : (
              <p><strong>Clue:</strong> {currentClue}</p>
            )}
          </div>
        )}

        {isEditingMode && (
          <div className="editing-menu">
            <button onClick={handleMakePathClick}>Make Path</button>
          </div>
        )}

        <main>
          <MapComponent 
            selectedYears={selectedYears} 
            mapCenter={mapCenter} 
            mapZoom={mapZoom} 
            onBuildingClick={handleBuildingClick} 
            isEditingMode={isEditingMode} 
            showPathModal={showPathModal} // Control path modal visibility
            onMakePath={() => setShowPathModal(false)} // Function to close modal after saving path
          />
        </main>
      </div>

      <footer>
        <p>Made with ♡ in Providence</p>
      </footer>
    </div>
  );
}

export default App;