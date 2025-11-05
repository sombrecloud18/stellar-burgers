import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { createOrder, clearOrder } from '../../services/slices/order-slice';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../services/slices/auth-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorState = useSelector((state) => state.constructorIng);
  const orderState = useSelector((state) => state.order);
  const user = useSelector(selectUser);

  // Безопасные значения по умолчанию
  const bun = constructorState?.bun || null;
  const ingredients = constructorState?.ingredients || [];
  const order = orderState?.createdOrder || null;
  const orderRequest = orderState?.loading || false;

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    // Проверяем авторизацию
    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    // Проверяем, что есть булка и ингредиенты, и нет активного запроса
    if (!bun || ingredients.length === 0 || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item: TConstructorIngredient) => item._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={order}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
