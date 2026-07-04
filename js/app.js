import { domains, questions } from "./data.js";
import { unlockAudio, playSound, setAudioEnabled, isAudioEnabled } from "./audio.js";
import { loadState, saveState, exportState, importState } from "./storage.js";

const app = document.querySelector("#app");
const sparkles = document.querySelector("#sparkles");
let state = loadState();

let route = "home";
let currentDomain = "ecosystems";
let currentQuestion = null;
let calmTimer = null;
let answered = false;

const MAX_LEVEL = 3;

function completionKey(domainId, level){
  return `${domainId}:${level}`;
}

function globalLevel(){
  let level = 1;
  for(let tier = 1; tier < MAX_LEVEL; tier++){
    const tierComplete = domains.every(
      domain => state.leo.completed?.[completionKey(domain.id, tier)]
    );
    if(tierComplete) level = tier + 1;
    else break;
  }
  return level;
}

function completedCount(level = globalLevel()){
  return domains.filter(
    domain => state.leo.completed?.[completionKey(domain.id, level)]
  ).length;
}

function domainStatus(domainId){
  const level = globalLevel();
  const complete = Boolean(
    state.leo.completed?.[completionKey(domainId, level)]
  );
  return {level, complete};
}

function ensureSkill(id){
  return state.leo.skills[id] ||= {
    correct: 0,
    errors: 0,
    mastery: 0
  };
}

function save(){
  saveState(state);
}

function button(label, cls, action, icon=""){
  return `<button class="${cls}" data-action="${action}">
    <span>${label}</span><span>${icon}</span>
  </button>`;
}

function render(){
  if(route === "home") return renderHome();
  if(route === "leoHome") return renderLeoHome();
  if(route === "leoChallenge") return renderLeoChallenge();
  if(route === "leoDashboard") return renderLeoDashboard();
  if(route === "lucasHome") return renderLucasHome();
}

function renderHome(){
  app.innerHTML = `
  <section class="screen">
    <div class="topbar">
      <div class="pill">Mundo de Léo e Lucas</div>
      <div class="pill">⭐ ${state.stars}</div>
    </div>
    <div class="hero">
      <h1>Mundo de <span>Léo e Lucas</span></h1>
      <p>Um único universo, com experiências diferentes para cada fase.</p>
    </div>
    <div class="audio-box" id="audioBox">
      <strong>Ativar os sons do aplicativo</strong>
      <p>No iPhone, o som precisa ser liberado por um primeiro toque.</p>
      ${button("Ativar sons","big yellow","unlock-audio","🔊")}
    </div>
    <div class="profile-grid">
      <button class="profile leo" data-route="leoHome">
        <div class="face">🧒</div>
        <h2>Jornada do Léo</h2>
        <p>Biologia, ecossistemas, lógica, hipóteses e desafios que evoluem conforme o desempenho.</p>
        <span class="big orange"><span>Entrar</span><span>🔬</span></span>
      </button>
      <button class="profile lucas" data-route="lucasHome">
        <div class="face">👶</div>
        <h2>Mundo do Lucas</h2>
        <p>Causa e efeito, som, movimento, luz, ritmo, animais e exploração sensorial livre.</p>
        <span class="big blue"><span>Explorar</span><span>🌈</span></span>
      </button>
    </div>
  </section>`;
  bindCommon();
}

