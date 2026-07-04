
const DEFAULT_LEO = {correct:0,errors:0,skills:{}};

export function loadState(){
  return {
    stars:Number(localStorage.getItem("mll-stars") || 0),
    leo:JSON.parse(localStorage.getItem("mll-leo") || JSON.stringify(DEFAULT_LEO))
  };
}

export function saveState(state){
  localStorage.setItem("mll-stars", String(state.stars));
  localStorage.setItem("mll-leo", JSON.stringify(state.leo));
}

export function resetState(){
  localStorage.removeItem("mll-stars");
  localStorage.removeItem("mll-leo");
}
