import { rootReducer } from '../services/store';

describe('rootReducer', () => {
  test('Проверка инициализации корневого редьюсера', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredientsArr: [],
        error: null,
        loading: false
      },
      constructorIng: {
        bun: null,
        ingredients: []
      },
      order: {
        order: null,
        loading: false,
        error: null,
        createdOrder: null,
        feedOrders: [],
        userOrders: [],
        total: 0,
        totalToday: 0
      },
      auth: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        errors: null
      }
    });
  });
});
