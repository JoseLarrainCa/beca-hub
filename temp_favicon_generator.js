// Generador de favicon temporal para UDD
const fs = require('fs');
const { createCanvas } = require('canvas');

// Crear canvas 32x32 (tamaño estándar de favicon)
const canvas = createCanvas(32, 32);
const ctx = canvas.getContext('2d');

// Fondo azul UDD
ctx.fillStyle = '#1e40af'; // Azul universidad
ctx.fillRect(0, 0, 32, 32);

// Texto UDD en blanco
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 12px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('UDD', 16, 16);

// Guardar como favicon.ico
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/favicon.ico', buffer);

console.log('✅ Favicon UDD creado en public/favicon.ico');
