import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let app: App | undefined;

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export function getFirebaseDb(): Firestore {
  if (!app) {
    const hasEnv = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;
    if (hasEnv) {
      app = getApps()[0] ?? initializeApp({
        credential: cert({
          projectId: required("FIREBASE_PROJECT_ID"),
          clientEmail: required("FIREBASE_CLIENT_EMAIL"),
          privateKey: required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
        }),
      });
    } else {
      // Fallback to Application Default Credentials (ADC) for local development
      app = getApps()[0] ?? initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "riko-backend",
      });
    }
  }
  return getFirestore(app);
}

export function firebaseConfigurationPresent() {
  return true;
}
