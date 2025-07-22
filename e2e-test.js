// e2e-test.js
import puppeteer from 'puppeteer';
import assert from 'assert';

const APP_URL = 'http://localhost:5174/onboarding/areas-intro';

(async () => {
  let browser;
  try {
    console.log("Iniciando prueba de extremo a extremo...");
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    console.log(`Navegando a ${APP_URL}...`);
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });
    console.log("Pagina de introduccion cargada.");

    const builderLinkSelector = 'a[href="/onboarding/area-builder"]';
    await page.waitForSelector(builderLinkSelector);
    await page.click(builderLinkSelector);
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log("Navegacion a la pagina del constructor de areas exitosa.");

    console.log("Probando la creacion del area de Marketing...");
    await page.waitForSelector('#area-select');
    await page.select('#area-select', 'Marketing y Ventas');
    await page.type('#collab-name', 'Juan Marketing');
    await page.type('#collab-email', 'juan@marketing.com');
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => document.body.innerText.includes('Juan Marketing'));
    console.log("Area de Marketing anadida a la lista.");

    console.log("Probando la creacion de un area personalizada...");
    await page.select('#area-select', 'otro');
    await page.waitForSelector('input[placeholder="Nombre del Área Personalizada"]');
    await page.type('input[placeholder="Nombre del Área Personalizada"]', 'Logistica Inversa');
    await page.type('#collab-name', 'Sara Logistica');
    await page.type('#collab-email', 'sara@logistica.com');
    await page.click('button[type="submit"]');
    await page.waitForFunction(() => document.body.innerText.includes('Sara Logistica'));
    console.log("Area personalizada anadida a la lista.");
    
    const finalButton = await page.$('button:not([type="submit"])');
    assert.ok(finalButton, 'El boton de confirmacion final no se encontro.');
    console.log("Boton de confirmacion final encontrado.");

    console.log("\nPRUEBA COMPLETADA CON EXITO: Todos los flujos basicos han pasado.");

  } catch (error) {
    console.error("PRUEBA FALLIDA:", error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Navegador cerrado.");
    }
  }
})();