function renderLeoHome(){
  const level = globalLevel();
  const done = completedCount(level);
  const gateMessage = level < MAX_LEVEL
    ? `Nível ${level}: ${done}/${domains.length} áreas concluídas. Complete todas para abrir o nível ${level + 1}.`
    : `Nível ${level}: trilha avançada liberada. Continue praticando e ampliando o conteúdo.`;

  const rows = domains.map(domain => {
    const status = domainStatus(domain.id);
    const skill = ensureSkill(domain.id);
    const label = status.complete
      ? `${domain.title} — nível ${status.level} concluído`
      : `${domain.title} — nível ${status.level}`;

    return `<div class="node-row">
      <button class="node" style="background:${domain.color}" data-domain="${domain.id}">
        ${status.complete ? "✅" : domain.emoji}
      </button>
      <div class="node-info">
        <h3>${label}</h3>
        <p>${domain.desc}</p>
        <div class="mastery">
          ${[1,2,3,4].map(n =>
            `<span class="${(skill.mastery||0)>=n?'on':''}"></span>`
          ).join("")}
        </div>
      </div>
    </div>`;
  }).join("");

  app.innerHTML = `
  <section class="screen">
    <div class="topbar">
      <button class="icon" data-route="home">⬅️</button>
      <div class="pill">Jornada do Léo</div>
      <div class="pill">Nível geral ${level}</div>
    </div>
    <div class="section">Trilha adaptativa de descobertas</div>
    <div class="lab">
      <strong>${gateMessage}</strong>
      <div class="progress">
        <div style="width:${(done/domains.length)*100}%"></div>
      </div>
    </div>
    <div class="track"><div class="track-line"></div>${rows}</div>
    ${button("Ver evolução e salvar progresso","big purple","dashboard","📊")}
  </section>`;

  bindCommon();

  document.querySelectorAll("[data-domain]").forEach(el=>{
    el.addEventListener("click", ()=>{
      currentDomain = el.dataset.domain;
      const levelNow = globalLevel();
      currentQuestion = questions[currentDomain].find(
        question => question.lvl === levelNow
      );

      if(!currentQuestion){
        alert("Ainda não existe uma atividade cadastrada para este nível.");
        return;
      }

      route = "leoChallenge";
      answered = false;
      playSound("click");
      render();
    });
  });
}

function renderLeoChallenge(){
  const domain = domains.find(d=>d.id===currentDomain);
  const level = globalLevel();
  const alreadyComplete = Boolean(
    state.leo.completed?.[completionKey(currentDomain, level)]
  );
  const question = currentQuestion;

  const choices = [...question.o]
    .sort(()=>Math.random()-.5)
    .map(([text,emoji]) =>
      `<button class="choice" data-answer="${text}">
        ${emoji}<small>${text}</small>
      </button>`
    ).join("");

  app.innerHTML = `
  <section class="screen">
    <div class="topbar">
      <button class="icon" data-route="leoHome">⬅️</button>
      <div class="pill">${domain.title} · nível ${level}</div>
      <div class="pill">⭐ ${state.stars}</div>
    </div>
    <div class="progress">
      <div style="width:${alreadyComplete ? 100 : 0}%"></div>
    </div>
    <div class="lab">
      <h2>${question.q}</h2>
      <p>${question.ctx}</p>
      <div class="choice-grid">${choices}</div>
      <div class="status" id="challengeStatus">
        ${alreadyComplete
          ? "Esta etapa já foi concluída. Você pode revisá-la sem alterar a progressão."
          : "Observe as pistas antes de responder."}
      </div>
    </div>
    <button class="big green" id="finishChallenge" style="display:none">
      <span>Concluir etapa e voltar à trilha</span><span>➡️</span>
    </button>
  </section>`;

  bindCommon();

  document.querySelectorAll("[data-answer]").forEach(el=>{
    el.addEventListener("click", ()=>answerChallenge(el, question, level));
  });
}

function answerChallenge(el, question, level){
  if(answered) return;

  const status = document.querySelector("#challengeStatus");
  const skill = ensureSkill(currentDomain);
  const key = completionKey(currentDomain, level);
  const firstCompletion = !state.leo.completed?.[key];

  if(el.dataset.answer === question.a){
    answered = true;
    el.classList.add("correct");

    if(firstCompletion){
      state.leo.completed ||= {};
      state.leo.completed[key] = {
        completedAt: new Date().toISOString(),
        errorsBeforeSuccess: skill.errors || 0
      };
      skill.correct++;
      state.leo.correct++;
      skill.mastery = Math.min(4, (skill.mastery || 0) + 1);
      state.stars += 12;
    }

    const done = completedCount(level);
    const unlockedNext = level < MAX_LEVEL && done === domains.length;

    status.textContent = firstCompletion
      ? unlockedNext
        ? `Correto. Todas as áreas do nível ${level} foram concluídas. O nível ${level + 1} foi liberado!`
        : `Correto. Etapa concluída. Faltam ${domains.length - done} área(s) para liberar o nível ${level + 1}.`
      : "Revisão correta. Esta etapa já estava concluída.";

    document.querySelector("#finishChallenge").style.display = "flex";
    playSound("success");
    burst();
  }else{
    el.classList.add("wrong");
    skill.errors++;
    state.leo.errors++;
    status.textContent = "Revise as pistas e elimine as opções incompatíveis.";
    playSound("error");
    setTimeout(()=>el.classList.remove("wrong"),500);
  }

  save();
}

