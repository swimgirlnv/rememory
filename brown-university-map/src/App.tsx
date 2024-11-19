import React, { useState } from "react";
import "./styles/App.css";
import MapContainer from "./components/MapContainer";
import { locations } from "./data/locations";
import { scavengerHuntSteps } from "./data/scavengerHunt";

function App() {
  const [mapCenter, setMapCenter] = useState<[number, number]>(locations[0].coordinates);
  const [mapZoom, setMapZoom] = useState<number>(locations[0].zoom);
  const [currentHuntStep, setCurrentHuntStep] = useState<number>(0);
  const [huntCompleted, setHuntCompleted] = useState<boolean>(false);

  const currentClue = scavengerHuntSteps[currentHuntStep]?.clue;

  const handleBuildingClick = (buildingName: string) => {
    if (scavengerHuntSteps[currentHuntStep].targetBuilding === buildingName) {
      console.log(`Congrats! ${scavengerHuntSteps[currentHuntStep].reward}`);
      if (currentHuntStep + 1 < scavengerHuntSteps.length) {
        setCurrentHuntStep(currentHuntStep + 1);
      } else {
        setHuntCompleted(true);
      }
    } else {
      console.log("That's not the correct location. Keep looking!");
    }
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
      <div className="body">
        <div className="scavenger-hunt">
          {huntCompleted ? (
            <p>Congratulations! You've completed the scavenger hunt!</p>
          ) : (
            <p><strong>Clue:</strong> {currentClue}</p>
          )}
        </div>

        <main>
          <MapContainer
            mapCenter={mapCenter}
            mapZoom={mapZoom}
            onBuildingClick={handleBuildingClick}
            onLocationChange={handleLocationChange}
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
