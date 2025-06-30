import { Link } from 'react-router-dom';
import styles from './AreasIntroPage.module.css';

// URLs de los logos
const futurlogixLogoUrl = "https://i.imgur.com/sKQhiGY.png";

const AreasIntroPage = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>¡Bienvenido a Journeest!</h1>
        <p className={styles.subtitle}>Estás a punto de iniciar el diagnóstico de tu empresa.</p>
        
        <div className={styles.content}>
          <p>
            El siguiente paso es fundamental: vamos a definir las <strong>áreas clave</strong> de tu negocio. Piensa en los departamentos o funciones principales que componen tu operación, como por ejemplo:
          </p>
          <ul>
            <li>Recepción y Reservas</li>
            <li>Marketing y Ventas</li>
            <li>Restauración (F&B)</li>
            <li>Mantenimiento y Limpieza</li>
            <li>Administración y Finanzas</li>
          </ul>
          <p>
            Al definir estas áreas y asignar un responsable a cada una, podremos realizar un análisis profundo y personalizado, departamento por departamento.
          </p>
        </div>

        <Link to="/onboarding/areas" className={styles.startButton}>
          Empezar a Crear Áreas
        </Link>
      </div>

      <footer className={styles.footer}>
        <p>Powered by</p>
        <img src={futurlogixLogoUrl} alt="Futurlogix Logo" className={styles.logoFuturlogix} />
      </footer>
    </div>
  );
};

export default AreasIntroPage;
