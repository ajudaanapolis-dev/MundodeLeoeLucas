
const files={
 click:"./assets/audio/click.wav",
 success:"./assets/audio/success.wav",
 error:"./assets/audio/error.wav",
 discovery:"./assets/audio/discovery.wav",
 soft:"./assets/audio/soft.wav",
 animal:"./assets/audio/animal.wav",
 water:"./assets/audio/water.wav",
 star:"./assets/audio/star.wav",
 drum:"./assets/audio/drum.wav",
 bell:"./assets/audio/bell.wav"
};
const audios={};
let ready=false;
let muted=false;

export async function unlockAudio(){
 await Promise.all(Object.entries(files).map(([name,src])=>new Promise(resolve=>{
  const a=new Audio(src);
  a.preload="auto";
  a.addEventListener("canplaythrough",resolve,{once:true});
  a.addEventListener("error",resolve,{once:true});
  a.load();
  audios[name]=a;
 })));
 ready=true;
 playSound("discovery");
 return true;
}
export function playSound(name){
 if(!ready||muted)return false;
 const a=audios[name]||audios.click;
 a.currentTime=0;
 a.play().catch(()=>{});
 return true;
}
export function setMuted(value){muted=Boolean(value)}
export function isMuted(){return muted}
export function isReady(){return ready}
