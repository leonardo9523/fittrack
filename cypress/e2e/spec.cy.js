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

  //Cadastro
  it('cadastro na aplicação', () => {
    cy.successSignUp(project)
  })
  //Erros no cadastro
  it('validar mensagem de Erro: As senhas não coincidem!', () => {
    cy.goToSignUpPage()
    cy.get('#txtEmailSignup')
      .should('be.visible')
      .type(project.email)
    cy.get('#txtPasswordSignup')
      .should('be.visible')
      .type('Senha1')
    cy.get('#txtPasswordSignupConfirmation')
      .should('be.visible')
      .type('Senha2')
    cy.contains('button', 'Cadastre-se')
      .click()
    cy.get('#signup-message')
      .should('be.visible')
      .and('have.text', 'Erro: As senhas não coincidem!')
  })
  it('validar mensagem de Erro: A senha deve ter no mínimo 6 caracteres.', () => {
    cy.goToSignUpPage()
    cy.get('#txtEmailSignup')
      .should('be.visible')
      .type(project.email)
    cy.get('#txtPasswordSignup')
      .should('be.visible')
      .type('Senha')
    cy.get('#txtPasswordSignupConfirmation')
      .should('be.visible')
      .type('Senha')
    cy.contains('button', 'Cadastre-se')
      .click()
    cy.get('#signup-message')
      .should('be.visible')
      .and('have.text', 'Erro: A senha deve ter no mínimo 6 caracteres.')
  })
  //refatorar o código abaixo com cy.request
  it('validar mensagem de Erro: Este e-mail já está em uso.', () => {
    cy.successSignUp(project)
    cy.contains('a', 'Sair')
      .click()
    cy.goToSignUpPage()
    cy.get('#txtEmailSignup')
      .should('be.visible')
      .type(project.email)
    cy.get('#txtPasswordSignup')
      .should('be.visible')
      .type('Senha123')
    cy.get('#txtPasswordSignupConfirmation')
      .should('be.visible')
      .type('Senha123')
    cy.contains('button', 'Cadastre-se')
      .click()
    cy.get('#signup-message')
      .should('be.visible')
      .and('have.text', 'Erro: Este e-mail já está em uso.')
  })
  it('validar mensagem de Erro: O e-mail fornecido não é válido.', () => {
    cy.goToSignUpPage()
    cy.get('form').invoke('attr', 'novalidate', 'novalidate') //remove a validação nativa do html que impede o avanço do fluxo teste
    cy.get('#txtEmailSignup')
      .should('be.visible')
      .type('teste')
    cy.get('#txtPasswordSignup')
      .should('be.visible')
      .type('Senha123')
    cy.get('#txtPasswordSignupConfirmation')
      .should('be.visible')
      .type('Senha123')
    cy.contains('button', 'Cadastre-se')
      .click()
    cy.get('#signup-message')
      .should('be.visible')
      .and('have.text', 'Erro: O e-mail fornecido não é válido.')
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