/*
 * Programação do FLIM, conforme o cronograma da organização.
 * Os horários indicam o início das atividades.
 * `dias` e `oficinas` alimentam a página /programacao; `atividadesInscricao` são as opções do formulário.
 */

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
      { horario: "17h15", titulo: "Apresentação musical", detalhes: ["Banda de música."] },
      { horario: "17h30", titulo: "Palestra com Bráulio Bessa", comInscricao: true },
    ],
    notas: ["Inscrição gratuita para 600 pessoas. Contribuição: 2 kg de alimentos."],
  },
  {
    id: "dia-12",
    data: "Sábado, 12 de dezembro",
    titulo: "Painéis Culturais Almino Afonso",
    local: "Casa de Cultura",
    itens: [
      { horario: "9h", titulo: "Escola de Música Eliseu Ventania (EMEV)", detalhes: ["Apresentação de 15 minutos."] },
      {
        horario: "9h30",
        titulo: "1º painel: Literatura e identidade",
        detalhes: ["Academia de Letras de Martins (ALAM)."],
        comInscricao: true,
      },
      { horario: "11h10", titulo: "Apresentação cultural", detalhes: ["Luís Gonzaga (CEPAF), 15 minutos."] },
      {
        horario: "11h30",
        titulo: "2º painel: Educação, oportunidade e evolução",
        detalhes: ["Genisa Raulino (Evolução)."],
        comInscricao: true,
      },
      { horario: "14h", titulo: "Apresentação musical", detalhes: ["Clícia, violino."] },
      {
        horario: "14h15",
        titulo: "3º painel: Escreva, leia... eternize-se",
        detalhes: ["Marilene Paiva."],
        comInscricao: true,
      },
      { horario: "15h30", titulo: "Apresentação cultural", detalhes: ["Xaxado (Dário), 15 minutos."] },
      {
        horario: "15h45",
        titulo: "4º painel: Povo, natureza e poesia",
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
        detalhes: [
          "Com o poeta Antônio Francisco, no Coreto.",
          "Programação da noite: restaurante literário e Forró do Severo.",
        ],
      },
    ],
    notas: [
      "Público previsto: 110 pessoas por painel.",
      "Feira Literária Fátima Baliza: na Casa de Cultura durante todo o dia, ao mesmo tempo que os painéis, com contação de histórias das 9h às 16h.",
    ],
  },
  {
    id: "dia-13",
    data: "Domingo, 13 de dezembro",
    titulo: "Cortejo e concurso de redação",
    local: "Colégio Estadual Almino Afonso",
    itens: [
      {
        horario: "8h",
        titulo: "Cortejo com fanfarra",
        detalhes: ["Saída da Igreja do Rosário até o Colégio Estadual Almino Afonso."],
      },
      { horario: "8h30", titulo: "Fala do professor Paulo Henrique" },
      { horario: "9h", titulo: "Concurso de redação", comInscricao: true },
    ],
  },
];

export const categoriasRedacao = [
  { participantes: "4º e 5º ano", genero: "Conto" },
  { participantes: "6º ao 9º ano", genero: "Crônica" },
  { participantes: "1º ao 3º ano do Ensino Médio", genero: "Dissertação argumentativa (modelo ENEM)" },
];

export const oficinas = {
  titulo: "Oficinas Literárias Eliseu Ventania",
  local: "Colégio Estadual Almino Afonso",
  data: "Data a definir",
  itens: [
    { horario: "9h", titulo: "Redação: Dissertar, da ideia ao texto", responsaveis: "Profa. Hélia", publico: "A definir" },
    {
      horario: "10h30",
      titulo: "Estratégias de leitura e contação de histórias",
      responsaveis: "BALE (UERN)",
      publico: "Professores e mediadores",
    },
    {
      horario: "14h",
      titulo: "Poesia",
      responsaveis: "Robson Renato e Manoel Cavalcante (poeta e escritor)",
      publico: "A definir",
    },
    { horario: "15h30", titulo: "Desenho criativo", responsaveis: "A definir", publico: "Crianças atípicas" },
  ],
  nota: "BALE (UERN): Programa de Extensão Biblioteca Ambulante e Literatura nas Escolas.",
};

export const concursoDesenho = {
  publico: "Estudantes do 1º ao 3º ano do Ensino Fundamental.",
  premio: "Kit Faber-Castell. O desenho vencedor vai para a capa de um livro, e outros 20 desenhos selecionados, para as páginas internas.",
  exposicao: "Na Feira Literária Fátima Baliza, na Casa de Cultura.",
  quando: "Realização com data e horário a definir. Premiação em 12 de dezembro, às 16h.",
};

export type AtividadeInscricao = {
  id: string;
  grupo: string;
  titulo: string;
  quando: string;
  detalhe?: string;
};

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
    titulo: "1º painel: Literatura e identidade",
    quando: "9h30",
    detalhe: "Academia de Letras de Martins (ALAM)",
  },
  {
    id: "painel-2",
    grupo: "Sábado, 12 de dezembro · Casa de Cultura",
    titulo: "2º painel: Educação, oportunidade e evolução",
    quando: "11h30",
    detalhe: "Genisa Raulino",
  },
  {
    id: "painel-3",
    grupo: "Sábado, 12 de dezembro · Casa de Cultura",
    titulo: "3º painel: Escreva, leia... eternize-se",
    quando: "14h15",
    detalhe: "Marilene Paiva",
  },
  {
    id: "painel-4",
    grupo: "Sábado, 12 de dezembro · Casa de Cultura",
    titulo: "4º painel: Povo, natureza e poesia",
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
    id: "concurso-redacao",
    grupo: "Domingo, 13 de dezembro · Colégio Estadual Almino Afonso",
    titulo: "Concurso de redação",
    quando: "9h",
  },
  {
    id: "oficina-redacao",
    grupo: "Oficinas Literárias Eliseu Ventania · data a definir",
    titulo: "Oficina de redação: Dissertar, da ideia ao texto",
    quando: "9h",
    detalhe: "Profa. Hélia",
  },
  {
    id: "oficina-poesia",
    grupo: "Oficinas Literárias Eliseu Ventania · data a definir",
    titulo: "Oficina de poesia",
    quando: "14h",
    detalhe: "Robson Renato e Manoel Cavalcante",
  },
  {
    id: "oficina-desenho",
    grupo: "Oficinas Literárias Eliseu Ventania · data a definir",
    titulo: "Oficina de desenho criativo",
    quando: "15h30",
    detalhe: "Voltada a crianças atípicas",
  },
  {
    id: "concurso-desenho",
    grupo: "Concurso de desenho",
    titulo: "Concurso de desenho",
    quando: "Data a definir",
    detalhe: "Premiação em 12 de dezembro, às 16h.",
  },
];
