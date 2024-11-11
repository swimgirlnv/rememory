import { useState, useEffect } from 'react';
import './styles/App.css';
import { locations } from './data/locations';
import { scavengerHuntSteps } from './data/scavengerHunt';
import PathCreationModal from './components/PathCreationModal';
import { db } from '../firebaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import InteractiveMap from './components/InteractiveMap';

function App() {
  const [selectedYears, setSelectedYears] = useState<string[]>(['Freshman', 'Sophomore', 'Junior', 'Senior']);
  const [mapCenter, setMapCenter] = useState<[number, number]>(locations[0].coordinates);
  const [mapZoom, setMapZoom] = useState<number>(locations[0].zoom);
  const [currentHuntStep, setCurrentHuntStep] = useState<number>(0);
  const [huntCompleted, setHuntCompleted] = useState<boolean>(false);
  const [isEditingMode, setIsEditingMode] = useState<boolean>(false);
  const [showPathModal, setShowPathModal] = useState(false);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]); // Track selected marker IDs

  const currentClue = scavengerHuntSteps[currentHuntStep]?.clue;

  const [markers, setMarkers] = useState<any[]>([]);

    useEffect(() => {
        // Fetch markers from Firestore on component mount
        const fetchMarkers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'markers'));
                const markersData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMarkers(markersData);
            } catch (error) {
                console.error('Error fetching markers: ', error);
            }
        };

        fetchMarkers();
    }, []);

  const [paths, setPaths] = useState<any[]>([]);
  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'paths'));
        const pathsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPaths(pathsData);
      } catch (error) {
        console.error('Error fetching paths: ', error);
      }
    };

    fetchPaths();
  }, []);

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
      setSelectedMarkers([]);
    }
  };

  const handleMakePathClick = () => {
    setShowPathModal(true);
  };

  const handleMarkerSelect = (markerId: string) => {
    setSelectedMarkers((prev) =>
      prev.includes(markerId) ? prev.filter((id) => id !== markerId) : [...prev, markerId]
    );
  };

  const handleSavePath = async (name: string, memory: string, year: string) => {
    try {
      const pathCoordinates = selectedMarkers.map(id => {
        const marker = markers.find(m => m.id === id); // Assumes markers state is available with lat/lng info
        return marker ? { lat: marker.position[0], lng: marker.position[1] } : null;
      }).filter(coord => coord !== null);

      const pathData = { name, memory, year, coordinates: pathCoordinates };
      const docRef = await addDoc(collection(db, 'paths'), pathData);
      console.log(`Path saved with ID: ${docRef.id}`);
    } catch (error) {
      console.error("Error saving path:", error);
    }
    setShowPathModal(false);
  };

  return (
    <div className="App">
      <div className='body'>
        <div className="controls">
          <button onClick={toggleEditingMode} className="editing-mode-toggle">
            {isEditingMode ? "Switch to View Mode" : "Switch to Edit Mode"}
          </button>
        </div>

        {!isEditingMode && (
          <>
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
          
          <div className="scavenger-hunt">
            {huntCompleted ? (
              <p>Congratulations! You've completed the scavenger hunt!</p>
            ) : (
              <p><strong>Clue:</strong> {currentClue}</p>
            )}
          </div>
          </>
        )}

        {isEditingMode && (
          <div className="editing-menu">
            <button onClick={handleMakePathClick}>Make Path</button>
          </div>
        )}

        <main>
          {/* <MapComponent 
            selectedYears={selectedYears} 
            mapCenter={mapCenter} 
            mapZoom={mapZoom} 
            onBuildingClick={handleBuildingClick} 
            isEditingMode={isEditingMode} 
            selectedMarkers={selectedMarkers} 
            onMarkerSelect={handleMarkerSelect}
          /> */}
          <InteractiveMap mapCenter={mapCenter} mapZoom={mapZoom} isEditMode={isEditingMode} markers={markers} setMarkers={setMarkers} paths={paths} setPaths={setPaths} />
        </main>
      </div>

      {showPathModal && (
        <PathCreationModal 
          onSave={handleSavePath} 
          onClose={() => setShowPathModal(false)} 
        />
      )}

      <footer>
        <p>Made with ♡ in Providence</p>
      </footer>
    </div>
  );
}

export default App;