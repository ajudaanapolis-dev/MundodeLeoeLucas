
const app=document.querySelector("#app");
const fx=document.querySelector("#fx");

let route="home";
let audioReady=false;
let muted=false;
let narration=true;
let reduceMotion=false;
let alphabet=[];
let missions=[];
let puzzles=[];
let selectedLetter=null;
let selectedMission=null;
let selectedTool=null;
let missionState=null;
let selectedPuzzle=null;
let puzzleState=null;

const defaultState={
  lettersExplored:[],
  letterTouches:{},
  leo:{missionsCompleted:{},cluesFound:{},actionsDone:{},diary:[]},
  puzzles:{completed:{},bestTimes:{}},
  settings:{muted:false,narration:true,reduceMotion:false}
};
let state=loadState();
muted=Boolean(state.settings.muted);
narration=state.settings.narration!==false;
reduceMotion=Boolean(state.settings.reduceMotion);
document.body.classList.toggle("reduce-motion",reduceMotion);

const audioNames=["tap","open","success","wrong","magic","water","animal","music","science","puzzle"];
const audios={};

function loadState(){
 try{
  const parsed=JSON.parse(localStorage.getItem("mll-expedicoes-v1")||"null");
  if(parsed)return {
   ...structuredClone(defaultState),
   ...parsed,
   leo:{...structuredClone(defaultState.leo),...(parsed.leo||{})},
   puzzles:{...structuredClone(defaultState.puzzles),...(parsed.puzzles||{})},
   settings:{...structuredClone(defaultState.settings),...(parsed.settings||{})}
  };
 }catch{}
 return structuredClone(defaultState);
}
function save(){
 state.settings={muted,narration,reduceMotion};
 localStorage.setItem("mll-expedicoes-v1",JSON.stringify({...state,savedAt:new Date().toISOString()}));
}
async function loadData(){
 [alphabet,missions,puzzles]=await Promise.all([
  fetch("./data/alphabet.json").then(r=>r.json()),
  fetch("./data/missions.json").then(r=>r.json()),
  fetch("./data/puzzles.json").then(r=>r.json())
 ]);
}
async function unlockAudio(){
 await Promise.all(audioNames.map(name=>new Promise(resolve=>{
  const a=new Audio(`./assets/audio/effects/${name}.wav`);
  a.preload="auto";
  a.addEventListener("canplaythrough",resolve,{once:true});
  a.addEventListener("error",resolve,{once:true});
  a.load();
  audios[name]=a;
 })));
 audioReady=true;
 play("open");
 render();
}
function play(name){
 if(!audioReady||muted)return;
 const a=audios[name]||audios.tap;
 a.currentTime=0;
 a.play().catch(()=>{});
}
function voice(kind,letter){
 if(muted||!narration)return;
 const audio=new Audio(`./assets/audio/voice/${kind}/${letter}.wav`);
 audio.play().catch(()=>speakFallback(kind,letter));
}
function speakFallback(kind,letter){
 const item=alphabet.find(x=>x.letter===letter);
 if(!item||!("speechSynthesis" in window))return;
 const text=kind==="letters"?letter:kind==="words"?`${letter} de ${item.word}`:item.fact;
 const u=new SpeechSynthesisUtterance(text);
 u.lang="pt-BR";u.rate=.82;u.pitch=1.08;
 speechSynthesis.cancel();speechSynthesis.speak(u);
}
function go(next){route=next;play("tap");render();}
function header(title,back="home"){
 return `<div class="topbar">
  <button class="icon" data-go="${back}" aria-label="Voltar">⬅️</button>
  <div class="pill">${title}</div>
  <button class="icon" data-action="mute" aria-label="Som">${muted?"🔇":"🔊"}</button>
 </div>`;
}
function render(){
 if(route==="home")return home();
 if(route==="lucas")return lucasAlphabet();
 if(route==="letter")return letterScene();
 if(route==="leo")return leoMap();
 if(route==="mission")return missionScreen();
 if(route==="puzzles")return puzzlesHome();
 if(route==="puzzle")return puzzleScreen();
 if(route==="settings")return settingsScreen();
 if(route==="parentGate")return parentGate();
 if(route==="parent")return parentArea();
}
function home(){
 app.innerHTML=`<main class="app"><section class="screen">
 <div class="topbar"><div class="pill">Mundo de Léo e Lucas</div><div class="pill">⭐ ${state.lettersExplored.length+Object.keys(state.leo.missionsCompleted).length*5}</div></div>
 <div class="hero"><h1>Mundo de <span>Léo e Lucas</span></h1><p>ABC interativo, expedições científicas e quebra-cabeças.</p></div>
 ${!audioReady?`<div class="audio"><strong>Ativar sons e narração</strong><p>Toque uma vez para liberar áudio e vozes.</p><button class="big peach" data-action="unlock"><span>Começar</span><span>🔊</span></button></div>`:""}
 <div class="home-grid">
  <button class="home-card" data-go="lucas"><div class="face">${lucasSVG()}</div><h2>ABC do Lucas</h2><p>Uma cena por letra, com narração, toque e animação.</p><span class="big blue"><span>Abrir alfabeto</span><span>🔤</span></span></button>
  <button class="home-card" data-go="leo"><div class="face">${leoSVG()}</div><h2>Expedições do Léo</h2><p>10 missões investigativas com ferramentas, pistas e descobertas.</p><span class="big green"><span>Explorar</span><span>🧭</span></span></button>
  <button class="home-card" data-go="puzzles"><div class="face">${puzzleIconSVG()}</div><h2>Quebra-cabeças</h2><p>Modo Lucas e modo Léo com várias imagens e dificuldades.</p><span class="big lav"><span>Montar</span><span>🧩</span></span></button>
 </div>
 <div class="home-tools">
  <button data-go="settings">⚙️ Ajustes</button>
  <button data-go="parentGate">👨‍👩‍👧 Área dos responsáveis</button>
  <button data-action="install">📲 Instalar</button>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-action='install']").onclick=()=>alert("No celular: abra no navegador, toque em Compartilhar/Menu e escolha Adicionar à tela inicial.");
}
function lucasAlphabet(){
 const completed=state.lettersExplored.length;
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("ABC do Lucas","home")}
 <div class="abc-home">
  <div class="guide-card">${professorSVG("point")}</div>
  <div class="alphabet-panel">
   <h2 class="alphabet-title">Escolha uma letra</h2>
   <div class="progress"><div style="width:${(completed/alphabet.length)*100}%"></div></div>
   <div class="alphabet-grid">${alphabet.map(item=>`<button class="letter-btn ${state.lettersExplored.includes(item.letter)?"done":""}" data-letter="${item.letter}">${item.letter}</button>`).join("")}</div>
  </div>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelectorAll("[data-letter]").forEach(b=>b.onclick=()=>{
  selectedLetter=alphabet.find(x=>x.letter===b.dataset.letter);
  route="letter";
  play("open");
  voice("words",selectedLetter.letter);
  render();
 });
}
function letterScene(){
 const x=selectedLetter;
 app.innerHTML=`<main class="app"><section class="screen">
 ${header(`${x.letter} de ${x.word}`,"lucas")}
 <div class="scene-shell">
  <div class="scene-title">Toque em ${x.word.toLowerCase()}</div>
  <div class="scene ${sceneClass(x)}" id="scene">
   <div class="guide-mini">${professorSVG("neutral")}</div>
   <button class="object-wrap" data-action="object" aria-label="${x.word}">${objectSVG(x)}</button>
   <div class="word-card" data-action="fact"><strong>${x.letter}</strong> de ${x.word}</div>
  </div>
 </div>
 <div class="scene-controls">
  <button data-action="letter-voice">🔤 Letra</button>
  <button data-action="word-voice">🗣️ Palavra</button>
  <button data-action="magic">✨ Surpresa</button>
  <button data-action="next-letter">➡️ Próxima</button>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-action='object']").onclick=e=>animateLetter(e.currentTarget,x,e);
 document.querySelector("[data-action='letter-voice']").onclick=()=>voice("letters",x.letter);
 document.querySelector("[data-action='word-voice']").onclick=()=>voice("words",x.letter);
 document.querySelector("[data-action='fact']").onclick=()=>voice("facts",x.letter);
 document.querySelector("[data-action='magic']").onclick=e=>{play("magic");stars(e.clientX,e.clientY);if(sceneClass(x)==="ocean")bubbles();};
 document.querySelector("[data-action='next-letter']").onclick=()=>{
  const i=alphabet.findIndex(a=>a.letter===x.letter);
  selectedLetter=alphabet[(i+1)%alphabet.length];
  voice("words",selectedLetter.letter);
  render();
 };
}
function animateLetter(el,item,event){
 const explored=new Set(state.lettersExplored);explored.add(item.letter);state.lettersExplored=[...explored];
 state.letterTouches[item.letter]=(state.letterTouches[item.letter]||0)+1;save();
 const map={swim:"dance",splash:"jump",crawl:"crawl",snap:"pop",wave:"dance",carry:"crawl",stretch:"pop",fly:"fly",flutter:"fly",openwings:"fly",slice:"pop",roar:"pop",swing:"dance",sail:"crawl",bounce:"jump",pop:"pop",find:"crawl",dance:"dance",jump:"jump",hide:"pop",erupt:"pop",stack:"pop",music:"dance",walk:"crawl",run:"fly"};
 el.classList.remove("fly","jump","dance","pop","crawl");void el.offsetWidth;el.classList.add(map[item.action]||"pop");
 const sound=["splash","swim","wave","sail"].includes(item.action)?"water":["roar","snap"].includes(item.action)?"animal":item.action==="music"?"music":"success";
 play(sound);voice("facts",item.letter);if(["splash","swim","wave"].includes(item.action))bubbles();stars(event.clientX,event.clientY);
}
function leoMap(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Expedições do Léo","home")}
 <div class="hero"><h1>Expedições do <span>Léo</span></h1><p>Use ferramentas, colete pistas e descubra o que está acontecendo.</p></div>
 <div class="map-grid">${missions.map((m,i)=>`<button class="mission-card" data-mission="${m.id}">
  <div><div class="emoji">${missionIcon(m.scene)}</div><h3>${i+1}. ${m.title}</h3><p>${m.subtitle}</p></div>
  <span class="badge">${state.leo.missionsCompleted[m.id]?"✅ concluída":`nível ${m.difficulty}`}</span>
 </button>`).join("")}</div>
 </section></main>`;
 bindCommon();
 document.querySelectorAll("[data-mission]").forEach(b=>b.onclick=()=>startMission(b.dataset.mission));
}
function startMission(id){
 selectedMission=missions.find(m=>m.id===id);
 missionState={found:new Set(),actions:new Set(),selectedTool:null};
 route="mission";play("science");render();
}
function missionScreen(){
 const m=selectedMission;
 app.innerHTML=`<main class="app"><section class="screen">
 ${header(m.title,"leo")}
 <div class="hero"><h1>${m.title}</h1><p>${m.objective}</p></div>
 <div class="mission-scene ${m.scene}" id="missionScene">
  <div class="mission-art">${missionSVG(m.scene)}</div>
  ${m.hotspots.map(h=>`<button class="hotspot ${missionState.found.has(h.id)?"found":""}" data-hotspot="${h.id}" style="left:${h.x}%;top:${h.y}%">🔎</button>`).join("")}
 </div>
 <div class="panel" style="padding:14px;margin-bottom:13px;">
  <strong>Ferramentas</strong>
  <div class="tool-row">${m.tools.map(t=>`<button class="tool ${missionState.selectedTool===t.id?"active":""}" data-tool="${t.id}">${t.icon} ${t.name}</button>`).join("")}</div>
  <strong>Ações</strong>
  <div class="action-row">${m.actions.map(a=>`<button class="action-button" data-action-id="${a.id}">${a.name}</button>`).join("")}</div>
  <div class="status" id="missionStatus">Escolha uma ferramenta e toque nas pistas da cena.</div>
 </div>
 <div class="panel" style="padding:14px;">
  <strong>Pistas coletadas (${missionState.found.size}/${m.hotspots.length})</strong>
  <div class="clue-list">${m.hotspots.map(h=>`<div class="clue ${missionState.found.has(h.id)?"":"empty"}">${missionState.found.has(h.id)?h.clue:"Pista ainda não observada."}</div>`).join("")}</div>
  <button class="big green" style="margin-top:12px" data-action="finish-mission"><span>Registrar descoberta</span><span>📓</span></button>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelectorAll("[data-tool]").forEach(b=>b.onclick=()=>{missionState.selectedTool=b.dataset.tool;play("tap");render();});
 document.querySelectorAll("[data-hotspot]").forEach(b=>b.onclick=()=>hitHotspot(b.dataset.hotspot));
 document.querySelectorAll("[data-action-id]").forEach(b=>b.onclick=()=>doMissionAction(b.dataset.actionId));
 document.querySelector("[data-action='finish-mission']").onclick=finishMission;
}
function hitHotspot(id){
 const h=selectedMission.hotspots.find(x=>x.id===id);
 const status=document.querySelector("#missionStatus");
 if(!missionState.selectedTool){status.textContent="Primeiro escolha uma ferramenta.";play("wrong");return;}
 missionState.found.add(id);
 play("success");
 status.textContent=h.clue;
 render();
}
function doMissionAction(id){
 const action=selectedMission.actions.find(a=>a.id===id);
 missionState.actions.add(id);
 play("magic");
 const status=document.querySelector("#missionStatus");
 if(status)status.textContent=action.effect;
 state.leo.actionsDone[selectedMission.id]=[...(state.leo.actionsDone[selectedMission.id]||[]),id];
 save();
}
function finishMission(){
 if(missionState.found.size<Math.min(2,selectedMission.hotspots.length)){
  alert("Colete pelo menos duas pistas antes de registrar a descoberta.");
  return;
 }
 state.leo.missionsCompleted[selectedMission.id]=new Date().toISOString();
 state.leo.cluesFound[selectedMission.id]=[...missionState.found];
 state.leo.diary.unshift({id:selectedMission.id,title:selectedMission.title,conclusion:selectedMission.conclusion,date:new Date().toLocaleDateString("pt-BR")});
 save();play("success");stars();
 alert(`Descoberta registrada: ${selectedMission.conclusion}`);
 go("leo");
}
function puzzlesHome(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Quebra-cabeças","home")}
 <div class="hero"><h1>Quebra-cabeças</h1><p>Escolha uma imagem. Lucas monta com peças grandes, Léo pode aumentar a dificuldade.</p></div>
 <div class="map-grid">${puzzles.map(p=>`<button class="puzzle-card" data-puzzle="${p.id}">
  <div><div class="emoji">🧩</div><h3>${p.title}</h3><p>Tema: ${p.theme}</p></div><span class="badge">${state.puzzles.completed[p.id]?"✅ montado":"novo"}</span>
 </button>`).join("")}</div>
 </section></main>`;
 bindCommon();
 document.querySelectorAll("[data-puzzle]").forEach(b=>b.onclick=()=>startPuzzle(b.dataset.puzzle));
}
function startPuzzle(id){
 selectedPuzzle=puzzles.find(p=>p.id===id);
 const size=window.confirm("Modo Léo? OK = mais peças, Cancelar = modo Lucas")?3:2;
 const total=size*size;
 const order=[...Array(total).keys()];
 shuffle(order);
 puzzleState={size,order,selected:null,start:Date.now()};
 route="puzzle";render();
}
function puzzleScreen(){
 const size=puzzleState.size;
 const svg=encodeURIComponent(puzzleImageSVG(selectedPuzzle));
 app.innerHTML=`<main class="app"><section class="screen">
 ${header(selectedPuzzle.title,"puzzles")}
 <div class="puzzle-layout">
  <div class="puzzle-preview"><strong>Imagem modelo</strong>${puzzleImageSVG(selectedPuzzle)}</div>
  <div>
   <div class="puzzle-board" style="grid-template-columns:repeat(${size},1fr);--bg-size:${size*100}%">
    ${puzzleState.order.map((idx,pos)=>tileHTML(idx,pos,size,svg)).join("")}
   </div>
   <div class="scene-controls">
    <button data-action="shuffle">🔀 Misturar</button>
    <button data-action="check-puzzle">✅ Conferir</button>
    <button data-action="easy">👶 Lucas</button>
    <button data-action="hard">🧒 Léo</button>
   </div>
  </div>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelectorAll("[data-tile]").forEach(b=>b.onclick=()=>selectTile(+b.dataset.pos));
 document.querySelector("[data-action='shuffle']").onclick=()=>{shuffle(puzzleState.order);render();};
 document.querySelector("[data-action='check-puzzle']").onclick=checkPuzzle;
 document.querySelector("[data-action='easy']").onclick=()=>{puzzleState.size=2;puzzleState.order=[0,1,2,3];shuffle(puzzleState.order);render();};
 document.querySelector("[data-action='hard']").onclick=()=>{puzzleState.size=4;puzzleState.order=[...Array(16).keys()];shuffle(puzzleState.order);render();};
}
function tileHTML(idx,pos,size,svg){
 const x=idx%size,y=Math.floor(idx/size);
 return `<button class="tile ${puzzleState.selected===pos?"selected":""}" data-tile="${idx}" data-pos="${pos}" style="background-image:url('data:image/svg+xml,${svg}');background-position:${size===1?0:(x/(size-1))*100}% ${size===1?0:(y/(size-1))*100}%"></button>`;
}
function selectTile(pos){
 if(puzzleState.selected===null){puzzleState.selected=pos;render();return;}
 const a=puzzleState.selected,b=pos;
 [puzzleState.order[a],puzzleState.order[b]]=[puzzleState.order[b],puzzleState.order[a]];
 puzzleState.selected=null;play("puzzle");render();
}
function checkPuzzle(){
 const ok=puzzleState.order.every((v,i)=>v===i);
 if(ok){
  const seconds=Math.round((Date.now()-puzzleState.start)/1000);
  state.puzzles.completed[selectedPuzzle.id]=new Date().toISOString();
  const key=`${selectedPuzzle.id}:${puzzleState.size}`;
  state.puzzles.bestTimes[key]=Math.min(state.puzzles.bestTimes[key]||9999,seconds);
  save();play("success");stars();alert(`Montado! Tempo: ${seconds}s`);
 }else{play("wrong");alert("Ainda tem peças fora do lugar. Continue tentando.");}
}
function settingsScreen(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Ajustes","home")}
 <div class="panel" style="padding:14px;">
  <div class="settings-grid">
   <div class="setting"><span>🔊 Sons</span><button data-setting="sound">${muted?"Desativados":"Ativados"}</button></div>
   <div class="setting"><span>🗣️ Narração</span><button data-setting="narration">${narration?"Ativada":"Desativada"}</button></div>
   <div class="setting"><span>✨ Movimento reduzido</span><button data-setting="motion">${reduceMotion?"Ativado":"Desativado"}</button></div>
  </div>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-setting='sound']").onclick=()=>{muted=!muted;save();render();};
 document.querySelector("[data-setting='narration']").onclick=()=>{narration=!narration;save();render();};
 document.querySelector("[data-setting='motion']").onclick=()=>{reduceMotion=!reduceMotion;document.body.classList.toggle("reduce-motion",reduceMotion);save();render();};
}
function parentGate(){
 const a=2+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6);
 window.__adult=a+b;
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Área dos responsáveis","home")}
 <div class="parent-lock"><h2>Acesso para adultos</h2><p>Resolva para continuar:</p><input id="adultAnswer" inputmode="numeric" placeholder="${a} + ${b} = ?"><button class="big sand" style="margin-top:12px" data-action="adult"><span>Entrar</span><span>🔐</span></button></div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-action='adult']").onclick=()=>{if(+document.querySelector("#adultAnswer").value===window.__adult)go("parent");else alert("Resposta incorreta.");};
}
function parentArea(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Responsáveis","home")}
 <div class="statgrid">
  <div class="stat"><strong>${state.lettersExplored.length}/26</strong>letras exploradas</div>
  <div class="stat"><strong>${Object.keys(state.leo.missionsCompleted).length}/10</strong>missões do Léo</div>
  <div class="stat"><strong>${Object.keys(state.puzzles.completed).length}</strong>quebra-cabeças</div>
  <div class="stat"><strong>${Object.values(state.letterTouches).reduce((a,b)=>a+b,0)}</strong>interações no ABC</div>
 </div>
 <div class="panel" style="padding:14px;margin-top:13px;">
  <h2>Diário do Léo</h2>
  ${(state.leo.diary||[]).slice(0,8).map(d=>`<div class="clue"><strong>${d.title}</strong><br>${d.conclusion}</div>`).join("")||"<p>Nenhuma descoberta registrada ainda.</p>"}
 </div>
 <div class="scene-controls">
  <button data-action="export">⬇️ Exportar</button>
  <button data-action="import">⬆️ Importar</button>
  <button data-action="reset">🗑️ Apagar</button>
  <button data-go="settings">⚙️ Ajustes</button>
 </div>
 <input id="importFile" type="file" accept="application/json" hidden>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-action='export']").onclick=exportProgress;
 document.querySelector("[data-action='import']").onclick=()=>document.querySelector("#importFile").click();
 document.querySelector("#importFile").onchange=importProgress;
 document.querySelector("[data-action='reset']").onclick=()=>{if(confirm("Apagar progresso neste navegador?")){localStorage.removeItem("mll-expedicoes-v1");state=structuredClone(defaultState);save();go("home");}};
}
function exportProgress(){
 const blob=new Blob([JSON.stringify({app:"Mundo de Léo e Lucas",exportedAt:new Date().toISOString(),progress:state},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`mundo-leo-lucas-progresso-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);
}
async function importProgress(e){
 const file=e.target.files?.[0];if(!file)return;
 try{const parsed=JSON.parse(await file.text());state={...structuredClone(defaultState),...(parsed.progress||parsed)};save();alert("Progresso importado.");render();}
 catch{alert("Arquivo inválido.");}
}
function sceneClass(x){return ["B","E","I","N","A"].includes(x.letter)?"ocean":["V","W","Y"].includes(x.letter)?"desert":["X","Z"].includes(x.letter)?"night":""}
function missionIcon(scene){return {aquarium:"🐠",garden:"🍃",axolotl:"🦎",plant:"🌱",invertebrate:"🕷️",night:"🌙",habitat:"🏡",pond:"💧",tracks:"🐾",micro:"🌿"}[scene]||"🔎"}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function bubbles(){const scene=document.querySelector("#scene")||document.querySelector("#missionScene");if(!scene)return;for(let i=0;i<12;i++){const b=document.createElement("div");b.className="bubble";const size=16+Math.random()*40;b.style.width=b.style.height=size+"px";b.style.left=(30+Math.random()*(scene.clientWidth-60))+"px";b.style.top=(scene.clientHeight-30)+"px";scene.appendChild(b);setTimeout(()=>b.remove(),3000);}}
function stars(x=innerWidth/2,y=innerHeight/2){["⭐","✨","🌟","💛","💙"].forEach((s,i)=>{const e=document.createElement("div");e.className="star";e.textContent=s;e.style.left=(x-65+Math.random()*130)+"px";e.style.top=(y+Math.random()*25)+"px";e.style.animationDelay=(i*.05)+"s";fx.appendChild(e);setTimeout(()=>e.remove(),1100);});}
function bindCommon(){
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
 document.querySelector("[data-action='unlock']")?.addEventListener("click",unlockAudio);
 document.querySelectorAll("[data-action='mute']").forEach(b=>b.onclick=()=>{muted=!muted;save();render();});
}

/* ---------- Original SVGs ---------- */
function professorSVG(pose="neutral"){
 const arm=pose==="point"?`<path d="M355 315 L480 245" stroke="#efcdb5" stroke-width="38" stroke-linecap="round"/><circle cx="485" cy="240" r="25" fill="#efcdb5"/>`:`<path d="M355 315 L420 415" stroke="#efcdb5" stroke-width="38" stroke-linecap="round"/><circle cx="420" cy="425" r="25" fill="#efcdb5"/>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 620" role="img" aria-label="Professor Lume"><ellipse cx="260" cy="570" rx="155" ry="30" fill="#8295a0" opacity=".18"/><circle cx="260" cy="165" r="98" fill="#efcdb5"/><path d="M162 150 Q170 48 260 42 Q355 48 360 150" fill="#526d85"/><rect x="164" y="95" width="192" height="48" rx="24" fill="#7998b1"/><circle cx="224" cy="162" r="9" fill="#33424b"/><circle cx="296" cy="162" r="9" fill="#33424b"/><path d="M232 205 Q260 228 288 205" fill="none" stroke="#895f4d" stroke-width="8" stroke-linecap="round"/><path d="M136 302 Q260 230 384 302 L410 535 Q260 590 110 535Z" fill="#7d9bb4"/><path d="M165 315 L100 420" stroke="#efcdb5" stroke-width="38" stroke-linecap="round"/>${arm}<circle cx="100" cy="430" r="25" fill="#efcdb5"/><path d="M232 280 L260 315 L288 280" fill="#fff6ea"/><text x="260" y="495" text-anchor="middle" font-family="system-ui" font-size="44" font-weight="800" fill="#fffdfa">L&amp;L</text></svg>`;
}
function leoSVG(){return `<svg viewBox="0 0 220 220" aria-label="Léo explorador"><circle cx="110" cy="84" r="48" fill="#f0cdb2"/><path d="M74 62 q14 -32 26 -4 q8 -34 22 -2 q10 -26 25 3 q-30 -22 -73 3Z" fill="#6b4e3d"/><circle cx="94" cy="84" r="6" fill="#33424b"/><circle cx="126" cy="84" r="6" fill="#33424b"/><path d="M96 104 q14 12 28 0" stroke="#8b5e48" stroke-width="4" fill="none"/><rect x="63" y="132" width="94" height="64" rx="28" fill="#8eabc3"/><circle cx="158" cy="130" r="24" fill="none" stroke="#475d6b" stroke-width="8"/><path d="M176 148 l22 22" stroke="#475d6b" stroke-width="8" stroke-linecap="round"/></svg>`}
function lucasSVG(){return `<svg viewBox="0 0 220 220" aria-label="Lucas bebê"><circle cx="110" cy="84" r="46" fill="#f0cdb2"/><path d="M80 70 q20 -30 56 -5 q-30 -8 -56 5Z" fill="#6b4e3d"/><circle cx="94" cy="88" r="6" fill="#33424b"/><circle cx="126" cy="88" r="6" fill="#33424b"/><path d="M99 108 q11 10 22 0" stroke="#8b5e48" stroke-width="4" fill="none"/><rect x="68" y="132" width="84" height="62" rx="30" fill="#a8d8ea"/><path d="M72 145 q-25 16 -12 45" stroke="#f0cdb2" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M148 145 q25 16 12 45" stroke="#f0cdb2" stroke-width="14" fill="none" stroke-linecap="round"/></svg>`}
function puzzleIconSVG(){return `<svg viewBox="0 0 220 220" aria-label="Quebra-cabeça"><rect x="50" y="50" width="55" height="55" rx="10" fill="#c8dcc6"/><rect x="115" y="50" width="55" height="55" rx="10" fill="#d7e7ef"/><rect x="50" y="115" width="55" height="55" rx="10" fill="#e9c6ae"/><rect x="115" y="115" width="55" height="55" rx="10" fill="#cbc4dd"/></svg>`}
function objectSVG(item){
 const L=item.letter;
 const common=`<svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${item.word}">`;
 const end=`</svg>`;
 const map={
 A:`${common}<ellipse cx="150" cy="155" rx="95" ry="45" fill="#9ed1cf"/><path d="M235 150 q35 -25 45 20 q-34 -2 -50 -14" fill="#83b7b3"/><circle cx="118" cy="146" r="7" fill="#33424b"/><path d="M95 120 q-25 -28 -48 -10" stroke="#d996a3" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M125 115 q0 -36 26 -44" stroke="#d996a3" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M154 118 q28 -36 56 -22" stroke="#d996a3" stroke-width="10" fill="none" stroke-linecap="round"/>${end}`,
 B:`${common}<path d="M60 130 q90 -95 180 0 q-40 75 -140 55 q-25 -5 -40 -55Z" fill="#8fc4d2"/><path d="M195 88 q40 -30 48 -70 q30 65 -12 105" fill="#8fc4d2"/><circle cx="118" cy="118" r="7" fill="#33424b"/><path d="M110 160 q40 22 90 0" stroke="#fff" stroke-width="8" fill="none"/><path d="M150 40 q12 -25 30 0" stroke="#d7e7ef" stroke-width="12" fill="none"/>${end}`,
 C:`${common}<ellipse cx="145" cy="172" rx="80" ry="34" fill="#cda890"/><circle cx="120" cy="126" r="48" fill="#d8b59b"/><circle cx="120" cy="126" r="26" fill="#b9907a"/><path d="M190 158 q35 -38 70 -16" stroke="#9dbfa4" stroke-width="18" fill="none" stroke-linecap="round"/><circle cx="248" cy="136" r="5" fill="#33424b"/>${end}`,
 D:`${common}<rect x="135" y="125" width="30" height="95" rx="15" fill="#79a76d"/><path d="M150 135 q-90 -55 -105 40 q70 25 105 -40Z" fill="#8ec37d"/><path d="M150 135 q90 -55 105 40 q-70 25 -105 -40Z" fill="#8ec37d"/><path d="M60 168 q38 -8 72 -28" stroke="#d67c78" stroke-width="7"/><path d="M240 168 q-38 -8 -72 -28" stroke="#d67c78" stroke-width="7"/><circle cx="150" cy="90" r="14" fill="#d6b06a"/>${end}`,
 E:`${common}<path d="M150 38 l28 72 78 -8 -60 50 23 76 -69 -42 -69 42 23 -76 -60 -50 78 8Z" fill="#e5c56c"/><circle cx="150" cy="145" r="14" fill="#d9a85a"/><circle cx="130" cy="124" r="6" fill="#fff"/><circle cx="175" cy="130" r="5" fill="#fff"/>${end}`,
 F:`${common}<ellipse cx="150" cy="150" rx="50" ry="38" fill="#6b4e3d"/><circle cx="100" cy="145" r="28" fill="#5a4438"/><circle cx="205" cy="145" r="28" fill="#5a4438"/><path d="M85 126 l-35 -25M85 164 l-35 25M215 126 l35 -25M215 164 l35 25M150 112 v-45M150 188 v45" stroke="#5a4438" stroke-width="8" stroke-linecap="round"/><circle cx="92" cy="138" r="5" fill="#fff"/><circle cx="108" cy="138" r="5" fill="#fff"/>${end}`,
 G:`${common}<rect x="142" y="54" width="34" height="125" rx="17" fill="#d6b57e"/><ellipse cx="168" cy="55" rx="42" ry="30" fill="#d6b57e"/><rect x="85" y="150" width="95" height="48" rx="24" fill="#d6b57e"/><path d="M105 198 v35M160 198 v35" stroke="#9c7e5e" stroke-width="13" stroke-linecap="round"/><circle cx="180" cy="50" r="5" fill="#33424b"/><circle cx="120" cy="165" r="8" fill="#9c7e5e"/><circle cx="150" cy="180" r="7" fill="#9c7e5e"/>${end}`,
 H:`${common}<ellipse cx="150" cy="145" rx="75" ry="35" fill="#8eabc3"/><rect x="205" y="132" width="55" height="14" rx="7" fill="#7898b4"/><path d="M135 110 h30 v35 h-30z" fill="#d7e7ef"/><path d="M80 145 h-55M150 102 v-48M95 54 h110" stroke="#5d7488" stroke-width="10" stroke-linecap="round"/><circle cx="110" cy="152" r="10" fill="#fff"/><circle cx="185" cy="152" r="10" fill="#fff"/>${end}`,
 I:`${common}<ellipse cx="110" cy="135" rx="48" ry="34" fill="#dfc070" opacity=".75"/><ellipse cx="190" cy="135" rx="48" ry="34" fill="#dfc070" opacity=".75"/><rect x="132" y="92" width="36" height="96" rx="18" fill="#6b4e3d"/><circle cx="150" cy="78" r="24" fill="#6b4e3d"/><path d="M136 55 q-18 -25 -40 -10M164 55 q18 -25 40 -10" stroke="#6b4e3d" stroke-width="7" fill="none"/><circle cx="142" cy="76" r="4" fill="#fff"/><circle cx="158" cy="76" r="4" fill="#fff"/>${end}`,
 J:`${common}<ellipse cx="150" cy="150" rx="65" ry="55" fill="#d86b62"/><path d="M150 95 v110" stroke="#5e423e" stroke-width="8"/><circle cx="125" cy="130" r="10" fill="#5e423e"/><circle cx="175" cy="130" r="10" fill="#5e423e"/><circle cx="135" cy="170" r="9" fill="#5e423e"/><circle cx="165" cy="170" r="9" fill="#5e423e"/><circle cx="150" cy="90" r="28" fill="#3f3d3c"/>${end}`,
 K:`${common}<ellipse cx="150" cy="140" rx="82" ry="64" fill="#a98762"/><ellipse cx="150" cy="140" rx="62" ry="46" fill="#9ac67d"/><ellipse cx="150" cy="140" rx="38" ry="26" fill="#f2f3d0"/><g fill="#3f3d3c"><circle cx="120" cy="132" r="4"/><circle cx="140" cy="120" r="4"/><circle cx="168" cy="128" r="4"/><circle cx="134" cy="154" r="4"/><circle cx="176" cy="154" r="4"/></g>${end}`,
 L:`${common}<circle cx="150" cy="122" r="70" fill="#c8904e"/><circle cx="150" cy="122" r="45" fill="#e1b079"/><rect x="110" y="166" width="80" height="55" rx="28" fill="#e1b079"/><circle cx="134" cy="116" r="6" fill="#33424b"/><circle cx="166" cy="116" r="6" fill="#33424b"/><path d="M135 140 q15 14 30 0" stroke="#7a563c" stroke-width="6" fill="none"/>${end}`,
 M:`${common}<circle cx="150" cy="115" r="48" fill="#b1845d"/><circle cx="130" cy="110" r="9" fill="#33424b"/><circle cx="170" cy="110" r="9" fill="#33424b"/><path d="M135 136 q15 15 30 0" stroke="#714d38" stroke-width="5" fill="none"/><rect x="108" y="155" width="84" height="48" rx="24" fill="#b1845d"/><path d="M88 170 q-35 -60 5 -92M212 170 q35 -60 -5 -92" stroke="#7d5a3e" stroke-width="14" fill="none" stroke-linecap="round"/>${end}`,
 N:`${common}<path d="M55 150 h190 l-35 52H90z" fill="#8eabc3"/><rect x="105" y="85" width="85" height="65" fill="#d8edf4"/><path d="M130 85 v-40 l45 40" fill="#e9c6ae"/><path d="M50 208 q45 18 90 0 q45 -18 90 0" stroke="#d7e7ef" stroke-width="12" fill="none"/>${end}`,
 O:`${common}<ellipse cx="150" cy="150" rx="75" ry="60" fill="#e9e4d2"/><path d="M105 130 q45 -40 90 0" stroke="#cfc2a6" stroke-width="8" fill="none"/><circle cx="132" cy="142" r="6" fill="#33424b"/><circle cx="168" cy="142" r="6" fill="#33424b"/><path d="M134 165 q16 14 32 0" stroke="#8b6d55" stroke-width="5" fill="none"/>${end}`,
 P:`${common}<rect x="85" y="115" width="130" height="92" rx="24" fill="#d54f4c"/><path d="M85 125 q65 -55 130 0" fill="#fffdfa"/><g fill="#f4d57a"><circle cx="112" cy="92" r="16"/><circle cx="145" cy="78" r="18"/><circle cx="180" cy="94" r="15"/><circle cx="160" cy="112" r="17"/></g>${end}`,
 Q:`${common}<path d="M70 95 h160 l-20 105H90z" fill="#e6c56a"/><g fill="#c69a3b"><circle cx="115" cy="125" r="10"/><circle cx="170" cy="135" r="12"/><circle cx="145" cy="170" r="9"/></g><circle cx="225" cy="190" r="18" fill="#9a8d7c"/><circle cx="219" cy="184" r="4" fill="#33424b"/>${end}`,
 R:`${common}<rect x="90" y="80" width="120" height="120" rx="28" fill="#b8c4d7"/><rect x="112" y="105" width="76" height="42" rx="8" fill="#d8edf4"/><circle cx="125" cy="170" r="12" fill="#7898b4"/><circle cx="175" cy="170" r="12" fill="#7898b4"/><path d="M110 75 v-35M190 75 v-35" stroke="#7898b4" stroke-width="8" stroke-linecap="round"/>${end}`,
 S:`${common}<ellipse cx="150" cy="155" rx="72" ry="48" fill="#7fbd75"/><circle cx="120" cy="110" r="34" fill="#7fbd75"/><circle cx="180" cy="110" r="34" fill="#7fbd75"/><circle cx="118" cy="102" r="8" fill="#33424b"/><circle cx="182" cy="102" r="8" fill="#33424b"/><path d="M130 158 q20 15 40 0" stroke="#466f43" stroke-width="6" fill="none"/>${end}`,
 T:`${common}<ellipse cx="150" cy="150" rx="75" ry="48" fill="#8aa76b"/><ellipse cx="150" cy="145" rx="55" ry="38" fill="#6e8d54"/><circle cx="225" cy="148" r="25" fill="#8aa76b"/><circle cx="232" cy="142" r="4" fill="#33424b"/><path d="M100 185 l-22 28M155 190 l-12 32" stroke="#6e8d54" stroke-width="12" stroke-linecap="round"/>${end}`,
 U:`${common}<circle cx="150" cy="115" r="55" fill="#a97854"/><circle cx="108" cy="76" r="20" fill="#a97854"/><circle cx="192" cy="76" r="20" fill="#a97854"/><rect x="105" y="160" width="90" height="65" rx="35" fill="#a97854"/><circle cx="132" cy="112" r="6" fill="#33424b"/><circle cx="168" cy="112" r="6" fill="#33424b"/><path d="M134 135 q16 12 32 0" stroke="#6d4d3a" stroke-width="5" fill="none"/>${end}`,
 V:`${common}<path d="M150 35 q65 80 45 155 q-45 45 -90 0 q-20 -75 45 -155Z" fill="#a88b7c"/><path d="M120 190 q30 -30 60 0" stroke="#e36d48" stroke-width="18" fill="none"/><path d="M130 80 q20 -22 40 0" stroke="#d7e7ef" stroke-width="10" fill="none"/>${end}`,
 W:`${common}<rect x="90" y="85" width="120" height="90" rx="18" fill="#d6b47a"/><path d="M90 120 h120M120 85 v90M160 85 v90" stroke="#b58d58" stroke-width="8"/><circle cx="130" cy="62" r="14" fill="#d86b62"/><circle cx="170" cy="62" r="14" fill="#7fbd75"/>${end}`,
 X:`${common}<rect x="45" y="155" width="210" height="32" rx="16" fill="#9a8d7c"/><g>${["#d86b62","#e3bd62","#8dbd75","#7fb5c8","#a999cc"].map((c,i)=>`<rect x="${70+i*34}" y="${80+i*8}" width="26" height="${92-i*8}" rx="10" fill="${c}"/>`).join("")}</g><circle cx="82" cy="205" r="9" fill="#d8edf4"/><circle cx="220" cy="205" r="9" fill="#d8edf4"/>${end}`,
 Y:`${common}<rect x="100" y="90" width="100" height="85" rx="36" fill="#8d735d"/><path d="M95 90 q55 -45 110 0" fill="#6d5748"/><circle cx="130" cy="124" r="6" fill="#33424b"/><circle cx="170" cy="124" r="6" fill="#33424b"/><path d="M110 175 v45M190 175 v45" stroke="#8d735d" stroke-width="14" stroke-linecap="round"/>${end}`,
 Z:`${common}<rect x="75" y="90" width="150" height="95" rx="45" fill="#fff"/><path d="M95 105 q38 25 0 55M140 92 q-15 45 12 88M185 100 q-20 35 20 72" stroke="#33424b" stroke-width="10" fill="none"/><circle cx="190" cy="125" r="6" fill="#33424b"/><path d="M85 185 v35M205 185 v35" stroke="#33424b" stroke-width="10" stroke-linecap="round"/>${end}`
 };
 return map[L]||`<svg viewBox="0 0 300 260"><circle cx="150" cy="130" r="80" fill="#c8dcc6"/><text x="150" y="150" text-anchor="middle" font-size="90" font-weight="800" fill="#58758d">${L}</text></svg>`;
}
function missionSVG(scene){
 const art={
  aquarium:`<svg viewBox="0 0 400 300"><rect x="45" y="65" width="310" height="190" rx="20" fill="#d8edf4" stroke="#7898b4" stroke-width="10"/><path d="M55 125 q80 30 160 0 q70 -25 130 0" stroke="#93c6d4" stroke-width="8" fill="none"/><ellipse cx="145" cy="165" rx="35" ry="18" fill="#e9c6ae"/><path d="M178 165 l30 -16 v32z" fill="#d4a78c"/><ellipse cx="250" cy="190" rx="32" ry="16" fill="#f1e5b7"/><path d="M85 230 q20 -70 40 0M295 230 q12 -55 30 0" stroke="#8eae93" stroke-width="12" fill="none"/></svg>`,
  garden:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#dcebd6"/><path d="M80 205 q95 -130 235 0" fill="#9bbf7f"/><path d="M130 165 q60 -60 130 0" fill="#c8dcc6"/><path d="M170 150 q25 18 55 8" stroke="#a67f63" stroke-width="8" fill="none"/><ellipse cx="285" cy="220" rx="42" ry="25" fill="#c6a88b"/><circle cx="250" cy="210" r="28" fill="#d3b79e"/></svg>`,
  axolotl:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#d9edf0"/><ellipse cx="200" cy="170" rx="95" ry="45" fill="#efb7b8"/><path d="M285 170 q45 -25 55 25 q-40 -5 -60 -18" fill="#e7a0a5"/><path d="M150 130 q-35 -35 -70 -12M190 125 q5 -50 45 -60M225 130 q40 -35 75 -8" stroke="#d996a3" stroke-width="12" fill="none"/><circle cx="165" cy="160" r="7" fill="#33424b"/></svg>`,
  plant:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5ead6"/><rect x="150" y="220" width="100" height="45" rx="18" fill="#a67f63"/><path d="M200 225 v-95" stroke="#7fa06e" stroke-width="15"/><path d="M200 140 q-95 -60 -120 45 q75 25 120 -45Z" fill="#8ec37d"/><path d="M200 140 q95 -60 120 45 q-75 25 -120 -45Z" fill="#8ec37d"/></svg>`,
  invertebrate:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#eadfca"/><ellipse cx="200" cy="160" rx="65" ry="48" fill="#5d4f46"/><circle cx="150" cy="155" r="35" fill="#4c403a"/><path d="M150 125 l-55 -35M150 185 l-55 35M190 115 l-30 -70M220 115 l35 -70M250 130 l55 -35M250 185 l55 35M190 205 l-25 55M220 205 l35 55" stroke="#4c403a" stroke-width="10" stroke-linecap="round"/></svg>`,
  night:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#637786"/><circle cx="320" cy="70" r="34" fill="#f1e5b7"/><path d="M0 225 q100 -70 200 0 q100 -60 200 0 v75H0z" fill="#6d8662"/><ellipse cx="170" cy="210" rx="50" ry="22" fill="#9c7f67"/><circle cx="145" cy="195" r="20" fill="#b79c83"/></svg>`,
  habitat:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#e8e1d4"/><rect x="70" y="115" width="260" height="110" rx="30" fill="#c8dcc6"/><circle cx="155" cy="170" r="35" fill="#d3b79e"/><path d="M210 205 q25 -80 75 0" stroke="#8eae93" stroke-width="14" fill="none"/></svg>`,
  pond:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#cfe8e7"/><ellipse cx="200" cy="180" rx="150" ry="70" fill="#80b5c2"/><path d="M100 190 q100 45 200 0" stroke="#d7e7ef" stroke-width="10" fill="none"/><path d="M90 230 q20 -80 40 0M290 230 q20 -80 40 0" stroke="#8eae93" stroke-width="12"/></svg>`,
  tracks:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#e5ded1"/><path d="M75 230 q110 -120 250 0" fill="#bfae98"/><g fill="#7a6655"><ellipse cx="145" cy="190" rx="12" ry="7"/><ellipse cx="178" cy="172" rx="12" ry="7"/><ellipse cx="215" cy="155" rx="12" ry="7"/><ellipse cx="252" cy="140" rx="12" ry="7"/></g><path d="M70 125 q80 40 170 15" stroke="#d8d3c8" stroke-width="8" fill="none"/></svg>`,
  micro:`<svg viewBox="0 0 400 300"><rect width="400" height="300" fill="#e7efe5"/><rect x="135" y="50" width="130" height="210" rx="35" fill="#d8edf4" opacity=".7" stroke="#8eabc3" stroke-width="8"/><rect x="145" y="205" width="110" height="38" rx="15" fill="#9c7f67"/><path d="M200 208 q-25 -65 0 -110 q25 45 0 110Z" fill="#8eae93"/></svg>`
 };
 return art[scene]||art.garden;
}
function puzzleImageSVG(p){
 const bg=p.palette[0],mid=p.palette[1],accent=p.palette[2];
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" rx="32" fill="${bg}"/><circle cx="300" cy="90" r="48" fill="${accent}" opacity=".75"/><path d="M45 310 q155 -150 310 0 v90H45z" fill="${mid}"/><circle cx="190" cy="185" r="74" fill="#fffdfa" opacity=".9"/><text x="200" y="210" text-anchor="middle" font-family="system-ui" font-size="74" font-weight="900" fill="#58758d">${p.title.slice(0,1)}</text><text x="200" y="350" text-anchor="middle" font-family="system-ui" font-size="28" font-weight="800" fill="#35434b">${p.title}</text></svg>`;
}
function sceneColor(p){return p.palette?.[0]||"#d8edf4"}
await loadData();
render();
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.error));}
