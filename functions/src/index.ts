
import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

admin.initializeApp();

// Simulación de la generación de un informe por IA
const generateAIReport = (areaData: any): string => {
  logger.info(`Generando informe para el área: ${areaData.name}`);
  // En un caso real, aquí iría la lógica para llamar a una API de IA
  const summary = `
    Análisis del área "${areaData.name}":
    - Misión principal: ${areaData.formData?.module1?.mission || 'No definido'}
    - Procesos clave: ${areaData.formData?.module2?.mainProcess || 'No definido'}
    - Retos identificados: ${areaData.formData?.module2?.bottlenecks || 'No definido'}
    
    Conclusión preliminar: Se detectan oportunidades de mejora en la optimización de procesos
    y en la implementación de nuevas tecnologías para abordar los cuellos de botella.
  `;
  return summary;
};

export const generateReportOnAreaComplete = onDocumentUpdated("companies/{companyId}/areas/{areaId}", async (event) => {
    if (!event.data) {
        logger.error("No data associated with the event.");
        return;
    }

    const newData = event.data.after.data();
    const oldData = event.data.before.data();

    // Comprobar si el estado ha cambiado a 'completed'
    if (newData.status === 'completed' && oldData.status !== 'completed') {
      logger.info(`Área ${event.params.areaId} ha sido completada. Generando informe.`);
      
      const reportDraft = generateAIReport(newData);

      try {
        // Actualizar el documento del área con el borrador y el nuevo estado
        await event.data.after.ref.update({
          status: 'pending_review',
          reportDraft: reportDraft,
        });
        logger.info(`Informe para el área ${event.params.areaId} generado y listo para revisión.`);
      } catch (error) {
        logger.error("Error al actualizar el área:", error);
      }
    }
});
