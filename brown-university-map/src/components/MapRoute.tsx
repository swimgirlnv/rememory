import React from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { PathData, MarkerData } from '../data/types';

interface MapRouteProps {
    isEditMode: boolean;
    path: PathData;
    markers: MarkerData[];  // Array of all markers with their coordinates
    filterYear: Date | null;
    filterClassYear: string | null;
}

const MapRoute: React.FC<MapRouteProps> = ({ isEditMode, path, markers, filterYear, filterClassYear }) => {
    if (!path || !path.markers) return null;

    // Filter route based on Year and ClassYear
    const isVisible =
        (!filterYear || path.year.getFullYear() === filterYear.getFullYear()) &&
        (!filterClassYear || path.classYear === filterClassYear);

    // Convert marker IDs in `path.markers` to LatLngTuple coordinates
    const routeCoordinates: LatLngTuple[] = path.markers
        .map(markerId => {
            const marker = markers.find(m => m.id === markerId);  // Find the marker by ID
            return marker ? [marker.lat, marker.lng] as LatLngTuple : null;  // Convert to LatLngTuple if found
        })
        .filter(coord => coord !== null) as LatLngTuple[];  // Filter out any null values

    return isVisible ? (
        <Polyline positions={routeCoordinates} color="blue">
            <Popup>
                <strong>Path Information</strong>
                <p>{path.memory}</p>
                {isEditMode && <p>Click to edit</p>}
            </Popup>
        </Polyline>
    ) : null;
};

export default MapRoute;