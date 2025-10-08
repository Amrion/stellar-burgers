import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { isUserAuth } from '../../services/slices/user';
// import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  isGuestRoute?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  children,
  isGuestRoute
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = useSelector(isUserAuth);

  if (isGuestRoute && isAuthenticated) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  if (!isGuestRoute && !isAuthenticated) {
    return <Navigate to={'/login'} state={{ from: location }} replace />;
  }

  return children;
};
