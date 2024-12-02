const admin = require("firebase-admin"); // CommonJS syntax
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const updateStatus = async () => {
  try {
    const collections = ["markers", "paths"];
    for (const collectionName of collections) {
      const collectionRef = db.collection(collectionName);
      const snapshot = await collectionRef.get();

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { status: "approved" }); // Change status as needed
      });

      await batch.commit();
      console.log(`Updated status for all documents in ${collectionName}`);
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

updateStatus();