// src/components/common/RoleBasedProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../../types';

type AllowedRole = UserProfile['role'];

interface RoleBasedProtectedRouteProps {
  allowedRoles: AllowedRole[];
}

const RoleBasedProtectedRoute: React.FC<RoleBasedProtectedRouteProps> = ({ allowedRoles }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Verificando autenticación...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.includes(currentUser.role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
};

export default RoleBasedProtectedRoute;
