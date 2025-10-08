import { configureStore, combineReducers } from '@reduxjs/toolkit';

import burgerConstructorReducer from './slices/burgersConstructor';
import feedReducer from './slices/feed';
import ingredientReducer from './slices/ingredients';
import ordersReducer from './slices/orders';
import userReducer from './slices/user';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  ingredients: ingredientReducer,
  orders: ordersReducer,
  user: userReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
