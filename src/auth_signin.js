import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {  getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

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
const emailInput = document.getElementById("txtEmailSignin");
const passwordInput = document.getElementById("txtPasswordSignin");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

  try {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        window.location.href = "dashboard.html"; 
        // ...
    })
    // ajuste conforme sua estrutura
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
});
