document.body.classList.add('has-js');
const motionStorageKey = 'eduardo-portfolio-motion';
const motionToggle = document.getElementById('motion-toggle');
let storedMotion = null;
try { storedMotion = localStorage.getItem(motionStorageKey); } catch (_) {}
let motionEnabled = storedMotion !== 'off';
const isMotionEnabled = () => motionEnabled;
function updateMotionPreference() {
  document.documentElement.classList.toggle('motion-force', motionEnabled);
  document.documentElement.classList.toggle('motion-reduce', !motionEnabled);
  if (!motionEnabled) document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  if (motionToggle) {
    const label = motionEnabled ? 'Desligar animações' : 'Ligar animações';
    motionToggle.setAttribute('aria-label', label);
    motionToggle.setAttribute('title', label);
    motionToggle.setAttribute('aria-pressed', String(motionEnabled));
  }
}
updateMotionPreference();
motionToggle?.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  try { localStorage.setItem(motionStorageKey, motionEnabled ? 'on' : 'off'); } catch (_) {}
  updateMotionPreference();
});

const tickerContainer = document.querySelector('.tech-ticker');
const tickerTrack = tickerContainer?.querySelector('.ticker-track');
if (tickerContainer && tickerTrack?.firstElementChild) {
  const firstGroup = tickerTrack.firstElementChild.cloneNode(true);
  const rebuildTicker = () => {
    tickerTrack.replaceChildren(firstGroup.cloneNode(true));
    const groupWidth = tickerTrack.firstElementChild.getBoundingClientRect().width;
    if (!groupWidth) return;
    const count = Math.max(2, Math.ceil(tickerContainer.clientWidth / groupWidth) + 1);
    for (let i = 1; i < count; i++) tickerTrack.appendChild(firstGroup.cloneNode(true));
    tickerTrack.style.setProperty('--ticker-distance', `-${groupWidth}px`);
  };
  rebuildTicker();
  document.fonts?.ready.then(rebuildTicker);
  let tickerResizeFrame = 0;
  window.addEventListener('resize', () => {
    if (tickerResizeFrame) cancelAnimationFrame(tickerResizeFrame);
    tickerResizeFrame = requestAnimationFrame(() => {
      rebuildTicker();
      tickerResizeFrame = 0;
    });
  }, { passive: true });
}

const careerStories = {
  ck: {
    kicker:'DADOS & INTEGRAÇÕES', period:'2025 — 2026', title:'1.500<span>+</span> SKUs',
    context:'Escala da base corporativa integrada à operação de ERP e canais de venda.',
    challenge:'Dados de produtos e operações distribuídos entre sistemas.',
    solution:'Estruturação de dados, integração via APIs e automações de processos.',
    caveat:'Indicador de escala da base, não de crescimento atribuído individualmente.'
  },
  arcanjo: {
    kicker:'ATENDIMENTO & AUTOMAÇÃO', period:'2023 — 2025', title:'300–400<span>/mês</span>',
    context:'Volume aproximado de atendimentos da operação, com 250 clientes ativos.',
    challenge:'Organizar a presença digital, o CRM e a triagem de atendimentos.',
    solution:'Desenvolvimento do site institucional, personalização de fluxos do CRM e chatbots de suporte.',
    caveat:'Números que contextualizam o porte da operação, não crescimento gerado pelas automações.'
  },
  alesp: {
    kicker:'INFRAESTRUTURA & SUPORTE', period:'2022', title:'A base<span> técnica.</span>',
    context:'Experiência inicial com suporte a usuários e operação de sistemas internos.',
    challenge:'Manter computadores e ambientes de trabalho funcionais para os usuários.',
    solution:'Manutenção, configuração de sistemas e atendimento técnico.',
    caveat:'Experiência formativa que consolidou fundamentos de infraestrutura e resolução de problemas.'
  }
};
const careerTabs = [...document.querySelectorAll('[data-career]')];
const careerPanel = document.getElementById('career-panel-detail');
function selectCareer(key, focus = false) {
  const story = careerStories[key];
  if (!story || !careerPanel) return;
  const activeIndex = careerTabs.findIndex(tab => tab.dataset.career === key);
  careerTabs.forEach(tab => {
    const active = tab.dataset.career === key;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  document.getElementById('career-spotlight-kicker').textContent = story.kicker;
  document.getElementById('career-spotlight-period').textContent = story.period;
  document.getElementById('career-spotlight-title').innerHTML = story.title;
  document.getElementById('career-spotlight-context').textContent = story.context;
  document.getElementById('career-spotlight-challenge').textContent = story.challenge;
  document.getElementById('career-spotlight-solution').textContent = story.solution;
  document.getElementById('career-spotlight-caveat').textContent = story.caveat;
  document.getElementById('career-spotlight-count').textContent = `0${activeIndex + 1} / 03`;
  document.getElementById('career-spotlight-progress').style.width = `${(activeIndex + 1) / careerTabs.length * 100}%`;
  careerPanel.setAttribute('aria-labelledby', careerTabs[activeIndex].id);
  if (isMotionEnabled()) {careerPanel.style.animation='none'; careerPanel.offsetHeight; careerPanel.style.animation='';}
}
careerTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCareer(tab.dataset.career));
  tab.addEventListener('keydown', event => {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    let next = event.key === 'Home' ? 0 : event.key === 'End' ? careerTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + careerTabs.length) % careerTabs.length;
    selectCareer(careerTabs[next].dataset.career, true);
  });
});

