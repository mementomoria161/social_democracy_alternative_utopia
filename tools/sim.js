// Headless random playthroughs of the compiled game (build first: npx dendrynexus make-html).
// Usage: node tools/sim.js . <runs> [spd|linke] [smart]   (without a party the runs alternate SPD/Linke)
// Snapshots: player party / Union / AfD / Grüne / other left party / unemployment (slot spd = player, slot linke = other left party).
const path = require('path');
const repo = path.resolve(process.argv[2] || '.');
const engine = require(path.join(repo, 'node_modules/dendrynexus/lib/engine.js'));
const fs = require('fs');
const json = fs.readFileSync(path.join(repo, 'out/game.json'), 'utf8');
const _log = console.log; console.log = () => {}; global.window = {}; global.document = { getElementById: () => null };

function UI() {}
engine.UserInterface.makeParentOf(UI);

const BAD = /reduce_spending|promise_cuts|bring_down|destroy|austerity|cut_benefits|sozial_kuerzen|vote_yes|give_up|\.accept$|regressive|cut_rich|raise_poor|support_employers|markt|let_it_happen|resign|nothing_to_do|ban_klima|persecute_klima|\.alter$|kaas|trad_major/;
const SKIP = /easy_discard|cancel_advisor_action|library|backSpecialScene|credits|election_simulation|custom|mod_loader/;
const runs = +process.argv[3] || 10, opts = process.argv.slice(4), smartAll = opts.includes('smart');
const party = opts.find(o => o === 'spd' || o === 'linke');
const summary = [], errs = {};
let goCount = 0, lastScenes = [];
const origGo = engine.DendryEngine.prototype.goToScene;
engine.DendryEngine.prototype.goToScene = function (id) {
  lastScenes.push(id); if (lastScenes.length > 30) lastScenes.shift();
  if (++goCount > 400) throw new Error('LOOP ' + lastScenes.slice(-12).join(' > '));
  return origGo.apply(this, arguments);
};

for (let run = 0; run < runs; run++) {
  const smart = smartAll || run % 2 === 1;
  const player = party || (Math.floor(run / 2) % 2 ? 'linke' : 'spd');
  engine.convertJSONToGame(json, function (err, game) {
    if (err) throw err;
    const ui = new UI();
    const e = new engine.DendryEngine(ui, game);
    ui.dendryEngine = e;
    e.beginGame();
    const snap = {}, end = new Set(), events = new Set();
    let steps = 0;
    for (; steps < 8000 && !e.state.gameOver; steps++) {
      let all;
      try { all = e.getCurrentChoices() || []; } catch (x) { (errs[String(x).slice(0, 120)] ||= []).push(e.state.sceneId); break; }
      let ch = all.filter(c => c.canChoose !== false && !SKIP.test(c.id));
      if (e.state.sceneId.startsWith('game_over')) ch = ch.filter(c => /end_game/.test(c.id)).concat([]);
      if (ch.some(c => /^root\.choose_/.test(c.id))) ch = ch.filter(c => c.id === 'root.choose_' + player);
      if (smart) { const g = ch.filter(c => !BAD.test(c.id)); if (g.length) ch = g; }
      if (!ch.length) ch = all.filter(c => c.canChoose !== false);
      if (!ch.length) { (errs['stuck'] ||= []).push(e.state.sceneId); break; }
      const c = ch[Math.floor(Math.random() * ch.length)];
      if (/^game_over\./.test(c.id)) end.add(c.id.slice(10));
      if (/let_it_happen|bring_down|destroy|vote_no$|end_toleration|\.vonc$|accept_election|new_elections_2|_vote_of_no_confidence$|^vote_of_no_confidence$/.test(c.id) || /vote_of_no_confidence/.test(e.state.sceneId)) end.add('@'+e.state.qualities.year+'-'+e.state.qualities.month+':'+c.id);
      goCount = 0;
      try { e.choose(all.indexOf(c)); }
      catch (x) { const k = String(x).slice(0, 300); (errs[k] ||= []).push(c.id); if (/LOOP/.test(k)) break; }
      const Q = e.state.qualities;
      const sid = e.state.sceneId.split('.')[0];
      if (e.game.scenes[sid] && (e.game.scenes[sid].tags || []).includes('event')) events.add(sid);
      const k = Q.year + '-' + Q.month;
      if (k === '2025-6' && !snap.gov25) snap.gov25 = Q.coalition_name + '/' + Q.chancellor + '/sv' + Q.sondervermoegen + '/' + Q.spd_candidate;
      if (k === '2025-2' || k === '2025-12' || k === '2026-11' || k === '2027-12' || k === '2029-3' || k === '2030-6') snap[k] = snap[k] || [Q.spd_votes, Q.union_votes, Q.afd_votes, Q.gruene_votes, Q.linke_votes, (+Q.unemployed).toFixed(1)].join('/');
    }
    const Q = e.state.qualities;
    summary.push({ run, player: Q.player, smart, end: Q.year + '-' + Q.month, steps, snap, chancellor: Q.chancellor + '(' + Q.chancellor_party + ')', president: Q.president, btw1: (Q.election_records[0] ? ['spd','union','afd','gruene','linke','bsw','fdp'].map(p => Math.round(Q.election_records[0][p]*10)/10).join('/') + '@' + new Date(Q.election_records[0].date).toISOString().slice(0,7) : ''), dm: Q.direct_mandates, coalition: Q.coalition_name, events: events.size, trig: [...end].filter(x=>x[0]=='@').slice(0,6) });
    global.__events = (global.__events || new Set()); events.forEach(x => __events.add(x));
  });
}
console.log = _log;
console.log('Legende: snap = Spielerpartei/Union/AfD/Grüne/andere linke Partei/ALQ, btw1 = Sitzanteile Spielerpartei/Union/AfD/Grüne/andere linke Partei/BSW/FDP (Spielerpartei SPD oder Linke, siehe player)');
for (const s of summary) console.log(JSON.stringify(s));
console.log('ERRORS:'); for (const [k, v] of Object.entries(errs)) console.log(v.length + 'x ' + k + '  <- ' + [...new Set(v)].slice(0, 4).join(','));
console.log('EVENTS SEEN (' + __events.size + '): ' + [...__events].sort().join(' '));
