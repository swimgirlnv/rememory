import React from 'react';

interface ScavengerHuntProps {
  onComplete: (reward: string) => void;
}

const ScavengerHunt: React.FC<ScavengerHuntProps> = ({ onComplete }) => {
  // Component logic here
  return (
    <div>
      <h2>Scavenger Hunt</h2>
      {/* Interactive elements */}
    </div>
  );
};

export default ScavengerHunt;