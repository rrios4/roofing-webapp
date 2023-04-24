import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  return auth?.user ? <>{children}</> : <Navigate to={'/login'} />;
};

export default ProtectedRoute;
