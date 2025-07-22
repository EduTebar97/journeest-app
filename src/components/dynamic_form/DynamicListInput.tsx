
import React from 'react';
import { nanoid } from 'nanoid';

// Represents a single item in the dynamic list
export type ListItem = {
  id: string;
  value: string;
};

interface DynamicListInputProps {
  id: string;
  label: string;
  description?: string;
  items: ListItem[];
  onChange: (items: ListItem[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

const DynamicListInput: React.FC<DynamicListInputProps> = ({ id, label, description, items = [], onChange, placeholder, disabled = false }) => {
  
  const handleAddItem = () => {
    if (disabled) return;
    onChange([...items, { id: nanoid(), value: '' }]);
  };

  const handleRemoveItem = (itemId: string) => {
    if (disabled) return;
    onChange(items.filter(item => item.id !== itemId));
  };

  const handleItemChange = (itemId: string, newValue: string) => {
    if (disabled) return;
    onChange(items.map(item => (item.id === itemId ? { ...item, value: newValue } : item)));
  };

  return (
    <div style={styles.container} aria-labelledby={id}>
      <h3 id={id} style={styles.label}>{label}</h3>
      {description && <p style={styles.description}>{description}</p>}
      
      <div style={styles.listContainer}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={item.id} style={styles.itemRow}>
              <span style={styles.itemIndex}>{index + 1}.</span>
              <input
                type="text"
                value={item.value}
                onChange={(e) => handleItemChange(item.id, e.target.value)}
                placeholder={placeholder || `Elemento ${index + 1}`}
                style={{ ...styles.input, ...(disabled && styles.disabledInput) }}
                disabled={disabled}
              />
              {!disabled && (
                <button 
                  type="button" 
                  onClick={() => handleRemoveItem(item.id)} 
                  style={styles.removeButton}
                  aria-label={`Eliminar elemento ${index + 1}`}
                  disabled={disabled}
                >
                  &times;
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={styles.emptyMessage}>No hay elementos en la lista.</p>
        )}
      </div>

      {!disabled && (
        <button type="button" onClick={handleAddItem} style={styles.addButton} disabled={disabled}>
          + Añadir Elemento
        </button>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { margin: '1.5rem 0', width: '100%' },
  label: { fontWeight: 'bold', marginBottom: '0.5rem' },
  description: { fontSize: '0.9rem', color: '#666', marginTop: '-0.25rem', marginBottom: '1rem' },
  listContainer: { marginBottom: '1rem' },
  itemRow: { display: 'flex', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' },
  itemIndex: { color: '#888', minWidth: '20px' },
  input: { flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem' },
  disabledInput: { backgroundColor: '#f2f2f2', cursor: 'not-allowed' },
  removeButton: { border: 'none', backgroundColor: 'transparent', color: '#dc3545', fontSize: '1.5rem', cursor: 'pointer', padding: '0 8px' },
  addButton: { padding: '10px 15px', border: '1px dashed #007bff', backgroundColor: '#f0f8ff', color: '#007bff', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' },
  emptyMessage: { color: '#888', fontStyle: 'italic' }
};

export default DynamicListInput;
