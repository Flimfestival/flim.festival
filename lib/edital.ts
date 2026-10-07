/*
 * Edital do Concurso de Redação "Memórias do Meu Lugar", transcrito do PDF assinado em 07/10/2026
 * pela organização do FLIM e pela coordenação do concurso. Exibido na página /edital.
 * Num parágrafo, o número do item ("1.1", "I –", "a)") aparece em negrito.
 */

export type Tabela = { legenda: string; colunas: string[]; linhas: string[][] };
export type Bloco = string | { lista: string[] } | { tabela: Tabela };
export type SecaoEdital = { titulo: string; blocos: Bloco[] };

export const edital = {
  titulo: "Edital do Concurso de Redação “Memórias do Meu Lugar”",
  subtitulo: "FLIM – Festival Literário de Martins – RN, de 11 a 13 de dezembro de 2026",
  data: "Martins-RN, 07 de outubro de 2026",
  abertura:
    "A organização do FLIM – Festival Literário de Martins – RN torna público o presente Edital do Concurso de Redação “Memórias do Meu Lugar”, destinado aos estudantes matriculados na Educação Básica de ensino do município de Martins-RN, com o objetivo de incentivar a leitura, a escrita, a valorização da identidade local e a preservação da memória cultural do município de Martins, no Rio Grande do Norte.",
  assinaturas: [
    { cargo: "Organização do FLIM – Festival Literário de Martins", nome: "Flávio da Silva Júnior" },
    {
      cargo: "Coordenação do Concurso de Redação “Memórias do Meu Lugar”",
      nome: "Professora Hélia de Oliveira Silva",
    },
  ],
};

