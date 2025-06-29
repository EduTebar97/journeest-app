import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css'; // Importaremos estilos globales aquí
import { BrowserRouter } from 'react-router-dom';

// Inicializar Firebase (lo haremos en un archivo de configuración)
import './config/firebase';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
