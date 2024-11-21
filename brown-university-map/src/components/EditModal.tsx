import React, { useState } from 'react';
import TipTapEditor from './TipTapEditor';
import uploadFile from './FirebaseUploader';

const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    name: string;
    memory: string;
    media: { images: string[]; videoUrl: string | null; audioUrl: string | null };
    classYear: string;
    year: number;
  }) => void;
  data: {
    id: string;
    name: string;
    memory: string;
    media: { images: string[]; videoUrl: string | null; audioUrl: string | null };
    classYear: string;
    year: number;
  } | null;
}> = ({ isOpen, onClose, onSave, data }) => {
  const [name, setName] = useState(data?.name || '');
  const [memory, setMemory] = useState(data?.memory || '');
  const [media, setMedia] = useState({
    images: data?.media?.images || [],
    videoUrl: data?.media?.videoUrl || null,
    audioUrl: data?.media?.audioUrl || null,
  });
  const [classYear, setClassYear] = useState(data?.classYear || 'Freshman');
  const [year, setYear] = useState(data?.year || new Date().getFullYear());
  const [isUploading, setIsUploading] = useState(false);

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.error('No files selected for upload.');
      return;
    }

    try {
      setIsUploading(true);
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const existingUrl = media.images.find((url) => url.includes(file.name));
          return existingUrl || (await uploadFile(file));
        })
      );
      setMedia((prev) => ({
        ...prev,
        images: [...new Set([...prev.images, ...uploadedUrls])], // Avoid duplicates
      }));
    } catch (error) {
      console.error('Media upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    onSave({ name, memory, media, classYear, year });
    onClose(); // Close the modal after saving
  };

  if (!isOpen || !data) return null;

  const classYearOptions = [
    'Freshman',
    'Sophomore',
    'Junior',
    'Senior',
    'Grad First Year',
    'Grad Second Year',
    'Grad Third Year',
    'Grad Fourth Year',
    'Grad Fifth Year',
    'Alumni',
  ];

  const yearOptions = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i); // Generate years from current year back to 150 years ago

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit {data.name}</h2>

        {/* Name Input */}
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </label>

        {/* TipTap Editor for Memory */}
        <TipTapEditor initialContent={data.memory} onUpdate={setMemory} />

        {/* Class Year Dropdown */}
        <label>
          Class Year:
          <select value={classYear} onChange={(e) => setClassYear(e.target.value)}>
            {classYearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Year Dropdown */}
        <label>
          Year:
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {yearOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {/* Media Upload Section */}
        <h3>Upload Media</h3>
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={(e) => handleMediaUpload(e.target.files)}
        />
        {isUploading && <p>Uploading...</p>}

        {/* Media Preview */}
        <div className="media-preview">
          {/* Display images */}
          {media.images.length > 0 &&
            media.images.map((url, index) => (
              <div key={index} className="media-item">
                <img src={url} alt={`media-${index}`} style={{ maxWidth: '100px', margin: '5px' }} />
              </div>
            ))}
          {/* Display video */}
          {media.videoUrl && (
            <div className="video-preview">
              <strong>Video:</strong>
              <video controls style={{ maxWidth: '100%' }}>
                <source src={media.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {/* Display audio */}
          {media.audioUrl && (
            <div className="audio-preview">
              <strong>Audio:</strong>
              <audio controls>
                <source src={media.audioUrl} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}
        </div>

        {/* Save and Cancel Buttons */}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditModal;