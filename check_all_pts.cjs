const {initializeApp} = require('firebase/app');
const {getDatabase, ref, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

function calcPts(pred, real) {
  if (!real||real.home==null) return null;
  if (!pred||pred.home==null) return 0;
  const rh=+real.home,ra=+real.away,ph=+pred.home,pa=+pred.away;
  if(ph===rh&&pa===ra) return 25;
  const rw=rh>ra?"H":ra>rh?"A":"D",pw=ph>pa?"H":pa>ph?"A":"D";
  if(rw!==pw) return 0;
  if(rw==="D") return 10;
  if(rw==="H"){if(ph===rh) return 18;if(rh-ra===ph-pa) return 15;if(pa===ra) return 12;return 10;}
  if(pa===ra) return 18;if(rh-ra===ph-pa) return 15;if(ph===rh) return 12;return 10;
}

async function check() {
  const players = ["tico","pedro","luquinhas","lazaro","vini","dane","alex"];
  const resSnap = await get(ref(db,'results'));
  const results = resSnap.val();

  console.log("=== VERIFICAÇÃO COMPLETA ===\n");
  for (const pid of players) {
    const snap = await get(ref(db,`preds/${pid}`));
    const preds = snap.val() || {};
    const missing = [];
    for(let i=1;i<=100;i++) if(!preds[i]) missing.push(i);
    let pts=0, played=0;
    for(let j=1;j<=380;j++) {
      const real=results[j];
      if(!real||real.home==null||real.home==='') continue;
      played++;
      pts += calcPts(preds[j],real)||0;
    }
    const status = missing.length===0?"✅":"❌ FALTANDO: "+missing.join(",");
    console.log(`${pid}: ${Object.keys(preds).length} palpites | ${pts}pts | J1-100: ${status}`);
  }
  process.exit(0);
}
check().catch(e=>{console.error(e);process.exit(1);});
