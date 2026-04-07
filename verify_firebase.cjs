const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');

const firebaseConfig = {
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  projectId: "bolao-brasileirao-2026-51b74",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function verify() {
  // 1. Resultados
  const resSnap = await get(ref(db, 'results'));
  const res = resSnap.val();
  const resKeys = Object.keys(res).map(Number).sort((a,b)=>a-b);
  console.log('\n=== RESULTADOS ===');
  console.log('Total jogos: ' + resKeys.length);
  console.log('Primeiro (J1): ' + JSON.stringify(res[1]));
  console.log('J5: ' + JSON.stringify(res[5]));
  console.log('J17: ' + JSON.stringify(res[17]));
  console.log('J100: ' + JSON.stringify(res[100]));
  const missing = [];
  for(let i=1;i<=100;i++) if(!res[i]) missing.push(i);
  console.log('Jogos sem resultado (esperado alguns): ' + JSON.stringify(missing));

  // 2. Palpites
  console.log('\n=== PALPITES ===');
  const players = ['tico','pedro','luquinhas','lazaro','vini','dane','alex'];
  for (const p of players) {
    const snap = await get(ref(db, 'preds/' + p));
    const d = snap.val();
    const n = d ? Object.keys(d).length : 0;
    const j1 = d && d[1] ? JSON.stringify(d[1]) : 'FALTANDO';
    const j100 = d && d[100] ? JSON.stringify(d[100]) : 'FALTANDO';
    console.log(p + ': ' + n + ' palpites | J1=' + j1 + ' | J100=' + j100);
  }

  // 3. Tabela
  console.log('\n=== PALPITES TABELA ===');
  for (const p of players) {
    const snap = await get(ref(db, 'tableGuesses/' + p));
    const d = snap.val();
    const n = d ? Object.keys(d).length : 0;
    const pos1 = d && d[1] ? d[1] : 'FALTANDO';
    const pos20 = d && d[20] ? d[20] : 'FALTANDO';
    console.log(p + ': ' + n + ' posicoes | 1o=' + pos1 + ' | 20o=' + pos20);
  }

  // 4. Cross-check pontos Dane R1
  console.log('\n=== CROSS-CHECK: DANE JOGO 1 ===');
  const daneJ1 = (await get(ref(db,'preds/dane'))).val()[1];
  const realJ1 = res[1];
  console.log('Real: ' + JSON.stringify(realJ1));
  console.log('Dane: ' + JSON.stringify(daneJ1));
  // calcular pts
  const rh=realJ1.home, ra=realJ1.away, ph=daneJ1.home, pa=daneJ1.away;
  let pts=0;
  if(ph===rh&&pa===ra) pts=25;
  else {
    const rw=rh>ra?'H':ra>rh?'A':'D', pw=ph>pa?'H':pa>ph?'A':'D';
    if(rw===pw) {
      if(rw==='H'&&ph===rh) pts=18;
      else if(rw==='A'&&pa===ra) pts=18;
      else if(rh-ra===ph-pa) pts=15;
      else if(rw==='H'&&pa===ra) pts=12;
      else if(rw==='A'&&ph===rh) pts=12;
      else if(rw==='D') pts=12;
      else pts=10;
    }
  }
  console.log('Pontos corretos para Dane J1: ' + pts);

  process.exit(0);
}
verify().catch(e => { console.error(e); process.exit(1); });
