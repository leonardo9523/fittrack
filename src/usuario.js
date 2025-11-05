import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { auth } from './firebase-config.js'; 

const userEmail = document.getElementById("lblUserEmail");
const emailUserPage = document.getElementById("lblEmailUserPage");
const userLogout = document.getElementById("lblLogout");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // O usuário está logado!
    console.log("Usuário logado:", user);
    // Agora você pode pegar as informações dele, como o email
    userEmail.textContent = user.email;
    emailUserPage.textContent = `Email: ${user.email}`;
  } else {
    // O usuário não está logado.
    console.log("Nenhum usuário logado.");
    // Redireciona para a página de login para proteger o dashboard
    window.location.href = "index.html"; // ou sua página de login
  }
});