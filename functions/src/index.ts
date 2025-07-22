
import { onDocumentUpdated, onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import * as nodemailer from "nodemailer";
import { generateAIReport, generateOverallAIReport } from "./report-helper";

admin.initializeApp();

// --- Configuración del Transportador de Correo (reutilizable) ---
// Las credenciales se leen desde las variables de entorno de Firebase
const mailTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para 465, false para otros puertos
    auth: {
        user: process.env.GMAIL_EMAIL, // functions.config() está obsoleto
        pass: process.env.GMAIL_PASSWORD,
    },
});

// =================================================================
// FUNCIÓN PARA ENVIAR CORREO AL ASIGNAR UN ÁREA
// =================================================================
export const sendEmailOnAreaAssigned = onDocumentCreated("companies/{companyId}/areas/{areaId}", async (event) => {
    if (!event.data) {
        logger.info("No data associated with the event, skipping email.");
        return;
    }

    const areaData = event.data.data();
    const { responsible, name: areaName, formId } = areaData;

    if (!responsible || !responsible.email) {
        logger.warn(`Área ${event.params.areaId} creada sin un email de responsable. No se enviará correo.`);
        return;
    }

    const recipientEmail = responsible.email;
    const recipientName = responsible.name || "colaborador";
    const appBaseUrl = process.env.APP_BASE_URL || "https://your-app-url.com"; // URL base de tu app
    const formLink = `${appBaseUrl}/report/editor/${formId}`;

    const mailOptions = {
        from: `"Journeest App" <${process.env.GMAIL_EMAIL}>`,
        to: recipientEmail,
        subject: `Tienes un nuevo diagnóstico asignado: ${areaName}`,
        html: `
            <h1>Hola ${recipientName},</h1>
            <p>Se te ha asignado la responsabilidad de completar el diagnóstico para el área: <strong>${areaName}</strong>.</p>
            <p>Por favor, accede al siguiente enlace para completar tu formulario:</p>
            <a href="${formLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Completar Diagnóstico
            </a>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p>${formLink}</p>
            <br>
            <p>Gracias por tu colaboración,</p>
            <p>El equipo de Journeest</p>
        `,
    };

    try {
        await mailTransport.sendMail(mailOptions);
        logger.info(`Correo de invitación enviado a ${recipientEmail} para el área ${areaName}.`);
        // Opcional: Marcar que el correo fue enviado
        await event.data.ref.update({ notificationSent: true });
    } catch (error) {
        logger.error(`Error al enviar correo a ${recipientEmail}:`, error);
    }
});


// =================================================================
// FUNCIÓN PARA GENERAR INFORMES AL COMPLETAR UN ÁREA
// =================================================================
export const generateReportOnAreaComplete = onDocumentUpdated("companies/{companyId}/areas/{areaId}", async (event) => {
    if (!event.data) {
        logger.error("No data associated with the event.");
        return;
    }

    const newData = event.data.after.data();
    const oldData = event.data.before.data();
    const companyId = event.params.companyId;

    if (newData.status === 'completed' && oldData.status !== 'completed') {
        logger.info(`Área ${event.params.areaId} completada. Iniciando generación de informe.`);
      
        try {
            const reportDraft = await generateAIReport(newData);

            await event.data.after.ref.update({
                status: 'report_ready',
                reportDraft: reportDraft,
            });
            logger.info(`Informe para el área ${event.params.areaId} generado y guardado.`);
            
            const companyAreasRef = admin.firestore().collection('companies').doc(companyId).collection('areas');
            const allAreasSnapshot = await companyAreasRef.get();
            
            const allAreasData = allAreasSnapshot.docs.map(doc => doc.data());
            const updatedAreasData = allAreasData.map(area => 
                (area.formId === newData.formId) ? { ...area, status: 'report_ready' } : area
            );
            
            const allReportsReady = updatedAreasData.every(area => area.status === 'report_ready');

            if (allReportsReady) {
                logger.info(`Todas las áreas de la empresa ${companyId} están listas. Generando informe general.`);
                const individualDrafts = updatedAreasData.map(area => area.reportDraft || (area.formId === newData.formId ? reportDraft : '')).filter(Boolean);
                
                const overallDraft = generateOverallAIReport(individualDrafts);
                
                const companyRef = admin.firestore().collection('companies').doc(companyId);
                await companyRef.update({
                    overallReportDraft: overallDraft,
                    finalReportReady: false
                });
                logger.info(`Borrador de informe general para la empresa ${companyId} guardado.`);
            }

        } catch (error) {
            logger.error("Error al procesar el área o generar informes:", error);
        }
    }
});
