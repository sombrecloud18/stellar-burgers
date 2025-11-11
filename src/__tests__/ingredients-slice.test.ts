import {
  fetchIngredients,
  ingredientsReducer
} from '../services/slices/ingredients-slice';

jest.mock('../utils/burger-api.ts', () => ({
  getIngredientsApi: jest.fn()
}));

const mockGetIngredients = require('../utils/burger-api.ts').getIngredientsApi;

describe('Тест слайса ингредиентов', () => {
  const initialState = {
    ingredientsArr: [],
    error: null,
    loading: false
  };

  const mockIngredients = [
    {
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
    },
    {
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
    },
    {
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
    }
  ];

  beforeEach(() => {
    mockGetIngredients.mockClear();
  });

  describe('fetchIngredients', () => {
    test('Тест fetchIngredients.pending', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.ingredientsArr).toEqual([]);
      expect(state.error).toBeNull();
    });

    test('Тест fetchIngredients.fulfilled', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.ingredientsArr).toEqual(mockIngredients);
      expect(state.ingredientsArr).toHaveLength(3);
      expect(state.error).toBeNull();
    });

    test('Тест fetchIngredients.rejected', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка загрузки ингредиентов' }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.ingredientsArr).toEqual([]);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });
  });
});
