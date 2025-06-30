import { Link } from 'react-router-dom';

const ConfirmationPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>¡Invitaciones Enviadas!</h1>
      <p>Hemos enviado un correo a cada responsable de área con su enlace personal.</p>
      <p>Ahora puedes monitorizar el progreso desde tu panel de control.</p>
      <Link to="/dashboard" style={{
        display: 'inline-block',
        marginTop: '2rem',
        padding: '1rem 2rem',
        backgroundColor: '#4A90E2',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600'
      }}>
        Ir a mi Dashboard
      </Link>
    </div>
  );
};

export default ConfirmationPage;