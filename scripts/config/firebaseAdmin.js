
import admin from 'firebase-admin';
// Importa la clave desde un archivo JSON. Asegúrate de que este archivo exista.
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      // Se elimina el casting "as any" que es sintaxis de TypeScript
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK inicializado.');
  }
} catch (error) {
  console.error('Error al inicializar Firebase Admin SDK:', error);
  // Un error aquí casi siempre se debe a un archivo serviceAccountKey.json faltante o mal formado.
  process.exit(1);
}

export const adminDb = admin.firestore();