export const secoesEdital: SecaoEdital[] = [
  {
    titulo: "1. Do concurso",
    blocos: [
      "1.1 O Concurso de Redação “Memórias do Meu Lugar” convida estudantes da Educação Básica a lançar um olhar atento e afetivo sobre Martins, reconhecendo a cidade como espaço de histórias, experiências, personagens, tradições e acontecimentos que ajudam a construir a identidade de sua população.",
      "1.2 A proposta do concurso não se limita à qualidade formal da escrita. Busca-se valorizar textos que apresentem autenticidade, criatividade, sensibilidade, pesquisa, pertencimento e capacidade de registrar aspectos da memória individual e coletiva do município.",
      "1.3 Os participantes poderão abordar, entre outros aspectos:",
      {
        lista: [
          "histórias de famílias e comunidades;",
          "personagens marcantes da cidade;",
          "pessoas que contribuíram para a história local;",
          "acontecimentos importantes ou pouco conhecidos;",
          "tradições culturais e religiosas;",
          "festas e manifestações populares;",
          "costumes e modos de vida;",
          "lugares que possuem significado histórico ou afetivo;",
          "histórias transmitidas por pais, avós e outras pessoas da comunidade;",
          "mudanças ocorridas na cidade ao longo do tempo;",
          "experiências pessoais relacionadas a Martins;",
          "memórias de espaços, escolas, bairros, comunidades e lugares de convivência;",
          "elementos que contribuam para a preservação da identidade e do patrimônio cultural local.",
        ],
      },
      "1.4 A temática geral e obrigatória para todas as categorias será: “MEMÓRIAS DO MEU LUGAR”",
    ],
  },
  {
    titulo: "2. Do objetivo",
    blocos: [
      "O Concurso tem como objetivos:",
      "I – Incentivar a produção textual entre estudantes da Educação Básica;",
      "II – estimular o interesse pela história e pela cultura de Martins;",
      "III – valorizar as memórias individuais e coletivas da comunidade;",
      "IV – incentivar a pesquisa e a escuta de familiares, moradores e representantes da comunidade;",
      "V – fortalecer o sentimento de pertencimento e identidade cultural do cidadão martinense;",
      "VI – contribuir para a preservação da memória do município por meio da escrita;",
      "VII – estimular o protagonismo dos estudantes na construção e no registro da história local;",
      "VIII – reunir diferentes olhares sobre Martins em uma publicação coletiva.",
    ],
  },
  {
    titulo: "3. Do público-alvo",
    blocos: [
      "Poderão participar estudantes regularmente matriculados na Educação Básica de ensino no município de Martins-RN, conforme as categorias estabelecidas neste Edital.",
    ],
  },
  {
    titulo: "4. Das categorias",
    blocos: [
      "O concurso será dividido em três categorias:",
      "4.1 Ensino Fundamental I: 4º e 5º anos. Gênero textual: CONTO",
      "4.2 Ensino Fundamental II: 6º aos 9º anos. Gênero textual: CRÔNICA",
      "4.3 Nível Médio: 1ª a 3ª séries do Nível Médio. Gênero textual: TEXTO DISSERTATIVO-ARGUMENTATIVO",
      "Cada estudante deverá concorrer exclusivamente na categoria correspondente ao ano escolar em que estiver regularmente matriculado no momento da realização do concurso.",
    ],
  },
  {
    titulo: "5. Da participação obrigatória no cortejo de abertura",
    blocos: [
      "5.1 A participação no Cortejo de Abertura do Concurso de Redação “Memórias do Meu Lugar” será obrigatória para todos os estudantes inscritos no concurso.",
      "5.2 O cortejo será realizado no mesmo dia da aplicação da prova de redação, 13 de dezembro de 2026, com concentração e saída às 8h, na Igreja do Rosário, em Martins/RN.",
      "5.3 O cortejo seguirá até a Escola Estadual Dr. Almino Afonso, onde será realizada a recepção dos participantes com uma fala de acolhimento e incentivo aos estudantes, com o objetivo de motivá-los para a experiência de escrita e reforçar o significado cultural e educativo da iniciativa.",
      "5.4 A concentração dos estudantes na Igreja do Rosário deverá ocorrer com antecedência suficiente para garantir a organização, a segurança e o início pontual do cortejo.",
      "5.5 A participação no cortejo integra oficialmente a programação do Concurso de Redação e tem como finalidade promover um momento coletivo de celebração da literatura, da memória, da cultura e do pertencimento ao território de Martins.",
      "5.6 A organização recomenda que os estudantes estejam acompanhados pelos professores, responsáveis ou equipe escolar designada, conforme organização previamente estabelecida entre as escolas participantes e a Comissão Organizadora.",
    ],
  },
  {
    titulo: "6. Da realização do concurso",
    blocos: [
      "6.1 A etapa de produção das redações será realizada presencialmente no dia: 13 DE DEZEMBRO DE 2026 logo após o Cortejo.",
      "6.2 O concurso será realizado na: ESCOLA ESTADUAL DR. ALMINO AFONSO, Martins – Rio Grande do Norte",
      "6.3 O período destinado à produção dos textos será: Das 9h às 13h",
      "6.4 O participante deverá produzir seu texto durante o período estabelecido pela organização, observando as orientações fornecidas no início da prova.",
      "6.5 Cada participante deverá portar obrigatoriamente caneta esferográfica de tinta azul ou preta, de corpo transparente, para utilização na prova.",
      "6.6 Não será permitido o compartilhamento de material durante a realização da prova, salvo autorização expressa da equipe responsável pela aplicação.",
      "6.7 É recomendado que o participante leve consigo itens de alimentação e hidratação para o período da atividade, tais como:",
      { lista: ["água;", "biscoito;", "chocolate;", "frutas ou outros alimentos leves."] },
      "6.8 A organização recomenda que os alimentos sejam acondicionados de maneira adequada e que seu consumo seja realizado de forma a não prejudicar a concentração dos demais participantes, a organização do espaço ou a integridade das provas.",
      "6.9 Não será permitida, durante a realização da prova, a utilização de aparelhos celulares, relógios inteligentes, fones de ouvido, dispositivos eletrônicos ou outros equipamentos que possam possibilitar comunicação ou consulta não autorizada.",
      "6.10 Os aparelhos eletrônicos deverão permanecer desligados e guardados conforme orientação da equipe responsável pela aplicação.",
      "6.11 A organização poderá estabelecer outros procedimentos de segurança e controle no dia da prova, desde que informados previamente aos participantes.",
    ],
  },
  {
    titulo: "7. Da inscrição",
    blocos: [
      "7.1 A inscrição será realizada de forma gratuita no PORTAL: https://www.festivalflim.com.br/inscricao",
      "7.2 O período de inscrições: 07 de outubro de 2026 a 07 de novembro de 2026",
      "7.3 Local de inscrição: através do Portal",
      "7.4 A inscrição será considerada efetivada após o preenchimento da ficha de inscrição.",
      "7.5 No ato da inscrição, o participante deverá apresentar as informações solicitadas pela organização, incluindo nome completo, data de nascimento, escola, ano/série, categoria, telefone para contato, se possui alguma deficiência e demais dados necessários.",
    ],
  },
  {
    titulo: "8. Das características dos textos",
    blocos: [
      "8.1 Todos os textos deverão desenvolver obrigatoriamente o tema: “MEMÓRIAS DO MEU LUGAR”",
      "8.2 Cada categoria deverá respeitar o gênero textual correspondente:",
      "a) Ensino Fundamental I – Conto: texto narrativo que apresente personagens, acontecimentos, espaço e desenvolvimento de uma história relacionada à memória, à cultura ou às experiências do lugar.",
      "b) Ensino Fundamental II – Crônica: texto que, a partir de uma situação, lembrança, personagem, acontecimento ou aspecto do cotidiano de Martins, apresente um olhar autoral e sensível sobre o lugar.",
      "c) Nível Médio – Texto dissertativo-argumentativo: texto que desenvolva uma reflexão sobre a memória, a identidade, a cultura e/ou o patrimônio de Martins, apresentando argumentação organizada, coerente e fundamentada.",
      "8.3 Será valorizada a utilização de informações, relatos e elementos da memória local, desde que incorporados ao texto de maneira autoral e adequada ao gênero solicitado.",
    ],
  },
  {
    titulo: "9. Da produção dos textos",
    blocos: [
      "9.1 Os textos deverão ser produzidos exclusivamente durante o período destinado ao concurso.",
      "9.2 Todos os textos deverão ter mínimo de 20 (vinte) linhas e máximo de 35 (trinta e cinco) linhas, independentemente da categoria ou do gênero textual.",
      "9.3 Não será permitida a utilização de textos previamente produzidos, cópias, reprodução integral de conteúdos de terceiros ou qualquer recurso que descaracterize a autoria do participante.",
      "9.4 A identificação do participante deverá ser realizada conforme as orientações da organização, de modo a preservar a imparcialidade do processo de avaliação.",
    ],
  },
  {
    titulo: "10. Dos critérios de avaliação",
    blocos: [
      "As redações serão avaliadas por uma comissão julgadora especialmente constituída pela organização do FLIM.",
      "10.1 Serão considerados, de acordo com as especificidades de cada categoria:",
      "I – Adequação ao tema “Memórias do Meu Lugar”;",
      "II – adequação ao gênero textual solicitado;",
      "III – criatividade e originalidade;",
      "IV – qualidade e consistência das ideias;",
      "V – capacidade de construção narrativa ou argumentativa;",
      "VI – valorização da memória, da história e da identidade local;",
      "VII – coesão e coerência textual;",
      "VIII – adequação linguística e domínio da escrita;",
      "IX – capacidade de sensibilizar e envolver o leitor;",
      "X – autenticidade e autoria.",
      "10.2 Em caso de empate, serão utilizados, sucessivamente, os seguintes critérios de desempate:",
      "I – Maior pontuação no critério de adequação ao tema;",
      "II – coesão e coerência textual;",
      "III – maior pontuação no critério de valorização da memória e identidade local;",
      "IV – persistindo o empate, decisão da comissão julgadora, devidamente registrada em ata.",
    ],
  },
  {
    titulo: "11. Da comissão julgadora",
    blocos: [
      "11.1 As redações serão avaliadas por uma comissão composta por profissionais convidados pela organização do FLIM, podendo incluir professores, escritores, pesquisadores, profissionais da área de Letras, cultura e educação.",
      "11.2 Os membros da comissão deverão atuar de forma independente e imparcial na avaliação dos textos.",
      "11.3 As decisões da comissão julgadora serão soberanas quanto à avaliação do conteúdo e da qualidade literária dos textos, observadas as regras estabelecidas neste Edital.",
    ],
  },
  {
    titulo: "12. Da premiação",
    blocos: [
      "Serão premiados os vencedores de cada categoria:",
      "12.1 Ensino Fundamental I – 4º e 5º anos – 1º lugar: 01 (um) iPad 11, 128 GB",
      "12.2 Ensino Fundamental II – 6º aos 9º anos – 1º lugar: 01 (um) iPad 11, 128 GB",
      "12.3 Nível Médio – 1ª a 3ª séries – 1º lugar: 01 (uma) bolsa de estudos integral na Faculdade Evolução, com direito à escolha do curso, observadas as condições acadêmicas, administrativas e regulamentares da instituição de ensino.",
      "12.4 Na hipótese de recusa, impossibilidade de recebimento ou qualquer outra circunstância que impeça a efetivação da bolsa pelo estudante originalmente classificado, o benefício será destinado ao próximo estudante melhor classificado da mesma categoria, respeitada a ordem de classificação.",
      "12.5 A organização poderá divulgar, além dos vencedores, os demais textos classificados e/ou selecionados para publicação, conforme os critérios definidos neste Edital.",
    ],
  },
  {
    titulo: "13. Do livro “Memórias do Meu Lugar”",
    blocos: [
      "13.1 As redações com maior pontuação poderão integrar o livro coletivo: “MEMÓRIAS DO MEU LUGAR”",
      "13.2 A publicação terá como finalidade registrar e preservar diferentes experiências, histórias, personagens, lugares, tradições e percepções relacionadas ao município de Martins.",
      "13.3 A obra será concebida como um registro cultural produzido a partir do olhar dos próprios estudantes, contribuindo para a preservação e transmissão da memória local.",
      "13.4 A seleção para publicação no livro não implica, necessariamente, premiação.",
      "13.5 A quantidade de textos selecionados para compor a obra será definida pela organização e/ou comissão do projeto.",
    ],
  },
  {
    titulo: "14. Da publicação das redações",
    blocos: [
      "14.1 Os participantes selecionados e seus responsáveis legais, quando aplicável, autorizam gratuitamente a publicação das redações em livro ou coletânea produzida no âmbito do FLIM, bem como sua reprodução em materiais culturais, educativos, institucionais e de divulgação relacionados ao Festival.",
      "14.2 A publicação deverá preservar a identificação da autoria do participante, ressalvadas situações em que a proteção do menor recomende identificação reduzida ou outra medida de segurança.",
      "14.3 A autorização abrange publicação em formato físico ou digital, divulgação em sites e redes sociais, exposições, materiais institucionais, ações educativas e futuras edições do FLIM.",
    ],
  },
  {
    titulo: "15. Dos direitos autorais",
    blocos: [
      "15.1 A participação no Concurso não transfere a autoria intelectual da redação para o FLIM ou para a F7 Produções.",
      "15.2 O participante permanece reconhecido como autor de sua obra.",
      "15.3 Ao participar do Concurso, o autor ou seu responsável legal concede à organização, gratuitamente e sem caráter de exclusividade, autorização para utilização, edição, reprodução, publicação e divulgação da redação para as finalidades culturais, educativas, históricas e institucionais relacionadas ao FLIM.",
      "15.4 Eventuais ajustes de revisão ortográfica, padronização editorial, diagramação e formatação poderão ser realizados para fins de publicação, desde que não alterem substancialmente o conteúdo ou o sentido da obra.",
    ],
  },
  {
    titulo: "16. Da divulgação dos resultados",
    blocos: [
      "16.1 O resultado final do Concurso de Redação “Memórias do Meu Lugar” será divulgado no dia: 21 DE DEZEMBRO DE 2026.",
      "16.2 A divulgação será realizada pelos canais oficiais do FLIM e/ou da organização responsável pelo concurso.",
      "16.3 Os vencedores serão comunicados pela organização para receber orientações sobre a premiação.",
    ],
  },
  {
    titulo: "17. Da entrega da premiação",
    blocos: [
      "17.1 A Cerimônia de premiação será no dia 23 de dezembro, na Casa de Cultura Popular de Martins, a partir das 19h.",
      "17.2 No caso de participante menor de idade, a entrega da premiação observará as exigências de autorização e acompanhamento do responsável legal.",
      "17.3 A bolsa de estudos destinada ao vencedor da categoria Ensino Médio estará sujeita às normas acadêmicas e administrativas da Faculdade Evolução, inclusive quanto aos procedimentos necessários para matrícula e ingresso no curso escolhido.",
    ],
  },
  {
    titulo: "18. Da desclassificação",
    blocos: [
      "18.1 Será desclassificado o participante que:",
      "I – apresentar texto que não corresponda ao gênero textual solicitado para sua categoria;",
      "II – apresentar texto que não desenvolva o tema proposto;",
      "III – utilizar texto total ou parcialmente copiado de terceiros;",
      "IV – utilizar recursos ou materiais não autorizados durante a realização da prova;",
      "V – tentar identificar-se de maneira indevida quando a identificação estiver vedada;",
      "VI – prestar informações falsas no processo de inscrição;",
      "VII – descumprir as regras estabelecidas neste Edital;",
      "VIII – praticar qualquer ato que comprometa a igualdade e a lisura do concurso.",
    ],
  },
  {
    titulo: "19. Da responsabilidade dos participantes",
    blocos: [
      "19.1 Ao realizar a inscrição, o participante declara estar ciente das normas deste Edital e compromete-se a cumpri-las integralmente.",
      "19.2 No caso de participante menor de idade, a inscrição deverá contar com a anuência de seu responsável legal.",
    ],
  },
  {
    titulo: "20. Do cronograma",
    blocos: [
      {
        tabela: {
          legenda: "Cronograma do concurso",
          colunas: ["Etapa", "Data"],
          linhas: [
            ["Divulgação do Edital", "07 de outubro de 2026"],
            ["Período de inscrições", "Até 07 de novembro de 2026"],
            ["Local de inscrição", "Portal: https://www.festivalflim.com.br/inscricao"],
            ["Realização do concurso", "13 de dezembro de 2026"],
            ["Horário", "8h às 13h"],
            ["Local", "Escola Estadual Dr. Almino Afonso"],
            ["Avaliação das redações", "Após a realização do concurso"],
            ["Divulgação do resultado final", "21 de dezembro de 2026"],
            ["Entrega da premiação", "23 de dezembro de 2026"],
          ],
        },
      },
    ],
  },
  {
    titulo: "21. Das disposições finais",
    blocos: [
      "21.1 A participação no concurso implica aceitação integral das disposições deste Edital.",
      "21.2 Os casos omissos neste Edital serão analisados e resolvidos pela organização do FLIM, respeitados os princípios de transparência, isonomia e igualdade entre os participantes.",
      "21.3 Eventuais alterações ou informações complementares serão divulgadas pelos canais oficiais do Festival Literário de Martins.",
      "21.4 A organização reserva-se o direito de realizar ajustes operacionais necessários à execução do concurso, desde que preservados seus objetivos, a igualdade entre os participantes e as regras fundamentais estabelecidas neste Edital.",
      "21.5 O Concurso de Redação “Memórias do Meu Lugar” integra a programação do FLIM – Festival Literário de Martins – RN, realizado de 11 a 13 de dezembro de 2026, reafirmando o compromisso com a educação, a literatura, a cultura e a preservação da memória do município.",
    ],
  },
];

