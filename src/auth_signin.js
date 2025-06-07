import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {  getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKKNfe3ZGNoubmru-sDEC7uVOwEvqqWRw",
  authDomain: "the-fittrack-project.firebaseapp.com",
  projectId: "the-fittrack-project",
  storageBucket: "the-fittrack-project.firebasestorage.app",
  messagingSenderId: "630703845197",
  appId: "1:630703845197:web:4d620705416457c6a3d104",
  measurementId: "G-6C40T8CB29"
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
