
import React from 'react';
import { Module1Data } from '../../types';

interface Props {
  data: Module1Data;
  handleChange: (module: 'module1', field: string, value: string) => void;
}

const Module1_StrategicAnalysis: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 1: Análisis Estratégico</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="mission" style={{ display: 'block', marginBottom: '5px' }}>
            Misión del Área
          </label>
          <textarea
            id="mission"
            name="mission"
            rows={3}
            placeholder="Describe la razón de ser de esta área dentro de la empresa..."
            style={{ width: '100%', padding: '8px' }}
            value={data.mission}
            onChange={(e) => handleChange('module1', 'mission', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="vision" style={{ display: 'block', marginBottom: '5px' }}>
            Visión del Área
          </label>
          <textarea
            id="vision"
            name="vision"
            rows={3}
            placeholder="¿Qué se espera que esta área logre o en qué se espera que se convierta en el futuro?"
            style={{ width: '100%', padding: '8px' }}
            value={data.vision}
            onChange={(e) => handleChange('module1', 'vision', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="goals" style={{ display: 'block', marginBottom: '5px' }}>
            Objetivos Clave (KPIs)
          </label>
          <input
            type="text"
            id="goals"
            name="goals"
            placeholder="Ej: Aumentar la satisfacción del cliente en un 10%, Reducir costes un 5%"
            style={{ width: '100%', padding: '8px' }}
            value={data.goals}
            onChange={(e) => handleChange('module1', 'goals', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module1_StrategicAnalysis;
