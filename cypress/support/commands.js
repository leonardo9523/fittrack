// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//Comando para cadastro de usuário com sucesso
Cypress.Commands.add('successSignUp', (project) => {
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

// Comando para limpar o Auth
Cypress.Commands.add('clearFirebaseAuth', () => {
  cy.request({
    method: 'DELETE',
    url: `http://127.0.0.1:9099/emulator/v1/projects/the-fittrack-project/accounts`,
  });
});

// Comando para limpar o Firestore
Cypress.Commands.add('clearFirestore', () => {
  cy.request({
    method: 'DELETE',
    url: `http://127.0.0.1:8080/emulator/v1/projects/the-fittrack-project/databases/(default)/documents`,
  });
});