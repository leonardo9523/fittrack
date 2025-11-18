import { onAuthStateChanged, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { db, auth } from './firebase-config.js'; 

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

const btnDeleteUser = document.getElementById("btnDeleteUser");

btnDeleteUser.addEventListener("click", async () => {
  const user = auth.currentUser;
  const confirmDeleteUser = confirm("Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.");
    if (confirmDeleteUser) {
      const password = prompt("Por favor, insira sua senha para confirmar a exclusão da conta:");
      if (!password) {
        alert("Senha não fornecida. A conta não foi deletada.");
        return;
      }
      try {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await deleteDoc(doc(db, "usuarios", user.uid));
        await deleteUser(user);
        alert("Conta deletada com sucesso.");
        window.location.href = "index.html";
      } catch (error) {
        console.error("Erro no processo de deleção:", error);
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          alert("Senha incorreta. A conta não foi deletada.");
        } else if (error.code === 'auth/requires-recent-login') {
          alert("Sessão expirada. Por favor, faça login novamente e tente excluir a conta imediatamente.");
        } else {
          alert(`Ocorreu um erro ao deletar a conta: ${error.message}`);
        }
      }
    }
});