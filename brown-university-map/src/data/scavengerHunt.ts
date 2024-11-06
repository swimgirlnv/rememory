interface ScavengerHuntStep {
    clue: string;
    targetBuilding: string;
    reward: string; // Description of the reward or memory unlocked
  }
  
  export const scavengerHuntSteps: ScavengerHuntStep[] = [
    { clue: 'Find the hall where Brown’s orchestra performs its concerts.', targetBuilding: 'Sayles Hall', reward: 'You unlocked a memory about your first orchestra concert!' },
    { clue: 'Locate the library known for its massive quiet study rooms.', targetBuilding: 'John Hay Library', reward: 'You unlocked a memory about studying late into the night!' },
    // Add more steps as desired
  ];