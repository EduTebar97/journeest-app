
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { DiagnosticModule } from '../../types';

const ModuleListPage: React.FC = () => {
    const [modules, setModules] = useState<DiagnosticModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'diagnostic_modules'));
                const modulesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as DiagnosticModule));
                setModules(modulesData);
            } catch (err: any) {
                setError('No se pudieron cargar los módulos.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    if (loading) return <p>Cargando módulos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <div style={styles.header}>
                <h1>Gestión de Módulos de Diagnóstico</h1>
                <button style={styles.addButton}>+ Crear Nuevo Módulo</button>
            </div>
            <p>Estos son los bloques de construcción de los formularios. Cada módulo contiene un conjunto de preguntas.</p>
            
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Nombre del Módulo</th>
                            <th style={styles.th}>ID del Módulo</th>
                            <th style={styles.th}>Nº de Preguntas</th>
                            <th style={styles.th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modules.map(module => (
                            <tr key={module.id}>
                                <td style={styles.td}>{module.name}</td>
                                <td style={styles.td}><code>{module.id}</code></td>
                                <td style={styles.td}>{module.questions.length}</td>
                                <td style={styles.td}>
                                    <button style={styles.actionButton}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Re-using the same styles as TemplateListPage for consistency
const styles: { [key: string]: React.CSSProperties } = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    addButton: { padding: '10px 20px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '16px' },
    tableContainer: { marginTop: '20px', backgroundColor: 'white', borderRadius: '3px', border: '1px solid #dfe1e6', padding: '1px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#f4f5f7', padding: '15px', textAlign: 'left', borderBottom: '1px solid #dfe1e6', color: '#5e6c84' },
    td: { padding: '15px', textAlign: 'left', borderBottom: '1px solid #dfe1e6' },
    actionButton: { marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }
};

export default ModuleListPage;