function renderLeoDashboard(){
  const level = globalLevel();
  const mastered = Object.values(state.leo.skills)
    .filter(skill => (skill.mastery||0)>=3).length;

  const cards = domains.map(domain=>{
    const skill = ensureSkill(domain.id);
    const completedLevels = [1,2,3].filter(
      tier => state.leo.completed?.[completionKey(domain.id,tier)]
    );

    return `<div class="level-card">
      <strong>${domain.emoji} ${domain.title}</strong>
      <small>
        Acertos: ${skill.correct||0} · Erros: ${skill.errors||0} ·
        Níveis concluídos: ${completedLevels.length ? completedLevels.join(", ") : "nenhum"}
      </small>
      <div class="mastery">
        ${[1,2,3,4].map(n =>
          `<span class="${(skill.mastery||0)>=n?'on':''}"></span>`
        ).join("")}
      </div>
    </div>`;
  }).join("");

  app.innerHTML = `
  <section class="screen">
    <div class="topbar">
      <button class="icon" data-route="leoHome">⬅️</button>
      <div class="pill">Evolução do Léo</div>
      <span style="width:52px"></span>
    </div>

    <div class="statgrid">
      <div class="stat"><strong>${state.leo.correct||0}</strong>etapas concluídas</div>
      <div class="stat"><strong>${state.leo.errors||0}</strong>tentativas incorretas</div>
      <div class="stat"><strong>${mastered}</strong>habilidades dominadas</div>
      <div class="stat"><strong>${level}</strong>nível geral</div>
    </div>

    <div style="margin-top:13px">${cards}</div>

    <div class="lab">
      <h2>Backup da progressão</h2>
      <p>
        O progresso permanece neste navegador após atualizar a página.
        Exporte um JSON para guardar uma cópia ou transferir para outro aparelho.
      </p>
      ${button("Baixar progresso em JSON","big blue","export-progress","⬇️")}
      <label class="big green" style="margin-top:10px">
        <span>Importar progresso em JSON</span><span>⬆️</span>
        <input id="progressFile" type="file" accept="application/json,.json" hidden>
      </label>
    </div>
  </section>`;

  bindCommon();
}

function sceneMarkup(scene){
  if(scene==="garden") return `<div class="sky"></div><div class="ground"></div>
    ${hotspot("tree","25px","145px","🌳","Árvore")}
    ${hotspot("bird","245px","180px","🐦","Pássaro")}
    ${hotspot("dog","auto","auto","🐶","Cachorro","right:35px;bottom:65px")}
    ${hotspot("flower","165px","auto","🌻","Flor","bottom:55px")}`;

  if(scene==="ocean") return `<div class="water" style="inset:0"></div>
    ${hotspot("fish","45px","110px","🐠","Peixe")}
    ${hotspot("octopus","auto","215px","🐙","Polvo","right:50px")}
    ${hotspot("shell","230px","auto","🐚","Concha","bottom:55px")}
    ${hotspot("plant","80px","auto","🌿","Planta","bottom:35px")}`;

  if(scene==="music") return `<div style="position:absolute;inset:0;background:linear-gradient(#fff0b3,#f3c3e4)"></div>
    ${hotspot("drum","50px","90px","🥁","Tambor")}
    ${hotspot("bell","auto","95px","🔔","Sino","right:45px")}
    ${hotspot("piano","245px","auto","🎹","Piano","bottom:80px")}
    ${hotspot("maraca","65px","auto","🪇","Chocalho","bottom:65px")}`;

  if(scene==="night") return `<div style="position:absolute;inset:0;background:linear-gradient(#10295b,#284a78)"></div>
    ${hotspot("moon","45px","55px","🌙","Lua")}
    ${hotspot("owl","auto","auto","🦉","Coruja","right:65px;bottom:80px")}
    ${hotspot("firefly","245px","auto","✨","Vagalumes","bottom:45px")}`;

  return `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#ff9f9f,#ffe38d,#9de1a0,#9fd0ff,#d3a8ff)"></div>
    ${hotspot("red","55px","95px","🔴","Vermelho")}
    ${hotspot("blue","auto","95px","🔵","Azul","right:60px")}
    ${hotspot("yellow","235px","auto","🟡","Amarelo","bottom:80px")}
    ${hotspot("green","65px","auto","🟢","Verde","bottom:65px")}`;
}

