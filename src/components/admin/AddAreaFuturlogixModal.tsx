
import React, { useState, useEffect } from 'react';
import { Company, AreaTemplate } from '../../types';
import { nanoid } from 'nanoid';

// Props que el modal necesita para funcionar
interface AddAreaFuturlogixModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAreaAdded: (newArea: any) => void;
    companies: Company[];
    templates: AreaTemplate[];
}

const AddAreaFuturlogixModal: React.FC<AddAreaFuturlogixModalProps> = ({ isOpen, onClose, onAreaAdded, companies, templates }) => {
    // Form state
    const [selectedCompanyId, setSelectedCompanyId] = useState('');
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [areaName, setAreaName] = useState('');
    const [collaboratorName, setCollaboratorName] = useState('');
    const [collaboratorPosition, setCollaboratorPosition] = useState('');
    const [collaboratorEmail, setCollaboratorEmail] = useState('');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedCompanyId || !selectedTemplateId || !areaName || !collaboratorEmail) {
            setError("Por favor, completa todos los campos obligatorios: Empresa, Plantilla, Nombre del Área y Email del responsable.");
            return;
        }

        const newArea = {
            companyId: selectedCompanyId,
            templateId: selectedTemplateId,
            name: areaName,
            status: 'pending',
            formId: nanoid(12),
            createdAt: new Date(),
            responsible: {
                name: collaboratorName,
                position: collaboratorPosition,
                email: collaboratorEmail,
            },
        };

        onAreaAdded(newArea);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Crear Diagnóstico (Futurlogix)</h2>
                <p>Crea un nuevo diagnóstico para una empresa y asígnale una plantilla específica.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="company-select" style={styles.label}>Empresa Cliente (*)</label>
                    <select id="company-select" value={selectedCompanyId} onChange={e => setSelectedCompanyId(e.target.value)} style={styles.input} required>
                        <option value="" disabled>Selecciona una empresa...</option>
                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    <label htmlFor="template-select" style={styles.label}>Plantilla de Diagnóstico (*)</label>
                    <select id="template-select" value={selectedTemplateId} onChange={e => setSelectedTemplateId(e.target.value)} style={styles.input} required>
                        <option value="" disabled>Selecciona una plantilla...</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    
                    <hr style={styles.hr} />

                    <label htmlFor="area-name" style={styles.label}>Nombre del Área (*)</label>
                    <input id="area-name" type="text" placeholder="Ej: Marketing y Ventas" value={areaName} onChange={e => setAreaName(e.target.value)} style={styles.input} required />
                    
                    <label htmlFor="collab-name" style={styles.label}>Nombre del Responsable</label>
                    <input id="collab-name" type="text" placeholder="Nombre y Apellido" value={collaboratorName} onChange={e => setCollaboratorName(e.target.value)} style={styles.input} />
                    
                    <label htmlFor="collab-position" style={styles.label}>Cargo del Responsable</label>
                    <input id="collab-position" type="text" placeholder="Ej: Director de Marketing" value={collaboratorPosition} onChange={e => setCollaboratorPosition(e.target.value)} style={styles.input} />

                    <label htmlFor="collab-email" style={styles.label}>Email del Responsable (*)</label>
                    <input id="collab-email" type="email" placeholder="email@cliente.com" value={collaboratorEmail} onChange={e => setCollaboratorEmail(e.target.value)} style={styles.input} required/>

                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <div style={styles.buttonGroup}>
                        <button type="button" onClick={onClose} style={styles.cancelButton}>Cancelar</button>
                        <button type="submit" style={styles.submitButton}>Crear Diagnóstico</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' },
    input: { width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
    hr: { border: 'none', borderTop: '1px solid #eee', margin: '20px 0' },
    buttonGroup: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    cancelButton: { padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: 'transparent', cursor: 'pointer' },
    submitButton: { padding: '10px 20px', border: 'none', borderRadius: '4px', backgroundColor: '#0052cc', color: 'white', cursor: 'pointer' },
};

export default AddAreaFuturlogixModal;
