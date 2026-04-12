import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const PLAYERS = [
  { id:"tico",      name:"TICO"      },
  { id:"pedro",     name:"PEDRO IVO" },
  { id:"luquinhas", name:"LUQUINHAS" },
  { id:"lazaro",    name:"LAZARO"    },
  { id:"vini",      name:"VINI"      },
  { id:"dane",      name:"DANE"      },
  { id:"alex",      name:"ALEX"      },
];
const PASSWORDS = { tico:"4821", pedro:"7364", luquinhas:"2957", lazaro:"6138", vini:"5042", dane:"8716", alex:"3489" };
const ADMIN_PASS = "2026";
const ALL_IDS = PLAYERS.map(p => p.id);

// ─── FIREBASE ─────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:"AIzaSyD4t2feH3RN949T9K3XLnVThUKRrCsfOPw",
  authDomain:"bolao-brasileirao-2026-51b74.firebaseapp.com",
  databaseURL:"https://bolao-brasileirao-2026-51b74-default-rtdb.firebaseio.com",
  projectId:"bolao-brasileirao-2026-51b74",
  storageBucket:"bolao-brasileirao-2026-51b74.firebasestorage.app",
  messagingSenderId:"571312996480",
  appId:"1:571312996480:web:14f6e7c0502577707c6665"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);
const DB = {
  preds:    (pid) => ref(db, `preds/${pid}`),
  results:  ()    => ref(db, `results`),
  payments: ()    => ref(db, `payments`),
  champion: ()    => ref(db, `champion`),
  tableGuesses: (pid) => ref(db, `tableGuesses/${pid}`),
  finalTable: () => ref(db, `finalTable`),
};

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = {
  bg:"#0a0e1a", card:"#111827", card2:"#1a2235", border:"#1e2d45",
  accent:"#00d4aa", accent2:"#ff6b35",
  gold:"#ffd700", silver:"#c0c0c0", bronze:"#cd7f32",
  text:"#e2e8f0", muted:"#64748b",
  danger:"#ef4444", success:"#22c55e", warn:"#f59e0b",
};

// ─── TIMES ───────────────────────────────────────────────────────────────────
const TEAMS = [
  "Flamengo","Palmeiras","São Paulo","Corinthians","Fluminense",
  "Botafogo","Atlético-MG","Grêmio","Internacional","Santos",
  "Vasco","Cruzeiro","Athletico-PR","Bahia","Red Bull Bragantino",
  "Coritiba","Mirassol","Vitória","Chapecoense","Remo"
];
const TEAM_COLORS = {
  "Flamengo":"#E8002D","Palmeiras":"#006B3F","São Paulo":"#CC0000",
  "Corinthians":"#444","Fluminense":"#6B0F1A","Botafogo":"#444",
  "Atlético-MG":"#444","Grêmio":"#0060AF","Internacional":"#CC0000",
  "Santos":"#444","Vasco":"#444","Cruzeiro":"#003DA5",
  "Athletico-PR":"#CC0000","Bahia":"#0044AA","Red Bull Bragantino":"#CC0000",
  "Coritiba":"#006400","Mirassol":"#DAA520","Vitória":"#CC0000",
  "Chapecoense":"#007A33","Remo":"#003087"
};
const teamDot = (t) => ({ width:8, height:8, borderRadius:"50%", flexShrink:0, background:TEAM_COLORS[t]||"#555" });

