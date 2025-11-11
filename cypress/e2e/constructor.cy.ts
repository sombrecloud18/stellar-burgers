const SELECTORS = {
  MODAL: '[data-cy="modal"]',
  MODAL_TITLE: '[data-cy="modal-title"]',
  MODAL_CONTENT: '[data-cy="modal-content"]',
  MODAL_CLOSE_BUTTON: '[data-cy="modal-close-button"]',
  INGREDIENT_CARD: '[data-cy="ingredient-card"]',
  ADD_INGREDIENT_BUTTON: '[data-cy="add-ingredient-button"] button',
  ORDER_NUMBER: '[data-cy="order-number"]',
  ORDER_DONE_IMAGE: '[data-cy="order-done-image"]'
};

describe('Проверка бургер-конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      statusCode: 200,
      body: {
        success: true,
        data: require('../fixtures/ingredients.json')
      }
    }).as('getIngredients');

    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { email: 'test@example.com', name: 'Test User' }
      }
    }).as('getUser');

    window.localStorage.setItem('refreshToken', 'test-refresh-token');
    cy.setCookie('accessToken', 'test-access-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Открытие модальных окон ингредиентов', () => {
    it('должно открываться модальное окно при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.MODAL_TITLE).should('contain', 'Детали ингредиента');
      cy.get(SELECTORS.MODAL_CONTENT).should(
        'contain',
        'Краторная булка N-200i'
      );
    });

    it('должно открываться модальное окно для булки', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get(SELECTORS.MODAL_CONTENT).should(
        'contain',
        'Краторная булка N-200i'
      );
    });

    it('должно открываться модальное окно для начинки', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click();
      cy.get(SELECTORS.MODAL_CONTENT).should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('должно открываться модальное окно для соуса', () => {
      cy.contains('Соус Spicy-X').click();
      cy.get(SELECTORS.MODAL_CONTENT).should('contain', 'Соус Spicy-X');
    });
  });

  describe('Закрытие модальных окон ингредиентов', () => {
    it('должно закрываться модальное окно по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно закрываться модальное окно после открытия булки', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно закрываться модальное окно после открытия начинки', () => {
      cy.contains('Биокотлета из марсианской Магнолии').click();
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должно закрываться модальное окно после открытия соуса', () => {
      cy.contains('Соус Spicy-X').click();
      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('должна добавляться булка в конструктор', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Краторная булка N-200i')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должна добавляться начинка в конструктор', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Биокотлета из марсианской Магнолии')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', 'api/orders', {
        statusCode: 200,
        body: {
          success: true,
          name: 'Био-марсианский краторный бургер',
          order: { number: 12345 }
        }
      }).as('createOrder');
    });

    it('должен создаваться заказ при клике на кнопку', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Краторная булка N-200i')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Биокотлета из марсианской Магнолии')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');
    });

    it('должно открываться модальное окно с номером заказа', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Краторная булка N-200i')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Биокотлета из марсианской Магнолии')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.get(SELECTORS.ORDER_NUMBER).should('contain', '12345');
    });

    it('должен отображаться номер заказа в модальном окне', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Краторная булка N-200i')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Биокотлета из марсианской Магнолии')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.ORDER_NUMBER).should('contain', '12345');
    });

    it('должно отображаться изображение статуса заказа', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Краторная булка N-200i')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Биокотлета из марсианской Магнолии')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.ORDER_DONE_IMAGE).should('be.visible');
    });

    it('должны отображаться тексты в модальном окне заказа', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Краторная булка N-200i')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Биокотлета из марсианской Магнолии')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');
      cy.contains('Дождитесь готовности на орбитальной станции').should(
        'be.visible'
      );
    });
  });

  describe('Закрытие модального окна заказа', () => {
    beforeEach(() => {
      cy.intercept('POST', 'api/orders', {
        statusCode: 200,
        body: {
          success: true,
          name: 'Био-марсианский краторный бургер',
          order: { number: 12345 }
        }
      }).as('createOrder');
    });

    it('должно закрываться модальное окно заказа по клику на крестик', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Краторная булка N-200i')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Биокотлета из марсианской Магнолии')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('должен очищаться конструктор после закрытия модального окна заказа', () => {
      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Краторная булка N-200i')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.get(SELECTORS.INGREDIENT_CARD)
        .contains('Биокотлета из марсианской Магнолии')
        .closest(SELECTORS.INGREDIENT_CARD)
        .find(SELECTORS.ADD_INGREDIENT_BUTTON)
        .click();

      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.MODAL_CLOSE_BUTTON).click();

      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      cy.contains('Краторная булка N-200i (низ)').should('not.exist');
    });
  });

  afterEach(() => {
    cy.clearCookies();
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
      win.localStorage.removeItem('accessToken');
    });
  });
});
