const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

async function check() {
  const snap = await get(ref(db, 'preds/dane'));
  const d = snap.val();
  const total = Object.keys(d).length;
  console.log('Total palpites Dane:', total);
  // Verificar R11 (J101-J110)
  for (let i = 101; i <= 110; i++) {
    console.log(`J${i}:`, d[i] ? JSON.stringify(d[i]) : 'FALTANDO');
  }
  // Verificar se as chaves são string ou number
  console.log('\nSample keys (type):', Object.keys(d).slice(0,5).map(k => `"${k}" (${typeof k})`));
  process.exit(0);
}
check().catch(e=>{console.error(e);process.exit(1);});