// ─── JOGOS ───────────────────────────────────────────────────────────────────
const RAW = [
  [1,"Fluminense","Grêmio","2026-01-29"],[1,"Botafogo","Cruzeiro","2026-01-29"],
  [1,"São Paulo","Flamengo","2026-01-28"],[1,"Corinthians","Bahia","2026-01-29"],
  [1,"Mirassol","Vasco","2026-01-29"],[1,"Atlético-MG","Palmeiras","2026-01-28"],
  [1,"Internacional","Athletico-PR","2026-01-29"],[1,"Coritiba","Red Bull Bragantino","2026-01-29"],
  [1,"Vitória","Remo","2026-01-29"],[1,"Chapecoense","Santos","2026-01-29"],
  [2,"Flamengo","Internacional","2026-02-04"],[2,"Vasco","Chapecoense","2026-02-05"],
  [2,"Santos","São Paulo","2026-02-04"],[2,"Palmeiras","Vitória","2026-02-04"],
  [2,"Red Bull Bragantino","Atlético-MG","2026-02-05"],[2,"Cruzeiro","Coritiba","2026-02-04"],
  [2,"Grêmio","Botafogo","2026-02-04"],[2,"Athletico-PR","Corinthians","2026-02-05"],
  [2,"Bahia","Fluminense","2026-02-05"],[2,"Remo","Mirassol","2026-02-05"],
  [3,"Fluminense","Botafogo","2026-02-11"],[3,"Vasco","Bahia","2026-02-12"],
  [3,"São Paulo","Grêmio","2026-02-11"],[3,"Corinthians","Red Bull Bragantino","2026-02-12"],
  [3,"Mirassol","Cruzeiro","2026-02-11"],[3,"Atlético-MG","Remo","2026-02-12"],
  [3,"Internacional","Palmeiras","2026-02-11"],[3,"Athletico-PR","Santos","2026-02-12"],
  [3,"Vitória","Flamengo","2026-02-11"],[3,"Chapecoense","Coritiba","2026-02-12"],
  [4,"Flamengo","Mirassol","2026-02-25"],[4,"Botafogo","Vitória","2026-02-25"],
  [4,"Santos","Vasco","2026-02-25"],[4,"Palmeiras","Fluminense","2026-02-25"],
  [4,"Red Bull Bragantino","Athletico-PR","2026-02-25"],[4,"Cruzeiro","Corinthians","2026-02-25"],
  [4,"Grêmio","Atlético-MG","2026-02-26"],[4,"Coritiba","São Paulo","2026-02-26"],
  [4,"Bahia","Chapecoense","2026-02-26"],[4,"Remo","Internacional","2026-02-26"],
  [5,"Flamengo","Cruzeiro","2026-03-11"],[5,"Vasco","Palmeiras","2026-03-12"],
  [5,"São Paulo","Chapecoense","2026-03-11"],[5,"Corinthians","Coritiba","2026-03-12"],
  [5,"Mirassol","Santos","2026-03-11"],[5,"Atlético-MG","Internacional","2026-03-11"],
  [5,"Grêmio","Red Bull Bragantino","2026-03-12"],[5,"Athletico-PR","Botafogo","2026-03-12"],
  [5,"Bahia","Vitória","2026-03-11"],[5,"Remo","Fluminense","2026-03-12"],
  [6,"Fluminense","Athletico-PR","2026-03-14"],[6,"Botafogo","Flamengo","2026-03-15"],
  [6,"Santos","Corinthians","2026-03-14"],[6,"Palmeiras","Mirassol","2026-03-14"],
  [6,"Red Bull Bragantino","São Paulo","2026-03-14"],[6,"Cruzeiro","Vasco","2026-03-15"],
  [6,"Internacional","Bahia","2026-03-15"],[6,"Coritiba","Remo","2026-03-14"],
  [6,"Vitória","Atlético-MG","2026-03-15"],[6,"Chapecoense","Grêmio","2026-03-15"],
  [7,"Flamengo","Remo","2026-03-18"],[7,"Vasco","Fluminense","2026-03-19"],
  [7,"Santos","Internacional","2026-03-18"],[7,"Palmeiras","Botafogo","2026-03-18"],
  [7,"Mirassol","Coritiba","2026-03-18"],[7,"Atlético-MG","São Paulo","2026-03-19"],
  [7,"Grêmio","Vitória","2026-03-19"],[7,"Athletico-PR","Cruzeiro","2026-03-18"],
  [7,"Bahia","Red Bull Bragantino","2026-03-19"],[7,"Chapecoense","Corinthians","2026-03-18"],
  [8,"Fluminense","Atlético-MG","2026-03-21"],[8,"Vasco","Grêmio","2026-03-22"],
  [8,"São Paulo","Palmeiras","2026-03-21"],[8,"Corinthians","Flamengo","2026-03-22"],
  [8,"Red Bull Bragantino","Botafogo","2026-03-21"],[8,"Cruzeiro","Santos","2026-03-22"],
  [8,"Internacional","Chapecoense","2026-03-21"],[8,"Athletico-PR","Coritiba","2026-03-22"],
  [8,"Vitória","Mirassol","2026-03-22"],[8,"Remo","Bahia","2026-03-21"],
  [9,"Fluminense","Corinthians","2026-04-01"],[9,"Botafogo","Mirassol","2026-04-01"],
  [9,"Santos","Remo","2026-04-02"],[9,"Palmeiras","Grêmio","2026-04-01"],
  [9,"Red Bull Bragantino","Flamengo","2026-04-01"],[9,"Cruzeiro","Vitória","2026-04-02"],
  [9,"Internacional","São Paulo","2026-04-01"],[9,"Coritiba","Vasco","2026-04-02"],
  [9,"Bahia","Athletico-PR","2026-04-02"],[9,"Chapecoense","Atlético-MG","2026-04-01"],
  [10,"Flamengo","Santos","2026-04-05"],[10,"Vasco","Botafogo","2026-04-05"],
  [10,"São Paulo","Cruzeiro","2026-04-05"],[10,"Corinthians","Internacional","2026-04-05"],
  [10,"Mirassol","Red Bull Bragantino","2026-04-05"],[10,"Atlético-MG","Athletico-PR","2026-04-05"],
  [10,"Grêmio","Remo","2026-04-05"],[10,"Coritiba","Fluminense","2026-04-06"],
  [10,"Bahia","Palmeiras","2026-04-05"],[10,"Chapecoense","Vitória","2026-04-05"],
  [11,"Fluminense","Flamengo","2026-04-12","18:00"],[11,"Botafogo","Coritiba","2026-04-12","16:00"],
  [11,"Santos","Atlético-MG","2026-04-11","20:00"],[11,"Corinthians","Palmeiras","2026-04-12","18:30"],
  [11,"Mirassol","Bahia","2026-04-11","18:30"],[11,"Cruzeiro","Red Bull Bragantino","2026-04-12","18:30"],
  [11,"Internacional","Grêmio","2026-04-11","20:30"],[11,"Athletico-PR","Chapecoense","2026-04-12","11:00"],
  [11,"Vitória","São Paulo","2026-04-11","16:30"],[11,"Remo","Vasco","2026-04-11","16:30"],
  [12,"Flamengo","Bahia","2026-04-19","19:30"],[12,"Vasco","São Paulo","2026-04-18","18:30"],
  [12,"Santos","Fluminense","2026-04-19","16:00"],[12,"Palmeiras","Athletico-PR","2026-04-19","18:30"],
  [12,"Red Bull Bragantino","Remo","2026-04-19","18:30"],[12,"Cruzeiro","Grêmio","2026-04-18","20:30"],
  [12,"Internacional","Mirassol","2026-04-19","11:00"],[12,"Coritiba","Atlético-MG","2026-04-19","16:00"],
  [12,"Vitória","Corinthians","2026-04-18","20:00"],[12,"Chapecoense","Botafogo","2026-04-18","18:30"],
  [13,"Fluminense","Chapecoense","2026-04-26","20:30"],[13,"Botafogo","Internacional","2026-04-25","18:30"],
  [13,"São Paulo","Mirassol","2026-04-25","21:00"],[13,"Corinthians","Vasco","2026-04-26","16:00"],
  [13,"Red Bull Bragantino","Palmeiras","2026-04-26","18:30"],[13,"Atlético-MG","Flamengo","2026-04-26","20:30"],
  [13,"Grêmio","Coritiba","2026-04-26","16:00"],[13,"Athletico-PR","Vitória","2026-04-26","18:30"],
  [13,"Bahia","Santos","2026-04-25","18:30"],[13,"Remo","Cruzeiro","2026-04-25","18:30"],
  [14,"Flamengo","Vasco","2026-05-03","16:00"],[14,"Botafogo","Remo","2026-05-02","16:00"],
  [14,"São Paulo","Bahia","2026-05-03","16:00"],[14,"Palmeiras","Santos","2026-05-02","18:30"],
  [14,"Mirassol","Corinthians","2026-05-03","20:30"],[14,"Cruzeiro","Atlético-MG","2026-05-02","21:00"],
  [14,"Internacional","Fluminense","2026-05-03","18:30"],[14,"Athletico-PR","Grêmio","2026-05-02","20:30"],
  [14,"Vitória","Coritiba","2026-05-02","16:00"],[14,"Chapecoense","Red Bull Bragantino","2026-05-03","18:30"],
  [15,"Fluminense","Vitória","2026-05-09","18:00"],[15,"Vasco","Athletico-PR","2026-05-10","20:30"],
  [15,"Santos","Red Bull Bragantino","2026-05-10","18:30"],[15,"Corinthians","São Paulo","2026-05-10","18:30"],
  [15,"Mirassol","Chapecoense","2026-05-10","18:30"],[15,"Atlético-MG","Botafogo","2026-05-10","16:00"],
  [15,"Grêmio","Flamengo","2026-05-10","19:30"],[15,"Coritiba","Internacional","2026-05-09","16:00"],
  [15,"Bahia","Cruzeiro","2026-05-09","21:00"],[15,"Remo","Palmeiras","2026-05-10","16:00"],
  [16,"Fluminense","São Paulo","2026-05-16","20:30"],[16,"Botafogo","Corinthians","2026-05-17","16:00"],
  [16,"Santos","Coritiba","2026-05-17","11:00"],[16,"Palmeiras","Cruzeiro","2026-05-16","21:00"],
  [16,"Red Bull Bragantino","Vitória","2026-05-17","18:30"],[16,"Atlético-MG","Mirassol","2026-05-16","18:30"],
  [16,"Internacional","Vasco","2026-05-16","18:30"],[16,"Athletico-PR","Flamengo","2026-05-17","19:30"],
  [16,"Bahia","Grêmio","2026-05-17","16:00"],[16,"Chapecoense","Remo","2026-05-17","18:30"],
  [17,"Flamengo","Palmeiras","2026-05-23","21:00"],[17,"Vasco","Red Bull Bragantino","2026-05-24","20:30"],
  [17,"São Paulo","Botafogo","2026-05-23","17:00"],[17,"Corinthians","Atlético-MG","2026-05-24","18:30"],
  [17,"Mirassol","Fluminense","2026-05-23","19:00"],[17,"Cruzeiro","Chapecoense","2026-05-24","16:00"],
  [17,"Grêmio","Santos","2026-05-23","19:00"],[17,"Coritiba","Bahia","2026-05-25","20:00"],
  [17,"Vitória","Internacional","2026-05-23","17:00"],[17,"Remo","Athletico-PR","2026-05-24","16:00"],
  [18,"Flamengo","Coritiba","2026-05-30"],[18,"Vasco","Atlético-MG","2026-05-31"],
  [18,"Santos","Vitória","2026-05-30"],[18,"Palmeiras","Chapecoense","2026-05-30"],
  [18,"Red Bull Bragantino","Internacional","2026-05-31"],[18,"Cruzeiro","Fluminense","2026-05-30"],
  [18,"Grêmio","Corinthians","2026-05-31"],[18,"Athletico-PR","Mirassol","2026-05-31"],
  [18,"Bahia","Botafogo","2026-05-30"],[18,"Remo","São Paulo","2026-06-01"],
  [19,"Fluminense","Red Bull Bragantino","2026-07-22"],[19,"Botafogo","Santos","2026-07-22"],
  [19,"São Paulo","Athletico-PR","2026-07-22"],[19,"Corinthians","Remo","2026-07-22"],
  [19,"Mirassol","Grêmio","2026-07-22"],[19,"Atlético-MG","Bahia","2026-07-23"],
  [19,"Internacional","Cruzeiro","2026-07-22"],[19,"Coritiba","Palmeiras","2026-07-23"],
  [19,"Vitória","Vasco","2026-07-23"],[19,"Chapecoense","Flamengo","2026-07-22"],
  [20,"Flamengo","São Paulo","2026-07-25"],[20,"Vasco","Mirassol","2026-07-26"],
  [20,"Santos","Chapecoense","2026-07-25"],[20,"Palmeiras","Atlético-MG","2026-07-25"],
  [20,"Red Bull Bragantino","Coritiba","2026-07-26"],[20,"Cruzeiro","Botafogo","2026-07-25"],
  [20,"Grêmio","Fluminense","2026-07-26"],[20,"Athletico-PR","Internacional","2026-07-26"],
  [20,"Bahia","Corinthians","2026-07-25"],[20,"Remo","Vitória","2026-07-27"],
  [21,"Fluminense","Bahia","2026-07-29"],[21,"Botafogo","Grêmio","2026-07-29"],
  [21,"São Paulo","Santos","2026-07-29"],[21,"Corinthians","Athletico-PR","2026-07-30"],
  [21,"Mirassol","Remo","2026-07-29"],[21,"Atlético-MG","Red Bull Bragantino","2026-07-30"],
  [21,"Internacional","Flamengo","2026-07-29"],[21,"Coritiba","Cruzeiro","2026-07-30"],
  [21,"Vitória","Palmeiras","2026-07-30"],[21,"Chapecoense","Vasco","2026-07-29"],
  [22,"Flamengo","Vitória","2026-08-08"],[22,"Botafogo","Fluminense","2026-08-09"],
  [22,"Santos","Athletico-PR","2026-08-08"],[22,"Palmeiras","Internacional","2026-08-08"],
  [22,"Red Bull Bragantino","Corinthians","2026-08-09"],[22,"Cruzeiro","Mirassol","2026-08-08"],
  [22,"Grêmio","São Paulo","2026-08-08"],[22,"Coritiba","Chapecoense","2026-08-09"],
  [22,"Bahia","Vasco","2026-08-10"],[22,"Remo","Atlético-MG","2026-08-09"],
  [23,"Fluminense","Palmeiras","2026-08-15"],[23,"Vasco","Santos","2026-08-16"],
  [23,"São Paulo","Coritiba","2026-08-15"],[23,"Corinthians","Cruzeiro","2026-08-15"],
  [23,"Mirassol","Flamengo","2026-08-15"],[23,"Atlético-MG","Grêmio","2026-08-16"],
  [23,"Internacional","Remo","2026-08-16"],[23,"Athletico-PR","Red Bull Bragantino","2026-08-15"],
  [23,"Vitória","Botafogo","2026-08-16"],[23,"Chapecoense","Bahia","2026-08-17"],
  [24,"Fluminense","Remo","2026-08-22"],[24,"Botafogo","Athletico-PR","2026-08-22"],
  [24,"Santos","Mirassol","2026-08-22"],[24,"Palmeiras","Vasco","2026-08-23"],
  [24,"Red Bull Bragantino","Grêmio","2026-08-22"],[24,"Cruzeiro","Flamengo","2026-08-23"],
  [24,"Internacional","Atlético-MG","2026-08-22"],[24,"Coritiba","Corinthians","2026-08-23"],
  [24,"Vitória","Bahia","2026-08-23"],[24,"Chapecoense","São Paulo","2026-08-24"],
  [25,"Flamengo","Botafogo","2026-08-29"],[25,"Vasco","Cruzeiro","2026-08-30"],
  [25,"São Paulo","Red Bull Bragantino","2026-08-29"],[25,"Corinthians","Santos","2026-08-29"],
  [25,"Mirassol","Palmeiras","2026-08-29"],[25,"Atlético-MG","Vitória","2026-08-30"],
  [25,"Grêmio","Chapecoense","2026-08-30"],[25,"Athletico-PR","Fluminense","2026-08-29"],
  [25,"Bahia","Internacional","2026-08-30"],[25,"Remo","Coritiba","2026-08-31"],
  [26,"Fluminense","Vasco","2026-09-05"],[26,"Botafogo","Palmeiras","2026-09-06"],
  [26,"São Paulo","Atlético-MG","2026-09-05"],[26,"Corinthians","Chapecoense","2026-09-05"],
  [26,"Red Bull Bragantino","Bahia","2026-09-06"],[26,"Cruzeiro","Athletico-PR","2026-09-05"],
  [26,"Internacional","Santos","2026-09-06"],[26,"Coritiba","Mirassol","2026-09-05"],
  [26,"Vitória","Grêmio","2026-09-07"],[26,"Remo","Flamengo","2026-09-06"],
  [27,"Flamengo","Corinthians","2026-09-12"],[27,"Botafogo","Red Bull Bragantino","2026-09-13"],
  [27,"Santos","Cruzeiro","2026-09-12"],[27,"Palmeiras","São Paulo","2026-09-13"],
  [27,"Mirassol","Vitória","2026-09-12"],[27,"Atlético-MG","Fluminense","2026-09-12"],
  [27,"Grêmio","Vasco","2026-09-13"],[27,"Coritiba","Athletico-PR","2026-09-13"],
  [27,"Bahia","Remo","2026-09-13"],[27,"Chapecoense","Internacional","2026-09-14"],
  [28,"Flamengo","Red Bull Bragantino","2026-09-19"],[28,"Vasco","Coritiba","2026-09-20"],
  [28,"São Paulo","Internacional","2026-09-19"],[28,"Corinthians","Fluminense","2026-09-20"],
  [28,"Mirassol","Botafogo","2026-09-19"],[28,"Atlético-MG","Chapecoense","2026-09-19"],
  [28,"Grêmio","Palmeiras","2026-09-20"],[28,"Athletico-PR","Bahia","2026-09-20"],
  [28,"Vitória","Cruzeiro","2026-09-20"],[28,"Remo","Santos","2026-09-21"],
  [29,"Fluminense","Coritiba","2026-10-07"],[29,"Botafogo","Vasco","2026-10-07"],
  [29,"Santos","Flamengo","2026-10-07"],[29,"Palmeiras","Bahia","2026-10-07"],
  [29,"Red Bull Bragantino","Mirassol","2026-10-07"],[29,"Cruzeiro","São Paulo","2026-10-07"],
  [29,"Internacional","Corinthians","2026-10-08"],[29,"Athletico-PR","Atlético-MG","2026-10-07"],
  [29,"Vitória","Chapecoense","2026-10-08"],[29,"Remo","Grêmio","2026-10-07"],
  [30,"Flamengo","Fluminense","2026-10-10"],[30,"Vasco","Remo","2026-10-11"],
  [30,"São Paulo","Vitória","2026-10-10"],[30,"Palmeiras","Corinthians","2026-10-10"],
  [30,"Red Bull Bragantino","Cruzeiro","2026-10-11"],[30,"Atlético-MG","Santos","2026-10-10"],
  [30,"Grêmio","Internacional","2026-10-11"],[30,"Coritiba","Botafogo","2026-10-10"],
  [30,"Bahia","Mirassol","2026-10-12"],[30,"Chapecoense","Athletico-PR","2026-10-10"],
  [31,"Fluminense","Santos","2026-10-17"],[31,"Botafogo","Chapecoense","2026-10-17"],
  [31,"São Paulo","Vasco","2026-10-17"],[31,"Corinthians","Vitória","2026-10-18"],
  [31,"Mirassol","Internacional","2026-10-17"],[31,"Atlético-MG","Coritiba","2026-10-17"],
  [31,"Grêmio","Cruzeiro","2026-10-18"],[31,"Athletico-PR","Palmeiras","2026-10-18"],
  [31,"Bahia","Flamengo","2026-10-18"],[31,"Remo","Red Bull Bragantino","2026-10-19"],
  [32,"Flamengo","Atlético-MG","2026-10-24"],[32,"Vasco","Corinthians","2026-10-25"],
  [32,"Santos","Bahia","2026-10-24"],[32,"Palmeiras","Red Bull Bragantino","2026-10-24"],
  [32,"Mirassol","São Paulo","2026-10-24"],[32,"Cruzeiro","Remo","2026-10-25"],
  [32,"Internacional","Botafogo","2026-10-25"],[32,"Coritiba","Grêmio","2026-10-25"],
  [32,"Vitória","Athletico-PR","2026-10-25"],[32,"Chapecoense","Fluminense","2026-10-26"],
  [33,"Fluminense","Internacional","2026-10-28"],[33,"Vasco","Flamengo","2026-10-28"],
  [33,"Santos","Palmeiras","2026-10-28"],[33,"Corinthians","Mirassol","2026-10-29"],
  [33,"Red Bull Bragantino","Chapecoense","2026-10-28"],[33,"Atlético-MG","Cruzeiro","2026-10-29"],
  [33,"Grêmio","Athletico-PR","2026-10-28"],[33,"Coritiba","Vitória","2026-10-29"],
  [33,"Bahia","São Paulo","2026-10-29"],[33,"Remo","Botafogo","2026-10-28"],
  [34,"Flamengo","Grêmio","2026-11-04"],[34,"Botafogo","Atlético-MG","2026-11-04"],
  [34,"São Paulo","Corinthians","2026-11-04"],[34,"Palmeiras","Remo","2026-11-04"],
  [34,"Red Bull Bragantino","Santos","2026-11-05"],[34,"Cruzeiro","Bahia","2026-11-04"],
  [34,"Internacional","Coritiba","2026-11-05"],[34,"Athletico-PR","Vasco","2026-11-04"],
  [34,"Vitória","Fluminense","2026-11-05"],[34,"Chapecoense","Mirassol","2026-11-04"],
  [35,"Flamengo","Athletico-PR","2026-11-18"],[35,"Vasco","Internacional","2026-11-18"],
  [35,"São Paulo","Fluminense","2026-11-18"],[35,"Corinthians","Botafogo","2026-11-19"],
  [35,"Mirassol","Atlético-MG","2026-11-18"],[35,"Cruzeiro","Palmeiras","2026-11-18"],
  [35,"Grêmio","Bahia","2026-11-19"],[35,"Coritiba","Santos","2026-11-18"],
  [35,"Vitória","Red Bull Bragantino","2026-11-19"],[35,"Remo","Chapecoense","2026-11-18"],
  [36,"Fluminense","Mirassol","2026-11-21"],[36,"Botafogo","São Paulo","2026-11-22"],
  [36,"Santos","Grêmio","2026-11-21"],[36,"Palmeiras","Flamengo","2026-11-21"],
  [36,"Red Bull Bragantino","Vasco","2026-11-22"],[36,"Atlético-MG","Corinthians","2026-11-21"],
  [36,"Internacional","Vitória","2026-11-22"],[36,"Athletico-PR","Remo","2026-11-21"],
  [36,"Bahia","Coritiba","2026-11-22"],[36,"Chapecoense","Cruzeiro","2026-11-23"],
  [37,"Fluminense","Cruzeiro","2026-11-25"],[37,"Botafogo","Bahia","2026-11-25"],
  [37,"São Paulo","Remo","2026-11-25"],[37,"Corinthians","Grêmio","2026-11-25"],
  [37,"Mirassol","Athletico-PR","2026-11-25"],[37,"Atlético-MG","Vasco","2026-11-25"],
  [37,"Internacional","Red Bull Bragantino","2026-11-25"],[37,"Coritiba","Flamengo","2026-11-25"],
  [37,"Vitória","Santos","2026-11-25"],[37,"Chapecoense","Palmeiras","2026-11-25"],
  [38,"Flamengo","Chapecoense","2026-12-02"],[38,"Vasco","Vitória","2026-12-02"],
  [38,"Santos","Coritiba","2026-12-02"],[38,"Palmeiras","Mirassol","2026-12-02"],
  [38,"Red Bull Bragantino","Athletico-PR","2026-12-02"],[38,"Cruzeiro","Internacional","2026-12-02"],
  [38,"Grêmio","Botafogo","2026-12-02"],[38,"Atlético-MG","Bahia","2026-12-02"],
  [38,"Corinthians","São Paulo","2026-12-02"],[38,"Fluminense","Remo","2026-12-02"],
];
const MATCHES = RAW.map(([round,home,away,date,time],idx) => ({ id:idx+1, round, home, away, date, time:time||"16:00" }));
const matchesByRound = {};
MATCHES.forEach(m => { if(!matchesByRound[m.round]) matchesByRound[m.round]=[];  matchesByRound[m.round].push(m); });
const ROUNDS = Array.from({length:38},(_,i)=>i+1);

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmtDate = (d, time) => {
  const label = new Date(d+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"2-digit"});
  return time ? `${label} ${time}` : label;
};
const isLocked = m => {
  const [h, min] = (m.time || "16:00").split(":").map(Number);
  const [y, mo, d] = m.date.split("-").map(Number);
  const kickoff = new Date(y, mo-1, d, h, min, 0);
  return new Date() >= new Date(kickoff.getTime() - 5*60*1000);
};

