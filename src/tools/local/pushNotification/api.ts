import { PushNotificationParams } from "./tool";
//import serviceAccount from "../../../../fluid-firebase-sdk.json";
import { db } from "@/config/firebase";
import axios from "axios";
import { getServiceAccount } from "@/utils/getServiceAccount";
import jwt from 'jsonwebtoken';
import https from "https";
import dns from "dns";


const serviceAccount = getServiceAccount();
// Function to get OAuth2 access token

async function getAccessTokenManually() {
  const now = Math.floor(Date.now() / 1000);
  const jwtPayload = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const signedJWT = jwt.sign(jwtPayload, serviceAccount.private_key.replace(/\\n/g, "\n"), {
    algorithm: "RS256",
  });

  const response = await axios.post(
  "https://oauth2.googleapis.com/token",
  new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: signedJWT,
  }),
  {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    httpsAgent: new https.Agent({
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, {...options, family: 4 }, callback); // Force IPv4
      },
    }),
  }
);


  return response.data.access_token;
}


async function getAccessToken() {
  //const auth = new google.auth.GoogleAuth({
  //  credentials: serviceAccount,
  //  scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  //});

  try {
    //const accessToken = await auth.getAccessToken();
    const accessToken = await getAccessTokenManually();

    if (!accessToken) {
      console.error("Access token is null. Check service account and scopes.");
      throw new Error("Access token fetch failed (null response)");
    }

    console.log("Access token fetched successfully");
    return accessToken;
  } catch (err) {
    console.error("Error fetching access token:", err);
    throw err;
  }
}

export async function sendPushNotificationApi(
  tokens: string[],
  title: string,
  body: string
): Promise<string> {
  try {
    const accessToken = await getAccessToken();
    console.log("Access TOken", accessToken);
    const projectId = serviceAccount.project_id;
    console.log("ProjectID", projectId);

    // Create an array of promises for each token
    const notificationPromises = tokens.map(async (token) => {
      const messagePayload = {
        message: {
          token,
          notification: {
            title,
            body,
          },
        },
      };

     const response = await axios.post(
  `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
  messagePayload,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    httpsAgent: new https.Agent({
      lookup: (hostname, options, callback) => {
        dns.lookup(hostname, { ...options,family: 4 }, callback); // IPv4 only
      },
    }),
  }
);

      return response.data;
    });

    // Wait for any promise to resolve successfully
    await Promise.any(notificationPromises);
    return "Message sent successfully!";
  } catch (error: any) {
    // Handle other types of errors
    if (error.response) {
      console.error("Axios Error Response:");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("Axios Error Request (no response):", error.request);
    } else {
      console.error("General Axios Error:", error.message);
    }

    return `Error: Failed to send message to the user`;
  }
}

export async function getFcmToken(userId: string): Promise<string[] | null> {
  try {
    const userDocRef = db.collection("users").doc(userId);
    const docSnapshot = await userDocRef.get();

    if (!docSnapshot.exists) {
      console.warn(`User with ID ${userId} not found.`);
      return null;
    }

    const userData = docSnapshot.data();
    if (!userData || !userData.fcmToken) {
      console.warn(`No FCM token found for user ${userId}.`);
      return null;
    }

    let tokens: string[] = [];
    const rawToken = userData.fcmToken;

    // Handle single string token or array of strings
    if (typeof rawToken === "string") {
      tokens = [rawToken];
    } else if (
      Array.isArray(rawToken) &&
      rawToken.every((item) => typeof item === "string")
    ) {
      tokens = rawToken;
    } else {
      console.warn(
        `Invalid FCM token format for user ${userId}. Expected string or array of strings.`
      );
      return null;
    }

    if (tokens.length === 0) {
      console.warn(`No valid FCM tokens found for user ${userId}.`);
      return null;
    }

    return tokens;
  } catch (error) {
    console.error(`Failed to get FCM token for user ${userId}:`, error);
    return null;
  }
}

export async function sendPushNotification(
  params: PushNotificationParams
): Promise<string> {
  const { message, user } = params;

  try {
    const token = await getFcmToken(user.id);

    if (!token || token.length == 0) {
      return `FCM token not found for user with ID: ${user.id}`;
    }

    return await sendPushNotificationApi(token, message.title, message.body);
  } catch (error) {
    console.error("Unexpected error in sendPushNotification:", error);

    if (error instanceof Error) {
      return `Unexpected error: ${error.message}`;
    }

    return `Unknown error occurred while sending push notification.`;
  }
}

//console.log("Using service account for:", serviceAccount.client_email);
//console.log("Project ID:", serviceAccount.project_id);
//sendPushNotification({
//  user: {
//    id: "6784b1dcb8a24499bc0c9942"
//  },
//  message: {
//    "title": "Test Notification",
//    "body": "This is a test notification sent via the API."
//  }
//});
