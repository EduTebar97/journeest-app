
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from '../pages/auth/LoginPage';
import { AuthProvider } from '../contexts/AuthContext';

// Mockear el contexto de autenticación y la navegación
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../contexts/AuthContext', async () => {
    const actual = await vi.importActual('../contexts/AuthContext');
    return {
        ...actual,
        useAuth: () => ({
            login: mockLogin,
        }),
    };
});

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('LoginPage', () => {
    it('debería llamar a la función de login y redirigir al dashboard si las credenciales son correctas', async () => {
        // 1. Renderizar el componente
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </BrowserRouter>
        );

        // 2. Simular que el usuario escribe en los campos
        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: 'password123' } });

        // 3. Simular el clic en el botón de login
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        // 4. Verificar que se llamó a la función de login y la redirección
        await waitFor(() => {
            // Se llamó a la función de login con los datos del formulario
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
            // El usuario fue redirigido a la página correcta
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
        });
    });
});
