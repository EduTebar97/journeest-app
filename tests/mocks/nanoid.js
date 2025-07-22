// tests/mocks/nanoid.js
// Mock simple para el paquete 'nanoid' usando sintaxis CommonJS, que es lo que Jest espera.
// Devuelve una función que siempre retorna un valor predecible para los tests.
module.exports = {
  nanoid: () => 'mock-id-for-tests',
};
