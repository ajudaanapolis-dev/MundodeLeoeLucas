
const app=document.querySelector("#app");
const fx=document.querySelector("#fx");

let route="home";
let previousRoute="home";
let audioReady=false;
let muted=false;
let narration=true;
let reduceMotion=false;
let letters=[];
let labs=[];
let selectedLetter=null;
let selectedLab=null;
let selectedLevel=1;
let currentLabQuestion=null;

const audioNames=["tap","open","success","wrong","magic","water","animal","music","science"];
const audios={};

const defaultState={
 lettersExplored:[],
 letterTouches:{},
 leo:{correct:0,errors:0,skills:{},completed:{}},
 settings:{muted:false,narration:true,reduceMotion:false}
};
let state=loadState();
muted=Boolean(state.settings?.muted);
narration=state.settings?.narration!==false;
reduceMotion=Boolean(state.settings?.reduceMotion);
document.body.classList.toggle("reduce-motion",reduceMotion);

function loadState(){
 try{
  const parsed=JSON.parse(localStorage.getItem("mll-complete-v1")||"null");
  if(parsed) return {
   ...structuredClone(defaultState),
   ...parsed,
   leo:{...structuredClone(defaultState.leo),...(parsed.leo||{})},
   settings:{...structuredClone(defaultState.settings),...(parsed.settings||{})}
  };
 }catch{}
 return structuredClone(defaultState);
}
function save(){
 state.settings={muted,narration,reduceMotion};
 localStorage.setItem("mll-complete-v1",JSON.stringify({...state,savedAt:new Date().toISOString()}));
}
function go(next){
 previousRoute=route;
 route=next;
 play("tap");
 render();
}
function back(){
 const next=previousRoute||"home";
 previousRoute=route;
 route=next;
 render();
}
function play(name){
 if(!audioReady||muted)return;
 const a=audios[name]||audios.tap;
 a.currentTime=0;
 a.play().catch(()=>{});
}
function speak(text){
 if(!narration||muted||!("speechSynthesis" in window))return;
 window.speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);
 u.lang="pt-BR";
 u.rate=.82;
 u.pitch=1.05;
 u.volume=.9;
 window.speechSynthesis.speak(u);
}
async function unlockAudio(){
 await Promise.all(audioNames.map(name=>new Promise(resolve=>{
  const a=new Audio(`./assets/audio/${name}.wav`);
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
async function loadData(){
 [letters,labs]=await Promise.all([
  fetch("./data/letters.json").then(r=>r.json()),
  fetch("./data/leo-labs.json").then(r=>r.json())
 ]);
}
function header(title,backRoute="home"){
 return `<div class="topbar">
 <button class="icon" data-go="${backRoute}">⬅️</button>
 <div class="pill">${title}</div>
 <button class="icon" data-action="mute">${muted?"🔇":"🔊"}</button>
 </div>`;
}
function render(){
 if(route==="home")return renderHome();
 if(route==="lucasAlphabet")return renderLucasAlphabet();
 if(route==="letterScene")return renderLetterScene();
 if(route==="leoHome")return renderLeoHome();
 if(route==="leoChallenge")return renderLeoChallenge();
 if(route==="leoAquarium")return renderLeoAquarium();
 if(route==="leoDashboard")return renderLeoDashboard();
 if(route==="settings")return renderSettings();
 if(route==="parentGate")return renderParentGate();
 if(route==="parentArea")return renderParentArea();
}
function renderHome(){
 app.innerHTML=`<main class="app"><section class="screen">
 <div class="topbar"><div class="pill">Mundo de Léo e Lucas</div><div class="pill">⭐ ${state.leo.correct*12+state.lettersExplored.length}</div></div>
 <div class="hero"><h1>Mundo de <span>Léo e Lucas</span></h1><p>Descoberta, narração, interação e ciência em um único universo.</p></div>
 ${!audioReady?`<div class="audio"><strong>Ativar sons e narração</strong><p>Toque uma vez para liberar o áudio.</p><button class="big peach" data-action="unlock"><span>Começar</span><span>🔊</span></button></div>`:""}
 <div class="profile-grid">
  <button class="profile lucas" data-go="lucasAlphabet"><div class="face">👶</div><h2>ABC do Lucas</h2><p>Alfabeto completo, personagem-guia e uma cena interativa própria para cada letra.</p><span class="big blue"><span>Abrir alfabeto</span><span>🔤</span></span></button>
  <button class="profile leo" data-go="leoHome"><div class="face">🧒</div><h2>Laboratório do Léo</h2><p>Ciência, hipóteses, experimentos e progressão adaptativa.</p><span class="big green"><span>Investigar</span><span>🔬</span></span></button>
 </div>
 <div class="home-tools">
  <button data-go="settings">⚙️ Ajustes</button>
  <button data-go="parentGate">👨‍👩‍👧 Área dos responsáveis</button>
  <button data-action="install">📲 Instalar aplicativo</button>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-action='install']").onclick=()=>alert("No iPhone: Compartilhar → Adicionar à Tela de Início. No Android/Chrome: menu → Instalar aplicativo.");
}
function renderLucasAlphabet(){
 const completed=state.lettersExplored.length;
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("ABC do Lucas","home")}
 <div class="abc-home">
  <div class="guide-card"><img src="./assets/illustrations/professor-lume-aponta.svg" alt="Professor Lume apontando para as letras"></div>
  <div class="alphabet-panel">
   <h2 class="alphabet-title">Escolha uma letra</h2>
   <div class="progress"><div style="width:${(completed/letters.length)*100}%"></div></div>
   <div class="alphabet-grid">${letters.map(item=>`<button class="letter-btn ${state.lettersExplored.includes(item.letter)?"done":""}" data-letter="${item.letter}">${item.letter}</button>`).join("")}</div>
  </div>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelectorAll("[data-letter]").forEach(b=>b.onclick=()=>{
  selectedLetter=letters.find(x=>x.letter===b.dataset.letter);
  route="letterScene";
  play("open");
  speak(`${selectedLetter.letter}. ${selectedLetter.letter} de ${selectedLetter.word}`);
  render();
 });
}
function sceneClass(item){
 if(["B","E","I","N"].includes(item.letter))return "ocean";
 if(["V","W","Y"].includes(item.letter))return "desert";
 if(["X","Z"].includes(item.letter))return "night";
 return "";
}
function renderLetterScene(){
 const x=selectedLetter;
 app.innerHTML=`<main class="app"><section class="screen">
 ${header(`${x.letter} de ${x.word}`,"lucasAlphabet")}
 <div class="scene-shell">
  <div class="scene-title">Toque em ${x.word.toLowerCase()}</div>
  <div class="scene ${sceneClass(x)}" id="scene">
   <img class="guide-mini" src="./assets/illustrations/professor-lume.svg" alt="">
   <button class="main-object" data-action="object" aria-label="${x.word}">${x.emoji}</button>
   <div class="word-card" data-action="word"><strong>${x.letter}</strong> de ${x.word}</div>
  </div>
 </div>
 <div class="scene-controls">
  <button data-action="letter-sound">🔤 Ouvir letra</button>
  <button data-action="word-sound">🗣️ Ouvir palavra</button>
  <button data-action="magic">✨ Surpresa</button>
  <button data-action="next">➡️ Próxima</button>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-action='object']").onclick=e=>animateLetterObject(e.currentTarget,x,e);
 document.querySelector("[data-action='letter-sound']").onclick=()=>{play("tap");speak(x.letter)};
 document.querySelector("[data-action='word-sound']").onclick=()=>{play("open");speak(`${x.letter} de ${x.word}`)};
 document.querySelector("[data-action='word']").onclick=()=>speak(x.fact);
 document.querySelector("[data-action='magic']").onclick=e=>{play("magic");stars(e.clientX,e.clientY);if(["B","E","I","N"].includes(x.letter))bubbles()};
 document.querySelector("[data-action='next']").onclick=()=>{
  const i=letters.findIndex(l=>l.letter===x.letter);
  selectedLetter=letters[(i+1)%letters.length];
  speak(`${selectedLetter.letter}. ${selectedLetter.letter} de ${selectedLetter.word}`);
  render();
 };
}
function animateLetterObject(el,item,event){
 const explored=new Set(state.lettersExplored);
 explored.add(item.letter);
 state.lettersExplored=[...explored];
 state.letterTouches[item.letter]=(state.letterTouches[item.letter]||0)+1;
 save();

 const clsMap={
  swim:"dance",splash:"jump",crawl:"crawl",snap:"pop",wave:"dance",carry:"crawl",
  stretch:"pop",fly:"fly",flutter:"fly",openwings:"fly",slice:"pop",roar:"pop",
  swing:"dance",sail:"crawl",bounce:"jump",pop:"pop",find:"crawl",dance:"dance",
  jump:"jump",erupt:"pop",stack:"pop",music:"dance",run:"fly"
 };
 el.classList.remove("fly","jump","dance","pop","crawl");
 void el.offsetWidth;
 el.classList.add(clsMap[item.action]||"pop");

 const sound=["splash","swim","wave","sail"].includes(item.action)?"water":
             ["roar","snap"].includes(item.action)?"animal":
             item.action==="music"?"music":"success";
 play(sound);
 speak(item.fact);
 if(["splash","swim","wave"].includes(item.action))bubbles();
 stars(event.clientX,event.clientY);
}
function labLevel(id){
 const s=state.leo.skills[id]||{correct:0};
 return Math.min(3,1+Math.floor((s.correct||0)/2));
}
function renderLeoHome(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Laboratório do Léo","home")}
 <div class="hero"><h1>Professor Lume e o <span>Laboratório</span></h1><p>Escolha uma investigação científica.</p></div>
 <div class="science-grid">
 ${labs.map(lab=>`<button class="science-card" data-lab="${lab.id}"><div class="emoji">${lab.emoji}</div><h3>${lab.title}</h3><p>${lab.description}</p><small>Nível ${labLevel(lab.id)}</small></button>`).join("")}
 <button class="science-card" data-go="leoAquarium"><div class="emoji">🧪</div><h3>Simulador de aquário</h3><p>Controle variáveis e observe consequências.</p><small>Experimento livre</small></button>
 <button class="science-card" data-go="leoDashboard"><div class="emoji">📊</div><h3>Evolução</h3><p>Resultados, domínio e progresso salvo.</p><small>Painel</small></button>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelectorAll("[data-lab]").forEach(b=>b.onclick=()=>{
  selectedLab=labs.find(l=>l.id===b.dataset.lab);
  selectedLevel=labLevel(selectedLab.id);
  currentLabQuestion=selectedLab.levels.find(x=>x.level===selectedLevel);
  route="leoChallenge";
  play("science");
  speak(currentLabQuestion.question);
  render();
 });
}
function renderLeoChallenge(){
 const q=currentLabQuestion;
 app.innerHTML=`<main class="app"><section class="screen">
 ${header(selectedLab.title,"leoHome")}
 <div class="lab">
  <img src="./assets/illustrations/professor-lume.svg" style="width:125px;float:right" alt="">
  <h2>${q.question}</h2>
  <p>${q.context}</p>
  <div style="clear:both"></div>
  <div class="choice-grid">${[...q.options].sort(()=>Math.random()-.5).map(([t,e])=>`<button class="choice" data-answer="${t}">${e}<small>${t}</small></button>`).join("")}</div>
  <div class="status" id="status">Escolha a hipótese mais consistente.</div>
 </div>
 <button class="big green" id="finishLab" style="display:none"><span>Concluir investigação</span><span>➡️</span></button>
 </section></main>`;
 bindCommon();
 let answered=false;
 document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{
  if(answered)return;
  const skill=state.leo.skills[selectedLab.id]??={correct:0,errors:0,mastery:0};
  if(b.dataset.answer===q.answer){
   answered=true;
   b.classList.add("ok");
   skill.correct++;
   skill.mastery=Math.min(4,Math.ceil(skill.correct/2));
   state.leo.correct++;
   state.leo.completed[`${selectedLab.id}:${q.level}`]=new Date().toISOString();
   document.querySelector("#status").textContent="Correto. Agora explique quais pistas sustentam sua conclusão.";
   document.querySelector("#finishLab").style.display="flex";
   play("success");
   speak("Correto. Agora explique quais pistas sustentam sua conclusão.");
   stars();
  }else{
   b.classList.add("bad");
   skill.errors++;
   state.leo.errors++;
   document.querySelector("#status").textContent="Revise as pistas e elimine as alternativas incompatíveis.";
   play("wrong");
   speak("Revise as pistas e elimine as alternativas incompatíveis.");
   setTimeout(()=>b.classList.remove("bad"),500);
  }
  save();
 });
 document.querySelector("#finishLab").onclick=()=>go("leoHome");
}
function renderLeoAquarium(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Simulador de aquário","leoHome")}
 <div class="simulator" id="aquariumSim">
  <div class="creature" style="left:80px;top:180px">🐠</div>
  <div class="creature" style="right:90px;top:245px">🐟</div>
  <div class="creature" style="left:260px;bottom:20px">🌿</div>
 </div>
 <div class="lab">
  <div class="control-grid">
   <div class="control"><label>Temperatura <span id="tVal">24°C</span></label><input id="temp" type="range" min="18" max="32" value="24"></div>
   <div class="control"><label>Oxigênio <span id="oVal">70%</span></label><input id="oxy" type="range" min="20" max="100" value="70"></div>
   <div class="control"><label>Limpeza <span id="cVal">85%</span></label><input id="clean" type="range" min="10" max="100" value="85"></div>
   <div class="control"><label>Alimento <span id="fVal">40%</span></label><input id="food" type="range" min="0" max="100" value="40"></div>
  </div>
  <div class="status" id="simStatus">O ecossistema está equilibrado.</div>
 </div>
 <button class="big blue" data-action="analyze"><span>Analisar sistema</span><span>🔬</span></button>
 </section></main>`;
 bindCommon();
 [["temp","tVal","°C"],["oxy","oVal","%"],["clean","cVal","%"],["food","fVal","%"]].forEach(([id,out,suffix])=>{
  document.querySelector("#"+id).oninput=e=>document.querySelector("#"+out).textContent=e.target.value+suffix;
 });
 document.querySelector("[data-action='analyze']").onclick=()=>{
  const t=+document.querySelector("#temp").value;
  const o=+document.querySelector("#oxy").value;
  const c=+document.querySelector("#clean").value;
  const f=+document.querySelector("#food").value;
  let msg="O ecossistema está equilibrado.";
  if(t>28)msg="A temperatura está alta e pode aumentar o estresse.";
  else if(o<50)msg="A oxigenação está baixa.";
  else if(c<55)msg="A água precisa de manutenção.";
  else if(f>75)msg="O excesso de alimento pode gerar resíduos.";
  document.querySelector("#simStatus").textContent=msg;
  play(msg.includes("equilibrado")?"success":"wrong");
  speak(msg);
 };
}
function renderLeoDashboard(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Evolução do Léo","leoHome")}
 <div class="statgrid">
  <div class="stat"><strong>${state.leo.correct}</strong>acertos</div>
  <div class="stat"><strong>${state.leo.errors}</strong>erros</div>
  <div class="stat"><strong>${Object.keys(state.leo.completed).length}</strong>etapas concluídas</div>
  <div class="stat"><strong>${state.lettersExplored.length}</strong>letras exploradas</div>
 </div>
 <div style="margin-top:13px">
 ${labs.map(lab=>{const s=state.leo.skills[lab.id]||{};return `<div class="level-card"><strong>${lab.emoji} ${lab.title}</strong><small>Acertos: ${s.correct||0} · Erros: ${s.errors||0} · Nível: ${labLevel(lab.id)}</small></div>`}).join("")}
 </div>
 </section></main>`;
 bindCommon();
}
function renderSettings(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Ajustes","home")}
 <div class="lab">
  <div class="settings-grid">
   <div class="setting"><span>🔊 Sons</span><button data-setting="sound">${muted?"Desativados":"Ativados"}</button></div>
   <div class="setting"><span>🗣️ Narração</span><button data-setting="narration">${narration?"Ativada":"Desativada"}</button></div>
   <div class="setting"><span>✨ Movimento reduzido</span><button data-setting="motion">${reduceMotion?"Ativado":"Desativado"}</button></div>
  </div>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-setting='sound']").onclick=()=>{muted=!muted;save();render()};
 document.querySelector("[data-setting='narration']").onclick=()=>{narration=!narration;save();render()};
 document.querySelector("[data-setting='motion']").onclick=()=>{reduceMotion=!reduceMotion;document.body.classList.toggle("reduce-motion",reduceMotion);save();render()};
}
function renderParentGate(){
 const a=Math.floor(2+Math.random()*7);
 const b=Math.floor(1+Math.random()*6);
 window.__parentAnswer=a+b;
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Área dos responsáveis","home")}
 <div class="parent-lock"><h2>Acesso para adultos</h2><p>Resolva para continuar:</p><input id="parentAnswer" inputmode="numeric" placeholder="${a} + ${b} = ?"><button class="big sand" style="margin-top:12px" data-action="unlock-parent"><span>Entrar</span><span>🔐</span></button></div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-action='unlock-parent']").onclick=()=>{
  if(+document.querySelector("#parentAnswer").value===window.__parentAnswer)go("parentArea");
  else alert("Resposta incorreta.");
 };
}
function renderParentArea(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Área dos responsáveis","home")}
 <div class="statgrid">
  <div class="stat"><strong>${state.lettersExplored.length}/26</strong>letras exploradas</div>
  <div class="stat"><strong>${Object.values(state.letterTouches).reduce((a,b)=>a+b,0)}</strong>interações no ABC</div>
  <div class="stat"><strong>${state.leo.correct}</strong>acertos do Léo</div>
  <div class="stat"><strong>${state.leo.errors}</strong>erros do Léo</div>
 </div>
 <div class="lab" style="margin-top:13px">
  <h2>Backup e controle</h2>
  <button class="big lav" data-action="export"><span>Baixar progresso em JSON</span><span>⬇️</span></button>
  <button class="big rose" style="margin-top:10px" data-action="reset"><span>Apagar progresso</span><span>🗑️</span></button>
 </div>
 </section></main>`;
 bindCommon();
 document.querySelector("[data-action='export']").onclick=exportProgress;
 document.querySelector("[data-action='reset']").onclick=()=>{
  if(confirm("Apagar todo o progresso salvo neste navegador?")){
   localStorage.removeItem("mll-complete-v1");
   state=structuredClone(defaultState);
   save();
   go("home");
  }
 };
}
function exportProgress(){
 const blob=new Blob([JSON.stringify({
  app:"Mundo de Léo e Lucas",
  exportedAt:new Date().toISOString(),
  progress:state
 },null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");
 a.href=url;
 a.download=`mundo-leo-lucas-progresso-${new Date().toISOString().slice(0,10)}.json`;
 a.click();
 URL.revokeObjectURL(url);
}
function bubbles(){
 const scene=document.querySelector("#scene");
 if(!scene)return;
 for(let i=0;i<14;i++){
  const b=document.createElement("div");
  b.className="bubble";
  const size=16+Math.random()*40;
  b.style.width=b.style.height=size+"px";
  b.style.left=(30+Math.random()*(scene.clientWidth-60))+"px";
  b.style.top=(scene.clientHeight-30)+"px";
  scene.appendChild(b);
  setTimeout(()=>b.remove(),3000);
 }
}
function stars(x=innerWidth/2,y=innerHeight/2){
 ["⭐","✨","🌟","💛","💙"].forEach((s,i)=>{
  const e=document.createElement("div");
  e.className="star";
  e.textContent=s;
  e.style.left=(x-65+Math.random()*130)+"px";
  e.style.top=(y+Math.random()*25)+"px";
  e.style.animationDelay=(i*.05)+"s";
  fx.appendChild(e);
  setTimeout(()=>e.remove(),1100);
 });
}
function bindCommon(){
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
 document.querySelector("[data-action='unlock']")?.addEventListener("click",unlockAudio);
 document.querySelectorAll("[data-action='mute']").forEach(b=>b.onclick=()=>{muted=!muted;save();render()});
}
await loadData();
render();
if("serviceWorker" in navigator){
 window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.error));
}
