
import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext'; 
import { Area } from '../types';
import { jsPDF } from 'jspdf';

const FuturlogixDashboard: React.FC = () => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth(); 

    useEffect(() => {
        if (!currentUser || !currentUser.companyId) {
            setLoading(false);
            setError("Usuario no autenticado o sin empresa asignada.");
            return;
        }

        const areasRef = collection(db, 'companies', currentUser.companyId, 'areas');
        const q = query(areasRef);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const areasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Area));
            setAreas(areasData);
            setLoading(false);
        }, (err) => {
            console.error("Error al obtener las áreas:", err);
            setError("No se pudieron cargar los datos de las áreas.");
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [currentUser]);

    const handleDownloadReport = (area: Area) => {
        if (!area.reportDraft) return;

        const doc = new jsPDF();
        
        // Simple text wrapping
        const text = doc.splitTextToSize(area.reportDraft, 180);
        doc.text(text, 10, 10);

        doc.save(`informe_${area.name.replace(/\s+/g, '_')}.pdf`);
    };
    
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'in_progress': return 'En Progreso';
            case 'completed': return 'Completado';
            case 'report_ready': return 'Informe Listo';
            default: return status;
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Panel de Diagnósticos</h1>
            <p>Aquí se muestran las áreas de diagnóstico de tu empresa.</p>

            <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={tableHeaderStyle}>Área</th>
                        <th style={tableHeaderStyle}>Responsable</th>
                        <th style={tableHeaderStyle}>Estado</th>
                        <th style={tableHeaderStyle}>Informe</th>
                    </tr>
                </thead>
                <tbody>
                    {areas.map(area => (
                        <tr key={area.id} style={{ borderBottom: '1px solid #ccc' }}>
                            <td style={tableCellStyle}>{area.name}</td>
                            <td style={tableCellStyle}>{area.responsible.name}</td>
                            <td style={tableCellStyle}>{getStatusLabel(area.status)}</td>
                            <td style={tableCellStyle}>
                                {area.reportDraft ? (
                                    <button onClick={() => handleDownloadReport(area)}>
                                        Descargar PDF
                                    </button>
                                ) : (
                                    <span>-</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Simple styles
const tableHeaderStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#f2f2f2',
};

const tableCellStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '10px',
};

export default FuturlogixDashboard;
