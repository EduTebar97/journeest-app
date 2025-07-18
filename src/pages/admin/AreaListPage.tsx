
import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Area, Company, AreaTemplate } from '../../types';
import { Link } from 'react-router-dom';
import AddAreaFuturlogixModal from '../../components/admin/AddAreaFuturlogixModal';
import * as companyService from '../../services/companyService';

const AreaListPage: React.FC = () => {
    // Data states
    const [areas, setAreas] = useState<Area[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [templates, setTemplates] = useState<AreaTemplate[]>([]);

    // Control states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const areasPromise = getDocs(query(collection(db, 'areas'), orderBy('createdAt', 'desc')));
                const companiesPromise = companyService.getAllCompanies();
                const templatesPromise = getDocs(collection(db, 'area_templates'));

                const [areasSnapshot, companiesData, templatesSnapshot] = await Promise.all([areasPromise, companiesPromise, templatesPromise]);

                const areasData = areasSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Area));
                const templatesData = templatesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AreaTemplate));

                setAreas(areasData);
                setCompanies(companiesData);
                setTemplates(templatesData);
            } catch (err: any) {
                setError('No se pudieron cargar los datos iniciales.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);
    
    const handleAreaAdded = async (newAreaData: Omit<Area, 'id' | 'createdAt'>) => {
        try {
            const areaToSave = { ...newAreaData, createdAt: Timestamp.now() };
            const docRef = await addDoc(collection(db, 'areas'), areaToSave);
            setAreas(prevAreas => [{ ...areaToSave, id: docRef.id } as Area, ...prevAreas]);
            alert(`Área "${newAreaData.name}" creada con éxito.`);
        } catch (error) {
            setError("No se pudo crear la nueva área.");
        }
    };
    
    const getStatusChip = (status: Area['status']) => {
        const styles: React.CSSProperties = { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
        switch (status) {
            case 'completed': return <span style={{ ...styles, backgroundColor: '#e6f7ff', color: '#1890ff' }}>Completado</span>;
            case 'in_progress': return <span style={{ ...styles, backgroundColor: '#fffbe6', color: '#faad14' }}>En Progreso</span>;
            case 'pending': return <span style={{ ...styles, backgroundColor: '#f6f6f6', color: '#595959' }}>Pendiente</span>;
            default: return <span>{status}</span>;
        }
    };

    if (loading) return <p>Cargando datos del panel...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
            <div>
                <div style={styles.header}>
                    <h1>Áreas de Diagnóstico Creadas</h1>
                    <button onClick={() => setIsModalOpen(true)} style={styles.addButton}>+ Crear Nueva Área</button>
                </div>
                <p>Estas son todas las áreas de diagnóstico que se han generado para los clientes.</p>
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead><tr>
                            <th style={styles.th}>Área</th>
                            <th style={styles.th}>Empresa</th>
                            <th style={styles.th}>Estado</th>
                            <th style={styles.th}>Acciones</th>
                        </tr></thead>
                        <tbody>
                            {areas.map(area => (
                                <tr key={area.id}>
                                    <td style={styles.td}>{area.name}</td>
                                    <td style={styles.td}>{companies.find(c => c.id === area.companyId)?.name || 'N/A'}</td>
                                    <td style={styles.td}>{getStatusChip(area.status)}</td>
                                    <td style={styles.td}>
                                        {area.status === 'completed' ? (
                                            <Link to={`/futurlogix/editor/${area.id}`} style={styles.actionButton}>Revisar Informe</Link>
                                        ) : (
                                            <Link to={`/report/editor/${area.formId}`} target="_blank" style={styles.link}>Ver Formulario</Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <AddAreaFuturlogixModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAreaAdded={handleAreaAdded}
                    companies={companies}
                    templates={templates}
                />
            )}
        </>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    addButton: { padding: '10px 20px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '16px' },
    tableContainer: { marginTop: '20px', backgroundColor: 'white', borderRadius: '3px', border: '1px solid #dfe1e6' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#f4f5f7', padding: '15px', textAlign: 'left', borderBottom: '1px solid #dfe1e6', color: '#5e6c84' },
    td: { padding: '15px', textAlign: 'left', borderBottom: '1px solid #dfe1e6' },
    actionButton: { padding: '8px 12px', backgroundColor: '#4A90E2', color: 'white', textDecoration: 'none', borderRadius: '3px' },
    link: { color: '#0052cc' }
};

export default AreaListPage;
