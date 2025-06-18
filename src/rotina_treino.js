import { db } from './firebase-config.js';
import { collection, getDocs, query } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

// Função principal assíncrona para organizar o código
async function main() {
    
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
    function criarNovoBlocoDeExercicio() {
        // Cria o elemento principal do card
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card rounded-4 p-4 shadow text-center mb-3';
        cardDiv.style.backgroundColor = '#212529';

        // Template HTML usando classes em vez de IDs para elementos repetidos
        cardDiv.innerHTML = `
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
        `;

        // --- ADICIONA OS EVENT LISTENERS PARA ESTE NOVO BLOCO ---
        const input = cardDiv.querySelector(".exercise-input");
        const list = cardDiv.querySelector(".autocomplete-list");
        const numSeriesInput = cardDiv.querySelector('.num-series-input');
        const seriesInputsContainer = cardDiv.querySelector('.series-inputs-container');
        const btnRemover = cardDiv.querySelector('.btn-remover-exercicio');

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
                        <input type="number" class="form-control bg-secondary text-light" placeholder="Ex: 20kg">
                    </div>
                `;
            }
        });

        // Lógica para o botão de remover
        btnRemover.addEventListener('click', () => {
            cardDiv.remove();
        });

        return cardDiv;
    }

    // --- EVENTO PRINCIPAL PARA ADICIONAR UM NOVO BLOCO ---
    const exercicioContainer = document.getElementById("exercicioContainer");
    const btnAddExercise = document.getElementById("btnAddExercise");

    btnAddExercise.addEventListener("click", () => {
        const novoBloco = criarNovoBlocoDeExercicio();
        exercicioContainer.appendChild(novoBloco);
    });
    
    // Fecha todas as listas de autocomplete ao clicar fora
    document.addEventListener("click", e => {
        if (!e.target.matches('.exercise-input')) {
            document.querySelectorAll('.autocomplete-list').forEach(list => list.innerHTML = '');
        }
    });
    
    // Inicializa a página com um bloco já criado
    exercicioContainer.appendChild(criarNovoBlocoDeExercicio());

}

// Inicia a aplicação
main();