import "./styles/App.css";
import MapContainer from "./components/MapContainer";

function App() {
  return (
    <div className="App">
      <div className="body">
        <main>
          <MapContainer />
        </main>
      </div>

      <footer>
        <p>Made with ♡ in Providence</p>
      </footer>
    </div>
  );
}

export default App;