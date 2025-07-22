
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Area, AreaTemplate, DiagnosticModule, ModularFormData, Answer } from '../types';
import QuestionRenderer from '../components/dynamic_form/QuestionRenderer';
import { isAnswerValid } from '../utils/validation.ts';

const ReportEditorPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const location = useLocation();
    
    // Determina el modo solo lectura desde el query param
    const searchParams = new URLSearchParams(location.search);
    const isReadOnly = searchParams.get('readOnly') === 'true';

    // State
    const [area, setArea] = useState<Area | null>(null);
    const [modules, setModules] = useState<DiagnosticModule[]>([]);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ModularFormData>({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // El estado de "completado" ahora también incluye el modo de solo lectura
    const isFormDisabled = isReadOnly || area?.status === 'completed' || area?.status === 'report_ready';

    useEffect(() => {
        const fetchFormData = async () => {
            if (!formId) { setError('ID de formulario no válido.'); setLoading(false); return; }
            try {
                const areasRef = collection(db, 'areas');
                const q = query(areasRef, where('formId', '==', formId));
                const areaSnapshot = await getDocs(q);
                if (areaSnapshot.empty) throw new Error('Diagnóstico no encontrado.');
                const areaDoc = areaSnapshot.docs[0];
                const areaData = { id: areaDoc.id, ...areaDoc.data() } as Area;
                setArea(areaData);
                if (areaData.formData) setFormData(areaData.formData);
                const templateRef = doc(db, 'area_templates', areaData.templateId);
                const templateSnapshot = await getDoc(templateRef);
                if (!templateSnapshot.exists()) throw new Error(`Plantilla no encontrada: ${areaData.templateId}`);
                const templateData = templateSnapshot.data() as AreaTemplate;
                const moduleSnapshots = await Promise.all(templateData.moduleIds.map(id => getDoc(doc(db, 'diagnostic_modules', id))));
                const fetchedModules = moduleSnapshots.map(snap => snap.exists() ? ({ id: snap.id, ...snap.data() } as DiagnosticModule) : null).filter((m): m is DiagnosticModule => m !== null);
                setModules(fetchedModules);
                if (fetchedModules.length > 0) setActiveModuleId(fetchedModules[0].id);
            } catch (err: any) { setError(err.message); } finally { setLoading(false); }
        };
        fetchFormData();
    }, [formId]);

    const handleAnswerChange = useCallback((questionId: string, answer: Answer) => {
        if (!activeModuleId || isFormDisabled) return;
        if (error) setError(null);
        setFormData(prevData => ({ ...prevData, [activeModuleId]: { ...prevData[activeModuleId], [questionId]: answer } }));
    }, [activeModuleId, isFormDisabled, error]);

    const handleSaveDraft = async () => {
        if (!area || isFormDisabled) return;
        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, 'areas', area.id), { formData, status: 'in_progress' });
            alert("Progreso guardado.");
        } catch (err) { setError("No se pudo guardar. Inténtalo de nuevo."); } finally { setIsSubmitting(false); }
    };

    const handleFinalize = async () => {
        if (!area || isFormDisabled) return;
        const incompleteModules: string[] = [];
        modules.forEach(module => {
            if (!module.questions.every(q => isAnswerValid(formData[module.id]?.[q.id], q))) {
                incompleteModules.push(module.name);
            }
        });

        if (incompleteModules.length > 0) {
            setError(`Por favor, completa los siguientes módulos: ${incompleteModules.join(', ')}.`);
            return;
        }
        
        if (!window.confirm("¿Estás seguro de que quieres finalizar? No podrás realizar más cambios.")) return;

        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, 'areas', area.id), {
                formData,
                status: 'completed',
                completedAt: Timestamp.now()
            });
            alert("Diagnóstico finalizado y enviado con éxito.");
            // En una app real, aquí habría una redirección
        } catch (err) { setError("Ocurrió un error al finalizar."); } finally { setIsSubmitting(false); }
    };

    if (loading) return <div style={styles.container}><h1>Cargando...</h1></div>;
    if (error) return <div style={styles.container}><h1>Error</h1><p>{error}</p></div>;
    if (!area) return <div style={styles.container}><h1>Diagnóstico no encontrado.</h1></div>;

    const activeModule = modules.find(m => m.id === activeModuleId);
    
    const getStatusLabel = () => {
        if (isReadOnly) return "Modo Lectura";
        if (area?.status === 'report_ready') return "Informe Listo";
        if (area?.status === 'completed') return "Completado";
        return "En Progreso";
    };

    return (
        <div style={styles.pageLayout}>
            <aside style={styles.sidebar}>
                <h2>{area.name}</h2>
                <p style={isFormDisabled ? styles.completedStatus : styles.progressStatus}>
                    Estado: {getStatusLabel()}
                </p>

                {error && !isReadOnly && <p style={styles.errorBox}>{error}</p>}

                <nav style={styles.nav}>
                    {modules.map(module => (
                        <button key={module.id} onClick={() => setActiveModuleId(module.id)}
                            style={activeModuleId === module.id ? styles.activeModuleButton : styles.moduleButton}
                            disabled={isFormDisabled}>
                            <span>{module.name}</span>
                            {formData[module.id] && Object.values(formData[module.id]).some(isAnswerValid) && <span style={styles.checkIcon}>✔️</span>}
                        </button>
                    ))}
                </nav>
                
                {/* Ocultar botones en modo solo lectura */}
                {!isReadOnly && (
                    <div style={{ marginTop: 'auto' }}>
                        <button onClick={handleSaveDraft} style={styles.saveButton} disabled={isSubmitting || isFormDisabled}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Borrador'}
                        </button>
                        <button onClick={handleFinalize} style={styles.submitButton} disabled={isSubmitting || isFormDisabled}>
                            Finalizar y Enviar
                        </button>
                    </div>
                )}
            </aside>
            <main style={styles.mainContent}>
                {isFormDisabled && !isReadOnly && (
                    <div style={styles.completedOverlay}>
                        <h2>Diagnóstico Enviado</h2>
                        <p>Gracias por completar el análisis.</p>
                    </div>
                )}
                {activeModule ? (
                    <fieldset disabled={isFormDisabled} style={{ border: 'none', padding: 0, margin: 0 }}>
                        <h1>{activeModule.name}</h1>
                        <form>
                            {activeModule.questions.map(q => (
                                <QuestionRenderer key={q.id} question={q}
                                    currentAnswer={formData[activeModule.id]?.[q.id]}
                                    onAnswerChange={handleAnswerChange}
                                    // Pasamos isReadOnly para que los componentes hijos también se deshabiliten
                                    isReadOnly={isFormDisabled} 
                                />
                            ))}
                        </form>
                    </fieldset>
                ) : <p>Selecciona un módulo para empezar.</p>}
            </main>
        </div>
    );
};


