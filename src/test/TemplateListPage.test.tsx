
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TemplateListPage from '../pages/admin/TemplateListPage';
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


describe('TemplateListPage - Flujo del Administrador de Futurlogix', () => {

    const mockTemplates = [
        { id: 'template-1', name: 'Diagnóstico Estándar para Hoteles', description: 'Cubre todas las áreas de un hotel.', moduleIds: ['mod-1', 'mod-2', 'mod-3'] },
        { id: 'template-2', name: 'Diagnóstico para Restaurantes', description: 'Enfocado en cocina y servicio.', moduleIds: ['mod-2', 'mod-4'] },
    ];

    beforeEach(() => {
        vi.resetAllMocks();
        // Simular la respuesta de getDocs con nuestros módulos de prueba
        mockGetDocs.mockResolvedValue({
            docs: mockTemplates.map(t => ({ id: t.id, data: () => t }))
        });
    });

    const renderComponent = () => {
        render(
            <AuthProvider>
                <BrowserRouter>
                    <TemplateListPage />
                </BrowserRouter>
            </AuthProvider>
        );
    };

    it('debería renderizar la lista de plantillas correctamente', async () => {
        renderComponent();

        // Esperar a que el estado de carga desaparezca
        await waitFor(() => {
            expect(screen.queryByText('Cargando plantillas...')).not.toBeInTheDocument();
        });

        // Verificar que los datos de prueba se muestran en la tabla
        expect(screen.getByText('Diagnóstico Estándar para Hoteles')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Nº de módulos
        expect(screen.getByText('Diagnóstico para Restaurantes')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument(); // Nº de módulos
    });
});
