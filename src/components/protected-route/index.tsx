import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { ReactNode } from 'react';

interface IProtectedRouteProps {
  children: ReactNode;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: IProtectedRouteProps) => {
  const isAuth = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.isLoading);
  const location = useLocation();

  // Если маршрут только для НЕавторизованных и пользователь авторизован
  if (onlyUnAuth && isAuth) {
    // Редиректим на главную или откуда пришел
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  // Если маршрут защищенный и пользователь НЕ авторизован
  if (!onlyUnAuth && !isAuth) {
    if (location.pathname.startsWith('/profile/orders/')) {
      const orderNumber = location.pathname.split('/').pop(); // Получаем номер заказа
      return <Navigate to={`/feed/${orderNumber}`} replace />;
    }
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Все проверки пройдены - рендерим children
  return <>{children}</>;
};
