# FitTrack

Site para registrar rotina de treinos.

FitTrack é uma aplicação web para acompanhar treinos, registrar exercícios, visualizar histórico e manter a rotina de academia organizada em um único ambiente. O projeto foi desenvolvido com JavaScript puro, Vite e Firebase, com foco em uma interface simples e funcional para uso em navegador.

## Tecnologias

- JavaScript
- HTML
- CSS
- Vite
- Firebase Authentication
- Firebase Firestore
- Bootstrap
- Cypress (testes end-to-end)

## Funcionalidades

- Cadastro e login de usuários
- Registro de treinos e exercícios
- Visualização do histórico de treinos
- Dashboard com informações gerais da rotina
- Persistência de dados no Firebase
- Suporte a ambiente local com emuladores do Firebase

## Estrutura do projeto

```bash
.
├── .firebaserc
├── .github/
├── .gitignore
├── 404.html
├── cadastro.html
├── cypress.config.js
├── cypress/
├── dashboard.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── historico.html
├── index.html
├── package-lock.json
├── package.json
├── public/
│   └── Img/
├── src/
│   ├── auth_signin.js
│   ├── auth_signup_password.js
│   ├── dashboard.js
│   ├── firebase-config.js
│   ├── global.js
│   ├── historico.js
│   ├── registrar_novo_treino.js
│   ├── rotina_treino.js
│   ├── style.css
│   ├── treino.js
│   └── usuario.js
├── treino.html
├── usuario.html
├── vite.config.js
└── README.md
```

## Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- Node.js (recomendado v18+)
- npm
- Conta no Firebase com projeto configurado

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/leonardo9523/fittrack.git
cd fittrack
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente do Firebase:

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

> As configurações são lidas em `src/firebase-config.js` usando `import.meta.env`.

## Executando em modo de desenvolvimento

```bash
npm run dev
```

O projeto será iniciado em:

```bash
http://localhost:4173
```

## Build para produção

```bash
npm run build
```

## Preview da build

```bash
npm run preview
```

## Testes

Para executar testes end-to-end com Cypress:

```bash
npm run test:e2e
```

Para abrir a interface do Cypress:

```bash
npm run test:e2e:open
```

## Firebase

O projeto usa Firebase para autenticação e banco de dados Firestore. O arquivo `src/firebase-config.js` inicializa o app Firebase e conecta automaticamente ao emulador local quando a aplicação está sendo executada em `localhost`.

Se quiser rodar localmente com emuladores, certifique-se de que o Firebase Emulator esteja em execução antes de abrir a aplicação.

## Deploy

O repositório já inclui configuração para Firebase (`firebase.json` e `firestore.rules`).

Para fazer deploy:

```bash
firebase login
firebase deploy
```

## Licença

Este projeto está licenciado sob a licença ISC.

## Contato

Para dúvidas ou sugestões, utilize o repositório do projeto no GitHub:

- https://github.com/leonardo9523/fittrack

