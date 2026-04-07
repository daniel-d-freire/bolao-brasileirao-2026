const {initializeApp} = require('firebase/app');
const {getDatabase, ref, update, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

// Apenas J41-J100 do Dane (da planilha)
const daneR5a10 = {
  "41":{"home":2,"away":1},"42":{"home":1,"away":1},"43":{"home":2,"away":0},
  "44":{"home":1,"away":0},"45":{"home":2,"away":1},"46":{"home":1,"away":0},
  "47":{"home":2,"away":0},"48":{"home":1,"away":0},"49":{"home":2,"away":1},
  "50":{"home":1,"away":0},
  "51":{"home":1,"away":0},"52":{"home":0,"away":1},"53":{"home":1,"away":1},
  "54":{"home":2,"away":1},"55":{"home":1,"away":1},"56":{"home":2,"away":1},
  "57":{"home":1,"away":0},"58":{"home":1,"away":0},"59":{"home":1,"away":1},
  "60":{"home":0,"away":1},
  "61":{"home":3,"away":0},"62":{"home":1,"away":1},"63":{"home":1,"away":0},
  "64":{"home":2,"away":1},"65":{"home":1,"away":0},"66":{"home":1,"away":1},
  "67":{"home":2,"away":1},"68":{"home":1,"away":0},"69":{"home":2,"away":1},
  "70":{"home":1,"away":0},
  "71":{"home":2,"away":1},"72":{"home":2,"away":1},"73":{"home":1,"away":1},
  "74":{"home":1,"away":2},"75":{"home":1,"away":0},"76":{"home":1,"away":0},
  "77":{"home":2,"away":0},"78":{"home":1,"away":1},"79":{"home":1,"away":0},
  "80":{"home":1,"away":2},
  "81":{"home":1,"away":0},"82":{"home":2,"away":1},"83":{"home":1,"away":0},
  "84":{"home":2,"away":1},"85":{"home":1,"away":2},"86":{"home":2,"away":0},
  "87":{"home":2,"away":1},"88":{"home":2,"away":1},"89":{"home":1,"away":0},
  "90":{"home":0,"away":1},
  "91":{"home":2,"away":0},"92":{"home":1,"away":1},"93":{"home":2,"away":1},
  "94":{"home":1,"away":0},"95":{"home":1,"away":0},"96":{"home":2,"away":1},
  "97":{"home":3,"away":0},"98":{"home":2,"away":1},"99":{"home":1,"away":1},
  "100":{"home":0,"away":1}
};

// Montar objeto de update com paths individuais (não sobrescreve o resto)
const updates = {};
Object.entries(daneR5a10).forEach(([j, v]) => {
  updates[`preds/dane/${j}`] = v;
});

async function run() {
  console.log(`Atualizando ${Object.keys(updates).length} palpites do Dane (J41-J100)...`);
  await update(ref(db), updates);
  console.log("Salvo!");

  // Verificar
  const snap = await get(ref(db, "preds/dane"));
  const d = snap.val();
  const total = Object.keys(d).length;
  const missing = [];
  for (let i = 1; i <= 100; i++) if (!d[i]) missing.push(i);
  console.log(`Total Dane no Firebase: ${total}`);
  console.log(`Faltando: ${missing.length === 0 ? "NENHUM ✅" : missing.join(", ")}`);
  // Amostra R5-R10
  [41,50,60,70,80,91,100].forEach(j => {
    console.log(`  J${j}: ${d[j] ? d[j].home+"x"+d[j].away : "FALTANDO ❌"}`);
  });
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
