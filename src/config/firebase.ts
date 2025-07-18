
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAq2YoYuNWWUXBUO7BYlXLp4py_SqB8Uw8",
  authDomain: "journeest-project-unique-id.firebaseapp.com",
  projectId: "journeest-project-unique-id",
  storageBucket: "journeest-project-unique-id.firebasestorage.app",
  messagingSenderId: "649186591378",
  appId: "1:649186591378:web:01c3d3fb957bf5d8829c4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
