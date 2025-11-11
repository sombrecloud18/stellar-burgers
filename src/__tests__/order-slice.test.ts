import {
  createOrder,
  getFeedOrders,
  getUserOrders,
  getOrderByNumber,
  clearOrder,
  orderReducer
} from '../services/slices/order-slice';

jest.mock('../utils/burger-api.ts', () => ({
  orderBurgerApi: jest.fn(),
  getFeedsApi: jest.fn(),
  getOrdersApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

jest.mock('../services/slices/constructor-slice', () => ({
  clearConstructor: jest.fn()
}));

jest.mock('../utils/error-types', () => ({
  getErrorMessage: jest.fn((error) => error.message)
}));

describe('Тест слайса заказов', () => {
  const initialState = {
    order: null,
    loading: false,
    error: null,
    createdOrder: null,
    feedOrders: [],
    userOrders: [],
    total: 0,
    totalToday: 0
  };

  const mockOrder = {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Тестовый заказ',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    number: 1
  };

  const mockFeedResponse = {
    orders: [mockOrder],
    total: 100,
    totalToday: 10
  };

  const mockUserOrders = [mockOrder];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    test('Тест createOrder.pending', () => {
      const action = { type: createOrder.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Тест createOrder.fulfilled', () => {
      const action = {
        type: createOrder.fulfilled.type,
        payload: { order: mockOrder }
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.createdOrder).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    test('Тест createOrder.rejected', () => {
      const errorMessage = 'Ошибка создания заказа';
      const action = {
        type: createOrder.rejected.type,
        payload: errorMessage
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getFeedOrders', () => {
    test('Тест getFeedOrders.pending', () => {
      const action = { type: getFeedOrders.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Тест getFeedOrders.fulfilled', () => {
      const action = {
        type: getFeedOrders.fulfilled.type,
        payload: mockFeedResponse
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.feedOrders).toEqual(mockFeedResponse.orders);
      expect(state.total).toBe(mockFeedResponse.total);
      expect(state.totalToday).toBe(mockFeedResponse.totalToday);
      expect(state.error).toBeNull();
    });

    test('Тест getFeedOrders.rejected', () => {
      const errorMessage = 'Ошибка загрузки ленты заказов';
      const action = {
        type: getFeedOrders.rejected.type,
        payload: errorMessage
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getUserOrders', () => {
    test('Тест getUserOrders.pending', () => {
      const action = { type: getUserOrders.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Тест getUserOrders.fulfilled', () => {
      const action = {
        type: getUserOrders.fulfilled.type,
        payload: mockUserOrders
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual(mockUserOrders);
      expect(state.error).toBeNull();
    });

    test('Тест getUserOrders.rejected', () => {
      const errorMessage = 'Ошибка загрузки заказов пользователя';
      const action = {
        type: getUserOrders.rejected.type,
        payload: errorMessage
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getOrderByNumber', () => {
    test('Тест getOrderByNumber.pending', () => {
      const action = { type: getOrderByNumber.pending.type };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('Тест getOrderByNumber.fulfilled', () => {
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: mockOrder
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    test('Тест getOrderByNumber.rejected', () => {
      const errorMessage = 'Ошибка загрузки заказа по номеру';
      const action = {
        type: getOrderByNumber.rejected.type,
        payload: errorMessage
      };
      const state = orderReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('clearOrder', () => {
    test('Тест очистки заказа', () => {
      const stateWithData = {
        ...initialState,
        order: mockOrder,
        createdOrder: mockOrder,
        error: 'Какая-то ошибка'
      };

      const action = clearOrder();
      const state = orderReducer(stateWithData, action);

      expect(state.order).toBeNull();
      expect(state.createdOrder).toBeNull();
      expect(state.error).toBeNull();
    });
  });
});
