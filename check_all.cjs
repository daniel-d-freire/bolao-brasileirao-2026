const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

const players = ["tico","pedro","luquinhas","lazaro","vini","dane","alex"];
Promise.all(players.map(p => get(ref(db, "preds/" + p)).then(s => ({p, d: s.val()}))))
  .then(all => {
    all.forEach(({p, d}) => {
      const n = d ? Object.keys(d).length : 0;
      const missing = [];
      for (let i = 1; i <= 100; i++) if (!d || !d[i]) missing.push(i);
      console.log(p + ": " + n + " palpites | " + (missing.length === 0 ? "OK ✅" : "FALTANDO: " + missing.join(",")));
    });
    process.exit(0);
  });
