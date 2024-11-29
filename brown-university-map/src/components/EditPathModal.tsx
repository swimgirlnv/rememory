import React, { useState, useEffect } from "react";
import TipTapEditor from "./TipTapEditor";
import { MediaItem } from "../data/types";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";

const EditPathModal: React.FC<{
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
    pins: string[];
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
    pins: string[];
  } | null;
}> = ({ isOpen, onClose, onSave, onDelete, data }) => {
  const [name, setName] = useState(data?.name || "");
  const [memory, setMemory] = useState(data?.memory || "");
  const [media, setMedia] = useState<MediaItem[]>(data?.media || []);
  const [classYear, setClassYear] = useState(data?.classYear || "--");
  const [year, setYear] = useState(data?.year || new Date().getFullYear());
  const [createdBy, setCreatedBy] = useState(data?.createdBy || "");
  const [pins, setPins] = useState<string[]>(data?.pins || []);
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState<string[]>(data?.tags || []);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tagSearch] = useState<string>("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

console.log(createdBy);
  const classYearOptions = [
    "--",
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Grad Year 1",
    "Grad Year 2",
    "Grad Year 3",
    "Grad Year 4",
    "Grad Year 5",
    "Alumni",
  ];

  useEffect(() => {
    if (data) {
      console.log("Data received in EditModal:", data);
      setName(data.name);
      setMemory(data.memory);
      setMedia(data.media || []); // Default to empty array if undefined
      setClassYear(data.classYear);
      setYear(data.year);
      setCreatedBy(data.createdBy);
      setTags(data.tags);
      setPins(data.pins);
    }
  }, [data]);

  useEffect(() => {
    if (memory) {
      const words = memory
        .toLowerCase()
        .replace(/[^a-z\s]/g, "") // Remove special characters
        .split(" ")
        .filter((word) => word.length > 4); // Filter out short words
      const uniqueWords = Array.from(new Set(words)); // Remove duplicates
  
      // Suggest top 5 unique words combined with popular existing tags
      const combinedSuggestions = [...uniqueWords, ...allTags]
        .filter((tag, index, self) => self.indexOf(tag) === index) // Ensure uniqueness
        .slice(0, 5); // Limit to 5 suggestions
  
      setSuggestedTags(combinedSuggestions);
    }
  }, [memory, allTags]);

  useEffect(() => {
    const fetchTags = async () => {
      const querySnapshot = await getDocs(collection(db, "tags"));
      const allTags = querySnapshot.docs.map((doc) => doc.data().name);
      setAllTags(allTags);
    };
    fetchTags();
  }, []);

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || !data?.id) return;
    setIsUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          const storage = getStorage();
          const storageRef = ref(storage, `media/paths/${data.id}/${file.name}`);
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

  const handleSave = () => {
    if (!data?.id || !data.createdBy) {
      console.error("Missing required fields: id or createdBy");
      return;
    }

    const updatedData = {
      id: data.id,
      name,
      memory,
      media,
      classYear,
      year,
      createdBy: data.createdBy,
      tags,
      pins,
    };

    onSave(updatedData);
    onClose();
  };

  if (!isOpen || !data) return null;

  const handleDeleteFile = async (fileUrl: string) => {
    if (!data?.id) {
      console.error("Marker ID is not available.");
      return;
    }
  
    try {
      const storage = getStorage();
      const fileRef = ref(storage, fileUrl); // Reference the file
      await deleteObject(fileRef); // Delete the file from storage
  
      console.log("File deleted successfully:", fileUrl);
  
      // Update marker's media list after deletion
      const updatedMedia = media.filter((item) => item.url !== fileUrl);
      setMedia(updatedMedia); // Update local state
  
      const markerDocRef = doc(db, "markers", data.id); // Reference Firestore document
      await updateDoc(markerDocRef, { media: updatedMedia });
  
      console.log("Marker media updated in Firestore.");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handleAddTag = async (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput(""); // Clear the input after adding
      const existingTag = allTags.find((t) => t === tag);
  
      if (!existingTag) {
        await addDoc(collection(db, "tags"), { name: tag, usageCount: 1 }); // Add new tag to Firestore only if it doesn't exist
      }
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Path: {name}</h2>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <TipTapEditor initialContent={memory} onUpdate={setMemory} />
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
        <label>
          Year:
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} />
        </label>
        <div>
          <h3>Pins</h3>
          <p>{pins.join(", ")}</p>
        </div>
        <div>
          <h3>Tags</h3>

          {/* Existing Tags */}
          <div className="tags-container">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button onClick={() => handleRemoveTag(tag)}>×</button>
              </span>
            ))}
          </div>

          {/* Suggested Tags */}
          <div className="suggested-tags">
            <h4>Suggested Tags</h4>
            {suggestedTags.map((tag, index) => (
              <button
                key={index}
                className="suggested-tag"
                onClick={() => handleAddTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search/Create Tags */}
          <div className="tag-search">
            <h4>Search or Add Tags</h4>
            <input
              type="text"
              placeholder="Search or create a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddTag(tagInput)}
            />
            <div className="tag-results">
              {filteredTags.map((tag, index) => (
                <button
                  key={index}
                  className="search-result-tag"
                  onClick={() => handleAddTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <h3>Media</h3>
          <input type="file" multiple onChange={(e) => handleMediaUpload(e.target.files)} />
          {isUploading && <p>Uploading...</p>}
          {media.length > 0 && ( // Only render media-preview if media is not empty
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
                  <button onClick={() => handleDeleteFile(item.url)} className='delete'>Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="save" onClick={handleSave}>
          Save
        </button>
        <button className="delete" onClick={onDelete}>
          Delete
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EditPathModal;