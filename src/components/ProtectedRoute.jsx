import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isLoading, hasRole } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Non authentifié
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authentifié mais rôle non autorisé
  if (roles.length > 0 && !hasRole(roles)) {
    // Redirection selon le rôle
    if (user.role === 'client') {
      return <Navigate to="/client/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;