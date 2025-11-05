import { FC } from 'react';
import { useDispatch } from '../../services/store';
import {
  deleteIngredient,
  moveIngredients
} from '../../services/slices/constructor-slice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElementUI } from '../ui/burger-constructor-element';

interface BurgerConstructorElementProps {
  ingredient: TConstructorIngredient;
  index: number;
  totalItems: number;
}

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = ({
  ingredient,
  index,
  totalItems
}) => {
  const dispatch = useDispatch();

  const handleMoveUp = () => {
    if (index > 0) {
      dispatch(moveIngredients({ from: index, to: index - 1 }));
    }
  };

  const handleMoveDown = () => {
    if (index < totalItems - 1) {
      dispatch(moveIngredients({ from: index, to: index + 1 }));
    }
  };

  const handleClose = () => {
    dispatch(deleteIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
};
