import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(), // Or use your service account key
});

const db = admin.firestore();

// Helper function to update documents
async function updateDocumentsWithMapId(collectionName: string, mapId: string) {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();

  const updatePromises = snapshot.docs.map(async (doc) => {
    console.log(`Updating document in ${collectionName}: ${doc.id}`);
    return doc.ref.update({ mapId });
  });

  await Promise.all(updatePromises);
  console.log(`All documents in ${collectionName} have been updated.`);
}

async function main() {
  try {
    // Define your collections and mapId
    const collectionsToUpdate = ["pins", "markers", "paths"];
    const mapId = "default-global-map-id"; // Use a unique ID for your global map

    for (const collectionName of collectionsToUpdate) {
      await updateDocumentsWithMapId(collectionName, mapId);
    }

    console.log("All updates completed successfully.");
  } catch (error) {
    console.error("Error updating documents:", error);
  } finally {
    process.exit(); // Exit the script
  }
}

main();