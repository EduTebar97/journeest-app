
import { adminDb } from './config/firebaseAdmin.js';
import { exit } from 'process';

const modules = [
  { id: 'module_strategic', name: 'Análisis Estratégico', questions: [
      { id: 'mission', label: 'Misión del Área', description: 'Describe la misión de tu departamento.', type: 'text_area' },
      { id: 'objectives', label: 'Objetivos Clave', description: 'Lista los objetivos principales.', type: 'dynamic_list' }
  ]},
  { id: 'module_processes', name: 'Análisis de Procesos', questions: [
      { id: 'key_processes', label: 'Procesos Clave', description: 'Identifica los procesos más importantes.', type: 'dynamic_list' },
      { id: 'bottlenecks', label: 'Cuellos de Botella', description: '¿Dónde hay ineficiencias?', type: 'text_area' }
  ]},
  { id: 'module_technology', name: 'Evaluación de Tecnología', questions: [
      { id: 'digital_maturity', label: 'Nivel de Madurez Digital', type: 'slider', min: 0, max: 100 },
      { id: 'core_software', label: 'Software Principal', description: 'Enumera herramientas críticas.', type: 'dynamic_list' },
      { id: 'tech_gaps', label: 'Brechas Tecnológicas', description: '¿Qué capacidades tecnológicas faltan?', type: 'text_area' }
  ]},
  { id: 'module_marketing', name: 'Marketing y Ventas', questions: [
      { id: 'crm_tool', label: 'Herramienta CRM', type: 'multiple_choice', options: ['Salesforce', 'HubSpot', 'Zoho', 'Excel', 'Ninguna'] },
      { id: 'lead_generation', label: 'Canales de Generación de Leads', type: 'checkboxes', options: ['SEO', 'SEM', 'Redes Sociales', 'Contenidos'] }
  ]}
];

const templates = [
  { id: 'template_generic', name: 'Plantilla Genérica', description: 'Plantilla base para cualquier área.', moduleIds: ['module_strategic', 'module_processes', 'module_technology'] },
  { id: 'template_marketing', name: 'Plantilla de Marketing', description: 'Para departamentos de marketing.', moduleIds: ['module_strategic', 'module_processes', 'module_technology', 'module_marketing'] }
];

async function seedDatabase() {
  console.log('Iniciando la inicialización de la base de datos...');
  const batch = adminDb.batch();

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

seedDatabase().then(() => {
    console.log('Script finalizado.');
    exit(0);
}).catch(() => {
    exit(1);
});
