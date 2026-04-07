function calcPts(pred, real) {
  const rh=+real.home, ra=+real.away, ph=+pred.home, pa=+pred.away;
  if (ph===rh && pa===ra) return 25;
  const rw = rh>ra?"H":ra>rh?"A":"D", pw = ph>pa?"H":pa>ph?"A":"D";
  if (rw!==pw) return 0;
  if (rw==="D") return 10;
  if (rw==="H") {
    if (ph===rh) return 18;
    if (rh-ra===ph-pa) return 15;
    if (pa===ra) return 12;
    return 10;
  }
  if (pa===ra) return 18;
  if (rh-ra===ph-pa) return 15;
  if (ph===rh) return 12;
  return 10;
}

// Debug dos casos que falham
console.log("palpite 2x0 real 1x0:", calcPts({home:2,away:0},{home:1,away:0}), "(esperado 12)");
console.log("palpite 3x0 real 2x0:", calcPts({home:3,away:0},{home:2,away:0}), "(esperado 12)");
// A lógica: rw=H, ph=2!=rh=1, saldo 2-0=2 vs 1-0=1 diferente, pa=0==ra=0 → 12
// Mas o teste .cjs anterior dava 18 — porque o test_pts.cjs tem a função antiga?
console.log("\npalpite 2x1 real 2x0:", calcPts({home:2,away:1},{home:2,away:0}), "(esperado 18 - gols venc)");
console.log("palpite 1x0 real 2x0:", calcPts({home:1,away:0},{home:2,away:0}), "(esperado 12 - gols perd)");
