import React from 'react'; // Esta línea es NECESARIA para que JSX funcione
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Este componente recibe como 'props' a los 'children', que en este caso
// será la página que queremos proteger.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth(); // Usamos el hook para obtener el usuario actual

  // Si no hay un usuario logueado...
  if (!currentUser) {
    // ...redirigimos al usuario a la página de login.
    // El 'replace' evita que el usuario pueda volver atrás con el botón del navegador.
    return <Navigate to="/login" replace />;
  }

  // Si hay un usuario, simplemente mostramos la página que quería ver.
  return children;
};

export default ProtectedRoute;
