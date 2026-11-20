// Headless random playthroughs of the compiled game (build first: npx dendrynexus make-html).
// Usage: node tools/sim.js . <runs> [spd|linke] [smart]   (without a party the runs alternate SPD/Linke)
// Snapshots: player party / Union / AfD / Grüne / other left party / unemployment (slot spd = player, slot linke = other left party).
const path = require('path');
const repo = path.resolve(process.argv[2] || '.');
const engine = require(path.join(repo, 'node_modules/dendrynexus/lib/engine.js'));
const fs = require('fs');
const json = fs.readFileSync(path.join(repo, 'out/game.json'), 'utf8');
const _log = console.log; global.window = {}; global.document = { getElementById: () => null };
// the engine swallows errors in scene scripts and only logs 'Error:', err: count them as errors
// (ignored: browser-only scripts that need d3 or window.dendryUI)
console.log = (a, b) => { if (a === 'Error:' && !/d3 is not defined|reading 'dendryEngine'/.test(String(b))) (errs['JS ' + String(b && b.stack || b).split(/\r?\n/).slice(0, 2).join(' ').slice(0, 200)] ||= []).push(lastScenes[lastScenes.length - 1]); };

function UI() {}
engine.UserInterface.makeParentOf(UI);

const BAD = /reduce_spending|promise_cuts|bring_down|destroy|austerity|cut_benefits|sozial_kuerzen|vote_yes|give_up|\.accept$|regressive|cut_rich|raise_poor|support_employers|markt|let_it_happen|resign|nothing_to_do|ban_klima|persecute_klima|\.alter$|kaas|trad_major|buendnisarbeit\.distanz/;
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
      // Klima (4.6): Emissionen (Jahresrate, Mt), Prognose 2030, Status, Erneuerbare, Haushaltsstrom
      if ((k === '2025-12' || k === '2026-11' || k === '2028-12' || k === '2030-12') && !(snap.cl || {})[k]) (snap.cl ||= {})[k] = [Q.cl_total, Q.cl_p2030, Q.cl_status, Q.cl_ee, (Q.cl_price || [])[0], Math.round(Q.energy_price), Q.cl_budget_year].join('/');
      if (/^(2025-12|2026-6|2026-11|2027-12|2029-3)$/.test(k) && !(snap.p || {})[k]) (snap.p ||= {})[k] = ['spd','union','afd','gruene','linke','bsw','fdp'].map(p => Math.round(100 * (Q[p + '_normalized'] || 0) * 10) / 10);
      if (k === '2025-2' || k === '2025-12' || k === '2026-11' || k === '2027-12' || k === '2029-3' || k === '2030-6') snap[k] = snap[k] || [Q.spd_votes, Q.union_votes, Q.afd_votes, Q.gruene_votes, Q.linke_votes, (+Q.unemployed).toFixed(1)].join('/');
    }
    const Q = e.state.qualities;
    summary.push({ run, player: Q.player, smart, end: Q.year + '-' + Q.month, steps, snap, chancellor: Q.chancellor + '(' + Q.chancellor_party + ')', president: Q.president, cdu: Q.union_party_leader + '/bm' + Q.brandmauer + '/ur' + Math.round(Q.union_relation), btw1: (Q.election_records[0] ? ['spd','union','afd','gruene','linke','bsw','fdp'].map(p => Math.round(Q.election_records[0][p]*10)/10).join('/') + '@' + new Date(Q.election_records[0].date).toISOString().slice(0,7) : ''), dm: Q.direct_mandates, coalition: Q.coalition_name, growth: (+Q.economic_growth).toFixed(1), sectors: (Q.sector_growth || []).map(r => r.toFixed(1)).join(','), industry_share: Q.sector_value && Q.sector_value.length ? (100 * Q.sector_value[0] / Q.sector_value.reduce((a, b) => a + b, 0)).toFixed(1) : '', grp: Object.keys(Q).filter(k => /^g_/.test(k)).map(k => k.slice(2) + Math.round(Q[k]) + '/' + Math.round(Q['gr_' + k.slice(2)])).join(' '), dissent: Math.round(Q.dissent * 100), pdeb: Q.palestine_debate, clim: { y2030: Q.cl_y2030, p2030: Q.cl_p2030, status: Q.cl_status, cum2045: Q.cl_cum_2045, budget_year: Q.cl_budget_year, kp: ['kohle','ee','netz','waerme','bahn','tempolimit','eauto','industrie','h2','co2','klimageld'].map(x => Q['kp_' + x] || 0).join('') }, events: events.size, trig: [...end].filter(x=>x[0]=='@').slice(0,6) });
    global.__events = (global.__events || new Set()); events.forEach(x => __events.add(x));
  });
}
console.log = _log;
console.log('Klima: snap.cl = Emissionen Mt/Prognose 2030/Status (0 rot, 1 gelb, 2 grün)/Erneuerbare %/Haushaltsstrom ct/energy_price/Budget aufgebraucht; clim.kp = Maßnahmen kohle,ee,netz,waerme,bahn,tempolimit,eauto,industrie,h2,co2,klimageld');
console.log('Legende: snap = Spielerpartei/Union/AfD/Grüne/andere linke Partei/ALQ, btw1 = Sitzanteile Spielerpartei/Union/AfD/Grüne/andere linke Partei/BSW/FDP (Spielerpartei SPD oder Linke, siehe player)');
for (const s of summary) console.log(JSON.stringify(s));
console.log('ERRORS:'); for (const [k, v] of Object.entries(errs)) console.log(v.length + 'x ' + k + '  <- ' + [...new Set(v)].slice(0, 4).join(','));
console.log('EVENTS SEEN (' + __events.size + '): ' + [...__events].sort().join(' '));
