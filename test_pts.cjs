function calcPts(pred, real) {
  if (!real || real.home == null) return null;
  if (!pred || pred.home == null) return 0;
  const rh=+real.home, ra=+real.away, ph=+pred.home, pa=+pred.away;
  if (ph===rh && pa===ra) return 25;
  const rw = rh>ra?"H":ra>rh?"A":"D", pw = ph>pa?"H":pa>ph?"A":"D";
  if (rw!==pw) return 0;
  if (rw==="D") return 10;
  if (ph===rh) return 18;
  if (pa===ra) return 18;
  if (rh-ra===ph-pa) return 15;
  if (rw==="H"&&pa===ra) return 12;
  if (rw==="A"&&ph===rh) return 12;
  return 10;
}

const tests = [
  // Exatos
  [{home:1,away:1},{home:1,away:1},25,"exato empate"],
  [{home:2,away:1},{home:2,away:1},25,"exato vitória"],
  // Empate acertado gols diferentes
  [{home:2,away:2},{home:1,away:1},10,"empate gols dif"],
  [{home:0,away:0},{home:1,away:1},10,"empate gols dif 2"],
  [{home:3,away:3},{home:2,away:2},10,"empate gols dif 3"],
  // Vitória acertada
  [{home:2,away:0},{home:2,away:1},18,"vitória gols venc iguais"],
  [{home:2,away:0},{home:3,away:1},15,"vitória saldo igual"],
  [{home:2,away:0},{home:1,away:0},12,"vitória gols perd iguais"],
  [{home:2,away:0},{home:3,away:0},12,"vitória gols perd iguais 2"],
  [{home:2,away:0},{home:3,away:2},10,"vitória só resultado"],
  // Erro
  [{home:2,away:0},{home:0,away:1},0,"errou resultado"],
];

let ok = true;
tests.forEach(([pred,real,expected,label]) => {
  const got = calcPts(pred, real);
  const pass = got === expected;
  if (!pass) ok = false;
  console.log((pass?"✅":"❌") + " " + label + ": palpite " + pred.home+"x"+pred.away + " real " + real.home+"x"+real.away + " → " + got + "pts (esperado " + expected + ")");
});
console.log(ok ? "\nTODOS OS TESTES PASSARAM ✅" : "\nFALHAS ENCONTRADAS ❌");
process.exit(ok ? 0 : 1);
