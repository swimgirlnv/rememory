import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const uploadFile = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  const storage = getStorage(); // Uses storageBucket from firebaseConfig
  const fileRef = ref(storage, `media/${file.name}`); // Organized under 'media/' folder
  await uploadBytes(fileRef, file); // Upload the file to Firebase Storage
  const downloadURL = await getDownloadURL(fileRef); // Get the download URL
  return downloadURL;
};

export default uploadFile;