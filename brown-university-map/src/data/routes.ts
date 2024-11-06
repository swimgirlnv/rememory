interface Route {
    name: string;
    description: string;
    path: [number, number][];
    year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    media: {audioUrl?: string, videoUrl?: string};
  }
  
  export const routes: Route[] = [
    {
      name: 'Sayles Hall to John Hay Library',
      description: 'A scenic route from Sayles Hall to John Hay Library, passing through the Main Green.',
      path: [
        [41.8268, -71.4036], // Sayles Hall
        [41.8254, -71.4041], // John Hay Library
      ],
      year: 'Freshman',
      media: {audioUrl: 'https://www.example.com/audio1.mp3'},
    },
    {
      name: 'Library to Science Building',
      description: 'A path from the library to the science building, often taken for study sessions.',
      path: [
        [41.8254, -71.4041], // Library
        [41.8270, -71.4022], // Science Building
      ],
      year: 'Sophomore',
        media: {videoUrl: 'https://www.example.com/video1.mp4'},
    },
    // Add more routes for Junior and Senior years
  ];