const header = document.getElementById('site-header');
const menuButton = document.getElementById('menu-toggle');
const menu = document.getElementById('nav-links');
const progress = document.getElementById('top-progress');
const links = Array.from(document.querySelectorAll('.nav-link'));
const sections = links
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const timeline = document.querySelector('.timeline');
const projectArt = document.querySelector('.project-preview-art');
const clamp = (n, min = 0, max = 1) => Math.max(min, Math.min(max, n));

const closeMenu = () => {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-open', isOpen);
});

menu.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.addEventListener('click', (event) => {
  if (menu.classList.contains('is-open') && !event.target.closest('.nav-shell')) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
});

let scrollScheduled = false;
const updateScroll = () => {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (max > 0 ? (scrollTop / max) * 100 : 0) + '%';
  header.classList.toggle('is-scrolled', scrollTop > 18);

  const marker = scrollTop + Math.min(window.innerHeight * 0.35, 260);
  let current = '#inicio';
  sections.forEach((section) => {
    if (section.offsetTop <= marker) current = '#' + section.id;
  });
  links.forEach((link) => {
    const active = link.getAttribute('href') === current;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });

  if (timeline) {
    const rect = timeline.getBoundingClientRect();
    const fill = clamp((window.innerHeight * .66 - rect.top) / (rect.height + window.innerHeight * .1));
    timeline.style.setProperty('--timeline-fill', fill.toFixed(3));
  }
  if (projectArt) {
    const rect = projectArt.getBoundingClientRect();
    const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
    projectArt.style.setProperty('--art-shift', (progress * 52 - 26).toFixed(1) + 'px');
  }
  scrollScheduled = false;
};

window.addEventListener('scroll', () => {
  if (scrollScheduled) return;
  scrollScheduled = true;
  window.requestAnimationFrame(updateScroll);
}, { passive: true });
updateScroll();

