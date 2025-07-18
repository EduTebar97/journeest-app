// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // While the auth state is being checked, show a loading message
    // or a spinner. This prevents a flicker to the login page.
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    // If loading is finished and there's no user, redirect to login.
    return <Navigate to="/login" replace />;
  }

  // If loading is finished and there is a user, render the child route.
  // <Outlet /> is a placeholder for the actual page component.
  return <Outlet />;
};

export default ProtectedRoute;
