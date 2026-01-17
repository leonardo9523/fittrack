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