const reveals = document.querySelectorAll('.reveal');
document.querySelectorAll('.capability-grid, .stack-grid, .timeline, .projects-section').forEach((group) => {
  group.querySelectorAll('.reveal').forEach((el, index) => {
    el.style.setProperty('--reveal-delay', `${Math.min(index, 3) * 90}ms`);
  });
});
document.querySelectorAll('.medstudy-feature, .leadfinder-feature, .career-panel, .timeline-item').forEach((el, index) => {
  el.style.setProperty('--reveal-x', `${index % 2 ? 13 : -13}px`);
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  reveals.forEach((el) => motionEnabled ? observer.observe(el) : el.classList.add('is-visible'));
} else {
  reveals.forEach((el) => el.classList.add('is-visible'));
}

document.getElementById('year').textContent = new Date().getFullYear();

const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (precisePointer) {
  const heroVisual = document.querySelector('.hero-visual');
  const portrait = heroVisual.querySelector('.portrait-frame img');
  let portraitFrame = 0;

  heroVisual.addEventListener('pointermove', (event) => {
    if (!isMotionEnabled()) return;
    if (portraitFrame) return;
    const rect = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
    portraitFrame = window.requestAnimationFrame(() => {
      portrait.style.setProperty('--offset-x', (-x * 7).toFixed(1) + 'px');
      portrait.style.setProperty('--offset-y', (-y * 6).toFixed(1) + 'px');
      heroVisual.style.setProperty('--glow-x', (x * 18).toFixed(1) + 'px');
      heroVisual.style.setProperty('--glow-y', (y * 13).toFixed(1) + 'px');
      portraitFrame = 0;
    });
  }, { passive: true });

  heroVisual.addEventListener('pointerleave', () => {
    portrait.style.setProperty('--offset-x', '0px');
    portrait.style.setProperty('--offset-y', '0px');
    heroVisual.style.setProperty('--glow-x', '0px');
    heroVisual.style.setProperty('--glow-y', '0px');
  });

  document.querySelectorAll('.capability-card, .stack-card').forEach((card) => {
    let activeFrame = 0;
    card.addEventListener('pointermove', (event) => {
      if (!isMotionEnabled()) return;
      if (activeFrame) return;
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      activeFrame = window.requestAnimationFrame(() => {
        card.style.setProperty('--spotlight-x', x.toFixed(0) + 'px');
        card.style.setProperty('--spotlight-y', y.toFixed(0) + 'px');
        activeFrame = 0;
      });
    }, { passive: true });
  });
}

const medstudyScreens = {
  dashboard: { src: '/assets/medstudy-dashboard.png', title: 'Dashboard', alt: 'Dashboard do MedStudy com diagnóstico, indicadores e recomendações de estudo' },
  flashcards: { src: '/assets/medstudy-flashcards.png', title: 'Flashcards', alt: 'Gestão de flashcards do MedStudy com filtros e cards aguardando revisão' },
  arena: { src: '/assets/medstudy-arena.png', title: 'Med Arena', alt: 'Arena competitiva do MedStudy com ranking, missões e modos de jogo' },
  creator: { src: '/assets/medstudy-creator.png', title: 'Estúdio do Criador', alt: 'Estúdio do criador no MedStudy com publicações, indicadores e gestão de conteúdos' }
};
const medstudyImage = document.getElementById('medstudy-current-image');
const medstudyScreenButton = document.getElementById('medstudy-screen');
const medstudyDialog = document.getElementById('medstudy-lightbox');
const medstudyDialogImage = document.getElementById('medstudy-lightbox-image');
const medstudyCaption = document.getElementById('medstudy-lightbox-caption');
let selectedMedstudyScreen = medstudyScreens.flashcards;

document.querySelectorAll('.medstudy-thumb').forEach((button) => {
  button.addEventListener('click', () => {
    const nextScreen = medstudyScreens[button.dataset.screen];
    if (!nextScreen) return;
    selectedMedstudyScreen = nextScreen;
    medstudyImage.src = nextScreen.src;
    medstudyImage.alt = nextScreen.alt;
    medstudyScreenButton.setAttribute('aria-label', `Ampliar captura: ${nextScreen.title}`);
    document.querySelectorAll('.medstudy-thumb').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
  });
});

if (medstudyDialog && typeof medstudyDialog.showModal === 'function') {
  medstudyScreenButton.addEventListener('click', () => {
    medstudyDialogImage.src = selectedMedstudyScreen.src;
    medstudyDialogImage.alt = selectedMedstudyScreen.alt;
    medstudyCaption.textContent = `MedStudy / ${selectedMedstudyScreen.title}`;
    medstudyDialog.showModal();
  });
  medstudyDialog.querySelector('.medstudy-lightbox-close').addEventListener('click', () => medstudyDialog.close());
  medstudyDialog.addEventListener('click', (event) => {
    if (event.target === medstudyDialog) medstudyDialog.close();
  });
}

const leadfinderScreens = {
  radar: { src: '/assets/leadfinder-radar.png', title: 'Radar de oportunidades', alt: 'Tela real com busca por nicho e cidade, Google Maps e resultados de empresas' },
  detail: { src: '/assets/leadfinder-lead-detail.png', title: 'Detalhes do lead', alt: 'Painel real de um lead com pontuação, localização, telefone, reputação e website' },
  dna: { src: '/assets/leadfinder-dna.png', title: 'DNA digital', alt: 'Captura real da análise de identidade digital com paleta de cores, tipografia e diretrizes de design' },
  pipeline: { src: '/assets/leadfinder-pipeline.png', title: 'Pipeline de vendas', alt: 'Tela real do pipeline de vendas com etapas de acompanhamento de leads' }
};
const leadfinderImage = document.getElementById('leadfinder-current-image');
const leadfinderScreenButton = document.getElementById('leadfinder-screen');
const leadfinderDialog = document.getElementById('leadfinder-lightbox');
const leadfinderDialogImage = document.getElementById('leadfinder-lightbox-image');
const leadfinderCaption = document.getElementById('leadfinder-lightbox-caption');
const leadfinderLabel = document.getElementById('leadfinder-screen-label');
let selectedLeadfinderScreen = leadfinderScreens.radar;

document.querySelectorAll('.leadfinder-thumb').forEach((button, index) => {
  button.addEventListener('click', () => {
    const next = leadfinderScreens[button.dataset.leadScreen];
    if (!next) return;
    selectedLeadfinderScreen = next;
    leadfinderImage.classList.remove('leadfinder-screen-enter');
    void leadfinderImage.offsetWidth;
    leadfinderImage.src = next.src;
    leadfinderImage.alt = next.alt;
    leadfinderImage.classList.add('leadfinder-screen-enter');
    leadfinderScreenButton.setAttribute('aria-label', `Ampliar captura: ${next.title}`);
    leadfinderLabel.textContent = `${String(index + 1).padStart(2, '0')} / ${next.title.toUpperCase()}`;
    document.querySelectorAll('.leadfinder-thumb').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });
});

if (leadfinderDialog && typeof leadfinderDialog.showModal === 'function') {
  leadfinderScreenButton.addEventListener('click', () => {
    leadfinderDialogImage.src = selectedLeadfinderScreen.src;
    leadfinderDialogImage.alt = selectedLeadfinderScreen.alt;
    leadfinderCaption.textContent = `LeadFinder / ${selectedLeadfinderScreen.title}`;
    leadfinderDialog.showModal();
  });
  leadfinderDialog.querySelector('.medstudy-lightbox-close').addEventListener('click', () => leadfinderDialog.close());
  leadfinderDialog.addEventListener('click', (event) => {
    if (event.target === leadfinderDialog) leadfinderDialog.close();
  });
}

const ckScreens = {
  comparison: { src: '/assets/ck-comparison.png', title: 'Comparação multicanal', alt: 'Comparativo de lucro líquido e margem entre Mercado Livre Clássico, Premium e Shopee' },
  breakdown: { src: '/assets/ck-breakdown.png', title: 'Detalhamento dos cálculos', alt: 'Tabela de formação de preço com comissão, frete, repasse, impostos e lucro por canal' },
  analysis: { src: '/assets/ck-analysis.png', title: 'Analisar preço', alt: 'Formulário de precificação com custos, peso, imposto, opções de canal e importação do Bling' },
  ideal: { src: '/assets/ck-ideal.png', title: 'Encontrar preço ideal', alt: 'Modo de precificação por objetivo de margem líquida' }
};
const ckImage = document.getElementById('ck-current-image');
const ckScreenButton = document.getElementById('ck-screen');
const ckLabel = document.getElementById('ck-screen-label');
const ckDialog = document.getElementById('ck-lightbox');
const ckDialogImage = document.getElementById('ck-lightbox-image');
const ckCaption = document.getElementById('ck-lightbox-caption');
let selectedCkScreen = ckScreens.comparison;

document.querySelectorAll('.leadfinder-thumb[data-ck-screen]').forEach((button, index) => {
  button.addEventListener('click', () => {
    const next = ckScreens[button.dataset.ckScreen];
    if (!next) return;
    selectedCkScreen = next;
    ckImage.classList.remove('leadfinder-screen-enter');
    void ckImage.offsetWidth;
    ckImage.src = next.src;
    ckImage.alt = next.alt;
    ckImage.classList.add('leadfinder-screen-enter');
    ckScreenButton.setAttribute('aria-label', `Ampliar captura: ${next.title}`);
    ckLabel.textContent = `${String(index + 1).padStart(2, '0')} / ${next.title.toUpperCase()}`;
    document.querySelectorAll('.leadfinder-thumb[data-ck-screen]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  });
});

if (ckDialog && typeof ckDialog.showModal === 'function') {
  ckScreenButton.addEventListener('click', () => {
    ckDialogImage.src = selectedCkScreen.src;
    ckDialogImage.alt = selectedCkScreen.alt;
    ckCaption.textContent = `CK Precifica / ${selectedCkScreen.title}`;
    ckDialog.showModal();
  });
  ckDialog.querySelector('.medstudy-lightbox-close').addEventListener('click', () => ckDialog.close());
  ckDialog.addEventListener('click', (event) => {
    if (event.target === ckDialog) ckDialog.close();
  });
}
