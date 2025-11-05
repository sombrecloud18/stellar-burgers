import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedOrders,
  selectFeedOrders,
  selectOrderLoading
} from '../../services/slices/order-slice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedOrders);
  const loading = useSelector(selectOrderLoading);

  const handleGetFeeds = () => {
    dispatch(getFeedOrders());
  };

  useEffect(() => {
    dispatch(getFeedOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (!orders.length) {
    return (
      <div>
        <Preloader />
        <p>Заказы загружаются...</p>
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
