import {
  authReducer,
  login,
  register,
  initialState
} from '../services/slices/auth-slice';

jest.mock('../utils/burger-api.ts', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn()
}));

const mockLoginUserApi = require('../utils/burger-api.ts').loginUserApi;
const mockRegisterUserApi = require('../utils/burger-api.ts').registerUserApi;

describe('Тест слайса авторизации', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  beforeEach(() => {
    mockLoginUserApi.mockClear();
    mockRegisterUserApi.mockClear();
  });

  describe('Логин', () => {
    test('Тест login.pending', () => {
      const action = { type: login.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errors).toBeNull();
    });

    test('Тест login.fulfilled', () => {
      const action = {
        type: login.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.errors).toBeNull();
    });

    test('Тест login.rejected', () => {
      const errorMessage = 'Login failed';
      const action = {
        type: login.rejected.type,
        payload: errorMessage
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errors).toBe(errorMessage);
    });
  });

  describe('Регистрация', () => {
    test('Тест register.pending', () => {
      const action = { type: register.pending.type };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.errors).toBeNull();
    });

    test('Тест register.fulfilled', () => {
      const action = {
        type: register.fulfilled.type,
        payload: mockUser
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
      expect(state.errors).toBeNull();
    });

    test('Тест register.rejected', () => {
      const errorMessage = 'Registration failed';
      const action = {
        type: register.rejected.type,
        payload: errorMessage
      };
      const state = authReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.errors).toBe(errorMessage);
    });
  });
});
