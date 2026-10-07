/*
 * Programação do FLIM, conforme o cronograma da organização.
 * Os horários indicam o início das atividades.
 * `dias` e `oficinas` alimentam a página /programacao; `atividadesInscricao` são as opções do formulário.
 */

// Temas das palestras, repetidos na agenda e nos destaques. O de Socorro Acioli será informado pela organização.
const temaBraulio = "Poesia que transforma";

export type ItemAgenda = {
  horario: string;
  titulo: string;
  detalhes?: string[];
  // Atividade com vagas limitadas, escolhida no formulário de inscrição.
  comInscricao?: boolean;
};

export type Dia = {
  id: string;
  data: string;
  titulo: string;
  local: string;
  itens: ItemAgenda[];
  notas?: string[];
};

export const dias: Dia[] = [
  {
    id: "dia-11",
    data: "Sexta-feira, 11 de dezembro",
    titulo: "Abertura",
    local: "Mirante do Canto",
    itens: [
      { horario: "16h", titulo: "Início da programação de abertura" },
      { horario: "17h", titulo: "Teatro Lusíadas", detalhes: ["Inês de Castro: A Rainha Morta."] },
      { horario: "17h15", titulo: "Apresentação musical", detalhes: ["Banda de Música Nair Austero Soares."] },
      {
        horario: "17h30",
        titulo: "Palestra com Bráulio Bessa",
        detalhes: [`Tema: ${temaBraulio}.`],
        comInscricao: true,
      },
    ],
    notas: ["Inscrição gratuita para 600 pessoas. Contribuição: 2 kg de alimentos."],
  },
  {
    id: "dia-12",
    data: "Sábado, 12 de dezembro",
    titulo: "Painéis Culturais Almino Afonso",
    local: "Casa de Cultura e Coreto",
    itens: [
      { horario: "9h", titulo: "Escola de Música Eliseu Ventania (EMEV)", detalhes: ["Apresentação de 15 minutos."] },
      {
        horario: "9h30",
        titulo: "Painel: Literatura e identidade",
        detalhes: ["Academia de Letras de Martins (ALAM)."],
        comInscricao: true,
      },
      { horario: "11h10", titulo: "Apresentação cultural", detalhes: ["Luiz Gonzaga (CEPAF), 15 minutos."] },
      {
        horario: "11h30",
        titulo: "Painel: Educação, oportunidade e evolução",
        detalhes: ["Genisa Raulino."],
        comInscricao: true,
      },
      { horario: "14h", titulo: "Apresentação musical", detalhes: ["Clícia, violino."] },
      {
        horario: "14h15",
        titulo: "Painel: Escreva, leia... eternize-se",
        detalhes: ["Marilene Paiva."],
        comInscricao: true,
      },
      { horario: "15h30", titulo: "Apresentação cultural", detalhes: ["Xaxado, 15 minutos."] },
      {
        horario: "15h45",
        titulo: "Painel: Povo, natureza e poesia",
        detalhes: ["Poeta Antônio Francisco."],
        comInscricao: true,
      },
      {
        horario: "16h",
        titulo: "Premiação do concurso de desenho",
        detalhes: ["Na Feira Literária Fátima Baliza."],
      },
      {
        horario: "17h30",
        titulo: "Palestra com Socorro Acioli",
        detalhes: ["Encerramento da programação na Casa de Cultura."],
        comInscricao: true,
      },
      {
        horario: "20h",
        titulo: "Sarau Poético Cosme Lemos",
        detalhes: ["Com o poeta Antônio Francisco e restaurante literário, no Coreto."],
      },
      { horario: "Após o sarau", titulo: "Forró do Severo", detalhes: ["No Coreto."] },
    ],
    notas: [
      "Público previsto: 110 pessoas por painel.",
      "Feira Literária Fátima Baliza: na Casa de Cultura durante todo o dia, ao mesmo tempo que os painéis, com a exposição dos desenhos e contação de histórias das 9h às 16h.",
      "As Oficinas Literárias Eliseu Ventania acontecem no mesmo dia, no Colégio Estadual Almino Afonso (veja abaixo).",
    ],
  },
  {
    id: "dia-13",
    data: "Domingo, 13 de dezembro",
    titulo: "Cortejo e concurso de redação",
    local: "Da Igreja do Rosário ao Colégio Estadual Almino Afonso",
    itens: [
      {
        horario: "8h",
        titulo: "Cortejo com fanfarra",
        detalhes: [
          "Saída da Igreja do Rosário até o Colégio Estadual Almino Afonso.",
          "Obrigatório para quem participa do concurso de redação.",
        ],
      },
      { horario: "8h30", titulo: "Fala do professor Paulo Henrique" },
      {
        horario: "9h",
        titulo: "Concurso de redação",
        detalhes: ["Tema: “Memórias do Meu Lugar”. Produção dos textos das 9h às 13h."],
        comInscricao: true,
      },
    ],
  },
];