// Anexos do edital: bibliografia sugerida e grades de correção de cada categoria.
export const anexosEdital: SecaoEdital[] = [
  {
    titulo: "Bibliografia sugerida",
    blocos: ["ONOFRE JUNIOR, Manoel. Chão dos Simples. 4 ed. – Recife: Bagaço, 2011."],
  },
  {
    titulo: "Grade de correção dos textos do Nível Médio",
    blocos: [
      {
        tabela: {
          legenda: "Grade de correção do Nível Médio (texto dissertativo-argumentativo)",
          colunas: ["Critério", "Pontos"],
          linhas: [
            [
              "1. Domínio da modalidade escrita formal da língua portuguesa (ortografia, concordância, regência, escolha vocabular, uso de crase, pontuação)",
              "0 a 2,5",
            ],
            [
              "2. Compreensão da proposta e desenvolvimento do tema, dentro do tipo textual dissertativo-argumentativo (introdução, desenvolvimento, conclusão)",
              "0 a 2,5",
            ],
            [
              "3. Seleção e organização de informações, fatos e argumentos em defesa do ponto de vista (seleção de argumentos, organização e progressão do texto)",
              "0 a 2,5",
            ],
            [
              "4. Conhecimento dos mecanismos linguísticos necessários para construir a argumentação (elementos coesivos intraparágrafos e interparágrafos, repetição exagerada de palavras)",
              "0 a 2,5",
            ],
            ["Total", "0 a 10,0"],
          ],
        },
      },
    ],
  },
  {
    titulo: "Grade de correção dos textos do Ensino Fundamental I (conto)",
    blocos: [
      {
        tabela: {
          legenda: "Grade de correção do Ensino Fundamental I (conto)",
          colunas: ["Critério", "O que se avalia", "Pontos"],
          linhas: [
            [
              "1. Adequação ao gênero",
              "Apresenta características do conto: narrativa breve, unidade de ação, conflito, personagens, espaço, tempo e desfecho.",
              "2,0",
            ],
            [
              "2. Enredo e conflito",
              "Há situação inicial, desenvolvimento do conflito, clímax e desfecho coerente.",
              "2,0",
            ],
            [
              "3. Narrador e foco narrativo",
              "Uso consciente e consistente da 1ª ou 3ª pessoa; perspectiva narrativa adequada.",
              "1,5",
            ],
            [
              "4. Coerência e progressão narrativa",
              "Os acontecimentos se articulam logicamente, sem contradições ou rupturas injustificadas.",
              "1,5",
            ],
            [
              "5. Coesão e recursos linguísticos",
              "Uso adequado de conectivos, pronomes, tempos verbais, pontuação e mecanismos de articulação textual.",
              "1,0",
            ],
            [
              "6. Linguagem e efeito de sentido",
              "Vocabulário, descrições, diálogos e recursos expressivos contribuem para criar atmosfera e produzir efeitos no leitor.",
              "1,0",
            ],
            [
              "7. Norma-padrão",
              "Ortografia, acentuação, concordância, regência, pontuação e demais aspectos da escrita formal.",
              "1,0",
            ],
            ["Total", "", "10,0"],
          ],
        },
      },
    ],
  },
  {
    titulo: "Grade de correção dos textos do Ensino Fundamental II (crônica)",
    blocos: [
      {
        tabela: {
          legenda: "Grade de correção do Ensino Fundamental II (crônica)",
          colunas: ["Critério", "O que se avalia", "Pontos"],
          linhas: [
            [
              "1. Adequação ao gênero",
              "Apresenta características da crônica: situação cotidiana, brevidade, linguagem próxima do leitor e reflexão/efeito de sentido.",
              "2,0",
            ],
            [
              "2. Tema e proposta",
              "Desenvolve o tema solicitado, mantendo foco e coerência com a proposta.",
              "2,0",
            ],
            [
              "3. Estrutura e organização",
              "Texto apresenta introdução, desenvolvimento e desfecho; ideias bem encadeadas e progressão adequada.",
              "1,5",
            ],
            [
              "4. Criatividade e construção narrativa",
              "Apresenta abordagem interessante, recursos narrativos e/ou reflexão significativa sobre a situação apresentada.",
              "1,5",
            ],
            [
              "5. Coesão e coerência",
              "Há conexão adequada entre frases e parágrafos; as ideias são claras e fazem sentido.",
              "1,0",
            ],
            [
              "6. Linguagem e estilo",
              "Uso adequado da linguagem, considerando o gênero e o público; presença de marcas de estilo próprias da crônica.",
              "1,0",
            ],
            [
              "7. Norma-padrão",
              "Ortografia, pontuação, concordância, regência, acentuação e demais aspectos gramaticais.",
              "1,0",
            ],
            ["Total", "", "10,0"],
          ],
        },
      },
    ],
  },
];