function hotspot(action,left,top,emoji,label,extra=""){
  const style = `${left!=="auto"?`left:${left};`:""}${top!=="auto"?`top:${top};`:""}${extra}`;
  return `<button class="hotspot" style="${style}" data-sensory="${action}">
    <span class="obj">${emoji}</span><span class="label">${label}</span>
  </button>`;
}

function renderLucasHome(scene="garden"){
  app.innerHTML = `
  <section class="screen">
    <div class="topbar">
      <button class="icon" data-route="home">⬅️</button>
      <div class="pill">Mundo do Lucas</div>
      <button class="icon" data-action="toggle-audio">
        ${isAudioEnabled()?"🔊":"🔇"}
      </button>
    </div>

    <div class="scene-tabs">
      ${["garden","ocean","music","night","colors"].map((item,index)=>
        `<button class="tab ${item===scene?"active":""}" data-scene="${item}">
          ${["Jardim","Oceano","Música","Noite","Cores"][index]}
        </button>`
      ).join("")}
    </div>

    <div class="scene" id="lucasScene">${sceneMarkup(scene)}</div>

    <div class="scene-controls">
      <button data-action="bubbles">🫧 Bolhas</button>
      <button data-action="light">💡 Luz</button>
      <button data-action="calm">🎵 Som suave</button>
    </div>

    <div class="panel" style="margin-top:12px">
      <strong>Exploração livre</strong>
      <p>Cada objeto reage com movimento, som, luz ou vibração. Não há resposta errada.</p>
    </div>
  </section>`;

  bindCommon();

  document.querySelectorAll("[data-scene]").forEach(el=>{
    el.addEventListener("click", ()=>{
      playSound("click");
      renderLucasHome(el.dataset.scene);
    });
  });

  document.querySelectorAll("[data-sensory]").forEach(el=>{
    el.addEventListener("click", event=>
      sensoryAction(el.dataset.sensory,event,el)
    );
  });
}

function sensoryAction(action,event,el){
  navigator.vibrate?.(30);

  if(["bird","fish","octopus","dog","owl"].includes(action)){
    playSound("animal");
    el.animate(
      [{transform:"scale(1)"},{transform:"scale(1.18) rotate(4deg)"},{transform:"scale(1)"}],
      500
    );
  }else if(["drum","bell","piano","maraca"].includes(action)){
    playSound("soft");
    el.animate(
      [{transform:"rotate(-8deg)"},{transform:"rotate(8deg)"},{transform:"rotate(0)"}],
      400
    );
  }else if(action==="firefly"){
    for(let i=0;i<12;i++) createFirefly();
  }else if(["red","blue","yellow","green"].includes(action)){
    playSound("click");
    el.animate(
      [{transform:"scale(1)"},{transform:"scale(1.35)"},{transform:"scale(1)"}],
      500
    );
  }else{
    playSound("water");
    bubbleBurst(event.clientX,event.clientY);
  }

  burst(event.clientX,event.clientY);
}

