import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { auth } from './firebase-config.js'; 

const userEmail = document.getElementById("lblUserEmail");
const userLogout = document.getElementById("lblLogout");
const btnRegistrarTreino = document.getElementById("btnRegistrarTreino");

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

userLogout.addEventListener("click", (event) => {
    event.preventDefault();
    signOut(auth).then(() => {
        // Logout bem-sucedido.
        console.log("Usuário deslogado com sucesso.");
        // O onAuthStateChanged vai detectar a mudança e redirecionar automaticamente.
    }).catch((error) => { 
        // Ocorreu um erro no logout.
        console.error("Erro ao fazer logout:", error);
        alert("Erro ao tentar sair.");
    });
});

btnRegistrarTreino.addEventListener("click", () => {
    // Redireciona para a página de registro de treino
    window.location.href = "registrar_novo_treino.html"; // ou o caminho correto para sua página de registro de treino
});