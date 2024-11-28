import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const ViewDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    memory: string;
    classYear: string;
    year: number;
    media: { images: string[]; videoUrl: string | null; audioUrl: string | null };
    tags?: string[];
  } | null;
}> = ({ isOpen, onClose, data }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0); // Index of the image to open in the lightbox

  if (!isOpen || !data) return null;

  const { name, memory, classYear, year, media, tags } = data;

  console.log("Data passed to ViewDetailsModal:", data);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{name || "No Name Available"}</h2>
        <p>
          <strong>{classYear || "N/A"}, {year || "N/A"}</strong>
        </p>
        <div style={{ textAlign: "left" }}>
          <div dangerouslySetInnerHTML={{ __html: memory || "<p>No memory available.</p>" }} />
        </div>

        {/* Tags Section */}
        {tags && tags.length > 0 && (
          <div className="tags-section">
            <h4>Tags</h4>
            <div className="tags-container">
              {tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="media-section">
          {/* Render images */}
          {media.images?.length > 0 ? (
            <div className="image-gallery">
              {media.images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`media-${index}`}
                  style={{ maxWidth: "100px", margin: "5px", cursor: "pointer" }}
                  onClick={() => {
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <></>
          )}
          {/* Render video */}
          {media.videoUrl ? (
            <div className="video-preview">
              <strong>Video:</strong>
              <video controls style={{ maxWidth: "100%" }}>
                <source src={media.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <></>
          )}
          {/* Render audio */}
          {media.audioUrl ? (
            <div className="audio-preview">
              <strong>Audio:</strong>
              <audio controls>
                <source src={media.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          ) : (
            <></>
          )}
        </div>
        <button onClick={onClose}>Close</button>
      </div>

      {/* Lightbox for enlarged images */}
      {media.images?.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={media.images.map((url) => ({ src: url }))}
          index={lightboxIndex}
        />
      )}
    </div>
  );
};

export default ViewDetailsModal;