import { useState, useEffect, useMemo } from 'react'; // Importamos useMemo
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db, auth } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import styles from './AdminDashboardPage.module.css';
import type { Area } from '../types';

const journeestLogoUrl = "https://i.imgur.com/IKpS29L.png";
const futurlogixLogoUrl = "https://i.imgur.com/sKQhiGY.png";

interface ReportInfo {
  id: string;
  areaId: string;
}

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [areas, setAreas] = useState<Area[]>([]);
  const [reports, setReports] = useState<ReportInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Leer ÁREAS y REPORTES en tiempo real
  useEffect(() => {
    if (!currentUser) return;
    
    const areasQuery = query(collection(db, 'areas'), where('companyId', '==', currentUser.uid));
    const unsubscribeAreas = onSnapshot(areasQuery, (snapshot) => {
      // Nos aseguramos de que el tipo de dato sea correcto, incluyendo los arrays opcionales
      const areasData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        kpis: doc.data().kpis || [],
        problems: doc.data().problems || []
      } as Area));
      setAreas(areasData);
      setLoading(false);
    });

    const reportsQuery = query(collection(db, 'reports'), where('companyId', '==', currentUser.uid));
    const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({ id: doc.id, areaId: doc.data().areaId } as ReportInfo));
      setReports(reportsData);
    });

    return () => {
      unsubscribeAreas();
      unsubscribeReports();
    };
  }, [currentUser]);

  // --- NUEVA LÓGICA DE CÁLCULO ---
  // Usamos useMemo para que estos cálculos solo se rehagan si la lista de áreas cambia.
  const dashboardStats = useMemo(() => {
    const completedAreas = areas.filter(area => area.status === 'Completada').length;
    const totalProblems = areas.reduce((acc, area) => acc + (area.problems?.length || 0), 0);
    const totalKPIs = areas.reduce((acc, area) => acc + (area.kpis?.length || 0), 0);
    const progressPercentage = areas.length > 0 ? (completedAreas / areas.length) * 100 : 0;

    return { completedAreas, totalProblems, totalKPIs, progressPercentage };
  }, [areas]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) { console.error("Error al cerrar sesión", error); }
  };
  
  const handleAction = (area: Area) => {
    if (area.responsible.email === currentUser?.email && area.status !== 'Completada') {
      navigate(`/area/${area.id}`);
      return;
    }
    const report = reports.find(r => r.areaId === area.id);
    if (report) {
        navigate(`/informe/${report.id}`);
    }
  };

  const getButtonInfo = (area: Area): { text: string; disabled: boolean; } => {
    if (area.responsible.email === currentUser?.email && area.status !== 'Completada') {
        return { text: "Completar", disabled: false };
    }
    if (area.status === 'Completada' || area.status === 'Error al generar informe') {
        const reportExists = reports.some(r => r.areaId === area.id);
        if (reportExists) return { text: "Ver Informe", disabled: false };
        if (area.status === 'Error al generar informe') return { text: "Error", disabled: true };
        return { text: "Generando...", disabled: true };
    }
    return { text: "Recordar", disabled: true };
  };

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <img src={journeestLogoUrl} alt="Journeest Logo" className={styles.logoJourneest} />
        <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
      </header>

      <main className={styles.container}>
        <h1 className={styles.title}>Panel de Control</h1>
        <p className={styles.subtitle}>Monitoriza el progreso del diagnóstico de tu empresa.</p>

        <div className={styles.dashboardGrid}>
          {/* Tarjeta de Progreso Global con la nueva lógica */}
          <div className={styles.card}>
             <h2 className={styles.cardTitle}>Progreso Global</h2>
             <div className={styles.progressText}>
                <strong>{dashboardStats.completedAreas}</strong> de <strong>{areas.length}</strong> áreas completadas
             </div>
             <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${dashboardStats.progressPercentage}%` }}></div>
             </div>
          </div>
          
          {/* Tarjeta de Resumen con la nueva lógica */}
          <div className={styles.card}>
             <h2 className={styles.cardTitle}>Resumen de Datos</h2>
             <div className={styles.statsContainer}>
                <div className={styles.statItem}><span>{dashboardStats.totalKPIs}</span>KPIs registrados</div>
                <div className={styles.statItem}><span>{dashboardStats.totalProblems}</span>Problemas detectados</div>
             </div>
          </div>

          {/* Lista de Áreas */}
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2 className={styles.cardTitle}>Estado de las Áreas</h2>
            <table className={styles.areasTable}>
                <thead>
                  <tr><th>Área</th><th>Responsable</th><th>Estado</th><th>Acción</th></tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={4} style={{textAlign: 'center'}}>Cargando...</td></tr>
                  ) : areas.length > 0 ? areas.map(area => {
                    const buttonInfo = getButtonInfo(area);
                    return (
                        <tr key={area.id}>
                        <td>{area.name}</td>
                        <td>{area.responsible.email}</td>
                        <td>
                            <span className={`${styles.status} ${styles[area.status.replace(/ /g, '')]}`}>{area.status}</span>
                        </td>
                        <td>
                            <button onClick={() => handleAction(area)} className={styles.actionButton} disabled={buttonInfo.disabled}>
                                {buttonInfo.text}
                            </button>
                        </td>
                        </tr>
                    )
                  }) : (
                    <tr><td colSpan={4} style={{textAlign: 'center'}}>No se han encontrado áreas.</td></tr>
                  )}
                </tbody>
              </table>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Powered by</p>
        <img src={futurlogixLogoUrl} alt="Futurlogix Logo" className={styles.logoFuturlogix} />
      </footer>
    </div>
  );
};

export default AdminDashboardPage;
