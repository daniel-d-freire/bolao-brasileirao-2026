const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

async function check() {
  const [viniSnap, pedroSnap] = await Promise.all([
    get(ref(db,'preds/vini')),
    get(ref(db,'preds/pedro')),
  ]);
  for (const [name, snap] of [['vini',viniSnap],['pedro',pedroSnap]]) {
    const d = snap.val() || {};
    const missing = [];
    for (let i=1; i<=110; i++) if (!d[i]) missing.push(i);
    console.log(`${name}: faltando ${missing.length} palpites:`);
    console.log('  ' + missing.join(', '));
  }
  process.exit(0);
}
check().catch(e=>{console.error(e);process.exit(1);});
