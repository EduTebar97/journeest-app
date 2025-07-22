
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../contexts/AuthContext';
import { Company } from '../../types';

const OverallReportEditorPage: React.FC = () => {
    const [draft, setDraft] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useContext(AuthContext)!;
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser?.companyId) {
            setError("No se pudo identificar la empresa del usuario.");
            setLoading(false);
            return;
        }

        const fetchDraft = async () => {
            try {
                const companyRef = doc(db, 'companies', currentUser.companyId!);
                const companySnap = await getDoc(companyRef);

                if (companySnap.exists()) {
                    const companyData = companySnap.data() as Company;
                    setDraft(companyData.overallReportDraft || 'No se encontró un borrador. Puede que aún no se haya generado.');
                } else {
                    throw new Error("No se encontró el documento de la empresa.");
                }
            } catch (err) {
                setError("Error al cargar el borrador del informe general.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDraft();
    }, [currentUser]);

    const handleSendToClient = async () => {
        if (!currentUser?.companyId) {
            setError("No se puede enviar el informe: falta la identificación de la empresa.");
            return;
        }

        const confirmation = window.confirm("¿Estás seguro de que quieres enviar este informe al cliente? Esta acción no se puede deshacer.");
        if (!confirmation) return;

        setIsSubmitting(true);
        try {
            const companyRef = doc(db, "companies", currentUser.companyId);
            await updateDoc(companyRef, {
                overallReportDraft: draft, // Guardar el texto final editado
                finalReportReady: true
            });
            alert("¡Informe final enviado al cliente con éxito!");
            navigate('/admin/dashboard'); // Redirigir al panel principal
        } catch (err) {
            setError("Hubo un error al enviar el informe. Inténtalo de nuevo.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <div style={styles.container}><h1>Cargando editor...</h1></div>;
    if (error) return <div style={styles.container}><h1 style={{color: 'red'}}>Error</h1><p>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1>Editor del Diagnóstico General</h1>
            <p>Revisa y ajusta el borrador generado por la IA antes de enviarlo al cliente.</p>

            <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                style={styles.editor}
                rows={25}
                disabled={isSubmitting}
            />

            <button 
                onClick={handleSendToClient} 
                style={styles.submitButton}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Enviando...' : 'Enviar al Cliente'}
            </button>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '900px',
        margin: 'auto',
        padding: '2rem',
    },
    editor: {
        width: '100%',
        padding: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
        marginTop: '1.5rem',
        lineHeight: 1.6,
    },
    submitButton: {
        display: 'block',
        width: '100%',
        padding: '15px',
        marginTop: '1.5rem',
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#28a745',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
    }
};

export default OverallReportEditorPage;
