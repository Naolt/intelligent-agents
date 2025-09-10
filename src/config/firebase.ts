import { getServiceAccount } from "@/utils/getServiceAccount";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
//import serviceAccount from "../../fluid-firebase-sdk.json"; // Your service account

const serviceAccount = getServiceAccount();

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount as any),
      })
    : getApps()[0];

export const db = getFirestore(app);
