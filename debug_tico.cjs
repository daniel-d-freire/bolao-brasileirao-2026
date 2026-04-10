const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

async function check() {
  const snap = await get(ref(db, 'preds/tico'));
  const d = snap.val();
  const keys = Object.keys(d).map(Number).sort((a,b)=>a-b);
  console.log('Total palpites Tico:', keys.length);
  console.log('Min id:', keys[0], 'Max id:', keys[keys.length-1]);
  console.log('\nJogos 99-115:');
  for (let i = 99; i <= 115; i++) {
    console.log(`  J${i}: ${d[i] ? d[i].home+'x'+d[i].away : 'VAZIO'}`);
  }
  process.exit(0);
}
check().catch(e=>{console.error(e);process.exit(1);});
