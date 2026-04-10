const {initializeApp} = require('firebase/app');
const {getDatabase, ref, update, get} = require('firebase/database');
const app = initializeApp({
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
});
const db = getDatabase(app);

// Mapeamento nome planilha -> id no Firebase
// "Bragantino" -> "Red Bull Bragantino", "Atlético Paranaense"/"Athletico" -> "Athletico-PR", etc.
const TABLE_GUESSES = {
  pedro: {
    1:"Flamengo",2:"Cruzeiro",3:"Palmeiras",4:"Grêmio",5:"Vasco",
    6:"Atlético-MG",7:"Corinthians",8:"Fluminense",9:"Remo",10:"Mirassol",
    11:"Bahia",12:"Botafogo",13:"Santos",14:"Internacional",15:"Red Bull Bragantino",
    16:"São Paulo",17:"Vitória",18:"Athletico-PR",19:"Coritiba",20:"Chapecoense"
  },
  dane: {
    1:"Flamengo",2:"Palmeiras",3:"Corinthians",4:"Grêmio",5:"Cruzeiro",
    6:"Bahia",7:"Atlético-MG",8:"Athletico-PR",9:"Santos",10:"Fluminense",
    11:"Mirassol",12:"Botafogo",13:"São Paulo",14:"Red Bull Bragantino",15:"Vasco",
    16:"Coritiba",17:"Remo",18:"Vitória",19:"Internacional",20:"Chapecoense"
  },
  luquinhas: {
    1:"Botafogo",2:"Flamengo",3:"Cruzeiro",4:"Palmeiras",5:"Fluminense",
    6:"Mirassol",7:"Corinthians",8:"Grêmio",9:"Atlético-MG",10:"Bahia",
    11:"Vasco",12:"Athletico-PR",13:"São Paulo",14:"Remo",15:"Red Bull Bragantino",
    16:"Santos",17:"Internacional",18:"Coritiba",19:"Chapecoense",20:"Vitória"
  },
  vini: {
    1:"Palmeiras",2:"Cruzeiro",3:"Flamengo",4:"Grêmio",5:"Bahia",
    6:"Fluminense",7:"Botafogo",8:"Corinthians",9:"Vasco",10:"Atlético-MG",
    11:"Red Bull Bragantino",12:"Internacional",13:"Mirassol",14:"Santos",15:"São Paulo",
    16:"Coritiba",17:"Vitória",18:"Athletico-PR",19:"Remo",20:"Chapecoense"
  },
  tico: {
    1:"Flamengo",2:"Cruzeiro",3:"Palmeiras",4:"Internacional",5:"Santos",
    6:"Vasco",7:"Grêmio",8:"Atlético-MG",9:"Fluminense",10:"Botafogo",
    11:"Mirassol",12:"Corinthians",13:"Bahia",14:"Red Bull Bragantino",15:"Athletico-PR",
    16:"São Paulo",17:"Remo",18:"Coritiba",19:"Vitória",20:"Chapecoense"
  },
  lazaro: {
    1:"Palmeiras",2:"Cruzeiro",3:"Flamengo",4:"Fluminense",5:"Botafogo",
    6:"Vasco",7:"Bahia",8:"Grêmio",9:"Atlético-MG",10:"Santos",
    11:"Internacional",12:"Red Bull Bragantino",13:"São Paulo",14:"Mirassol",15:"Corinthians",
    16:"Athletico-PR",17:"Coritiba",18:"Vitória",19:"Chapecoense",20:"Remo"
  },
  alex: {
    1:"Palmeiras",2:"Flamengo",3:"Fluminense",4:"Mirassol",5:"Cruzeiro",
    6:"Botafogo",7:"Bahia",8:"Grêmio",9:"Atlético-MG",10:"Red Bull Bragantino",
    11:"São Paulo",12:"Vasco",13:"Corinthians",14:"Chapecoense",15:"Internacional",
    16:"Santos",17:"Athletico-PR",18:"Vitória",19:"Coritiba",20:"Remo"
  }
};

async function run() {
  // Montar update paths individuais - não toca em nada mais no Firebase
  const updates = {};
  for (const [player, guesses] of Object.entries(TABLE_GUESSES)) {
    for (const [pos, team] of Object.entries(guesses)) {
      updates[`tableGuesses/${player}/${pos}`] = team;
    }
  }
  console.log(`Atualizando ${Object.keys(updates).length} entradas de palpites de tabela...`);
  await update(ref(db), updates);
  console.log("Salvo!\n");

  // Double check
  console.log("=== DOUBLE CHECK ===");
  for (const player of Object.keys(TABLE_GUESSES)) {
    const snap = await get(ref(db, `tableGuesses/${player}`));
    const d = snap.val();
    const n = d ? Object.keys(d).length : 0;
    const mismatches = [];
    for (const [pos, expected] of Object.entries(TABLE_GUESSES[player])) {
      if (!d || d[pos] !== expected) mismatches.push(`${pos}º: esperado "${expected}", got "${d?.[pos]}"`);
    }
    const status = mismatches.length === 0 ? "OK ✅" : `ERROS: ${mismatches.join(", ")}`;
    console.log(`${player}: ${n} posições | ${status}`);
    console.log(`  1º=${d?.[1]} | 10º=${d?.[10]} | 20º=${d?.[20]}`);
  }
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });
