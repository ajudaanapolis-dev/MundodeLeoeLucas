
import {leoDomains,leoQuestions,lucasWorlds} from "./data.js";
import {loadState,saveState,exportState} from "./storage.js";
import {unlockAudio,playSound,setMuted,isMuted,isReady} from "./audio.js";

const app=document.querySelector("#app");
const effects=document.querySelector("#effects");
let state=loadState();
let route="home";
let currentDomain="ecosystems";
let currentQuestion=null;
let activeLetter="A";
let surpriseItem="🧸";
let currentLucasWorld="letters";

function save(){saveState(state)}
function go(next){route=next;playSound("click");render()}
function globalLeoLevel(){
 let level=1;
 for(let tier=1;tier<3;tier++){
  if(leoDomains.every(d=>state.leo.completed?.[`${d.id}:${tier}`])) level=tier+1;
  else break;
 }
 return level;
}
function mastery(id){return state.leo.skills[id]?.mastery||0}
function render(){
 if(route==="home")return renderHome();
 if(route==="leoHome")return renderLeoHome();
 if(route==="leoChallenge")return renderLeoChallenge();
 if(route==="leoAquarium")return renderLeoAquarium();
 if(route==="leoDashboard")return renderLeoDashboard();
 if(route==="lucasHome")return renderLucasHome();
 if(route==="lucasWorld")return renderLucasWorld();
}

function header(title,back="home"){
 return `<div class="topbar">
 <button class="icon" data-go="${back}">⬅️</button>
 <div class="pill">${title}</div>
 <button class="icon" data-action="mute">${isMuted()?"🔇":"🔊"}</button>
 </div>`;
}

function renderHome(){
 app.innerHTML=`<main class="app"><section class="screen">
 <div class="topbar"><div class="pill">Mundo de Léo e Lucas</div><div class="pill">⭐ ${state.stars}</div></div>
 <div class="hero"><h1>Mundo de <span>Léo e Lucas</span></h1><p>Duas experiências integradas em uma paleta pastel e com estímulos mais suaves.</p></div>
 ${!isReady()?`<div class="audio"><strong>Ativar sons suaves</strong><p>Os efeitos sonoros foram mantidos curtos e discretos.</p><button class="big sand" data-action="unlock"><span>Ativar sons</span><span>🔊</span></button></div>`:""}
 <div class="profile-grid">
 <button class="profile leo" data-go="leoHome"><div class="face">🧒</div><h2>Jornada do Léo</h2><p>Ciência, lógica, hipóteses e progressão adaptativa.</p><span class="big peach"><span>Entrar</span><span>🔬</span></span></button>
 <button class="profile lucas" data-go="lucasHome"><div class="face">👶</div><h2>Mundo do Lucas</h2><p>Letras, animais, música, cores e estímulos sensoriais suaves.</p><span class="big blue"><span>Explorar</span><span>🌈</span></span></button>
 </div>
 </section></main>`;
 bind();
}

