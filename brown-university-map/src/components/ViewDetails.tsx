import React from "react";

const ViewDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: { 
    name: string; 
    memory: string; 
    year: string | number; 
    classYear: string; 
    media?: string[]; 
    connectedMarkers?: string[]; 
  } | null;
}> = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close">X</button>
        <h2>{data.name}</h2>
        <p><strong>Year:</strong> {data.year}</p>
        <p><strong>Class Year:</strong> {data.classYear}</p>
        {/* Use dangerouslySetInnerHTML for memory */}
        <p><strong>Memory:</strong></p>
        <div
          dangerouslySetInnerHTML={{ __html: data.memory }}
          style={{ whiteSpace: "pre-wrap" }} // Ensure line breaks are respected
        />
        {data.media && data.media.length > 0 && (
        <>
            <h3>Media</h3>
            <div className="media-display">
            {data.media.map((url, index) => {
                const isImage = url.match(/\.(jpeg|jpg|gif|png)$/);
                const isVideo = url.match(/\.(mp4|mov|avi)$/);
                const isAudio = url.match(/\.(mp3|wav)$/);

                if (isImage) {
                return <img key={index} src={url} alt={`media-${index}`} style={{ maxWidth: "100%" }} />;
                } else if (isVideo) {
                return <video key={index} controls style={{ maxWidth: "100%" }}>
                    <source src={url} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>;
                } else if (isAudio) {
                return <audio key={index} controls>
                    <source src={url} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                </audio>;
                }
                return null;
            })}
            </div>
        </>
        )}
        {data.connectedMarkers && data.connectedMarkers.length > 0 && (
          <>
            <h3>Connected Markers</h3>
            <ul>
              {data.connectedMarkers.map((markerId, index) => (
                <li key={index}>{markerId}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewDetailsModal;