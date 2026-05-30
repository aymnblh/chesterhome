const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let db;
let bucket;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    if (serviceAccount.project_id === "REMPLACEZ_CECI") {
      console.warn("ATTENTION: serviceAccountKey.json contains placeholder values. Firestore won't connect.");
    } else {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: serviceAccount.project_id + ".appspot.com"
      });
      db = admin.firestore();
      bucket = admin.storage().bucket();
      console.log('Firebase initialized successfully.');
    }
  } else {
    console.warn("ATTENTION: serviceAccountKey.json is missing.");
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

module.exports = { admin, db, bucket };
