
import { adminDb } from './config/firebaseAdmin.js';
import { exit } from 'process';

// =================================================================
// DEFINICIÓN DE MÓDULOS DE DIAGNÓSTICO ESPECÍFICOS
// =================================================================
const modules = [
    // --- Módulo: Dirección General ---
    {
        id: 'module_direccion',
        name: 'Dirección General (Estrategia y Modelo de Negocio)',
        questions: [
            { id: 'q1', type: 'text_area', label: 'Misión y Visión', description: '¿Cuál es la misión de la empresa y cómo describen la visión a largo plazo del negocio?' },
            { id: 'q2', type: 'text_area', label: 'Objetivos Estratégicos', description: '¿Qué objetivos estratégicos principales tiene definidos la empresa para los próximos 3-5 años? ¿Están formulados con criterios SMART?' },
            { id: 'q3', type: 'text_area', label: 'Motivación del Cambio', description: '¿Cuál es la motivación principal para emprender una transformación digital en este momento y qué expectativas tienen sobre los resultados?' },
            { id: 'q4', type: 'text_area', label: 'Modelo de Negocio Actual', description: 'Describa el modelo de negocio actual (propuesta de valor, clientes, canales, fuentes de ingresos).' },
            { id: 'q5', type: 'text_area', label: 'Estructura de Ingresos y Costos', description: '¿Cuáles son las fuentes de ingresos y estructuras de costos más significativas?' },
            { id: 'q6', type: 'text_area', label: 'Actividades Clave', description: '¿Cuáles son las actividades operativas críticas para cumplir su propuesta de valor?' },
            { id: 'q7', type: 'text_area', label: 'Recursos y Competencias Clave', description: '¿Qué recursos o competencias centrales posee la empresa que le otorgan una ventaja competitiva?' },
            { id: 'q8', type: 'text_area', label: 'Factores Clave de Éxito', description: 'En su sector, ¿cuáles son los factores clave de éxito para lograr ventaja competitiva?' },
            { id: 'q9', type: 'text_area', label: 'Ventaja Competitiva', description: '¿Cuál es la ventaja competitiva principal de la empresa hoy en día?' },
        ]
    },
    // --- Módulo: Marketing y Ventas ---
    {
        id: 'module_marketing_ventas',
        name: 'Marketing y Ventas',
        questions: [
            { id: 'q1', type: 'text_area', label: 'Estrategia de Marketing', description: '¿Cuál es la estrategia de marketing actual (posicionamiento, segmentos, mensajes)?' },
            { id: 'q2', type: 'text_area', label: 'Conocimiento del Cliente', description: '¿Tienen bien identificados los perfiles de cliente o buyer personas?' },
            { id: 'q3', type: 'text_area', label: 'Canales de Adquisición', description: '¿Qué canales de marketing y ventas utilizan y cuáles son los más efectivos?' },
            { id: 'q4', type: 'text_area', label: 'Marketing Digital', description: '¿Qué grado de presencia digital tiene la empresa (web, ecommerce, redes sociales)?' },
            { id: 'q5', type: 'text_area', label: 'Estrategia en Redes Sociales', description: '¿Cómo gestionan las redes sociales y la interacción online con clientes?' },
            { id: 'q6', type: 'text_area', label: 'Generación de Demanda', description: '¿Cuentan con estrategias de generación de leads y cómo miden su efectividad?' },
            { id: 'q7', type: 'text_area', label: 'Fuerza de Ventas', description: '¿Cómo está organizada la fuerza de ventas y qué herramientas digitales utilizan?' },
            { id: 'q8', type: 'text_area', label: 'Proceso de Venta', description: 'Describa el proceso comercial desde el interés inicial hasta el cierre.' },
            { id: 'q9', type: 'text_area', label: 'Relación con el Cliente', description: '¿Qué tipo de relación y nivel de contacto mantiene la empresa con sus clientes?' },
            { id: 'q10', type: 'text_area', label: 'Experiencia del Cliente', description: '¿Cómo calificaría la experiencia que entrega al cliente en todo el ciclo y cómo se mide?' },
            { id: 'q11', type: 'text_area', label: 'Investigación de Mercado', description: '¿Realizan estudios de mercado o recopilan feedback del cliente de forma regular?' },
            { id: 'q12', type: 'text_area', label: 'Indicadores de Marketing/Ventas', description: '¿Qué KPIs de marketing y ventas monitorean (CAC, LTV, tasa de conversión)?' },
            { id: 'q13', type: 'text_area', label: 'Competencia (Marketing)', description: '¿Qué tácticas de marketing destacadas utilizan sus competidores y cómo responden?' },
            { id: 'q14', type: 'text_area', label: 'Ventas Online', description: 'Si venden online, ¿qué porcentaje representan y qué obstáculos enfrentan?' },
            { id: 'q15', type: 'text_area', label: 'Contenido y Branding', description: '¿Disponen de una estrategia de contenidos y branding digital definida?' },
            { id: 'q16', type: 'text_area', label: 'Herramientas de Marketing', description: '¿Qué herramientas tecnológicas de marketing utilizan y están aprovechando todo su potencial?' },
            { id: 'q17', type: 'text_area', label: 'Desafíos Actuales de Marketing', description: '¿Cuáles son los mayores desafíos o puntos débiles actuales en marketing y ventas?' },
            { id: 'q18', type: 'text_area', label: 'Oportunidades en Marketing', description: '¿Dónde ven oportunidades de mejora o crecimiento en el área comercial?' },
        ]
    },
    // --- Módulo: Recepción y Reservas (Atención al Cliente) ---
    {
        id: 'module_recepcion_reservas',
        name: 'Recepción y Reservas (Atención al Cliente)',
        questions: [
            { id: 'q1', type: 'text_area', label: 'Canales de Atención', description: '¿Qué canales de servicio postventa y atención al cliente ofrecen?' },
            { id: 'q2', type: 'text_area', label: 'Tiempo de Respuesta', description: '¿Tienen definidos y cumplen tiempos de respuesta para consultas?' },
            { id: 'q3', type: 'text_area', label: 'Equipo de Soporte', description: '¿Cómo está estructurado el equipo de atención al cliente (recepción/reservas)?' },
            { id: 'q4', type: 'text_area', label: 'Herramientas de Soporte', description: '¿Utilizan algún sistema para gestionar las solicitudes de los clientes?' },
            { id: 'q5', type: 'text_area', label: 'Políticas de Servicio', description: '¿Qué políticas de servicio al cliente existen y están comunicadas?' },
            { id: 'q6', type: 'text_area', label: 'Feedback del Cliente', description: '¿Cómo recopilan la retroalimentación de los clientes sobre su satisfacción?' },
            { id: 'q7', type: 'text_area', label: 'Quejas y Reclamaciones', description: '¿Cuál es el proceso cuando un cliente presenta una queja?' },
            { id: 'q8', type: 'text_area', label: 'Experiencia Multicanal', description: '¿La experiencia del cliente es consistente a través de todos los canales?' },
            { id: 'q9', type: 'text_area', label: 'Personalización del Servicio', description: '¿El servicio al cliente ofrece algún nivel de personalización?' },
            { id: 'q10', type: 'text_area', label: 'Indicadores de Servicio', description: '¿Qué métricas se utilizan para evaluar el desempeño del área?' },
            { id: 'q11', type: 'text_area', label: 'Integración con Otras Áreas', description: '¿Existe comunicación efectiva entre atención al cliente y otras áreas?' },
            { id: 'q12', type: 'text_area', label: 'Principales Dificultades', description: '¿Cuáles son los mayores desafíos actuales en la atención al cliente?' },
            { id: 'q13', type: 'text_area', label: 'Oportunidades de Mejora', description: '¿Qué oportunidades de mejora identifican para elevar la calidad del servicio?' },
            { id: 'q14', type: 'text_area', label: 'Casos de Éxito/Aprendizaje', description: 'Mencione un caso de éxito reciente y un caso problemático.' },
        ]
    },
    // --- Módulo: Alimentos y Bebidas (F&B) ---
    {
        id: 'module_fnb',
        name: 'Alimentos y Bebidas (F&B)',
        questions: [
            { id: 'q1', type: 'text_area', label: 'Logística de Suministro', description: '¿Cómo se gestionan el aprovisionamiento de insumos y la logística de entrada?' },
            { id: 'q2', type: 'text_area', label: 'Producción/Operación del Servicio', description: '¿Cómo es el proceso operativo de producción y servicio en A&B?' },
            { id: 'q3', type: 'text_area', label: 'Logística de Distribución', description: '¿Cómo se lleva a cabo la entrega del producto/servicio al cliente final?' },
            { id: 'q4', type: 'text_area', label: 'Tecnología en Operaciones', description: '¿Qué sistemas o herramientas tecnológicas se utilizan para soportar las operaciones de A&B?' },
            { id: 'q5', type: 'text_area', label: 'Eficiencia y Cuellos de Botella', description: '¿Cuáles son los principales cuellos de botella o puntos de ineficiencia?' },
            { id: 'q6', type: 'text_area', label: 'Indicadores Operativos', description: '¿Cómo mide el área de A&B el rendimiento de sus operaciones?' },
            { id: 'q7', type: 'text_area', label: 'Mejora Continua', description: '¿Existe alguna iniciativa de mejora continua o métodos de optimización?' },
            { id: 'q8', type: 'text_area', label: 'Flexibilidad y Adaptación', description: '¿Qué tan flexible es la operación ante cambios en la demanda?' },
            { id: 'q9', type: 'text_area', label: 'Involucramiento del Personal', description: '¿Cómo se involucra al personal operativo en la identificación de problemas?' },
            { id: 'q10', type: 'text_area', label: 'Gestión de la Calidad', description: '¿Cómo aseguran la calidad del producto/servicio a lo largo de los procesos?' },
            { id: 'q11', type: 'text_area', label: 'Problemas Actuales', description: '¿Qué problemas recurrentes identifican que afecten la productividad o satisfacción?' },
            { id: 'q12', type: 'text_area', label: 'Oportunidades en Operaciones', description: '¿Qué oportunidades de mejora ven en las operaciones de A&B?' },
        ]
    },
    // --- Módulo: Limpieza y Mantenimiento (Housekeeping) ---
    {
        id: 'module_housekeeping',
        name: 'Limpieza y Mantenimiento (Housekeeping)',
        questions: [
            { id: 'q1', type: 'text_area', label: 'Logística de Suministro', description: '¿Cómo se gestionan la logística de insumos de limpieza y repuestos?' },
            { id: 'q2', type: 'text_area', label: 'Operación del Servicio', description: 'Describa los pasos clave para preparar las habitaciones/instalaciones.' },
            { id: 'q3', type: 'text_area', label: 'Tecnología en Operaciones', description: '¿Qué sistemas o herramientas utilizan para soportar las operaciones?' },
            { id: 'q4', type: 'text_area', label: 'Eficiencia y Cuellos de Botella', description: '¿Cuáles son los principales cuellos de botella o puntos de ineficiencia?' },
            { id: 'q5', type: 'text_area', label: 'Indicadores Operativos', description: '¿Cómo mide el área de Limpieza y Mantenimiento su rendimiento?' },
            { id: 'q6', type: 'text_area', label: 'Mejora Continua', description: '¿Existe alguna iniciativa de mejora continua implementada?' },
            { id: 'q7', type: 'text_area', label: 'Flexibilidad y Adaptación', description: '¿Qué tan flexible es la operación ante cambios en la demanda?' },
            { id: 'q8', type: 'text_area', label: 'Involucramiento del Personal', description: '¿Cómo se involucra al personal en la identificación de problemas?' },
            { id: 'q9', type: 'text_area', label: 'Gestión de la Calidad', description: '¿Cómo aseguran la calidad del servicio de limpieza y mantenimiento?' },
            { id: 'q10', type: 'text_area', label: 'Problemas Recurrentes', description: '¿Qué problemas recurrentes identifican que afecten la productividad?' },
            { id: 'q11', type: 'text_area', label: 'Oportunidades de Mejora', description: '¿Qué oportunidades de mejora ven en las operaciones de Limpieza y Mantenimiento?' },
            { id: 'q12', type: 'text_area', label: 'Seguridad y Salud Laboral', description: '¿Cómo gestionan la seguridad y salud ocupacional en el área?' },
        ]
    },
    // --- Módulo: Administración y Finanzas ---
    {
        id: 'module_finanzas',
        name: 'Administración y Finanzas',
        questions: [
            { id: 'q1', type: 'text_area', label: 'Salud Financiera', description: '¿Cómo describiría la salud financiera actual de la empresa?' },
            { id: 'q2', type: 'text_area', label: 'Fuentes de Ingresos', description: '¿Cuáles son las principales fuentes de ingresos y su composición?' },
            { id: 'q3', type: 'text_area', label: 'Estructura de Costos', description: '¿Cuáles son los costos más significativos en la operación del negocio?' },
            { id: 'q4', type: 'text_area', label: 'Indicadores Financieros Clave', description: '¿Qué KPIs financieros se monitorean regularmente?' },
            { id: 'q5', type: 'text_area', label: 'Presupuesto y Planificación', description: '¿La empresa realiza planificación financiera y presupuestos?' },
            { id: 'q6', type: 'text_area', label: 'Análisis de Inversiones', description: '¿Qué criterios financieros utilizan para evaluar inversiones en tecnología?' },
            { id: 'q7', type: 'text_area', label: 'Financiación de Proyectos', description: '¿Cómo se financiarían proyectos importantes de transformación?' },
            { id: 'q8', type: 'text_area', label: 'Control y Reporting Financiero', description: '¿Cómo se realiza actualmente el control financiero y reporte de resultados?' },
            { id: 'q9', type: 'text_area', label: 'Análisis de Rentabilidad', description: '¿Se mide la rentabilidad por producto, servicio o segmento de cliente?' },
            { id: 'q10', type: 'text_area', label: 'Tecnología en Finanzas', description: '¿Qué sistemas o herramientas utilizan para la gestión financiera y contable?' },
            { id: 'q11', type: 'text_area', label: 'Oportunidades para Finanzas', description: '¿Dónde ve oportunidades para mejorar la gestión financiera mediante la digitalización?' },
        ]
    },
    // --- Módulo: Recursos Humanos ---
    {
        id: 'module_rrhh',
        name: 'Recursos Humanos',
        questions: [
            { id: 'q1', type: 'text_area', label: 'Estructura Organizacional', description: '¿Cómo está estructurada la organización en términos de departamentos y jerarquía?' },
            { id: 'q2', type: 'text_area', label: 'Roles y Responsabilidades', description: '¿Están claramente definidas las funciones y responsabilidades de cada puesto?' },
            { id: 'q3', type: 'text_area', label: 'Competencias y Habilidades', description: '¿Qué habilidades clave existen y qué brechas se perciben para la transformación digital?' },
            { id: 'q4', type: 'text_area', label: 'Capacitación y Desarrollo', description: '¿Cómo gestiona la empresa la formación y desarrollo de su personal?' },
            { id: 'q5', type: 'text_area', label: 'Atracción y Retención de Talento', description: '¿Cuáles son las políticas para atraer y retener a los colaboradores?' },
            { id: 'q6', type: 'text_area', label: 'Evaluación de Desempeño', description: '¿Cómo se evalúa el desempeño de los empleados y si está alineado a la estrategia?' },
            { id: 'q7', type: 'text_area', label: 'Comunicación Interna', description: '¿Cómo es la comunicación interna en la organización y qué herramientas usan?' },
            { id: 'q8', type: 'text_area', label: 'Colaboración entre Áreas', description: '¿Qué tan bien colaboran las distintas áreas entre sí?' },
            { id: 'q9', type: 'text_area', label: 'Cultura de Aprendizaje', description: '¿Fomenta la empresa una cultura de aprendizaje continuo y experimentación?' },
            { id: 'q10', type: 'text_area', label: 'Recursos Humanos Digital', description: '¿Utilizan tecnología en la gestión de RR.HH. (nómina, reclutamiento, e-learning)?' },
            { id: 'q11', type: 'text_area', label: 'Clima Laboral', description: '¿Se evalúa el clima organizacional y cuáles son los principales hallazgos?' },
            { id: 'q12', type: 'text_area', label: 'Principales Retos en RR.HH.', description: '¿Qué desafíos enfrenta actualmente el área de Recursos Humanos?' },
        ]
    },
];