function bindCommon(){
  document.querySelectorAll("[data-route]").forEach(el=>{
    el.addEventListener("click", ()=>{
      route = el.dataset.route;
      playSound("click");
      render();
    });
  });

  document.querySelector("[data-action='unlock-audio']")
    ?.addEventListener("click", async ()=>{
      const ok = await unlockAudio();
      const box = document.querySelector("#audioBox");
      if(ok && box) box.style.display = "none";
      if(!ok) alert("O navegador não liberou o áudio.");
    });

  document.querySelector("#finishChallenge")
    ?.addEventListener("click", ()=>{
      route = "leoHome";
      render();
    });

  document.querySelector("[data-action='dashboard']")
    ?.addEventListener("click", ()=>{
      route = "leoDashboard";
      render();
    });

  document.querySelector("[data-action='export-progress']")
    ?.addEventListener("click", ()=>exportState(state));

  document.querySelector("#progressFile")
    ?.addEventListener("change", async event=>{
      const file = event.target.files?.[0];
      if(!file) return;

      try{
        state = await importState(file);
        alert("Progresso importado com sucesso.");
        renderLeoDashboard();
      }catch(error){
        alert(error.message || "Não foi possível importar o arquivo.");
      }
    });

  document.querySelector("[data-action='toggle-audio']")
    ?.addEventListener("click", ()=>{
      setAudioEnabled(!isAudioEnabled());
      renderLucasHome();
    });

  document.querySelector("[data-action='bubbles']")
    ?.addEventListener("click", ()=>{
      for(let i=0;i<12;i++){
        setTimeout(()=>bubbleBurst(80+Math.random()*500,350),i*80);
      }
      playSound("water");
    });

  document.querySelector("[data-action='light']")
    ?.addEventListener("click", ()=>{
      const scene = document.querySelector("#lucasScene");
      scene.style.filter = scene.style.filter ? "" : "brightness(.65)";
      playSound("click");
    });

  document.querySelector("[data-action='calm']")
    ?.addEventListener("click", event=>{
      if(calmTimer){
        clearInterval(calmTimer);
        calmTimer = null;
        event.currentTarget.textContent = "🎵 Som suave";
      }else{
        calmTimer = setInterval(()=>playSound("soft"),1000);
        event.currentTarget.textContent = "⏹️ Parar";
      }
    });
}

function bubbleBurst(x,y){
  const scene = document.querySelector("#lucasScene");
  if(!scene) return;

  const rect = scene.getBoundingClientRect();

  for(let i=0;i<8;i++){
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const size = 15 + Math.random()*28;
    bubble.style.width = bubble.style.height = size+"px";
    bubble.style.left = (x-rect.left-20+Math.random()*40)+"px";
    bubble.style.top = (y-rect.top)+"px";

    scene.appendChild(bubble);
    setTimeout(()=>bubble.remove(),3400);
  }
}

function createFirefly(){
  const scene = document.querySelector("#lucasScene");
  if(!scene) return;

  const firefly = document.createElement("div");
  firefly.className = "firefly";
  firefly.textContent = "•";
  firefly.style.left = (30+Math.random()*620)+"px";
  firefly.style.top = (220+Math.random()*180)+"px";

  scene.appendChild(firefly);
  setTimeout(()=>firefly.remove(),1900);
}

function burst(x=innerWidth/2,y=innerHeight/2){
  ["⭐","✨","🌟","🧠","🔬"].forEach((symbol,index)=>{
    const element = document.createElement("div");
    element.className = "spark";
    element.textContent = symbol;
    element.style.left = (x-65+Math.random()*130)+"px";
    element.style.top = (y+Math.random()*30)+"px";
    element.style.animationDelay = (index*.05)+"s";

    sparkles.appendChild(element);
    setTimeout(()=>element.remove(),1100);
  });
}

render();

if("serviceWorker" in navigator){
  window.addEventListener("load", ()=>
    navigator.serviceWorker.register("./service-worker.js").catch(console.error)
  );
}
