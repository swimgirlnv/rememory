import React, { useState } from 'react';
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

  const currentClue = scavengerHuntSteps[currentHuntStep]?.clue;

  const handleBuildingClick = (buildingName: string) => {
    if (scavengerHuntSteps[currentHuntStep].targetBuilding === buildingName) {
      alert(`Congrats! ${scavengerHuntSteps[currentHuntStep].reward}`);
      if (currentHuntStep + 1 < scavengerHuntSteps.length) {
        setCurrentHuntStep(currentHuntStep + 1);
      } else {
        setHuntCompleted(true);
      }
    } else {
      alert("That's not the correct location. Keep looking!");
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

  return (
    <div className="App">
      {/* <header>
        <h3>Remembering and Re-Memory</h3>
      </header> */}

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
        </div>

        <div className="scavenger-hunt">
        {huntCompleted ? (
          <p>Congratulations! You've completed the scavenger hunt!</p>
        ) : (
          <p><strong>Clue:</strong> {currentClue}</p>
        )}
      </div>

      <main>
        <MapComponent 
          selectedYears={selectedYears} 
          mapCenter={mapCenter} 
          mapZoom={mapZoom} 
          onBuildingClick={handleBuildingClick} 
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