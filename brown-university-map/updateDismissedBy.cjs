const admin = require("firebase-admin"); // CommonJS syntax
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const updateDismissedBy = async () => {
  try {
    const collections = ["markers", "paths"];
    for (const collectionName of collections) {
      const collectionRef = db.collection(collectionName);
      const snapshot = await collectionRef.get();

      const batch = db.batch();
      snapshot.forEach((doc) => {
        batch.update(doc.ref, { dismissedBy: [] }); // Add the dismissedBy property
      });

      await batch.commit();
      console.log(`Updated dismissedBy for all documents in ${collectionName}`);
    }
  } catch (error) {
    console.error("Error updating dismissedBy:", error);
  }
};

updateDismissedBy();