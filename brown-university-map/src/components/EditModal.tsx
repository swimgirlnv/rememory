import React, { useState, useEffect } from "react";
import TipTapEditor from "./TipTapEditor";
import uploadFile from "./FirebaseUploader";
import { MediaItem } from "../data/types";

const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    name: string;
    memory: string;
    media: MediaItem[];
    classYear: string;
    year: number;
  }) => void;
  data: {
    id: string;
    name: string;
    memory: string;
    media: MediaItem[];
    classYear: string;
    year: number;
  } | null;
}> = ({ isOpen, onClose, onSave, data }) => {
  const [name, setName] = useState("");
  const [memory, setMemory] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [classYear, setClassYear] = useState("Freshman");
  const [year, setYear] = useState(new Date().getFullYear());
  const [isUploading, setIsUploading] = useState(false);

  // Populate fields when modal opens
  useEffect(() => {
    if (data) {
      console.log("Data received in EditModal:", data); // Debug log
      setName(data.name);
      setMemory(data.memory);
      setMedia(data.media || []);
      setClassYear(data.classYear);
      setYear(data.year);
    }
  }, [data]);

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          const url = await uploadFile(file);
          const type = file.type.startsWith("image")
            ? "image"
            : file.type.startsWith("video")
            ? "video"
            : file.type.startsWith("audio")
            ? "audio"
            : "unknown";
          return { url, type } as MediaItem;
        })
      );
      setMedia((prev) => [...prev, ...uploadedFiles]);
    } catch (error) {
      console.error("Error uploading media:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    onSave({ name, memory, media, classYear, year });
    onClose();
  };

  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit {name}</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <TipTapEditor initialContent={memory} onUpdate={setMemory} />
        <label>
          Class Year:
          <input type="text" value={classYear} onChange={(e) => setClassYear(e.target.value)} />
        </label>
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </label>
        <div>
          <h3>Media</h3>
          <input type="file" multiple onChange={(e) => handleMediaUpload(e.target.files)} />
          {isUploading && <p>Uploading...</p>}
          <div className="media-preview">
            {media.map((item, index) => (
              <div key={index}>
                {item.type === "image" && (
                  <img
                    src={item.url}
                    alt={`media-${index}`}
                    style={{ maxWidth: "100px", margin: "5px" }}
                  />
                )}
                {item.type === "video" && (
                  <video controls style={{ maxWidth: "100px", margin: "5px" }}>
                    <source src={item.url} />
                  </video>
                )}
                {item.type === "audio" && (
                  <audio controls>
                    <source src={item.url} />
                  </audio>
                )}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditModal;