import { auth } from './firebase-config.js'; 
import {  createUserWithEmailAndPassword, validatePassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const form = document.querySelector("form");
const emailInput = document.getElementById("txtEmailSignup");
const passwordInput = document.getElementById("txtPasswordSignup");
const passwordConfirmationInput = document.getElementById("txtPasswordSignupConfirmation");
const messageElement = document.getElementById("signup-message"); // Adicione um <p id="signup-message"></p> no seu HTML

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const confirm = passwordConfirmationInput.value;

  messageElement.textContent = ""; 

  if (password !== confirm) {
    messageElement.textContent = "Erro: As senhas não coincidem!";
    return;
  }

  if (password.length < 6) {
    messageElement.textContent = "Erro: A senha deve ter no mínimo 6 caracteres.";
    return;
  }

  const status = await validatePassword(auth, password);
  if (!status.isValid) {
    // Password could not be validated. Use the status to show what
    // requirements are met and which are missing.

    // If a criterion is undefined, it is not required by policy. If the
    // criterion is defined but false, it is required but not fulfilled by
    // the given password. For example:
    const needsLowerCase = status.containsLowercaseLetter !== true;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Sucesso!
    const user = userCredential.user;
    console.log("Cadastro realizado com sucesso!", user);
    messageElement.style.color = "green";
    messageElement.textContent = "Cadastro realizado com sucesso! Redirecionando...";    // Redirecionar para a página de dashboard
    window.location.href = "dashboard.html";
  } catch (error) {
      console.error("Erro ao cadastrar:", error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
          messageElement.textContent = "Erro: Este e-mail já está em uso.";
      } else if (error.code === 'auth/invalid-email') {
          messageElement.textContent = "Erro: O e-mail fornecido não é válido.";
      } else {
          messageElement.textContent = "Ocorreu um erro inesperado. Tente novamente.";
      }  }
});
