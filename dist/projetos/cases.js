(() => {
  'use strict';
  const project = document.body.dataset.project;
  const screenSets = {
    leadfinder: {
      radar: { src: '/assets/leadfinder-radar.png', alt: 'Busca geográfica com mapa e empresas no radar', caption: 'Busca por nicho e região, com empresas organizadas no mapa e na lista de resultados.' },
      detail: { src: '/assets/leadfinder-lead-detail.png', alt: 'Painel de detalhes de empresa com dados e localização', caption: 'Perfil do lead com localização, avaliações, informações públicas e acesso às análises.' },
      dna: { src: '/assets/leadfinder-dna.png', alt: 'Extração de cores, tipografia e identidade visual de site', caption: 'DNA digital: extração de tokens visuais e elementos de design para entender a identidade do negócio.' },
      pipeline: { src: '/assets/leadfinder-pipeline.png', alt: 'Pipeline comercial em colunas de andamento', caption: 'Pipeline para acompanhar oportunidades entre descoberta, contato e negociação.' }
    },
    medstudy: {
      dashboard: { src: '/assets/medstudy-dashboard.png', alt: 'Dashboard do MedStudy com revisões e indicadores', caption: 'Painel do estudante com indicadores e recomendações de revisão.' },
      flashcards: { src: '/assets/medstudy-flashcards.png', alt: 'Biblioteca de flashcards com filtros e sessões', caption: 'Flashcards organizados para estudo e revisão, com busca, filtros e sessões.' },
      arena: { src: '/assets/medstudy-arena.png', alt: 'Arena competitiva com níveis, desafios e missões', caption: 'Arena com progressão, modos competitivos, missões e rankings.' },
      creator: { src: '/assets/medstudy-creator.png', alt: 'Estúdio do Criador para conteúdos educacionais', caption: 'Estúdio dedicado à publicação, gestão e acompanhamento de conteúdos.' }
    }
  };
  if (!screenSets[project]) return;
  const screens = screenSets[project];
  const keys = Object.keys(screens);
  const image = document.getElementById('gallery-current');
  const count = document.getElementById('gallery-count');
  const caption = document.getElementById('gallery-caption');
  let current = keys[0];
  document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => {
    current = button.dataset.screen;
    image.src = screens[current].src;
    image.alt = screens[current].alt;
    count.textContent = `${String(keys.indexOf(current) + 1).padStart(2, '0')} / 04`;
    caption.textContent = screens[current].caption;
    document.querySelectorAll('[data-screen]').forEach(item => {
      item.classList.toggle('selected', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
  }));
  const dialog = document.getElementById('gallery-lightbox');
  document.getElementById('gallery-expand').addEventListener('click', () => {
    document.getElementById('lightbox-image').src = screens[current].src;
    document.getElementById('lightbox-image').alt = screens[current].alt;
    document.getElementById('lightbox-caption').textContent = screens[current].caption;
    dialog.showModal();
  });
  document.getElementById('lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  const bar = document.getElementById('progress');
  const scrollProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  addEventListener('scroll', scrollProgress, { passive: true });
  scrollProgress();

  if (project === 'leadfinder') {
    const steps = [
      { kicker: '01 / DESCOBERTA', icon: '⌖', title: 'Identificar empresas relevantes.', description: 'A busca por categoria e região apresenta possíveis oportunidades em um mapa, acompanhadas de informações básicas do estabelecimento.', data: ['Segmento: Cafeterias', 'Região: São Paulo', 'Status: Lead identificado'] },
      { kicker: '02 / DNA DIGITAL', icon: '◈', title: 'Entender a identidade do site.', description: 'Quando um website está disponível, o DNA Extractor pode identificar pistas de tipografia, cores e composição para contextualizar a presença digital.', data: ['Paleta: Terracota + creme', 'Fonte: Sans-serif', 'Site: Fictício'] },
      { kicker: '03 / DIAGNÓSTICO', icon: '✧', title: 'Transformar dados em hipótese.', description: 'A análise assistida por IA pode sugerir melhorias e uma abordagem comercial. No produto real, essas recomendações precisam ser revisadas pelo usuário.', data: ['Hipótese: Melhorar conversão', 'Ação: Revisar CTA', 'Revisão humana: Necessária'] },
      { kicker: '04 / PIPELINE', icon: '▦', title: 'Acompanhar o relacionamento.', description: 'O lead segue para o CRM, onde pode passar por estágios como novo, analisado, contato iniciado e negociação.', data: ['Lead: Café Aurora', 'Estágio: Analisado', 'Próximo passo: Contato'] }
    ];
    let index = 0;
    function showStep() {
      const step = steps[index];
      document.getElementById('demo-kicker').textContent = step.kicker;
      document.getElementById('demo-icon').textContent = step.icon;
      document.getElementById('demo-title').textContent = step.title;
      document.getElementById('demo-description').textContent = step.description;
      document.getElementById('demo-data').replaceChildren(...step.data.map(value => { const span = document.createElement('span'); span.textContent = value; return span; }));
      document.getElementById('demo-step').textContent = `ETAPA ${String(index + 1).padStart(2, '0')} / 04`;
      document.getElementById('demo-progress-label').textContent = `${index + 1} de 4 etapas`;
      document.getElementById('demo-progress-fill').style.width = `${(index + 1) * 25}%`;
      document.getElementById('demo-prev').disabled = index === 0;
      document.getElementById('demo-next').disabled = index === steps.length - 1;
      document.querySelectorAll('[data-step]').forEach(button => {
        const active = Number(button.dataset.step) === index;
        button.classList.toggle('selected', active);
        button.setAttribute('aria-pressed', String(active));
      });
    }
    document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => { index = Number(button.dataset.step); showStep(); }));
    document.getElementById('demo-prev').addEventListener('click', () => { if (index > 0) { index--; showStep(); } });
    document.getElementById('demo-next').addEventListener('click', () => { if (index < steps.length - 1) { index++; showStep(); } });
    showStep();
  }

  if (project === 'medstudy' && document.getElementById('study-card')) {
    const cards = [
      { q: 'Qual é a função principal de uma chave primária em um banco relacional?', a: 'Identificar unicamente cada registro de uma tabela e apoiar a integridade das relações.' },
      { q: 'O que significa RLS no PostgreSQL?', a: 'Row Level Security: políticas que controlam quais linhas uma operação pode acessar ou modificar.' },
      { q: 'Por que utilizar repetição espaçada?', a: 'Para distribuir revisões ao longo do tempo e reforçar a recuperação ativa antes do esquecimento.' }
    ];
    let index = 0;
    let revealed = false;
    let counts = { again: 0, good: 0, easy: 0 };
    function render() {
      const done = index >= cards.length;
      const card = document.getElementById('study-card');
      document.getElementById('demo-step').textContent = done ? 'SESSÃO CONCLUÍDA' : `CARD ${String(index + 1).padStart(2, '0')} / 03`;
      document.getElementById('study-count').textContent = `${index} de 3 respondidos`;
      document.getElementById('study-progress-fill').style.width = `${index / 3 * 100}%`;
      document.getElementById('demo-progress-label').textContent = `${index} de 3 avaliados`;
      document.getElementById('demo-progress-fill').style.width = `${index / 3 * 100}%`;
      document.getElementById('stat-again').textContent = String(counts.again);
      document.getElementById('stat-good').textContent = String(counts.good);
      document.getElementById('stat-easy').textContent = String(counts.easy);
      document.getElementById('study-side').textContent = done ? 'FIM DA DEMONSTRAÇÃO' : revealed ? 'RESPOSTA' : 'PERGUNTA · TOQUE PARA REVELAR';
      document.getElementById('study-text').textContent = done ? 'Sessão finalizada. Revise seus resultados ou comece novamente.' : revealed ? cards[index].a : cards[index].q;
      document.getElementById('study-hint').textContent = done ? 'REINICIAR A SESSÃO ABAIXO' : revealed ? 'CLASSIFIQUE SUA RESPOSTA ↓' : 'REVELAR RESPOSTA ↗';
      card.disabled = done;
      document.querySelectorAll('[data-grade]').forEach(button => button.disabled = !revealed || done);
      if (done) {
        document.getElementById('demo-title').textContent = 'Sessão concluída.';
        document.getElementById('demo-description').textContent = 'As avaliações foram registradas apenas nesta demonstração. No produto, a lógica de revisão considera histórico e agendamento de cada conteúdo.';
      } else {
        document.getElementById('demo-title').textContent = 'Cada resposta informa a próxima revisão.';
        document.getElementById('demo-description').textContent = 'Uma rotina de repetição espaçada considera o histórico de estudo para decidir quando um conteúdo deve voltar à fila. Esta pequena experiência apenas ilustra o conceito.';
      }
    }
    document.getElementById('study-card').addEventListener('click', () => { if (index < cards.length) { revealed = !revealed; render(); } });
    document.querySelectorAll('[data-grade]').forEach(button => button.addEventListener('click', () => { if (!revealed || index >= cards.length) return; counts[button.dataset.grade]++; index++; revealed = false; render(); }));
    document.getElementById('study-reset').addEventListener('click', () => { index = 0; revealed = false; counts = { again: 0, good: 0, easy: 0 }; render(); });
    render();
  }
})();
