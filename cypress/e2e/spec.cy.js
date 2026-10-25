  const project = {
    email: 'teste@email.com',
    senha: 'Senha123'
  }

  const selectors = {
    signup: {
      email: '#txtEmailSignup',
      password: '#txtPasswordSignup',
      passwordConfirmation: '#txtPasswordSignupConfirmation'
    },
    signin: {
      email: '#txtEmailSignin',
      password: '#txtPasswordSignin'
    },
    workout: {
      save: '#btnSave'
    }
}

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

  //Cadastro
  it('cadastro na aplicação', () => {
    cy.successSignUp(project)
  })
  //Erros no cadastro
  it('validar mensagem de Erro: As senhas não coincidem!', () => {
    cy.goToSignUpPage()
    cy.preencherCampo(selectors.signup.email, project.email)
    cy.preencherCampo(selectors.signup.password, 'Senha1')
    cy.preencherCampo(selectors.signup.passwordConfirmation, 'Senha2')
    cy.clicarBotao('Cadastre-se')
    cy.get('#signup-message')
      .should('be.visible')
      .and('have.text', 'Erro: As senhas não coincidem!')
  })
  it('validar mensagem de Erro: A senha deve ter no mínimo 6 caracteres.', () => {
    cy.goToSignUpPage()
    cy.preencherCampo(selectors.signup.email, project.email)
    cy.preencherCampo(selectors.signup.password, 'Senha')
    cy.preencherCampo(selectors.signup.passwordConfirmation, 'Senha')
    cy.clicarBotao('Cadastre-se')
    cy.get('#signup-message')
      .should('be.visible')
      .and('have.text', 'Erro: A senha deve ter no mínimo 6 caracteres.')
  })
  it('validar mensagem de Erro: Este e-mail já está em uso.', () => {
    cy.CreateFirebaseAuthUser(project)
    cy.goToSignUpPage()
    cy.preencherCampo(selectors.signup.email, project.email)
    cy.preencherCampo(selectors.signup.password, 'Senha123')
    cy.preencherCampo(selectors.signup.passwordConfirmation, 'Senha123')
    cy.clicarBotao('Cadastre-se')
    cy.get('#signup-message')
      .should('be.visible')
      .and('have.text', 'Erro: Este e-mail já está em uso.')
  })
  it('validar mensagem de Erro: O e-mail fornecido não é válido.', () => {
    cy.goToSignUpPage()
    cy.get('form').invoke('attr', 'novalidate', 'novalidate') //remove a validação nativa do html que impede o avanço do fluxo teste
    cy.preencherCampo(selectors.signup.email, 'teste')
    cy.preencherCampo(selectors.signup.password, 'Senha123')
    cy.preencherCampo(selectors.signup.passwordConfirmation, 'Senha123')
    cy.clicarBotao('Cadastre-se')
    cy.get('#signup-message')
      .should('be.visible')
      .and('have.text', 'Erro: O e-mail fornecido não é válido.')
  })

  //Login
  it('cadastro seguido de signout e login na aplicação', () => {
    cy.successSignUp(project)
    cy.contains('a', 'Sair')
      .click()
    cy.preencherCampo(selectors.signin.email, project.email)
    cy.preencherCampo(selectors.signin.password, project.senha)
    cy.clicarBotao('Entrar')
    cy.contains('h1', 'Treinos favoritos')
  })
  it('validar mensagem de erro no login', () => {
    cy.preencherCampo(selectors.signin.email, 'emailfalso@email.com')
    cy.preencherCampo(selectors.signin.password, 'a')
    cy.clicarBotao('Entrar')
    cy.get('#signin-message')
      .should('be.visible')
      .and('have.text', 'E-mail ou senha inválidos.')
  })
  it('validar alerta de erro no login ao não preencher os campos', () => {
    cy.on('window:alert', (texto) => {
      expect(texto).to.equal('Por favor, preencha todos os campos.');
    });
    cy.clicarBotao('Entrar')
  })
})

describe('Registro de treinos', () => {
  before(() => {
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
    cy.CreateFirebaseAuthUserAndFirestore(project)
    cy.visit('http://localhost:5173')
    cy.logIn(project)
  })
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })
    const project = {
    email: 'teste@email.com',
    senha: 'Senha123'
  }
  it('Registrar treino', () => {
    cy.get('#btnRegistrarNovoTreino')
      .should('be.visible')
      .click()
    cy.get('#textDate')
      .click()
    cy.preencherCampo(':nth-child(1) > .card-content-edit > .position-relative > .exercise-input', 'Supino inclinado com halteres')
    cy.preencherCampo(':nth-child(1) > .card-content-edit > :nth-child(3) > .num-series-input', '3')
    cy.preencherCampo(':nth-child(1) > :nth-child(2) > .input-group > .weight-input', '30')
    cy.preencherCampo(':nth-child(1) > :nth-child(3) > .input-group > .reps-input', '5')
    cy.preencherCampo(':nth-child(2) > :nth-child(2) > .input-group > .weight-input', '28')
    cy.preencherCampo(':nth-child(2) > :nth-child(3) > .input-group > .reps-input', '6')
    cy.preencherCampo(':nth-child(3) > :nth-child(2) > .input-group > .weight-input', '25')
    cy.preencherCampo(':nth-child(3) > :nth-child(3) > .input-group > .reps-input', '7')
    cy.clicarBotao('Confirmar Exercício')
    cy.get(selectors.workout.save)
      .click()
    cy.contains('p', '5 Repetições')
      .should('be.visible')
    cy.contains('p', 'Carga: 30 kg')
      .should('be.visible')
    cy.contains('p', '6 Repetições')
      .should('be.visible')
    cy.contains('p', 'Carga: 28 kg')
      .should('be.visible')
    cy.contains('p', '7 Repetições')
      .should('be.visible')
    cy.contains('p', 'Carga: 25 kg')
      .should('be.visible')
  })
})