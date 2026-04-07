const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

get(ref(db, "preds/dane")).then(s => {
  const d = s.val();
  console.log("Total palpites Dane:", Object.keys(d).length);
  const missing = [];
  for (let i = 1; i <= 100; i++) {
    if (!d[i]) missing.push(i);
  }
  console.log("Faltando:", missing.length === 0 ? "NENHUM" : missing.join(", "));
  // Mostrar R5-R10 (jogos 41-100)
  console.log("\nR5-R10 (J41-J100):");
  for (let i = 41; i <= 100; i++) {
    const p = d[i];
    console.log("  J" + i + ": " + (p ? p.home + "x" + p.away : "FALTANDO"));
  }
  process.exit(0);
});
