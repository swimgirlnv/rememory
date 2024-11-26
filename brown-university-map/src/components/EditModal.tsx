import React, { useState, useEffect } from "react";
import TipTapEditor from "./TipTapEditor";
import { MediaItem } from "../data/types";
import { getStorage, ref, deleteObject, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";


const EditModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: {
    name: string;
    memory: string;
    media: MediaItem[];
    classYear: string;
    year: number;
    createdBy: string;
  }) => void;
  data: {
    id: string;
    name: string;
    memory: string;
    media: MediaItem[];
    classYear: string;
    year: number;
    createdBy: string;
  } | null;
}> = ({ isOpen, onClose, onSave, data }) => {
  const [name, setName] = useState(data?.name || "");
  const [memory, setMemory] = useState(data?.memory || "");
  const [media, setMedia] = useState<MediaItem[]>(data?.media || []); // Default to empty array
  const [classYear, setClassYear] = useState(data?.classYear || "Freshman");
  const [year, setYear] = useState(data?.year || new Date().getFullYear());
  const [createdBy, setCreatedBy] = useState(data?.createdBy || "");
  const [isUploading, setIsUploading] = useState(false);

  const classYearOptions = [
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
    }
  }, [data]);

  const handleMediaUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
  
    console.log("Media before upload:", media); // Log the structure of `media`
  
    if (!data?.id) {
      console.error("Marker ID is not available for media upload.");
      return;
    }
  
    setIsUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        Array.from(files).map(async (file) => {
          const storage = getStorage();
          const storageRef = ref(storage, `media/${data.id}/${file.name}`); // Organize uploads by marker ID
          await uploadBytes(storageRef, file); // Upload to Firebase Storage
          const url = await getDownloadURL(storageRef); // Get the download URL
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
  
      console.log("Uploaded files:", uploadedFiles);
  
      // Ensure `media` is an array before updating
      const currentMedia = Array.isArray(media) ? media : [];
      const updatedMedia = [...currentMedia, ...uploadedFiles];
      setMedia(updatedMedia);
  
      // Save updated media array to Firestore
      const markerDocRef = doc(db, "markers", data.id);
      await updateDoc(markerDocRef, { media: updatedMedia });
  
      console.log("Media uploaded and Firestore updated successfully.");
    } catch (error) {
      console.error("Error uploading media:", error);
      alert("Failed to upload media. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };


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

  // const updateMarkerMedia = async (updatedMedia: MediaItem[]) => {
  //   if (!data?.id) {
  //     console.error("Marker ID is not available.");
  //     return;
  //   }
  
  //   try {
  //     const markerDocRef = doc(db, "markers", data.id); // Reference Firestore document
  //     await updateDoc(markerDocRef, { media: updatedMedia });
  
  //     console.log("Marker media updated successfully.");
  //     setMedia(updatedMedia); // Update local state
  //   } catch (error) {
  //     console.error("Error updating marker media:", error);
  //     alert("Failed to update marker. Please try again.");
  //   }
  // };

  const handleSave = () => {
    onSave({ name, memory, media, classYear, year, createdBy });
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
        <button onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditModal;