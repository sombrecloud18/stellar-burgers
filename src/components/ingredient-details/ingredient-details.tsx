import { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { TIngredient } from '@utils-types';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const { ingredientsArr, loading } = useSelector((state) => state.ingredients);

  useEffect(() => {
    if (ingredientsArr.length === 0) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredientsArr.length]);

  if (loading) {
    return <Preloader />;
  }

  const ingredientData = ingredientsArr.find(
    (ingredient: TIngredient) => ingredient._id === id
  );

  if (!ingredientData) {
    return <h2>Ингредиент не найден</h2>;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
