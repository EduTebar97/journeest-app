import { Link } from 'react-router-dom';
import styles from './WelcomePage.module.css';

const WelcomePage = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Journeest</h1>
        <nav>
          <Link to="/login" className={styles.navLink}>Iniciar Sesión</Link>
          <Link to="/registro" className={`${styles.navLink} ${styles.ctaButton}`}>Empezar Diagnóstico</Link>
        </nav>
      </header>
      <main className={styles.mainContent}>
        <div className={styles.hero}>
          <h2 className={styles.title}>Transforma tu negocio turístico con inteligencia.</h2>
          <p className={styles.subtitle}>
            Journeest es la plataforma que te guía para descubrir ineficiencias,
            optimizar procesos y potenciar tu empresa con automatización e IA.
          </p>
          <Link to="/registro" className={`${styles.navLink} ${styles.ctaButtonLarge}`}>
            Comienza tu diagnóstico gratuito
          </Link>
        </div>
        <div className={styles.howItWorks}>
            <h3>¿Cómo funciona?</h3>
            <div className={styles.steps}>
                <div className={styles.step}>
                    <h4>1. Registra tu empresa</h4>
                    <p>Crea tu cuenta y define la estructura y áreas clave de tu negocio.</p>
                </div>
                 <div className={styles.step}>
                    <h4>2. Colabora con tu equipo</h4>
                    <p>Invita a los responsables de cada área a completar un análisis detallado.</p>
                </div>
                 <div className={styles.step}>
                    <h4>3. Recibe tus informes</h4>
                    <p>Nuestra IA analiza los datos y genera informes de valor y propuestas de automatización.</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;
