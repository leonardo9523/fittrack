import { doc, getDocs, query, collection, orderBy, limit, getDoc } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js'; 
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

async function main() {
    const userEmailLabel = document.getElementById("lblUserEmail");
    const historicoContainer = document.getElementById("historicoContainer");
    const favoriteWorkoutsContainer = document.getElementById("favoriteWorkoutsContainer");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            userEmailLabel.textContent = user.email;
            try {
                const [historicoSnapshot, favoritosSnapshot] = await Promise.all([
                    searchHistorico(user.uid),
                    searchFavoritos(user.uid)
                ]);

                if (!historicoSnapshot.empty) {
                    displayWorkout(historicoSnapshot);
                } else {
                    historicoContainer.innerHTML = '<p class="text-light text-center">Nenhum treino no seu histórico recente.</p>';
                }

                if (!favoritosSnapshot.empty) {
                    displayFavoriteWorkouts(favoritosSnapshot);
                } else {
                    favoriteWorkoutsContainer.innerHTML = '<p class="text-light text-center">Você ainda não salvou treinos favoritos.</p>';
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

    async function searchHistorico(uid) {
        const workoutsCollectionRef = collection(db, "usuarios", uid, "workouts");
        const q = query(workoutsCollectionRef, orderBy("date", "desc"), limit(3));
        const querySnapshot = await getDocs(q);
        return querySnapshot;
    }

    async function searchFavoritos(uid) {
        const favoriteWorkoutsCollectionRef = collection(db, "usuarios", uid, "favoriteWorkouts");
        const q = query(favoriteWorkoutsCollectionRef, orderBy("title", "desc"), limit(5));
        const querySnapshotFavoriteWorkouts = await getDocs(q);
        return querySnapshotFavoriteWorkouts;
    }

    function displayWorkout(querySnapshot) {
      // Limpa o conteúdo placeholder do HTML
      historicoContainer.innerHTML = ''; 

      querySnapshot.forEach(doc => {
        console.log("Workout display:", doc.data());
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
          window.location.href = `rotina_treino.html?workoutId=${doc.id}`;
        });
        historicoContainer.appendChild(card);
      });
    }

    function displayFavoriteWorkouts(querySnapshot) {
      // Limpa o conteúdo placeholder do HTML
      favoriteWorkoutsContainer.innerHTML = ''; 

      querySnapshot.forEach(doc => {
        const favoriteWorkoutTitle = doc.data().title;
        console.log("Favorite Workout display:", doc.data());
        const card = document.createElement('div');
        card.className = 'col-sm';
        card.innerHTML = `
            <div class="card card-animado rounded-4 p-4 shadow text-center" style="background-color: #212529;">
                <span class="material-symbols-outlined">star</span>
                <h2 class="dashboard-title">${favoriteWorkoutTitle}</h2>
            </div>
        `;
        card.addEventListener('click', () => {
                        // Redireciona para a página de detalhes, passando o ID na URL
          window.location.href = `rotina_treino.html?title=${favoriteWorkoutTitle}`;
        });
        favoriteWorkoutsContainer.appendChild(card);
      });
    }
}

main();

const btnRegistrarNovoTreino = document.getElementById("btnRegistrarNovoTreino");

btnRegistrarNovoTreino.addEventListener("click", () => {
    // Redireciona para a página de registro de treino
    window.location.href = "rotina_treino.html"; // ou o caminho correto para sua página de registro de treino
});

const btnHistorico = document.getElementById("btnHistorico");

btnHistorico.addEventListener("click", () => {
    // Redireciona para a página de registro de treino
    window.location.href = "historico.html"; // ou o caminho correto para sua página de registro de treino
});

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