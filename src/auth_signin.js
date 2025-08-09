import { auth } from './firebase-config.js'; 
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";


const form = document.querySelector("form");
const emailInput = document.getElementById("txtEmailSignin");
const passwordInput = document.getElementById("txtPasswordSignin");
const messageElement = document.getElementById("signin-message"); 

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
