require('dotenv').config();
const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  privateKey : process.env.PRIVATE_KEY,
  private_key_id: process.env.PRIVATE_KEY_ID,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const admin = require('firebase-admin');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: firebaseConfig.storageBucket
  });

const bucket = admin.storage().bucket();

module.exports = { bucket };