export const categoriasRedacao = [
  { participantes: "4º e 5º ano", genero: "Conto" },
  { participantes: "6º ao 9º ano", genero: "Crônica" },
  { participantes: "1ª à 3ª série do Nível Médio", genero: "Texto dissertativo-argumentativo" },
];

export const oficinas: {
  titulo: string;
  local: string;
  data: string;
  itens: { horario: string; titulo: string; responsaveis: string; publico?: string }[];
  nota: string;
} = {
  titulo: "Oficinas Literárias Eliseu Ventania",
  local: "Colégio Estadual Almino Afonso",
  data: "Sábado, 12 de dezembro",
  itens: [
    { horario: "9h", titulo: "Redação: Dissertar, da ideia ao texto", responsaveis: "Professor Lucas Vinícius" },
    {
      horario: "10h30",
      titulo: "Estratégias de leitura e contação de histórias",
      responsaveis: "Programa de Extensão Biblioteca Ambulante e Literatura nas Escolas (BALE), UERN",
      publico: "Professores e mediadores",
    },
    { horario: "14h", titulo: "Poesia", responsaveis: "Manoel Cavalcante" },
    { horario: "15h30", titulo: "Desenho criativo", responsaveis: "Carlos Careca", publico: "Crianças atípicas" },
  ],
  nota: "Cada oficina tem 25 vagas. As oficinas acontecem ao mesmo tempo que os painéis da Casa de Cultura.",
};

// O concurso de desenho não tem inscrição pelo site: as inscrições são feitas em papel.
export const concursoDesenho = {
  publico: "Estudantes do 1º ao 3º ano do Ensino Fundamental.",
  inscricao: "Feita em papel, não pelo site.",
  premio: "Kit Faber-Castell. O desenho vencedor vai para a capa de um livro, e outros 20 desenhos selecionados, para as páginas internas.",
  exposicao: "Na Feira Literária Fátima Baliza, na Casa de Cultura.",
  quando: "Realização nas escolas, em data combinada com a organização. Premiação em 12 de dezembro, às 16h.",
};

export type AtividadeInscricao = {
  id: string;
  grupo: string;
  titulo: string;
  quando: string;
  detalhe?: string;
};

// Atividades que acontecem no mesmo horário (sábado, 12/12): as oficinas no Colégio Estadual Almino
// Afonso começam junto com os painéis da Casa de Cultura. O estudante pode escolher só uma de cada par.
// A mesma lista existe no banco (tabela `atividades_simultaneas`); ao mudar aqui, mude lá também.
export const horariosSimultaneos: [string, string][] = [
  ["oficina-redacao", "painel-1"],
  ["oficina-poesia", "painel-3"],
  ["oficina-desenho", "painel-4"],
];

// Atividades que acontecem no mesmo horário que a atividade informada.
export function simultaneas(id: string) {
  return horariosSimultaneos.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));
}

