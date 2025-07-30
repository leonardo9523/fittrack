import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, doc, setDoc, Timestamp, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";


// Função principal assíncrona para organizar o código
async function main() {

    const userEmail = document.getElementById("lblUserEmail");
    let currentUser = null;
    const switchFavorite = document.getElementById("switchFavorite");
    const divSwitchFavorite = document.getElementById("divSwitchFavorite");
    const exercicioContainer = document.getElementById("exercicioContainer");


    onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está logado!
        currentUser = user;
        console.log("Usuário logado:", user);
        // Agora você pode pegar as informações dele, como o email
        userEmail.textContent = user.email;

        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get('title');
        console.log("Título do treino favorito:", title);

        if (title) {
            criarBlocosDeExercicioTreinoFavorito(title, user.uid);
            divSwitchFavorite.hidden = true;
        }
        else {
            console.log("Nenhum título de treino favorito fornecido.");
            // Se não houver título, cria um bloco de exercício padrão
            //const exercicioContainer = document.getElementById("exercicioContainer");
            exercicioContainer.appendChild(criarNovoBlocoDeExercicio());
        }
    
      } else {
        // O usuário não está logado.
        console.log("Nenhum usuário logado.");
        // Redireciona para a página de login para proteger o dashboard
        window.location.href = "index.html"; // ou sua página de login
      }
    });
    
    // 1. BUSCAR OS DADOS DO FIREBASE (COM TRATAMENTO DE ERRO)
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

    async function criarBlocosDeExercicioTreinoFavorito(title, uid) {
        const favoriteWorkoutsDocRef = doc(db, "usuarios", uid, "favoriteWorkouts", title);
        const favoriteWorkoutSnap = await getDoc(favoriteWorkoutsDocRef);
        console.log("Dados do treino favorito:", favoriteWorkoutSnap.data());

        if (favoriteWorkoutSnap.exists()) {
            const favoriteWorkoutData = favoriteWorkoutSnap.data();

            exercicioContainer.innerHTML = ''; 

            favoriteWorkoutData.exercises.forEach((exercise) => {
                const novoBloco = criarNovoBlocoDeExercicio();
                novoBloco.querySelector('.exercise-input').value = exercise.titulo;
                novoBloco.querySelector('.exercise-summary-title').textContent = exercise.titulo;
                exercicioContainer.appendChild(novoBloco);
            });
            return;
        }
        
    }

    // --- LÓGICA DE CRIAÇÃO DO BLOCO DE EXERCÍCIO ---
    function criarNovoBlocoDeExercicio() { 
    console.log("abluble");    // Cria o elemento principal do card
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card rounded-4 p-4 shadow text-center mb-3';
        cardDiv.style.backgroundColor = '#212529';

        cardDiv.innerHTML = `
            <div class="card-content-edit">
                <div class="d-flex justify-content-between align-items-center">
                    <h2 class="dashboard-title text-light mb-0">Adicionar exercício</h2>
                    <button type="button" class="btn-close btn-close-white btn-remover-exercicio" aria-label="Close"></button>
                </div>
                <div class="mb-3 text-start position-relative">
                    <label class="form-label text-light">Buscar exercício</label>
                    <input type="text" class="form-control bg-dark border-secondary text-light exercise-input" placeholder="Digite o nome do exercício">
                    <ul class="list-group position-absolute w-100 mt-1 autocomplete-list" style="z-index: 1000;"></ul>
                </div>
                <div class="mb-3 text-start">
                    <label class="form-label text-light">Número de séries</label>
                    <input type="number" class="form-control bg-dark border-secondary text-light num-series-input" min="1" max="10" placeholder="Ex: 4">
                </div>
                <div class="mb-3 text-start series-inputs-container"></div>
                <button type="button" class="btn btn-success btn-confirmar-exercicio w-100">Confirmar Exercício</button>
            </div>
            <div class="card-content-summary" style="display: none;">
                <h3 class="dashboard-title text-light mb-0 exercise-summary-title">Exercício</h3>
                <button type="button" class="btn btn-secondary btn-editar-exercicio">Editar</button>
            </div>
        `;

        // --- ADICIONA OS EVENT LISTENERS PARA ESTE NOVO BLOCO ---
        const input = cardDiv.querySelector(".exercise-input");
        const list = cardDiv.querySelector(".autocomplete-list");
        const numSeriesInput = cardDiv.querySelector('.num-series-input');
        const seriesInputsContainer = cardDiv.querySelector('.series-inputs-container');
        const btnRemover = cardDiv.querySelector('.btn-remover-exercicio');
        const btnConfirmar = cardDiv.querySelector('.btn-confirmar-exercicio');
        const btnEditar = cardDiv.querySelector('.btn-editar-exercicio');
        const summaryTitle = cardDiv.querySelector('.exercise-summary-title');

        // Lógica do Autocomplete
        input.addEventListener("input", () => {
            const value = input.value.toLowerCase();
            list.innerHTML = "";
            if (!value) return;

            const filtered = exercises.filter(ex => ex.toLowerCase().includes(value));
            filtered.forEach(ex => {
                const li = document.createElement("li");
                li.className = "list-group-item bg-dark text-light border-secondary";
                li.textContent = ex;
                li.addEventListener("click", () => {
                    input.value = ex;
                    list.innerHTML = "";
                });
                list.appendChild(li);
            });
        });
        
        // Lógica para gerar inputs de séries
        numSeriesInput.addEventListener('input', () => {
            const num = parseInt(numSeriesInput.value);
            seriesInputsContainer.innerHTML = '';
            if (isNaN(num) || num < 1 || num > 10) return;

            for (let i = 1; i <= num; i++) {
                seriesInputsContainer.innerHTML += `
                    <div class="mb-2">
                        <label class="form-label text-light">Carga da série ${i}</label>
                        <input type="number" class="form-control bg-secondary text-light weight-input" placeholder="Ex: 20kg">
                    </div>
                    <div class="mb-2">
                        <label class="form-label text-light">Número de repetições da série ${i}</label>
                        <input type="number" class="form-control bg-secondary text-light reps-input" placeholder="Ex: 8 repetições">
                    </div>
                `;
            }
        });

        // Lógica para o botão de remover
        btnRemover.addEventListener('click', () => {
            cardDiv.remove();
        });

        btnConfirmar.addEventListener('click', () => {
            const exerciseName = input.value;
            if (!exerciseName) {
                alert('Por favor, selecione um exercício antes de confirmar.');
                return;
            }
            // Atualiza o título do resumo com o nome do exercício
            summaryTitle.textContent = exerciseName;
            // Adiciona a classe que "colapsa" o card
            cardDiv.classList.add('card-exercicio-collapsed');
        });

        btnEditar.addEventListener('click', () => {
            // Remove a classe para "expandir" o card de volta ao modo de edição
            cardDiv.classList.remove('card-exercicio-collapsed');
        });

        return cardDiv;
    }

    const btnAddExercise = document.getElementById("btnAddExercise");
    const divTitleFavorite = document.getElementById("divTitleFavorite");

    btnAddExercise.addEventListener("click", () => {
        const numExercicios = exercicioContainer.children.length;
        const novoBloco = criarNovoBlocoDeExercicio(numExercicios + 1);
        exercicioContainer.appendChild(novoBloco);
    });

    switchFavorite.addEventListener("change", () => {
        // Se o switch estiver marcado, mostra a div; se não, esconde
        divTitleFavorite.hidden = !switchFavorite.checked;
    });
    
    // Fecha todas as listas de autocomplete ao clicar fora
    document.addEventListener("click", e => {
        if (!e.target.matches('.exercise-input')) {
            document.querySelectorAll('.autocomplete-list').forEach(list => list.innerHTML = '');
        }
    });

    function generateWorkoutId(dateStr) {
        if (!dateStr) return null;
        return dateStr.replace(/\D/g, '');
    }
        

    const btnSave = document.getElementById("btnSave");
    const txtDate = document.getElementById("textDate");

    function parseCustomDate(dateString) {
        // O formato esperado é "dd/MM/yyyy HH:mm"
        const [datePart, timePart] = dateString.split(' ');
        const [day, month, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');

        // Retorna um objeto Date válido.
        // Lembre-se que os meses em JavaScript são baseados em zero (0 = Janeiro, 1 = Fevereiro, etc.)
        return new Date(year, month - 1, day, hours, minutes);
    }

    btnSave.addEventListener("click", async () => {

        if (!currentUser) {
            alert("Erro: Usuário não está logado. Por favor, recarregue a página.");
            return;
        }
        const workoutDateString = txtDate.value;
        if (!txtDate.value) {
            alert("Por favor, selecione a data do treino.");
            return;
        }
        const blocos = document.querySelectorAll('.card-content-edit');
        if (blocos.length === 0) {
            alert('Por favor, adicione pelo menos um exercício antes de salvar.');
            return;
        }

        //btnSave.disabled = true;
        //btnSave.textContent = "Salvando...";
        
        try {
            // ### PASSO 1: Converter a string para um objeto Date do JavaScript ###
            const jsDate = parseCustomDate(workoutDateString);

            // ### PASSO 2: Converter o objeto Date para um Timestamp do Firestore ###
            const firestoreTimestamp = Timestamp.fromDate(jsDate);

            const workoutId = generateWorkoutId(txtDate.value);
            const rotina = [];
            const favoriteExercises = [];
            let orderCounter = 0;

            blocos.forEach(bloco => {
                const titulo = bloco.querySelector('.exercise-input').value;

                const sets = [];
                const seriesContainer = bloco.querySelector('.series-inputs-container');
                if (seriesContainer) {
                    const allSeriesDivs = seriesContainer.children;
                    for (let i = 0; i < allSeriesDivs.length; i += 2) {
                        const weightDiv = allSeriesDivs[i];
                        const repsDiv = allSeriesDivs[i + 1];

                        // 3. Verifique se o par de divs existe para evitar erros.
                        if (weightDiv && repsDiv) {
                            const weightInput = weightDiv.querySelector('.weight-input');
                            const repsInput = repsDiv.querySelector('.reps-input');

                            // 4. Obtenha os valores e adicione ao array 'sets'.
                            if (weightInput && repsInput) {
                                const weight = parseFloat(weightInput.value) || 0;
                                const reps = parseInt(repsInput.value) || 0;

                                if (reps > 0) { // Adiciona a série apenas se tiver repetições
                                    sets.push({ weight, reps });
                                }
                            }
                        }
                    }
                }
                
                if (sets.length > 0) {
                    orderCounter++;
                    console.log(orderCounter, titulo, sets);
                    rotina.push({
                        order: parseInt(orderCounter),
                        titulo: titulo,
                        sets: sets
                    });
                }
            });

            if (rotina.length === 0) {
                alert('Nenhum exercício válido foi adicionado. Verifique os campos e tente novamente.');
                return;
            }

            // Monta o objeto final do treino
            const workoutData = {
                date: firestoreTimestamp,
                performedExercises: rotina
            };

            // Cria a referência para o novo documento de treino
            const workoutDocRef = doc(db, "usuarios", currentUser.uid, "workouts", workoutId);
            
            // Salva os dados no Firestore
            await setDoc(workoutDocRef, workoutData);

            console.log("Rotina salva:", rotina);

            if (switchFavorite.checked) {
                const favoriteWorkoutTitle = document.getElementById("favoriteWorkoutTitle").value;
                const favoriteExercises = [];
                rotina.forEach(exercise => {
                    favoriteExercises.push({
                        titulo: exercise.titulo,
                        order: exercise.order
                    });
                });
                const favoriteWorkoutData = {
                    title: favoriteWorkoutTitle,
                    exercises: favoriteExercises
                }
                const favoriteWorkoutDocRef = doc(db, "usuarios", currentUser.uid, "favoriteWorkouts", favoriteWorkoutTitle);
                await setDoc(favoriteWorkoutDocRef, favoriteWorkoutData);
                console.log("Treino favorito salvo:", favoriteWorkoutTitle);
            }
            window.location.href = `treino.html?workoutId=${workoutId}`;
        } catch (error) {
            console.error("Erro ao salvar a rotina:", error);
            alert("Ocorreu um erro ao salvar o treino. Tente novamente.");
        }
    });

}

// Inicia a aplicação
main();