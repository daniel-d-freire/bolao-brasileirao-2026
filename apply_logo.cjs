
const fs = require('fs');
const b64 = require('./logo_data.js');
const buf = Buffer.from(b64, 'base64');
fs.writeFileSync('C:\\Users\\User\\bolao-brasileirao-2026\\public\\logo_brasileirao.png', buf);
console.log('Logo PNG salva em public/');

const appPath = 'C:\\Users\\User\\bolao-brasileirao-2026\\src\\App.jsx';
let c = fs.readFileSync(appPath, 'utf8');
// Trocar SVG placeholder pela img real
c = c.replace(
  /\{\s*\/\* Logo Brasileirão Betano \*\/[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/div>/,
  (m) => m  // não mexe se não achar
);
// Trocar o bloco SVG pelo img
const oldSVG = c.match(/{\s*\/\* Logo Brasileirão Betano \*\//);
if (!oldSVG) {
  // Já pode estar com SVG ou img — substituir pelo img
  c = c.replace(/<svg width="110"[\s\S]*?<\/svg>/, '<img src="/logo_brasileirao.png" alt="Logo Brasileirão Betano" style={{ width:120, marginBottom:4, filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.5))" }} />');
  fs.writeFileSync(appPath, c, 'utf8');
  console.log('SVG substituído por img:', c.includes('logo_brasileirao.png'));
}
