import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  selectOrderLoading,
  selectUserOrders
} from '../../services/slices/order-slice';
import { Preloader } from '../../components/ui/preloader';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const loading = useSelector(selectOrderLoading);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Preloader />
        <p className='text text_type_main-default text_color_inactive mt-4'>
          Загрузка истории заказов...
        </p>
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
