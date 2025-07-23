
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReportEditorPage from '../pages/ReportEditorPage';
import { AuthProvider } from '../contexts/AuthContext';
import * as validation from '../utils/validation';

// --- MOCKS ---

vi.mock('../contexts/AuthContext', async (importOriginal) => {
    const mod = await importOriginal();
    return { ...mod, useAuth: () => ({ currentUser: null, loading: false }) };
});

const mockGetDocs = vi.fn();
const mockGetDoc = vi.fn();
const mockUpdateDoc = vi.fn();
vi.mock('firebase/firestore', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        getDocs: (q) => mockGetDocs(q),
        getDoc: (d) => mockGetDoc(d),
        updateDoc: (d, data) => mockUpdateDoc(d, data),
        doc: (db, path, id) => ({ path: `${path}/${id}` }),
        collection: (db, path) => ({ path }),
        query: (collectionRef) => collectionRef,
        where: vi.fn(),
        Timestamp: { now: vi.fn(() => ({ toDate: () => new Date() })) }
    };
});

vi.mock('../components/dynamic_form/QuestionRenderer', () => ({
    default: ({ question, onAnswerChange, isReadOnly }) => (
        <div>
            <p>{question.text}</p>
            <input
                aria-label={question.text}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                disabled={isReadOnly}
            />
        </div>
    )
}));

// Mock para validation que podemos espiar y controlar
vi.mock('../utils/validation');


describe('ReportEditorPage - Flujo del Colaborador', () => {

    const formId = 'test-form-123';
    
    const mockArea = { id: 'area-xyz', name: 'Análisis de Cocina', templateId: 'template-kitchen', formId };
    const mockTemplate = { id: 'template-kitchen', name: 'Plantilla de Cocinas', moduleIds: ['mod-food', 'mod-clean'] };
    const mockModule1 = { id: 'mod-food', name: 'Gestión de Alimentos', questions: [{ id: 'q1', text: '¿Cómo gestionan los perecederos?', type: 'textarea' }] };
    const mockModule2 = { id: 'mod-clean', name: 'Limpieza e Higiene', questions: [{ id: 'q2', text: '¿Con qué frecuencia limpian?', type: 'slider', options: ['Diario', 'Semanal'] }] };

    beforeEach(() => {
        vi.resetAllMocks();
        mockGetDocs.mockResolvedValue({ empty: false, docs: [{ id: mockArea.id, data: () => mockArea }] });
        mockGetDoc.mockImplementation((docRef) => {
            const path = docRef.path;
            if (path.includes('area_templates/')) return Promise.resolve({ exists: () => true, data: () => mockTemplate });
            if (path.includes('diagnostic_modules/mod-food')) return Promise.resolve({ exists: () => true, id: mockModule1.id, data: () => mockModule1 });
            if (path.includes('diagnostic_modules/mod-clean')) return Promise.resolve({ exists: () => true, id: mockModule2.id, data: () => mockModule2 });
            return Promise.resolve({ exists: () => false });
        });
        mockUpdateDoc.mockResolvedValue(undefined);
        vi.spyOn(window, 'alert').mockImplementation(() => {});
        vi.spyOn(window, 'confirm').mockReturnValue(true);
    });

    const renderComponent = (url) => {
        return render(
            <AuthProvider>
                <MemoryRouter initialEntries={[url]}>
                    <Routes>
                        <Route path="/report/editor/:formId" element={<ReportEditorPage />} />
                    </Routes>
                </MemoryRouter>
            </AuthProvider>
        );
    };

    it('debería cargar los datos y el primer módulo correctamente', async () => {
        renderComponent(`/report/editor/${formId}`);
        await waitFor(() => expect(screen.queryByText('Cargando...')).not.toBeInTheDocument());
        expect(screen.getByRole('heading', { name: 'Análisis de Cocina', level: 2 })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Gestión de Alimentos', level: 1 })).toBeInTheDocument();
    });

    it('debería permitir rellenar, guardar y finalizar el formulario', async () => {
        vi.mocked(validation.isAnswerValid).mockReturnValue(true); // Mockear validación como exitosa
        const user = userEvent.setup();
        renderComponent(`/report/editor/${formId}`);
        await waitFor(() => expect(screen.getByRole('heading', { name: 'Gestión de Alimentos' })).toBeInTheDocument());
        
        await user.type(screen.getByLabelText('¿Cómo gestionan los perecederos?'), 'Usamos un sistema FIFO.');
        await user.click(screen.getByRole('button', { name: /Limpieza e Higiene/i }));
        await waitFor(() => expect(screen.getByRole('heading', { name: 'Limpieza e Higiene' })).toBeInTheDocument());
        await user.type(screen.getByLabelText('¿Con qué frecuencia limpian?'), 'Diariamente.');
        await user.click(screen.getByRole('button', { name: 'Guardar Borrador' }));

        await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ status: 'in_progress' })));

        await user.click(screen.getByRole('button', { name: 'Finalizar y Enviar' }));
        await waitFor(() => expect(mockUpdateDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ status: 'completed' })));
    });

    it('debería estar en modo solo lectura si el parámetro readOnly es true', async () => {
        renderComponent(`/report/editor/${formId}?readOnly=true`);
        await waitFor(() => expect(screen.getByText('Estado: Modo Lectura')).toBeInTheDocument());

        // Verificar que los campos están deshabilitados
        const input = screen.getByLabelText('¿Cómo gestionan los perecederos?');
        expect(input).toBeDisabled();

        // Verificar que los botones de acción no existen
        expect(screen.queryByRole('button', { name: 'Guardar Borrador' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Finalizar y Enviar' })).not.toBeInTheDocument();
    });

    it('debería mostrar un error si se intenta finalizar con preguntas sin responder', async () => {
        vi.mocked(validation.isAnswerValid).mockReturnValue(false); // Mockear validación como fallida
        const user = userEvent.setup();
        renderComponent(`/report/editor/${formId}`);
        await waitFor(() => expect(screen.getByRole('heading', { name: 'Gestión de Alimentos' })).toBeInTheDocument());

        // Intentar finalizar sin rellenar nada
        await user.click(screen.getByRole('button', { name: 'Finalizar y Enviar' }));

        // Verificar que aparece el mensaje de error y no se guarda nada
        await waitFor(() => {
            expect(screen.getByText(/Por favor, completa los siguientes módulos/i)).toBeInTheDocument();
        });
        expect(mockUpdateDoc).not.toHaveBeenCalled();
    });
});
