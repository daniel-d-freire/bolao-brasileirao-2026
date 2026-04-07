const {initializeApp} = require('firebase/app');
const {getDatabase, ref, set, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

// Palpites completos do Dane (R1-R10, jogos 1-100) da planilha
const danePreds = {
  "1":{"home":1,"away":0},"2":{"home":1,"away":2},"3":{"home":1,"away":2},
  "4":{"home":1,"away":0},"5":{"home":2,"away":1},"6":{"home":1,"away":1},
  "7":{"home":1,"away":0},"8":{"home":2,"away":1},"9":{"home":1,"away":0},
  "10":{"home":1,"away":1},
  "11":{"home":2,"away":0},"12":{"home":1,"away":0},"13":{"home":1,"away":1},
  "14":{"home":2,"away":0},"15":{"home":2,"away":1},"16":{"home":2,"away":0},
  "17":{"home":1,"away":1},"18":{"home":1,"away":0},"19":{"home":2,"away":1},
  "20":{"home":0,"away":1},
  "21":{"home":1,"away":1},"22":{"home":0,"away":1},"23":{"home":2,"away":1},
  "24":{"home":1,"away":0},"25":{"home":1,"away":1},"26":{"home":2,"away":0},
  "27":{"home":0,"away":1},"28":{"home":1,"away":0},"29":{"home":1,"away":2},
  "30":{"home":0,"away":0},
  "31":{"home":2,"away":0},"32":{"home":2,"away":0},"33":{"home":1,"away":0},
  "34":{"home":2,"away":1},"35":{"home":1,"away":0},"36":{"home":1,"away":0},
  "37":{"home":1,"away":1},"38":{"home":2,"away":0},"39":{"home":2,"away":0},
  "40":{"home":1,"away":0},
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

async function fix() {
  console.log("Salvando palpites do Dane (" + Object.keys(danePreds).length + " jogos)...");
  await set(ref(db, "preds/dane"), danePreds);
  console.log("Salvo!");

  // Double-check
  const snap = await get(ref(db, "preds/dane"));
  const d = snap.val();
  const missing = [];
  for (let i = 1; i <= 100; i++) if (!d[i]) missing.push(i);
  console.log("Total no Firebase: " + Object.keys(d).length);
  console.log("Faltando: " + (missing.length === 0 ? "NENHUM ✅" : missing.join(", ")));

  // Verificar R5-R10 amostra
  console.log("\nAmostra R5-R10:");
  [41, 50, 60, 70, 80, 91, 100].forEach(j => {
    const p = d[j];
    console.log("  J" + j + ": " + (p ? p.home + "x" + p.away : "FALTANDO ❌"));
  });
  process.exit(0);
}

fix().catch(e => { console.error(e); process.exit(1); });
