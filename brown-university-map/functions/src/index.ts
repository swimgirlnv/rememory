import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";
import cors from "cors";

admin.initializeApp();

const corsHandler = cors({ origin: true });

export const moderationAPI = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.status(204).send();
    }

    // 🔥 Verify Firebase Auth Token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing auth token" });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log(`Authenticated user: ${decodedToken.email}`);

      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const openaiApiKey = process.env.OPENAI_API_KEY || functions.config().openai.key;

      const response = await axios.post(
        "https://api.openai.com/v1/moderations",
        { input: content },
        {
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const flagged = response.data.results.some((result: any) => result.flagged);
      return res.status(200).json({ flagged });
    } catch (error: any) {
      console.error("Moderation API Error:", error.message);
      return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  });
});