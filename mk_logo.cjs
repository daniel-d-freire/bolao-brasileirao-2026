const fs = require('fs');
// Ler o base64 do arquivo de texto e converter para PNG
const b64 = fs.readFileSync('C:\\Users\\User\\bolao-brasileirao-2026\\logo_b64.txt', 'utf8').trim();
const buf = Buffer.from(b64, 'base64');
if (!fs.existsSync('C:\\Users\\User\\bolao-brasileirao-2026\\public')) {
  fs.mkdirSync('C:\\Users\\User\\bolao-brasileirao-2026\\public', { recursive: true });
}
fs.writeFileSync('C:\\Users\\User\\bolao-brasileirao-2026\\public\\logo_brasileirao.png', buf);
console.log('OK:', buf.length, 'bytes salvos em public/logo_brasileirao.png');
