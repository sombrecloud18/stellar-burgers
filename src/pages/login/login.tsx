import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  clearError,
  login,
  selectError,
  selectIsLoading
} from '../../services/slices/auth-slice';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Очищаем ошибку перед новым запросом
    dispatch(clearError());

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.log('Login error in component:', err);
      });
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
