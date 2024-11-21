import { useState } from "react";
import "./styles/App.css";
import MapContainer from "./components/MapContainer";
import { locations } from "./data/locations";

function App() {
  const [mapCenter, setMapCenter] = useState<[number, number]>(locations[0].coordinates);
  const [mapZoom, setMapZoom] = useState<number>(locations[0].zoom);

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
        <main>
          <MapContainer
            mapCenter={mapCenter}
            mapZoom={mapZoom}
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
