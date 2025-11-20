import { onAuthStateChanged, signOut, deleteUser, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
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

const btnEditPassword = document.getElementById("btnEditPassword");
const divUpdatePassword = document.getElementById("divUpdatePassword");
const txtEmailUpdatePassword = document.getElementById("txtEmailUpdatePassword");
txtEmailUpdatePassword.value = auth.currentUser ? auth.currentUser.email : "";

btnEditPassword.addEventListener("click", () => {
  divUpdatePassword.hidden = false;
  
  const btnSaveUpdatePassword = document.getElementById("btnSaveUpdatePassword");
  const inputUpdatePassword = document.getElementById("txtPasswordUpdate");
  const inputConfirmUpdatePassword = document.getElementById("txtPasswordUpdateConfirmation");
  const inputCurrentPassword = document.getElementById("txtPasswordCurrent");

    btnSaveUpdatePassword.addEventListener("click", async () => {
    if (inputUpdatePassword.value !== inputConfirmUpdatePassword.value) {
      alert("As senhas não coincidem. Por favor, tente novamente.");
      return;
    }

    if (inputUpdatePassword.value.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (inputUpdatePassword.value === "") {
      alert("A senha não pode ser vazia.");
      return;
    }
    
    if (inputCurrentPassword.value === "") {
      alert("Por favor, insira sua senha atual para confirmar a alteração.");
      return;
    }

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, inputCurrentPassword.value);
    await reauthenticateWithCredential(user, credential);

    const newPassword = inputUpdatePassword.value;
      updatePassword(user, newPassword).then(() => {
        console.log("Senha atualizada com sucesso.");
        alert("Senha atualizada com sucesso. Você será deslogado para aplicar as mudanças.");
        signOut(auth).then(() => {
            // Logout bem-sucedido.
            console.log("Usuário deslogado com sucesso.");
            // O onAuthStateChanged vai detectar a mudança e redirecionar automaticamente.
        }).catch((error) => { 
            // Ocorreu um erro no logout.
            console.error("Erro ao fazer logout:", error);
            alert("Erro ao tentar sair.");
        });
      }).catch((error) => {
        console.error("Erro no processo de atualização de senha:", error);
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          alert("Senha incorreta. A sua senha atual está incorreta.");
        } else if (error.code === 'auth/requires-recent-login') {
          alert("Sessão expirada. Por favor, faça login novamente e tente excluir a conta imediatamente.");
        } else {
          alert(`Ocorreu um erro ao deletar a conta: ${error.message}`);
        }
      });
  });
});