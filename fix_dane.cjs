const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get, update } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  projectId: "bolao-brasileirao-2026-51b74",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function fix() {
  // Verificar quais jogos da R4 o Dane tem
  const snap = await get(ref(db, 'preds/dane'));
  const preds = snap.val();
  console.log('Dane R4 (jogos 31-40):');
  for (let i = 31; i <= 40; i++) {
    console.log('  J' + i + ': ' + (preds[i] ? JSON.stringify(preds[i]) : 'FALTANDO'));
  }

  // Jogo 38 = Bahia x Chapecoense (R4, posição 8 da rodada)
  // Jogo 40 = Remo x Internacional (R4, posição 10 da rodada)
  // Palpites: Bahia 2x0 Chapecoense e Remo 1x0 Internacional
  const updates = {
    'preds/dane/38': { home: 2, away: 0 },
    'preds/dane/40': { home: 1, away: 0 },
  };

  await update(ref(db), updates);
  console.log('\nPalpites do Dane atualizados:');
  console.log('  J38 (Bahia x Chapecoense): 2x0');
  console.log('  J40 (Remo x Internacional): 1x0');

  // Verificar
  const snap2 = await get(ref(db, 'preds/dane'));
  const preds2 = snap2.val();
  console.log('\nVerificacao R4 apos update:');
  for (let i = 31; i <= 40; i++) {
    console.log('  J' + i + ': ' + (preds2[i] ? JSON.stringify(preds2[i]) : 'FALTANDO'));
  }
  process.exit(0);
}
fix().catch(e => { console.error(e); process.exit(1); });
