import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFydMgf7tiUYK6GYuh_rf1GnTo-jpTVI0",
  authDomain: "prisha-lifecare.firebaseapp.com",
  projectId: "prisha-lifecare",
  storageBucket: "prisha-lifecare.firebasestorage.app",
  messagingSenderId: "541640640131",
  appId: "1:541640640131:web:c21e614a06a89e0bc23db6",
  measurementId: "G-38N08SS0WZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
