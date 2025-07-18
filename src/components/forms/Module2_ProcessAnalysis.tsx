
import React from 'react';
import { Module2Data } from '../../types';

interface Props {
  data: Module2Data;
  handleChange: (module: 'module2', field: string, value: string) => void;
}

const Module2_ProcessAnalysis: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 2: Análisis de Procesos y Logística</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="mainProcess" style={{ display: 'block', marginBottom: '5px' }}>
            Proceso Principal del Área
          </label>
          <textarea
            id="mainProcess"
            name="mainProcess"
            rows={4}
            placeholder="Describe el flujo de trabajo principal de esta área, desde el inicio hasta el final."
            style={{ width: '100%', padding: '8px' }}
            value={data.mainProcess}
            onChange={(e) => handleChange('module2', 'mainProcess', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="bottlenecks" style={{ display: 'block', marginBottom: '5px' }}>
            Cuellos de Botella Identificados
          </label>
          <input
            type="text"
            id="bottlenecks"
            name="bottlenecks"
            placeholder="¿En qué puntos se ralentiza o se detiene el trabajo?"
            style={{ width: '100%', padding: '8px' }}
            value={data.bottlenecks}
            onChange={(e) => handleChange('module2', 'bottlenecks', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module2_ProcessAnalysis;
