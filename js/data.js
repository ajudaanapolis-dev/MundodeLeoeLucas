
export const domains = [
  {id:"ecosystems",emoji:"🐠",title:"Ecossistemas",desc:"Equilíbrio de aquários, alimentação, oxigênio e resíduos.",color:"#bfefff"},
  {id:"carnivorous",emoji:"🌱",title:"Plantas carnívoras",desc:"Luz, água, armadilhas, alimentação e experimentação.",color:"#d9ffc7"},
  {id:"invertebrates",emoji:"🕷️",title:"Invertebrados",desc:"Patas, antenas, segmentos, habitat e classificação.",color:"#ffe3ba"},
  {id:"axolotl",emoji:"🦎",title:"Axolotes",desc:"Brânquias, temperatura, comportamento e cuidado responsável.",color:"#f0dcff"},
  {id:"logic",emoji:"🧠",title:"Lógica científica",desc:"Hipóteses, variáveis, padrões e interpretação de dados.",color:"#ffd8e9"}
];

export const questions = {
  ecosystems:[
    {lvl:1,q:"A água do aquário ficou turva depois de muita alimentação. O que investigar primeiro?",ctx:"Há comida acumulada no fundo e os peixes continuam ativos.",a:"Excesso de alimento",o:[["Excesso de alimento","🍽️"],["Pouca luz","💡"],["Cor do cascalho","🪨"],["Formato do aquário","⬜"]]},
    {lvl:2,q:"Os peixes estão próximos da superfície e respirando rapidamente. Qual variável merece prioridade?",ctx:"Temperatura normal, água limpa, mas baixa movimentação na superfície.",a:"Oxigenação",o:[["Oxigenação","💨"],["Cor da água","🎨"],["Quantidade de plantas decorativas","🌿"],["Tamanho das pedras","🪨"]]},
    {lvl:3,q:"Qual mudança permite testar se o excesso de ração causa água turva?",ctx:"Você quer mudar apenas uma variável.",a:"Reduzir a ração e manter o resto igual",o:[["Reduzir a ração e manter o resto igual","⚖️"],["Trocar ração, luz e temperatura","🔄"],["Adicionar mais peixes","🐟"],["Retirar o filtro","🚫"]]}
  ],
  carnivorous:[
    {lvl:1,q:"Uma dionéia recebeu três insetos e tem apenas quatro horas de luz. Qual fator parece mais limitante?",ctx:"O substrato está úmido e as folhas permanecem verdes.",a:"Luz",o:[["Luz","☀️"],["Mais insetos","🪰"],["Tocar nas armadilhas","✋"],["Mais fertilizante","🧪"]]},
    {lvl:2,q:"Qual é a melhor forma de testar se mais luz melhora o crescimento?",ctx:"Você precisa comparar condições de forma justa.",a:"Duas plantas iguais, mudando apenas a luz",o:[["Duas plantas iguais, mudando apenas a luz","🌱🌱"],["Uma planta com várias mudanças","🔀"],["Alimentar muito uma só planta","🪰"],["Comparar espécies diferentes","🌿"]]},
    {lvl:3,q:"Por que fechar armadilhas repetidamente sem alimento pode prejudicar a dionéia?",ctx:"Cada fechamento exige movimento celular e energia.",a:"Gasta energia sem obter nutrientes",o:[["Gasta energia sem obter nutrientes","⚡"],["Faz a planta crescer mais rápido","📈"],["Aumenta a fotossíntese","☀️"],["Resfria o substrato","❄️"]]}
  ],
  invertebrates:[
    {lvl:1,q:"Um animal tem oito patas e não possui antenas. Qual grupo é mais provável?",ctx:"O corpo está dividido em duas regiões.",a:"Aracnídeo",o:[["Inseto","🪲"],["Aracnídeo","🕷️"],["Molusco","🐌"],["Anelídeo","🪱"]]},
    {lvl:2,q:"Qual característica separa melhor um inseto de uma aranha?",ctx:"Observe estruturas corporais estáveis.",a:"Número de patas e presença de antenas",o:[["Número de patas e presença de antenas","🔎"],["Cor do corpo","🎨"],["Velocidade","💨"],["Tamanho","📏"]]},
    {lvl:3,q:"Um organismo tem corpo mole, concha e não possui patas articuladas. Qual hipótese é mais forte?",ctx:"Ele se move lentamente sobre uma superfície úmida.",a:"Molusco",o:[["Inseto","🪲"],["Aracnídeo","🕷️"],["Molusco","🐌"],["Crustáceo","🦀"]]}
  ],
  axolotl:[
    {lvl:1,q:"O axolote é peixe ou anfíbio?",ctx:"Ele vive na água e mantém brânquias externas.",a:"Anfíbio",o:[["Peixe","🐟"],["Anfíbio","🦎"],["Réptil","🐍"],["Molusco","🐌"]]},
    {lvl:2,q:"Brânquias curvadas, baixa alimentação e água a 22°C sugerem investigar primeiro:",ctx:"Axolotes preferem água mais fria.",a:"Temperatura e qualidade da água",o:[["Temperatura e qualidade da água","🌡️💧"],["Adicionar mais peixes","🐟"],["Aumentar a luz","💡"],["Forçar alimentação","🍽️"]]},
    {lvl:3,q:"Por que colocar peixes pequenos junto ao axolote pode ser inadequado?",ctx:"Considere estresse, mordidas e risco de transmissão.",a:"Pode causar ferimentos, estresse ou doença",o:[["Pode causar ferimentos, estresse ou doença","⚠️"],["Aumenta a regeneração","✨"],["Esfria a água","❄️"],["Melhora as brânquias","🫁"]]}
  ],
  logic:[
    {lvl:1,q:"Em um experimento, o que significa mudar apenas uma variável?",ctx:"As outras condições permanecem iguais.",a:"Permite identificar melhor a causa do resultado",o:[["Permite identificar melhor a causa do resultado","🧪"],["Deixa o experimento mais bonito","🎨"],["Garante sempre o resultado esperado","✅"],["Evita observar os dados","🙈"]]},
    {lvl:2,q:"Uma hipótese é:",ctx:"Ela deve poder ser testada por observação ou experimento.",a:"Uma explicação provisória que pode ser testada",o:[["Uma explicação provisória que pode ser testada","💭"],["Uma certeza impossível de mudar","🔒"],["Um desenho do organismo","✏️"],["Uma recompensa","🏆"]]},
    {lvl:3,q:"Dois aquários diferem em luz e alimento. Se um fica turvo, qual é o problema da comparação?",ctx:"Mais de uma variável mudou ao mesmo tempo.",a:"Não é possível saber qual variável causou o efeito",o:[["Não é possível saber qual variável causou o efeito","❓"],["O aquário está pequeno","📦"],["Faltou nomear os peixes","🏷️"],["A água precisa ser azul","🔵"]]}
  ]
};

export const scenes = ["garden","ocean","music","night","colors"];