const styles: { [key: string]: React.CSSProperties } = {
    pageLayout: { display: 'flex', height: '100vh', backgroundColor: '#f9f9f9' },
    sidebar: { width: '320px', padding: '20px', backgroundColor: '#ffffff', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column' },
    nav: { marginTop: '10px' },
    progressStatus: { padding: '8px', borderRadius: '5px', backgroundColor: '#fffbe6', border: '1px solid #ffe58f', textAlign: 'center'},
    completedStatus: { padding: '8px', borderRadius: '5px', backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', textAlign: 'center'},
    moduleButton: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 15px', marginBottom: '8px', border: '1px solid #ccc', backgroundColor: 'white', textAlign: 'left', cursor: 'pointer', borderRadius: '5px', fontSize: '16px' },
    activeModuleButton: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 15px', marginBottom: '8px', border: '1px solid #007bff', backgroundColor: '#007bff', color: 'white', textAlign: 'left', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold' },
    checkIcon: { color: '#28a745', fontSize: '16px' },
    mainContent: { flex: 1, padding: '40px', overflowY: 'auto', position: 'relative' },
    container: { padding: '40px', textAlign: 'center' },
    saveButton: { width: '100%', padding: '15px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold' },
    submitButton: { width: '100%', padding: '15px', marginTop: '10px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold' },
    completedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
    errorBox: { backgroundColor: '#fff2f0', border: '1px solid #ffccc7', color: '#d93026', padding: '10px', borderRadius: '5px', marginTop: '15px', fontSize: '14px' }
};

export default ReportEditorPage;
