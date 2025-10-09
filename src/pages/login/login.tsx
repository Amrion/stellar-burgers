import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isUserAuth, loginUserThunk } from '../../services/slices/user';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isAuth = useSelector(isUserAuth);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Необходимо заполнить все поля');
      return;
    }

    dispatch(loginUserThunk({ email, password }));

    if (isAuth) {
      setError('');
      navigate(location.state?.from, { replace: true });

      return;
    }

    setError('Неверный логин или пароль');
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
