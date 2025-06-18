import {  onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { auth } from './firebase-config.js'; 

const btnRegistrarNovoTreino = document.getElementById("btnRegistrarNovoTreino");


onAuthStateChanged(auth, (user) => {
  if (user) {
    // O usuário está logado!
    console.log("Usuário logado:", user);
    // Agora você pode pegar as informações dele, como o email
    userEmail.textContent = user.email;

  } else {
    // O usuário não está logado.
    console.log("Nenhum usuário logado.");
    // Redireciona para a página de login para proteger o dashboard
    window.location.href = "index.html"; // ou sua página de login
  }
});

btnRegistrarNovoTreino.addEventListener("click", () => {
    // Redireciona para a página de registro de treino
    window.location.href = "rotina_treino.html"; // ou o caminho correto para sua página de registro de treino
});