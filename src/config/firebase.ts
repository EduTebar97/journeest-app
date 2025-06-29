// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

// TODO: REEMPLAZA ESTO CON LA CONFIGURACIÓN DE TU PROYECTO DE FIREBASE
// Ve a tu proyecto en la consola de Firebase -> Configuración del proyecto -> Tus apps -> SDK de configuración
const firebaseConfig = {
  apiKey: "AIzaSyAq2YoYuNWWUXBUO7BYlXLp4py_SqB8Uw8",
  authDomain: "journeest-project-unique-id.firebaseapp.com",
  projectId: "journeest-project-unique-id",
  storageBucket: "journeest-project-unique-id.appspot.com",
  messagingSenderId: "649186591378",
  appId: "1:649186591378:web:01c3d3fb957bf5d8829c4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Exportar los servicios para usarlos en la app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

console.log("Firebase initialized!");
