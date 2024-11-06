import React from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface MapRouteProps {
  route: { path: [number, number][]; description: string };
  color: string;
}

const MapRoute: React.FC<MapRouteProps> = ({ route, color }) => {
  const path: LatLngExpression[] = route.path.map((coord) => [coord[0], coord[1]]);

  return (
    <Polyline positions={path} color={color} weight={5}>
      <Popup>{route.description}</Popup>
    </Polyline>
  );
};

export default MapRoute;