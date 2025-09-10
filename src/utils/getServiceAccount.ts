import { environment } from "@/config/environment";

function getServiceAccount() {
  const serviceAccountJson = environment.FIREBASE_SDK;
  if (!serviceAccountJson) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable is not set");
  }
  return JSON.parse(serviceAccountJson);
}

export { getServiceAccount };
