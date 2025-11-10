import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '../../services/slices/ingredients-slice';
import {
  getOrderByNumber,
  selectOrder,
  selectOrderLoading
} from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  // Берем данные из store
  const orderData = useSelector(selectOrder);
  const ingredients: TIngredient[] = useSelector(selectIngredients);
  const loading = useSelector(selectOrderLoading);

  useEffect(() => {
    if (number) {
      const orderNumber = parseInt(number, 10);
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Preloader />
        <p className='text text_type_main-default text_color_inactive mt-4'>
          Загрузка деталей заказа...
        </p>
      </div>
    );
  }

  if (!orderInfo) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Preloader />
        <p className='text text_type_main-default text_color_inactive mt-4'>
          {!orderData ? 'Заказ не найден' : 'Загрузка ингредиентов...'}
        </p>
      </div>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
