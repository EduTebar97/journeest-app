
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ModuleListPage from '../pages/admin/ModuleListPage';
import { AuthProvider } from '../contexts/AuthContext';

// --- MOCKS ---

vi.mock('../contexts/AuthContext', async (importOriginal) => {
    const mod = await importOriginal();
    return { ...mod, useAuth: () => ({ currentUser: { uid: 'futurlogix-admin', role: 'futurlogix' } }) };
});

const mockGetDocs = vi.fn();
vi.mock('firebase/firestore', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        getDocs: (q) => mockGetDocs(q),
        collection: (db, path) => ({ path }),
    };
});


describe('ModuleListPage - Flujo del Administrador de Futurlogix', () => {

    const mockModules = [
        { id: 'mod-1', name: 'Análisis Estratégico', questions: [{}, {}, {}] },
        { id: 'mod-2', name: 'Análisis de Procesos', questions: [{}, {}, {}, {}, {}] },
    ];

    beforeEach(() => {
        vi.resetAllMocks();
        // Simular la respuesta de getDocs con nuestros módulos de prueba
        mockGetDocs.mockResolvedValue({
            docs: mockModules.map(m => ({ id: m.id, data: () => m }))
        });
    });

    const renderComponent = () => {
        render(
            <AuthProvider>
                <BrowserRouter>
                    <ModuleListPage />
                </BrowserRouter>
            </AuthProvider>
        );
    };

    it('debería renderizar la lista de módulos correctamente', async () => {
        renderComponent();

        // Esperar a que el estado de carga desaparezca
        await waitFor(() => {
            expect(screen.queryByText('Cargando módulos...')).not.toBeInTheDocument();
        });

        // Verificar que los datos de prueba se muestran en la tabla
        expect(screen.getByText('Análisis Estratégico')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Nº de preguntas
        expect(screen.getByText('Análisis de Procesos')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument(); // Nº de preguntas
    });
});
