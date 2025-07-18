
import React from 'react';
import { Module4Data } from '../../types';

interface Props {
  data: Module4Data;
  handleChange: (module: 'module4', field: string, value: string) => void;
}

const Module4_CustomerService: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 4: Atención al Cliente</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="customerSupportProcess" style={{ display: 'block', marginBottom: '5px' }}>
            Proceso de Soporte al Cliente
          </label>
          <textarea
            id="customerSupportProcess"
            name="customerSupportProcess"
            rows={3}
            placeholder="Describe cómo se gestionan las dudas y problemas de los clientes."
            style={{ width: '100%', padding: '8px' }}
            value={data.customerSupportProcess}
            onChange={(e) => handleChange('module4', 'customerSupportProcess', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="satisfactionMetrics" style={{ display: 'block', marginBottom: '5px' }}>
            Métricas de Satisfacción
          </label>
          <input
            type="text"
            id="satisfactionMetrics"
            name="satisfactionMetrics"
            placeholder="¿Cómo se mide la satisfacción? (Ej: NPS, encuestas, reseñas online)"
            style={{ width: '100%', padding: '8px' }}
            value={data.satisfactionMetrics}
            onChange={(e) => handleChange('module4', 'satisfactionMetrics', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module4_CustomerService;
