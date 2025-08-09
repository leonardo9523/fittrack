// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        cadastro: 'cadastro.html',
        dashboard: 'dashboard.html',
        historico: 'historico.html',
        registrarNovoTreino: 'registrar_novo_treino.html',
        rotinaTreino: 'rotina_treino.html',
        treino: 'treino.html'
      }
    }
  }
})