function renderLeoHome(){
 const level=globalLeoLevel();
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Jornada do Léo")}
 <div class="hero"><h1>Pequeno <span>Pesquisador</span></h1><p>Nível geral ${level}. Conclua todas as áreas para evoluir.</p></div>
 <div class="world-grid">
 <button class="world" data-go="leoPath"><div class="emoji">🗺️</div><h3>Trilha científica</h3><p>Desafios por domínio e níveis crescentes.</p><small>Adaptativo</small></button>
 <button class="world" data-go="leoAquarium"><div class="emoji">🐠</div><h3>Simulador de aquário</h3><p>Controle variáveis e observe consequências.</p><small>Causa e efeito</small></button>
 <button class="world" data-go="leoDashboard"><div class="emoji">📈</div><h3>Evolução</h3><p>Acertos, erros, níveis e backup em JSON.</p><small>Progresso</small></button>
 </div>
 <div class="path" id="leoPath"><div class="path-line"></div>
 ${leoDomains.map(d=>`<div class="node-row"><button class="node" style="background:${d.color}" data-domain="${d.id}">${state.leo.completed?.[`${d.id}:${level}`]?"✅":d.emoji}</button><div class="node-info"><h3>${d.title} — nível ${level}</h3><p>${d.desc}</p><div class="mastery">${[1,2,3,4].map(n=>`<span class="${mastery(d.id)>=n?"on":""}"></span>`).join("")}</div></div></div>`).join("")}
 </div>
 </section></main>`;
 bind();
 document.querySelectorAll("[data-domain]").forEach(b=>b.onclick=()=>{
  currentDomain=b.dataset.domain;
  currentQuestion=leoQuestions[currentDomain].find(q=>q.lvl===globalLeoLevel());
  route="leoChallenge";playSound("click");render();
 });
}

function renderLeoChallenge(){
 const q=currentQuestion;
 const level=globalLeoLevel();
 app.innerHTML=`<main class="app"><section class="screen">
 ${header(leoDomains.find(d=>d.id===currentDomain).title,"leoHome")}
 <div class="progress"><div style="width:${state.leo.completed?.[`${currentDomain}:${level}`]?100:0}%"></div></div>
 <div class="lab"><h2>${q.q}</h2><p>${q.ctx}</p><div class="choice-grid">${[...q.o].sort(()=>Math.random()-.5).map(([t,e])=>`<button class="choice" data-answer="${t}">${e}<small>${t}</small></button>`).join("")}</div><div class="status" id="status">Observe as pistas antes de responder.</div></div>
 <button class="big green" id="finish" style="display:none"><span>Concluir e voltar</span><span>➡️</span></button>
 </section></main>`;
 bind();
 document.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{
  const skill=state.leo.skills[currentDomain]??={correct:0,errors:0,mastery:0};
  if(b.dataset.answer===q.a){
   b.classList.add("correct");
   const key=`${currentDomain}:${level}`;
   if(!state.leo.completed[key]){
    state.leo.completed[key]={completedAt:new Date().toISOString()};
    skill.correct++;skill.mastery=Math.min(4,skill.mastery+1);
    state.leo.correct++;state.stars+=12;
   }
   document.querySelector("#status").textContent="Correto. Explique quais pistas sustentam sua conclusão.";
   document.querySelector("#finish").style.display="flex";
   playSound("success");stars();
  }else{
   b.classList.add("wrong");skill.errors++;state.leo.errors++;
   document.querySelector("#status").textContent="Revise as pistas e elimine as opções incompatíveis.";
   playSound("error");setTimeout(()=>b.classList.remove("wrong"),500);
  }
  save();
 });
 document.querySelector("#finish").onclick=()=>go("leoHome");
}

function renderLeoAquarium(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Simulador de aquário","leoHome")}
 <div class="simulator"><div class="creature" style="left:80px;top:180px">🐠</div><div class="creature" style="right:90px;top:245px">🐟</div><div class="creature" style="left:260px;bottom:20px">🌿</div></div>
 <div class="lab"><div class="control-grid">
 <div class="control"><label>Temperatura <span id="tVal">24°C</span></label><input id="temp" type="range" min="18" max="32" value="24"></div>
 <div class="control"><label>Oxigênio <span id="oVal">70%</span></label><input id="oxy" type="range" min="20" max="100" value="70"></div>
 <div class="control"><label>Limpeza <span id="cVal">85%</span></label><input id="clean" type="range" min="10" max="100" value="85"></div>
 <div class="control"><label>Alimento <span id="fVal">40%</span></label><input id="food" type="range" min="0" max="100" value="40"></div>
 </div><div class="status" id="simStatus">O ecossistema está equilibrado.</div></div>
 <button class="big blue" data-action="analyze"><span>Analisar sistema</span><span>🔬</span></button>
 </section></main>`;
 bind();
 ["temp","oxy","clean","food"].forEach(id=>document.querySelector("#"+id).oninput=e=>{
  document.querySelector("#"+id[0]+"Val").textContent=e.target.value+(id==="temp"?"°C":"%");
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
  playSound(msg.includes("equilibrado")?"success":"error");
 };
}

function renderLeoDashboard(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Evolução do Léo","leoHome")}
 <div class="statgrid"><div class="stat"><strong>${state.leo.correct||0}</strong>acertos</div><div class="stat"><strong>${state.leo.errors||0}</strong>erros</div><div class="stat"><strong>${globalLeoLevel()}</strong>nível geral</div><div class="stat"><strong>${state.stars}</strong>estrelas</div></div>
 <div style="margin-top:13px">${leoDomains.map(d=>{const s=state.leo.skills[d.id]||{};return `<div class="level-card"><strong>${d.emoji} ${d.title}</strong><small>Acertos: ${s.correct||0} · Erros: ${s.errors||0}</small><div class="mastery">${[1,2,3,4].map(n=>`<span class="${(s.mastery||0)>=n?"on":""}"></span>`).join("")}</div></div>`}).join("")}</div>
 <button class="big lavender" data-action="export"><span>Baixar progresso em JSON</span><span>⬇️</span></button>
 </section></main>`;
 bind();
 document.querySelector("[data-action='export']").onclick=()=>exportState(state);
}

function renderLucasHome(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Mundo do Lucas")}
 <div class="hero"><h1>Descobertas <span>suaves</span></h1><p>Interações ricas, repetição e causa e efeito com cores pastéis.</p></div>
 <div class="world-grid">${lucasWorlds.map(w=>`<button class="world" data-lucas="${w.id}"><div class="emoji">${w.emoji}</div><h3>${w.title}</h3><p>${w.desc}</p></button>`).join("")}</div>
 </section></main>`;
 bind();
 document.querySelectorAll("[data-lucas]").forEach(b=>b.onclick=()=>{
  currentLucasWorld=b.dataset.lucas;
  state.lucas.worlds[currentLucasWorld]=(state.lucas.worlds[currentLucasWorld]||0)+1;
  save();route="lucasWorld";playSound("click");render();
 });
}

function renderLucasWorld(){
 if(currentLucasWorld==="letters")return renderLucasLetters();
 if(currentLucasWorld==="animals")return renderLucasAnimals();
 if(currentLucasWorld==="music")return renderLucasMusic();
 if(currentLucasWorld==="colors")return renderLucasColors();
 if(currentLucasWorld==="ocean")return renderLucasOcean();
 return renderLucasSurprise();
}

function renderLucasLetters(){
 const letters=["A","B","C","D","E","F"];
 const map={A:["🐝","Abelha"],B:["⚽","Bola"],C:["🏠","Casa"],D:["🦕","Dinossauro"],E:["⭐","Estrela"],F:["🌸","Flor"]};
 const [emoji,label]=map[activeLetter];
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Letras vivas","lucasHome")}
 <div class="letter-show">${activeLetter}</div>
 <div class="letter-strip">${letters.map(l=>`<button class="letter ${l===activeLetter?"active":""}" data-letter="${l}">${l}</button>`).join("")}</div>
 <button class="big lavender" data-action="letter-object"><span>${activeLetter} de ${label}</span><span style="font-size:40px">${emoji}</span></button>
 <div class="bottom-nav"><button data-action="stars">⭐ Brilhar</button><button data-action="repeat">🔁 Repetir</button><button data-action="next-letter">➡️ Próxima</button></div>
 </section></main>`;
 bind();
 document.querySelectorAll("[data-letter]").forEach(b=>b.onclick=()=>{activeLetter=b.dataset.letter;playSound("click");render()});
 document.querySelector("[data-action='letter-object']").onclick=e=>{playSound("success");e.currentTarget.classList.add("pulse");stars(e.clientX,e.clientY)};
 document.querySelector("[data-action='next-letter']").onclick=()=>{activeLetter=letters[(letters.indexOf(activeLetter)+1)%letters.length];render()};
 document.querySelector("[data-action='repeat']").onclick=()=>playSound("soft");
 document.querySelector("[data-action='stars']").onclick=e=>stars(e.clientX,e.clientY);
}

function renderLucasAnimals(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Bichos amigos","lucasHome")}
 <div class="scene" id="scene"><div class="sky"></div><div class="ground"></div>
 ${hotspot("bird","35px","80px","🐦","Pássaro")}
 ${hotspot("monkey","auto","145px","🐒","Macaco","right:40px")}
 ${hotspot("dog","100px","auto","🐶","Cachorro","bottom:55px")}
 ${hotspot("duck","auto","auto","🦆","Pato","right:85px;bottom:45px")}
 </div>
 <div class="bottom-nav"><button data-action="party">🎉 Dançar</button><button data-action="bubbles">🫧 Bolhas</button><button data-action="stars">⭐ Brilhar</button></div>
 </section></main>`;
 bind();
 document.querySelectorAll("[data-animal]").forEach(b=>b.onclick=e=>{
  state.lucas.touches++;save();playSound("animal");
  b.classList.add("dancer");setTimeout(()=>b.classList.remove("dancer"),700);stars(e.clientX,e.clientY);
 });
 document.querySelector("[data-action='party']").onclick=()=>{playSound("soft");document.querySelectorAll("[data-animal]").forEach(b=>b.classList.add("dancer"));setTimeout(()=>document.querySelectorAll("[data-animal]").forEach(b=>b.classList.remove("dancer")),900)};
 document.querySelector("[data-action='bubbles']").onclick=makeBubbles;
 document.querySelector("[data-action='stars']").onclick=e=>stars(e.clientX,e.clientY);
}

function renderLucasMusic(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Bandinha suave","lucasHome")}
 <div class="section">Toque e combine os sons</div>
 <div class="instrument-grid">
 <button class="instrument" style="background:#ead7b8" data-sound="drum">🥁</button>
 <button class="instrument" style="background:#d5e6ee" data-sound="bell">🔔</button>
 <button class="instrument" style="background:#e6dbe9" data-sound="soft">🎹</button>
 <button class="instrument" style="background:#dce8d3" data-sound="click">🪇</button>
 </div>
 <button class="big lavender" style="margin-top:13px" data-action="sequence"><span>Tocar sequência suave</span><span>▶️</span></button>
 </section></main>`;
 bind();
 document.querySelectorAll("[data-sound]").forEach(b=>b.onclick=()=>{state.lucas.touches++;save();playSound(b.dataset.sound);b.classList.add("pulse");setTimeout(()=>b.classList.remove("pulse"),550)});
 document.querySelector("[data-action='sequence']").onclick=()=>playSound("soft");
}

function renderLucasColors(){
 const colors=[["#e9b7b7","🔴"],["#b8cee1","🔵"],["#eee0a8","🟡"],["#bfd8bc","🟢"]];
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Cores pastéis","lucasHome")}
 <div class="section">Toque para mudar o ambiente</div>
 <div class="color-board">${colors.map(([c,e])=>`<button class="color-btn" style="background:${c}" data-color="${c}">${e}</button>`).join("")}</div>
 <button class="big rose" style="margin-top:13px" data-action="rainbow"><span>Arco-íris suave</span><span>🌈</span></button>
 </section></main>`;
 bind();
 document.querySelectorAll("[data-color]").forEach(b=>b.onclick=()=>{document.body.style.background=b.dataset.color;playSound("click");b.classList.add("pulse");setTimeout(()=>b.classList.remove("pulse"),550)});
 document.querySelector("[data-action='rainbow']").onclick=()=>{document.body.style.background="linear-gradient(135deg,#e9b7b7,#eee0a8,#bfd8bc,#b8cee1,#d8c8e7)";playSound("success");stars()};
}

function renderLucasOcean(){
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Fundo do mar","lucasHome")}
 <div class="scene" id="scene"><div class="water"></div>
 ${hotspot("fish","35px","85px","🐠","Peixe")}
 ${hotspot("octopus","auto","180px","🐙","Polvo","right:40px")}
 ${hotspot("shell","230px","auto","🐚","Concha","bottom:55px")}
 </div>
 <div class="bottom-nav"><button data-action="bubbles">🫧 Bolhas</button><button data-action="fish-party">🐟 Nadar</button><button data-action="stars">⭐ Brilhar</button></div>
 </section></main>`;
 bind();
 document.querySelectorAll("[data-animal]").forEach(b=>b.onclick=e=>{state.lucas.touches++;save();playSound("water");b.classList.add("dancer");setTimeout(()=>b.classList.remove("dancer"),650);makeBubbles();stars(e.clientX,e.clientY)});
 document.querySelector("[data-action='bubbles']").onclick=makeBubbles;
 document.querySelector("[data-action='fish-party']").onclick=()=>playSound("soft");
 document.querySelector("[data-action='stars']").onclick=e=>stars(e.clientX,e.clientY);
}

function renderLucasSurprise(){
 const items=["🚂","🧸","🦕","🚗","⚽","🐳"];
 surpriseItem=items[Math.floor(Math.random()*items.length)];
 app.innerHTML=`<main class="app"><section class="screen">
 ${header("Caixa surpresa","lucasHome")}
 <div class="hero"><h1 style="font-size:85px">🎁</h1><p>Toque para descobrir.</p></div>
 <button class="surprise-box" data-action="reveal" id="surprise">❓</button>
 <button class="big green" style="margin-top:13px" data-action="new-surprise"><span>Nova surpresa</span><span>🔄</span></button>
 </section></main>`;
 bind();
 document.querySelector("[data-action='reveal']").onclick=()=>{document.querySelector("#surprise").textContent=surpriseItem;playSound("success");stars()};
 document.querySelector("[data-action='new-surprise']").onclick=()=>render();
}

function hotspot(action,left,top,emoji,label,extra=""){
 const style=`${left!=="auto"?`left:${left};`:""}${top!=="auto"?`top:${top};`:""}${extra}`;
 return `<button class="hotspot" style="${style}" data-animal="${action}"><span class="object">${emoji}</span><span class="label">${label}</span></button>`;
}

function bind(){
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
 document.querySelector("[data-action='unlock']")?.addEventListener("click",async()=>{await unlockAudio();render()});
 document.querySelectorAll("[data-action='mute']").forEach(b=>b.onclick=()=>{setMuted(!isMuted());render()});
}

function makeBubbles(){
 playSound("water");
 const scene=document.querySelector("#scene");
 if(!scene)return;
 const rect=scene.getBoundingClientRect();
 for(let i=0;i<14;i++){
  const b=document.createElement("div");b.className="bubble";
  const size=18+Math.random()*42;b.style.width=b.style.height=size+"px";
  b.style.left=(Math.random()*Math.max(100,rect.width-50))+"px";
  b.style.top=(rect.height-25+Math.random()*35)+"px";
  scene.appendChild(b);setTimeout(()=>b.remove(),3200);
 }
}

function stars(x=innerWidth/2,y=innerHeight/2){
 playSound("star");
 ["⭐","✨","🌟","💛","💙"].forEach((s,i)=>{
  const e=document.createElement("div");e.className="star";e.textContent=s;
  e.style.left=(x-65+Math.random()*130)+"px";
  e.style.top=(y+Math.random()*25)+"px";
  e.style.animationDelay=(i*.05)+"s";
  effects.appendChild(e);setTimeout(()=>e.remove(),1100);
 });
}

render();

if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(console.error));}
