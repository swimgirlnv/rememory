import React, { useState } from 'react';
import TipTapEditor from './TipTapEditor';
import uploadFile from './FirebaseUploader';

const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: { name: string; memory: string; media: string[] }) => void;
  data: { id: string; name: string; memory: string; media: string[] } | null;
}> = ({ isOpen, onClose, onSave, data }) => {
  const [name, setName] = useState(data?.name || "");
  const [memory, setMemory] = useState(data?.memory || "");
  const [media, setMedia] = useState<string[]>(data?.media || []);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      console.error("No files selected for upload.");
      return;
    }
  
    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map(async (file) => {
          const existingUrl = media.find((url) => url.includes(file.name));
          return existingUrl || (await uploadFile(file));
        })
      );
      setMedia((prev) => [...new Set([...prev, ...uploadedUrls])]); // Avoid duplicates
    } catch (error) {
      console.error("Media upload failed:", error);
    }
  };

  const handleSave = () => {
    onSave({ name, memory, media });
  };


  if (!isOpen || !data) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit {data.name}</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={data.name}
        />
        <TipTapEditor initialContent={data.memory} onUpdate={setMemory} />
        <h3>Upload Media</h3>
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={(e) => handleMediaUpload(e.target.files)}
        />
        {isUploading && <p>Uploading...</p>}
        <div className="media-preview">
          {media.map((url, index) => (
            <div key={index} className="media-item">
              <img src={url} alt={`media-${index}`} style={{ maxWidth: "100px" }} />
            </div>
          ))}
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditModal;
