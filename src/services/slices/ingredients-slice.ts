import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export interface IngredientsState {
  ingredientsArr: TIngredient[];
  error: string | null;
  loading: boolean;
}

const initialState: IngredientsState = {
  ingredientsArr: [],
  error: null,
  loading: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => await getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredientsArr = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
        console.log('Ошибка загрузки ингредиентов');
      });
  }
});
// В ingredients-slice.ts
export const selectIngredients = (state: { ingredients: IngredientsState }) =>
  state.ingredients.ingredientsArr;

export const selectIngredientsLoading = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.loading;

// Экспорты
export const ingredientsReducer = ingredientsSlice.reducer;
