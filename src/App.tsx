
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import AdminLayout from './components/admin/AdminLayout';

// Páginas Públicas
import WelcomePage from './pages/public/WelcomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ReportViewPage from './pages/public/ReportViewPage';

// Página del Formulario del Colaborador
import CollaboratorPage from './pages/ReportEditorPage';

// Onboarding del Cliente
import AreasIntroPage from './pages/onboarding/AreasIntroPage';
import AreaBuilderPage from './pages/onboarding/AreaBuilderPage';

// Panel del Cliente
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Panel de Futurlogix
import TemplateListPage from './pages/admin/TemplateListPage';
import ModuleListPage from './pages/admin/ModuleListPage';
import AreaListPage from './pages/admin/AreaListPage';

// Componentes y Páginas de Estado
import RoleBasedProtectedRoute from './components/common/RoleBasedProtectedRoute';
const NotFoundPage = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h2>404 - Página No Encontrada</h2></div>;
const UnauthorizedPage = () => <div style={{ padding: '2rem', textAlign: 'center' }}><h2>Acceso Denegado</h2></div>;

const DashboardRedirect: React.FC = () => {
    const { currentUser, loading } = useAuth();
    if (loading) return <div>Cargando...</div>;
    if (currentUser?.role === 'futurlogix') return <Navigate to="/admin/areas" replace />;
    if (currentUser?.role === 'client') return <Navigate to="/dashboard/client" replace />;
    return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* --- Rutas Públicas y Semi-Públicas --- */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/report/editor/:formId" element={<CollaboratorPage />} />

      {/* --- Rutas Protegidas --- */}
      <Route path="/dashboard" element={<DashboardRedirect />} />
      
      <Route element={<RoleBasedProtectedRoute allowedRoles={['client']} />}>
        <Route path="/onboarding/intro" element={<AreasIntroPage />} />
        <Route path="/onboarding/builder" element={<AreaBuilderPage />} /> 
        <Route path="/dashboard/client" element={<AdminDashboardPage />} />
        <Route path="/report/view/:areaId" element={<ReportViewPage />} />
      </Route>
      
      <Route element={<RoleBasedProtectedRoute allowedRoles={['futurlogix']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="areas" replace />} /> 
          <Route path="templates" element={<TemplateListPage />} />
          <Route path="modules" element={<ModuleListPage />} />
          <Route path="areas" element={<AreaListPage />} />
        </Route>
        {/* La ruta y el componente del editor del consultor se recrearán más adelante */}
      </Route>
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
