const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

// Jogos da R11 (ids 101-110)
const R11 = [101,102,103,104,105,106,107,108,109,110];
const players = ["tico","pedro","luquinhas","lazaro","vini","dane","alex"];

async function check() {
  for (const pid of players) {
    const snap = await get(ref(db, `preds/${pid}`));
    const d = snap.val() || {};
    const r11preds = R11.map(j => `J${j}:${d[j]?d[j].home+"x"+d[j].away:"VAZIO"}`);
    console.log(`${pid}: ${r11preds.join(" | ")}`);
  }
  process.exit(0);
}
check().catch(e=>{console.error(e);process.exit(1);});
