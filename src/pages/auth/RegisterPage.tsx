
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage: React.FC = () => {
    // State management for all form fields
    const [companyName, setCompanyName] = useState('');
    const [brandName, setBrandName] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminPosition, setAdminPosition] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [objectives, setObjectives] = useState<string[]>([]);
    const [termsAccepted, setTermsAccepted] = useState(false);
    
    // State for submission process
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { registerAndCreateCompany } = useAuth();
    const navigate = useNavigate();

    const handleObjectiveChange = (objective: string) => {
        setObjectives(prev => 
            prev.includes(objective) 
                ? prev.filter(o => o !== objective) 
                : [...prev, objective]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!termsAccepted) {
            setError("Debes aceptar los Términos y Condiciones y la Política de Privacidad.");
            return;
        }
        setError(null);
        setLoading(true);

        try {
            await registerAndCreateCompany({
                email,
                password,
                companyData: { name: companyName, brand: brandName, type: businessType },
                adminProfile: { name: adminName, position: adminPosition, phone: phone },
                initialObjectives: objectives
            });
            // On success, navigate to the next step in the flow
            navigate('/onboarding/intro'); 

        } catch (err: any) {
            if (err.code === 'auth/email-already-in-use') {
                setError('Este correo electrónico ya está registrado. Por favor, inicia sesión.');
            } else {
                setError('Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.');
                console.error("Registration Error:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.formCard}>
                <h1 style={styles.title}>Crea tu cuenta en Journeest</h1>
                <p style={styles.subtitle}>Comienza el camino para transformar tu negocio.</p>
                <form onSubmit={handleSubmit}>
                    <fieldset style={styles.fieldset}>
                        <legend style={styles.legend}>Datos de la Empresa</legend>
                        <div style={styles.inputGroup}>
                            <label htmlFor="companyName" style={styles.label}>Nombre Legal</label>
                            <input type="text" id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="brandName" style={styles.label}>Marca Comercial</label>
                            <input type="text" id="brandName" value={brandName} onChange={e => setBrandName(e.target.value)} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                             <label htmlFor="businessType" style={styles.label}>Tipo de negocio</label>
                             <select id="businessType" value={businessType} onChange={e => setBusinessType(e.target.value)} required style={styles.input}>
                                <option value="" disabled>Selecciona una opción...</option>
                                <option value="hotel">Hotel</option>
                                <option value="apartamentos_turisticos">Apartamentos Turísticos</option>
                                <option value="agencia_viajes">Agencia de Viajes</option>
                                <option value="otro">Otro</option>
                             </select>
                        </div>
                    </fieldset>

                    <fieldset style={styles.fieldset}>
                        <legend style={styles.legend}>Contacto Principal (Administrador)</legend>
                        <div style={styles.inputGroup}>
                            <label htmlFor="adminName" style={styles.label}>Nombre Completo</label>
                            <input type="text" id="adminName" value={adminName} onChange={e => setAdminName(e.target.value)} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="adminPosition" style={styles.label}>Cargo</label>
                            <input type="text" id="adminPosition" value={adminPosition} onChange={e => setAdminPosition(e.target.value)} required style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label htmlFor="email" style={styles.label}>E-mail Corporativo</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required style={styles.input} />
                        </div>
                         <div style={styles.inputGroup}>
                            <label htmlFor="password" style={styles.label}>Contraseña</label>
                            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={styles.input} />
                        </div>
                    </fieldset>

                    <fieldset style={styles.fieldset}>
                        <legend style={styles.legend}>¿Cuál es tu objetivo prioritario?</legend>
                        <div style={styles.checkboxGroup}>
                           {['Aumentar ingresos', 'Reducir costes', 'Automatizar procesos'].map(obj => (
                               <label key={obj} style={styles.checkboxLabel}>
                                   <input type="checkbox" checked={objectives.includes(obj)} onChange={() => handleObjectiveChange(obj)} />
                                   {obj}
                               </label>
                           ))}
                        </div>
                    </fieldset>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.checkboxLabel}>
                            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} required />
                            Acepto los <a href="/terms" target="_blank">Términos y Condiciones</a> y la <a href="/privacy" target="_blank">Política de Privacidad</a>.
                        </label>
                    </div>

                    {error && <p style={styles.error}>{error}</p>}

                    <button type="submit" style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button} disabled={loading}>
                        {loading ? 'Creando cuenta...' : 'Continuar y Crear Áreas'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Styles based on the detailed vision
const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: { backgroundColor: '#f0f2f5', padding: '40px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
    formCard: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '700px' },
    title: { color: '#172b4d', textAlign: 'center', marginBottom: '10px' },
    subtitle: { color: '#5e6c84', textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem' },
    fieldset: { border: 'none', padding: 0, margin: '0 0 25px 0' },
    legend: { fontWeight: 'bold', fontSize: '1.2rem', color: '#0052cc', marginBottom: '15px', padding: 0 },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#5e6c84' },
    input: { width: '100%', padding: '12px', border: '1px solid #dfe1e6', borderRadius: '4px', boxSizing: 'border-box', fontSize: '1rem' },
    checkboxGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', color: '#172b4d' },
    error: { color: '#de350b', textAlign: 'center', marginBottom: '15px', fontWeight: 'bold' },
    button: { width: '100%', padding: '15px', border: 'none', borderRadius: '5px', backgroundColor: '#4A90E2', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: 'background-color 0.2s ease' },
    buttonDisabled: { backgroundColor: '#B0C4DE', cursor: 'not-allowed' },
};

export default RegisterPage;
