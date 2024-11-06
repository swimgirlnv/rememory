interface Building {
    name: string;
    position: [number, number];
    memory: string;
  }
  
  export const buildings: Building[] = [
    { name: 'Sayles Hall', position: [41.8268, -71.4036], memory: 'A beautiful space where we had our first orchestra concert.' },
    { name: 'John Hay Library', position: [41.8254, -71.4041], memory: 'Pulled an all-nighter here once, fueled by coffee and determination.' },
    // Add more buildings...
  ];