function calcPts(pred, real) {
  if (!real || real.home==null || real.away==null || real.home==="" || real.away==="") return null;
  if (!pred || pred.home==null || pred.away==null || pred.home==="" || pred.away==="") return 0;
  const rh=+real.home, ra=+real.away, ph=+pred.home, pa=+pred.away;
  if (ph===rh && pa===ra) return 25;
  const rw = rh>ra?"H":ra>rh?"A":"D", pw = ph>pa?"H":pa>ph?"A":"D";
  if (rw!==pw) return 0;
  // Empate: acertou resultado mas gols diferentes = 10pts
  if (rw==="D") return 10;
  // Vitória do mandante (H): vencedor é home
  if (rw==="H") {
    if (ph===rh) return 18;           // acertou gols do vencedor (home)
    if (rh-ra===ph-pa) return 15;     // acertou saldo
    if (pa===ra) return 12;           // acertou gols do perdedor (away)
    return 10;
  }
  // Vitória do visitante (A): vencedor é away
  if (pa===ra) return 18;             // acertou gols do vencedor (away)
  if (rh-ra===ph-pa) return 15;       // acertou saldo
  if (ph===rh) return 12;             // acertou gols do perdedor (home)
  return 10;
}

// ─── PALPITES INICIAIS (planilha) ─────────────────────────────────────────────
const SEED_PREDS = {
  tico:{1:{home:2,away:1},2:{home:1,away:0},3:{home:1,away:3},4:{home:1,away:0},5:{home:1,away:0},6:{home:1,away:0},7:{home:2,away:1},8:{home:1,away:1},9:{home:0,away:0},10:{home:1,away:0},11:{home:2,away:0},12:{home:2,away:0},13:{home:1,away:0},14:{home:2,away:0},15:{home:1,away:0},16:{home:1,away:0},17:{home:1,away:0},18:{home:2,away:1},19:{home:1,away:0},20:{home:0,away:1},21:{home:1,away:1},22:{home:1,away:2},23:{home:2,away:1},24:{home:1,away:0},25:{home:1,away:0},26:{home:2,away:0},27:{home:1,away:0},28:{home:2,away:1},29:{home:1,away:4},30:{home:1,away:0},31:{home:2,away:0},32:{home:2,away:0},33:{home:0,away:0},34:{home:1,away:0},35:{home:1,away:0},36:{home:1,away:0},37:{home:1,away:0},38:{home:1,away:0}},
  pedro:{1:{home:1,away:2},2:{home:1,away:2},3:{home:1,away:3},4:{home:2,away:0},5:{home:1,away:2},6:{home:1,away:2},7:{home:2,away:1},8:{home:1,away:2},9:{home:1,away:2},10:{home:0,away:2},11:{home:3,away:1},12:{home:2,away:0},13:{home:2,away:1},14:{home:3,away:1},15:{home:2,away:3},16:{home:2,away:1},17:{home:2,away:1},18:{home:1,away:2},19:{home:1,away:2},20:{home:2,away:1},21:{home:2,away:1},22:{home:2,away:2},23:{home:1,away:2},24:{home:2,away:0},25:{home:1,away:0},26:{home:2,away:1},27:{home:1,away:1},28:{home:2,away:1},29:{home:1,away:3},30:{home:2,away:1},31:{home:3,away:1},32:{home:2,away:1},33:{home:1,away:2},34:{home:1,away:2},35:{home:1,away:2},36:{home:1,away:2},37:{home:2,away:1},38:{home:1,away:2}},
  luquinhas:{1:{home:1,away:0},2:{home:2,away:1},3:{home:0,away:2},4:{home:2,away:1},5:{home:3,away:0},6:{home:2,away:1},7:{home:0,away:1},8:{home:0,away:0},9:{home:0,away:1},10:{home:1,away:1},11:{home:2,away:0},12:{home:2,away:0},13:{home:0,away:2},14:{home:3,away:1},15:{home:1,away:1},16:{home:2,away:0},17:{home:1,away:2},18:{home:1,away:1},19:{home:1,away:0},20:{home:0,away:2},21:{home:1,away:2},22:{home:2,away:0},23:{home:1,away:1},24:{home:1,away:1},25:{home:1,away:0},26:{home:2,away:0},27:{home:0,away:1},28:{home:3,away:1},29:{home:0,away:1},30:{home:0,away:1},31:{home:2,away:1},32:{home:3,away:1},33:{home:2,away:0},34:{home:3,away:1},35:{home:0,away:1},36:{home:1,away:1},37:{home:2,away:1},38:{home:2,away:1}},
  lazaro:{1:{home:2,away:0},2:{home:1,away:2},3:{home:1,away:2},4:{home:2,away:0},5:{home:1,away:2},6:{home:1,away:2},7:{home:1,away:1},8:{home:2,away:1},9:{home:2,away:0},10:{home:1,away:2},11:{home:2,away:0},12:{home:3,away:0},13:{home:3,away:0},14:{home:3,away:0},15:{home:2,away:1},16:{home:3,away:0},17:{home:2,away:1},18:{home:2,away:0},19:{home:2,away:1},20:{home:0,away:1},21:{home:1,away:0},22:{home:1,away:2},23:{home:1,away:0},24:{home:2,away:0},25:{home:1,away:0},26:{home:3,away:1},27:{home:1,away:2},28:{home:2,away:0},29:{home:1,away:3},30:{home:2,away:0},31:{home:2,away:0},32:{home:2,away:1},33:{home:2,away:1},34:{home:2,away:1},35:{home:2,away:1},36:{home:1,away:2},37:{home:2,away:0},38:{home:2,away:1}},
  vini:{1:{home:2,away:2},2:{home:2,away:1},3:{home:0,away:3},4:{home:0,away:0},5:{home:0,away:1},6:{home:1,away:1},7:{home:2,away:0},8:{home:1,away:1},9:{home:0,away:0},10:{home:0,away:1},11:{home:2,away:0},12:{home:3,away:1},13:{home:2,away:1},14:{home:3,away:0},15:{home:1,away:1},16:{home:2,away:1},17:{home:2,away:1},18:{home:1,away:0},19:{home:2,away:2},20:{home:1,away:1},21:{home:2,away:1},22:{home:1,away:0},23:{home:2,away:2},24:{home:2,away:1},25:{home:1,away:1},26:{home:2,away:0},27:{home:0,away:0},28:{home:1,away:1},29:{home:0,away:2},30:{home:0,away:1},31:{home:2,away:0},32:{home:3,away:0},33:{home:2,away:0},34:{home:3,away:1},35:{home:2,away:2},36:{home:2,away:2},37:{home:2,away:1},38:{home:1,away:1}},
  dane:{}, // palpites do Dane vêm sempre do Firebase
  alex:{1:{home:2,away:0},2:{home:0,away:1},3:{home:0,away:2},4:{home:2,away:0},5:{home:1,away:0},6:{home:1,away:1},7:{home:1,away:0},8:{home:1,away:1},9:{home:1,away:0},10:{home:0,away:1},11:{home:3,away:0},12:{home:1,away:0},13:{home:1,away:0},14:{home:2,away:1},15:{home:1,away:1},16:{home:3,away:0},17:{home:1,away:0},18:{home:0,away:0},19:{home:0,away:1},20:{home:0,away:2},21:{home:2,away:0},22:{home:2,away:1},23:{home:1,away:0},24:{home:1,away:2},25:{home:1,away:1},26:{home:3,away:1},27:{home:1,away:1},28:{home:0,away:1},29:{home:0,away:3},30:{home:1,away:2},31:{home:1,away:0},32:{home:1,away:0},33:{home:1,away:1},34:{home:1,away:1},35:{home:2,away:0},36:{home:2,away:1},37:{home:0,away:1},38:{home:1,away:2}},
};


// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [player, setPlayer]   = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab]         = useState("jogos");
  const [activeRound, setActiveRound] = useState(10);
  const stripRef = useRef(null);
  const adminStripRef = useRef(null);

  const [loginName, setLoginName] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr]   = useState("");

  const [savedPreds, setSavedPreds]   = useState({});
  const [results, setResults]         = useState({});
  const [payments, setPayments]       = useState({});
  const [champion, setChampion]       = useState("");
  const [tableGuesses, setTableGuesses] = useState({});
  const [finalTable, setFinalTable]   = useState({});

  const [draftPreds, setDraftPreds] = useState({});
  const [saving, setSaving] = useState(false);
  const [sent, setSent]     = useState(false);

  // ── Firebase listeners ────────────────────────────────────────────────────
  useEffect(() => {
    onValue(DB.results(), snap => {
      if (!snap.exists()) { setResults({}); return; }
      const raw = snap.val();
      const normalized = {};
      Object.entries(raw).forEach(([k, v]) => { normalized[+k] = v; });
      setResults(normalized);
    });
    onValue(DB.payments(), snap => setPayments(snap.exists() ? snap.val() : {}));
    onValue(DB.champion(), snap => setChampion(snap.exists() ? snap.val() : ""));
    onValue(DB.finalTable(), snap => {
      if (!snap.exists()) { setFinalTable({}); return; }
      const raw = snap.val();
      const normalized = {};
      Object.entries(raw).forEach(([k, v]) => { normalized[+k] = v; });
      setFinalTable(normalized);
    });
    ALL_IDS.forEach(pid => {
      onValue(DB.preds(pid), snap => {
        if (!snap.exists()) { setSavedPreds(prev => ({ ...prev, [pid]: {} })); return; }
        // Normalizar chaves para número (Firebase retorna strings)
        const raw = snap.val();
        const normalized = {};
        Object.entries(raw).forEach(([k, v]) => { normalized[+k] = v; });
        setSavedPreds(prev => ({ ...prev, [pid]: normalized }));
      });
      onValue(DB.tableGuesses(pid), snap => {
        if (!snap.exists()) { setTableGuesses(prev => ({ ...prev, [pid]: {} })); return; }
        const raw = snap.val();
        const normalized = {};
        Object.entries(raw).forEach(([k, v]) => { normalized[+k] = v; });
        setTableGuesses(prev => ({ ...prev, [pid]: normalized }));
      });
    });
  }, []);

  // Seed palpites se vazio
  // Sincronizar draftPreds com Firebase sempre que savedPreds mudar
  useEffect(() => {
    if (!player || isAdmin) return;
    const saved = savedPreds[player.id];
    if (saved && Object.keys(saved).length > 0) {
      setDraftPreds(saved);
    }
  }, [savedPreds[player?.id]]);

  // Ao fazer login, carrega SEED como placeholder enquanto Firebase não responde
  useEffect(() => {
    if (!player || isAdmin) return;
    const saved = savedPreds[player.id];
    if (!saved || Object.keys(saved).length === 0) {
      setDraftPreds(SEED_PREDS[player.id] || {});
    }
    setSent(false);
  }, [player?.id]);

  // Auto-navegar para a próxima rodada a realizar, baseado na data de hoje
  useEffect(() => {
    if (tab !== "jogos" || !player || isAdmin) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Próxima rodada = primeira rodada cujo primeiro jogo tem data >= hoje
    const nextRound = ROUNDS.find(r => {
      const firstDate = new Date(matchesByRound[r][0].date + "T12:00:00");
      return firstDate >= today;
    });
    const target = nextRound ?? 38;
    setActiveRound(target);
    setTimeout(() => {
      const el = stripRef.current?.querySelector(`[data-round="${target}"]`);
      el?.scrollIntoView({ inline:"center", behavior:"smooth" });
    }, 200);
  }, [tab, player?.id]);

  // Admin: auto-scroll para rodada atual na seção de resultados
  useEffect(() => {
    if (tab !== "admin" || !isAdmin) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const hasToday = ROUNDS.find(r => matchesByRound[r].some(m => {
      const d = new Date(m.date+"T12:00:00"); d.setHours(0,0,0,0);
      return d.getTime()===today.getTime();
    }));
    const nextRound = ROUNDS.find(r => {
      const d = new Date(matchesByRound[r][0].date+"T12:00:00"); return d >= today;
    });
    const target = hasToday ?? nextRound ?? 38;
    setActiveRound(target);
    setTimeout(() => {
      const el = adminStripRef.current?.querySelector(`[data-round="${target}"]`);
      el?.scrollIntoView({ inline:"center", behavior:"smooth" });
    }, 300);
  }, [tab, isAdmin]);

  // ── Auth ──────────────────────────────────────────────────────────────────
  function handleLogin() {
    setLoginErr("");
    const n = loginName.trim().toLowerCase();
    if (n==="admin" && loginPass.trim()===ADMIN_PASS) {
      try { localStorage.setItem("br26_user","admin"); localStorage.setItem("br26_pass",loginPass.trim()); } catch{}
      setIsAdmin(true); setPlayer({id:"admin",name:"ADMIN"}); setTab("admin"); return;
    }
    const found = PLAYERS.find(p => p.id===n && PASSWORDS[p.id]===loginPass.trim());
    if (found) {
      try { localStorage.setItem("br26_user",n); localStorage.setItem("br26_pass",loginPass.trim()); } catch{}
      setPlayer(found); setTab("jogos");
    } else setLoginErr("Usuário ou senha incorretos.");
  }
  function handleLogout() {
    setPlayer(null); setIsAdmin(false);
    setLoginName(""); setLoginPass(""); setLoginErr("");
    setDraftPreds({}); setSent(false);
  }

  // Auto-login salvo
  useEffect(() => {
    try {
      const u = localStorage.getItem("br26_user");
      const p = localStorage.getItem("br26_pass");
      if (!u || !p) return;
      if (u==="admin" && p===ADMIN_PASS) { setIsAdmin(true); setPlayer({id:"admin",name:"ADMIN"}); setTab("admin"); return; }
      const found = PLAYERS.find(pl => pl.id===u && PASSWORDS[pl.id]===p);
      if (found) { setPlayer(found); setTab("jogos"); }
    } catch {}
  }, []);

  async function handleSend() {
    if (!player || saving) return;
    setSaving(true);
    try {
      await set(DB.preds(player.id), draftPreds);
      setSent(true);
    } catch { alert("Erro ao salvar. Tente novamente."); }
    finally { setSaving(false); }
  }

  function setPred(matchId, field, val) {
    setSent(false);
    setDraftPreds(p => ({ ...p, [matchId]: { ...(p[matchId]||{}), [field]: val } }));
  }

  async function setResult(matchId, field, val) {
    const updated = { ...results, [matchId]: { ...(results[matchId]||{}), [field]: val } };
    setResults(updated);
    await set(DB.results(), updated);
  }

  async function setPayment(pid, status) {
    const updated = { ...payments, [pid]: status };
    setPayments(updated);
    await set(DB.payments(), updated);
  }

  async function setChampionTeam(team) {
    setChampion(team);
    await set(DB.champion(), team);
  }

  async function setFinalTablePos(pos, team) {
    const updated = { ...finalTable, [pos]: team };
    setFinalTable(updated);
    await set(DB.finalTable(), updated);
  }

  // ── Ranking ───────────────────────────────────────────────────────────────
  const ranking = PLAYERS.map(p => {
    const preds = savedPreds[p.id] || {};
    let pts=0, exact=0, correct=0, total=0;
    MATCHES.forEach(m => {
      const real = results[m.id];
      if (!real || real.home==null || real.home==="") return;
      total++;
      const pred = preds[m.id];
      const score = calcPts(pred, real);
      if (score > 0) { pts += score; if(score===25) exact++; if(score>=10) correct++; }
    });
    // Campeão
    const tg = tableGuesses[p.id] || {};
    // Campeão: 100pts se acertou o 1º lugar
    if (champion && tg[1]===champion) pts += 100;
    // Classificação real: 10pts por posição acertada
    Object.entries(tg).forEach(([pos, team]) => {
      if (finalTable[+pos] && finalTable[+pos]===team) pts += 10;
    });
    return { ...p, pts, exact, correct, total };
  }).sort((a,b) => b.pts-a.pts || b.exact-a.exact);

  // ── Login screen ──────────────────────────────────────────────────────────
  if (!player) {
    return (
      <div style={{ minHeight:"100vh", background:G.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Segoe UI',sans-serif", position:"relative", overflow:"hidden" }}>
        {/* Campo de futebol SVG */}
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:.07 }} viewBox="0 0 400 600">
          <rect x="20" y="20" width="360" height="560" fill="none" stroke="#00d4aa" strokeWidth="2"/>
          <line x1="20" y1="300" x2="380" y2="300" stroke="#00d4aa" strokeWidth="1"/>
          <circle cx="200" cy="300" r="60" fill="none" stroke="#00d4aa" strokeWidth="1"/>
          <rect x="100" y="20" width="200" height="80" fill="none" stroke="#00d4aa" strokeWidth="1"/>
          <rect x="100" y="500" width="200" height="80" fill="none" stroke="#00d4aa" strokeWidth="1"/>
          <rect x="150" y="20" width="100" height="35" fill="none" stroke="#00d4aa" strokeWidth="1"/>
          <rect x="150" y="545" width="100" height="35" fill="none" stroke="#00d4aa" strokeWidth="1"/>
        </svg>
        <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:20, padding:"36px 28px", width:"100%", maxWidth:340, position:"relative", zIndex:1, boxShadow:`0 20px 60px #00000066` }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:48, marginBottom:4 }}>🇧🇷</div>
            <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:24, fontWeight:900, color:G.text, letterSpacing:4 }}>BOLÃO</div>
            <div style={{ fontSize:10, color:G.accent, letterSpacing:3, fontWeight:700, marginTop:4 }}>BRASILEIRÃO SÉRIE A 2026</div>
          </div>
          {/* Salvo? */}
          {(() => {
            try {
              const u=localStorage.getItem("br26_user"), p=localStorage.getItem("br26_pass");
              if (u && p && (u==="admin" || PLAYERS.find(pl=>pl.id===u))) {
                const nm = u==="admin" ? "ADMIN" : PLAYERS.find(pl=>pl.id===u)?.name;
                return (
                  <div style={{ textAlign:"center", marginBottom:16 }}>
                    <div style={{ fontSize:12, color:G.muted, marginBottom:10 }}>Bem-vindo de volta!</div>
                    <button onClick={handleLogin} style={{ width:"100%", padding:"13px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${G.accent},#00b894)`, color:"#0a0e1a", fontSize:14, fontWeight:900, cursor:"pointer", letterSpacing:1 }}
                      onMouseEnter={() => { setLoginName(u); setLoginPass(p); }}>
                      ENTRAR COMO {nm}
                    </button>
                    <div style={{ fontSize:11, color:G.muted, marginTop:10, cursor:"pointer" }}
                      onClick={() => { try{localStorage.removeItem("br26_user");localStorage.removeItem("br26_pass");}catch{} setLoginName(""); setLoginPass(""); window.location.reload(); }}>
                      Trocar conta
                    </div>
                  </div>
                );
              }
            } catch {}
            return null;
          })()}
          <input value={loginName} onChange={e=>setLoginName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            placeholder="Usuário" style={{ width:"100%", padding:"12px 14px", marginBottom:10, background:G.card2, border:`1px solid ${G.border}`, borderRadius:10, color:G.text, fontSize:14, boxSizing:"border-box", outline:"none" }}/>
          <input value={loginPass} onChange={e=>setLoginPass(e.target.value.replace(/\D/g,""))} onKeyDown={e=>e.key==="Enter"&&handleLogin()}
            type="number" inputMode="numeric" pattern="[0-9]*" placeholder="Senha (números)" style={{ width:"100%", padding:"12px 14px", marginBottom:16, background:G.card2, border:`1px solid ${G.border}`, borderRadius:10, color:G.text, fontSize:14, boxSizing:"border-box", outline:"none" }}/>
          {loginErr && <div style={{ color:G.danger, fontSize:12, marginBottom:10, textAlign:"center" }}>{loginErr}</div>}
          <button onClick={handleLogin} style={{ width:"100%", padding:"14px", borderRadius:12, border:"none", background:`linear-gradient(135deg,${G.accent},#00b894)`, color:"#0a0e1a", fontSize:15, fontWeight:900, cursor:"pointer", letterSpacing:1, boxShadow:`0 4px 16px ${G.accent}44` }}>
            ENTRAR
          </button>
        </div>
      </div>
    );
  }

  // ── Tabs ──────────────────────────────────────────────────────────────────
  const tabs = isAdmin
    ? [{id:"admin",label:"⚙️ Admin"}]
    : [{id:"jogos",label:"⚽ Jogos"},{id:"todos",label:"👁 Todos"},{id:"ranking",label:"🏆 Ranking"},{id:"tabela",label:"📋 Tabela"},{id:"stats",label:"📈 Stats"},{id:"infos",label:"ℹ️ Infos"}];

  return (
    <div style={{ minHeight:"100vh", background:G.bg, fontFamily:"'Segoe UI',sans-serif", color:G.text, maxWidth:480, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ background:G.card, borderBottom:`1px solid ${G.border}`, padding:"10px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:14, color:G.text }}>🇧🇷 Bolão Brasileirão 2026</div>
          <div style={{ fontSize:11, color:G.muted }}>{isAdmin?"👑 Admin":`@${player.id} — ${player.name}`}</div>
        </div>
        <button onClick={handleLogout} style={{ background:G.card2, border:`1px solid ${G.border}`, color:G.muted, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" }}>Sair</button>
      </div>
      {/* Tab bar */}
      <div style={{ display:"flex", background:G.card, borderBottom:`1px solid ${G.border}`, overflowX:"auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"11px 6px", background:"none", border:"none", color:tab===t.id?G.accent:G.muted, fontSize:12, cursor:"pointer", fontWeight:tab===t.id?800:600, borderBottom:tab===t.id?`2px solid ${G.accent}`:"2px solid transparent", whiteSpace:"nowrap", minWidth:60, transition:"all .15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"0 0 80px" }}>

      {/* ══ ABA JOGOS ══ */}
      {tab==="jogos" && !isAdmin && (
        <div>
          {/* Seletor de rodadas */}
          <div ref={stripRef} style={{ display:"flex", gap:6, overflowX:"auto", padding:"12px 12px 8px", scrollbarWidth:"none" }}>
            {ROUNDS.map(r => {
              const done = matchesByRound[r].every(m => results[m.id]?.home!=null && results[m.id]?.home!=="");
              const isA = r===activeRound;
              return (
                <button key={r} data-round={r} onClick={()=>setActiveRound(r)}
                  style={{ flexShrink:0, padding:"6px 11px", borderRadius:8, border:`2px solid ${isA?G.accent:G.border}`,
                    background:isA?G.accent+"22":G.card, color:isA?G.accent:G.muted,
                    fontSize:11, fontWeight:800, cursor:"pointer", position:"relative" }}>
                  R{r}
                  {done && <span style={{ position:"absolute", top:-3, right:-3, background:G.success, borderRadius:"50%", width:7, height:7, display:"block" }}/>}
                </button>
              );
            })}
          </div>

          {/* Jogos da rodada */}
          <div style={{ padding:"0 8px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, marginTop:4 }}>
              <div style={{ flex:1, height:1, background:G.border }}/>
              <div style={{ fontSize:12, fontWeight:800, color:G.accent, letterSpacing:1 }}>RODADA {activeRound}</div>
              <div style={{ flex:1, height:1, background:G.border }}/>
            </div>
            {(matchesByRound[activeRound]||[]).slice().sort((a,b) => {
              const ta = new Date(a.date+"T"+(a.time||"16:00")+":00");
              const tb = new Date(b.date+"T"+(b.time||"16:00")+":00");
              return ta-tb;
            }).map(m => {
              const real = results[m.id] || {};
              const pred = draftPreds[m.id] || {};
              const locked = isLocked(m);
              const hasResult = real.home!=null && real.home!=="";
              // Para pts: usar savedPreds (Firebase) nos jogos com resultado, para consistência com ranking
              const predForPts = hasResult ? (savedPreds[player?.id]?.[m.id] || pred) : pred;
              const pts = hasResult ? calcPts(predForPts, real) : null;
              const ptColor = pts===25?G.success:pts>=15?"#3b82f6":pts>=10?G.warn:pts>0?G.danger:G.muted;
              return (
                <div key={m.id} style={{ background:G.card, border:`1px solid ${hasResult&&pts!==null?ptColor+"55":G.border}`, borderRadius:12, padding:"12px 14px", marginBottom:8 }}>
                  <div style={{ fontSize:11, color:G.muted, marginBottom:6 }}>{fmtDate(m.date, m.time)}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {/* Casa */}
                    <div style={{ flex:1, display:"flex", alignItems:"center", gap:5 }}>
                      <div style={teamDot(m.home)}/>
                      <span style={{ fontSize:12, fontWeight:700, color:G.text }}>{m.home}</span>
                    </div>
                    {/* Placar */}
                    <div style={{ minWidth:120, display:"flex", justifyContent:"center" }}>
                      {hasResult ? (
                        <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:20, fontWeight:900, color:G.text, background:G.card2, padding:"4px 16px", borderRadius:8 }}>
                          {real.home} — {real.away}
                        </div>
                      ) : (
                        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                          <input type="number" min="0" max="20" value={pred.home??""} onChange={e=>setPred(m.id,"home",e.target.value)} disabled={locked}
                            style={{ width:40, textAlign:"center", background:G.card2, border:`1px solid ${G.border}`, color:G.text, borderRadius:8, padding:"6px 2px", fontSize:16, fontWeight:800, outline:"none" }}/>
                          <span style={{ color:G.muted }}>×</span>
                          <input type="number" min="0" max="20" value={pred.away??""} onChange={e=>setPred(m.id,"away",e.target.value)} disabled={locked}
                            style={{ width:40, textAlign:"center", background:G.card2, border:`1px solid ${G.border}`, color:G.text, borderRadius:8, padding:"6px 2px", fontSize:16, fontWeight:800, outline:"none" }}/>
                        </div>
                      )}
                    </div>
                    {/* Visitante */}
                    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:5 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:G.text }}>{m.away}</span>
                      <div style={teamDot(m.away)}/>
                    </div>
                  </div>
                  {/* Footer */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8, paddingTop:6, borderTop:`1px solid ${G.border}33` }}>
                    <span style={{ fontSize:11, color:G.muted }}>
                      {predForPts.home!=null&&predForPts.home!==""?`Palpite: ${predForPts.home}×${predForPts.away}`:locked?"🔒 Encerrado":"Sem palpite"}
                    </span>
                    {pts!==null && (
                      <span style={{ fontWeight:800, fontSize:13, color:ptColor }}>
                        {pts===25?"🎯 ":pts>=10?"✅ ":"❌ "}{pts}pts
                      </span>
                    )}
                  </div>
                  {/* Mini palpites após resultado */}
                  {hasResult && (
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginTop:6, paddingTop:6, borderTop:`1px solid ${G.border}22` }}>
                      {PLAYERS.map(p => {
                        const pp = savedPreds[p.id]?.[m.id];
                        const pp2 = calcPts(pp, real);
                        const bg = pp2===25?"#14532d":pp2>=15?"#1e3a8a":pp2>=10?"#78350f":pp2>0?"#7f1d1d":G.card2;
                        return (
                          <div key={p.id} style={{ background:bg, borderRadius:6, padding:"2px 7px", textAlign:"center", minWidth:48 }}>
                            <div style={{ fontSize:9, color:"rgba(255,255,255,.6)" }}>{p.name}</div>
                            <div style={{ fontSize:11, fontWeight:700, color:G.text }}>{pp?.home!=null?`${pp.home}-${pp.away}`:"—"}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
            {/* Botão Enviar */}
            <div style={{ marginTop:20 }}>
              <button onClick={handleSend} disabled={saving||sent}
                style={{ width:"100%", padding:"16px", borderRadius:12, border:"none",
                  background:sent?G.success:`linear-gradient(135deg,${G.accent},#00b894)`,
                  color:"#0a0e1a", fontSize:14, fontWeight:900, cursor:"pointer", letterSpacing:1,
                  boxShadow:`0 4px 16px ${G.accent}44` }}>
                {saving?"💾 SALVANDO...":sent?"✅ PALPITES SALVOS":"📤 SALVAR PALPITES"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ABA TODOS ══ */}
      {tab==="todos" && (
        <div style={{ padding:"12px 8px" }}>
          <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:20, fontWeight:900, color:G.accent, marginBottom:14, letterSpacing:1 }}>👁 TODOS OS PALPITES</div>
          {ROUNDS.filter(r => matchesByRound[r].some(m => isLocked(m))).reverse().map(r => (
            <div key={r} style={{ marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:800, color:G.muted, letterSpacing:1, marginBottom:10 }}>RODADA {r}</div>
              {matchesByRound[r].filter(m => isLocked(m)).sort((a,b)=>{
                const ta=new Date(a.date+"T"+(a.time||"16:00")+":00");
                const tb=new Date(b.date+"T"+(b.time||"16:00")+":00");
                return ta-tb;
              }).map(m => {
                const real = results[m.id];
                const hasResult = real?.home!=null && real?.home!=="";
                return (
                  <div key={m.id} style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:10, padding:"10px 12px", marginBottom:6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                      <span style={{ fontSize:11, color:G.muted }}>{fmtDate(m.date, m.time)}</span>
                      <span style={{ fontWeight:800, fontSize:13, color:G.text }}>
                        {m.home} {hasResult?`${real.home}×${real.away}`:"× (ag. resultado)"} {m.away}
                      </span>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                      {PLAYERS.map(p => {
                        const pp = savedPreds[p.id]?.[m.id];
                        const pts = hasResult ? calcPts(pp, real) : null;
                        const bg = pts===25?"#14532d":pts>=15?"#1e3a8a":pts>=10?"#78350f":pts>0?"#7f1d1d":G.card2;
                        const isMe = p.id===player?.id;
                        return (
                          <div key={p.id} style={{ background:bg, borderRadius:8, padding:"4px 10px", minWidth:60, textAlign:"center", border:isMe?`1px solid ${G.accent}44`:"none" }}>
                            <div style={{ fontSize:10, color:isMe?G.accent:"rgba(255,255,255,.6)", fontWeight:isMe?800:600 }}>{p.name}</div>
                            <div style={{ fontWeight:700, color:G.text, fontSize:12 }}>{pp?.home!=null?`${pp.home}-${pp.away}`:"—"}</div>
                            <div style={{ fontSize:10, color:"rgba(255,255,255,.8)", fontWeight:700 }}>{pts!==null?`${pts}pts`:""}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* ══ ABA RANKING ══ */}
      {tab==="ranking" && (
        <div style={{ padding:"12px 8px" }}>
          <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:20, fontWeight:900, color:G.gold, marginBottom:14, letterSpacing:1 }}>🏆 CLASSIFICAÇÃO</div>
          {ranking.map((p,i) => (
            <div key={p.id} style={{ background:G.card, border:`1px solid ${p.id===player?.id?G.accent+"44":G.border}`, borderRadius:12, padding:"14px 16px", marginBottom:8, display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ fontSize:22, minWidth:28 }}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:14, color:p.id===player?.id?G.accent:G.text }}>{p.name}</div>
                <div style={{ fontSize:11, color:G.muted, marginTop:2 }}>{p.exact} exatos · {p.correct} acertos · {p.total} jogos</div>
              </div>
              <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:24, fontWeight:900, color:i===0?G.gold:G.text }}>{p.pts}</div>
            </div>
          ))}
          {/* Palpite campeão */}
          <div style={{ background:G.card, border:`1px solid ${G.gold}33`, borderRadius:12, padding:16, marginTop:8 }}>
            <div style={{ fontSize:12, fontWeight:800, color:G.gold, letterSpacing:1, marginBottom:12 }}>🏆 PALPITE CAMPEÃO (100 pts)</div>
            {PLAYERS.map(p => (
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid ${G.border}22` }}>
                <span style={{ fontSize:12, fontWeight:700, color:p.id===player?.id?G.accent:G.text }}>{p.name}</span>
                <span style={{ fontSize:12, color:G.gold }}>{tableGuesses[p.id]?.[1] || "—"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ ABA TABELA FINAL ══ */}
      {tab==="tabela" && (
        <div style={{ padding:"12px 8px" }}>
          <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:20, fontWeight:900, color:G.gold, marginBottom:6, letterSpacing:1 }}>📋 TABELA FINAL</div>
          <div style={{ fontSize:12, color:G.muted, marginBottom:14 }}>
            <strong style={{color:G.gold}}>10 pts</strong> por posição acertada · <strong style={{color:G.gold}}>100 pts</strong> pelo campeão · Palpites encerrados
          </div>

          {/* Seu palpite — somente visualização */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:16, marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:800, color:G.accent, marginBottom:12 }}>SEU PALPITE</div>
            {TEAMS.map((_,i) => {
              const pos = i+1;
              const zoneColor = pos<=4?G.success:pos<=6?"#22d3ee":pos<=12?G.muted:pos>=17?G.danger:G.muted;
              const zoneIcon = pos<=4?"🟢":pos<=6?"🔵":pos>=17?"🔴":"⚪";
              const guess = tableGuesses[player?.id]?.[pos];
              const real = finalTable[pos];
              const hit = real && guess && real===guess;
              return (
                <div key={pos} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6, padding:"3px 0", borderBottom:`1px solid ${G.border}22` }}>
                  <div style={{ minWidth:48, fontSize:12, fontWeight:800, color:zoneColor, background:zoneColor+"15", borderRadius:6, padding:"2px 6px", textAlign:"center", flexShrink:0 }}>
                    {zoneIcon} {pos}º
                  </div>
                  <div style={{ flex:1, fontSize:13, fontWeight:700, color:hit?G.success:guess?G.text:G.muted }}>
                    {guess || "—"}
                    {hit && <span style={{ fontSize:11, color:G.success, marginLeft:6 }}>✅ +10pts</span>}
                    {real && !hit && guess && <span style={{ fontSize:11, color:G.danger, marginLeft:6 }}>❌ ({real})</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparativo todos os jogadores */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:16, overflowX:"auto" }}>
            <div style={{ fontSize:12, fontWeight:800, color:G.muted, marginBottom:12 }}>👁 TODOS OS PALPITES</div>
            <div style={{ display:"grid", gridTemplateColumns:`44px repeat(${PLAYERS.length}, 1fr)`, gap:2, minWidth:400 }}>
              <div style={{ fontSize:10, fontWeight:800, color:G.muted }}>Pos</div>
              {PLAYERS.map(p => (
                <div key={p.id} style={{ fontSize:10, fontWeight:800, color:p.id===player?.id?G.accent:G.muted, textAlign:"center" }}>{p.name}</div>
              ))}
              {TEAMS.map((_,i) => {
                const pos = i+1;
                const zoneColor = pos<=4?G.success:pos>=17?G.danger:G.muted;
                const real = finalTable[pos];
                return [
                  <div key={`pos${pos}`} style={{ fontSize:11, fontWeight:800, color:zoneColor, paddingTop:3 }}>{pos}º</div>,
                  ...PLAYERS.map(p => {
                    const guess = tableGuesses[p.id]?.[pos];
                    const hit = real && guess && real===guess;
                    const isMe = p.id===player?.id;
                    return (
                      <div key={p.id} style={{ fontSize:11, textAlign:"center", background:hit?"#14532d":isMe?G.card2+"88":"transparent", color:hit?G.success:guess?G.text:G.muted, borderRadius:4, padding:"2px 2px" }}>
                        {guess || "—"}
                      </div>
                    );
                  })
                ];
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══ ABA STATS ══ */}
      {tab==="stats" && (
        <div style={{ padding:"12px 8px" }}>
          <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:20, fontWeight:900, color:G.accent2, marginBottom:14, letterSpacing:1 }}>📈 ESTATÍSTICAS</div>

          {/* Gráfico acumulado */}
          {(() => {
            const played = MATCHES.filter(m => { const r=results[m.id]; return r?.home!=null&&r?.home!==""; });
            if (played.length===0) return <div style={{ color:G.muted, fontSize:13, padding:20, textAlign:"center" }}>Aguardando resultados...</div>;
            const colors = ["#00d4aa","#ff6b35","#ffd700","#8b5cf6","#ef4444","#3b82f6","#22c55e"];
            const data = PLAYERS.map((p,i) => {
              let cum=0;
              const pts = played.map(m => {
                const pp=savedPreds[p.id]?.[m.id], rr=results[m.id];
                const s=calcPts(pp,rr)||0; cum+=s; return cum;
              });
              return { ...p, pts, color:colors[i] };
            });
            const maxPts = Math.max(...data.flatMap(d=>d.pts), 1);
            const W=340, H=160, pL=32, pR=8, pT=10, pB=20;
            const iW=W-pL-pR, iH=H-pT-pB;
            const xp=(i)=>pL+i*(iW/(played.length-1||1));
            const yp=(v)=>pT+iH-(v/maxPts)*iH;
            return (
              <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:14 }}>
                <div style={{ fontWeight:900, fontSize:14, color:G.text, marginBottom:4 }}>📊 EVOLUÇÃO DE PONTOS</div>
                <div style={{ fontSize:11, color:G.muted, marginBottom:12 }}>{played.length} partida{played.length!==1?"s":""} jogada{played.length!==1?"s":""}</div>
                <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
                  {[0,.25,.5,.75,1].map(f => (
                    <g key={f}>
                      <line x1={pL} y1={pT+iH*f} x2={W-pR} y2={pT+iH*f} stroke={G.border} strokeWidth=".5"/>
                      <text x={pL-3} y={pT+iH*f+3} fill={G.muted} fontSize="7" textAnchor="end">{Math.round(maxPts*(1-f))}</text>
                    </g>
                  ))}
                  {data.map(d => (
                    <polyline key={d.id} points={d.pts.map((v,i)=>`${xp(i)},${yp(v)}`).join(" ")}
                      fill="none" stroke={d.color} strokeWidth={d.id===player?.id?2.5:1.5} strokeLinejoin="round"/>
                  ))}
                  {data.map(d => {
                    const last=d.pts[d.pts.length-1];
                    return <circle key={d.id} cx={xp(played.length-1)} cy={yp(last)} r={d.id===player?.id?4:2.5} fill={d.color}/>;
                  })}
                </svg>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 14px", marginTop:8 }}>
                  {data.map(d => (
                    <div key={d.id} style={{ display:"flex", alignItems:"center", gap:5 }}>
                      <div style={{ width:14, height:3, background:d.color, borderRadius:2 }}/>
                      <span style={{ fontSize:11, fontWeight:d.id===player?.id?800:600, color:d.id===player?.id?G.accent:G.muted }}>{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Rei do placar exato */}
          {(() => {
            const played = MATCHES.filter(m => { const r=results[m.id]; return r?.home!=null&&r?.home!==""; });
            const exactRank = PLAYERS.map(p => {
              let exact=0, total=0;
              played.forEach(m => { const pp=savedPreds[p.id]?.[m.id], rr=results[m.id]; if(pp?.home!=null) { total++; if(calcPts(pp,rr)===25) exact++; } });
              return { ...p, exact, total, pct:total?Math.round(exact/total*100):0 };
            }).sort((a,b)=>b.pct-a.pct||b.exact-a.exact);
            return (
              <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:14 }}>
                <div style={{ fontWeight:900, fontSize:14, color:G.gold, marginBottom:4 }}>🎯 REI DO PLACAR EXATO</div>
                <div style={{ fontSize:11, color:G.muted, marginBottom:14 }}>% de palpites com placar exato</div>
                {exactRank.map((p,i) => (
                  <div key={p.id} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{ fontSize:13 }}>{["🥇","🥈","🥉"][i]||""}</span>
                        <span style={{ fontSize:12, fontWeight:p.id===player?.id?800:600, color:p.id===player?.id?G.accent:G.text }}>{p.name}</span>
                      </div>
                      <div><span style={{ fontSize:13, fontWeight:900, color:i===0?G.gold:G.text }}>{p.pct}%</span><span style={{ fontSize:10, color:G.muted, marginLeft:4 }}>({p.exact}/{p.total})</span></div>
                    </div>
                    <div style={{ background:G.card2, borderRadius:6, height:6, overflow:"hidden" }}>
                      <div style={{ width:`${p.pct}%`, height:"100%", background:i===0?G.gold:p.id===player?.id?G.accent:G.muted+"88", borderRadius:6, transition:"width .6s" }}/>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Taxa de acerto vencedor */}
          {(() => {
            const played = MATCHES.filter(m => { const r=results[m.id]; return r?.home!=null&&r?.home!==""; });
            const winRank = PLAYERS.map(p => {
              let win=0, total=0;
              played.forEach(m => { const pp=savedPreds[p.id]?.[m.id], rr=results[m.id]; if(pp?.home!=null) { total++; if(calcPts(pp,rr)>=10) win++; } });
              return { ...p, win, total, pct:total?Math.round(win/total*100):0 };
            }).sort((a,b)=>b.pct-a.pct);
            return (
              <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:14 }}>
                <div style={{ fontWeight:900, fontSize:14, color:G.success, marginBottom:4 }}>✅ TAXA DE ACERTO — VENCEDOR</div>
                <div style={{ fontSize:11, color:G.muted, marginBottom:14 }}>% que acertou pelo menos o resultado</div>
                {winRank.map((p,i) => (
                  <div key={p.id} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                      <span style={{ fontSize:12, fontWeight:p.id===player?.id?800:600, color:p.id===player?.id?G.accent:G.text }}>{p.name}</span>
                      <div><span style={{ fontSize:13, fontWeight:900, color:i===0?G.success:G.text }}>{p.pct}%</span><span style={{ fontSize:10, color:G.muted, marginLeft:4 }}>({p.win}/{p.total})</span></div>
                    </div>
                    <div style={{ background:G.card2, borderRadius:6, height:6, overflow:"hidden" }}>
                      <div style={{ width:`${p.pct}%`, height:"100%", background:i===0?G.success:p.id===player?.id?G.accent:G.muted+"88", borderRadius:6, transition:"width .6s" }}/>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ── CARD: Pontos por Rodada ─────────────────────────────────── */}
          {(() => {
            // Calcular pontos por rodada por jogador
            const roundData = ROUNDS.map(r => {
              const matches = matchesByRound[r] || [];
              const hasResults = matches.some(m => {
                const res = results[m.id];
                return res?.home!=null && res?.home!=="";
              });
              if (!hasResults) return null;
              const playerPts = PLAYERS.map(p => {
                let pts = 0;
                matches.forEach(m => {
                  const res = results[m.id];
                  if (!res || res.home==null || res.home==="") return;
                  const pred = savedPreds[p.id]?.[m.id];
                  pts += calcPts(pred, res) || 0;
                });
                return { id: p.id, name: p.name, pts };
              });
              const maxPts = Math.max(...playerPts.map(p => p.pts), 1);
              const minPts = Math.min(...playerPts.map(p => p.pts));
              return { round: r, playerPts, maxPts, minPts };
            }).filter(Boolean);

            if (roundData.length === 0) return null;

            // Vencedor de cada rodada
            const roundWinners = roundData.map(rd => {
              const max = Math.max(...rd.playerPts.map(p => p.pts));
              return rd.playerPts.filter(p => p.pts === max).map(p => p.id);
            });

            // Cores do heatmap
            const cellColor = (pts, min, max) => {
              if (max === min) return G.card2;
              const ratio = (pts - min) / (max - min);
              if (ratio >= 0.8) return "#14532d";
              if (ratio >= 0.6) return "#166534";
              if (ratio >= 0.4) return "#78350f";
              if (ratio >= 0.2) return "#7f1d1d33";
              return "#7f1d1d";
            };

            // Totais por rodada
            const playerColors = ["#00d4aa","#ff6b35","#ffd700","#8b5cf6","#ef4444","#3b82f6","#22c55e"];

            return (
              <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:14 }}>
                <div style={{ fontWeight:900, fontSize:14, color:"#8b5cf6", marginBottom:4 }}>📊 PONTOS POR RODADA</div>
                <div style={{ fontSize:11, color:G.muted, marginBottom:16 }}>🟢 melhor da rodada · 🔴 pior da rodada · 🏆 vencedor</div>

                {/* Tabela scrollável */}
                <div style={{ overflowX:"auto", marginBottom:16 }}>
                  <table style={{ borderCollapse:"collapse", fontSize:11, width:"100%", minWidth: `${60 + roundData.length * 44}px` }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign:"left", padding:"4px 8px", color:G.muted, fontWeight:800, minWidth:72, position:"sticky", left:0, background:G.card }}>Jogador</th>
                        {roundData.map(rd => (
                          <th key={rd.round} style={{ textAlign:"center", padding:"4px 6px", color:G.muted, fontWeight:800, minWidth:38 }}>R{rd.round}</th>
                        ))}
                        <th style={{ textAlign:"center", padding:"4px 8px", color:G.accent, fontWeight:900, minWidth:44 }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PLAYERS.map((p, pi) => {
                        const total = roundData.reduce((sum, rd) => {
                          return sum + (rd.playerPts.find(x => x.id===p.id)?.pts || 0);
                        }, 0);
                        return (
                          <tr key={p.id}>
                            <td style={{ padding:"4px 8px", fontWeight: p.id===player?.id?900:700, color: p.id===player?.id?G.accent:G.text, position:"sticky", left:0, background:G.card }}>
                              <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                                <div style={{ width:8, height:8, borderRadius:"50%", background:playerColors[pi], flexShrink:0 }}/>
                                {p.name}
                              </div>
                            </td>
                            {roundData.map((rd, ri) => {
                              const pp = rd.playerPts.find(x => x.id===p.id);
                              const pts = pp?.pts ?? 0;
                              const isWinner = roundWinners[ri].includes(p.id);
                              const bg = cellColor(pts, rd.minPts, rd.maxPts);
                              return (
                                <td key={rd.round} style={{ textAlign:"center", padding:"4px 3px" }}>
                                  <div style={{ background:bg, borderRadius:6, padding:"4px 2px", position:"relative" }}>
                                    <span style={{ fontWeight:900, color:G.text }}>{pts}</span>
                                    {isWinner && pts > 0 && <span style={{ position:"absolute", top:-3, right:-2, fontSize:8 }}>🏆</span>}
                                  </div>
                                </td>
                              );
                            })}
                            <td style={{ textAlign:"center", padding:"4px 8px", fontWeight:900, color:G.accent, fontSize:12 }}>{total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr style={{ borderTop:`1px solid ${G.border}` }}>
                        <td style={{ padding:"6px 8px", fontWeight:800, color:G.muted, fontSize:10, position:"sticky", left:0, background:G.card }}>MÁX</td>
                        {roundData.map(rd => (
                          <td key={rd.round} style={{ textAlign:"center", padding:"6px 3px", fontWeight:800, color:G.success, fontSize:10 }}>{rd.maxPts}</td>
                        ))}
                        <td/>
                      </tr>
                      <tr>
                        <td style={{ padding:"4px 8px", fontWeight:800, color:G.muted, fontSize:10, position:"sticky", left:0, background:G.card }}>MÍN</td>
                        {roundData.map(rd => (
                          <td key={rd.round} style={{ textAlign:"center", padding:"4px 3px", fontWeight:800, color:G.danger, fontSize:10 }}>{rd.minPts}</td>
                        ))}
                        <td/>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Mini ranking de vencedores de rodada */}
                {(() => {
                  const wins = {};
                  PLAYERS.forEach(p => wins[p.id] = 0);
                  roundWinners.forEach(wList => wList.forEach(id => wins[id] = (wins[id]||0) + 1));
                  const sorted = PLAYERS.map(p => ({ ...p, wins: wins[p.id]||0 })).filter(p => p.wins > 0).sort((a,b) => b.wins-a.wins);
                  if (sorted.length === 0) return null;
                  return (
                    <div style={{ borderTop:`1px solid ${G.border}`, paddingTop:12 }}>
                      <div style={{ fontSize:11, fontWeight:800, color:G.muted, marginBottom:8 }}>🏆 VENCEDOR DE RODADAS</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        {sorted.map((p, i) => (
                          <div key={p.id} style={{ background:G.card2, borderRadius:20, padding:"4px 12px", display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontSize:12 }}>{["🥇","🥈","🥉"][i]||""}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:p.id===player?.id?G.accent:G.text }}>{p.name}</span>
                            <span style={{ fontSize:12, fontWeight:900, color:G.gold }}>{p.wins}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}
        </div>
      )}

      {/* ══ ABA INFOS ══ */}
      {tab==="infos" && (
        <div style={{ padding:"12px 8px" }}>
          <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:20, fontWeight:900, color:G.accent, marginBottom:14, letterSpacing:1 }}>ℹ️ INFORMAÇÕES</div>

          {/* Pontuação */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:12 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.accent, marginBottom:14, letterSpacing:.8 }}>🎯 SISTEMA DE PONTUAÇÃO</div>
            {[["25 pts","Placar exato 🎯"],["18 pts","Vencedor + nº de gols do vencedor"],["15 pts","Vencedor + saldo de gols"],["12 pts","Vencedor + gols do perdedor"],["10 pts","Apenas o vencedor / empate"]].map(([pts,desc])=>(
              <div key={pts} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:`1px solid ${G.border}33` }}>
                <span style={{ fontSize:13, color:G.text }}>{desc}</span>
                <span style={{ fontSize:13, fontWeight:900, color:G.gold, minWidth:50, textAlign:"right" }}>{pts}</span>
              </div>
            ))}
            <div style={{ marginTop:14, background:G.card2, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:12, fontWeight:800, color:G.gold, marginBottom:8 }}>🏆 PALPITE CAMPEÃO</div>
              <div style={{ fontSize:12, color:G.text }}>Acertar o campeão do Brasileirão: <strong style={{color:G.gold}}>100 pts</strong></div>
              <div style={{ fontSize:11, color:G.muted, marginTop:6 }}>Defina na aba Tabela Final</div>
            </div>
          </div>

          {/* Regras */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:12 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.accent, marginBottom:14 }}>📋 REGRAS</div>
            {[
              "Palpite cada jogo individualmente e clique em SALVAR PALPITES para registrar os palpites da rodada",
              "O prazo para palpitar cada jogo encerra 5 minutos antes do horário de início daquela partida",
              "Os palpites de cada jogo ficam visíveis a todos após o encerramento do prazo (5 min antes do início)",
              "Pausa durante a Copa do Mundo (junho–julho de 2026)",
              "Jogadores: TICO, PEDRO IVO, LUQUINHAS, LAZARO, VINI, DANE, ALEX",
            ].map(item => (
              <div key={item} style={{ display:"flex", gap:8, padding:"7px 0", borderBottom:`1px solid ${G.border}33`, fontSize:13 }}>
                <span style={{ color:G.accent, flexShrink:0 }}>▸</span>
                <span style={{ color:G.text, lineHeight:1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Premiação */}
          <div style={{ background:G.card, border:`1px solid ${G.gold}33`, borderRadius:14, padding:18, marginBottom:12 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.gold, marginBottom:14 }}>🏅 PREMIAÇÃO</div>
            <div style={{ background:G.gold+"11", border:`1px solid ${G.gold}44`, borderRadius:10, padding:"13px 16px", display:"flex", alignItems:"center", gap:14, marginBottom:8 }}>
              <span style={{ fontSize:30 }}>🥇</span>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:G.gold }}>Vencedor do Bolão</div>
                <div style={{ fontSize:12, color:G.text, marginTop:3 }}>Camisa oficial de clube à escolha do vencedor</div>
              </div>
            </div>
            <div style={{ background:G.card2, borderRadius:10, padding:"13px 16px", display:"flex", alignItems:"center", gap:14 }}>
              <span style={{ fontSize:30 }}>🍻</span>
              <div>
                <div style={{ fontSize:13, fontWeight:800, color:G.text }}>Restante arrecadado</div>
                <div style={{ fontSize:12, color:G.muted, marginTop:3 }}>Rateado no próximo encontro</div>
              </div>
            </div>
          </div>

          {/* Pagamentos */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:12 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.accent, marginBottom:14 }}>💰 STATUS DE PAGAMENTOS</div>
            {PLAYERS.map(p => {
              const s = payments[p.id] || "pendente";
              return (
                <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:`1px solid ${G.border}33` }}>
                  <span style={{ fontSize:13, fontWeight:700, color:p.id===player?.id?G.accent:G.text }}>{p.name}</span>
                  <span style={{ fontSize:11, fontWeight:800, padding:"3px 10px", borderRadius:20, letterSpacing:.8,
                    background:s==="pago"?G.success+"22":G.warn+"22", color:s==="pago"?G.success:G.warn }}>
                    {s.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Classificação Brasileirão (link) */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.accent, marginBottom:12 }}>📊 CLASSIFICAÇÃO REAL</div>
            <a href="https://ge.globo.com/futebol/brasileirao-serie-a/" target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", textDecoration:"none" }}>
              <span style={{ fontSize:13, color:G.text }}>Tabela Brasileirão 2026</span>
              <span style={{ color:G.accent, fontSize:12 }}>Abrir ↗</span>
            </a>
            <a href="https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-a" target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", textDecoration:"none", borderTop:`1px solid ${G.border}33` }}>
              <span style={{ fontSize:13, color:G.text }}>Site Oficial CBF</span>
              <span style={{ color:G.accent, fontSize:12 }}>Abrir ↗</span>
            </a>
          </div>
        </div>
      )}

      {/* ══ ABA ADMIN ══ */}
      {tab==="admin" && isAdmin && (
        <div style={{ padding:"12px 8px" }}>
          <div style={{ fontFamily:"'Arial Black',sans-serif", fontSize:20, fontWeight:900, color:G.accent2, marginBottom:14 }}>⚙️ PAINEL DO ADMIN</div>

          {/* ── ALERTAS: jogos em menos de 2h sem palpite ── */}
          {(() => {
            const now = new Date();
            const alerts = [];
            MATCHES.forEach(m => {
              const [h, min] = (m.time||"16:00").split(":").map(Number);
              const [y, mo, d] = m.date.split("-").map(Number);
              const kickoff = new Date(y, mo-1, d, h, min, 0);
              const minsLeft = (kickoff - now) / 60000;
              if (minsLeft < 0 || minsLeft > 360) return; // só jogos nas próximas 6h
              PLAYERS.forEach(p => {
                const pred = savedPreds[p.id]?.[m.id];
                if (!pred || pred.home==null || pred.home==="") {
                  alerts.push({ player: p.name, match: `${m.home} × ${m.away}`, time: m.time, date: m.date, minsLeft: Math.round(minsLeft) });
                }
              });
            });
            if (alerts.length === 0) return (
              <div style={{ background:"#14532d22", border:`1px solid ${G.success}44`, borderRadius:12, padding:"12px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:18 }}>✅</span>
                <span style={{ fontSize:13, color:G.success, fontWeight:700 }}>Todos os jogadores palpitaram nos jogos das próximas 2 horas</span>
              </div>
            );
            return (
              <div style={{ background:"#7f1d1d22", border:`1px solid ${G.danger}55`, borderRadius:12, padding:"14px 16px", marginBottom:14 }}>
                <div style={{ fontWeight:900, fontSize:13, color:G.danger, marginBottom:10 }}>⚠️ PALPITES FALTANDO — MENOS DE 2H</div>
                {alerts.map((a, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${G.danger}22` }}>
                    <div>
                      <span style={{ fontWeight:800, color:G.text, fontSize:13 }}>{a.player}</span>
                      <span style={{ color:G.muted, fontSize:12, marginLeft:8 }}>{a.match}</span>
                    </div>
                    <span style={{ fontSize:12, fontWeight:800, color:a.minsLeft<=30?G.danger:G.warn, background:(a.minsLeft<=30?G.danger:G.warn)+"22", padding:"2px 8px", borderRadius:20 }}>
                      {a.minsLeft}min
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Campeão */}
          <div style={{ background:G.card, border:`1px solid ${G.gold}44`, borderRadius:14, padding:18, marginBottom:14 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.gold, marginBottom:12 }}>🏆 CAMPEÃO DO BRASILEIRÃO</div>
            <select value={champion} onChange={e=>setChampionTeam(e.target.value)}
              style={{ width:"100%", padding:"10px 12px", background:G.card2, border:`1px solid ${G.border}`, color:G.text, borderRadius:10, fontSize:13, cursor:"pointer" }}>
              <option value="">-- Ainda não definido --</option>
              {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            {champion && <div style={{ color:G.gold, fontWeight:800, marginTop:10 }}>🏆 {champion}</div>}
          </div>

          {/* Classificação Real Final */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:14 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.accent, marginBottom:6 }}>📊 CLASSIFICAÇÃO REAL FINAL</div>
            <div style={{ fontSize:11, color:G.muted, marginBottom:14 }}>Defina ao final do campeonato. 10pts por posição acertada por jogador.</div>
            {TEAMS.map((_,i) => {
              const pos = i+1;
              const zoneColor = pos<=4?G.success:pos<=6?"#22d3ee":pos>=17?G.danger:G.muted;
              const zoneIcon = pos<=4?"🟢":pos<=6?"🔵":pos>=17?"🔴":"⚪";
              return (
                <div key={pos} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <div style={{ minWidth:48, fontSize:12, fontWeight:800, color:zoneColor, background:zoneColor+"15", borderRadius:6, padding:"2px 6px", textAlign:"center", flexShrink:0 }}>
                    {zoneIcon} {pos}º
                  </div>
                  <select value={finalTable[pos]||""} onChange={e=>setFinalTablePos(pos,e.target.value)}
                    style={{ flex:1, padding:"6px 10px", background:finalTable[pos]?G.card2:G.bg, border:`1px solid ${finalTable[pos]?G.accent+"55":G.border}`, color:finalTable[pos]?G.text:G.muted, borderRadius:8, fontSize:12, cursor:"pointer", outline:"none" }}>
                    <option value="">-- não definido --</option>
                    {TEAMS.map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              );
            })}
            <div style={{ marginTop:12, fontSize:11, color:G.muted }}>
              Preenchido: {Object.keys(finalTable).length}/20 posições
            </div>
          </div>

          {/* Palpites Tabela — visão admin */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:14, overflowX:"auto" }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.accent, marginBottom:14 }}>📋 PALPITES DE TABELA</div>
            <div style={{ display:"grid", gridTemplateColumns:"44px repeat(7, 1fr)", gap:2, minWidth:500, fontSize:10 }}>
              <div style={{ fontWeight:800, color:G.muted }}>Pos</div>
              {PLAYERS.map(p=><div key={p.id} style={{ fontWeight:800, color:G.muted, textAlign:"center" }}>{p.name}</div>)}
              {TEAMS.map((_,i) => {
                const pos=i+1;
                const zoneColor=pos<=4?G.success:pos>=17?G.danger:G.muted;
                const real=finalTable[pos];
                return [
                  <div key={`p${pos}`} style={{ fontWeight:800, color:zoneColor, paddingTop:3 }}>{pos}º</div>,
                  ...PLAYERS.map(p=>{
                    const g=tableGuesses[p.id]?.[pos];
                    const hit=real&&g&&real===g;
                    return <div key={p.id} style={{ textAlign:"center", background:hit?"#14532d":"transparent", color:hit?G.success:g?G.text:G.muted, borderRadius:3, padding:"2px 1px" }}>{g||"—"}</div>;
                  })
                ];
              })}
            </div>
          </div>

          {/* Pagamentos */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18, marginBottom:14 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.accent, marginBottom:14 }}>💰 PAGAMENTOS</div>
            {PLAYERS.map(p => (
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${G.border}` }}>
                <span style={{ fontSize:13, fontWeight:700 }}>{p.name}</span>
                <div style={{ display:"flex", gap:6 }}>
                  {["pendente","pago"].map(s => (
                    <button key={s} onClick={()=>setPayment(p.id,s)}
                      style={{ padding:"6px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:11, fontWeight:800,
                        background:payments[p.id]===s?(s==="pago"?G.success:G.warn):G.card2,
                        color:payments[p.id]===s?"#000":G.muted }}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Resultados por rodada */}
          <div style={{ background:G.card, border:`1px solid ${G.border}`, borderRadius:14, padding:18 }}>
            <div style={{ fontWeight:900, fontSize:14, color:G.accent, marginBottom:14 }}>📝 INSERIR RESULTADOS</div>
            <div ref={adminStripRef} style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:12, scrollbarWidth:"none" }}>
              {ROUNDS.map(r => {
                const done = matchesByRound[r].every(m => results[m.id]?.home!=null && results[m.id]?.home!=="");
                return (
                  <button key={r} data-round={r} onClick={()=>setActiveRound(r)}
                    style={{ flexShrink:0, padding:"5px 10px", borderRadius:7, border:`2px solid ${r===activeRound?G.accent2:G.border}`,
                      background:r===activeRound?G.accent2+"22":G.card, color:r===activeRound?G.accent2:G.muted,
                      fontSize:11, fontWeight:800, cursor:"pointer", position:"relative" }}>
                    R{r}
                    {done && <span style={{ position:"absolute", top:-3, right:-3, background:G.success, borderRadius:"50%", width:7, height:7, display:"block" }}/>}
                  </button>
                );
              })}
            </div>
            {(matchesByRound[activeRound]||[]).map(m => (
              <div key={m.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0", borderBottom:`1px solid ${G.border}22` }}>
                <span style={{ fontSize:11, color:G.muted, minWidth:20 }}>{m.round}</span>
                <span style={{ fontSize:12, color:G.text, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.home} × {m.away}</span>
                <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
                  <input type="number" min="0" max="20"
                    value={results[m.id]?.home ?? ""}
                    onChange={e => setResult(m.id,"home",e.target.value===""?"":Number(e.target.value))}
                    style={{ width:38, textAlign:"center", background:G.card2, border:`1px solid ${G.border}`, color:G.text, borderRadius:7, padding:"5px 2px", fontSize:15, fontWeight:800, outline:"none" }}/>
                  <span style={{ color:G.muted }}>×</span>
                  <input type="number" min="0" max="20"
                    value={results[m.id]?.away ?? ""}
                    onChange={e => setResult(m.id,"away",e.target.value===""?"":Number(e.target.value))}
                    style={{ width:38, textAlign:"center", background:G.card2, border:`1px solid ${G.border}`, color:G.text, borderRadius:7, padding:"5px 2px", fontSize:15, fontWeight:800, outline:"none" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      </div>
    </div>
  );
}