// =================================================================
// DEFINICIÓN DE PLANTILLAS DE ÁREA
// =================================================================
const templates = [
  { id: 'template_direccion', name: 'Plantilla de Dirección General', description: 'Diagnóstico estratégico y de modelo de negocio.', moduleIds: ['module_direccion'] },
  { id: 'template_marketing', name: 'Plantilla de Marketing y Ventas', description: 'Diagnóstico del área comercial, marketing y ventas.', moduleIds: ['module_marketing_ventas'] },
  { id: 'template_recepcion', name: 'Plantilla de Recepción y Reservas', description: 'Diagnóstico del área de atención al cliente y front-office.', moduleIds: ['module_recepcion_reservas'] },
  { id: 'template_fnb', name: 'Plantilla de Alimentos y Bebidas', description: 'Diagnóstico operativo del área de F&B.', moduleIds: ['module_fnb'] },
  { id: 'template_housekeeping', name: 'Plantilla de Limpieza y Mantenimiento', description: 'Diagnóstico operativo de housekeeping.', moduleIds: ['module_housekeeping'] },
  { id: 'template_finanzas', name: 'Plantilla de Administración y Finanzas', description: 'Diagnóstico de la gestión financiera.', moduleIds: ['module_finanzas'] },
  { id: 'template_rrhh', name: 'Plantilla de Recursos Humanos', description: 'Diagnóstico de la gestión del talento y cultura.', moduleIds: ['module_rrhh'] },
  // Plantilla genérica de fallback
  { id: 'template_generic', name: 'Plantilla Genérica', description: 'Contiene una selección de módulos básicos.', moduleIds: ['module_direccion', 'module_finanzas'] },
];

