
import React from 'react';
import { Module7Data } from '../../types';

interface Props {
  data: Module7Data;
  handleChange: (module: 'module7', field: string, value: string) => void;
}

const Module7_HumanResources: React.FC<Props> = ({ data, handleChange }) => {
  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
      <h3>Módulo 7: Recursos Humanos</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="teamStructure" style={{ display: 'block', marginBottom: '5px' }}>
            Estructura del Equipo
          </label>
          <textarea
            id="teamStructure"
            name="teamStructure"
            rows={3}
            placeholder="Describe los roles y la jerarquía dentro del área."
            style={{ width: '100%', padding: '8px' }}
            value={data.teamStructure}
            onChange={(e) => handleChange('module7', 'teamStructure', e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="trainingPrograms" style={{ display: 'block', marginBottom: '5px' }}>
            Programas de Formación
          </label>
          <input
            type="text"
            id="trainingPrograms"
            name="trainingPrograms"
            placeholder="¿Existe formación continua? ¿En qué áreas?"
            style={{ width: '100%', padding: '8px' }}
            value={data.trainingPrograms}
            onChange={(e) => handleChange('module7', 'trainingPrograms', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Module7_HumanResources;
