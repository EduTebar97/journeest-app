import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import AreasIntroPage from './pages/onboarding/AreasIntroPage';
import AreaBuilderPage from './pages/onboarding/AreaBuilderPage';
import CollaboratorPage from './pages/CollaboratorPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FuturlogixDashboard from './pages/admin/FuturlogixDashboard';
import ProtectedRoute from './components/common/ProtectedRoute'; // Importamos el guardia

function App() {
  return (
    <Routes>
      {/* --- Rutas Públicas --- */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/area/:token" element={<CollaboratorPage />} />

      {/* --- Rutas Protegidas --- */}
      {/* Envolvemos cada página protegida con nuestro componente ProtectedRoute */}
      <Route 
        path="/onboarding/areas/intro" 
        element={<ProtectedRoute><AreasIntroPage /></ProtectedRoute>} 
      />
      <Route 
        path="/onboarding/areas" 
        element={<ProtectedRoute><AreaBuilderPage /></ProtectedRoute>} 
      />
      <Route 
        path="/dashboard" 
        element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} 
      />
      
      {/* --- Rutas de Back-office (las protegeremos más adelante con otro rol) --- */}
      <Route path="/futurlogix/dashboard" element={<FuturlogixDashboard />} />
      
      <Route path="*" element={<h1>404: Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;

import ConfirmationPage from './pages/onboarding/ConfirmationPage';

// ... y luego, dentro de <Routes>, añade esta ruta:
<Route 
  path="/onboarding/confirmacion" 
  element={<ProtectedRoute><ConfirmationPage /></ProtectedRoute>} 
/>
