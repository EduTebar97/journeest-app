import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../config/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './CollaboratorPage.module.css';
import type { AreaSummary, AreaProcess, AreaKPI, ProcessTask, AreaTool, AreaProblem, AreaIdea, AreaAttachment } from '../types';

const SECTIONS = [
  { id: 'resumen', label: '1. Resumen' },
  { id: 'procesos', label: '2. Procesos' },
  { id: 'kpis', label: '3. KPIs' },
  { id: 'herramientas', label: '4. Herramientas' },
  { id: 'problemas', label: '5. Problemas' },
  { id: 'ideas', label: '6. Ideas de Mejora' },
  { id: 'adjuntos', label: '7. Adjuntar Docs' },
];

const CollaboratorPage = () => {
  const { token: areaId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('resumen');
  
  const [areaName, setAreaName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para cada sección del formulario
  const [summary, setSummary] = useState<AreaSummary>({ description: '', employeeCount: 0, temporality: 'constante' });
  const [processes, setProcesses] = useState<AreaProcess[]>([]);
  const [kpis, setKpis] = useState<AreaKPI[]>([]);
  const [tools, setTools] = useState<AreaTool[]>([]);
  const [problems, setProblems] = useState<AreaProblem[]>([]);
  const [ideas, setIdeas] = useState<AreaIdea[]>([]);
  const [attachments, setAttachments] = useState<AreaAttachment[]>([]);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // NUEVO ESTADO PARA CONTROLAR EL ESTADO INICIAL
  const [initialStatus, setInitialStatus] = useState<string>('Pendiente');

  useEffect(() => {
    if (!areaId) {
      setError('No se ha proporcionado un ID de área.');
      setLoading(false);
      return;
    }
    const fetchArea = async () => {
      const areaRef = doc(db, 'areas', areaId);
      const docSnap = await getDoc(areaRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAreaName(data.name || '');
        setInitialStatus(data.status || 'Pendiente'); // Guardamos el estado inicial
        setSummary(data.summary || { description: '', employeeCount: 0, temporality: 'constante' });
        setProcesses(data.processes || []);
        setKpis(data.kpis || []);
        setTools(data.tools || []);
        setProblems(data.problems || []);
        setIdeas(data.ideas || []);
        setAttachments(data.attachments || []);
      } else {
        setError('El área solicitada no existe o el enlace no es válido.');
      }
      setLoading(false);
    };
    fetchArea();
  }, [areaId]);

  const handleSaveProgress = async () => {
    if (!areaId) return;
    const areaRef = doc(db, 'areas', areaId);
    try {
      // Creamos un objeto con los datos a actualizar
      const updateData: { [key: string]: any } = {
        summary, processes, kpis, tools, problems, ideas, attachments,
      };

      // Si el estado es 'Pendiente', lo cambiamos a 'En proceso'
      if (initialStatus === 'Pendiente') {
        updateData.status = 'En proceso';
        setInitialStatus('En proceso'); // Actualizamos el estado local para no volver a cambiarlo
      }

      await updateDoc(areaRef, updateData);
      alert('¡Progreso guardado con éxito!');
    } catch (err) {
      console.error(err);
      alert('Error al guardar el progreso.');
    }
  };
  
  const handleFinalizeArea = async () => {
      if(!window.confirm('¿Estás seguro de que has completado toda la información? Una vez finalizada, no podrás editarla.')) return;
      if (!areaId) return;
      await handleSaveProgress();
      const areaRef = doc(db, 'areas', areaId);
      try {
        await updateDoc(areaRef, { status: 'Completada' });
        alert('¡Área finalizada! Gracias por tu colaboración.');
      } catch(err) {
        alert('Error al finalizar el área.');
      }
  };

  // --- Handlers ---
  const handleAddProcess = () => setProcesses([...processes, { id: crypto.randomUUID(), name: '', trigger: '', tasks: [], sla: '' }]);
  const handleProcessChange = (index: number, field: keyof AreaProcess, value: string) => { const newProcesses = [...processes]; (newProcesses[index] as any)[field] = value; setProcesses(newProcesses); };
  const handleAddTask = (processIndex: number) => { const newProcesses = [...processes]; newProcesses[processIndex].tasks.push({ name: '', duration: 0, responsible: '' }); setProcesses(newProcesses); };
  const handleTaskChange = (pIndex: number, tIndex: number, field: keyof ProcessTask, value: string | number) => { const newProcesses = [...processes]; (newProcesses[pIndex].tasks[tIndex] as any)[field] = value; setProcesses(newProcesses); };
  const handleAddKpi = () => setKpis([...kpis, { id: crypto.randomUUID(), name: '', formula: '', frequency: '', target: '' }]);
  const handleKpiChange = (index: number, field: keyof AreaKPI, value: string) => { const newKpis = [...kpis]; (newKpis[index] as any)[field] = value; setKpis(newKpis); };
  const handleAddTool = () => setTools([...tools, { id: crypto.randomUUID(), name: '', category: '', hasApi: false, annualCost: 0, satisfaction: 3 }]);
  const handleToolChange = (index: number, field: keyof AreaTool, value: string | number | boolean) => { const newTools = [...tools]; (newTools[index] as any)[field] = value; setTools(newTools); };
  const handleAddProblem = () => setProblems([...problems, { id: crypto.randomUUID(), description: '', resourceLost: '', impact: '', severity: 5, isRegulatoryRisk: false }]);
  const handleProblemChange = (index: number, field: keyof AreaProblem, value: string | number | boolean) => { const newProblems = [...problems]; (newProblems[index] as any)[field] = value; setProblems(newProblems); };
  const handleAddIdea = () => setIdeas([...ideas, { id: crypto.randomUUID(), description: '', urgency: 5, isQuickWin: false }]);
  const handleIdeaChange = (index: number, field: keyof AreaIdea, value: string | number | boolean) => { const newIdeas = [...ideas]; (newIdeas[index] as any)[field] = value; setIdeas(newIdeas); };

  const handleFileUpload = async () => {
    if (!fileToUpload || !areaId) return;
    setUploading(true);
    const filePath = `attachments/${areaId}/${fileToUpload.name}`;
    const storageRef = ref(storage, filePath);
    try {
      await uploadBytes(storageRef, fileToUpload);
      const downloadURL = await getDownloadURL(storageRef);
      const newAttachment = { name: fileToUpload.name, url: downloadURL };
      const areaRef = doc(db, 'areas', areaId);
      await updateDoc(areaRef, { attachments: arrayUnion(newAttachment) });
      setAttachments([...attachments, newAttachment]);
      setFileToUpload(null);
    } catch (err) {
      console.error(err);
      alert('Error al subir el archivo.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className={styles.centered}>Cargando...</div>;
  if (error) return <div className={styles.centered}>{error}</div>;

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}><h1>Análisis del Área: {areaName}</h1></header>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <nav>
            {SECTIONS.map(section => (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={activeSection === section.id ? styles.active : ''}>
                {section.label}
              </button>
            ))}
          </nav>
          <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
            Volver al Dashboard
          </button>
        </aside>
        <main className={styles.mainContent}>
          {activeSection === 'resumen' && (
            <section>
              <h2>1. Resumen del Área</h2>
              <label>Descripción breve (max 130 car.)</label>
              <input type="text" maxLength={130} value={summary.description} onChange={e => setSummary({...summary, description: e.target.value})} />
              <label>Nº de empleados</label>
              <input type="number" value={summary.employeeCount} onChange={e => setSummary({...summary, employeeCount: parseInt(e.target.value)})} />
              <label>Temporalidad</label>
              <select value={summary.temporality} onChange={e => setSummary({...summary, temporality: e.target.value as any})}>
                <option value="constante">Constante</option><option value="temporada">Temporada</option><option value="eventos">Eventos</option>
              </select>
            </section>
          )}

          {activeSection === 'procesos' && (
            <section>
              <h2>2. Procesos Clave</h2>
              {processes.map((process, pIndex) => (
                <div key={process.id} className={styles.processBox}>
                  <input type="text" placeholder="Nombre del Proceso (Ej: Check-in presencial)" value={process.name} onChange={e => handleProcessChange(pIndex, 'name', e.target.value)} />
                  <input type="text" placeholder="Trigger o Disparador (Ej: Cliente llega a recepción)" value={process.trigger} onChange={e => handleProcessChange(pIndex, 'trigger', e.target.value)} />
                  <h4 className={styles.taskTitle}>Tareas</h4>
                  {process.tasks.map((task, tIndex) => (
                     <div key={tIndex} className={styles.taskRow}>
                        <input type="text" placeholder="Nombre de la tarea" value={task.name} onChange={e => handleTaskChange(pIndex, tIndex, 'name', e.target.value)} />
                        <input type="number" placeholder="Duración (min)" value={task.duration} onChange={e => handleTaskChange(pIndex, tIndex, 'duration', parseInt(e.target.value))} />
                        <input type="text" placeholder="Responsable" value={task.responsible} onChange={e => handleTaskChange(pIndex, tIndex, 'responsible', e.target.value)} />
                     </div>
                  ))}
                  <button className={styles.addTaskButton} onClick={() => handleAddTask(pIndex)}>+ Añadir Tarea</button>
                </div>
              ))}
              <button className={styles.addProcessButton} onClick={handleAddProcess}>+ Añadir Nuevo Proceso</button>
            </section>
          )}

          {activeSection === 'kpis' && (
            <section>
              <h2>3. KPIs y Métricas</h2>
              {kpis.map((kpi, kIndex) => (
                <div key={kpi.id} className={styles.kpiBox}>
                  <input type="text" placeholder="Nombre del KPI (Ej: ADR, RevPAR)" value={kpi.name} onChange={e => handleKpiChange(kIndex, 'name', e.target.value)} />
                  <input type="text" placeholder="Fórmula (Ej: Ingresos / Habitaciones vendidas)" value={kpi.formula} onChange={e => handleKpiChange(kIndex, 'formula', e.target.value)} />
                  <input type="text" placeholder="Frecuencia de Revisión (Ej: Diario, Semanal)" value={kpi.frequency} onChange={e => handleKpiChange(kIndex, 'frequency', e.target.value)} />
                  <input type="text" placeholder="Objetivo (Ej: 85€)" value={kpi.target} onChange={e => handleKpiChange(kIndex, 'target', e.target.value)} />
                </div>
              ))}
              <button className={styles.addKpiButton} onClick={handleAddKpi}>+ Añadir Nuevo KPI</button>
            </section>
          )}
          
          {activeSection === 'herramientas' && (
            <section>
                <h2>4. Herramientas y Software</h2>
                {tools.map((tool, tIndex) => (
                    <div key={tool.id} className={styles.toolBox}>
                        <input type="text" placeholder="Nombre de la Herramienta (Ej: Cloudbeds)" value={tool.name} onChange={e => handleToolChange(tIndex, 'name', e.target.value)} />
                        <select value={tool.category} onChange={e => handleToolChange(tIndex, 'category', e.target.value)}>
                            <option value="">Categoría...</option><option value="PMS">PMS</option><option value="CRM">CRM</option><option value="Channel Manager">Channel Manager</option><option value="Motor de Reservas">Motor de Reservas</option><option value="Otro">Otro</option>
                        </select>
                        <input type="number" placeholder="Coste Anual (€)" value={tool.annualCost} onChange={e => handleToolChange(tIndex, 'annualCost', parseInt(e.target.value))} />
                        <div className={styles.inlineGroup}><label>¿Tiene API?</label><input type="checkbox" checked={tool.hasApi} onChange={e => handleToolChange(tIndex, 'hasApi', e.target.checked)} /></div>
                         <div className={styles.inlineGroup}><label>Satisfacción (1-5): {tool.satisfaction} ★</label><input type="range" min="1" max="5" value={tool.satisfaction} onChange={e => handleToolChange(tIndex, 'satisfaction', parseInt(e.target.value))} /></div>
                    </div>
                ))}
                <button className={styles.addToolButton} onClick={handleAddTool}>+ Añadir Nueva Herramienta</button>
            </section>
          )}

          {activeSection === 'problemas' && (
            <section>
                <h2>5. Problemas / Cuellos de Botella</h2>
                {problems.map((problem, pIndex) => (
                    <div key={problem.id} className={styles.problemBox}>
                        <textarea placeholder="Descripción del problema (Ej: Colas en recepción en horas punta)" value={problem.description} onChange={e => handleProblemChange(pIndex, 'description', e.target.value)} />
                        <input type="text" placeholder="Recurso perdido (Ej: Tiempo, dinero, clientes)" value={problem.resourceLost} onChange={e => handleProblemChange(pIndex, 'resourceLost', e.target.value)} />
                        <input type="text" placeholder="Impacto en el negocio" value={problem.impact} onChange={e => handleProblemChange(pIndex, 'impact', e.target.value)} />
                        <div className={styles.inlineGroup}><label>Gravedad (1-10): {problem.severity}</label><input type="range" min="1" max="10" value={problem.severity} onChange={e => handleProblemChange(pIndex, 'severity', parseInt(e.target.value))} /></div>
                        <div className={styles.inlineGroup}><label><input type="checkbox" checked={problem.isRegulatoryRisk} onChange={e => handleProblemChange(pIndex, 'isRegulatoryRisk', e.target.checked)} />¿Supone un riesgo regulatorio?</label></div>
                    </div>
                ))}
                <button className={styles.addProblemButton} onClick={handleAddProblem}>+ Añadir Nuevo Problema</button>
            </section>
          )}
          
          {activeSection === 'ideas' && (
             <section>
                <h2>6. Ideas de Mejora</h2>
                {ideas.map((idea, iIndex) => (
                    <div key={idea.id} className={styles.ideaBox}>
                        <textarea placeholder="Descripción de la idea (max 200 car.)" maxLength={200} value={idea.description} onChange={e => handleIdeaChange(iIndex, 'description', e.target.value)} />
                        <div className={styles.inlineGroup}><label>Urgencia (0-10): {idea.urgency}</label><input type="range" min="0" max="10" value={idea.urgency} onChange={e => handleIdeaChange(iIndex, 'urgency', parseInt(e.target.value))} /></div>
                        <div className={styles.inlineGroup}><label><input type="checkbox" checked={idea.isQuickWin} onChange={e => handleIdeaChange(iIndex, 'isQuickWin', e.target.checked)} />¿Es un "Quick Win" (se puede implementar en menos de 2 semanas)?</label></div>
                    </div>
                ))}
                <button className={styles.addIdeaButton} onClick={handleAddIdea}>+ Añadir Nueva Idea</button>
            </section>
          )}

          {activeSection === 'adjuntos' && (
             <section>
                <h2>7. Adjuntar Documentos</h2>
                <p>Sube cualquier documento de apoyo relevante: SOPs, manuales, capturas de pantalla, etc.</p>
                <div className={styles.uploadBox}>
                  <input type="file" onChange={(e) => setFileToUpload(e.target.files ? e.target.files[0] : null)} />
                  <button onClick={handleFileUpload} disabled={!fileToUpload || uploading}>
                    {uploading ? 'Subiendo...' : 'Subir Archivo'}
                  </button>
                </div>
                <div className={styles.attachmentList}>
                  <h4>Documentos Subidos:</h4>
                  {attachments.length === 0 ? <p>No hay documentos.</p> :
                    <ul>
                      {attachments.map((file, index) => (
                        <li key={index}><a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a></li>
                      ))}
                    </ul>
                  }
                </div>
            </section>
          )}

          <div className={styles.buttonContainer}>
            <button className={styles.saveButton} onClick={handleSaveProgress}>Guardar Borrador</button>
            <button className={styles.finalizeButton} onClick={handleFinalizeArea}>Finalizar Área</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CollaboratorPage;