
const AUDIO_FILES = {
  click:"./assets/audio/click.wav",
  success:"./assets/audio/success.wav",
  error:"./assets/audio/error.wav",
  unlock:"./assets/audio/unlock.wav",
  soft:"./assets/audio/soft.wav",
  animal:"./assets/audio/animal.wav",
  water:"./assets/audio/water.wav",
  feed:"./assets/audio/feed.wav"
};

let unlocked = false;
let enabled = true;
let context = null;
const cache = new Map();

export async function unlockAudio(){
  try{
    context = context || new (window.AudioContext || window.webkitAudioContext)();
    if(context.state === "suspended") await context.resume();
    await Promise.all(Object.entries(AUDIO_FILES).map(async ([name,url])=>{
      const response = await fetch(url);
      if(!response.ok) throw new Error(`Falha ao carregar ${url}`);
      const data = await response.arrayBuffer();
      const buffer = await context.decodeAudioData(data.slice(0));
      cache.set(name, buffer);
    }));
    unlocked = true;
    playSound("unlock");
    return true;
  }catch(error){
    console.error("Falha ao iniciar áudio:", error);
    return false;
  }
}

export function setAudioEnabled(value){ enabled = Boolean(value); }
export function isAudioEnabled(){ return enabled; }
export function isAudioUnlocked(){ return unlocked; }

export function playSound(name){
  if(!enabled || !unlocked || !context) return false;
  const buffer = cache.get(name) || cache.get("click");
  if(!buffer) return false;
  const source = context.createBufferSource();
  const gain = context.createGain();
  gain.gain.value = 0.85;
  source.buffer = buffer;
  source.connect(gain);
  gain.connect(context.destination);
  source.start();
  return true;
}

document.addEventListener("visibilitychange", async ()=>{
  if(document.visibilityState === "visible" && context?.state === "suspended"){
    try{ await context.resume(); }catch{}
  }
});
