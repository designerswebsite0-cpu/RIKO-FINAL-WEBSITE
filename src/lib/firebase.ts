import { App, cert, getApps, initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";

let app: App | undefined;

function required(name: string) {
  let value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  // Strip wrapping double or single quotes if present (common when copy-pasting into Vercel)
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

export function getFirebaseDb(): Firestore {
  if (!app) {
    const hasEnv = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY;
    if (hasEnv) {
      const privateKey = required("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n");
      app = getApps()[0] ?? initializeApp({
        credential: cert({
          projectId: required("FIREBASE_PROJECT_ID"),
          clientEmail: required("FIREBASE_CLIENT_EMAIL"),
          privateKey,
        }),
      });
    } else {
      // Fallback to Application Default Credentials (ADC) for local development
      let projectId = process.env.FIREBASE_PROJECT_ID?.trim() || "riko-backend";
      if ((projectId.startsWith('"') && projectId.endsWith('"')) || (projectId.startsWith("'") && projectId.endsWith("'"))) {
        projectId = projectId.slice(1, -1).trim();
      }
      app = getApps()[0] ?? initializeApp({
        projectId,
      });
    }
  }
  return getFirestore(app);
}

export function firebaseConfigurationPresent() {
  return true;
}
