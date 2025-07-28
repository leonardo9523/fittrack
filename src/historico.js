import { getDocs, query, collection, orderBy } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js'; 
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

async function main() {
    const userEmailLabel = document.getElementById("lblUserEmail");
    const mainContainer = document.querySelector("main.container"); // Container principal para o conteúdo

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userEmailLabel.textContent = user.email;
            try {
              const workoutsCollectionRef = collection(db, "usuarios", user.uid, "workouts");
              const q = query(workoutsCollectionRef, orderBy("date", "desc"));
              const querySnapshot = await getDocs(q);
              if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                  const workoutData = doc.data();
                  console.log("Workout encontrado:", workoutData);
                });
                  // 3. Renderizar os dados na página
                  displayWorkout(querySnapshot);
              } else {
                  mainContainer.innerHTML = '<h1 class="text-light">Erro: Treino não encontrado.</h1>';
                  console.log("Nenhum documento encontrado com o ID:", workoutId);
                }
            } catch (error) {
                mainContainer.innerHTML = '<h1 class="text-light">Ocorreu um erro ao carregar o treino.</h1>';
                console.error("Erro ao buscar treino:", error);
            }
        } else {
            console.log("Nenhum usuário logado.");
            window.location.href = "index.html";
        }
    });

    function displayWorkout(querySnapshot) {
      // Limpa o conteúdo placeholder do HTML
        mainContainer.innerHTML = ''; 
        mainContainer.innerHTML = '<h1 class="text-light m-2 p-2">Todos os treinos</h1>'; 

        querySnapshot.forEach(doc => {
            console.log("Workout encontrado:", doc.data());

            const totalDeExercicios = doc.data().performedExercises.length;
            console.log(`Total de Exercícios: ${totalDeExercicios}`);

            let totalDeSeries = 0;

            doc.data().performedExercises.forEach(exercicio => {
                totalDeSeries += exercicio.sets.length;
            });

            const workoutDate = doc.data().date.toDate(); // Converte Timestamp do Firestore para Date do JS
            const formattedDate = workoutDate.toLocaleString('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
            });

            console.log(`Total de Séries: ${totalDeSeries}`);
            const card = document.createElement('div');
            card.className = 'col-sm';
            card.innerHTML = `
                <div class="card card-animado rounded-4 p-4 m-4 shadow text-center" style="background-color: #212529;">
                    <h2>Treino de ${formattedDate}</h2>
                    <p class="text-light m-0">Quantidade de exercícios: <strong>${totalDeExercicios}</strong></p>
                    <p class="text-light m-0">Quantidade de séries: <strong>${totalDeSeries}</strong></p>
                </div>
            `;
            card.addEventListener('click', () => {
                            // Redireciona para a página de detalhes, passando o ID na URL
            window.location.href = `treino.html?workoutId=${doc.id}`;
            });
            mainContainer.appendChild(card);
        });
    }
}

main();

const userLogout = document.getElementById("lblLogout");

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