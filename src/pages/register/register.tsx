import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  register,
  clearError,
  selectError,
  selectIsLoading
} from '../../services/slices/auth-slice';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  // Очищаем ошибки при размонтировании компонента
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    // Диспатчим thunk регистрации
    dispatch(register({ email, password, name: userName }))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.log('Login error in component:', err);
      });
  };

  return (
    <RegisterUI
      errorText={error || 'Ошибка регистрации'}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