async function seedDatabase() {
  console.log('Iniciando la inicialización de la base de datos con plantillas específicas...');
  const batch = adminDb.batch();

  console.log('Borrando colecciones existentes...');
  await deleteCollection('diagnostic_modules');
  await deleteCollection('area_templates');
  console.log('Colecciones anteriores eliminadas.');

  const modulesCollection = adminDb.collection('diagnostic_modules');
  modules.forEach(module => {
    const docRef = modulesCollection.doc(module.id);
    batch.set(docRef, module);
  });

  const templatesCollection = adminDb.collection('area_templates');
  templates.forEach(template => {
    const docRef = templatesCollection.doc(template.id);
    batch.set(docRef, template);
  });

  try {
    await batch.commit();
    console.log('✅ Base de datos inicializada con éxito.');
    console.log(`  - ${modules.length} Módulos de Diagnóstico creados.`);
    console.log(`  - ${templates.length} Plantillas de Área creadas.`);
  } catch (error) {
    console.error('❌ Error al escribir en la base de datos:', error);
    exit(1);
  }
}

async function deleteCollection(collectionPath) {
    const collectionRef = adminDb.collection(collectionPath);
    const snapshot = await collectionRef.limit(500).get();

    if (snapshot.size === 0) {
        return;
    }

    const batch = adminDb.batch();
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();

    // Repetir si aún quedan documentos
    await deleteCollection(collectionPath);
}

seedDatabase().then(() => {
    console.log('Script finalizado.');
    exit(0);
}).catch((err) => {
    console.error(err);
    exit(1);
});
