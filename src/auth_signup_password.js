import { auth, db } from './firebase-config.js'; 
import { createUserWithEmailAndPassword, validatePassword } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";


const form = document.querySelector("form");
const emailInput = document.getElementById("txtEmailSignup");
const passwordInput = document.getElementById("txtPasswordSignup");
const passwordConfirmationInput = document.getElementById("txtPasswordSignupConfirmation");
const messageElement = document.getElementById("signup-message");

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

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "usuarios", user.uid), {
      email: user.email,
      criadoEm: new Date()
    });
    
    console.log("Cadastro realizado com sucesso!", user);
    messageElement.style.color = "green";
    messageElement.textContent = "Cadastro realizado com sucesso! Redirecionando...";    // Redirecionar para a página de dashboard
    setTimeout(() => {
      window.location.href = "registrar_novo_treino.html";
    }, 1500);  
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
