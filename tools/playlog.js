// Textmitschnitt eines ganzen Spiels (Realitätscheck Nov. 2026): spielt mit festem Zufallsstartwert wie sim.js "smart" und
// schreibt alles, was Spieler*innen lesen würden, als Markdown: Monatszeile mit Umfragen, Wirtschaft, Regierung, dann jede
// Szene mit Text, Optionen (=> gewählt, [x] gesperrt) und Szenen-ID. Bauen vorher: npx dendrynexus make-html
// Aufruf: node tools/playlog.js . <spd|linke> <startwert> <ausgabe.md> [Regex bevorzugter Auswahl-IDs]
const path = require('path'), fs = require('fs');
const repo = path.resolve(process.argv[2]);
const engine = require(path.join(repo, 'node_modules/dendrynexus/lib/engine.js'));
const json = fs.readFileSync(path.join(repo, 'out/game.json'), 'utf8');
const party = process.argv[3] || 'spd', seed0 = +process.argv[4] || 1, outfile = process.argv[5];
const PREF = process.argv[6] ? new RegExp(process.argv[6]) : null;
let seed = seed0; Math.random = function () { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
global.window = {}; global.document = { getElementById: () => null };
const _log = console.log; const jsErr = []; console.log = (a, b) => { if (a === 'Error:') jsErr.push(String(b && b.message || b)); };
const out = [];
function flat(p) {
  if (p == null) return '';
  if (typeof p === 'string') return p;
  if (Array.isArray(p)) return p.map(flat).join('');
  if (typeof p === 'object') {
    if (p.type === 'paragraph' || p.type === 'heading' || p.type === 'quotation' || p.type === 'hrule') return '\n' + (p.type === 'heading' ? '### ' : '') + flat(p.content) + '\n';
    if (p.type === 'emphasis-1') return '*' + flat(p.content) + '*';
    if (p.type === 'emphasis-2') return '**' + flat(p.content) + '**';
    if (p.type === 'line-break') return '\n';
    if (p.type === 'magic') return '';
    return flat(p.content);
  }
  return String(p);
}
function UI() {} engine.UserInterface.makeParentOf(UI);
UI.prototype.displayContent = function (paragraphs) { const t = flat(paragraphs).replace(/\n{3,}/g, '\n\n').trim(); if (t) out.push(t); };
UI.prototype.newPage = function () { out.push('\n---'); };
const SKIP = /debug_start|easy_discard|cancel_advisor_action|library|backSpecialScene|credits|election_simulation|custom|mod_loader/;
const BAD = /bundestagswahl\.no_majority$|bundestagswahl\.lk_keine_duldung$|bundestagswahl\.new_elections$|reduce_spending|promise_cuts|bring_down|destroy|austerity|cut_benefits|sozial_kuerzen|vote_yes|give_up|\.accept$|regressive|cut_rich|raise_poor|support_employers|markt|let_it_happen|resign|nothing_to_do|ban_klima|persecute_klima|\.alter$|kaas|trad_major|buendnisarbeit\.distanz/;
engine.convertJSONToGame(json, function (err, game) {
  const ui = new UI(); const e = new engine.DendryEngine(ui, game); ui.dendryEngine = e; e.beginGame();
  let lastMonth = '';
  const P = ['spd', 'union', 'afd', 'gruene', 'linke', 'bsw', 'fdp'];
  for (let s = 0; s < 9000 && !e.state.gameOver; s++) {
    const Q = e.state.qualities, k = Q.year + '-' + Q.month;
    if (k !== lastMonth) {
      lastMonth = k;
      out.push('\n\n## ' + k + ' | Umfrage ' + P.map(p => p + ' ' + (Math.round(1000 * (Q[p + '_normalized'] || 0)) / 10)).join(', ') + ' | ALQ ' + (+Q.unemployed).toFixed(1) + ' Infl ' + (+Q.inflation).toFixed(1) + ' BIP ' + (+Q.economic_growth).toFixed(1) + ' | Haushalt ' + Q.budget + ' Ressourcen ' + Q.resources + ' | Kanzler ' + Q.chancellor + ' (' + Q.coalition_name + ') | Unmut ' + Math.round(100 * Q.dissent) + ' | Vertrauen ' + Math.round(Q.pro_republic) + ' | Union-Verh. ' + Math.round(Q.union_relation) + ' | Brandmauer ' + Q.brandmauer + ' | energy ' + Math.round(Q.energy_price || 0) + ' | mig ' + Q.mig_sal + ' | Arbeitsmin ' + Q.labor_minister + ' | BP ' + Q.president);
    }
    let all; try { all = e.getCurrentChoices() || []; } catch (x) { out.push('!! ERROR ' + x); break; }
    let ch = all.filter(c => c.canChoose !== false && !SKIP.test(c.id));
    if (e.state.sceneId.startsWith('game_over')) ch = ch.filter(c => /end_game/.test(c.id));
    if (ch.some(c => /^root\.choose_/.test(c.id))) ch = ch.filter(c => c.id === 'root.choose_' + party);
    if (ch.some(c => /^root\.intro_/.test(c.id))) { const n = ch.filter(c => /intro_main|intro_linke|normal/.test(c.id)); if (n.length) ch = n; }
    const g = ch.filter(c => !BAD.test(c.id)); if (g.length) ch = g;
    if (PREF) { const p = ch.filter(c => PREF.test(c.id)); if (p.length) ch = p; }
    if (!ch.length) ch = all.filter(c => c.canChoose !== false);
    if (!ch.length) { out.push('!! STUCK ' + e.state.sceneId); break; }
    const c = ch[Math.floor(Math.random() * ch.length)];
    const opts = all.filter(x => !SKIP.test(x.id)).map(x => (x === c ? '  => ' : '     ') + (x.canChoose === false ? '[x] ' : '') + flat(x.title).trim() + (x.subtitle ? ' — ' + flat(x.subtitle).trim() : '') + '  {' + x.id + '}');
    if (all.length > 1 || !/^main$/.test(e.state.sceneId)) out.push('\n[' + e.state.sceneId + '] Optionen:\n' + opts.join('\n'));
    try { e.choose(all.indexOf(c)); } catch (x) { out.push('!! EXC ' + x); }
  }
  const Q = e.state.qualities;
  out.push('\n\nENDE ' + Q.year + '-' + Q.month + ' Kanzler ' + Q.chancellor + ' ' + Q.coalition_name + ' JS-Fehler: ' + jsErr.slice(0, 5).join(' | '));
});
console.log = _log;
fs.writeFileSync(outfile, out.join('\n'));
_log('written', outfile, out.length);
