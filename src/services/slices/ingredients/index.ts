import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';

export type IngredientState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | undefined;
};

const initialState: IngredientState = {
  ingredients: [],
  isLoading: false,
  error: undefined
};

export const getIngredientsThunk = createAsyncThunk(
  `ingredients/getIngredients`,
  async () => await getIngredientsApi()
);

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    selectIngredients: (ingredientSlice) => ingredientSlice.ingredients,
    selectIsLoading: (ingredientSlice) => ingredientSlice.isLoading
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось получить список ингредиентов';
      });
  }
});

export const { selectIngredients, selectIsLoading } = ingredientSlice.selectors;

export default ingredientSlice.reducer;
