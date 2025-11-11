import {
  constructorReducer,
  addIngredient,
  deleteIngredient,
  moveIngredients,
  initialState
} from '../services/slices/constructor-slice';

describe('Тест слайса конструктора', () => {
  const mockBun = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    id: 'bun-1'
  };

  const mockIngredient1 = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    id: 'ingredient-1'
  };

  const mockIngredient2 = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    id: 'ingredient-2'
  };

  const mockIngredient3 = {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
    id: 'ingredient-3'
  };

  describe('Обработка экшенов', () => {
    test('Обработка экшена добавления ингредиента (булка)', () => {
      const action = addIngredient(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toEqual(mockBun);
      expect(state.ingredients).toEqual([]);
    });

    test('Обработка экшена добавления ингредиента (не булка)', () => {
      const action = addIngredient(mockIngredient1);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual(mockIngredient1);
    });

    test('Обработка экшена удаления ингредиента', () => {
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
      };

      const action = deleteIngredient('ingredient-2');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe('ingredient-1');
      expect(state.ingredients[1].id).toBe('ingredient-3');
      expect(state.bun).toEqual(mockBun);
    });

    test('Проверка на удаление несуществующего ингредиента', () => {
      const stateWithIngredients = {
        bun: mockBun,
        ingredients: [mockIngredient1, mockIngredient2]
      };

      const action = deleteIngredient('non-existent-id');
      const state = constructorReducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe('ingredient-1');
      expect(state.ingredients[1].id).toBe('ingredient-2');
    });
  });
  test('Перемещение ингредиента с позиции 0 на позицию 2', () => {
    const stateWithIngredients = {
      bun: mockBun,
      ingredients: [mockIngredient1, mockIngredient2, mockIngredient3]
    };
    const moveInfo = { from: 0, to: 2 };
    const action = moveIngredients(moveInfo);
    const state = constructorReducer(stateWithIngredients, action);

    expect(state.ingredients).toHaveLength(3);

    expect(state.bun).toEqual(mockBun);
    const ingredientIds = state.ingredients.map((ing) => ing.id);
    expect(ingredientIds).toContain('ingredient-1');
    expect(ingredientIds).toContain('ingredient-2');
    expect(ingredientIds).toContain('ingredient-3');
  });
});
