const STORAGE_KEY = "mll-state-v2";

const DEFAULT_STATE = {
  version: 2,
  stars: 0,
  leo: {
    correct: 0,
    errors: 0,
    skills: {},
    completed: {}
  }
};

function cloneDefault(){
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function migrateLegacy(){
  const state = cloneDefault();
  state.stars = Number(localStorage.getItem("mll-stars") || 0);

  try{
    const legacyLeo = JSON.parse(localStorage.getItem("mll-leo") || "{}");
    state.leo = {
      ...state.leo,
      ...legacyLeo,
      skills: legacyLeo.skills || {},
      completed: legacyLeo.completed || {}
    };
  }catch{}

  return state;
}

export function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      return {
        ...cloneDefault(),
        ...parsed,
        leo: {
          ...cloneDefault().leo,
          ...(parsed.leo || {}),
          skills: parsed.leo?.skills || {},
          completed: parsed.leo?.completed || {}
        }
      };
    }
  }catch(error){
    console.warn("Falha ao carregar progresso:", error);
  }

  const migrated = migrateLegacy();
  saveState(migrated);
  return migrated;
}

export function saveState(state){
  const snapshot = {
    version: 2,
    savedAt: new Date().toISOString(),
    stars: Number(state.stars || 0),
    leo: {
      correct: Number(state.leo?.correct || 0),
      errors: Number(state.leo?.errors || 0),
      skills: state.leo?.skills || {},
      completed: state.leo?.completed || {}
    }
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  localStorage.setItem("mll-stars", String(snapshot.stars));
  localStorage.setItem("mll-leo", JSON.stringify(snapshot.leo));
}

export function exportState(state){
  const payload = {
    app: "Mundo de Léo e Lucas",
    schemaVersion: 2,
    exportedAt: new Date().toISOString(),
    progress: state
  };

  const blob = new Blob(
    [JSON.stringify(payload, null, 2)],
    {type: "application/json"}
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `progresso-leo-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function importState(file){
  const text = await file.text();
  const parsed = JSON.parse(text);
  const candidate = parsed.progress || parsed;

  if(!candidate || typeof candidate !== "object" || !candidate.leo){
    throw new Error("Arquivo de progresso inválido.");
  }

  const normalized = {
    ...cloneDefault(),
    ...candidate,
    leo: {
      ...cloneDefault().leo,
      ...(candidate.leo || {}),
      skills: candidate.leo?.skills || {},
      completed: candidate.leo?.completed || {}
    }
  };

  saveState(normalized);
  return normalized;
}

export function resetState(){
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem("mll-stars");
  localStorage.removeItem("mll-leo");
}
