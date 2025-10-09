import { orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { RootState } from '../../store';

type BurgerConstructorItems = {
  bun: TConstructorIngredient | undefined;
  ingredients: TConstructorIngredient[];
};

type BurgerConstructorState = {
  constructorItems: BurgerConstructorItems;
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialBurgerState: BurgerConstructorState = {
  constructorItems: {
    bun: undefined,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null
};

export const orderBurgerThunk = createAsyncThunk(
  'order/orderBurger',
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { bun, ingredients } = state.burgerConstructor.constructorItems;

    if (!bun) {
      return;
    }

    if (ingredients.length === 0) {
      return;
    }

    const ingredientsById = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const result = await orderBurgerApi(ingredientsById);
    return result.order;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: initialBurgerState,
  selectors: {
    selectConstructorItems: (sliceState) => sliceState.constructorItems,
    selectOrderRequest: (sliceState) => sliceState.orderRequest,
    selectOrderModalData: (sliceState) => sliceState.orderModalData
  },
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.constructorItems.bun = ingredient;
        } else {
          state.constructorItems.ingredients.push(ingredient);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (el) => el.id !== action.payload
        );
    },

    moveIngredientUp: (state, action: PayloadAction<string>) => {
      const currentIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (
        currentIndex <= 0 ||
        currentIndex >= state.constructorItems.ingredients.length
      )
        return;

      const temp = state.constructorItems.ingredients[currentIndex];
      state.constructorItems.ingredients[currentIndex] =
        state.constructorItems.ingredients[currentIndex - 1];
      state.constructorItems.ingredients[currentIndex - 1] = temp;
    },

    moveIngredientDown: (state, action: PayloadAction<string>) => {
      const currentIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload
      );
      if (
        currentIndex < 0 ||
        currentIndex >= state.constructorItems.ingredients.length - 1
      )
        return;

      const temp = state.constructorItems.ingredients[currentIndex];
      state.constructorItems.ingredients[currentIndex] =
        state.constructorItems.ingredients[currentIndex + 1];
      state.constructorItems.ingredients[currentIndex + 1] = temp;
    },

    resetConstructor: (state) => {
      state.constructorItems = { bun: undefined, ingredients: [] };
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurgerThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurgerThunk.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload ?? null;
      });
  }
});

export const {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData
} = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  removeIngredient,
  moveIngredientDown,
  moveIngredientUp,
  resetConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;
