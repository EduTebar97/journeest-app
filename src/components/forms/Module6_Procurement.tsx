
import React from 'react';
import { Module6Data } from '../../types';

interface Props {
  data: Module6Data;
  handleChange: (module: 'module6', field: string, value: string) => void;
}

const Module6_Procurement: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 6: Compras y Proveedores</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="supplierManagement" style={{ display: 'block', marginBottom: '5px' }}>
            Gestión de Proveedores
          </label>
          <textarea
            id="supplierManagement"
            name="supplierManagement"
            rows={3}
            placeholder="¿Cómo se seleccionan y gestionan los proveedores?"
            style={{ width: '100%', padding: '8px' }}
            value={data.supplierManagement}
            onChange={(e) => handleChange('module6', 'supplierManagement', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="procurementProcess" style={{ display: 'block', marginBottom: '5px' }}>
            Proceso de Compra
          </label>
          <input
            type="text"
            id="procurementProcess"
            name="procurementProcess"
            placeholder="Describe el proceso desde la solicitud hasta la recepción de un producto/servicio."
            style={{ width: '100%', padding: '8px' }}
            value={data.procurementProcess}
            onChange={(e) => handleChange('module6', 'procurementProcess', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module6_Procurement;
