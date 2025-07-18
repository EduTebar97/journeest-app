
import admin from 'firebase-admin';
import { serviceAccount } from './serviceAccountKey.js';

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK inicializado.');
  }
} catch (error) {
  console.error('Error al inicializar Firebase Admin SDK:', error);
  // Un error aquí casi siempre se debe a una clave de servicio incorrecta.
  // El archivo serviceAccountKey.js debe existir y exportar el objeto de la clave.
  process.exit(1);
}

export const adminDb = admin.firestore();
