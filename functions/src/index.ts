import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

admin.initializeApp();

// --- FUNCIÓN 1: Enviar Email de Invitación (CORREGIDA) ---
export const sendInvitationEmail = onDocumentCreated("areas/{areaId}", (event) => {
  const snap = event.data;
  if (!snap) {
    console.log("No hay datos asociados al evento, saliendo.");
    return null;
  }

  const areaData = snap.data();
  
  // --- ESTA ES LA CORRECCIÓN ---
  // El email está dentro del objeto 'responsible'
  const recipientEmail = areaData.responsible?.email; 
  const areaName = areaData.name;
  
  // Si no encontramos un email, no podemos continuar.
  if (!recipientEmail) {
      console.error("No se encontró 'responsible.email' en los datos del área.", areaData);
      return null;
  }

  const areaId = snap.id;
  const invitationLink = `https://journeest-project-unique-id.web.app/area/${areaId}`;

  const mailData = {
    to: recipientEmail,
    message: {
      subject: `Tienes una invitación para colaborar en Journeest`,
      html: `<h1>¡Hola!</h1><p>Has sido invitado a completar el análisis para el área de <strong>${areaName}</strong> en la plataforma Journeest.</p><p>Por favor, haz clic en el siguiente enlace para acceder a tu formulario personalizado:</p><a href="${invitationLink}" style="padding: 10px 15px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px;">Acceder al Formulario</a><br><br><p>Gracias,</p><p>El equipo de Journeest</p>`,
    },
  };

  return admin.firestore().collection("mail").add(mailData).then(() => {
    console.log(`Email encolado para: ${recipientEmail}`);
  }).catch((error) => {
    console.error("Error al encolar el email:", error);
  });
});


// --- FUNCIÓN 2: Generar Informe con IA (EXISTENTE) ---
export const generateAreaReport = onDocumentUpdated("areas/{areaId}", async (event) => {
  const dataAfter = event.data?.after.data();
  const dataBefore = event.data?.before.data();

  if (dataBefore?.status === "Completada" || dataAfter?.status !== "Completada") {
    return null;
  }

  const areaId = event.params.areaId;
  const areaData = dataAfter;
  
  let prompt = `Eres un consultor experto en optimización de negocios turísticos. Analiza los siguientes datos del área "${areaData.name}" y genera un informe profesional y detallado. El informe debe ser claro, conciso y aportar valor real.

  DATOS DEL ÁREA:
  - Resumen: ${JSON.stringify(areaData.summary)}
  - Procesos Clave: ${JSON.stringify(areaData.processes)}
  - KPIs y Métricas: ${JSON.stringify(areaData.kpis)}
  - Herramientas y Software: ${JSON.stringify(areaData.tools)}
  - Problemas y Cuellos de Botella: ${JSON.stringify(areaData.problems)}
  - Ideas de Mejora Propuestas: ${JSON.stringify(areaData.ideas)}

  ESTRUCTURA DEL INFORME (sigue este formato estrictamente):
  1. **Diagnóstico General:** Un párrafo inicial que resuma la situación actual del área.
  2. **Puntos Fuertes:** Una lista de 2-3 aspectos positivos detectados.
  3. **Áreas Críticas de Mejora:** Una lista detallada de los 3 problemas más importantes, explicando su posible impacto.
  4. **Propuestas de Automatización y Optimización:** Sugerencias concretas para solucionar los problemas detectados.
  `;

  try {
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) {
        const generatedText = result.candidates[0].content.parts[0].text;
        
        await admin.firestore().collection("reports").add({
            areaId: areaId,
            companyId: areaData.companyId,
            generatedContent: generatedText,
            status: "borrador_ia",
            createdAt: new Date(),
        });
    } else {
        throw new Error("Respuesta inesperada de la API de Gemini.");
    }
    return null;
  } catch(err) {
      console.error("Error al generar el informe con IA:", err);
      await admin.firestore().doc(`areas/${areaId}`).update({ status: "Error al generar informe" });
      return null;
  }
});

