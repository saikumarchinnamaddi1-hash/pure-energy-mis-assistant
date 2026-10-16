
const {
  initializeApp,
  cert,
  getApps,
} = require("firebase-admin/app");

const { getFirestore } = require("firebase-admin/firestore");
const path = require("path");

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (getApps().length === 0) {
  initializeApp({
    credential: cert(require(path.resolve(serviceAccountPath))),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore();

module.exports = { db };
