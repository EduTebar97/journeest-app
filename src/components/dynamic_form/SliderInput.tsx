
import React from 'react';

interface SliderInputProps {
  id: string;
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const SliderInput: React.FC<SliderInputProps> = ({ id, label, description, value, onChange, min = 0, max = 100, disabled = false }) => {
  const currentValue = value ?? min;

  return (
    <div style={styles.container}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      {description && <p style={styles.description}>{description}</p>}
      <div style={styles.sliderContainer}>
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          value={currentValue}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ ...styles.slider, ...(disabled && styles.disabled) }}
          disabled={disabled}
        />
        <span style={styles.sliderValue}>{currentValue}</span>
      </div>
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
  sliderContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  slider: {
    flex: 1,
  },
  sliderValue: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    minWidth: '30px',
    textAlign: 'center'
  },
  disabled: {
    cursor: 'not-allowed',
  }
};

export default SliderInput;
