
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AreaListPage from '../pages/admin/AreaListPage';
import * as companyService from '../services/companyService';

// --- MOCKS ---

vi.mock('../contexts/AuthContext', async (importOriginal) => {
    const mod = await importOriginal();
    return { ...mod, useAuth: () => ({ currentUser: { uid: 'futurlogix-admin', role: 'futurlogix' }, loading: false }) };
});

const mockGetDocs = vi.fn();
const mockAddDoc = vi.fn();
vi.mock('firebase/firestore', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        getDocs: (q) => mockGetDocs(q),
        addDoc: (collectionRef, data) => mockAddDoc(collectionRef, data),
        query: vi.fn((collectionRef) => collectionRef),
        collection: vi.fn((db, path) => ({ path, id: 'mocked_collection' })),
        orderBy: vi.fn(),
        Timestamp: { now: vi.fn(() => ({ toDate: () => new Date() })) }
    };
});

vi.mock('../services/companyService', () => ({ getAllCompanies: vi.fn() }));
vi.mock('nanoid', () => ({ nanoid: () => 'new-area-nanoid' }));


describe('AreaListPage - Flujo del Administrador de Futurlogix', () => {

    const mockAreas = [{ id: 'area-1', name: 'Recepción Hotel Sol', companyId: 'comp-1', status: 'completed' }];
    const mockCompanies = [{ id: 'comp-1', name: 'Hotel Sol' }, { id: 'comp-2', name: 'Restaurante Luna' }];
    const mockTemplates = [{ id: 'template-1', name: 'Plantilla de Hoteles' }];

    beforeEach(() => {
        vi.resetAllMocks();
        mockGetDocs.mockImplementation((query) => {
            if (query.path.includes('areas')) return Promise.resolve({ docs: mockAreas.map(d => ({ id: d.id, data: () => d })) });
            if (query.path.includes('area_templates')) return Promise.resolve({ docs: mockTemplates.map(d => ({ id: d.id, data: () => d })) });
            return Promise.resolve({ docs: [] });
        });
        vi.spyOn(companyService, 'getAllCompanies').mockResolvedValue(mockCompanies);
        mockAddDoc.mockResolvedValue({ id: 'new-doc-id' });
        
        // CORRECCIÓN: Mock para window.alert
        vi.spyOn(window, 'alert').mockImplementation(() => {});
    });

    const renderComponent = () => render(<BrowserRouter><AreaListPage /></BrowserRouter>);

    it('debería renderizar la lista de áreas y compañías correctamente', async () => {
        renderComponent();
        await waitFor(() => expect(screen.queryByText('Cargando datos del panel...')).not.toBeInTheDocument());
        expect(screen.getByText('Recepción Hotel Sol')).toBeInTheDocument();
        expect(screen.getByText('Hotel Sol')).toBeInTheDocument();
    });

    it('debería abrir el modal, rellenar el formulario y llamar a addDoc con los datos correctos', async () => {
        const user = userEvent.setup();
        renderComponent();
        await waitFor(() => expect(screen.getByText('Áreas de Diagnóstico Creadas')).toBeInTheDocument());

        await user.click(screen.getByRole('button', { name: /Crear Nueva Área/i }));
        await waitFor(() => expect(screen.getByText('Crear Diagnóstico (Futurlogix)')).toBeInTheDocument());

        await user.selectOptions(screen.getByLabelText(/Empresa Cliente/i), 'comp-2');
        await user.selectOptions(screen.getByLabelText(/Plantilla de Diagnóstico/i), 'template-1');
        await user.type(screen.getByLabelText(/Nombre del Área/i), 'Nueva Área de Prueba');
        await user.type(screen.getByLabelText(/Email del Responsable/i), 'test@test.com');

        await user.click(screen.getByRole('button', { name: /Crear Diagnóstico/i }));

        await waitFor(() => {
            expect(mockAddDoc).toHaveBeenCalledTimes(1);
            const addDocCall = mockAddDoc.mock.calls[0];
            const sentData = addDocCall[1];
            
            expect(sentData.name).toBe('Nueva Área de Prueba');
            expect(sentData.companyId).toBe('comp-2');
        });
        
        expect(screen.queryByText('Crear Diagnóstico (Futurlogix)')).not.toBeInTheDocument();
    });
});