// Atividades que pedem inscrição. O `id` é o valor gravado no banco; não altere depois de abrir as inscrições.
export const atividadesInscricao: AtividadeInscricao[] = [
  {
    id: "abertura",
    grupo: "Sexta, 11 de dezembro · Mirante do Canto",
    titulo: "Abertura com palestra de Bráulio Bessa",
    quando: "A partir das 16h",
    detalhe: "600 vagas. Contribuição: 2 kg de alimentos.",
  },
  {
    id: "painel-1",
    grupo: "Sábado, 12 de dezembro · Casa de Cultura",
    titulo: "Painel: Literatura e identidade",
    quando: "9h30",
    detalhe: "Academia de Letras de Martins (ALAM)",
  },
  {
    id: "painel-2",
    grupo: "Sábado, 12 de dezembro · Casa de Cultura",
    titulo: "Painel: Educação, oportunidade e evolução",
    quando: "11h30",
    detalhe: "Genisa Raulino",
  },
  {
    id: "painel-3",
    grupo: "Sábado, 12 de dezembro · Casa de Cultura",
    titulo: "Painel: Escreva, leia... eternize-se",
    quando: "14h15",
    detalhe: "Marilene Paiva",
  },
  {
    id: "painel-4",
    grupo: "Sábado, 12 de dezembro · Casa de Cultura",
    titulo: "Painel: Povo, natureza e poesia",
    quando: "15h45",
    detalhe: "Poeta Antônio Francisco",
  },
  {
    id: "palestra-socorro-acioli",
    grupo: "Sábado, 12 de dezembro · Casa de Cultura",
    titulo: "Palestra com Socorro Acioli",
    quando: "17h30",
  },
  {
    id: "oficina-redacao",
    grupo: "Sábado, 12 de dezembro · Oficinas no Colégio Estadual Almino Afonso",
    titulo: "Oficina de redação: Dissertar, da ideia ao texto",
    quando: "9h",
    detalhe: "Professor Lucas Vinícius",
  },
  {
    id: "oficina-poesia",
    grupo: "Sábado, 12 de dezembro · Oficinas no Colégio Estadual Almino Afonso",
    titulo: "Oficina de poesia",
    quando: "14h",
    detalhe: "Manoel Cavalcante",
  },
  {
    id: "oficina-desenho",
    grupo: "Sábado, 12 de dezembro · Oficinas no Colégio Estadual Almino Afonso",
    titulo: "Oficina de desenho criativo",
    quando: "15h30",
    detalhe: "Carlos Careca · para crianças atípicas",
  },
  {
    id: "concurso-redacao",
    grupo: "Domingo, 13 de dezembro · Colégio Estadual Almino Afonso",
    titulo: "Concurso de redação",
    quando: "9h",
  },
];

// Convidados em destaque na página inicial e nos dados estruturados para buscadores.
// `bio`: mini biografia do cartão. `tema`: tema da palestra, quando houver.
export const destaques: {
  nome: string;
  papel: string;
  bio: string;
  atividade: string;
  tema?: string;
  quando: string;
  local: string;
}[] = [
  {
    nome: "Bráulio Bessa",
    papel: "Poeta",
    bio: "Cordelista de Alto Santo (CE) que levou a poesia nordestina a todo o Brasil pela TV Globo.",
    atividade: "Palestra de abertura",
    tema: temaBraulio,
    quando: "Sexta, 11 de dezembro, 17h30",
    local: "Mirante do Canto",
  },
  {
    nome: "Socorro Acioli",
    papel: "Escritora",
    bio: "Jornalista de Fortaleza (CE), autora de A cabeça do santo e vencedora do Prêmio Jabuti.",
    atividade: "Palestra de encerramento",
    quando: "Sábado, 12 de dezembro, 17h30",
    local: "Casa de Cultura",
  },
  {
    nome: "Antônio Francisco",
    papel: "Poeta",
    bio: "Cordelista de Mossoró (RN), ocupa a cadeira de Patativa do Assaré na Academia Brasileira de Literatura de Cordel.",
    atividade: "Sarau Poético Cosme Lemos e painel “Povo, natureza e poesia”",
    quando: "Sábado, 12 de dezembro: painel às 15h45 e sarau às 20h",
    local: "Casa de Cultura e Coreto",
  },
];
