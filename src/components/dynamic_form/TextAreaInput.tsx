
import React from 'react';

interface TextAreaInputProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, label, description, value, onChange, placeholder, disabled = false }) => {
  return (
    <div style={styles.container}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      {description && <p style={styles.description}>{description}</p>}
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Escribe tu respuesta aquí...'}
        rows={5}
        style={{ ...styles.textarea, ...(disabled && styles.disabled) }}
        disabled={disabled}
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    margin: '1rem 0',
    width: '100%',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '-0.25rem',
    marginBottom: '0.5rem',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  disabled: {
    backgroundColor: '#f2f2f2',
    cursor: 'not-allowed',
  }
};

export default TextAreaInput;
