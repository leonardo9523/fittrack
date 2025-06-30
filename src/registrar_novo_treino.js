import { doc, getDocs, query, collection, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js'; 
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

async function main() {
    const userEmailLabel = document.getElementById("lblUserEmail");
    const historicoContainer = document.getElementById("historicoContainer"); // Container principal para o conteúdo

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userEmailLabel.textContent = user.email;
            try {
              const workoutsCollectionRef = collection(db, "usuarios", user.uid, "workouts");
              const q = query(workoutsCollectionRef, orderBy("date", "desc"), limit(3));
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                  const workoutData = doc.data();
                  console.log("Workout encontrado:", workoutData);
                });
                  // 3. Renderizar os dados na página
                  displayWorkout(querySnapshot);
              } else {
                  historicoContainer.innerHTML = '<h1 class="text-light">Erro: Treino não encontrado.</h1>';
                  console.log("Nenhum documento encontrado com o ID:", workoutId);
                }
            } catch (error) {
                historicoContainer.innerHTML = '<h1 class="text-light">Ocorreu um erro ao carregar o treino.</h1>';
                console.error("Erro ao buscar treino:", error);
            }
        } else {
            console.log("Nenhum usuário logado.");
            window.location.href = "index.html";
        }
    });

    function displayWorkout(querySnapshot) {
      // Limpa o conteúdo placeholder do HTML
      historicoContainer.innerHTML = ''; 

      querySnapshot.forEach(doc => {
        console.log("Workout encontrado:", doc.data());
        // Adiciona um título geral para o treino com a data formatada
        let workoutDate = doc.data().date.toDate(); // Converte Timestamp do Firestore para Date do JS
        let formattedDate = workoutDate.toLocaleString('pt-BR', {
            dateStyle: 'long',
            timeStyle: 'short'
        });
        const card = document.createElement('div');
        card.className = 'col-sm';
        card.innerHTML = `
            <div class="card card-animado rounded-4 p-4 shadow text-center" style="background-color: #212529;">
                <h3 class="dashboard-title">${formattedDate}</h3>
            </div>
        `;
        card.addEventListener('click', () => {
                        // Redireciona para a página de detalhes, passando o ID na URL
          window.location.href = `treino.html?workoutId=${doc.id}`;
        });
        historicoContainer.appendChild(card);
      });
    }
}

main();

const btnRegistrarNovoTreino = document.getElementById("btnRegistrarNovoTreino");

btnRegistrarNovoTreino.addEventListener("click", () => {
    // Redireciona para a página de registro de treino
    window.location.href = "rotina_treino.html"; // ou o caminho correto para sua página de registro de treino
});