
import React from 'react';
import { Module8Data } from '../../types';

interface Props {
    data: Module8Data;
    handleChange: (module: 'module8', field: string, value: string) => void;
}

const Module8_OrganizationalCulture: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 8: Análisis de Cultura Organizacional</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="team-values" style={{ display: 'block', marginBottom: '5px' }}>
            Valores del Equipo
          </label>
          <input
            type="text"
            id="team-values"
            name="teamValues"
            placeholder="¿Qué valores definen al equipo? (Ej: Colaboración, innovación...)"
            style={{ width: '100%', padding: '8px' }}
            value={data.teamValues}
            onChange={(e) => handleChange('module8', 'teamValues', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="communication" style={{ display: 'block', marginBottom: '5px' }}>
            Comunicación Interna
          </label>
          <textarea
            id="communication"
            name="communication"
            rows={3}
            placeholder="¿Cómo es la comunicación dentro del área y con otros departamentos?"
            style={{ width: '100%', padding: '8px' }}
            value={data.communication}
            onChange={(e) => handleChange('module8', 'communication', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module8_OrganizationalCulture;
