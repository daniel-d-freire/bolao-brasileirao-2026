const fs = require('fs');
const content = `import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// ─── Firebase Config ────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  authDomain: "bolao-brasileirao-2026-51b74.firebaseapp.com",
  databaseURL: "https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  projectId: "bolao-brasileirao-2026-51b74",
  storageBucket: "bolao-brasileirao-2026-51b74.firebasestorage.app",
  messagingSenderId: "571312996480",
  appId: "1:571312996480:web:14f6e7c0502577707c6665"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// ─── Resultados Reais (Rodadas 1-9) ─────────────────────────────────────────
const KNOWN_RESULTS = {
  1:{homeScore:2,awayScore:1},2:{homeScore:4,awayScore:0},3:{homeScore:2,awayScore:1},
  4:{homeScore:1,awayScore:2},5:{homeScore:0,awayScore:0},6:{homeScore:2,awayScore:2},
  7:{homeScore:0,awayScore:1},8:{homeScore:0,awayScore:1},9:{homeScore:2,awayScore:0},
  10:{homeScore:4,awayScore:2},
  11:{homeScore:1,awayScore:1},12:{homeScore:1,awayScore:1},13:{homeScore:1,awayScore:1},
  14:{homeScore:5,awayScore:1},15:{homeScore:1,awayScore:1},16:{homeScore:1,awayScore:2},
  17:{homeScore:5,awayScore:3},18:{homeScore:1,awayScore:1},19:{homeScore:1,awayScore:1},
  20:{homeScore:1,awayScore:1},
  21:{homeScore:1,awayScore:1},22:{homeScore:1,awayScore:1},23:{homeScore:1,awayScore:1},
  24:{homeScore:1,awayScore:1},25:{homeScore:1,awayScore:0},26:{homeScore:2,awayScore:0},
  27:{homeScore:1,awayScore:1},28:{homeScore:1,awayScore:1},29:{homeScore:1,awayScore:1},
  30:{homeScore:1,awayScore:1},
  31:{homeScore:2,awayScore:0},32:{homeScore:2,awayScore:1},33:{homeScore:1,awayScore:1},
  34:{homeScore:2,awayScore:1},35:{homeScore:1,awayScore:1},36:{homeScore:1,awayScore:1},
  37:{homeScore:1,awayScore:1},38:{homeScore:1,awayScore:1},39:{homeScore:1,awayScore:1},
  40:{homeScore:1,awayScore:2},
  41:{homeScore:1,awayScore:1},42:{homeScore:1,awayScore:1},43:{homeScore:1,awayScore:0},
  44:{homeScore:1,awayScore:1},45:{homeScore:1,awayScore:1},46:{homeScore:1,awayScore:1},
  47:{homeScore:1,awayScore:1},48:{homeScore:4,awayScore:1},49:{homeScore:1,awayScore:1},
  50:{homeScore:1,awayScore:2},
  51:{homeScore:1,awayScore:1},52:{homeScore:0,awayScore:3},53:{homeScore:1,awayScore:1},
  54:{homeScore:2,awayScore:0},55:{homeScore:1,awayScore:1},56:{homeScore:1,awayScore:1},
  57:{homeScore:2,awayScore:0},58:{homeScore:2,awayScore:0},59:{homeScore:1,awayScore:1},
  60:{homeScore:1,awayScore:1},
  61:{homeScore:3,awayScore:0},62:{homeScore:3,awayScore:2},63:{homeScore:1,awayScore:2},
  64:{homeScore:2,awayScore:1},65:{homeScore:0,awayScore:1},66:{homeScore:1,awayScore:0},
  67:{homeScore:2,awayScore:0},68:{homeScore:2,awayScore:1},69:{homeScore:2,awayScore:0},
  70:{homeScore:0,awayScore:0},
  71:{homeScore:1,awayScore:0},72:{homeScore:2,awayScore:1},73:{homeScore:0,awayScore:1},
  74:{homeScore:1,awayScore:1},75:{homeScore:1,awayScore:2},76:{homeScore:0,awayScore:0},
  77:{homeScore:2,awayScore:0},78:{homeScore:2,awayScore:0},79:{homeScore:1,awayScore:0},
  80:{homeScore:4,awayScore:1},
  81:{homeScore:3,awayScore:1},82:{homeScore:3,awayScore:2},83:{homeScore:2,awayScore:0},
  84:{homeScore:2,awayScore:1},85:{homeScore:3,awayScore:0},86:{homeScore:3,awayScore:0},
  87:{homeScore:1,awayScore:1},88:{homeScore:1,awayScore:1},89:{homeScore:3,awayScore:0},
  90:{homeScore:0,awayScore:4},
};

// ─── Palpites iniciais (da planilha) ─────────────────────────────────────────
const KNOWN_PREDICTIONS = {
  tico: {
    1:{homeScore:2,awayScore:1},2:{homeScore:1,awayScore:0},3:{homeScore:1,awayScore:3},4:{homeScore:1,awayScore:0},5:{homeScore:1,awayScore:0},
    6:{homeScore:1,awayScore:0},7:{homeScore:2,awayScore:1},8:{homeScore:1,awayScore:1},9:{homeScore:0,awayScore:0},10:{homeScore:1,awayScore:0},
    11:{homeScore:2,awayScore:0},12:{homeScore:2,awayScore:0},13:{homeScore:1,awayScore:0},14:{homeScore:2,awayScore:0},15:{homeScore:1,awayScore:0},
    16:{homeScore:1,awayScore:0},17:{homeScore:1,awayScore:0},18:{homeScore:2,awayScore:1},19:{homeScore:1,awayScore:0},20:{homeScore:0,awayScore:1},
    21:{homeScore:1,awayScore:1},22:{homeScore:1,awayScore:2},23:{homeScore:2,awayScore:1},24:{homeScore:1,awayScore:0},25:{homeScore:1,awayScore:0},
    26:{homeScore:2,awayScore:0},27:{homeScore:1,awayScore:0},28:{homeScore:2,awayScore:1},29:{homeScore:1,awayScore:4},30:{homeScore:1,awayScore:0},
    31:{homeScore:2,awayScore:0},32:{homeScore:2,awayScore:0},33:{homeScore:0,awayScore:0},34:{homeScore:1,awayScore:0},35:{homeScore:1,awayScore:0},
    36:{homeScore:1,awayScore:0},37:{homeScore:1,awayScore:0},38:{homeScore:1,awayScore:0},
  },
  pedro: {
    1:{homeScore:1,awayScore:2},2:{homeScore:1,awayScore:2},3:{homeScore:1,awayScore:3},4:{homeScore:2,awayScore:0},5:{homeScore:1,awayScore:2},
    6:{homeScore:1,awayScore:2},7:{homeScore:2,awayScore:1},8:{homeScore:1,awayScore:2},9:{homeScore:1,awayScore:2},10:{homeScore:0,awayScore:2},
    11:{homeScore:3,awayScore:1},12:{homeScore:2,awayScore:0},13:{homeScore:2,awayScore:1},14:{homeScore:3,awayScore:1},15:{homeScore:2,awayScore:3},
    16:{homeScore:2,awayScore:1},17:{homeScore:2,awayScore:1},18:{homeScore:1,awayScore:2},19:{homeScore:1,awayScore:2},20:{homeScore:2,awayScore:1},
    21:{homeScore:2,awayScore:1},22:{homeScore:2,awayScore:2},23:{homeScore:1,awayScore:2},24:{homeScore:2,awayScore:0},25:{homeScore:1,awayScore:0},
    26:{homeScore:2,awayScore:1},27:{homeScore:1,awayScore:1},28:{homeScore:2,awayScore:1},29:{homeScore:1,awayScore:3},30:{homeScore:2,awayScore:1},
    31:{homeScore:3,awayScore:1},32:{homeScore:2,awayScore:1},33:{homeScore:1,awayScore:2},34:{homeScore:1,awayScore:2},35:{homeScore:1,awayScore:2},
    36:{homeScore:1,awayScore:2},37:{homeScore:2,awayScore:1},38:{homeScore:1,awayScore:2},
  },
  luquinhas: {
    1:{homeScore:1,awayScore:0},2:{homeScore:2,awayScore:1},3:{homeScore:0,awayScore:2},4:{homeScore:2,awayScore:1},5:{homeScore:3,awayScore:0},
    6:{homeScore:2,awayScore:1},7:{homeScore:0,awayScore:1},8:{homeScore:0,awayScore:0},9:{homeScore:0,awayScore:1},10:{homeScore:1,awayScore:1},
    11:{homeScore:2,awayScore:0},12:{homeScore:2,awayScore:0},13:{homeScore:0,awayScore:2},14:{homeScore:3,awayScore:1},15:{homeScore:1,awayScore:1},
    16:{homeScore:2,awayScore:0},17:{homeScore:1,awayScore:2},18:{homeScore:1,awayScore:1},19:{homeScore:1,awayScore:0},20:{homeScore:0,awayScore:2},
    21:{homeScore:1,awayScore:2},22:{homeScore:2,awayScore:0},23:{homeScore:1,awayScore:1},24:{homeScore:1,awayScore:1},25:{homeScore:1,awayScore:0},
    26:{homeScore:2,awayScore:0},27:{homeScore:0,awayScore:1},28:{homeScore:3,awayScore:1},29:{homeScore:0,awayScore:1},30:{homeScore:0,awayScore:1},
    31:{homeScore:2,awayScore:1},32:{homeScore:3,awayScore:1},33:{homeScore:2,awayScore:0},34:{homeScore:3,awayScore:1},35:{homeScore:0,awayScore:1},
    36:{homeScore:1,awayScore:1},37:{homeScore:2,awayScore:1},38:{homeScore:2,awayScore:1},
  },
  lazaro: {
    1:{homeScore:2,awayScore:0},2:{homeScore:1,awayScore:2},3:{homeScore:1,awayScore:2},4:{homeScore:2,awayScore:0},5:{homeScore:1,awayScore:2},
    6:{homeScore:1,awayScore:2},7:{homeScore:1,awayScore:1},8:{homeScore:2,awayScore:1},9:{homeScore:2,awayScore:0},10:{homeScore:1,awayScore:2},
    11:{homeScore:2,awayScore:0},12:{homeScore:3,awayScore:0},13:{homeScore:3,awayScore:0},14:{homeScore:3,awayScore:0},15:{homeScore:2,awayScore:1},
    16:{homeScore:3,awayScore:0},17:{homeScore:2,awayScore:1},18:{homeScore:2,awayScore:0},19:{homeScore:2,awayScore:1},20:{homeScore:0,awayScore:1},
    21:{homeScore:1,awayScore:0},22:{homeScore:1,awayScore:2},23:{homeScore:1,awayScore:0},24:{homeScore:2,awayScore:0},25:{homeScore:1,awayScore:0},
    26:{homeScore:3,awayScore:1},27:{homeScore:1,awayScore:2},28:{homeScore:2,awayScore:0},29:{homeScore:1,awayScore:3},30:{homeScore:2,awayScore:0},
    31:{homeScore:2,awayScore:0},32:{homeScore:2,awayScore:1},33:{homeScore:2,awayScore:1},34:{homeScore:2,awayScore:1},35:{homeScore:2,awayScore:1},
    36:{homeScore:1,awayScore:2},37:{homeScore:2,awayScore:0},38:{homeScore:2,awayScore:1},
  },
  vini: {
    1:{homeScore:2,awayScore:2},2:{homeScore:2,awayScore:1},3:{homeScore:0,awayScore:3},4:{homeScore:0,awayScore:0},5:{homeScore:0,awayScore:1},
    6:{homeScore:1,awayScore:1},7:{homeScore:2,awayScore:0},8:{homeScore:1,awayScore:1},9:{homeScore:0,awayScore:0},10:{homeScore:0,awayScore:1},
    11:{homeScore:2,awayScore:0},12:{homeScore:3,awayScore:1},13:{homeScore:2,awayScore:1},14:{homeScore:3,awayScore:0},15:{homeScore:1,awayScore:1},
    16:{homeScore:2,awayScore:1},17:{homeScore:2,awayScore:1},18:{homeScore:1,awayScore:0},19:{homeScore:2,awayScore:2},20:{homeScore:1,awayScore:1},
    21:{homeScore:2,awayScore:1},22:{homeScore:1,awayScore:0},23:{homeScore:2,awayScore:2},24:{homeScore:2,awayScore:1},25:{homeScore:1,awayScore:1},
    26:{homeScore:2,awayScore:0},27:{homeScore:0,awayScore:0},28:{homeScore:1,awayScore:1},29:{homeScore:0,awayScore:2},30:{homeScore:0,awayScore:1},
    31:{homeScore:2,awayScore:0},32:{homeScore:3,awayScore:0},33:{homeScore:2,awayScore:0},34:{homeScore:3,awayScore:1},35:{homeScore:2,awayScore:2},
    36:{homeScore:2,awayScore:2},37:{homeScore:2,awayScore:1},38:{homeScore:1,awayScore:1},
  },
  dane: {
    1:{homeScore:1,awayScore:0},2:{homeScore:1,awayScore:2},3:{homeScore:1,awayScore:2},4:{homeScore:1,awayScore:0},5:{homeScore:2,awayScore:1},
    6:{homeScore:1,awayScore:1},7:{homeScore:1,awayScore:0},8:{homeScore:2,awayScore:1},9:{homeScore:1,awayScore:0},10:{homeScore:1,awayScore:1},
    11:{homeScore:2,awayScore:0},12:{homeScore:1,awayScore:0},13:{homeScore:1,awayScore:1},14:{homeScore:2,awayScore:0},15:{homeScore:2,awayScore:1},
    16:{homeScore:2,awayScore:0},17:{homeScore:1,awayScore:1},18:{homeScore:1,awayScore:0},19:{homeScore:2,awayScore:1},20:{homeScore:0,awayScore:1},
    21:{homeScore:1,awayScore:1},22:{homeScore:0,awayScore:1},23:{homeScore:2,awayScore:1},24:{homeScore:1,awayScore:0},25:{homeScore:1,awayScore:1},
    26:{homeScore:2,awayScore:0},27:{homeScore:0,awayScore:1},28:{homeScore:1,awayScore:0},29:{homeScore:1,awayScore:2},30:{homeScore:0,awayScore:0},
    31:{homeScore:2,awayScore:0},32:{homeScore:2,awayScore:0},33:{homeScore:1,awayScore:0},34:{homeScore:2,awayScore:1},35:{homeScore:1,awayScore:0},
    36:{homeScore:1,awayScore:0},37:{homeScore:1,awayScore:1},38:{homeScore:1,awayScore:2},
  },
  alex: {
    1:{homeScore:2,awayScore:0},2:{homeScore:0,awayScore:1},3:{homeScore:0,awayScore:2},4:{homeScore:2,awayScore:0},5:{homeScore:1,awayScore:0},
    6:{homeScore:1,awayScore:1},7:{homeScore:1,awayScore:0},8:{homeScore:1,awayScore:1},9:{homeScore:1,awayScore:0},10:{homeScore:0,awayScore:1},
    11:{homeScore:3,awayScore:0},12:{homeScore:1,awayScore:0},13:{homeScore:1,awayScore:0},14:{homeScore:2,awayScore:1},15:{homeScore:1,awayScore:1},
    16:{homeScore:3,awayScore:0},17:{homeScore:1,awayScore:0},18:{homeScore:0,awayScore:0},19:{homeScore:0,awayScore:1},20:{homeScore:0,awayScore:2},
    21:{homeScore:2,awayScore:0},22:{homeScore:2,awayScore:1},23:{homeScore:1,awayScore:0},24:{homeScore:1,awayScore:2},25:{homeScore:1,awayScore:1},
    26:{homeScore:3,awayScore:1},27:{homeScore:1,awayScore:1},28:{homeScore:0,awayScore:1},29:{homeScore:0,awayScore:3},30:{homeScore:1,awayScore:2},
    31:{homeScore:1,awayScore:0},32:{homeScore:1,awayScore:0},33:{homeScore:1,awayScore:1},34:{homeScore:1,awayScore:1},35:{homeScore:2,awayScore:0},
    36:{homeScore:2,awayScore:1},37:{homeScore:0,awayScore:1},38:{homeScore:1,awayScore:2},
  },
};


// ─── Credenciais ─────────────────────────────────────────────────────────────
const CREDENTIALS = {
  tico: "4821", pedro: "7364", luquinhas: "2957",
  lazaro: "6138", vini: "5042", dane: "8716",
  alex: "3489", admin: "2026"
};
const PLAYERS = ["tico", "pedro", "luquinhas", "lazaro", "vini", "dane", "alex"];
const ADMIN = "admin";

// ─── Times do Brasileirão 2026 ───────────────────────────────────────────────
const TEAMS = [
  "Flamengo", "Palmeiras", "São Paulo", "Corinthians", "Fluminense",
  "Botafogo", "Atlético-MG", "Grêmio", "Internacional", "Santos",
  "Vasco", "Cruzeiro", "Athletico-PR", "Bahia", "Red Bull Bragantino",
  "Coritiba", "Mirassol", "Vitória", "Chapecoense", "Remo"
];

// Cores dos times
const TEAM_COLORS = {
  "Flamengo": "#E8002D", "Palmeiras": "#006B3F", "São Paulo": "#CC0000",
  "Corinthians": "#000000", "Fluminense": "#6B0F1A", "Botafogo": "#000000",
  "Atlético-MG": "#000000", "Grêmio": "#0060AF", "Internacional": "#CC0000",
  "Santos": "#000000", "Vasco": "#000000", "Cruzeiro": "#003DA5",
  "Athletico-PR": "#CC0000", "Bahia": "#0044AA", "Red Bull Bragantino": "#CC0000",
  "Coritiba": "#006400", "Mirassol": "#FFD700", "Vitória": "#CC0000",
  "Chapecoense": "#007A33", "Remo": "#003087"
};

// ─── 380 Jogos das 38 Rodadas ────────────────────────────────────────────────
const generateMatches = () => {
  const rawMatches = [
    // RODADA 1 (28-29/01)
    [1,"Fluminense","Grêmio","2026-01-29"],[1,"Botafogo","Cruzeiro","2026-01-29"],
    [1,"São Paulo","Flamengo","2026-01-28"],[1,"Corinthians","Bahia","2026-01-29"],
    [1,"Mirassol","Vasco","2026-01-29"],[1,"Atlético-MG","Palmeiras","2026-01-28"],
    [1,"Internacional","Athletico-PR","2026-01-29"],[1,"Coritiba","Red Bull Bragantino","2026-01-29"],
    [1,"Vitória","Remo","2026-01-29"],[1,"Chapecoense","Santos","2026-01-29"],
    // RODADA 2 (04-05/02)
    [2,"Flamengo","Internacional","2026-02-04"],[2,"Vasco","Chapecoense","2026-02-05"],
    [2,"Santos","São Paulo","2026-02-04"],[2,"Palmeiras","Vitória","2026-02-04"],
    [2,"Red Bull Bragantino","Atlético-MG","2026-02-05"],[2,"Cruzeiro","Coritiba","2026-02-04"],
    [2,"Grêmio","Botafogo","2026-02-04"],[2,"Athletico-PR","Corinthians","2026-02-05"],
    [2,"Bahia","Fluminense","2026-02-05"],[2,"Remo","Mirassol","2026-02-05"],
    // RODADA 3 (11-12/02)
    [3,"Fluminense","Botafogo","2026-02-11"],[3,"Vasco","Bahia","2026-02-12"],
    [3,"São Paulo","Grêmio","2026-02-11"],[3,"Corinthians","Red Bull Bragantino","2026-02-12"],
    [3,"Mirassol","Cruzeiro","2026-02-11"],[3,"Atlético-MG","Remo","2026-02-12"],
    [3,"Internacional","Palmeiras","2026-02-11"],[3,"Athletico-PR","Santos","2026-02-12"],
    [3,"Vitória","Flamengo","2026-02-11"],[3,"Chapecoense","Coritiba","2026-02-12"],
    // RODADA 4 (25-26/02)
    [4,"Flamengo","Mirassol","2026-02-25"],[4,"Botafogo","Vitória","2026-02-25"],
    [4,"Santos","Vasco","2026-02-25"],[4,"Palmeiras","Fluminense","2026-02-25"],
    [4,"Red Bull Bragantino","Athletico-PR","2026-02-25"],[4,"Cruzeiro","Corinthians","2026-02-25"],
    [4,"Grêmio","Atlético-MG","2026-02-26"],[4,"Coritiba","São Paulo","2026-02-26"],
    [4,"Bahia","Chapecoense","2026-02-26"],[4,"Remo","Internacional","2026-02-26"],
    // RODADA 5 (11-12/03)
    [5,"Flamengo","Cruzeiro","2026-03-11"],[5,"Vasco","Palmeiras","2026-03-12"],
    [5,"São Paulo","Chapecoense","2026-03-11"],[5,"Corinthians","Coritiba","2026-03-12"],
    [5,"Mirassol","Santos","2026-03-11"],[5,"Atlético-MG","Internacional","2026-03-11"],
    [5,"Grêmio","Red Bull Bragantino","2026-03-12"],[5,"Athletico-PR","Botafogo","2026-03-12"],
    [5,"Bahia","Vitória","2026-03-11"],[5,"Remo","Fluminense","2026-03-12"],
    // RODADA 6 (14-16/03)
    [6,"Fluminense","Athletico-PR","2026-03-14"],[6,"Botafogo","Flamengo","2026-03-15"],
    [6,"Santos","Corinthians","2026-03-14"],[6,"Palmeiras","Mirassol","2026-03-14"],
    [6,"Red Bull Bragantino","São Paulo","2026-03-14"],[6,"Cruzeiro","Vasco","2026-03-15"],
    [6,"Internacional","Bahia","2026-03-15"],[6,"Coritiba","Remo","2026-03-14"],
    [6,"Vitória","Atlético-MG","2026-03-15"],[6,"Chapecoense","Grêmio","2026-03-15"],
    // RODADA 7 (18-19/03)
    [7,"Flamengo","Remo","2026-03-18"],[7,"Vasco","Fluminense","2026-03-19"],
    [7,"Santos","Internacional","2026-03-18"],[7,"Palmeiras","Botafogo","2026-03-18"],
    [7,"Mirassol","Coritiba","2026-03-18"],[7,"Atlético-MG","São Paulo","2026-03-19"],
    [7,"Grêmio","Vitória","2026-03-19"],[7,"Athletico-PR","Cruzeiro","2026-03-18"],
    [7,"Bahia","Red Bull Bragantino","2026-03-19"],[7,"Chapecoense","Corinthians","2026-03-18"],
    // RODADA 8 (21-23/03)
    [8,"Fluminense","Atlético-MG","2026-03-21"],[8,"Vasco","Grêmio","2026-03-22"],
    [8,"São Paulo","Palmeiras","2026-03-21"],[8,"Corinthians","Flamengo","2026-03-22"],
    [8,"Red Bull Bragantino","Botafogo","2026-03-21"],[8,"Cruzeiro","Santos","2026-03-22"],
    [8,"Internacional","Chapecoense","2026-03-21"],[8,"Athletico-PR","Coritiba","2026-03-22"],
    [8,"Vitória","Mirassol","2026-03-22"],[8,"Remo","Bahia","2026-03-21"],
    // RODADA 9 (01-02/04)
    [9,"Fluminense","Corinthians","2026-04-01"],[9,"Botafogo","Mirassol","2026-04-01"],
    [9,"Santos","Remo","2026-04-02"],[9,"Palmeiras","Grêmio","2026-04-01"],
    [9,"Red Bull Bragantino","Flamengo","2026-04-01"],[9,"Cruzeiro","Vitória","2026-04-02"],
    [9,"Internacional","São Paulo","2026-04-01"],[9,"Coritiba","Vasco","2026-04-02"],
    [9,"Bahia","Athletico-PR","2026-04-02"],[9,"Chapecoense","Atlético-MG","2026-04-01"],
    // RODADA 10 (04-06/04)
    [10,"Flamengo","Santos","2026-04-05"],[10,"Vasco","Botafogo","2026-04-05"],
    [10,"São Paulo","Cruzeiro","2026-04-05"],[10,"Corinthians","Internacional","2026-04-05"],
    [10,"Mirassol","Red Bull Bragantino","2026-04-05"],[10,"Atlético-MG","Athletico-PR","2026-04-05"],
    [10,"Grêmio","Remo","2026-04-05"],[10,"Coritiba","Fluminense","2026-04-06"],
    [10,"Bahia","Palmeiras","2026-04-05"],[10,"Chapecoense","Vitória","2026-04-05"],
    // RODADA 11 (11-13/04)
    [11,"Fluminense","Flamengo","2026-04-11"],[11,"Botafogo","Coritiba","2026-04-12"],
    [11,"Santos","Atlético-MG","2026-04-11"],[11,"Corinthians","Palmeiras","2026-04-12"],
    [11,"Mirassol","Bahia","2026-04-11"],[11,"Cruzeiro","Red Bull Bragantino","2026-04-12"],
    [11,"Internacional","Grêmio","2026-04-12"],[11,"Athletico-PR","Chapecoense","2026-04-11"],
    [11,"Vitória","São Paulo","2026-04-11"],[11,"Remo","Vasco","2026-04-12"],
    // RODADA 12 (18-20/04)
    [12,"Flamengo","Bahia","2026-04-18"],[12,"Vasco","São Paulo","2026-04-19"],
    [12,"Santos","Fluminense","2026-04-18"],[12,"Palmeiras","Athletico-PR","2026-04-19"],
    [12,"Red Bull Bragantino","Remo","2026-04-18"],[12,"Cruzeiro","Grêmio","2026-04-18"],
    [12,"Internacional","Mirassol","2026-04-19"],[12,"Coritiba","Atlético-MG","2026-04-19"],
    [12,"Vitória","Corinthians","2026-04-18"],[12,"Chapecoense","Botafogo","2026-04-20"],
    // RODADA 13 (25-27/04)
    [13,"Fluminense","Chapecoense","2026-04-25"],[13,"Botafogo","Internacional","2026-04-26"],
    [13,"São Paulo","Mirassol","2026-04-25"],[13,"Corinthians","Vasco","2026-04-25"],
    [13,"Red Bull Bragantino","Palmeiras","2026-04-25"],[13,"Atlético-MG","Flamengo","2026-04-26"],
    [13,"Grêmio","Coritiba","2026-04-26"],[13,"Athletico-PR","Vitória","2026-04-25"],
    [13,"Bahia","Santos","2026-04-26"],[13,"Remo","Cruzeiro","2026-04-25"],
    // RODADA 14 (02-04/05)
    [14,"Flamengo","Vasco","2026-05-02"],[14,"Botafogo","Remo","2026-05-03"],
    [14,"São Paulo","Bahia","2026-05-02"],[14,"Palmeiras","Santos","2026-05-02"],
    [14,"Mirassol","Corinthians","2026-05-03"],[14,"Cruzeiro","Atlético-MG","2026-05-02"],
    [14,"Internacional","Fluminense","2026-05-03"],[14,"Athletico-PR","Grêmio","2026-05-02"],
    [14,"Vitória","Coritiba","2026-05-03"],[14,"Chapecoense","Red Bull Bragantino","2026-05-03"],
    // RODADA 15 (09-11/05)
    [15,"Fluminense","Vitória","2026-05-09"],[15,"Vasco","Athletico-PR","2026-05-10"],
    [15,"Santos","Red Bull Bragantino","2026-05-09"],[15,"Corinthians","São Paulo","2026-05-09"],
    [15,"Mirassol","Chapecoense","2026-05-09"],[15,"Atlético-MG","Botafogo","2026-05-10"],
    [15,"Grêmio","Flamengo","2026-05-10"],[15,"Coritiba","Internacional","2026-05-09"],
    [15,"Bahia","Cruzeiro","2026-05-10"],[15,"Remo","Palmeiras","2026-05-11"],
    // RODADA 16 (16-18/05)
    [16,"Fluminense","São Paulo","2026-05-16"],[16,"Botafogo","Corinthians","2026-05-17"],
    [16,"Santos","Coritiba","2026-05-16"],[16,"Palmeiras","Cruzeiro","2026-05-16"],
    [16,"Red Bull Bragantino","Vitória","2026-05-17"],[16,"Atlético-MG","Mirassol","2026-05-16"],
    [16,"Internacional","Vasco","2026-05-17"],[16,"Athletico-PR","Flamengo","2026-05-17"],
    [16,"Bahia","Grêmio","2026-05-16"],[16,"Chapecoense","Remo","2026-05-18"],
    // RODADA 17 (23-25/05)
    [17,"Flamengo","Palmeiras","2026-05-23"],[17,"Vasco","Red Bull Bragantino","2026-05-24"],
    [17,"São Paulo","Botafogo","2026-05-23"],[17,"Corinthians","Atlético-MG","2026-05-24"],
    [17,"Mirassol","Fluminense","2026-05-23"],[17,"Cruzeiro","Chapecoense","2026-05-23"],
    [17,"Grêmio","Santos","2026-05-24"],[17,"Coritiba","Bahia","2026-05-24"],
    [17,"Vitória","Internacional","2026-05-23"],[17,"Remo","Athletico-PR","2026-05-25"],
    // RODADA 18 (30/05-01/06)
    [18,"Flamengo","Coritiba","2026-05-30"],[18,"Vasco","Atlético-MG","2026-05-31"],
    [18,"Santos","Vitória","2026-05-30"],[18,"Palmeiras","Chapecoense","2026-05-30"],
    [18,"Red Bull Bragantino","Internacional","2026-05-31"],[18,"Cruzeiro","Fluminense","2026-05-30"],
    [18,"Grêmio","Corinthians","2026-05-31"],[18,"Athletico-PR","Mirassol","2026-05-31"],
    [18,"Bahia","Botafogo","2026-05-30"],[18,"Remo","São Paulo","2026-06-01"],
    // RODADA 19 (22-23/07)
    [19,"Fluminense","Red Bull Bragantino","2026-07-22"],[19,"Botafogo","Santos","2026-07-22"],
    [19,"São Paulo","Athletico-PR","2026-07-22"],[19,"Corinthians","Remo","2026-07-22"],
    [19,"Mirassol","Grêmio","2026-07-22"],[19,"Atlético-MG","Bahia","2026-07-23"],
    [19,"Internacional","Cruzeiro","2026-07-22"],[19,"Coritiba","Palmeiras","2026-07-23"],
    [19,"Vitória","Vasco","2026-07-23"],[19,"Chapecoense","Flamengo","2026-07-22"],
    // RODADA 20 (25-27/07)
    [20,"Flamengo","São Paulo","2026-07-25"],[20,"Vasco","Mirassol","2026-07-26"],
    [20,"Santos","Chapecoense","2026-07-25"],[20,"Palmeiras","Atlético-MG","2026-07-25"],
    [20,"Red Bull Bragantino","Coritiba","2026-07-26"],[20,"Cruzeiro","Botafogo","2026-07-25"],
    [20,"Grêmio","Fluminense","2026-07-26"],[20,"Athletico-PR","Internacional","2026-07-26"],
    [20,"Bahia","Corinthians","2026-07-25"],[20,"Remo","Vitória","2026-07-27"],
    // RODADA 21 (29-30/07)
    [21,"Fluminense","Bahia","2026-07-29"],[21,"Botafogo","Grêmio","2026-07-29"],
    [21,"São Paulo","Santos","2026-07-29"],[21,"Corinthians","Athletico-PR","2026-07-30"],
    [21,"Mirassol","Remo","2026-07-29"],[21,"Atlético-MG","Red Bull Bragantino","2026-07-30"],
    [21,"Internacional","Flamengo","2026-07-29"],[21,"Coritiba","Cruzeiro","2026-07-30"],
    [21,"Vitória","Palmeiras","2026-07-30"],[21,"Chapecoense","Vasco","2026-07-29"],
    // RODADA 22 (08-10/08)
    [22,"Flamengo","Vitória","2026-08-08"],[22,"Botafogo","Fluminense","2026-08-09"],
    [22,"Santos","Athletico-PR","2026-08-08"],[22,"Palmeiras","Internacional","2026-08-08"],
    [22,"Red Bull Bragantino","Corinthians","2026-08-09"],[22,"Cruzeiro","Mirassol","2026-08-08"],
    [22,"Grêmio","São Paulo","2026-08-08"],[22,"Coritiba","Chapecoense","2026-08-09"],
    [22,"Bahia","Vasco","2026-08-10"],[22,"Remo","Atlético-MG","2026-08-09"],
    // RODADA 23 (15-17/08)
    [23,"Fluminense","Palmeiras","2026-08-15"],[23,"Vasco","Santos","2026-08-16"],
    [23,"São Paulo","Coritiba","2026-08-15"],[23,"Corinthians","Cruzeiro","2026-08-15"],
    [23,"Mirassol","Flamengo","2026-08-15"],[23,"Atlético-MG","Grêmio","2026-08-16"],
    [23,"Internacional","Remo","2026-08-16"],[23,"Athletico-PR","Red Bull Bragantino","2026-08-15"],
    [23,"Vitória","Botafogo","2026-08-16"],[23,"Chapecoense","Bahia","2026-08-17"],
    // RODADA 24 (22-24/08)
    [24,"Fluminense","Remo","2026-08-22"],[24,"Botafogo","Athletico-PR","2026-08-22"],
    [24,"Santos","Mirassol","2026-08-22"],[24,"Palmeiras","Vasco","2026-08-23"],
    [24,"Red Bull Bragantino","Grêmio","2026-08-22"],[24,"Cruzeiro","Flamengo","2026-08-23"],
    [24,"Internacional","Atlético-MG","2026-08-22"],[24,"Coritiba","Corinthians","2026-08-23"],
    [24,"Vitória","Bahia","2026-08-23"],[24,"Chapecoense","São Paulo","2026-08-24"],
    // RODADA 25 (29-31/08)
    [25,"Flamengo","Botafogo","2026-08-29"],[25,"Vasco","Cruzeiro","2026-08-30"],
    [25,"São Paulo","Red Bull Bragantino","2026-08-29"],[25,"Corinthians","Santos","2026-08-29"],
    [25,"Mirassol","Palmeiras","2026-08-29"],[25,"Atlético-MG","Vitória","2026-08-30"],
    [25,"Grêmio","Chapecoense","2026-08-30"],[25,"Athletico-PR","Fluminense","2026-08-29"],
    [25,"Bahia","Internacional","2026-08-30"],[25,"Remo","Coritiba","2026-08-31"],
    // RODADA 26 (05-07/09)
    [26,"Fluminense","Vasco","2026-09-05"],[26,"Botafogo","Palmeiras","2026-09-06"],
    [26,"São Paulo","Atlético-MG","2026-09-05"],[26,"Corinthians","Chapecoense","2026-09-05"],
    [26,"Red Bull Bragantino","Bahia","2026-09-06"],[26,"Cruzeiro","Athletico-PR","2026-09-05"],
    [26,"Internacional","Santos","2026-09-06"],[26,"Coritiba","Mirassol","2026-09-05"],
    [26,"Vitória","Grêmio","2026-09-07"],[26,"Remo","Flamengo","2026-09-06"],
    // RODADA 27 (12-14/09)
    [27,"Flamengo","Corinthians","2026-09-12"],[27,"Botafogo","Red Bull Bragantino","2026-09-13"],
    [27,"Santos","Cruzeiro","2026-09-12"],[27,"Palmeiras","São Paulo","2026-09-13"],
    [27,"Mirassol","Vitória","2026-09-12"],[27,"Atlético-MG","Fluminense","2026-09-12"],
    [27,"Grêmio","Vasco","2026-09-13"],[27,"Coritiba","Athletico-PR","2026-09-13"],
    [27,"Bahia","Remo","2026-09-13"],[27,"Chapecoense","Internacional","2026-09-14"],
    // RODADA 28 (19-21/09)
    [28,"Flamengo","Red Bull Bragantino","2026-09-19"],[28,"Vasco","Coritiba","2026-09-20"],
    [28,"São Paulo","Internacional","2026-09-19"],[28,"Corinthians","Fluminense","2026-09-20"],
    [28,"Mirassol","Botafogo","2026-09-19"],[28,"Atlético-MG","Chapecoense","2026-09-19"],
    [28,"Grêmio","Palmeiras","2026-09-20"],[28,"Athletico-PR","Bahia","2026-09-20"],
    [28,"Vitória","Cruzeiro","2026-09-20"],[28,"Remo","Santos","2026-09-21"],
    // RODADA 29 (07-08/10)
    [29,"Fluminense","Coritiba","2026-10-07"],[29,"Botafogo","Vasco","2026-10-07"],
    [29,"Santos","Flamengo","2026-10-07"],[29,"Palmeiras","Bahia","2026-10-07"],
    [29,"Red Bull Bragantino","Mirassol","2026-10-07"],[29,"Cruzeiro","São Paulo","2026-10-07"],
    [29,"Internacional","Corinthians","2026-10-08"],[29,"Athletico-PR","Atlético-MG","2026-10-07"],
    [29,"Vitória","Chapecoense","2026-10-08"],[29,"Remo","Grêmio","2026-10-07"],
    // RODADA 30 (10-12/10)
    [30,"Flamengo","Fluminense","2026-10-10"],[30,"Vasco","Remo","2026-10-11"],
    [30,"São Paulo","Vitória","2026-10-10"],[30,"Palmeiras","Corinthians","2026-10-10"],
    [30,"Red Bull Bragantino","Cruzeiro","2026-10-11"],[30,"Atlético-MG","Santos","2026-10-10"],
    [30,"Grêmio","Internacional","2026-10-11"],[30,"Coritiba","Botafogo","2026-10-10"],
    [30,"Bahia","Mirassol","2026-10-12"],[30,"Chapecoense","Athletico-PR","2026-10-10"],
    // RODADA 31 (17-19/10)
    [31,"Fluminense","Santos","2026-10-17"],[31,"Botafogo","Chapecoense","2026-10-17"],
    [31,"São Paulo","Vasco","2026-10-17"],[31,"Corinthians","Vitória","2026-10-18"],
    [31,"Mirassol","Internacional","2026-10-17"],[31,"Atlético-MG","Coritiba","2026-10-17"],
    [31,"Grêmio","Cruzeiro","2026-10-18"],[31,"Athletico-PR","Palmeiras","2026-10-18"],
    [31,"Bahia","Flamengo","2026-10-18"],[31,"Remo","Red Bull Bragantino","2026-10-19"],
    // RODADA 32 (24-26/10)
    [32,"Flamengo","Atlético-MG","2026-10-24"],[32,"Vasco","Corinthians","2026-10-25"],
    [32,"Santos","Bahia","2026-10-24"],[32,"Palmeiras","Red Bull Bragantino","2026-10-24"],
    [32,"Mirassol","São Paulo","2026-10-24"],[32,"Cruzeiro","Remo","2026-10-25"],
    [32,"Internacional","Botafogo","2026-10-25"],[32,"Coritiba","Grêmio","2026-10-25"],
    [32,"Vitória","Athletico-PR","2026-10-25"],[32,"Chapecoense","Fluminense","2026-10-26"],
    // RODADA 33 (28-29/10)
    [33,"Fluminense","Internacional","2026-10-28"],[33,"Vasco","Flamengo","2026-10-28"],
    [33,"Santos","Palmeiras","2026-10-28"],[33,"Corinthians","Mirassol","2026-10-29"],
    [33,"Red Bull Bragantino","Chapecoense","2026-10-28"],[33,"Atlético-MG","Cruzeiro","2026-10-29"],
    [33,"Grêmio","Athletico-PR","2026-10-28"],[33,"Coritiba","Vitória","2026-10-29"],
    [33,"Bahia","São Paulo","2026-10-29"],[33,"Remo","Botafogo","2026-10-28"],
    // RODADA 34 (04-05/11)
    [34,"Flamengo","Grêmio","2026-11-04"],[34,"Botafogo","Atlético-MG","2026-11-04"],
    [34,"São Paulo","Corinthians","2026-11-04"],[34,"Palmeiras","Remo","2026-11-04"],
    [34,"Red Bull Bragantino","Santos","2026-11-05"],[34,"Cruzeiro","Bahia","2026-11-04"],
    [34,"Internacional","Coritiba","2026-11-05"],[34,"Athletico-PR","Vasco","2026-11-04"],
    [34,"Vitória","Fluminense","2026-11-05"],[34,"Chapecoense","Mirassol","2026-11-04"],
    // RODADA 35 (18-19/11)
    [35,"Flamengo","Athletico-PR","2026-11-18"],[35,"Vasco","Internacional","2026-11-18"],
    [35,"São Paulo","Fluminense","2026-11-18"],[35,"Corinthians","Botafogo","2026-11-19"],
    [35,"Mirassol","Atlético-MG","2026-11-18"],[35,"Cruzeiro","Palmeiras","2026-11-18"],
    [35,"Grêmio","Bahia","2026-11-19"],[35,"Coritiba","Santos","2026-11-18"],
    [35,"Vitória","Red Bull Bragantino","2026-11-19"],[35,"Remo","Chapecoense","2026-11-18"],
    // RODADA 36 (21-23/11)
    [36,"Fluminense","Mirassol","2026-11-21"],[36,"Botafogo","São Paulo","2026-11-22"],
    [36,"Santos","Grêmio","2026-11-21"],[36,"Palmeiras","Flamengo","2026-11-21"],
    [36,"Red Bull Bragantino","Vasco","2026-11-22"],[36,"Atlético-MG","Corinthians","2026-11-21"],
    [36,"Internacional","Vitória","2026-11-22"],[36,"Athletico-PR","Remo","2026-11-21"],
    [36,"Bahia","Coritiba","2026-11-22"],[36,"Chapecoense","Cruzeiro","2026-11-23"],
    // RODADA 37 (28-29/11... foi 04-05/11 mas vou usar datas corretas)
    [37,"Fluminense","Cruzeiro","2026-11-25"],[37,"Botafogo","Bahia","2026-11-25"],
    [37,"São Paulo","Remo","2026-11-25"],[37,"Corinthians","Grêmio","2026-11-25"],
    [37,"Mirassol","Athletico-PR","2026-11-25"],[37,"Atlético-MG","Vasco","2026-11-25"],
    [37,"Internacional","Red Bull Bragantino","2026-11-25"],[37,"Coritiba","Flamengo","2026-11-25"],
    [37,"Vitória","Santos","2026-11-25"],[37,"Chapecoense","Palmeiras","2026-11-25"],
    // RODADA 38 (02/12)
    [38,"Flamengo","Chapecoense","2026-12-02"],[38,"Vasco","Vitória","2026-12-02"],
    [38,"Santos","Coritiba","2026-12-02"],[38,"Palmeiras","Mirassol","2026-12-02"],
    [38,"Red Bull Bragantino","Athletico-PR","2026-12-02"],[38,"Cruzeiro","Internacional","2026-12-02"],
    [38,"Grêmio","Botafogo","2026-12-02"],[38,"Atlético-MG","Bahia","2026-12-02"],
    [38,"Corinthians","São Paulo","2026-12-02"],[38,"Fluminense","Remo","2026-12-02"],
  ];

  return rawMatches.map(([round, home, away, date], idx) => ({
    id: idx + 1,
    round,
    home,
    away,
    date,
    homeScore: null,
    awayScore: null,
  }));
};

const MATCHES = generateMatches();

// ─── Funções de Pontuação ────────────────────────────────────────────────────
const calcPoints = (pred, real) => {
  if (!real || real.homeScore === null || real.awayScore === null) return null;
  if (!pred || pred.homeScore === null || pred.awayScore === null) return 0;

  const rh = real.homeScore, ra = real.awayScore;
  const ph = pred.homeScore, pa = pred.awayScore;

  // Placar exato
  if (ph === rh && pa === ra) return 25;

  const realWinner = rh > ra ? "H" : ra > rh ? "A" : "D";
  const predWinner = ph > pa ? "H" : pa > ph ? "A" : "D";

  if (realWinner !== predWinner) return 0;

  // Vencedor certo + gols do vencedor
  if (realWinner === "H" && ph === rh) return 18;
  if (realWinner === "A" && pa === ra) return 18;
  if (realWinner === "D" && ph === rh && pa === ra) return 25; // já foi acima

  // Vencedor + saldo de gols
  if (rh - ra === ph - pa) return 15;

  // Vencedor + gols do perdedor
  if (realWinner === "H" && pa === ra) return 12;
  if (realWinner === "A" && ph === rh) return 12;
  if (realWinner === "D") return 12; // empate certo mas placar diferente

  // Só acertou o vencedor
  return 10;
};

// ─── Utils ───────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", weekday: "short" });
};

const isMatchLocked = (match) => {
  const matchTime = new Date(match.date + "T10:00:00"); // lock 10h antes do horário padrão
  return new Date() >= new Date(matchTime.getTime() - 5 * 60 * 1000);
};

// ─── Componente Principal ────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("jogos");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [results, setResults] = useState({});
  const [predictions, setPredictions] = useState({});
  const [allPredictions, setAllPredictions] = useState({});
  const [tableGuesses, setTableGuesses] = useState({});
  const [allTableGuesses, setAllTableGuesses] = useState({});
  const [champion, setChampion] = useState("");
  const [editingResult, setEditingResult] = useState({});
  const [filterRound, setFilterRound] = useState("all");
  const [savedLogin, setSavedLogin] = useState(null);

  // Recuperar login salvo
  useEffect(() => {
    const saved = localStorage.getItem("br26_saved_login");
    if (saved) setSavedLogin(JSON.parse(saved));
  }, []);

  // Firebase listeners
  useEffect(() => {
    const resultsRef = ref(db, "brasileirao2026/results");
    const predsRef = ref(db, "brasileirao2026/predictions");
    const tableRef = ref(db, "brasileirao2026/tableGuesses");
    const champRef = ref(db, "brasileirao2026/champion");

    onValue(resultsRef, (snap) => {
      if (snap.exists()) {
        setResults(snap.val());
      } else {
        set(resultsRef, KNOWN_RESULTS);
        setResults(KNOWN_RESULTS);
      }
    });
    onValue(predsRef, (snap) => {
      if (snap.exists()) {
        setAllPredictions(snap.val());
      } else {
        // Auto-seed predictions from spreadsheet
        set(predsRef, KNOWN_PREDICTIONS);
        setAllPredictions(KNOWN_PREDICTIONS);
      }
    });
    onValue(tableRef, (snap) => { if (snap.exists()) setAllTableGuesses(snap.val()); });
    onValue(champRef, (snap) => { if (snap.exists()) setChampion(snap.val()); });
  }, []);

  // Load user predictions
  useEffect(() => {
    if (user && allPredictions[user]) {
      setPredictions(allPredictions[user]);
    }
    if (user && allTableGuesses[user]) {
      setTableGuesses(allTableGuesses[user]);
    }
  }, [user, allPredictions, allTableGuesses]);

  const handleLogin = (u) => {
    const username = u || loginUser.toLowerCase().trim();
    const pass = loginPass.trim();
    if (CREDENTIALS[username] === pass) {
      setUser(username);
      setLoginError("");
      const loginData = { username, time: Date.now() };
      localStorage.setItem("br26_saved_login", JSON.stringify(loginData));
      setSavedLogin(loginData);
    } else {
      setLoginError("Usuário ou senha incorretos");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setLoginUser("");
    setLoginPass("");
  };

  const savePrediction = async (matchId, home, away) => {
    if (!user || user === ADMIN) return;
    const updated = { ...predictions, [matchId]: { homeScore: Number(home), awayScore: Number(away) } };
    setPredictions(updated);
    await set(ref(db, \`brasileirao2026/predictions/\${user}/\${matchId}\`), { homeScore: Number(home), awayScore: Number(away) });
  };

  const saveResult = async (matchId, home, away) => {
    if (user !== ADMIN) return;
    const updated = { ...results, [matchId]: { homeScore: Number(home), awayScore: Number(away) } };
    setResults(updated);
    await set(ref(db, \`brasileirao2026/results/\${matchId}\`), { homeScore: Number(home), awayScore: Number(away) });
  };

  const saveTableGuess = async (position, team) => {
    if (!user || user === ADMIN) return;
    const updated = { ...tableGuesses, [position]: team };
    setTableGuesses(updated);
    await set(ref(db, \`brasileirao2026/tableGuesses/\${user}/\${position}\`), team);
  };

  const saveChampion = async (team) => {
    if (user !== ADMIN) return;
    setChampion(team);
    await set(ref(db, \`brasileirao2026/champion\`), team);
  };

  // Calcular ranking
  const calculateRanking = () => {
    return PLAYERS.map((player) => {
      const preds = allPredictions[player] || {};
      const tGuess = allTableGuesses[player] || {};

      let points = 0;
      let exact = 0;
      let correct = 0;

      MATCHES.forEach((match) => {
        const real = results[match.id];
        const pred = preds[match.id];
        if (!real || real.homeScore === null) return;
        const pts = calcPoints(pred, real);
        if (pts > 0) {
          points += pts;
          if (pts === 25) exact++;
          if (pts >= 10) correct++;
        }
      });

      // Campeão
      let champPoints = 0;
      if (champion && tGuess[1] === champion) champPoints = 100;
      points += champPoints;

      // Palpites de tabela (posições certas)
      let tablePoints = 0;
      if (champion) {
        TEAMS.forEach((_, i) => {
          const pos = i + 1;
          // Verificamos posições acertadas com base na classificação final (quando disponível)
          // Por ora: posição 1 só se campeão correto (já contado)
        });
      }

      return { player, points, exact, correct, champPoints };
    }).sort((a, b) => b.points - a.points);
  };

  const ranking = calculateRanking();

  // ─── Tela de Login ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBg}>
          {/* Field lines SVG */}
          <svg style={styles.fieldSvg} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="400" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
            <circle cx="200" cy="200" r="80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
            <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <rect x="50" y="140" width="100" height="120" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
            <rect x="250" y="140" width="100" height="120" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
            <rect x="70" y="165" width="40" height="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            <rect x="290" y="165" width="40" height="70" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          </svg>
        </div>

        <div style={styles.loginCard}>
          {/* Logo Brasileirão */}
          <div style={styles.loginLogo}>
            <img src="/logo-brasileirao.png" alt="Brasileirão" style={{width:80,height:80,objectFit:"contain"}}
              onError={(e) => { e.target.style.display="none"; }}/>
            <div style={styles.loginTitle}>BOLÃO</div>
            <div style={styles.loginSubtitle}>BRASILEIRÃO SÉRIE A 2026</div>
          </div>

          {savedLogin && (
            <div style={styles.welcomeBack}>
              <p style={{margin:"0 0 10px",color:"#aaa",fontSize:13}}>Bem-vindo de volta!</p>
              <button style={styles.btnWelcome} onClick={() => {
                setLoginUser(savedLogin.username);
                setLoginPass(CREDENTIALS[savedLogin.username]);
                handleLogin(savedLogin.username);
              }}>
                Entrar como <strong>{savedLogin.username}</strong>
              </button>
              <p style={{margin:"12px 0 0",color:"#666",fontSize:12,cursor:"pointer"}}
                onClick={() => setSavedLogin(null)}>Trocar conta</p>
            </div>
          )}

          {!savedLogin && (
            <>
              <input
                style={styles.input} type="text" placeholder="Usuário"
                value={loginUser} onChange={e => setLoginUser(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              <input
                style={styles.input} type="password" placeholder="Senha"
                value={loginPass} onChange={e => setLoginPass(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
              />
              {loginError && <p style={styles.error}>{loginError}</p>}
              <button style={styles.btnLogin} onClick={() => handleLogin()}>Entrar</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ─── App Principal ──────────────────────────────────────────────────────────
  const rounds = [1,...Array.from({length:38},(_,i)=>i+1)];
  const currentRound = Math.max(...MATCHES.filter(m => results[m.id] !== undefined && results[m.id] !== null).map(m => m.round), 1);
  const displayRound = filterRound === "all" ? "all" : Number(filterRound);
  const filteredMatches = displayRound === "all" ? MATCHES : MATCHES.filter(m => m.round === displayRound);

  return (
    <div style={styles.app}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerTitle}>⚽ Bolão Brasileirão 2026</div>
          <div style={styles.headerUser}>{user === ADMIN ? "👑 Admin" : \`@\${user}\`}</div>
        </div>
        <button style={styles.btnLogout} onClick={handleLogout}>Sair</button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          {id:"jogos", label:"🗓 Jogos"},
          {id:"ranking", label:"🏆 Ranking"},
          {id:"tabela", label:"📊 Tabela Final"},
          ...(user === ADMIN ? [{id:"admin", label:"⚙️ Admin"}] : []),
        ].map(t => (
          <button key={t.id} style={{...styles.tab, ...(tab===t.id ? styles.tabActive : {})}}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={styles.content}>

        {/* ── JOGOS ────────────────────────────────────────────────────────── */}
        {tab === "jogos" && (
          <div>
            {/* Filtro de Rodada */}
            <div style={styles.roundFilter}>
              <select style={styles.select} value={filterRound} onChange={e => setFilterRound(e.target.value)}>
                <option value="all">Todas as Rodadas</option>
                {Array.from({length:38},(_,i)=>i+1).map(r => (
                  <option key={r} value={r}>Rodada {r}</option>
                ))}
              </select>
            </div>

            {/* Agrupar por rodada */}
            {Array.from(new Set(filteredMatches.map(m => m.round))).map(round => (
              <div key={round} style={styles.roundGroup}>
                <div style={styles.roundHeader}>
                  <span>Rodada {round}</span>
                  <span style={{fontSize:12,opacity:.7}}>
                    {formatDate(filteredMatches.find(m=>m.round===round)?.date || "")}
                  </span>
                </div>

                {filteredMatches.filter(m => m.round === round).map(match => {
                  const real = results[match.id];
                  const userPred = predictions[match.id];
                  const locked = isMatchLocked(match);
                  const pts = user !== ADMIN ? calcPoints(userPred, real) : null;

                  return (
                    <MatchCard
                      key={match.id}
                      match={match}
                      real={real}
                      userPred={userPred}
                      locked={locked}
                      pts={pts}
                      isAdmin={user === ADMIN}
                      onSavePred={savePrediction}
                      onSaveResult={saveResult}
                      allPredictions={allPredictions}
                      players={PLAYERS}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* ── RANKING ──────────────────────────────────────────────────────── */}
        {tab === "ranking" && (
          <div>
            <div style={styles.rankingCard}>
              <div style={styles.rankingHeader}>
                <span style={{flex:.5,fontWeight:700,color:"#888"}}>#</span>
                <span style={{flex:2,fontWeight:700,color:"#888"}}>Jogador</span>
                <span style={{flex:1,fontWeight:700,color:"#888",textAlign:"center"}}>Pts</span>
                <span style={{flex:1,fontWeight:700,color:"#888",textAlign:"center"}}>Exatos</span>
                <span style={{flex:1,fontWeight:700,color:"#888",textAlign:"center"}}>Acertos</span>
              </div>
              {ranking.map((r, i) => (
                <div key={r.player} style={{
                  ...styles.rankingRow,
                  background: r.player === user ? "rgba(0,200,100,0.08)" : "transparent",
                  borderLeft: r.player === user ? "3px solid #00c864" : "3px solid transparent",
                }}>
                  <span style={{flex:.5,fontWeight:700,fontSize:18,color:i===0?"#FFD700":i===1?"#C0C0C0":i===2?"#CD7F32":"#666"}}>
                    {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
                  </span>
                  <span style={{flex:2,fontWeight:600,color:"#fff",fontSize:15,textTransform:"capitalize"}}>{r.player}</span>
                  <span style={{flex:1,textAlign:"center",fontWeight:700,fontSize:18,color:"#00c864"}}>{r.points}</span>
                  <span style={{flex:1,textAlign:"center",color:"#aaa"}}>{r.exact}</span>
                  <span style={{flex:1,textAlign:"center",color:"#aaa"}}>{r.correct}</span>
                </div>
              ))}
            </div>

            {/* Comparativo de palpites por jogo */}
            <div style={{marginTop:20}}>
              <h3 style={{color:"#fff",padding:"0 16px"}}>Comparativo de Palpites</h3>
              {MATCHES.filter(m => results[m.id] && results[m.id].homeScore !== null)
                .slice(-20).reverse().map(match => {
                const real = results[match.id];
                return (
                  <div key={match.id} style={styles.compareCard}>
                    <div style={styles.compareHeader}>
                      <span style={{color:"#888",fontSize:12}}>R{match.round}</span>
                      <span style={{color:"#fff",fontWeight:600,fontSize:13}}>
                        {match.home} {real.homeScore} × {real.awayScore} {match.away}
                      </span>
                    </div>
                    <div style={styles.compareRow}>
                      {PLAYERS.map(p => {
                        const pred = allPredictions[p]?.[match.id];
                        const pts = calcPoints(pred, real);
                        return (
                          <div key={p} style={{...styles.comparePlayer, background: pts===25?"#00c864":pts>=15?"#3b82f6":pts>=10?"#f59e0b":pts>0?"#6b7280":"#1a1a1a"}}>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",textTransform:"capitalize"}}>{p}</div>
                            <div style={{fontWeight:700,color:"#fff",fontSize:13}}>
                              {pred ? \`\${pred.homeScore}-\${pred.awayScore}\` : "-"}
                            </div>
                            <div style={{fontSize:11,color:"rgba(255,255,255,0.9)",fontWeight:600}}>
                              {pts !== null ? \`\${pts}pts\` : "-"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TABELA FINAL ─────────────────────────────────────────────────── */}
        {tab === "tabela" && (
          <div style={{padding:"0 8px"}}>
            <div style={styles.card}>
              <h3 style={{color:"#fff",margin:"0 0 16px"}}>
                🏆 Palpite: Classificação Final
              </h3>
              <p style={{color:"#888",fontSize:13,margin:"0 0 16px"}}>
                Acerte cada posição e ganhe 10 pts por colocação correta + 100 pts se acertar o campeão!
              </p>

              {user !== ADMIN ? (
                <div>
                  {TEAMS.map((_, i) => {
                    const pos = i + 1;
                    return (
                      <div key={pos} style={styles.tableRow}>
                        <div style={styles.tablePos}>
                          {pos <= 4 ? "🟢" : pos >= 17 ? "🔴" : "⚪"} {pos}º
                        </div>
                        <select
                          style={styles.tableSelect}
                          value={tableGuesses[pos] || ""}
                          onChange={e => saveTableGuess(pos, e.target.value)}
                        >
                          <option value="">-- Escolha --</option>
                          {TEAMS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <p style={{color:"#888",fontSize:13}}>Palpites de tabela dos jogadores:</p>
                  {PLAYERS.map(p => (
                    <div key={p} style={{marginBottom:16}}>
                      <div style={{color:"#fff",fontWeight:600,textTransform:"capitalize",marginBottom:6}}>{p}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                        {TEAMS.map((_,i) => {
                          const guess = allTableGuesses[p]?.[i+1];
                          return (
                            <div key={i} style={{...styles.tableChip, background: i===0&&guess===champion?"#FFD700":i<4?"#1a3a1a":i>=16?"#3a1a1a":"#1a1a2e"}}>
                              <span style={{color:"#888",fontSize:10}}>{i+1}º</span>
                              <span style={{color:"#fff",fontSize:12}}>{guess||"—"}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ADMIN ────────────────────────────────────────────────────────── */}
        {tab === "admin" && user === ADMIN && (
          <div style={{padding:"0 8px"}}>
            <div style={styles.card}>
              <h3 style={{color:"#fff",margin:"0 0 16px"}}>⚙️ Painel Admin</h3>

              {/* Campeão */}
              <div style={{marginBottom:24}}>
                <label style={{color:"#aaa",fontSize:13,display:"block",marginBottom:8}}>🏆 Campeão Final:</label>
                <select style={styles.select} value={champion} onChange={e => saveChampion(e.target.value)}>
                  <option value="">-- Ainda não definido --</option>
                  {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {champion && <p style={{color:"#FFD700",fontWeight:700,marginTop:8}}>🏆 Campeão: {champion}</p>}
              </div>

              {/* Resultados por rodada */}
              <h4 style={{color:"#fff",marginBottom:12}}>Inserir Resultados</h4>
              <div style={styles.roundFilter}>
                <select style={styles.select} value={filterRound} onChange={e => setFilterRound(e.target.value)}>
                  <option value="all">Todas as Rodadas</option>
                  {Array.from({length:38},(_,i)=>i+1).map(r => (
                    <option key={r} value={r}>Rodada {r}</option>
                  ))}
                </select>
              </div>

              {filteredMatches.map(match => {
                const real = results[match.id] || {};
                return (
                  <div key={match.id} style={styles.adminMatchRow}>
                    <span style={{color:"#888",fontSize:11}}>R{match.round}</span>
                    <span style={{color:"#fff",fontSize:13,flex:1,textAlign:"center"}}>
                      {match.home} × {match.away}
                    </span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <input type="number" min="0" max="20" style={styles.scoreInput}
                        value={editingResult[\`\${match.id}_h\`] ?? (real.homeScore ?? "")}
                        onChange={e => setEditingResult(p => ({...p,[\`\${match.id}_h\`]:e.target.value}))}
                      />
                      <span style={{color:"#fff"}}>×</span>
                      <input type="number" min="0" max="20" style={styles.scoreInput}
                        value={editingResult[\`\${match.id}_a\`] ?? (real.awayScore ?? "")}
                        onChange={e => setEditingResult(p => ({...p,[\`\${match.id}_a\`]:e.target.value}))}
                      />
                      <button style={styles.btnSave} onClick={() => {
                        const h = editingResult[\`\${match.id}_h\`] ?? real.homeScore;
                        const a = editingResult[\`\${match.id}_a\`] ?? real.awayScore;
                        if (h !== "" && h !== undefined && a !== "" && a !== undefined) {
                          saveResult(match.id, h, a);
                        }
                      }}>✓</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── Match Card Component ────────────────────────────────────────────────────
function MatchCard({ match, real, userPred, locked, pts, isAdmin, onSavePred, onSaveResult, allPredictions, players }) {
  const [ph, setPh] = useState(userPred?.homeScore ?? "");
  const [pa, setPa] = useState(userPred?.awayScore ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPh(userPred?.homeScore ?? "");
    setPa(userPred?.awayScore ?? "");
  }, [userPred]);

  const handleSave = () => {
    if (ph === "" || pa === "") return;
    onSavePred(match.id, ph, pa);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const hasResult = real && real.homeScore !== null && real.awayScore !== null;
  const hasPred = userPred && userPred.homeScore !== null;

  const ptColor = pts === 25 ? "#00c864" : pts >= 15 ? "#3b82f6" : pts >= 10 ? "#f59e0b" : pts > 0 ? "#ef4444" : "#666";

  return (
    <div style={{
      ...styles.matchCard,
      borderLeft: hasResult && pts !== null ? \`3px solid \${ptColor}\` : "3px solid #333",
    }}>
      <div style={styles.matchDate}>{formatDate(match.date)}</div>

      <div style={styles.matchMain}>
        {/* Time Casa */}
        <div style={styles.teamName}>
          <div style={{...styles.teamDot, background: TEAM_COLORS[match.home] || "#666"}} />
          {match.home}
        </div>

        {/* Placar */}
        <div style={styles.scoreArea}>
          {hasResult ? (
            <div style={styles.resultScore}>
              {real.homeScore} — {real.awayScore}
            </div>
          ) : !isAdmin ? (
            <div style={styles.predInputArea}>
              <input type="number" min="0" max="20" style={styles.predInput}
                value={ph} onChange={e => setPh(e.target.value)}
                disabled={locked}
              />
              <span style={{color:"#666"}}>×</span>
              <input type="number" min="0" max="20" style={styles.predInput}
                value={pa} onChange={e => setPa(e.target.value)}
                disabled={locked}
              />
              {!locked && (
                <button style={{...styles.btnSaveSmall, background: saved ? "#00c864" : "#3b82f6"}}
                  onClick={handleSave}>{saved ? "✓" : "💾"}</button>
              )}
            </div>
          ) : (
            <div style={{color:"#555",fontSize:12}}>—</div>
          )}
        </div>

        {/* Time Visitante */}
        <div style={{...styles.teamName, justifyContent:"flex-end"}}>
          {match.away}
          <div style={{...styles.teamDot, background: TEAM_COLORS[match.away] || "#666"}} />
        </div>
      </div>

      {/* Palpite do usuário + pontos */}
      {!isAdmin && (
        <div style={styles.matchFooter}>
          {hasPred ? (
            <span style={{color:"#666",fontSize:12}}>
              Seu palpite: {userPred.homeScore} × {userPred.awayScore}
            </span>
          ) : locked ? (
            <span style={{color:"#ef4444",fontSize:12}}>🔒 Encerrado</span>
          ) : (
            <span style={{color:"#888",fontSize:12}}>Sem palpite</span>
          )}
          {pts !== null && (
            <span style={{color: ptColor, fontWeight:700, fontSize:14}}>
              {pts === 25 ? "🎯 " : pts >= 10 ? "✅ " : "❌ "}{pts} pts
            </span>
          )}
        </div>
      )}

      {/* Mini palpites dos outros jogadores (quando resultado disponível) */}
      {hasResult && !isAdmin && (
        <div style={styles.miniPreds}>
          {players.filter(p => p !== "dane" || true).map(p => {
            const pred = allPredictions[p]?.[match.id];
            const ppts = calcPoints(pred, real);
            const pColor = ppts === 25 ? "#00c864" : ppts >= 15 ? "#3b82f6" : ppts >= 10 ? "#f59e0b" : ppts > 0 ? "#ef4444" : "#333";
            return (
              <div key={p} style={{...styles.miniPlayer, background: pColor + "22", border: \`1px solid \${pColor}33\`}}>
                <span style={{color:"#aaa",fontSize:10,textTransform:"capitalize"}}>{p}</span>
                <span style={{color:"#fff",fontSize:11,fontWeight:600}}>
                  {pred ? \`\${pred.homeScore}-\${pred.awayScore}\` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = {
  loginPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0a1628 0%, #0d2137 50%, #0a1628 100%)",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Segoe UI', sans-serif",
  },
  loginBg: {
    position: "absolute", inset: 0, opacity: 0.4,
    background: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)",
  },
  fieldSvg: {
    position: "absolute", width: "100%", height: "100%", top: 0, left: 0,
  },
  loginCard: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: "40px 32px",
    width: "100%",
    maxWidth: 360,
    position: "relative",
    zIndex: 1,
  },
  loginLogo: {
    textAlign: "center", marginBottom: 28,
    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
  },
  loginTitle: {
    fontSize: 28, fontWeight: 900, color: "#fff",
    letterSpacing: 6, fontFamily: "'Arial Black', sans-serif",
  },
  loginSubtitle: {
    fontSize: 11, color: "#22c55e", letterSpacing: 3, fontWeight: 700,
  },
  welcomeBack: { textAlign: "center" },
  btnWelcome: {
    background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px",
    fontSize: 15, cursor: "pointer", fontWeight: 600, width: "100%",
  },
  input: {
    width: "100%", padding: "13px 16px", marginBottom: 12,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10, color: "#fff", fontSize: 15, boxSizing: "border-box",
    outline: "none",
  },
  error: { color: "#ef4444", fontSize: 13, margin: "0 0 12px", textAlign: "center" },
  btnLogin: {
    width: "100%", padding: "14px", background: "linear-gradient(135deg, #22c55e, #16a34a)",
    color: "#fff", border: "none", borderRadius: 10, fontSize: 16, fontWeight: 700,
    cursor: "pointer", letterSpacing: 1,
  },
  app: {
    minHeight: "100vh",
    background: "#0d0d0d",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#fff",
    maxWidth: 600,
    margin: "0 auto",
  },
  header: {
    background: "linear-gradient(135deg, #064e2a, #0a6b38)",
    padding: "12px 16px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 100,
  },
  headerLeft: { display: "flex", flexDirection: "column" },
  headerTitle: { fontWeight: 800, fontSize: 16, color: "#fff" },
  headerUser: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  btnLogout: {
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer",
  },
  tabs: {
    display: "flex", background: "#111", borderBottom: "1px solid #222",
    overflowX: "auto",
  },
  tab: {
    flex: 1, padding: "12px 8px", background: "none", border: "none",
    color: "#666", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
    fontWeight: 600, transition: "all 0.2s",
  },
  tabActive: {
    color: "#22c55e", borderBottom: "2px solid #22c55e",
  },
  content: { padding: "0 0 80px" },
  roundFilter: { padding: "12px 16px" },
  select: {
    background: "#1a1a1a", border: "1px solid #333", color: "#fff",
    padding: "8px 12px", borderRadius: 8, fontSize: 14, width: "100%", cursor: "pointer",
  },
  roundGroup: { marginBottom: 4 },
  roundHeader: {
    background: "#111", padding: "8px 16px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    color: "#22c55e", fontWeight: 700, fontSize: 14, borderBottom: "1px solid #1a1a1a",
    position: "sticky", top: 58, zIndex: 10,
  },
  matchCard: {
    background: "#111", margin: "4px 8px", borderRadius: 10,
    padding: "12px 14px", border: "1px solid #1e1e1e",
  },
  matchDate: { color: "#555", fontSize: 11, marginBottom: 8 },
  matchMain: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
  },
  teamName: {
    flex: 1, fontSize: 13, fontWeight: 600, color: "#ddd",
    display: "flex", alignItems: "center", gap: 6,
  },
  teamDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  scoreArea: {
    display: "flex", justifyContent: "center", minWidth: 120,
  },
  resultScore: {
    fontSize: 20, fontWeight: 800, color: "#fff",
    background: "#1a1a1a", padding: "4px 16px", borderRadius: 8,
  },
  predInputArea: {
    display: "flex", alignItems: "center", gap: 4,
  },
  predInput: {
    width: 42, textAlign: "center", background: "#1a1a1a",
    border: "1px solid #333", color: "#fff", borderRadius: 6,
    padding: "5px 4px", fontSize: 16, fontWeight: 700,
  },
  btnSaveSmall: {
    padding: "5px 8px", border: "none", borderRadius: 6, cursor: "pointer",
    color: "#fff", fontSize: 14, fontWeight: 700,
  },
  matchFooter: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: 8, paddingTop: 8, borderTop: "1px solid #1a1a1a",
  },
  miniPreds: {
    display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8, paddingTop: 8,
    borderTop: "1px solid #1a1a1a",
  },
  miniPlayer: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "3px 8px", borderRadius: 6, gap: 1,
  },
  rankingCard: { padding: "8px 12px" },
  rankingHeader: {
    display: "flex", padding: "8px 12px", borderBottom: "1px solid #222",
    marginBottom: 4,
  },
  rankingRow: {
    display: "flex", alignItems: "center", padding: "12px",
    borderRadius: 8, marginBottom: 4, transition: "all 0.2s",
  },
  compareCard: {
    background: "#111", margin: "4px 8px", borderRadius: 10,
    padding: "10px 12px", marginBottom: 4,
  },
  compareHeader: {
    display: "flex", justifyContent: "space-between", marginBottom: 8,
  },
  compareRow: { display: "flex", flexWrap: "wrap", gap: 4 },
  comparePlayer: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "4px 10px", borderRadius: 8, minWidth: 60,
  },
  card: {
    background: "#111", borderRadius: 12, padding: 16, margin: 8,
  },
  tableRow: {
    display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
  },
  tablePos: { fontSize: 13, color: "#aaa", minWidth: 52 },
  tableSelect: {
    flex: 1, background: "#1a1a1a", border: "1px solid #333",
    color: "#fff", padding: "7px 10px", borderRadius: 8, fontSize: 13,
  },
  tableChip: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "3px 8px", borderRadius: 6, minWidth: 52, gap: 1,
  },
  adminMatchRow: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 0", borderBottom: "1px solid #1a1a1a",
  },
  scoreInput: {
    width: 40, textAlign: "center", background: "#1a1a1a",
    border: "1px solid #333", color: "#fff", borderRadius: 6,
    padding: "5px 4px", fontSize: 15, fontWeight: 700,
  },
  btnSave: {
    background: "#22c55e", border: "none", borderRadius: 6,
    color: "#fff", padding: "6px 10px", cursor: "pointer", fontWeight: 700,
  },
};
`;
fs.writeFileSync('C:\\Users\\User\\bolao-brasileirao-2026\\src\\App.jsx', content, 'utf8');
console.log('WRITE_DONE: ' + content.split('\n').length + ' lines');
