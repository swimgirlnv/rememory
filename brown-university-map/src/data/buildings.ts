interface Building {
    name: string;
    position: [number, number];
    memory: string;
    year: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    media?: {images?: string[]; videoUrl?: string; audioUrl?: string;};
  }
  
  export const buildings: Building[] = [
    { name: 'Sayles Hall', position: [41.826158527287994, -71.40281566471815], memory: 'Great Adventure', year: 'Junior' },
    { name: 'Sci Li', position: [41.82705892280546, -71.40018400863207], memory: 'Naked Donut Run', year: 'Sophomore' },
    { name: 'CIT', position: [41.827090228925854, -71.39958416259826], memory: 'CIT challenge', year: 'Senior' },
    { name: 'Main Green', position: [41.8266, -71.4020], memory: 'Senior year graduation ceremony.', year: 'Senior' },
    { name: 'Hillel', position: [41.82802217229307, -71.4033261070682], memory: "There is a damp hush settling over the room. The sound of shuffling feet and rustling clothes as we cram together in the stuffy space, a knee poking into a back here and an elbow jammed into a ribcage there. We shift uncomfortably for a moment, and out of the corner of our eyes, we catch a glimpse of quivering lips, of hands robotically moving to wipe away endless fast tears, of red red red eyes looking out upon the sea of bodies without really seeing us. They are searching for someone. And that someone is gone. Sweat beads on our necks as we wait and rolls slowly down our aching backs. We focus on that, trying not to keep looking at the tears slowly flooding the room, trying to keep our own thoughts on the present. The man in all white robes comes and informs us we will be moving to a different space because there isn’t enough room for everyone here. More and more people keep coming.", year: 'Sophomore' },
    { name: 'Katherine Moran Aquatic Center', position: [41.83033143131877, -71.3971432825428], memory: 'Poo', year: 'Freshman' },
    { name: 'Hegeman Hall', position: [41.825681871605966, -71.4005603063427], memory: 'Sophomore year dorm.', year: 'Sophomore' },
    { name: 'Hope College', position: [41.82680252687402, -71.40381810624025], memory: 'Freshman + Sophomore year dorm.', year: 'Freshman' },
    ];
