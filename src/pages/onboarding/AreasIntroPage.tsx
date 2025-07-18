
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BackButton from '../../components/common/BackButton';

const AreasIntroPage: React.FC = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const handleContinue = () => {
        navigate('/onboarding/builder');
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentCard}>
                <BackButton />
                <h1 style={styles.title}>¡Bienvenido, {currentUser?.name || 'Administrador'}!</h1>
                <p style={styles.subtitle}>Has completado el primer paso. Ahora, vamos a construir el organigrama de tu negocio.</p>

                <div style={styles.section}>
                    <h2 style={styles.sectionTitle}>¿Por qué es tan importante definir las áreas?</h2>
                    <p style={styles.paragraph}>
                        Un diagnóstico preciso comienza con una comprensión clara de cómo funciona tu empresa. Al definir cada área funcional, podemos realizar un análisis específico y profundo.
                    </p>
                    <ul style={styles.list}>
                        <li><strong>Identificar problemas</strong> y oportunidades con una precisión quirúrgica.</li>
                        <li><strong>Involucrar a los responsables</strong> de cada área para obtener información de primera mano.</li>
                        <li><strong>Generar informes personalizados</strong> y planes de acción verdaderamente relevantes.</li>
                    </ul>
                </div>
                
                <button onClick={handleContinue} style={styles.button}>
                    Entendido, ¡vamos a construir!
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: { backgroundColor: '#f0f2f5', padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
    contentCard: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '800px' },
    title: { color: '#172b4d', textAlign: 'center', marginBottom: '10px' },
    subtitle: { color: '#5e6c84', textAlign: 'center', marginBottom: '40px', fontSize: '1.2rem' },
    section: { textAlign: 'left', marginBottom: '30px' },
    sectionTitle: { fontSize: '1.4rem', color: '#0052cc', marginBottom: '15px' },
    paragraph: { color: '#172b4d', lineHeight: '1.6' },
    list: { paddingLeft: '20px', color: '#172b4d', lineHeight: '1.8' },
    button: { width: '100%', padding: '15px', border: 'none', borderRadius: '5px', backgroundColor: '#4A90E2', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '20px' },
};

export default AreasIntroPage;
