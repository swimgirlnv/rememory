import React from 'react';

const ViewDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    memory: string;
    classYear: string;
    year: number;
    media: { images: string[]; videoUrl: string | null; audioUrl: string | null };
  } | null;
}> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const { name, memory, classYear, year, media } = data;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{name}</h2>
        <p><strong>Class Year:</strong> {classYear}</p>
        <p><strong>Year:</strong> {year}</p>
        <div>
          <strong>Memory:</strong>
          <div dangerouslySetInnerHTML={{ __html: memory || '' }} />
        </div>
        <div className="media-section">
          <h3>Media</h3>
          {/* Render images */}
          {media?.images?.length > 0 && (
            <div className="image-gallery">
              {media.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`media-${index}`}
                  style={{ maxWidth: '100px', margin: '5px' }}
                />
              ))}
            </div>
          )}
          {/* Render video */}
          {media?.videoUrl && (
            <div className="video-preview">
              <strong>Video:</strong>
              <video controls style={{ maxWidth: '100%' }}>
                <source src={media.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {/* Render audio */}
          {media?.audioUrl && (
            <div className="audio-preview">
              <strong>Audio:</strong>
              <audio controls>
                <source src={media.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewDetailsModal;