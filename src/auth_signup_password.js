import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {  getAuth, createUserWithEmailAndPassword, validatePassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  projectId: "***REMOVED***",
  storageBucket: "***REMOVED***.firebasestorage.app",
  messagingSenderId: "***REMOVED***",
  appId: "1:***REMOVED***:web:4d620705416457c6a3d104",
  measurementId: "***REMOVED***"
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
