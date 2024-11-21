import React, { useEffect, useState } from 'react';
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
  const [name, setName] = useState('');
  const [memory, setMemory] = useState('');
  const [media, setMedia] = useState({
    images: [] as string[],
    videoUrl: null as string | null,
    audioUrl: null as string | null,
  });
  const [classYear, setClassYear] = useState('Freshman');
  const [year, setYear] = useState(new Date().getFullYear());
  const [isUploading, setIsUploading] = useState(false);

  // Populate fields with existing data when the modal opens
  useEffect(() => {
    if (data) {
      setName(data.name || '');
      setMemory(data.memory || '');
      setMedia({
        images: data.media.images || [],
        videoUrl: data.media.videoUrl || null,
        audioUrl: data.media.audioUrl || null,
      });
      setClassYear(data.classYear || 'Freshman');
      setYear(data.year || new Date().getFullYear());
    }
  }, [data]);

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

  const yearOptions = Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i); // Generate years

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Marker: {data.name}</h2>

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
        <TipTapEditor initialContent={memory} onUpdate={setMemory} />

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
          {media.images.map((url, index) => (
            <div key={index} className="media-item">
              <img src={url} alt={`media-${index}`} style={{ maxWidth: '100px', margin: '5px' }} />
            </div>
          ))}
          {media.videoUrl && (
            <div>
              <strong>Video:</strong>
              <video controls style={{ maxWidth: '100%' }}>
                <source src={media.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
          {media.audioUrl && (
            <div>
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