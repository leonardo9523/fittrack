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
    cy.clearFirebaseAuth()
    cy.clearFirestore()
    cy.visit('http://localhost:5173')
  })
  const project = {
    email: 'teste@email.com',
    senha: 'Senha123'
  }
  it('cadastro na aplicação', () => {
    cy.successSignUp(project)
  })
  it('cadastro seguido de signout e login na aplicação', () => {
    cy.successSignUp(project)
    cy.contains('a', 'Sair')
      .click()
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