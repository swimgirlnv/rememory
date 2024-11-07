interface Location {
    name: string;
    coordinates: [number, number];
    zoom: number;
  }
  
  export const locations: Location[] = [
    { name: 'Brown University', coordinates: [41.8268, -71.4025], zoom: 15 },
    { name: 'San Francisco', coordinates: [37.7749, -122.4194], zoom: 12 },
    { name: 'Lake Tahoe', coordinates: [39.0968, -120.0324], zoom: 10 },
    { name: 'Boston', coordinates: [42.3601, -71.0589], zoom: 13 },
    { name: 'UCLA', coordinates: [34.0689, -118.4452], zoom: 15 },
    { name: 'Sacramento', coordinates: [38.5816, -121.4944], zoom: 12 },
    { name: 'Coronado', coordinates: [32.6859, -117.1831], zoom: 13 },
  ];