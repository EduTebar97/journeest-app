
import React from 'react';

interface CheckboxGroupInputProps {
  id: string;
  label: string;
  description?: string;
  options: string[];
  value: string[]; // Value is now an array of strings
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

const CheckboxGroupInput: React.FC<CheckboxGroupInputProps> = ({ id, label, description, options = [], value = [], onChange, disabled = false }) => {
  
  const handleCheckboxChange = (option: string) => {
    if (disabled) return;
    const newSelection = value.includes(option)
      ? value.filter(item => item !== option) // Remove item if already selected
      : [...value, option]; // Add item if not selected
    onChange(newSelection);
  };

  return (
    <div style={styles.container} aria-labelledby={id}>
      <h3 id={id} style={styles.label}>{label}</h3>
      {description && <p style={styles.description}>{description}</p>}
      
      <div style={styles.optionsContainer}>
        {options.map((option) => (
          <label key={option} style={{ ...styles.checkboxLabel, ...(disabled && styles.disabledLabel) }}>
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              style={styles.checkbox}
              disabled={disabled}
            />
            {option}
          </label>
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
    flexDirection: 'column',
    gap: '12px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '10px',
    border: '1px solid #eee',
    borderRadius: '5px',
    backgroundColor: '#fafafa'
  },
  disabledLabel: {
    cursor: 'not-allowed',
    backgroundColor: '#f2f2f2',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    marginRight: '12px',
  },
};

export default CheckboxGroupInput;
