import React from "react";
import "../styles/AboutModal.css";

const AboutModal: React.FC= () => {

  return (
    <div className="about-page">
      <div className="about-content">
        <h2>About This Project</h2>
        <div style={{textAlign:'left'}}>
        <p>
          Welcome to the <strong>Brown University Memory Map</strong>! This interactive map
          invites you to explore, add, and connect personal memories to meaningful locations related to Brown University.
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
        <h2>About Me</h2>
        <p>
          Hi, I'm <b>Becca Waterson</b>, the creator of this project! I'm a Senior passionate about combining 
          storytelling and technology to create meaningful experiences. This project is part of my final work for <strong>ENGL 1050J: Multimedia Storytelling</strong> (Fall 2024).
          I was inspired to explore the intersection of place and memory especially for students who's college experience may have been disrupted 
          by the pandemic. I wanted to create a space where people could share their stories and memories of Brown University, both as a literal location
          and as an institution that students have been apart of around the world.
        </p>
        <p>
          You can learn more about me or check out my other projects at:
        </p>
        <ul>
          <li><a href="https://github.com/swimgirlnv" target="_blank" rel="noopener noreferrer">My GitHub</a></li>
          <li><a href="https://swimgirlnv.github.io/portfolio/#/" target="_blank" rel="noopener noreferrer">My Portfolio</a></li>
        </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;