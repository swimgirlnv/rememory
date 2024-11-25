/* eslint-disable @typescript-eslint/no-explicit-any */
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import React from "react";
import { useMap } from "react-leaflet";
import "leaflet-geosearch/dist/geosearch.css";


const GeoSearch = () => {
    const map = useMap();
  
    React.useEffect(() => {
      const provider = new OpenStreetMapProvider();
  
      const searchControl = new (GeoSearchControl as any)({
        provider,
        style: "bar",
        showMarker: false,
        retainZoomLevel: false,
        animateZoom: true,
      });
  
      map.addControl(searchControl);
  
      return () => {
        map.removeControl(searchControl);
      };
    }, [map]);
  
    return null;
  };

export default GeoSearch;