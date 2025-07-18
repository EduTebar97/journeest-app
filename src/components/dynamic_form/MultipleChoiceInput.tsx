
import React from 'react';

interface MultipleChoiceInputProps {
  id: string;
  label: string;
  description?: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const MultipleChoiceInput: React.FC<MultipleChoiceInputProps> = ({ id, label, description, options = [], value, onChange }) => {
  
  return (
    <div style={styles.container} aria-labelledby={id}>
      <h3 id={id} style={styles.label}>{label}</h3>
      {description && <p style={styles.description}>{description}</p>}
      
      <div style={styles.optionsContainer}>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            style={value === option ? styles.selectedOption : styles.option}
            aria-pressed={value === option}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    margin: '1.5rem 0',
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '-0.25rem',
    marginBottom: '1rem',
  },
  optionsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  option: {
    padding: '10px 20px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    color: '#333',
    cursor: 'pointer',
    borderRadius: '20px',
    fontSize: '1rem',
  },
  selectedOption: {
    padding: '10px 20px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '20px',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
};

export default MultipleChoiceInput;
