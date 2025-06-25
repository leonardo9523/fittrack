import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, doc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

async function main() {
    const userEmail = document.getElementById("lblUserEmail");
    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está logado!
        currentUser = user;
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
}

main();