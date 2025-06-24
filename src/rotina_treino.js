import { db, auth } from './firebase-config.js';
import { collection, getDocs, query, doc, setDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";


// Função principal assíncrona para organizar o código
async function main() {

    const userEmail = document.getElementById("lblUserEmail");
    let currentUser = null;

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // O usuário está logado!
        currentUser = user;
        console.log("Usuário logado:", user);
        // Agora você pode pegar as informações dele, como o email
        userEmail.textContent = user.email;
    
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

    // --- LÓGICA DE CRIAÇÃO DO BLOCO DE EXERCÍCIO ---
    function criarNovoBlocoDeExercicio() {        // Cria o elemento principal do card
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

    // --- EVENTO PRINCIPAL PARA ADICIONAR UM NOVO BLOCO ---
    const exercicioContainer = document.getElementById("exercicioContainer");
    const btnAddExercise = document.getElementById("btnAddExercise");

    btnAddExercise.addEventListener("click", () => {
        const numExercicios = exercicioContainer.children.length;
        const novoBloco = criarNovoBlocoDeExercicio(numExercicios + 1);
        exercicioContainer.appendChild(novoBloco);
    });
    
    // Fecha todas as listas de autocomplete ao clicar fora
    document.addEventListener("click", e => {
        if (!e.target.matches('.exercise-input')) {
            document.querySelectorAll('.autocomplete-list').forEach(list => list.innerHTML = '');
        }
    });
    
    // Inicializa a página com um bloco já criado
    exercicioContainer.appendChild(criarNovoBlocoDeExercicio(1));

    function generateWorkoutId(dateStr) {
        if (!dateStr) return null;
        const formattedDate = dateStr.replace(/\//g, '');
        console.log(`${formattedDate}-workout`);
        return `${formattedDate}-workout`;
    }
        

    const btnSave = document.getElementById("btnSave");
    const txtDate = document.getElementById("textDate");
    btnSave.addEventListener("click", async () => {

        if (!currentUser) {
            alert("Erro: Usuário não está logado. Por favor, recarregue a página.");
            return;
        }
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
            const workoutId = generateWorkoutId(txtDate.value);
            const workoutDate = txtDate.value;
            const rotina = [];
            let orderCounter = 0;

            blocos.forEach(bloco => {
                const titulo = bloco.querySelector('.exercise-input').value;

                const sets = [];
                const seriesInputs = bloco.querySelectorAll('.series-inputs-container');
                seriesInputs.forEach(serieRow => {
                    const weight = parseFloat(serieRow.querySelector('.weight-input').value) || 0;
                    const reps = parseInt(serieRow.querySelector('.reps-input').value) || 0;
                    if (reps > 0) { // Adiciona a série apenas se tiver repetições
                        sets.push({ weight, reps });
                    }
                });
                
                //melhor colocar order como um contador aqui, para garantir que cada bloco tenha uma ordem única
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
                date: workoutDate,
                performedExercises: rotina
            };

            // Cria a referência para o novo documento de treino
            const workoutDocRef = doc(db, "usuarios", currentUser.uid, "workouts", workoutId);
            
            // Salva os dados no Firestore
            await setDoc(workoutDocRef, workoutData);

            console.log("Rotina salva:", rotina);
            alert('Rotina salva com sucesso!');
        } catch (error) {
            console.error("Erro ao salvar a rotina:", error);
            alert("Ocorreu um erro ao salvar o treino. Tente novamente.");
        }
    });

}


// Inicia a aplicação
main();