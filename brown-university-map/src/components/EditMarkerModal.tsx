import React, { useState, useEffect } from "react";
import TipTapEditor from "./TipTapEditor";
import { MediaItem } from "../data/types";
import { db } from "../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { scanContentForModeration } from "./moderation";

const classYearOptions = [
  "--", "Freshman", "Sophomore", "Junior", "Senior",
  "Grad Year 1", "Grad Year 2", "Grad Year 3", "Grad Year 4",
  "Grad Year 5", "Alumni", "Faculty",
];

const EditMarkerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    id: string;
    name: string;
    memory: string;
    media: MediaItem[];
    classYear: string;
    year: number;
    createdBy: string;
    tags: string[];
  }) => void;
  onDelete: () => void;
  data: {
    id: string;
    name: string;
    memory: string;
    media: MediaItem[];
    classYear: string;
    year: number;
    createdBy: string;
    tags: string[];
  } | null;
}> = ({ isOpen, onClose, onSave, onDelete, data }) => {
  const [name, setName] = useState("");
  const [memory, setMemory] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [classYear, setClassYear] = useState("--");
  const [year, setYear] = useState(new Date().getFullYear());
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setMemory(data.memory);
      setMedia(data.media || []);
      setClassYear(data.classYear);
      setYear(data.year);
      setTags(data.tags);
    }
  }, [data]);

  useEffect(() => {
    const fetchTags = async () => {
      const querySnapshot = await getDocs(collection(db, "tags"));
      const tags = querySnapshot.docs.map((doc) => doc.data().name);
      setAllTags(tags);
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (memory) {
      const uniqueWords = Array.from(
        new Set(
          memory
            .toLowerCase()
            .replace(/[^a-z\s]/g, "")
            .split(" ")
            .filter((word) => word.length > 4)
        )
      );
      const suggestions = [...uniqueWords, ...allTags]
        .filter((tag, index, self) => self.indexOf(tag) === index)
        .slice(0, 5);
      setSuggestedTags(suggestions);
    }
  }, [memory, allTags]);

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || !data?.id) return;
    setIsUploading(true);

    try {
      const uploadedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          const storage = getStorage();
          const storageRef = ref(storage, `media/markers/${data.id}/${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!data?.id) return;

    const moderationResult = await scanContentForModeration(memory);
    if (moderationResult.flagged) {
      alert(`Your content was flagged for moderation. Reasons: ${moderationResult.reasons?.join(", ")}`);
      return;
    }

    onSave({ id: data.id, name, memory, media, classYear, year, createdBy: data.createdBy, tags });
    onClose();
  };

  const handleDeleteFile = async (fileUrl: string) => {
    if (!data?.id) return;

    try {
      const storage = getStorage();
      await deleteObject(ref(storage, fileUrl));
      setMedia((prev) => prev.filter((item) => item.url !== fileUrl));
      await updateDoc(doc(db, "markers", data.id), { media });
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handleAddTag = async (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");

      if (!allTags.includes(tag)) {
        await addDoc(collection(db, "tags"), { name: tag, usageCount: 1 });
      }
    }
  };

  const handleRemoveTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Marker: {name}</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <TipTapEditor initialContent={memory} onUpdate={setMemory} />
        <select value={classYear} onChange={(e) => setClassYear(e.target.value)}>
          {classYearOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} placeholder="Year" />

        <h3>Tags</h3>
        <div className="tags-container">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag} <button onClick={() => handleRemoveTag(tag)}>×</button>
            </span>
          ))}
        </div>

        <h4>Suggested Tags</h4>
        {suggestedTags.map((tag) => (
          <button key={tag} onClick={() => handleAddTag(tag)}>{tag}</button>
        ))}

        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAddTag(tagInput)}
          placeholder="Add tag"
        />

        <h3>Media</h3>
        <input type="file" multiple onChange={(e) => handleMediaUpload(e.target.files)} />
        {isUploading && <p>Uploading...</p>}
        {media.length > 0 && (
          <div className="media-preview">
            {media.map((item, index) => (
              <div key={index}>
                {item.type === "image" && <img src={item.url} alt={`media-${index}`} />}
                {item.type === "video" && <video controls src={item.url} />}
                {item.type === "audio" && <audio controls src={item.url} />}
                <button onClick={() => handleDeleteFile(item.url)}>Delete</button>
              </div>
            ))}
          </div>
        )}

        <button className='save' onClick={handleSave}>Save</button>
        <button className='delete' onClick={onDelete}>Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditMarkerModal;