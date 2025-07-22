
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { nanoid } from 'nanoid';
import BackButton from '../../components/common/BackButton';

// --- Types & Constants ---
interface AreaDefinition {
    id: string; // Temp client-side ID
    areaName: string;
    collaboratorName: string;
    collaboratorPosition: string;
    collaboratorEmail: string;
}
const PREDETERMINED_AREAS = [
    "Dirección General", "Marketing y Ventas", "Recepción y Reservas", 
    "Alimentos y Bebidas (F&B)", "Limpieza y Mantenimiento (Housekeeping)", 
    "Administración y Finanzas", "Recursos Humanos"
];
// --- MAPEO DE ÁREAS A PLANTILLAS ---
const templateIdByArea: { [key: string]: string } = {
    "Dirección General": "template_direccion",
    "Marketing y Ventas": "template_marketing",
    "Recepción y Reservas": "template_recepcion",
    "Alimentos y Bebidas (F&B)": "template_fnb",
    "Limpieza y Mantenimiento (Housekeeping)": "template_housekeeping",
    "Administración y Finanzas": "template_finanzas",
    "Recursos Humanos": "template_rrhh"
};

// --- Component ---
const AreaBuilderPage: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // --- State ---
    const [areas, setAreas] = useState<AreaDefinition[]>([]);
    const [areaName, setAreaName] = useState('');
    const [isCustomArea, setIsCustomArea] = useState(false);
    const [customAreaName, setCustomAreaName] = useState('');
    const [collaboratorName, setCollaboratorName] = useState('');
    const [collaboratorPosition, setCollaboratorPosition] = useState('');
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [isSelfAssigned, setIsSelfAssigned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // --- Effects ---
    useEffect(() => {
        if (areaName !== 'otro') {
            setIsCustomArea(false);
            setCustomAreaName('');
        } else {
            setIsCustomArea(true);
        }
    }, [areaName]);
    
    useEffect(() => {
        if (isSelfAssigned) {
            setCollaboratorName(currentUser?.name || '');
            setCollaboratorPosition(currentUser?.position || '');
            setCollaboratorEmail(currentUser?.email || '');
        }
    }, [isSelfAssigned, currentUser]);

    // --- Handlers ---
    const handleAddArea = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const finalAreaName = isCustomArea ? customAreaName : areaName;

        if (!finalAreaName || !collaboratorName || !collaboratorEmail) {
            setError("Por favor, completa todos los campos del área y del responsable.");
            return;
        }

        setAreas(prev => [...prev, {
            id: nanoid(),
            areaName: finalAreaName,
            collaboratorName,
            collaboratorPosition,
            collaboratorEmail
        }]);

        setAreaName('');
        setCustomAreaName('');
        setCollaboratorName('');
        setCollaboratorPosition('');
        setCollaboratorEmail('');
        setIsSelfAssigned(false);
    };

    const handleRemoveArea = (id: string) => setAreas(areas.filter(area => area.id !== id));
    
    const handleFinalSubmit = async () => {
        if (areas.length === 0) {
            setError("Debes añadir al menos un área para continuar.");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const batch = writeBatch(db);
            const areasCollectionRef = collection(db, 'areas');
            
            areas.forEach(area => {
                const newAreaDocRef = doc(areasCollectionRef); 
                const assignedTemplateId = templateIdByArea[area.areaName] || "template_generic";

                batch.set(newAreaDocRef, {
                    companyId: currentUser?.companyId,
                    name: area.areaName,
                    templateId: assignedTemplateId,
                    status: 'pending',
                    formId: nanoid(12),
                    createdAt: new Date(),
                    responsible: {
                        name: area.collaboratorName,
                        position: area.collaboratorPosition,
                        email: area.collaboratorEmail,
                    },
                });
            });

            await batch.commit();
            navigate('/dashboard/client');

        } catch (err) {
            console.error("Error creating areas:", err);
            setError("No se pudieron guardar las áreas. Por favor, inténtalo de nuevo.");
            setLoading(false);
        }
    };

    // --- Render ---
    return (
        <div style={styles.pageContainer}>
            <div style={styles.mainCard}>
                <BackButton />
                <h1 style={styles.title}>Constructor de Áreas de Negocio</h1>
                <p style={styles.subtitle}>Selecciona las áreas funcionales de tu empresa o añade unas nuevas, y asigna un responsable a cada una para iniciar el diagnóstico.</p>
                
                <div style={styles.builderLayout}>
                    {/* Form column */}
                    <form onSubmit={handleAddArea} style={styles.form}>
                        <h2 style={styles.formTitle}>1. Define el Área y su Responsable</h2>
                        <label htmlFor="area-select" style={styles.label}>Área Funcional</label>
                        <select id="area-select" value={areaName} onChange={e => setAreaName(e.target.value)} style={styles.input} required>
                            <option value="" disabled>Selecciona un área...</option>
                            {PREDETERMINED_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                            <option value="otro">Otra (especificar)</option>
                        </select>
                        {isCustomArea && (
                            <input type="text" placeholder="Nombre del Área Personalizada" value={customAreaName} onChange={e => setCustomAreaName(e.target.value)} style={{...styles.input, marginTop: '10px'}} required />
                        )}
                        <div style={styles.separator}></div>
                        <label style={styles.checkboxLabel}>
                            <input type="checkbox" checked={isSelfAssigned} onChange={() => setIsSelfAssigned(!isSelfAssigned)} />
                            Asignarme esta área a mí ({currentUser?.name})
                        </label>
                        <div style={isSelfAssigned ? styles.disabled : {}}>
                            <label htmlFor="collab-name" style={styles.label}>Nombre y Apellido del Responsable</label>
                            <input id="collab-name" type="text" placeholder="Ej: Ana García" value={collaboratorName} onChange={e => setCollaboratorName(e.target.value)} style={styles.input} disabled={isSelfAssigned} required/>
                            <label htmlFor="collab-position" style={styles.label}>Cargo del Responsable</label>
                            <input id="collab-position" type="text" placeholder="Ej: Jefa de Recepción" value={collaboratorPosition} onChange={e => setCollaboratorPosition(e.target.value)} style={styles.input} disabled={isSelfAssigned} />
                            <label htmlFor="collab-email" style={styles.label}>Email del Responsable</label>
                            <input id="collab-email" type="email" placeholder="email@tuempresa.com" value={collaboratorEmail} onChange={e => setCollaboratorEmail(e.target.value)} style={styles.input} disabled={isSelfAssigned} required/>
                        </div>
                        <button type="submit" style={styles.addButton}>+ Añadir Área a la Lista</button>
                    </form>

                    {/* List column */}
                    <div style={styles.listContainer}>
                        <h2 style={styles.listTitle}>2. Áreas a Crear ({areas.length})</h2>
                        {areas.length > 0 ? (
                            areas.map(area => (
                                <div key={area.id} style={styles.listItem}>
                                    <div>
                                        <p style={styles.areaName}>{area.areaName}</p>
                                        <p style={styles.collabInfo}>{area.collaboratorName} - {area.collaboratorPosition}</p>
                                    </div>
                                    <button onClick={() => handleRemoveArea(area.id)} style={styles.removeButton} aria-label="Eliminar área">×</button>
                                </div>
                            ))
                        ) : <p style={styles.emptyList}>Aún no has añadido ninguna área.</p>}
                    </div>
                </div>
                
                {error && <p style={styles.error}>{error}</p>}

                <button onClick={handleFinalSubmit} style={loading ? {...styles.finalButton, ...styles.buttonDisabled} : styles.finalButton} disabled={loading || areas.length === 0}>
                    {loading ? 'Guardando y Creando Diagnósticos...' : `Confirmar y Crear ${areas.length} Diagnóstico(s)`}
                </button>
            </div>
        </div>
    );
};
// --- Styles ---
const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: { backgroundColor: '#f0f2f5', padding: '40px 20px', minHeight: '100vh' },
    mainCard: { backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '1200px', margin: 'auto' },
    title: { textAlign: 'center', color: '#172b4d' },
    subtitle: { textAlign: 'center', color: '#5e6c84', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px auto' },
    builderLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'flex-start' },
    form: { border: '1px solid #dfe1e6', borderRadius: '5px', padding: '20px' },
    formTitle: { marginTop: 0, color: '#0052cc', fontSize: '1.2rem' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    separator: { borderTop: '1px dashed #ccc', margin: '20px 0' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontWeight: 500 },
    disabled: { opacity: 0.5 },
    addButton: { width: '100%', padding: '12px', backgroundColor: '#e9f2ff', color: '#0052cc', border: '1px solid #0052cc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    listContainer: { border: '1px solid #dfe1e6', borderRadius: '5px', padding: '20px', minHeight: '300px' },
    listTitle: { marginTop: 0, color: '#0052cc', fontSize: '1.2rem' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafafa', padding: '10px 15px', borderRadius: '4px', marginBottom: '10px' },
    areaName: { fontWeight: 'bold', margin: 0 },
    collabInfo: { color: '#5e6c84', margin: '4px 0 0 0', fontSize: '0.9rem' },
    removeButton: { border: 'none', backgroundColor: 'transparent', color: '#de350b', fontSize: '24px', cursor: 'pointer', lineHeight: 1 },
    emptyList: { textAlign: 'center', color: '#5e6c84', padding: '20px 0' },
    finalButton: { width: '100%', padding: '15px', border: 'none', borderRadius: '5px', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', marginTop: '30px' },
    buttonDisabled: { backgroundColor: '#B0C4DE', cursor: 'not-allowed' },
    error: { color: '#de350b', textAlign: 'center', fontWeight: 'bold', marginTop: '20px' },
};

export default AreaBuilderPage;
