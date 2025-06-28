import { db, auth } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

async function main() {
    const userEmailLabel = document.getElementById("lblUserEmail");
    const mainContainer = document.querySelector("main.container"); // Container principal para o conteúdo

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userEmailLabel.textContent = user.email;

            // 1. Pegar o ID do treino da URL
            const urlParams = new URLSearchParams(window.location.search);
            const workoutId = urlParams.get('workoutId');

            if (!workoutId) {
                mainContainer.innerHTML = '<h1 class="text-light">Erro: ID do treino não fornecido.</h1>';
                console.error("Nenhum ID de treino encontrado na URL.");
                return;
            }

            // 2. Buscar os dados do treino no Firestore
            try {
                const workoutDocRef = doc(db, "usuarios", user.uid, "workouts", workoutId);
                const workoutSnap = await getDoc(workoutDocRef);

                if (workoutSnap.exists()) {
                    const workoutData = workoutSnap.data();
                    // 3. Renderizar os dados na página
                    displayWorkout(workoutData);
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

    function displayWorkout(workoutData) {
        // Limpa o conteúdo placeholder do HTML
        mainContainer.innerHTML = ''; 

        // Adiciona um título geral para o treino com a data formatada
        const workoutDate = workoutData.date.toDate(); // Converte Timestamp do Firestore para Date do JS
        const formattedDate = workoutDate.toLocaleString('pt-BR', {
            dateStyle: 'long',
            timeStyle: 'short'
        });
        
        const pageTitle = document.createElement('h1');
        pageTitle.className = 'dashboard-title text-light mt-4';
        pageTitle.textContent = `Treino de ${formattedDate}`;
        mainContainer.appendChild(pageTitle);

        // Itera sobre cada exercício e cria um card para ele
        workoutData.performedExercises.forEach(exercise => {
            let setsHtml = '';
            exercise.sets.forEach((set, index) => {
                setsHtml += `
                    <div class="mb-2 text-start">
                        <h4 class="text-light mb-1">Série ${index + 1}</h4>
                        <p class="text-light m-0"><strong>${set.reps}</strong> Repetições</p>
                        <p class="text-light m-0">Carga: <strong>${set.weight} kg</strong></p>
                    </div>
                `;
            });

            const cardHtml = `
                <div class="card rounded-4 p-3 mt-3 shadow" style="background-color: #212529;">
                    <div class="d-flex justify-content-between align-items-center">
                        <h2 class="dashboard-title text-light mb-0">${exercise.titulo}</h2>
                        <button type="button" class="btn btn-sm"><span class="material-symbols-outlined">edit</span></button>
                    </div>
                    <hr class="text-secondary">
                    ${setsHtml}
                </div>
            `;
            mainContainer.innerHTML += cardHtml;
        });
    }
}

main();