import React from "react";

const AboutModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>About This Project</h2>
        <div style={{textAlign:'left'}}>
        <p>
          Welcome to the <strong>Brown University Memory Map</strong>! This interactive map
          invites you to explore, add, and connect personal memories to meaningful campus locations.
        </p>
        <p>
          Use the control panel to:
          <ul>
            <li><strong>Add Markers:</strong> Enter edit mode to place markers on the map.</li>
            <li><strong>Create Paths:</strong> Enable path editing mode to connect markers.</li>
            <li><strong>Filter:</strong> Narrow down markers and paths by class year or specific years.</li>
          </ul>
        </p>
        <p>
          Each marker and path can include descriptive text, images, videos, or audio, transforming the map 
          into a multimedia storytelling platform. Routes between locations bring campus experiences to life, 
          allowing users to engage with the spaces through memories and stories.
        </p>
        <p>
          This project reimagines campus maps, blending place, memory, and media to create a dynamic, evolving tool 
          for storytelling, accessible online and perfect for campus tours or historical archives.
        </p>
        <h4>About Me</h4>
        <p>
          Hi, I'm <strong>Becca Waterson</strong>, the creator of this project! I'm a Senior passionate about combining 
          storytelling and technology to create meaningful experiences. This project is part of my final work for 
          <strong>ENGL 1050J: Multimedia Storytelling</strong> (Fall 2024).
        </p>
        <p>
          You can learn more about me or check out my other projects at:
        </p>
        <ul>
          <li><a href="https://github.com/swimgirlnv" target="_blank" rel="noopener noreferrer">My GitHub</a></li>
          <li><a href="https://swimgirlnv.github.io/portfolio/#/" target="_blank" rel="noopener noreferrer">My Portfolio</a></li>
        </ul>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default AboutModal;