
import React from 'react';
import { Module3Data } from '../../types';

interface Props {
  data: Module3Data;
  handleChange: (module: 'module3', field: string, value: string) => void;
}

const Module3_MarketingAndSales: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 3: Marketing y Ventas</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="marketingStrategy" style={{ display: 'block', marginBottom: '5px' }}>
            Estrategia de Marketing
          </label>
          <textarea
            id="marketingStrategy"
            name="marketingStrategy"
            rows={3}
            placeholder="Describe las principales acciones de marketing que realiza el área."
            style={{ width: '100%', padding: '8px' }}
            value={data.marketingStrategy}
            onChange={(e) => handleChange('module3', 'marketingStrategy', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="salesChannels" style={{ display: 'block', marginBottom: '5px' }}>
            Canales de Venta
          </label>
          <input
            type="text"
            id="salesChannels"
            name="salesChannels"
            placeholder="¿Cuáles son los principales canales de venta? (Ej: Web, OTAs, touroperadores)"
            style={{ width: '100%', padding: '8px' }}
            value={data.salesChannels}
            onChange={(e) => handleChange('module3', 'salesChannels', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module3_MarketingAndSales;
