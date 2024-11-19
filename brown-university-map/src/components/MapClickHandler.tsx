import { useMapEvents } from 'react-leaflet';

interface MapClickHandlerProps {
  isEditMode: boolean;
  setNewMarker: (lat: number, lng: number) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ isEditMode, setNewMarker }) => {
  useMapEvents({
    click: (event) => {
      if (isEditMode) {
        const { lat, lng } = event.latlng; // Extract latitude and longitude from the map click event
        setNewMarker(lat, lng);
      }
    },
  });

  return null; // This component does not render anything; it just handles events
};

export default MapClickHandler;