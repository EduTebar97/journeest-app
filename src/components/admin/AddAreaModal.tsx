
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { nanoid } from 'nanoid';

// Props que el modal necesita para funcionar
interface AddAreaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAreaAdded: (newArea: any) => void; // Cambiar 'any' a un tipo más específico si es necesario
    companyId: string;
}

const AddAreaModal: React.FC<AddAreaModalProps> = ({ isOpen, onClose, onAreaAdded, companyId }) => {
    const { currentUser } = useAuth();
    
    const [areaName, setAreaName] = useState('');
    const [collaboratorName, setCollaboratorName] = useState('');
    const [collaboratorPosition, setCollaboratorPosition] = useState('');
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [isSelfAssigned, setIsSelfAssigned] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const finalCollaboratorName = isSelfAssigned ? (currentUser?.name || '') : collaboratorName;
        const finalCollaboratorPosition = isSelfAssigned ? (currentUser?.position || '') : collaboratorPosition;
        const finalCollaboratorEmail = isSelfAssigned ? (currentUser?.email || '') : collaboratorEmail;
        
        if (!areaName || !finalCollaboratorName || !finalCollaboratorEmail) {
            setError("Por favor, completa todos los campos requeridos.");
            return;
        }

        const newArea = {
            companyId: companyId,
            name: areaName,
            status: 'pending',
            formId: nanoid(12),
            createdAt: new Date(),
            responsible: {
                name: finalCollaboratorName,
                position: finalCollaboratorPosition,
                email: finalCollaboratorEmail,
            },
        };

        onAreaAdded(newArea);
        onClose(); // Cierra el modal al añadir
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Iniciar Nuevo Diagnóstico</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nombre del Área" value={areaName} onChange={e => setAreaName(e.target.value)} style={styles.input} required />
                    
                    <label>
                        <input type="checkbox" checked={isSelfAssigned} onChange={e => setIsSelfAssigned(e.target.checked)} />
                        Asignarme esta área
                    </label>

                    {!isSelfAssigned && (
                        <>
                            <input type="text" placeholder="Nombre del Colaborador" value={collaboratorName} onChange={e => setCollaboratorName(e.target.value)} style={styles.input} required/>
                            <input type="text" placeholder="Cargo del Colaborador" value={collaboratorPosition} onChange={e => setCollaboratorPosition(e.target.value)} style={styles.input} />
                            <input type="email" placeholder="Email del Colaborador" value={collaboratorEmail} onChange={e => setCollaboratorEmail(e.target.value)} style={styles.input} required/>
                        </>
                    )}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <div style={styles.buttonGroup}>
                        <button type="button" onClick={onClose} style={styles.cancelButton}>Cancelar</button>
                        <button type="submit" style={styles.submitButton}>Añadir Área</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '500px' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    cancelButton: { padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer' },
    submitButton: { padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#0052cc', color: 'white', cursor: 'pointer' },
};

export default AddAreaModal;
