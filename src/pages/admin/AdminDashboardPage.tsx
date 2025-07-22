
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Area } from '../../types';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import AddAreaModal from '../../components/admin/AddAreaModal';

const AdminDashboardPage: React.FC = () => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { currentUser } = useContext(AuthContext)!;

    const fetchAreas = useCallback(async () => {
        if (!currentUser?.companyId) return;
        setLoading(true);
        setError(null);
        try {
            const areasRef = collection(db, 'areas');
            const q = query(areasRef, where('companyId', '==', currentUser.companyId));
            const querySnapshot = await getDocs(q);
            const areasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Area));
            setAreas(areasData);
        } catch (err) {
            setError('No se pudieron cargar las áreas. Por favor, intente de nuevo.');
        } finally {
            setLoading(false);
        }
    }, [currentUser?.companyId]);

    useEffect(() => {
        if (currentUser) {
            fetchAreas();
        }
    }, [currentUser, fetchAreas]);

    // Calcula si todas las áreas están listas para el informe general
    const allAreasCompleted = areas.length > 0 && areas.every(area => area.status === 'report_ready');

    const getStatusChip = (status: Area['status']) => {
        const baseStyle: React.CSSProperties = { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
        switch (status) {
            case 'completed': return <span style={{ ...baseStyle, backgroundColor: '#e6f7ff', color: '#1890ff' }}>Completado</span>;
            case 'report_ready': return <span style={{ ...baseStyle, backgroundColor: '#d4edda', color: '#155724' }}>Informe Listo</span>;
            case 'in_progress': return <span style={{ ...baseStyle, backgroundColor: '#fffbe6', color: '#faad14' }}>En Progreso</span>;
            case 'pending': return <span style={{ ...baseStyle, backgroundColor: '#f6f6f6', color: '#595959' }}>Pendiente</span>;
            default: return <span>{status}</span>;
        }
    };
    
    const renderActionForArea = (area: Area) => {
        const formLink = `/report/editor/${area.formId}?readOnly=true`;
        
        if (area.status === 'report_ready') {
            return (
                <>
                    <Link to={`/report/view/${area.id}`} style={styles.actionButton}>Ver Informe</Link>
                    <span style={styles.separator}>|</span>
                    <Link to={formLink} style={styles.linkButton}>Ver Formulario</Link>
                </>
            );
        }
        
        return <Link to={formLink} style={styles.linkButton}>Ver Formulario</Link>;
    };

    if (loading) return <div>Cargando panel...</div>;
    
    return (
        <>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1>Panel de Diagnóstico</h1>
                    <button style={styles.addButton} onClick={() => setIsModalOpen(true)}>+ Añadir Área</button>
                </div>
                <p>Aquí puedes ver el estado de los diagnósticos de tu empresa y añadir nuevas áreas para analizar.</p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div style={styles.tableContainer}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Área de la Empresa</th>
                                <th style={styles.th}>Responsable</th>
                                <th style={styles.th}>Estado</th>
                                <th style={styles.th}>Acción Individual</th>
                                <th style={styles.th}>Diagnóstico General</th>
                            </tr>
                        </thead>
                        <tbody>
                            {areas.length > 0 ? areas.map((area, index) => (
                                <tr key={area.id}>
                                    <td style={styles.td}>{area.name}</td>
                                    <td style={styles.td}>{area.responsible.name || area.responsible.email}</td>
                                    <td style={styles.td}>{getStatusChip(area.status)}</td>
                                    <td style={styles.td}>{renderActionForArea(area)}</td>
                                    <td style={styles.td}>
                                        {index === 0 && (
                                            allAreasCompleted ? (
                                                <Link to="/overall-report" style={styles.actionButton}>
                                                    Ver y Editar
                                                </Link>
                                            ) : (
                                                <span style={styles.disabledText}>Pendiente</span>
                                            )
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan={5} style={styles.emptyCell}>No hay diagnósticos activos para tu empresa.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && currentUser && (
                <AddAreaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onAreaAdded={fetchAreas}
                    companyId={currentUser.companyId!}
                />
            )}
        </>
    );
};

const styles: { [key:string]: React.CSSProperties } = {
    container: { maxWidth: '1200px', margin: 'auto', padding: '2rem' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    addButton: { padding: '10px 20px', backgroundColor: '#0052cc', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '16px' },
    tableContainer: { marginTop: '2rem', backgroundColor: 'white', borderRadius: '3px', border: '1px solid #dfe1e6' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#f4f5f7', padding: '15px', textAlign: 'left', borderBottom: '1px solid #dfe1e6', color: '#5e6c84' },
    td: { padding: '15px', textAlign: 'left', borderBottom: '1px solid #dfe1e6', verticalAlign: 'middle' },
    emptyCell: { textAlign: 'center', padding: '2rem', color: '#5e6c84' },
    linkButton: { textDecoration: 'none', color: '#0052cc', fontWeight: 'bold' },
    actionButton: { padding: '8px 12px', backgroundColor: '#0052cc', color: 'white', textDecoration: 'none', borderRadius: '3px', fontWeight: 'bold' },
    separator: { margin: '0 10px', color: '#ccc' },
    disabledText: { color: '#999' }
};

export default AdminDashboardPage;
