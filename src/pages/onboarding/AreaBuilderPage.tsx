import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, query, where, onSnapshot, doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './AreaBuilderPage.module.css';
import type { Area, AdminContact } from '../../types';

const STANDARD_AREAS = ["Marketing y Ventas", "Recepción y Reservas", "Housekeeping", "Restauración (F&B)", "Mantenimiento", "Administración"];

const AreaBuilderPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [areaName, setAreaName] = useState('');
  const [customAreaName, setCustomAreaName] = useState('');
  const [description, setDescription] = useState('');
  const [respName, setRespName] = useState('');
  const [respPosition, setRespPosition] = useState('');
  const [respEmail, setRespEmail] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [assignToSelf, setAssignToSelf] = useState(false);

  const [areas, setAreas] = useState<Area[]>([]);
  const [adminInfo, setAdminInfo] = useState<AdminContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const finalAreaName = useMemo(() => (areaName === 'Otra...' ? customAreaName : areaName), [areaName, customAreaName]);
  
  useEffect(() => {
    if (!currentUser) return;
    const fetchAdminData = async () => {
      const companyDocRef = doc(db, 'companies', currentUser.uid);
      const docSnap = await getDoc(companyDocRef);
      if (docSnap.exists()) {
        setAdminInfo(docSnap.data().contact as AdminContact);
      }
    };
    fetchAdminData();
  }, [currentUser]);

  useEffect(() => {
    if (assignToSelf && adminInfo) {
      setRespName(adminInfo.fullName);
      setRespPosition(adminInfo.position);
      setRespEmail(adminInfo.email);
    }
  }, [assignToSelf, adminInfo]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, 'areas'), where('companyId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const areasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Area));
      setAreas(areasData);
    });
    return () => unsubscribe();
  }, [currentUser]);

  const resetForm = () => {
    setAreaName('');
    setCustomAreaName('');
    setDescription('');
    setRespName('');
    setRespPosition('');
    setRespEmail('');
    setDeadline('');
    setFile(null);
    setAssignToSelf(false);
  };

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAreaName || !respEmail) {
      setError('El nombre del área y el email del responsable son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (!currentUser) throw new Error("Usuario no autenticado");
      const responsibleData = assignToSelf && adminInfo
        ? { name: adminInfo.fullName, position: adminInfo.position, email: adminInfo.email }
        : { name: respName, position: respPosition, email: respEmail };
      const areaDocRef = await addDoc(collection(db, 'areas'), {
        name: finalAreaName,
        description,
        responsible: responsibleData,
        deadline,
        status: 'Pendiente',
        companyId: currentUser.uid,
        createdAt: new Date(),
        supportingDocs: [],
      });
      if (file) {
        const filePath = `docs/${currentUser.uid}/${areaDocRef.id}/${file.name}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        await updateDoc(areaDocRef, {
            supportingDocs: arrayUnion({ name: file.name, url: downloadURL })
        });
      }
      resetForm();
    } catch (err) {
      setError('Error al crear el área. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLoadTemplates = () => {
      alert('Funcionalidad para cargar plantillas de áreas estándar próximamente.');
  };

  const handleContinue = () => {
      navigate('/dashboard');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.mainTitle}>Asignar Colaboradores</h1>
        <p className={styles.subtitle}>Crea las áreas de tu empresa, asigna responsables y establece una fecha límite para su análisis.</p>
        <div className={styles.mainLayout}>
          <div className={styles.formColumn}>
            <h2 className={styles.columnTitle}>Añadir Nueva Área</h2>
            <form onSubmit={handleAddArea}>
              <select value={areaName} onChange={(e) => setAreaName(e.target.value)} required>
                <option value="">Selecciona un área...</option>
                {STANDARD_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                <option value="Otra...">Otra...</option>
              </select>
              {areaName === 'Otra...' && <input type="text" placeholder="Nombre del área personalizada" value={customAreaName} onChange={(e) => setCustomAreaName(e.target.value)} required />}
              <textarea placeholder="Descripción corta (max 80 car.)" maxLength={80} value={description} onChange={(e) => setDescription(e.target.value)} />
              <div className={styles.checkboxWrapper}>
                <input type="checkbox" id="assignToSelf" checked={assignToSelf} onChange={(e) => setAssignToSelf(e.target.checked)} />
                <label htmlFor="assignToSelf">Asignar esta área a mí mismo</label>
              </div>
              <input type="text" placeholder="Nombre del responsable" value={respName} onChange={(e) => setRespName(e.target.value)} required disabled={assignToSelf} />
              <input type="text" placeholder="Puesto del responsable" value={respPosition} onChange={(e) => setRespPosition(e.target.value)} required disabled={assignToSelf}/>
              <input type="email" placeholder="E-mail del responsable" value={respEmail} onChange={(e) => setRespEmail(e.target.value)} required disabled={assignToSelf} />
              <label htmlFor="deadline">Fecha Límite</label>
              <input type="date" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
              <label htmlFor="uploader">Subir Documentos (Opcional)</label>
              <input type="file" id="uploader" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
              {error && <p className={styles.error}>{error}</p>}
              <button type="submit" disabled={loading}>{loading ? 'Añadiendo...' : 'Añadir Área a la Lista'}</button>
            </form>
            <button onClick={handleLoadTemplates} className={styles.templateButton}>Cargar Áreas Estándar</button>
          </div>
          <div className={styles.listColumn}>
            <h2 className={styles.columnTitle}>Áreas Creadas</h2>
            <div className={styles.areaList}>
              {areas.length === 0 ? <p>Aún no hay áreas en la lista.</p> :
                areas.map(area => (
                  <div key={area.id} className={styles.areaCard}>
                    <h4>{area.name}</h4>
                    <p>{area.responsible.email}</p>
                    <span className={`${styles.status} ${styles[area.status.replace(/ /g, '')]}`}>{area.status}</span>
                  </div>
                ))
              }
            </div>
            <button onClick={handleContinue} className={styles.continueButton} disabled={areas.length === 0}>
              Enviar Invitaciones y Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaBuilderPage;
