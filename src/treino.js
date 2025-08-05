import { db, auth } from './firebase-config.js';
import { doc, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

async function main() {
    const userEmailLabel = document.getElementById("lblUserEmail");
    const mainContainer = document.querySelector("main.container"); // Container principal para o conteúdo

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userEmailLabel.textContent = user.email;
            console.log("Iniciando a página de treino...", user.uid);


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
                    displayWorkout(workoutData, user, workoutId);
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

    function displayWorkout(workoutData, user, workoutId) {
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
            let setsHtmlEdit = '';
            let totalDeSeries = 0;
            exercise.sets.forEach((set, index) => {
                console.log("Set encontrado:", set);
                setsHtml += `
                    <div class="mb-2 text-start">
                        <h4 class="text-light mb-1">Série ${index + 1}</h4>
                        <p class="text-light m-0"><strong>${set.reps}</strong> Repetições</p>
                        <p class="text-light m-0">Carga: <strong>${set.weight} kg</strong></p>
                    </div>
                `;
                setsHtmlEdit += `
                    <div class="mb-2">
                        <label class="form-label text-light">Carga da série ${index + 1}</label>
                        <input type="number" class="form-control bg-secondary text-light weight-input" placeholder="Ex: 20kg" value="${set.weight}">
                    </div>
                    <div class="mb-2">
                        <label class="form-label text-light">Número de repetições da série ${index + 1}</label>
                        <input type="number" class="form-control bg-secondary text-light reps-input" placeholder="Ex: 8 repetições" value="${set.reps}">
                    </div>
                `;
                totalDeSeries++;
            });

            const cardHtml = `
                <div class="card rounded-4 p-3 mt-3 shadow" data-exercise-title="${exercise.titulo}" style="background-color: #212529;">
                    <div class="d-flex justify-content-between align-items-center">
                        <h2 class="dashboard-title text-light mb-0">${exercise.titulo}</h2>
                        <div class="d-flex align-items-center">
                            <button type="button" class="btn btn-sm btnEditExercise"><span class="material-symbols-outlined">edit</span></button>
                            <button type="button" class="btn btn-sm btnDeleteExercise"><span class="material-symbols-outlined">delete</span></button>
                        </div>
                    </div>
                    <hr class="text-secondary">
                    ${setsHtml}
                </div>
                <div class="card rounded-4 p-3 mt-3 shadow" data-exercise-title="${exercise.titulo + "edit"}" style="background-color: #212529;" >
                    <div>
                        <label class="form-label text-light">Buscar exercício</label>
                        <input type="text" class="form-control bg-dark border-secondary text-light exercise-input" placeholder="Digite o nome do exercício" value="${exercise.titulo}">
                    </div>
                    <div class="mb-2 text-start">
                        <label class="form-label text-light">Número de séries</label>
                        <input type="number" class="form-control bg-dark border-secondary text-light num-series-input" min="1" max="10" placeholder="Ex: 4" value="${totalDeSeries}">
                    </div>
                    ${setsHtmlEdit}
                    <div class="d-flex justify-content-between pt-4 pb-1 mt-2">
                        <button type="button" class="btn btn-sm btnEditExercise btn-danger rounded-4 d-flex flex-column"><span class="material-symbols-outlined">cancel</span><span class="dashboard-title text-light m-0">Cancelar alterações</span></button>
                        <button type="button" class="btn btn-sm btnEditExercise btn-success rounded-4 d-flex flex-column"><span class="material-symbols-outlined">save</span><span class="dashboard-title text-light m-0">Salvar alterações</span></button>
                    </div>
                </div>
            `;
            mainContainer.innerHTML += cardHtml;
            //TODO: Terminar a edição de exercícios, lembrar de usar as funcionalidades do rotina_treino.js
        });
        const deleteDiv = `
            <div class="container-fluid d-flex justify-content-end pt-4 pb-1 mt-2">
                <button type="button" class="btn btn-danger rounded-4 d-flex flex-column" id="btnDeleteWorkout">
                    <span class="material-symbols-outlined">delete</span>
                    <span class="dashboard-title text-light m-0">Deletar treino</span>
                </button>
            </div>
        `;
                // Adicionar futuramente a funcionalidade de compartilhar treino
                // <button type="button" class="btn btn-success rounded-4 d-flex flex-column">
                //     <span class="material-symbols-outlined">share</span>
                //     <span class="dashboard-title text-light m-0">Compartilhar treino</span>
                // </button>

        mainContainer.innerHTML += deleteDiv;
        console.log("Workout encontrado:", workoutData);

        const btnEditExercise = document.querySelectorAll('.btnEditExercise');
        btnEditExercise.forEach(button => {
            button.addEventListener('click', (event) => {
                const exerciseEditCard = event.target.closest('.card');
                const cardToEdit = exerciseEditCard.getAttribute('data-exercise-title');
                //cardToEdit.classList.add('card-exercicio-edit');
                const cardbla = document.querySelector(`div[data-exercise-title="${cardToEdit}edit"]`);
                cardbla.hidden = false;
                exerciseEditCard.hidden = true;
                //TODO: Implementar a funcionalidade de edição de exercícios
            });
        });


        const btnDeleteExercise = document.querySelectorAll('.btnDeleteExercise');
        btnDeleteExercise.forEach(button => {
            button.addEventListener('click', async (event) => {
                const exerciseCard = event.target.closest('.card');
                const titleToDelete = exerciseCard.getAttribute('data-exercise-title');
                console.log("Exercício a ser deletado:", titleToDelete);
                const confirmDelete = confirm(`Você tem certeza que deseja deletar o exercício "${titleToDelete}"?`);

                if (confirmDelete) {
                    // 1. Cria um novo array sem o exercício a ser deletado
                    const updatedExercises = workoutData.performedExercises.filter(ex => ex.titulo !== titleToDelete);

                    // 2. Pega a referência do documento do treino
                    const workoutDocRef = doc(db, "usuarios", user.uid, "workouts", workoutId);

                    try {
                        // 3. Atualiza o campo 'performedExercises' no Firestore
                        await updateDoc(workoutDocRef, {
                            performedExercises: updatedExercises
                        });

                        // 4. Remove o card do DOM após o sucesso
                        exerciseCard.remove();
                        // Atualiza os dados locais para consistência caso outra ação seja feita na página
                        workoutData.performedExercises = updatedExercises; 
                        alert("Exercício removido com sucesso!");

                    } catch (error) {
                        console.error("Erro ao remover exercício:", error);
                        alert("Ocorreu um erro ao remover o exercício.");
                    }
                }
            });
        });

        const btnDeleteWorkout = document.querySelector('#btnDeleteWorkout');

        btnDeleteWorkout.addEventListener('click', async () => {
            console.log("Confirmação de exclusão:", user.uid, workoutId);
            const confirmDelete = confirm("Você tem certeza que deseja deletar este treino?");

            if (confirmDelete) {
                try {
                    const workoutDocRef = doc(db, "usuarios", user.uid, "workouts", workoutId);
                    await deleteDoc(workoutDocRef);
                    alert("Treino deletado com sucesso!");
                    window.location.href = "historico.html"; // Redireciona para a página de histórico
                } catch (error) {
                    console.error("Erro ao deletar treino:", error);
                    alert("Ocorreu um erro ao tentar deletar o treino.");
                }
            }
        });
    }
}

main();