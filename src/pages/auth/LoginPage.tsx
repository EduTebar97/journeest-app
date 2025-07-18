
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // El login devuelve el perfil del usuario, pero no necesitamos chequear el rol aquí.
      await login(email, password);
      
      // La redirección ahora es mucho más simple.
      // Enviamos a todos los usuarios a /dashboard, que se encargará de
      // redirigir al panel de admin o a donde corresponda.
      navigate('/dashboard', { replace: true });

    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email o contraseña incorrectos.');
      } else {
        setError('Fallo en el inicio de sesión. Por favor, inténtalo de nuevo.');
        console.error(err);
      }
      setLoading(false); // Asegúrate de parar la carga en caso de error
    }
    // No es necesario el finally, el setLoading se maneja en los dos caminos (éxito/error).
  };

  return (
    <div style={styles.container}>
        <div style={styles.loginBox}>
            <h2 style={styles.title}>Iniciar Sesión</h2>
            <p style={styles.subtitle}>Bienvenido de nuevo a Journeest.</p>
            <form onSubmit={handleSubmit}>
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="password" style={styles.label}>Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Iniciando sesión...' : 'Login'}
                </button>
            </form>
        </div>
    </div>
  );
};

// Styles for a more modern look
const styles: { [key: string]: React.CSSProperties } = {
    container: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
    loginBox: { padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    title: { textAlign: 'center', color: '#172b4d', marginBottom: '10px' },
    subtitle: { textAlign: 'center', color: '#5e6c84', marginBottom: '30px' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#5e6c84' },
    input: { width: '100%', padding: '10px', border: '1px solid #dfe1e6', borderRadius: '3px', boxSizing: 'border-box' },
    error: { color: '#de350b', textAlign: 'center', marginBottom: '15px' },
    button: { width: '100%', padding: '12px', border: 'none', borderRadius: '3px', backgroundColor: '#0052cc', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }
};

export default LoginPage;
