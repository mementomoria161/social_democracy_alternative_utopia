// Strategie-Abgleich (Karten): plausibles Grundspiel wie sim.js smart, dazu eine bevorzugte Strategie als regulärer Ausdruck auf
// die Auswahl-IDs. Zweck: Was im Spiel am meisten bringt, soll zur Forschung passen (PORT_2026.md, Nachtrag Balance nach der Forschung).
// Aufruf: node tools/strategie_karten.js . out/game.json 60 <name> '<regex>|-' [spd|linke]
// Beispiel: node tools/strategie_karten.js . out/game.json 60 medien '^media$|media\.(campaign|radio)|^main\.party$'
const path=require('path'); const repo=path.resolve(process.argv[2]);
const engine=require(path.join(repo,'node_modules/dendrynexus/lib/engine.js'));
const json=require('fs').readFileSync(process.argv[3],'utf8');
const N=+process.argv[4], name=process.argv[5], PREF=process.argv[6]==='-'?null:new RegExp(process.argv[6]), party=process.argv[7]||'spd';
global.window={}; global.document={getElementById:()=>null}; const _log=console.log; console.log=()=>{};
function UI(){} engine.UserInterface.makeParentOf(UI);
const SKIP=/easy_discard|cancel_advisor_action|library|backSpecialScene|credits|election_simulation|custom|mod_loader/;
const BAD=/bundestagswahl\.no_majority$|bundestagswahl\.new_elections$|reduce_spending|promise_cuts|bring_down|destroy|austerity|cut_benefits|sozial_kuerzen|vote_yes|give_up|\.accept$|regressive|cut_rich|raise_poor|support_employers|markt|let_it_happen|resign|nothing_to_do|ban_klima|persecute_klima|\.alter$|kaas|trad_major|buendnisarbeit\.distanz/;
const out=[]; let errs=0, hits=0;
for(let run=0;run<N;run++){
 engine.convertJSONToGame(json,(err,game)=>{
  const ui=new UI(); const e=new engine.DendryEngine(ui,game); ui.dendryEngine=e; e.beginGame();
  const snap={}; let used=0;
  for(let s=0;s<8000&&!e.state.gameOver;s++){
    let all; try{all=e.getCurrentChoices()||[];}catch(x){errs++;break;}
    let ch=all.filter(c=>c.canChoose!==false&&!SKIP.test(c.id));
    if(e.state.sceneId.startsWith('game_over')) ch=ch.filter(c=>/end_game/.test(c.id));
    if(ch.some(c=>/^root\.choose_/.test(c.id))) ch=ch.filter(c=>c.id==='root.choose_'+party);
    const PREF_BAD = PREF && /vote_yes|promise_cuts/.test(PREF.source);
    const bad = PREF_BAD ? new RegExp(BAD.source.replace('vote_yes|','').replace('promise_cuts|','')) : BAD;
    const g=ch.filter(c=>!bad.test(c.id)); if(g.length) ch=g;
    if(PREF){ const p=ch.filter(c=>PREF.test(c.id)); if(p.length){ ch=p; used++; } }
    if(!ch.length) ch=all.filter(c=>c.canChoose!==false); if(!ch.length) break;
    const c=ch[Math.floor(Math.random()*ch.length)];
    try{e.choose(all.indexOf(c));}catch(x){errs++;break;}
    const Q=e.state.qualities, k=Q.year+'-'+Q.month;
    if((k==='2029-3'||k==='2030-12'||k==='2026-11') && !snap[k]) snap[k]={pp:Q.spd_votes, afd:Q.afd_votes, union:Q.union_votes, alq:+(+Q.unemployed).toFixed(1), gov:Q.spd_in_government, dis:Math.round(100*Q.dissent)};
  }
  const Q=e.state.qualities;
  out.push({end:Q.year+'-'+Q.month, snap, used, ppGov:!!Q.spd_in_government, ppChanc:Q.chancellor_party==='SPD', afdGov:Q.coalition_name==='Schwarz-Blau'||Q.coalition_name==='AfD-BSW'||Q.chancellor_party==='AfD', wp:Q.works_program||0, coal:Q.coalition_name});
 });
}
console.log=_log;
const m=(a)=>a.length?(a.reduce((x,y)=>x+y,0)/a.length):NaN, f=(x)=>isNaN(x)?'  –  ':x.toFixed(1);
const s29=out.filter(r=>r.snap['2029-3']), s30=out.filter(r=>r.snap['2030-12']);
_log([name.padEnd(14), 'n'+N, 'genutzt '+f(m(out.map(r=>r.used))), 'Partei 3/29 '+f(m(s29.map(r=>r.snap['2029-3'].pp))), 'Partei 12/30 '+f(m(s30.map(r=>r.snap['2030-12'].pp))),
  'AfD 3/29 '+f(m(s29.map(r=>r.snap['2029-3'].afd))), 'ALQ 3/29 '+f(m(s29.map(r=>r.snap['2029-3'].alq))), 'Unmut 3/29 '+f(m(s29.map(r=>r.snap['2029-3'].dis))),
  'regiert Ende '+out.filter(r=>r.ppGov).length, 'Kanzler '+out.filter(r=>r.ppChanc).length, 'AfD-Reg '+out.filter(r=>r.afdGov).length, 'Ende 12/30 '+s30.length, 'Fehler '+errs, 'Investitionsprogramm>0 '+out.filter(r=>r.wp>0).length].join(' | '));
