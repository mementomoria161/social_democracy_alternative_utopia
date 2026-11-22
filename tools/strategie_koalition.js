// Strategie-Abgleich (Koalition): fünf Grundstrategien der SPD (basis, schwarzrot, mischweg, dein_weg, r2g_bruch, forschung)
// auf dem plausiblen Grundspiel; Ausgabe: Umfrage Januar 2029, Verhältnisse, Regierung ab April 2029, Ergebnis Ende 2030.
// Aufruf: node tools/strategie_koalition.js . out/game.json 60 forschung
const path=require('path'); const repo=path.resolve(process.argv[2]);
const engine=require(path.join(repo,'node_modules/dendrynexus/lib/engine.js'));
const json=require('fs').readFileSync(process.argv[3],'utf8'); const N=+process.argv[4], name=process.argv[5];
global.window={}; global.document={getElementById:()=>null}; const _log=console.log; console.log=()=>{};
function UI(){} engine.UserInterface.makeParentOf(UI);
const SKIP=/debug_start|easy_discard|cancel_advisor_action|library|backSpecialScene|credits|election_simulation|custom|mod_loader/;
const BAD0='bundestagswahl\\.no_majority$|bundestagswahl\\.lk_keine_duldung$|bundestagswahl\\.new_elections$|reduce_spending|promise_cuts|bring_down|destroy|austerity|cut_benefits|sozial_kuerzen|vote_yes|give_up|\\.accept$|regressive|cut_rich|raise_poor|support_employers|markt|let_it_happen|resign|nothing_to_do|ban_klima|persecute_klima|\\.alter$|kaas|trad_major|buendnisarbeit\\.distanz';
const UNION='^inter_party_relationships$|inter_party_relationships\\.(center|center_op|center_coalition|center_bruning)$|coalition_affairs\\.resources$|vote_of_no_confidence\\.(try_assuage|resources)$|dealing_with_toleration\\.improve_relations$|enemies\\.anti_dem$|emergency_cuts\\.vote_yes$';
const UNION_ELECT='bundestagswahl\\.(grand_coalition|weimar_coalition|new_grand_coalition)$';
const LEFT='^inter_party_relationships$|inter_party_relationships\\.(kpd|linke_1|linke_2|linke_blutmai|liberals)$|vote_of_no_confidence\\.(support_linke|support_linke_2)$|coalition_affairs\\.no_change$';
const R2G_ELECT='bundestagswahl\\.(popular_front_coalition|rotgruen_coalition|left_coalition)$';
const BREAK='coalition_affairs\\.bring_down$|vote_of_no_confidence\\.let_it_happen|dealing_with_toleration\\.(break_toleration|vonc)$|emergency_cuts\\.vote_no$';
const P={
 basis:       {pref:null, allow:''},
 schwarzrot:  {pref:UNION+'|'+UNION_ELECT, allow:'vote_yes'},
 mischweg:    {pref:LEFT+'|enemies\\.far_right$|'+R2G_ELECT, allow:''},
 dein_weg:    {pref:LEFT+'|enemies\\.far_right$|'+R2G_ELECT, allow:'', late:{year:2028, pref:LEFT+'|'+R2G_ELECT+'|'+BREAK, allow:'bring_down|let_it_happen'}},
 forschung:   {pref:UNION_ELECT+'|vote_of_no_confidence\\.(try_assuage|resources)$|coalition_affairs\\.no_change$|black_thursday\\.do_something$|^crisis_program$|crisis_program\\.support_labor$|^economic_policy$|economic_policy\\.(implement_wtb|wtb_)|^social_welfare$|social_welfare\\.increase_spending|^labor_rights$|labor_rights\\.(labor_rights_menu|working_hours|shorten_hours|safety)$|enemies\\.nsdap$', allow:''},
 r2g_bruch:   {pref:LEFT+'|enemies\\.bourgeois$|'+R2G_ELECT, allow:'', late:{year:2027, pref:LEFT+'|'+R2G_ELECT+'|'+BREAK, allow:'bring_down|let_it_happen'}},
}[name];
const mk=(allow)=>{ let b=BAD0; for(const a of allow.split('|').filter(Boolean)) b=b.split('|').filter(x=>x!==a).join('|'); return new RegExp(b); };
const out=[]; let errs=0;
for(let run=0;run<N;run++){
 engine.convertJSONToGame(json,(err,game)=>{
  const ui=new UI(); const e=new engine.DendryEngine(ui,game); ui.dendryEngine=e; e.beginGame();
  const snap={}; let gov29=null, broke=null;
  for(let s=0;s<8000&&!e.state.gameOver;s++){
    let all; try{all=e.getCurrentChoices()||[];}catch(x){errs++;break;}
    const Q0=e.state.qualities; const late=P.late && Q0.year>=P.late.year;
    const pref=late?P.late.pref:P.pref, bad=mk(late?P.late.allow:P.allow);
    let ch=all.filter(c=>c.canChoose!==false&&!SKIP.test(c.id));
    if(e.state.sceneId.startsWith('game_over')) ch=ch.filter(c=>/end_game/.test(c.id));
    if(ch.some(c=>/^root\.choose_/.test(c.id))) ch=ch.filter(c=>c.id==='root.choose_spd');
    const g=ch.filter(c=>!bad.test(c.id)); if(g.length) ch=g;
    if(pref){ const p=ch.filter(c=>new RegExp(pref).test(c.id)); if(p.length) ch=p; }
    if(!ch.length) ch=all.filter(c=>c.canChoose!==false); if(!ch.length) break;
    const c=ch[Math.floor(Math.random()*ch.length)];
    if(!broke && new RegExp(BREAK).test(c.id)) broke=Q0.year+'-'+Q0.month;
    try{e.choose(all.indexOf(c));}catch(x){errs++;break;}
    const Q=e.state.qualities, k=Q.year+'-'+Q.month;
    if(k==='2029-1' && !snap.pre) snap.pre={pp:Q.spd_votes, afd:Q.afd_votes, u:Q.union_votes, g:Q.gruene_votes, l:Q.linke_votes, ur:Math.round(Q.union_relation), lr:Math.round(Q.linke_relation), gr:Math.round(Q.gruene_relation), dis:Math.round(100*Q.dissent), coal:Q.coalition_name};
    if(Q.year===2029 && Q.month>=4 && !gov29) gov29=Q.coalition_name+(Q.spd_in_government?'':' (SPD draußen)');
  }
  const Q=e.state.qualities;
  out.push({end:Q.year+'-'+Q.month, pre:snap.pre, gov29, broke, ppGov:!!Q.spd_in_government, ppChanc:Q.chancellor_party==='SPD', afdGov:Q.coalition_name==='Schwarz-Blau'||Q.coalition_name==='AfD-BSW'||Q.chancellor_party==='AfD'});
 });
}
console.log=_log;
const m=(a)=>a.length?(a.reduce((x,y)=>x+y,0)/a.length):NaN, f=(x)=>isNaN(x)?'–':x.toFixed(1);
const pre=out.filter(r=>r.pre).map(r=>r.pre);
const govs={}; out.forEach(r=>{const k=r.gov29||'keine Wahl 2029/Spiel vorher zu Ende'; govs[k]=(govs[k]||0)+1;});
_log('== '+name+' (n'+N+', Fehler '+errs+')');
_log('  Jan 2029 Umfrage: SPD '+f(m(pre.map(p=>p.pp)))+' | Union '+f(m(pre.map(p=>p.u)))+' | Grüne '+f(m(pre.map(p=>p.g)))+' | Linke '+f(m(pre.map(p=>p.l)))+' | AfD '+f(m(pre.map(p=>p.afd)))+' | R2G-Summe '+f(m(pre.map(p=>p.pp+p.g+p.l))));
_log('  Verhältnis Jan 2029: Union '+f(m(pre.map(p=>p.ur)))+' | Linke '+f(m(pre.map(p=>p.lr)))+' | Grüne '+f(m(pre.map(p=>p.gr)))+' | Unmut '+f(m(pre.map(p=>p.dis)))+' | Koalition bis 2029 gebrochen: '+out.filter(r=>r.broke&&r.broke<'2029').length);
_log('  Regierung ab April 2029: '+Object.entries(govs).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+' '+v).join(', '));
_log('  Ende: SPD regiert '+out.filter(r=>r.ppGov).length+', SPD-Kanzler '+out.filter(r=>r.ppChanc).length+', AfD in Regierung '+out.filter(r=>r.afdGov).length+', reguläres Ende '+out.filter(r=>r.end==='2030-12').length);
