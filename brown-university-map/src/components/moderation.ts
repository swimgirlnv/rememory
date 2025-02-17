import { getAuth } from "firebase/auth";

export async function scanContentForModeration(content: string) {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get the Firebase authentication token
  const token = await user.getIdToken();

  try {
    const response = await fetch("https://us-central1-rememory-88da9.cloudfunctions.net/moderationAPI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 🔥 Send Firebase token
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error scanning content for moderation:", error);
    return { flagged: false };
  }
}