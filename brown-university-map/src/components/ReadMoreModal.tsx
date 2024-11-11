// ReadMoreModal.tsx

import React from 'react';
import '../styles/ReadMoreModal.css';

interface ReadMoreModalProps {
  title: string;
  content: string;
  media?: {
    imageUrl?: string;
    videoUrl?: string;
    audioUrl?: string;
  };
  onClose: () => void;
}

const ReadMoreModal: React.FC<ReadMoreModalProps> = ({ title, content, media, onClose }) => {
  return (
    <div className="read-more-overlay" onClick={onClose}>
      <div
        className="read-more-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="read-more-header">{title}</h2>

        {/* Scrollable content section */}
        <div className="read-more-text" dangerouslySetInnerHTML={{ __html: content }} />

        {/* Display media if available */}
        {media?.imageUrl && (
          <img
            src={media.imageUrl}
            alt="Image"
            className="read-more-image"
          />
        )}
        {media?.videoUrl && (
          <video
            src={media.videoUrl}
            controls
            className="read-more-video"
          />
        )}
        {media?.audioUrl && (
          <audio
            src={media.audioUrl}
            controls
            className="read-more-audio"
          />
        )}

        <button className="read-more-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ReadMoreModal;