interface Building {
    name: string;
    position: [number, number];
    memory: string;
    year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    media?: {images?: string[]; videoUrl?: string; audioUrl?: string;};
  }
  
  export const buildings: Building[] = [
    { name: 'Sayles Hall', position: [41.8268, -71.4036], memory: 'Freshman orchestra concert.', year: 'Freshman' },
    { name: 'John Hay Library', position: [41.8254, -71.4041], memory: 'All-nighter study session.', year: 'Sophomore' },
    { name: 'Science Building', position: [41.8270, -71.4022], memory: 'Junior year research project.', year: 'Junior' },
    { name: 'Main Green', position: [41.8266, -71.4020], memory: 'Senior year graduation ceremony.', year: 'Senior' },
    { name: 'Hillel', position: [41.82802217229307, -71.4033261070682], memory: "There is a damp hush settling over the room. The sound of shuffling feet and rustling clothes as we cram together in the stuffy space, a knee poking into a back here and an elbow jammed into a ribcage there. We shift uncomfortably for a moment, and out of the corner of our eyes, we catch a glimpse of quivering lips, of hands robotically moving to wipe away endless fast tears, of red red red eyes looking out upon the sea of bodies without really seeing us. They are searching for someone. And that someone is gone. Sweat beads on our necks as we wait and rolls slowly down our aching backs. We focus on that, trying not to keep looking at the tears slowly flooding the room, trying to keep our own thoughts on the present. The man in all white robes comes and informs us we will be moving to a different space because there isn’t enough room for everyone here. More and more people keep coming.", year: 'Sophomore' },
    { name: 'Pembroke Hall', position: [41.8268, -71.4013], memory: 'Freshman year orientation.', year: 'Freshman' },
    { name: 'Hegeman Hall', position: [41.825681871605966, -71.4005603063427], memory: 'Sophomore year dorm.', year: 'Sophomore' },
    { name: 'Granoff Center', position: [41.8264, -71.4015], memory: 'Junior year film screening.', year: 'Junior' },
    { name: 'Metcalf Research Lab', position: [41.8274, -71.4021], memory: 'Senior year thesis defense.', year: 'Senior' },
    ];
