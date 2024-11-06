import React from 'react';
import './styles/App.css';
import MapComponent from './components/MapContainer';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Memory Map of Brown University</h1>
        <p>Click on the buildings to read memories from each location.</p>
      </header>
      
      <main>
        <MapComponent />
      </main>
      
      <footer>
        <p>Explore and uncover memories from around campus!</p>
      </footer>
    </div>
  );
}

export default App;