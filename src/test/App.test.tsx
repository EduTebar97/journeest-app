
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';

// --- MOCKS ---

// 1. Mock de Autenticación
const mockUseAuth = vi.fn();
vi.mock('../contexts/AuthContext', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...(mod as any),
        useAuth: () => mockUseAuth(),
    };
});

// 2. Mock de Firestore (¡NUEVO!)
// Esto intercepta las llamadas a la base de datos y devuelve una respuesta controlada.
vi.mock('firebase/firestore', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...(mod as any),
        getDocs: vi.fn(() => Promise.resolve({ docs: [] })), // Simula una respuesta exitosa y vacía
        collection: vi.fn(),
        query: vi.fn(),
        where: vi.fn(),
    };
});


describe('App Routing', () => {
    const renderApp = (initialRoute: string) => {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </MemoryRouter>
        );
    };

    describe('Rutas Públicas', () => {
        beforeEach(() => {
            mockUseAuth.mockReturnValue({ currentUser: null, loading: false });
        });

        it('debería renderizar WelcomePage en la ruta raíz', async () => {
            renderApp('/');
            await waitFor(() => {
                expect(screen.getByText('Transforma tu negocio turístico con inteligencia.')).toBeInTheDocument();
            });
        });

        it('debería renderizar LoginPage en la ruta /login', async () => {
            renderApp('/login');
            await waitFor(() => {
                expect(screen.getByText('Bienvenido de nuevo a Journeest.')).toBeInTheDocument();
            });
        });
    });

    describe('Rutas Protegidas', () => {
        it('debería redirigir al login si un usuario NO autenticado intenta acceder al dashboard de cliente', async () => {
            mockUseAuth.mockReturnValue({ currentUser: null, loading: false });
            renderApp('/dashboard/client');
            await waitFor(() => {
                expect(screen.getByText('Bienvenido de nuevo a Journeest.')).toBeInTheDocument();
            });
        });

        it('debería permitir el acceso al dashboard si el usuario es un cliente autenticado', async () => {
            const clientUser = { uid: '123', email: 'client@example.com', role: 'client', companyId: 'comp-123' };
            mockUseAuth.mockReturnValue({ currentUser: clientUser, loading: false });
            
            renderApp('/dashboard/client');

            // Ahora, como 'getDocs' devuelve una respuesta, el loading se completará
            // y podremos encontrar el título del panel.
            await waitFor(() => {
                expect(screen.getByText('Panel de Diagnóstico')).toBeInTheDocument();
            });
        });
    });
});
