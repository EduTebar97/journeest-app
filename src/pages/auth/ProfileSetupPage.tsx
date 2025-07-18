
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const ProfileSetupPage: React.FC = () => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim() || !lastName.trim() || !position.trim()) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        if (!currentUser) {
            setError('No se ha encontrado un usuario autenticado. Por favor, inicia sesión de nuevo.');
            return;
        }

        setLoading(true);
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userDocRef, {
                name,
                lastName,
                position,
            });
            // Una vez completado el perfil, lo enviamos al flujo de onboarding
            navigate('/onboarding/areas/intro');
        } catch (err) {
            console.error("Error updating profile:", err);
            setError('Hubo un problema al actualizar tu perfil.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h2>Completa tu Perfil</h2>
            <p>¡Ya casi estás! Solo necesitamos algunos datos más sobre ti.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="name">Nombre</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{width: '100%', padding: '8px'}}/>
                </div>
                <div>
                    <label htmlFor="lastName">Apellido</label>
                    <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{width: '100%', padding: '8px'}}/>
                </div>
                <div>
                    <label htmlFor="position">Tu Puesto en la Empresa</label>
                    <input id="position" type="text" value={position} onChange={(e) => setPosition(e.target.value)} required style={{width: '100%', padding: '8px'}}/>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading} style={{padding: '10px'}}>
                    {loading ? 'Guardando...' : 'Guardar y Continuar'}
                </button>
            </form>
        </div>
    );
};

export default ProfileSetupPage;
