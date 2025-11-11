import { TConstructorIngredient } from '@utils-types';
import { createSlice } from '@reduxjs/toolkit';

interface IConstructorState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
}

export const initialState: IConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'constructorIngredients',
  initialState,
  reducers: {
    addIngredient: (state, action) => {
      action.payload.type === 'bun'
        ? (state.bun = action.payload)
        : state.ingredients.push(action.payload);
    },
    deleteIngredient: (state, action) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredients: (state, action) => {
      const { from, to } = action.payload;
      [state.ingredients[from], state.ingredients[to]] = [
        state.ingredients[to],
        state.ingredients[from]
      ];
    },
    clearConstructor: (state) => {
      state.ingredients = [];
      state.bun = null;
    }
  }
});

export const {
  addIngredient,
  deleteIngredient,
  moveIngredients,
  clearConstructor
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
