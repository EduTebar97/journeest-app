
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Area, AreaTemplate, DiagnosticModule } from '../../types';
import BackButton from '../../components/common/BackButton';

const ReportViewPage: React.FC = () => {
    const { areaId } = useParams<{ areaId: string }>();
    
    const [area, setArea] = useState<Area | null>(null);
    const [modules, setModules] = useState<DiagnosticModule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!areaId) {
            setError("ID de área no válido.");
            setLoading(false);
            return;
        }

        const fetchReportData = async () => {
            try {
                const areaRef = doc(db, 'areas', areaId);
                const areaSnap = await getDoc(areaRef);
                if (!areaSnap.exists()) throw new Error("Informe no encontrado.");
                
                const areaData = { id: areaSnap.id, ...areaSnap.data() } as Area;
                if (areaData.status !== 'report_ready') {
                    throw new Error("El informe para esta área aún no está disponible.");
                }
                setArea(areaData);

                const templateRef = doc(db, 'area_templates', areaData.templateId);
                const templateSnap = await getDoc(templateRef);
                if (!templateSnap.exists()) throw new Error("Configuración de diagnóstico no encontrada.");
                const templateData = templateSnap.data() as AreaTemplate;
                
                const moduleSnapshots = await Promise.all(
                    templateData.moduleIds.map(id => getDoc(doc(db, 'diagnostic_modules', id)))
                );
                const fetchedModules = moduleSnapshots.map(snap => snap.exists() ? ({ id: snap.id, ...snap.data() } as DiagnosticModule) : null).filter(Boolean) as DiagnosticModule[];
                setModules(fetchedModules);

            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReportData();
    }, [areaId]);

    if (loading) return <div style={styles.centerContainer}><p>Cargando informe...</p></div>;
    if (error) return <div style={styles.centerContainer}><p style={{color: 'red'}}>Error: {error}</p><BackButton /></div>;

    return (
        <div style={styles.pageContainer}>
            <div style={styles.reportCard}>
                <BackButton />
                <header style={styles.header}>
                    <h1 style={styles.mainTitle}>Informe de Diagnóstico: {area?.name}</h1>
                    <p style={styles.subtitle}>Análisis y recomendaciones estratégicas por el equipo de Futurlogix.</p>
                </header>
                
                {modules.map(module => (
                    <section key={module.id} style={styles.moduleSection}>
                        <h2 style={styles.moduleTitle}>{module.name}</h2>
                        {module.questions.map(question => {
                            const consultantAnalysis = area?.consultantAnalysis?.[module.id]?.[question.id];
                            if (!consultantAnalysis) return null;
                            
                            return (
                                <div key={question.id} style={styles.questionBlock}>
                                    <h3 style={styles.questionLabel}>{question.label}</h3>
                                    {/* MÉTODO CORREGIDO Y ROBUSTO:
                                        Renderizamos el texto directamente y usamos CSS para que respete los saltos de línea.
                                        Esto elimina 'dangerouslySetInnerHTML' y cualquier expresión regular. */}
                                    <div style={styles.analysisText}>
                                        {consultantAnalysis}
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                ))}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    pageContainer: { backgroundColor: '#f0f2f5', padding: '40px 20px', minHeight: '100vh' },
    centerContainer: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' },
    reportCard: { backgroundColor: 'white', padding: '50px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxWidth: '900px', margin: 'auto' },
    header: { textAlign: 'center', borderBottom: '1px solid #eee', paddingBottom: '30px', marginBottom: '40px' },
    mainTitle: { color: '#172b4d', fontSize: '2.5rem', margin: 0 },
    subtitle: { color: '#5e6c84', fontSize: '1.2rem', marginTop: '10px' },
    moduleSection: { marginBottom: '40px' },
    moduleTitle: { fontSize: '1.8rem', color: '#0052cc', borderBottom: '2px solid #e9f2ff', paddingBottom: '10px', marginBottom: '25px' },
    questionBlock: { marginBottom: '25px' },
    questionLabel: { fontSize: '1.2rem', fontWeight: 'bold', color: '#172b4d', marginBottom: '10px' },
    analysisText: { 
        fontSize: '1rem', 
        color: '#333', 
        lineHeight: 1.7, 
        paddingLeft: '15px', 
        borderLeft: '3px solid #4A90E2',
        // Esta es la propiedad clave que soluciona el problema de forma segura.
        whiteSpace: 'pre-wrap' 
    }
};

export default ReportViewPage;
