import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';
import styles from './LoginPage.module.css'; // Usaremos un nuevo archivo de estilos

// URL del logo de Journeest
const journeestLogoUrl = "https://i.imgur.com/IKpS29L.png";

const LoginPage = () => {
  // Estados para el formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para la carga y errores
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook para redirigir
  const navigate = useNavigate();

  // Función para manejar el inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Iniciar sesión con Firebase
      await signInWithEmailAndPassword(auth, email, password);
      
      // Si tiene éxito, redirigir al dashboard
      navigate('/dashboard');

    } catch (err: any) {
      // Manejo de errores comunes de Firebase
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('El correo o la contraseña son incorrectos.');
      } else {
        setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
        console.error('Login Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <img src={journeestLogoUrl} alt="Journeest Logo" className={styles.logo} />
        <h2 className={styles.title}>Bienvenido de nuevo</h2>
        <p className={styles.subtitle}>Inicia sesión para acceder a tu panel.</p>
        
        <form onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className={styles.registerLink}>
          ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

