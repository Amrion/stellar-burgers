import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi } from '@api';

export type OrdersState = {
  orders: TOrder[];
  orderByNumber: TOrder | undefined;
  isOrdersLoading: boolean;
  isOrderByNumberLoading: boolean;
  errorOrders: string | undefined;
  errorOrderByNumber: string | undefined;
};

const initialState: OrdersState = {
  orders: [],
  orderByNumber: undefined,
  isOrdersLoading: false,
  isOrderByNumberLoading: false,
  errorOrders: undefined,
  errorOrderByNumber: undefined
};

export const getOrdersThunk = createAsyncThunk(
  `orders/getOrders`,
  async () => await getOrdersApi()
);

export const getOrderByNumberThunk = createAsyncThunk(
  `order/getOrderByNumber`,
  async (number: number) => {
    const result = await getOrderByNumberApi(number);
    return result.orders[0];
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  selectors: {
    selectOrders: (ordersSlice) => ordersSlice.orders,
    selectOrderByNumber: (ordersSlice) => ordersSlice.orderByNumber
  },
  reducers: {
    clearOrder: (state) => {
      state.orderByNumber = undefined;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.isOrdersLoading = true;
        state.errorOrders = undefined;
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isOrderByNumberLoading = true;
        state.errorOrderByNumber = undefined;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.isOrdersLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.isOrderByNumberLoading = false;
        state.orderByNumber = action.payload;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.isOrdersLoading = false;
        state.errorOrders =
          action.error.message || 'Не удалось получить список заказов';
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.isOrderByNumberLoading = false;
        state.errorOrderByNumber =
          action.error.message || 'Не удалось получить заказ';
      });
  }
});

export const { selectOrders, selectOrderByNumber } = ordersSlice.selectors;

export const { clearOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
