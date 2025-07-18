
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AreaTemplate } from '../../types';

const TemplateListPage: React.FC = () => {
    const [templates, setTemplates] = useState<AreaTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'area_templates'));
                const templatesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as AreaTemplate));
                setTemplates(templatesData);
            } catch (err: any) {
                setError('No se pudieron cargar las plantillas.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    if (loading) return <p>Cargando plantillas...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <div style={styles.header}>
                <h1>Gestión de Plantillas de Área</h1>
                <button style={styles.addButton}>+ Crear Nueva Plantilla</button>
            </div>
            <p>Aquí puedes crear y editar las plantillas que se usan para generar los diagnósticos de cada área.</p>
            
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Nombre de la Plantilla</th>
                            <th style={styles.th}>Descripción</th>
                            <th style={styles.th}>Nº de Módulos</th>
                            <th style={styles.th}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templates.map(template => (
                            <tr key={template.id}>
                                <td style={styles.td}>{template.name}</td>
                                <td style={styles.td}>{template.description}</td>
                                <td style={styles.td}>{template.moduleIds.length}</td>
                                <td style={styles.td}>
                                    <button style={styles.actionButton}>Editar</button>
                                    <button style={styles.actionButton}>Ver Módulos</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    addButton: { padding: '10px 20px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '16px' },
    tableContainer: { marginTop: '20px', backgroundColor: 'white', borderRadius: '3px', border: '1px solid #dfe1e6', padding: '1px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#f4f5f7', padding: '15px', textAlign: 'left', borderBottom: '1px solid #dfe1e6', color: '#5e6c84' },
    td: { padding: '15px', textAlign: 'left', borderBottom: '1px solid #dfe1e6' },
    actionButton: { marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }
};

export default TemplateListPage;
