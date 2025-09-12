import admin from 'firebase-admin';
import config from '#config/index.js';

// Only initialize Firebase if proper configuration is provided
let firebaseApp = null;

try {
  if (
    config.firebase.projectId &&
    config.firebase.projectId !== 'firebase_project_id_here' &&
    config.firebase.privateKey &&
    config.firebase.privateKey !== 'firebase_private_key_here' &&
    config.firebase.privateKey !== null &&
    config.firebase.clientEmail &&
    config.firebase.clientEmail !== 'firebase_client_email_here'
  ) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        type: config.firebase.type,
        project_id: config.firebase.projectId,
        private_key_id: config.firebase.privateKeyId,
        private_key: config.firebase.privateKey,
        client_email: config.firebase.clientEmail,
        client_id: config.firebase.clientId,
        auth_uri: config.firebase.authUri,
        token_uri: config.firebase.tokenUri,
        auth_provider_x509_cert_url: config.firebase.authProviderCertUrl,
        client_x509_cert_url: config.firebase.clientCertUrl,
      }),
    });
  } else {
    console.warn('Firebase configuration not provided, Firebase features disabled');
  }
} catch (error) {
  console.warn('Failed to initialize Firebase:', error.message);
}

export default firebaseApp;
