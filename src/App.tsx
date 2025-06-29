import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import RegisterPage from './pages/auth/RegisterPage';
import AreasIntroPage from './pages/onboarding/AreasIntroPage';
import AreaBuilderPage from './pages/onboarding/AreaBuilderPage';
import CollaboratorPage from './pages/CollaboratorPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import FuturlogixDashboard from './pages/admin/FuturlogixDashboard';
import LoginPage from './pages/auth/LoginPage';

function App() {
  return (
    <Routes>
      {/* Rutas Públicas */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/area/:token" element={<CollaboratorPage />} />

      {/* Rutas de Onboarding (Protegidas) */}
      <Route path="/onboarding/areas/intro" element={<AreasIntroPage />} />
      <Route path="/onboarding/areas" element={<AreaBuilderPage />} />

      {/* Rutas de Cliente (Protegidas) */}
      <Route path="/dashboard" element={<AdminDashboardPage />} />

      {/* Rutas de Back-office (Súper Protegidas) */}
      <Route path="/futurlogix/dashboard" element={<FuturlogixDashboard />} />
      
      {/* Añadir una ruta para páginas no encontradas */}
      <Route path="*" element={<h1>404: Página no encontrada</h1>} />
    </Routes>
  );
}

export default App;
