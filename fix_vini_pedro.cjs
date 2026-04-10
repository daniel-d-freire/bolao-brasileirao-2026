const {initializeApp} = require('firebase/app');
const {getDatabase, ref, update, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

// J39-J100 da planilha para Vini e Pedro
const MISSING = {
  vini: {
    39:{home:3,away:0},40:{home:1,away:1},41:{home:2,away:2},42:{home:1,away:0},43:{home:3,away:0},
    44:{home:2,away:1},45:{home:2,away:2},46:{home:2,away:1},47:{home:2,away:1},48:{home:1,away:2},
    49:{home:2,away:0},50:{home:1,away:1},51:{home:2,away:1},52:{home:0,away:1},53:{home:1,away:1},
    54:{home:2,away:0},55:{home:1,away:1},56:{home:1,away:0},57:{home:2,away:1},58:{home:2,away:0},
    59:{home:1,away:1},60:{home:1,away:2},61:{home:4,away:0},62:{home:1,away:1},63:{home:2,away:1},
    64:{home:2,away:0},65:{home:2,away:0},66:{home:1,away:1},67:{home:3,away:1},68:{home:1,away:1},
    69:{home:2,away:0},70:{home:1,away:1},71:{home:2,away:1},72:{home:3,away:1},73:{home:1,away:2},
    74:{home:0,away:1},75:{home:2,away:1},76:{home:2,away:0},77:{home:2,away:0},78:{home:1,away:0},
    79:{home:1,away:1},80:{home:1,away:1},81:{home:2,away:1},82:{home:1,away:1},83:{home:2,away:0},
    84:{home:2,away:0},85:{home:1,away:2},86:{home:2,away:0},87:{home:1,away:1},88:{home:1,away:1},
    89:{home:2,away:1},90:{home:0,away:1},91:{home:2,away:0},92:{home:1,away:0},93:{home:0,away:1},
    94:{home:2,away:1},95:{home:2,away:2},96:{home:2,away:0},97:{home:3,away:0},98:{home:1,away:0},
    99:{home:1,away:1},100:{home:2,away:1}
  },
  pedro: {
    39:{home:2,away:0},40:{home:1,away:2},41:{home:2,away:1},42:{home:2,away:2},43:{home:2,away:1},
    44:{home:2,away:1},45:{home:3,away:2},46:{home:2,away:1},47:{home:2,away:0},48:{home:1,away:0},
    49:{home:4,away:3},50:{home:2,away:1},51:{home:2,away:1},52:{home:1,away:3},53:{home:0,away:2},
    54:{home:2,away:1},55:{home:1,away:0},56:{home:2,away:2},57:{home:2,away:1},58:{home:2,away:3},
    59:{home:1,away:0},60:{home:1,away:2},61:{home:8,away:1},62:{home:2,away:1},63:{home:1,away:1},
    64:{home:3,away:1},65:{home:2,away:1},66:{home:2,away:1},67:{home:2,away:1},68:{home:1,away:2},
    69:{home:2,away:0},70:{home:1,away:2},71:{home:2,away:1},72:{home:2,away:1},73:{home:1,away:2},
    74:{home:0,away:2},75:{home:1,away:2},76:{home:2,away:1},77:{home:2,away:1},78:{home:2,away:2},
    79:{home:1,away:2},80:{home:1,away:0},81:{home:2,away:1},82:{home:2,away:1},83:{home:2,away:3},
    84:{home:2,away:1},85:{home:1,away:4},86:{home:2,away:1},87:{home:1,away:2},88:{home:2,away:3},
    89:{home:2,away:1},90:{home:0,away:2},91:{home:3,away:1},92:{home:2,away:1},93:{home:1,away:2},
    94:{home:2,away:1},95:{home:2,away:1},96:{home:2,away:2},97:{home:3,away:1},98:{home:1,away:2},
    99:{home:1,away:0},100:{home:2,away:0}
  }
};

async function run() {
  const updates = {};
  for (const [pid, preds] of Object.entries(MISSING)) {
    for (const [j, v] of Object.entries(preds)) {
      updates[`preds/${pid}/${j}`] = v;
    }
  }
  console.log(`Inserindo ${Object.keys(updates).length} palpites (J39-J100 para vini e pedro)...`);
  await update(ref(db), updates);
  console.log('Salvo!\n');

  // Double check
  for (const pid of ['vini','pedro']) {
    const snap = await get(ref(db, `preds/${pid}`));
    const d = snap.val() || {};
    const missing = [];
    for (let i=1; i<=100; i++) if (!d[i]) missing.push(i);
    const total = Object.keys(d).length;
    console.log(`${pid}: ${total} palpites | faltando J1-100: ${missing.length===0?'NENHUM ✅':missing.join(',')}`);
  }
  process.exit(0);
}
run().catch(e=>{console.error(e);process.exit(1);});
