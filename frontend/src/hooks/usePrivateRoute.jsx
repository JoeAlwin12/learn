import { useAuth } from '../context/AuthContext';

export function usePrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  
  return {
    isAuthenticated,
    loading,
  };
}
