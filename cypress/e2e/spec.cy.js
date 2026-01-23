describe('Login e cadastro FitTrack', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      const deleteDbRequest = win.indexedDB.deleteDatabase('firebaseLocalStorageDb');
          
      deleteDbRequest.onerror = (event) => {
        console.error('Erro ao deletar DB do Firebase:', event);
      };
      deleteDbRequest.onsuccess = (event) => {
        console.log('DB do Firebase deletado com sucesso');
      };
    });
    cy.visit('http://localhost:5173')
  })
  const project = {
    email: 'teste@email.com',
    senha: 'Senha123'
  }
  it('cadastro na aplicação', () => {
    cy.contains('a', 'Cadastre-se')
      .click()
    cy.get('#txtEmailSignup')
      .should('be.visible')
      .type(project.email)
    cy.get('#txtPasswordSignup')
      .should('be.visible')
      .type(project.senha)
    cy.get('#txtPasswordSignupConfirmation')
      .should('be.visible')
      .type(project.senha)
    cy.contains('button', 'Cadastre-se')
      .click()
    cy.url({ timeout: 10000 }).should('include', 'registrar_novo_treino.html');
    cy.get('#lblUserEmail', { timeout: 10000 })
      .should('be.visible')
      .and('have.text', project.email);
  })
  it('login na aplicação', () => {
    cy.get('#txtEmailSignin')
      .should('be.visible')
      .type('teste@email.com')
    cy.get('#txtPasswordSignin')
      .should('be.visible')
      .type('Senha123')
    cy.contains('button', 'Entrar')
      .click()
    cy.contains('h1', 'Treinos favoritos')
  })
  it('validar mensagem de erro no login', () => {
    cy.get('#txtEmailSignin')
      .should('be.visible')
      .type('emailfalso@email.com')
    cy.get('#txtPasswordSignin')
      .should('be.visible')
      .type('a')
    cy.contains('button', 'Entrar')
      .click()
    cy.get('#signin-message')
      .should('be.visible')
      .and('have.text', 'E-mail ou senha inválidos.')
  })
})