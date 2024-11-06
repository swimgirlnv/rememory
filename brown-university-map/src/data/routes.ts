interface Route {
    name: string;
    description: string;
    path: [number, number][];
    year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    media: {audioUrl?: string, videoUrl?: string};
  }
  
  export const routes: Route[] = [
    {
      name: 'Hope to Pool',
      description: 'A scenic route from Sayles Hall to John Hay Library, passing through the Main Green.',
      path: [
        [41.82680252687402, -71.40381810624025], // Hope
        [41.83033143131877, -71.3971432825428], // Pool
      ],
      year: 'Freshman',
      media: {audioUrl: 'https://music.youtube.com/watch?v=uaLV003llhY&si=DlXnSX7ogjXB0cBS'},
    },
    {
      name: 'Hegeman to Pool',
      description: 'A path from the library to the science building, often taken for study sessions.',
      path: [
        [41.825681871605966, -71.4005603063427], // Hegeman
        [41.83033143131877, -71.3971432825428], // Pool
      ],
      year: 'Sophomore',
        media: {videoUrl: 'https://www.example.com/video1.mp4'},
    },
    // Add more routes for Junior and Senior years
  ];