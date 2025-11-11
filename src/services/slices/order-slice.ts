import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';
import { getFeedsApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { clearConstructor } from './constructor-slice';
import { ApiError, getErrorMessage } from '../../utils/error-types';

interface IOrderState {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
  createdOrder: TOrder | null;
  feedOrders: TOrder[];
  userOrders: TOrder[];
  total: number;
  totalToday: number;
}

export const initialState: IOrderState = {
  order: null,
  loading: false,
  error: null,
  createdOrder: null,
  feedOrders: [],
  userOrders: [],
  total: 0,
  totalToday: 0
};

// Создаем заказ
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: string[], { rejectWithValue, dispatch }) => {
    try {
      const response = await orderBurgerApi(data);
      dispatch(clearOrder());
      dispatch(clearConstructor());
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Получаем все заказы (лента)
export const getFeedOrders = createAsyncThunk(
  'orders/getFeedOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Получает заказы юзера
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Получает заказ по его номеру
export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (data: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(data);
      return response.orders[0];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Создаем слайс
export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
      state.createdOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrders: (state) => {
      state.feedOrders = [];
      state.userOrders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.createdOrder = action.payload.order;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getFeedOrders
      .addCase(getFeedOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.feedOrders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.error = null;
      })
      .addCase(getFeedOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getUserOrders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getOrderByNumber
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Селекторы
export const selectCreatedOrder = (state: { order: IOrderState }) =>
  state.order.createdOrder;
export const selectOrderLoading = (state: { order: IOrderState }) =>
  state.order.loading;
export const selectOrderError = (state: { order: IOrderState }) =>
  state.order.error;
export const selectFeedOrders = (state: { order: IOrderState }) =>
  state.order.feedOrders;
export const selectUserOrders = (state: { order: IOrderState }) =>
  state.order.userOrders;
export const selectTotal = (state: { order: IOrderState }) => state.order.total;
export const selectTotalToday = (state: { order: IOrderState }) =>
  state.order.totalToday;
export const selectOrder = (state: { order: IOrderState }) => state.order.order;

// Экспорты
export const { clearOrder, clearOrderError, clearOrders } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
