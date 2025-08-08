import { db, auth } from './firebase-config.js';
import { doc, getDoc, getDocs, deleteDoc, updateDoc, query, collection } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
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

    async function displayWorkout(workoutData, user, workoutId) {
        mainContainer.innerHTML = ''; 

        const workoutDate = workoutData.date.toDate();
        const formattedDate = workoutDate.toLocaleString('pt-BR', {
            dateStyle: 'long',
            timeStyle: 'short'
        });
        
        const pageTitle = document.createElement('h1');
        pageTitle.className = 'dashboard-title text-light mt-4';
        pageTitle.textContent = `Treino de ${formattedDate}`;
        mainContainer.appendChild(pageTitle);


        let exercises = [];
        try {
            const q = query(collection(db, "Exercicios")); // Garanta que o nome da coleção é "Exercicios"
            const querySnapshot = await getDocs(q);
            exercises = querySnapshot.docs.map(doc => doc.data().Titulo);
            console.log("Exercícios carregados:", exercises);
        } catch (error) {
            console.error("Erro ao buscar exercícios do Firebase:", error);
            // Opcional: mostrar um alerta para o usuário
            alert("Não foi possível carregar a lista de exercícios. Tente recarregar a página.");
            return; // Interrompe a execução se os dados essenciais não puderem ser carregados
        }

        workoutData.performedExercises.forEach((exercise, exerciseIndex) => {
            let setsHtmlView = '';
            exercise.sets.forEach((set, index) => {
                setsHtmlView += `
                    <div class="mb-2 text-start">
                        <h4 class="text-light mb-1">Série ${index + 1}</h4>
                        <p class="text-light m-0"><strong>${set.reps}</strong> Repetições</p>
                        <p class="text-light m-0">Carga: <strong>${set.weight} kg</strong></p>
                    </div>
                `;
            });
            
            // << Container principal para cada par de cards (visualização e edição) >>
            const exerciseContainer = document.createElement('div');
            exerciseContainer.className = 'exercise-block'; 
            
            const cardHtml = `
                <div class="card card-view rounded-4 p-3 mt-3 shadow" style="background-color: #212529;">
                    <div class="d-flex justify-content-between align-items-center">
                        <h2 class="dashboard-title text-light mb-0">${exercise.titulo}</h2>
                        <div class="d-flex align-items-center">
                            <button type="button" class="btn btn-sm btn-edit-exercise"><span class="material-symbols-outlined">edit</span></button>
                            <button type="button" class="btn btn-sm btn-delete-exercise"><span class="material-symbols-outlined">delete</span></button>
                        </div>
                    </div>
                    <hr class="text-secondary">
                    ${setsHtmlView}
                </div>

                <div class="card card-edit rounded-4 p-3 mt-3 shadow" style="background-color: #212529;" hidden>
                    <div class="position-relative">
                        <label class="form-label text-light">Nome do Exercício</label>
                        <input type="text" class="form-control bg-dark border-secondary text-light exercise-title-input" placeholder="Digite o nome do exercício" value="${exercise.titulo}">
                        <ul class="list-group position-absolute w-100" style="z-index: 1000;"></ul>
                    </div>
                    <div class="my-3 text-start">
                        <label class="form-label text-light">Número de séries</label>
                        <input type="number" class="form-control bg-dark border-secondary text-light num-series-input" min="1" max="10" value="${exercise.sets.length}">
                    </div>
                    
                    <div class="series-inputs-container"></div>
                    
                    <div class="d-flex justify-content-between pt-4 pb-1 mt-2">
                        <button type="button" class="btn btn-sm btn-cancel-edit btn-danger rounded-4 d-flex flex-column align-items-center"><span class="material-symbols-outlined">cancel</span><span class="dashboard-title text-light m-0">Cancelar</span></button>
                        <button type="button" class="btn btn-sm btn-save-exercise btn-success rounded-4 d-flex flex-column align-items-center"><span class="material-symbols-outlined">save</span><span class="dashboard-title text-light m-0">Salvar</span></button>
                    </div>
                </div>
            `;
            
            exerciseContainer.innerHTML = cardHtml;
            mainContainer.appendChild(exerciseContainer);

            // << BUSCANDO OS ELEMENTOS DENTRO DO CONTAINER DO EXERCÍCIO ATUAL >>
            const cardView = exerciseContainer.querySelector('.card-view');
            const cardEdit = exerciseContainer.querySelector('.card-edit');
            const btnEdit = exerciseContainer.querySelector('.btn-edit-exercise');
            const btnDelete = exerciseContainer.querySelector('.btn-delete-exercise');
            const btnSave = exerciseContainer.querySelector('.btn-save-exercise');
            const btnCancel = exerciseContainer.querySelector('.btn-cancel-edit');
            
            // << LÓGICA PARA DELETAR O EXERCÍCIO (semelhante à sua) >>
            btnDelete.addEventListener('click', async () => {
                const confirmDelete = confirm(`Você tem certeza que deseja deletar o exercício "${exercise.titulo}"?`);
                if (confirmDelete) {
                    const updatedExercises = workoutData.performedExercises.filter(ex => ex.titulo !== exercise.titulo);
                    const workoutDocRef = doc(db, "usuarios", user.uid, "workouts", workoutId);
                    try {
                        await updateDoc(workoutDocRef, { performedExercises: updatedExercises });
                        exerciseContainer.remove(); // Remove o bloco inteiro do DOM
                        workoutData.performedExercises = updatedExercises;
                        alert("Exercício removido com sucesso!");
                    } catch (error) {
                        console.error("Erro ao remover exercício:", error);
                        alert("Ocorreu um erro ao remover o exercício.");
                    }
                }
            });

            // << LÓGICA PARA ENTRAR NO MODO DE EDIÇÃO >>
            btnEdit.addEventListener('click', () => {
                cardView.hidden = true;
                cardEdit.hidden = false;

                // << ATIVANDO A LÓGICA DE EDIÇÃO PARA ESTE CARD ESPECÍFICO >>
                const titleInput = cardEdit.querySelector('.exercise-title-input');
                const autocompleteList = cardEdit.querySelector('.list-group');
                const numSeriesInput = cardEdit.querySelector('.num-series-input');
                const seriesInputsContainer = cardEdit.querySelector('.series-inputs-container');

                // << Função para gerar as séries existentes ao abrir a edição >>
                function generateSeriesInputs(sets) {
                    seriesInputsContainer.innerHTML = '';
                    sets.forEach((set, i) => {
                        seriesInputsContainer.innerHTML += `
                            <div class="row g-2 mb-2 align-items-center">
                                <div class="col-auto"><label class="form-label text-light m-0">Série ${i + 1}:</label></div>
                                <div class="col"><input type="number" class="form-control bg-secondary text-light weight-input" placeholder="Carga (kg)" value="${set.weight}"></div>
                                <div class="col"><input type="number" class="form-control bg-secondary text-light reps-input" placeholder="Reps" value="${set.reps}"></div>
                            </div>
                        `;
                    });
                }
                
                // << Gera os inputs das séries iniciais >>
                generateSeriesInputs(exercise.sets);

                // << LÓGICA DO AUTOCOMPLETE (adaptada para este card) >>
                titleInput.addEventListener("input", () => {
                    const value = titleInput.value.toLowerCase();
                    autocompleteList.innerHTML = "";
                    if (!value) return;

                    const filtered = exercises.filter(ex => ex.toLowerCase().includes(value));
                    filtered.forEach(ex => {
                        const li = document.createElement("li");
                        li.className = "list-group-item list-group-item-action bg-dark text-light border-secondary";
                        li.style.cursor = "pointer";
                        li.textContent = ex;
                        li.addEventListener("click", () => {
                            titleInput.value = ex;
                            autocompleteList.innerHTML = "";
                        });
                        autocompleteList.appendChild(li);
                    });
                });

                // << LÓGICA PARA GERAR INPUTS DE SÉRIES (adaptada para este card) >>
                numSeriesInput.addEventListener('input', () => {
                    const num = parseInt(numSeriesInput.value) || 0;
                    if (num < 1 || num > 10) {
                        seriesInputsContainer.innerHTML = '';
                        return;
                    }
                    
                    // Pega os valores atuais para não perdê-los ao adicionar/remover séries
                    const currentWeightInputs = seriesInputsContainer.querySelectorAll('.weight-input');
                    const currentRepsInputs = seriesInputsContainer.querySelectorAll('.reps-input');
                    const currentSets = [];
                    for (let i = 0; i < currentWeightInputs.length; i++) {
                        currentSets.push({
                            weight: currentWeightInputs[i].value || 0,
                            reps: currentRepsInputs[i].value || 0
                        });
                    }

                    seriesInputsContainer.innerHTML = '';
                    for (let i = 0; i < num; i++) {
                        const weight = currentSets[i] ? currentSets[i].weight : '';
                        const reps = currentSets[i] ? currentSets[i].reps : '';
                        seriesInputsContainer.innerHTML += `
                            <div class="row g-2 mb-2 align-items-center">
                                <div class="col-auto"><label class="form-label text-light m-0">Série ${i + 1}:</label></div>
                                <div class="col"><input type="number" class="form-control bg-secondary text-light weight-input" placeholder="Carga (kg)" value="${weight}"></div>
                                <div class="col"><input type="number" class="form-control bg-secondary text-light reps-input" placeholder="Reps" value="${reps}"></div>
                            </div>
                        `;
                    }
                });
            });

            // << LÓGICA PARA CANCELAR A EDIÇÃO >>
            btnCancel.addEventListener('click', () => {
                cardEdit.hidden = true;
                cardView.hidden = false;
            });

            // << LÓGICA PARA SALVAR AS ALTERAÇÕES >>
            btnSave.addEventListener('click', async () => {
                const titleInput = cardEdit.querySelector('.exercise-title-input');
                const weightInputs = cardEdit.querySelectorAll('.weight-input');
                const repsInputs = cardEdit.querySelectorAll('.reps-input');

                // 1. Montar o novo objeto de exercício com os dados do formulário
                const newSets = [];
                for(let i = 0; i < weightInputs.length; i++){
                    newSets.push({
                        weight: parseFloat(weightInputs[i].value) || 0,
                        reps: parseInt(repsInputs[i].value) || 0
                    });
                }
                
                const updatedExerciseData = {
                    titulo: titleInput.value,
                    sets: newSets
                };

                // 2. Atualizar o array de exercícios local
                // Usamos o 'exerciseIndex' do forEach para saber qual item substituir
                workoutData.performedExercises[exerciseIndex] = updatedExerciseData;

                // 3. Enviar a atualização para o Firestore
                const workoutDocRef = doc(db, "usuarios", user.uid, "workouts", workoutId);
                try {
                    await updateDoc(workoutDocRef, {
                        performedExercises: workoutData.performedExercises
                    });
                    alert("Exercício atualizado com sucesso!");
                    
                    // 4. Recarregar a página para ver as alterações.
                    // Uma alternativa mais avançada seria atualizar o DOM dinamicamente.
                    window.location.reload();

                } catch (error) {
                    console.error("Erro ao salvar alterações:", error);
                    alert("Ocorreu um erro ao salvar as alterações.");
                    // Reverter a mudança local em caso de erro
                    workoutData.performedExercises[exerciseIndex] = exercise;
                }
            });
        });

        // << Botão de deletar o treino inteiro >>
        const deleteWorkoutContainer = document.createElement('div');
        deleteWorkoutContainer.className = "container-fluid d-flex justify-content-end pt-4 pb-1 mt-2";
        deleteWorkoutContainer.innerHTML = `
            <button type="button" class="btn btn-danger rounded-4 d-flex flex-column" id="btnDeleteWorkout">
                <span class="material-symbols-outlined">delete_forever</span>
                <span class="dashboard-title text-light m-0">Deletar treino</span>
            </button>
        `;
        mainContainer.appendChild(deleteWorkoutContainer);
        
        deleteWorkoutContainer.querySelector('#btnDeleteWorkout').addEventListener('click', async () => {
            const confirmDelete = confirm("Você tem certeza que deseja deletar este treino permanentemente?");
            if (confirmDelete) {
                try {
                    const workoutDocRef = doc(db, "usuarios", user.uid, "workouts", workoutId);
                    await deleteDoc(workoutDocRef);
                    alert("Treino deletado com sucesso!");
                    window.location.href = "historico.html";
                } catch (error) {
                    console.error("Erro ao deletar treino:", error);
                    alert("Ocorreu um erro ao tentar deletar o treino.");
                }
            }
        });
    }
}

main();