// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';
import cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

const corsHandler = cors({ origin: true });

// Cloud Function to handle moderation requests
export const moderationAPI = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send({ message: 'Method Not Allowed' });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).send({ message: 'Content is required' });
    }

    try {
      // Replace with your moderation service URL and API key if required
      const moderationServiceURL = 'https://api.yourmoderationprovider.com/moderate';
      const apiKey = 'YOUR_API_KEY';

      // Send request to the moderation service
      const response = await axios.post(moderationServiceURL, { content }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Respond with the moderation result
      res.status(200).send(response.data);
    } catch (error: any) {
      console.error('Moderation API Error:', error);
      res.status(500).send({ message: 'Internal Server Error', error: error.message });
    }
  });
});