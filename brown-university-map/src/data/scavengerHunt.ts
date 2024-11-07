interface ScavengerHuntStep {
    clue: string;
    targetBuilding: string;
    reward: string; // Description of the reward or memory unlocked
  }
  
  export const scavengerHuntSteps: ScavengerHuntStep[] = [
    { clue: 'Towering monolith with a sweet smile.', targetBuilding: 'Sci Li', reward: 'You remember the first time you saw the Naked Donut run.' },
    { clue: 'Between this and a hard place... he kissed you there. You miss those late nights.', targetBuilding: 'Rock', reward: 'You cannot remember anyone else making you feel this way.' },
    // Add more steps as desired
  ];