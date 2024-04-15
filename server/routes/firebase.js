require('dotenv').config();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const admin = require('firebase-admin');
const serviceAccount = require('../../.firbase/service-account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket
  });

const bucket = admin.storage().bucket();

module.exports = { bucket };