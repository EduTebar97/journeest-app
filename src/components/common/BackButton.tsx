
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} style={styles.button}>
            &larr; Volver
        </button>
    );
};

const styles = {
    button: {
        display: 'inline-block',
        marginBottom: '20px',
        padding: '8px 16px',
        backgroundColor: '#f0f2f5',
        border: '1px solid #dfe1e6',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        color: '#172b4d',
    }
};

export default BackButton;
