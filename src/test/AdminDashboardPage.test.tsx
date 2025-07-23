
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import { AuthProvider } from '../contexts/AuthContext';

// --- MOCKS ---

// Mock de Autenticación
const clientUser = { uid: 'client-123', name: 'Admin User', email: 'client@company.com', role: 'client', companyId: 'comp-abc' };
vi.mock('../contexts/AuthContext', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        useAuth: () => ({ currentUser: clientUser, loading: false }),
    };
});

// Mock de Firestore (¡CON LA CORRECCIÓN DE HOISTING!)
const mockGetDocs = vi.fn();
vi.mock('firebase/firestore', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        // Se envuelve en una función para evitar el error de inicialización
        getDocs: (...args) => mockGetDocs(...args),
        addDoc: vi.fn(),
        collection: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
    };
});

// Mock de nanoid
vi.mock('nanoid', () => ({
    nanoid: () => 'mocked-nanoid-123',
}));

describe('AdminDashboardPage - Flujo del Administrador de Empresa', () => {

    const renderComponent = () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <AdminDashboardPage />
                </AuthProvider>
            </BrowserRouter>
        );
    };

    // Resetear mocks antes de cada prueba para asegurar aislamiento
    beforeEach(() => {
        mockGetDocs.mockClear();
        // Configuramos una respuesta por defecto para getDocs
        mockGetDocs.mockResolvedValue({ docs: [] });
    });

    it('debería abrir el modal "Iniciar Nuevo Diagnóstico" al hacer clic en "+ Añadir Área"', async () => {
        renderComponent();
        await waitFor(() => expect(screen.getByText('Panel de Diagnóstico')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /\+ Añadir Área/i }));

        await waitFor(() => expect(screen.getByText('Iniciar Nuevo Diagnóstico')).toBeInTheDocument());
    });

    it('debería enviar el formulario del modal y refrescar la lista de áreas', async () => {
        renderComponent();
        await waitFor(() => expect(screen.getByText('Panel de Diagnóstico')).toBeInTheDocument());
        
        expect(mockGetDocs).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('button', { name: /\+ Añadir Área/i }));
        await waitFor(() => expect(screen.getByText('Iniciar Nuevo Diagnóstico')).toBeInTheDocument());

        fireEvent.change(screen.getByPlaceholderText('Nombre del Área'), { target: { value: 'Nueva Área de Marketing' } });
        fireEvent.change(screen.getByPlaceholderText('Nombre del Colaborador'), { target: { value: 'Juan Pérez' } });
        fireEvent.change(screen.getByPlaceholderText('Email del Colaborador'), { target: { value: 'juan.perez@test.com' } });

        fireEvent.click(screen.getByRole('button', { name: 'Añadir Área' }));

        await waitFor(() => {
            expect(screen.queryByText('Iniciar Nuevo Diagnóstico')).not.toBeInTheDocument();
            expect(mockGetDocs).toHaveBeenCalledTimes(2);
        });
    });
});
