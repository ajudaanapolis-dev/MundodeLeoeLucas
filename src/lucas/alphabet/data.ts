import type { LetterEntry } from '@/core/types';

// Cenas com composição/interação PRÓPRIA implementadas (hasBespokeScene: true).
// As demais usam o template interativo compartilhado até receberem arte dedicada.
const BESPOKE = new Set('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));

type Row = [letter: string, word: string, article: string, fact: string, bg: string, accent: string];

const ROWS: Row[] = [
  ['A', 'Axolote', 'O', 'O axolote vive na água e possui brânquias externas.', '#A8D8EA', '#F6C1CF'],
  ['B', 'Baleia', 'A', 'A baleia é um mamífero gigante que respira ar pelo espiráculo.', '#8FB7C9', '#CDE9F6'],
  ['C', 'Caracol', 'O', 'O caracol carrega a própria concha e anda bem devagar.', '#A9CBA4', '#FBE7A1'],
  ['D', 'Dionéia', 'A', 'A dionéia é uma planta que fecha a armadilha para capturar insetos.', '#B7D7A8', '#F6C1CF'],
  ['E', 'Estrela-do-mar', 'A', 'A estrela-do-mar vive no fundo do mar e costuma ter cinco braços.', '#A8D8EA', '#FBC7AE'],
  ['F', 'Formiga', 'A', 'As formigas trabalham juntas e levam comida para o formigueiro.', '#EFE4D2', '#A9CBA4'],
  ['G', 'Girafa', 'A', 'A girafa tem o pescoço comprido para alcançar as folhas altas.', '#FBE7A1', '#F1C7A6'],
  ['H', 'Helicóptero', 'O', 'O helicóptero voa girando as hélices bem rápido.', '#CDE9F6', '#8CA6C9'],
  ['I', 'Inseto', 'O', 'Os insetos têm seis patas e muitos têm asas.', '#A9CBA4', '#FBE7A1'],
  ['J', 'Joaninha', 'A', 'A joaninha é um besouro vermelho com pintinhas pretas.', '#F6C1CF', '#F6D3B4'],
  ['K', 'Kiwi', 'O', 'O kiwi é uma fruta verde por dentro, cheia de sementinhas.', '#B7D7A8', '#EFE4D2'],
  ['L', 'Leão', 'O', 'O leão vive na savana e tem uma juba ao redor da cabeça.', '#FBE7A1', '#FBC7AE'],
  ['M', 'Macaco', 'O', 'O macaco adora subir nas árvores e comer frutas.', '#A9CBA4', '#F1C7A6'],
  ['N', 'Navio', 'O', 'O navio flutua na água e leva pessoas e cargas pelo mar.', '#A8D8EA', '#FFFBF4'],
  ['O', 'Ovelha', 'A', 'A ovelha tem lã fofinha que esquenta no frio.', '#D8C7EA', '#FFFBF4'],
  ['P', 'Pipoca', 'A', 'O milho estoura com o calor e vira pipoca.', '#FBE7A1', '#FBC7AE'],
  ['Q', 'Queijo', 'O', 'O queijo é feito com leite, e o ratinho adora.', '#FBE7A1', '#EFE4D2'],
  ['R', 'Robô', 'O', 'O robô é uma máquina que segue comandos para se mover.', '#CDE9F6', '#D8C7EA'],
  ['S', 'Sapo', 'O', 'O sapo pula bem alto e vive perto da água.', '#A9CBA4', '#A8D8EA'],
  ['T', 'Tartaruga', 'A', 'A tartaruga leva o casco nas costas e anda devagar.', '#B7D7A8', '#FBE7A1'],
  ['U', 'Urso', 'O', 'O urso é grande, forte e adora mel.', '#F1C7A6', '#FBE7A1'],
  ['V', 'Vulcão', 'O', 'O vulcão é uma montanha por onde sai lava quente.', '#FBC7AE', '#F6C1CF'],
  ['W', 'Waffle', 'O', 'O waffle é uma massa quadriculada bem gostosa.', '#FBE7A1', '#F1C7A6'],
  ['X', 'Xilofone', 'O', 'O xilofone tem barrinhas coloridas que fazem música.', '#D8C7EA', '#A8D8EA'],
  ['Y', 'Yak', 'O', 'O yak é um animal peludo que vive nas montanhas geladas.', '#CDE9F6', '#EFE4D2'],
  ['Z', 'Zebra', 'A', 'A zebra é branca com listras pretas, cada uma diferente.', '#EFE4D2', '#3C3A4B'],
];

export const LETTERS: LetterEntry[] = ROWS.map(([letter, word, article, fact, bg, accent]) => ({
  letter,
  word,
  article,
  fact,
  palette: { bg, accent },
  hasBespokeScene: BESPOKE.has(letter),
}));

export function getLetter(letter: string): LetterEntry | undefined {
  return LETTERS.find((l) => l.letter === letter.toUpperCase());
}
