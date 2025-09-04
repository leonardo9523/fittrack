import { auth } from './firebase-config.js'; 
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";


const form = document.querySelector("form");
const emailInput = document.getElementById("txtEmailSignin");
const passwordInput = document.getElementById("txtPasswordSignin");
const messageElement = document.getElementById("signin-message"); 

onAuthStateChanged(auth, (user) => {
  if (user) {
    // O usuário está logado!
    console.log("Usuário logado:", user);
    // Agora você pode pegar as informações dele, como o email
    // Redireciona para a página inicial do app para que o usuário não veja a tela de login novamente
    window.location.href = "registrar_novo_treino.html";

  } else {
    // O usuário não está logado.
    console.log("Nenhum usuário logado.");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  messageElement.textContent = "";

  if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Login bem-sucedido
      const user = userCredential.user;
      console.log("Login realizado com sucesso!", user);

      // Redireciona para o dashboard
      window.location.href = "registrar_novo_treino.html";
    // ajuste conforme sua estrutura
  } catch (error) {
      // Tratamento de erros de login
      console.error("Erro ao fazer login:", error.code, error.message);
      // É uma boa prática não dizer se o erro foi no email ou na senha
      messageElement.textContent = "E-mail ou senha inválidos.";  }
});
