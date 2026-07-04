
const KEY="mll-pastel-state-v1";
const DEFAULT_STATE={
 stars:0,
 leo:{correct:0,errors:0,skills:{},completed:{}},
 lucas:{touches:0,worlds:{}}
};

export function loadState(){
 try{
  const parsed=JSON.parse(localStorage.getItem(KEY)||"null");
  if(parsed) return {
   ...DEFAULT_STATE,
   ...parsed,
   leo:{...DEFAULT_STATE.leo,...(parsed.leo||{})},
   lucas:{...DEFAULT_STATE.lucas,...(parsed.lucas||{})}
  };
 }catch{}
 return JSON.parse(JSON.stringify(DEFAULT_STATE));
}
export function saveState(state){
 localStorage.setItem(KEY,JSON.stringify({...state,savedAt:new Date().toISOString()}));
}
export function exportState(state){
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
