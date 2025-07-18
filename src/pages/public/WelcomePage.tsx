
import React from 'react';
import { Link } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  return (
    <div style={styles.page}>
      {/* 1. Cabecera de Navegación */}
      <header style={styles.header}>
        <div style={styles.logo}><strong>Journeest</strong></div>
        <nav>
          <Link to="/login" style={styles.navLink}>Iniciar Sesión</Link>
          <Link to="/registro" style={styles.ctaButton}>Empezar Diagnóstico</Link>
        </nav>
      </header>

      <main>
        {/* 2. Sección Héroe */}
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Transforma tu negocio turístico con inteligencia.</h1>
          <p style={styles.heroSubtitle}>
            No vendemos software, ofrecemos una ventaja competitiva. Identifica oportunidades, optimiza procesos y toma decisiones basadas en datos reales de tu operación.
          </p>
          <Link to="/registro" style={{...styles.ctaButton, ...styles.ctaButtonLarge}}>
            Comenzar Diagnóstico Gratuito
          </Link>
        </section>

        {/* 3. Sección "Cómo Funciona" */}
        <section style={styles.howItWorksSection}>
          <h2 style={styles.sectionTitle}>Un proceso claro hacia la excelencia operativa</h2>
          <div style={styles.stepsGrid}>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>1</div>
              <h3 style={styles.stepTitle}>Registra tu Empresa</h3>
              <p style={styles.stepDescription}>Crea tu cuenta de administrador y proporciona los datos básicos de tu negocio. Es el primer paso para establecer el marco de nuestro análisis.</p>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>2</div>
              <h3 style={styles.stepTitle}>Colabora con tu Equipo</h3>
              <p style={styles.stepDescription}>Define las áreas clave de tu negocio y asigna responsables. Ellos nos darán la visión interna necesaria para un diagnóstico preciso.</p>
            </div>
            <div style={styles.stepCard}>
              <div style={styles.stepNumber}>3</div>
              <h3 style={styles.stepTitle}>Recibe tus Informes</h3>
              <p style={styles.stepDescription}>Nuestro equipo, con el apoyo de IA, analiza los datos y genera informes estratégicos. Recibirás un plan de acción claro y aplicable.</p>
            </div>
          </div>
        </section>
      </main>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Journeest. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

// --- Estilos Profesionales ---
const styles: { [key: string]: React.CSSProperties } = {
  page: { fontFamily: "'Inter', sans-serif", color: '#172b4d', backgroundColor: '#ffffff' },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '20px 50px', 
    borderBottom: '1px solid #dfe1e6',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: { fontWeight: 'bold', fontSize: '24px' },
  navLink: { margin: '0 15px', textDecoration: 'none', color: '#5e6c84', fontWeight: 500 },
  ctaButton: { padding: '10px 20px', backgroundColor: '#4A90E2', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
  heroSection: { textAlign: 'center', padding: '120px 20px', backgroundColor: '#f0f2f5' },
  heroTitle: { fontSize: '48px', fontWeight: 'bold', maxWidth: '800px', margin: '0 auto 20px auto' },
  heroSubtitle: { fontSize: '20px', maxWidth: '700px', margin: '0 auto 40px auto', color: '#5e6c84', lineHeight: 1.6 },
  ctaButtonLarge: { padding: '15px 30px', fontSize: '18px' },
  howItWorksSection: { padding: '100px 50px' },
  sectionTitle: { fontSize: '36px', textAlign: 'center', marginBottom: '60px' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', maxWidth: '1200px', margin: '0 auto' },
  stepCard: { padding: '30px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #dfe1e6' },
  stepNumber: { width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e9f2ff', color: '#0052cc', fontSize: '24px', fontWeight: 'bold', borderRadius: '50%', marginBottom: '20px' },
  stepTitle: { fontSize: '22px', marginBottom: '15px' },
  stepDescription: { fontSize: '16px', lineHeight: 1.6, color: '#5e6c84' },
  footer: { textAlign: 'center', padding: '40px', backgroundColor: '#f0f2f5', borderTop: '1px solid #dfe1e6', color: '#5e6c84' }
};

export default WelcomePage;
