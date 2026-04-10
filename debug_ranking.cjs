const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

function calcPts(pred, real) {
  if (!real || real.home==null || real.away==null) return null;
  if (!pred || pred.home==null || pred.away==null) return 0;
  const rh=+real.home, ra=+real.away, ph=+pred.home, pa=+pred.away;
  if (ph===rh && pa===ra) return 25;
  const rw=rh>ra?"H":ra>rh?"A":"D", pw=ph>pa?"H":pa>ph?"A":"D";
  if (rw!==pw) return 0;
  if (rw==="D") return 10;
  if (rw==="H") { if(ph===rh) return 18; if(rh-ra===ph-pa) return 15; if(pa===ra) return 12; return 10; }
  if(pa===ra) return 18; if(rh-ra===ph-pa) return 15; if(ph===rh) return 12; return 10;
}

async function check() {
  const [resSnap, viniSnap, pedroSnap] = await Promise.all([
    get(ref(db,'results')),
    get(ref(db,'preds/vini')),
    get(ref(db,'preds/pedro')),
  ]);
  const results = resSnap.val();
  const players = {vini: viniSnap.val(), pedro: pedroSnap.val()};

  for (const [name, preds] of Object.entries(players)) {
    let total=0, played=0;
    const byRound = {};
    for (let j=1; j<=380; j++) {
      const real = results[j];
      if (!real || real.home==null || real.home==='') continue;
      played++;
      const pred = preds[j];
      const pts = pred ? calcPts(pred, real) : 0;
      total += pts;
      // agrupar por rodada (10 jogos por rodada)
      const round = Math.ceil(j/10);
      if (!byRound[round]) byRound[round] = 0;
      byRound[round] += pts;
    }
    console.log(`\n${name.toUpperCase()}: ${played} jogos com resultado`);
    console.log(`TOTAL: ${total} pts`);
    console.log('Por rodada:', JSON.stringify(byRound));
    // Verificar quantos palpites existem
    const predKeys = preds ? Object.keys(preds).map(Number).sort((a,b)=>a-b) : [];
    console.log(`Palpites no Firebase: ${predKeys.length} (max id: ${predKeys[predKeys.length-1]})`);
  }
  process.exit(0);
}
check().catch(e=>{console.error(e);process.exit(1);});
