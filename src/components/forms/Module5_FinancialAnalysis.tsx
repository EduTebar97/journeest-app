
import React from 'react';
import { Module5Data } from '../../types';

interface Props {
  data: Module5Data;
  handleChange: (module: 'module5', field: string, value: string) => void;
}

const Module5_FinancialAnalysis: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 5: Análisis Financiero</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="revenueStreams" style={{ display: 'block', marginBottom: '5px' }}>
            Fuentes de Ingresos
          </label>
          <textarea
            id="revenueStreams"
            name="revenueStreams"
            rows={3}
            placeholder="Principales fuentes de ingresos del área."
            style={{ width: '100%', padding: '8px' }}
            value={data.revenueStreams}
            onChange={(e) => handleChange('module5', 'revenueStreams', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="mainCosts" style={{ display: 'block', marginBottom: '5px' }}>
            Principales Costes
          </label>
          <input
            type="text"
            id="mainCosts"
            name="mainCosts"
            placeholder="Principales costes operativos o de personal asociados al área."
            style={{ width: '100%', padding: '8px' }}
            value={data.mainCosts}
            onChange={(e) => handleChange('module5', 'mainCosts', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module5_FinancialAnalysis;
