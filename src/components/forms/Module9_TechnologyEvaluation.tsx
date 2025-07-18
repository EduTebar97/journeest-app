
import React from 'react';
import { Module9Data } from '../../types';

interface Props {
    data: Module9Data;
    handleChange: (module: 'module9', field: string, value: string) => void;
}

const Module9_TechnologyEvaluation: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 9: Evaluación Tecnológica y Madurez Digital</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="current-software" style={{ display: 'block', marginBottom: '5px' }}>
            Software y Herramientas Utilizadas
          </label>
          <textarea
            id="current-software"
            name="currentSoftware"
            rows={4}
            placeholder="Lista el software principal que utiliza el área (PMS, CRM, Channel Manager, etc.)"
            style={{ width: '100%', padding: '8px' }}
            value={data.currentSoftware}
            onChange={(e) => handleChange('module9', 'currentSoftware', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="tech-gaps" style={{ display: 'block', marginBottom: '5px' }}>
            Carencias Tecnológicas
          </label>
          <input
            type="text"
            id="tech-gaps"
            name="techGaps"
            placeholder="¿Qué tecnología echan en falta para mejorar su rendimiento?"
            style={{ width: '100%', padding: '8px' }}
            value={data.techGaps}
            onChange={(e) => handleChange('module9', 'techGaps', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module9_TechnologyEvaluation;
