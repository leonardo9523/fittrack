import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {  getAuth, createUserWithEmailAndPassword, validatePassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

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

const form = document.querySelector("form");
const emailInput = document.getElementById("txtEmailSignup");
const passwordInput = document.getElementById("txtPasswordSignup");
const passwordConfirmationInput = document.getElementById("txtPasswordSignupConfirmation");
//const auth = getAuth(); // Certifique-se de que o Firebase Auth está inicializado corretamente

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const confirm = passwordConfirmationInput.value;

  if (password !== confirm) {
    alert("As senhas não coincidem!");
    return;
  }

  const status = await validatePassword(getAuth(), password);
  if (!status.isValid) {
    // Password could not be validated. Use the status to show what
    // requirements are met and which are missing.

    // If a criterion is undefined, it is not required by policy. If the
    // criterion is defined but false, it is required but not fulfilled by
    // the given password. For example:
    const needsLowerCase = status.containsLowercaseLetter !== true;
  }

  try {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        // ...
      })
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
});
