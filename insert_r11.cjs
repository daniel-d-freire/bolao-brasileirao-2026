const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get, update} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

// Palpites R11 dos 4 jogadores confirmados (J101-J110)
// Baseados no que estava no Firebase antes
const R11_PREDS = {
  tico:      {101:{home:1,away:2},102:{home:2,away:0},103:{home:1,away:1},104:{home:1,away:1},105:{home:1,away:1},106:{home:2,away:1},107:{home:1,away:1},108:{home:2,away:0},109:{home:2,away:0},110:{home:1,away:2}},
  pedro:     {101:{home:1,away:2},102:{home:2,away:1},103:{home:1,away:2},104:{home:1,away:0},105:{home:1,away:2},106:{home:2,away:1},107:{home:2,away:4},108:{home:2,away:2},109:{home:1,away:2},110:{home:2,away:3}},
  dane:      {101:{home:1,away:2},102:{home:2,away:0},103:{home:1,away:0},104:{home:1,away:1},105:{home:1,away:2},106:{home:2,away:0},107:{home:1,away:1},108:{home:2,away:0},109:{home:1,away:1},110:{home:1,away:2}},
  alex:      {101:{home:2,away:1},102:{home:1,away:0},103:{home:1,away:1},104:{home:0,away:2},105:{home:0,away:1},106:{home:1,away:0},107:{home:1,away:0},108:{home:2,away:0},109:{home:1,away:2},110:{home:0,away:1}},
};

async function run() {
  const updates = {};
  for (const [pid, preds] of Object.entries(R11_PREDS)) {
    for (const [j, v] of Object.entries(preds)) {
      updates[`preds/${pid}/${j}`] = v;
    }
  }
  console.log(`Inserindo ${Object.keys(updates).length} palpites R11...`);
  await update(ref(db), updates);
  console.log('Salvo!\n');

  // Double-check
  for (const pid of ['tico','pedro','dane','alex']) {
    const snap = await get(ref(db, `preds/${pid}`));
    const d = snap.val();
    const r11 = [101,102,103,104,105,106,107,108,109,110].map(j => d[j]?`J${j}:${d[j].home}x${d[j].away}`:`J${j}:VAZIO`);
    console.log(`${pid}: ${r11.join(' | ')}`);
  }
  process.exit(0);
}
run().catch(e=>{console.error(e);process.exit(1);});
