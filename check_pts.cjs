const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

function calcPts(pred, real) {
  if (!real || real.home == null || real.away == null) return null;
  if (!pred || pred.home == null || pred.away == null) return 0;
  const rh=+real.home, ra=+real.away, ph=+pred.home, pa=+pred.away;
  if (ph===rh && pa===ra) return 25;
  const rw = rh>ra?"H":ra>rh?"A":"D", pw = ph>pa?"H":pa>ph?"A":"D";
  if (rw!==pw) return 0;
  if (rw==="H"&&ph===rh) return 18;
  if (rw==="A"&&pa===ra) return 18;
  if (rh-ra===ph-pa) return 15;
  if (rw==="H"&&pa===ra) return 12;
  if (rw==="A"&&ph===rh) return 12;
  return 10;
}

async function check() {
  const [resSnap, viniSnap, alexSnap, pedroSnap] = await Promise.all([
    get(ref(db, "results")),
    get(ref(db, "preds/vini")),
    get(ref(db, "preds/alex")),
    get(ref(db, "preds/pedro")),
  ]);
  const results = resSnap.val();
  const players = { vini: viniSnap.val(), alex: alexSnap.val(), pedro: pedroSnap.val() };

  for (const [name, preds] of Object.entries(players)) {
    let totalPts = 0, exact = 0, correct = 0, played = 0;
    const details = [];
    const missing = [];

    for (let j = 1; j <= 100; j++) {
      const real = results[j];
      if (!real || real.home == null) continue; // sem resultado ainda
      played++;
      const pred = preds[j];
      if (!pred) { missing.push(j); details.push(`J${j}: SEM PALPITE (real ${real.home}x${real.away}) = 0pts`); continue; }
      const pts = calcPts(pred, real);
      totalPts += pts;
      if (pts === 25) exact++;
      if (pts >= 10) correct++;
      if (pts > 0) details.push(`J${j}: palpite ${pred.home}x${pred.away} | real ${real.home}x${real.away} = ${pts}pts`);
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log(`JOGADOR: ${name.toUpperCase()}`);
    console.log(`Total palpites no Firebase: ${Object.keys(preds).length}`);
    console.log(`Jogos com resultado: ${played}`);
    console.log(`Sem palpite: ${missing.length > 0 ? missing.join(",") : "nenhum"}`);
    console.log(`PONTUAÇÃO TOTAL: ${totalPts} pts`);
    console.log(`Exatos (25pts): ${exact} | Acertos (>=10pts): ${correct}`);
    console.log(`\nDetalhes pontuados:`);
    details.forEach(d => console.log("  " + d));
  }
  process.exit(0);
}
check().catch(e => { console.error(e); process.exit(1); });
