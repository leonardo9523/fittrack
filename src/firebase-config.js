import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {  getAuth, connectAuthEmulator } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore, connectFirestoreEmulator } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

if (location.hostname === "localhost") {
  // Conectar Auth (padrão porta 9099)
  connectAuthEmulator(auth, "http://127.0.0.1:9099");

  // Conectar Firestore (padrão porta 8080)
  connectFirestoreEmulator(db, '127.0.0.1', 8081);
}

export { auth }; // Exportando auth e funções necessárias
export { db }; // Exportando db para uso em outros módulos