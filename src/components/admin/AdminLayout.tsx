
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout: React.FC = () => {
    return (
        <div style={styles.layout}>
            <aside style={styles.sidebar}>
                <h1 style={styles.logo}>Journeest</h1>
                <p style={styles.panelTitle}>Panel de Admin</p>
                <nav style={styles.nav}>
                    <NavLink to="/admin/templates" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
                        Gestionar Plantillas
                    </NavLink>
                    <NavLink to="/admin/modules" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
                        Gestionar Módulos
                    </NavLink>
                    <NavLink to="/admin/areas" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
                        Ver Áreas Creadas
                    </NavLink>
                </nav>
            </aside>
            <main style={styles.mainContent}>
                <Outlet /> 
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    layout: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    sidebar: {
        width: '250px',
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRight: '1px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'column',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '0 0 10px 0',
        color: '#0052cc',
    },
    panelTitle: {
        textAlign: 'center',
        color: '#5e6c84',
        marginBottom: '30px',
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    link: {
        padding: '10px 15px',
        color: '#172b4d',
        textDecoration: 'none',
        borderRadius: '3px',
        fontSize: '16px',
    },
    activeLink: {
        padding: '10px 15px',
        color: '#0052cc',
        textDecoration: 'none',
        borderRadius: '3px',
        backgroundColor: '#e9f2ff',
        fontWeight: 'bold',
        fontSize: '16px',
    },
    mainContent: {
        flex: 1,
        padding: '30px',
        overflowY: 'auto',
    },
};

export default AdminLayout;
