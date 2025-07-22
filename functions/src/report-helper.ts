
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

/**
 * Formatea los datos del formulario en un string legible para la IA.
 */
const formatAnswersToString = (formData: any): string => {
    let answersText = "";
    if (!formData) {
        return "No se proporcionaron respuestas en el formulario.";
    }
    for (const moduleKey in formData) {
        const moduleData = formData[moduleKey];
        for (const questionKey in moduleData) {
            const answer = moduleData[questionKey];
            let formattedAnswer = "";
            if (Array.isArray(answer)) {
                formattedAnswer = answer.map(item => `- ${item.value || item}`).join(`
`);
            } else {
                formattedAnswer = String(answer);
            }
            answersText += `Pregunta (${questionKey}):
${formattedAnswer}

`;
        }
    }
    return answersText;
};

/**
 * Construye el prompt final y simula la llamada a la IA.
 */
export const generateAIReport = async (areaData: any): Promise<string> => {
    const { templateId, formData, name, id } = areaData;
    if (!templateId) {
        throw new Error(`El área ${id} no tiene un templateId definido.`);
    }

    const promptRef = admin.firestore().collection('prompts').doc(templateId);
    const promptSnap = await promptRef.get();

    if (!promptSnap.exists) {
        logger.error(`No se encontró un prompt para el templateId: ${templateId}. Usando fallback.`);
        return `Informe para ${name}:

${formatAnswersToString(formData)}`;
    }
    
    const promptTemplate = promptSnap.data()?.promptText || '';
    const formattedAnswers = formatAnswersToString(formData);
    const finalPrompt = `${promptTemplate}

--- RESPUESTAS DEL DEPARTAMENTO ---

${formattedAnswers}`;
    
    logger.info(`Prompt final construido para el templateId: ${templateId}.`, { length: finalPrompt.length });

    // Simulación de la llamada a la API de Gemini
    const simulatedReport = `--- INFORME SIMULADO ---

${promptTemplate.substring(0, 150)}...

(Aquí iría el análisis detallado de la IA basado en las respuestas...)

--- FIN DEL INFORME ---`;
    return simulatedReport;
};

/**
 * Genera el informe consolidado.
 */
export const generateOverallAIReport = (allReports: string[]): string => {
    logger.info("Generando informe consolidado de todos los borradores.");
    const combinedReport = `--- Informe Estratégico General ---

${allReports.join(`

---

`)}

--- Fin del Informe ---`;
    return combinedReport;
};
