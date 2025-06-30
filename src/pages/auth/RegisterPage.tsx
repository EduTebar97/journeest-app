import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import styles from './RegisterPage.module.css';
import type { CompanyData, AdminContact, CompanyObjective } from '../../types';

const RegisterPage = () => {
  const navigate = useNavigate();

  // Estados para cada bloque de datos
  const [companyData, setCompanyData] = useState<CompanyData>({
    legalName: '', brandName: '', country: 'España', businessType: '', propertyCount: 1, roomCount: 1,
  });
  const [adminContact, setAdminContact] = useState<AdminContact>({
    fullName: '', position: '', email: '', phone: '',
  });
  const [objectives, setObjectives] = useState<CompanyObjective>({
    increaseRevenue: false, reduceCosts: false, automateProcesses: false,
  });
  const [password, setPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Funciones para manejar cambios en los formularios anidados
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };
  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminContact({ ...adminContact, [e.target.name]: e.target.value });
  };
  const handleObjectiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setObjectives({ ...objectives, [e.target.name]: e.target.checked });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminContact.email, password);
      const user = userCredential.user;

      // Guardar todos los datos en un único documento en la colección 'companies'
      await setDoc(doc(db, 'companies', user.uid), {
        ...companyData,
        contact: adminContact,
        objectives: objectives,
        adminUid: user.uid,
        createdAt: new Date(),
      });
      
      navigate('/onboarding/areas/intro');

    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este correo electrónico ya está en uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else {
        setError('Ocurrió un error al crear la cuenta. Inténtalo de nuevo.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.mainTitle}>Bienvenido a Journeest</h1>
        <p className={styles.subtitle}>Empecemos con los datos básicos para crear tu diagnóstico.</p>
        
        <form onSubmit={handleRegister}>
          {/* --- Datos de la Empresa --- */}
          <fieldset className={styles.fieldset}>
            <legend>1. Datos de la Empresa</legend>
            <input name="legalName" placeholder="Nombre Legal" value={companyData.legalName} onChange={handleCompanyChange} required />
            <input name="brandName" placeholder="Marca Comercial" value={companyData.brandName} onChange={handleCompanyChange} required />
            <select name="businessType" value={companyData.businessType} onChange={handleCompanyChange} required>
              <option value="">Tipo de negocio...</option>
              <option value="hotel">Hotel</option>
              <option value="apartamentos">Apartamentos Turísticos</option>
              <option value="agencia">Agencia de Viajes</option>
              <option value="otro">Otro</option>
            </select>
          </fieldset>

          {/* --- Contacto Principal --- */}
          <fieldset className={styles.fieldset}>
            <legend>2. Contacto Principal</legend>
            <input name="fullName" placeholder="Nombre Completo" value={adminContact.fullName} onChange={handleAdminChange} required />
            <input name="position" placeholder="Cargo" value={adminContact.position} onChange={handleAdminChange} required />
            <input name="email" type="email" placeholder="E-mail Corporativo" value={adminContact.email} onChange={handleAdminChange} required />
            <input name="password" type="password" placeholder="Crea una contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input name="phone" type="tel" placeholder="Teléfono (WhatsApp)" value={adminContact.phone} onChange={handleAdminChange} />
          </fieldset>

          {/* --- Objetivo Prioritario --- */}
          <fieldset className={styles.fieldset}>
            <legend>3. ¿Cuál es tu objetivo prioritario?</legend>
            <div className={styles.checkboxGroup}>
              <label><input type="checkbox" name="increaseRevenue" checked={objectives.increaseRevenue} onChange={handleObjectiveChange} /> Aumentar ingresos</label>
              <label><input type="checkbox" name="reduceCosts" checked={objectives.reduceCosts} onChange={handleObjectiveChange} /> Reducir costes</label>
              <label><input type="checkbox" name="automateProcesses" checked={objectives.automateProcesses} onChange={handleObjectiveChange} /> Automatizar procesos</label>
            </div>
          </fieldset>

          <div className={styles.termsGroup}>
            <input type="checkbox" id="terms" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} required/>
            <label htmlFor="terms">Acepto los <Link to="/terminos" target="_blank">términos y la política de privacidad</Link></label>
          </div>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Continuar y Crear Áreas'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
