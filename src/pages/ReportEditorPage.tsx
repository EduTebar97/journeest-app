
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Area, AreaTemplate, DiagnosticModule, ModularFormData, Answer, Question } from '../types';
import QuestionRenderer from '../components/dynamic_form/QuestionRenderer';

// --- Helper Functions ---
const isAnswerValid = (answer: Answer | undefined): boolean => {
    if (answer === undefined || answer === null) return false;
    if (typeof answer === 'string' && answer.trim() === '') return false;
    if (Array.isArray(answer) && answer.length === 0) return false;
    // For dynamic_list, check if all items are empty
    if (Array.isArray(answer) && answer.every(item => typeof item === 'object' && 'value' in item && item.value.trim() === '')) return false;
    return true;
};


const ReportEditorPage: React.FC = () => {
    const { formId } = useParams<{ formId: string }>();
    const navigate = useNavigate();

    // State
    const [area, setArea] = useState<Area | null>(null);
    const [modules, setModules] = useState<DiagnosticModule[]>([]);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ModularFormData>({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    // --- DATA FETCHING ---
    useEffect(() => {
        // (Fetching logic remains the same)
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
                setIsCompleted(areaData.status === 'completed');
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

    // --- FORM HANDLERS ---
    const handleAnswerChange = useCallback((questionId: string, answer: Answer) => {
        if (!activeModuleId || isCompleted) return;
        // Clear error when user starts typing again
        if (error) setError(null);
        setFormData(prevData => ({ ...prevData, [activeModuleId]: { ...prevData[activeModuleId], [questionId]: answer } }));
    }, [activeModuleId, isCompleted, error]);

    const handleSaveDraft = async () => {
        if (!area || isCompleted) return;
        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, 'areas', area.id), { formData, status: 'in_progress' });
            alert("Progreso guardado.");
        } catch (err) { setError("No se pudo guardar. Inténtalo de nuevo."); } finally { setIsSubmitting(false); }
    };

    const handleFinalize = async () => {
        if (!area || isCompleted) return;
        
        // --- VALIDATION LOGIC ---
        const incompleteModules: string[] = [];
        modules.forEach(module => {
            const allQuestionsAnswered = module.questions.every(question => {
                const answer = formData[module.id]?.[question.id];
                return isAnswerValid(answer);
            });
            if (!allQuestionsAnswered) {
                incompleteModules.push(module.name);
            }
        });

        if (incompleteModules.length > 0) {
            setError(`No se puede finalizar. Por favor, completa todas las preguntas en los siguientes módulos: ${incompleteModules.join(', ')}.`);
            return;
        }
        
        const isConfirmed = window.confirm("¿Estás seguro de que quieres finalizar y enviar el diagnóstico? No podrás realizar más cambios.");
        if (!isConfirmed) return;

        setIsSubmitting(true);
        try {
            await updateDoc(doc(db, 'areas', area.id), {
                formData,
                status: 'completed',
                completedAt: Timestamp.now()
            });
            setIsCompleted(true);
            alert("Diagnóstico finalizado y enviado con éxito.");
        } catch (err) { setError("Ocurrió un error al finalizar."); } finally { setIsSubmitting(false); }
    };

    // --- RENDER LOGIC ---
    if (loading) return <div style={styles.container}><h1>Cargando...</h1></div>;
    // Main error display
    if (error && !loading && !area) return <div style={styles.container}><h1>Error</h1><p>{error}</p></div>;
    if (!area) return <div style={styles.container}><h1>Diagnóstico no encontrado.</h1></div>;

    const activeModule = modules.find(m => m.id === activeModuleId);

    return (
        <div style={styles.pageLayout}>
            <aside style={styles.sidebar}>
                <h2>{area.name}</h2>
                <p style={isCompleted ? styles.completedStatus : styles.progressStatus}>
                    {isCompleted ? 'Estado: Completado' : 'Estado: En Progreso'}
                </p>

                {/* Inline error for validation */}
                {error && <p style={styles.errorBox}>{error}</p>}

                <nav style={styles.nav}>
                    {modules.map(module => {
                        const hasData = formData[module.id] && Object.values(formData[module.id]).some(isAnswerValid);
                        return (
                            <button key={module.id} onClick={() => setActiveModuleId(module.id)}
                                style={activeModuleId === module.id ? styles.activeModuleButton : styles.moduleButton}
                                disabled={isCompleted}>
                                <span>{module.name}</span>
                                {hasData && <span style={styles.checkIcon}>✔️</span>}
                            </button>
                        );
                    })}
                </nav>
                <div style={{ marginTop: 'auto' }}>
                    <button onClick={handleSaveDraft} style={styles.saveButton} disabled={isSubmitting || isCompleted}>
                        {isSubmitting ? 'Guardando...' : 'Guardar Borrador'}
                    </button>
                    <button onClick={handleFinalize} style={styles.submitButton} disabled={isSubmitting || isCompleted}>
                        Finalizar y Enviar
                    </button>
                </div>
            </aside>
            <main style={styles.mainContent}>
                {isCompleted && (
                    <div style={styles.completedOverlay}>
                        <h2>Diagnóstico Enviado</h2>
                        <p>Gracias por completar el análisis.</p>
                    </div>
                )}
                {activeModule ? (
                    <fieldset disabled={isCompleted} style={{ border: 'none', padding: 0, margin: 0 }}>
                        <h1>{activeModule.name}</h1>
                        <form>
                            {activeModule.questions.map(q => (
                                <QuestionRenderer key={q.id} question={q}
                                    currentAnswer={formData[activeModule.id]?.[q.id]}
                                    onAnswerChange={handleAnswerChange}
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
    // ... (other styles remain the same)
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
