import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROLES } from '../lib/constants';

export function ClientRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const loc = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (user.role !== ROLES.CLIENT) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const loc = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: loc }} replace />;
  }

  if (user.role !== ROLES.ADMIN && user.role !== ROLES.MANAGER) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
