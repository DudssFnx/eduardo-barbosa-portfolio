(() => {
  'use strict';
  const progress = document.getElementById('progress');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const screens = {
    comparison: { src: '/assets/ck-comparison.png', alt: 'Comparação real do CK Precifica: lucro líquido e margem nos três canais', caption: 'Comparação do lucro líquido e da margem entre Mercado Livre Clássico, Premium e Shopee.' },
    breakdown: { src: '/assets/ck-breakdown.png', alt: 'Tabela real de detalhamento de custos, taxas, repasse e lucro por canal', caption: 'Memória de cálculo com repasses, comissões, frete, impostos e resultado líquido por canal.' },
    analysis: { src: '/assets/ck-analysis.png', alt: 'Formulário real do modo analisar preço no CK Precifica', caption: 'Modo analisar preço: o mesmo valor de venda pode ser avaliado nas diferentes modalidades.' },
    ideal: { src: '/assets/ck-ideal.png', alt: 'Formulário real do modo encontrar preço ideal com meta de margem', caption: 'Modo preço ideal: a meta de margem ou lucro orienta a busca pelo valor de venda.' }
  };
  const keys = Object.keys(screens);
  const currentImage = document.getElementById('gallery-current');
  const count = document.getElementById('gallery-count');
  const caption = document.getElementById('gallery-caption');
  let selected = 'comparison';
  document.querySelectorAll('[data-screen]').forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.screen;
    const screen = screens[selected];
    currentImage.src = screen.src;
    currentImage.alt = screen.alt;
    count.textContent = `${String(keys.indexOf(selected) + 1).padStart(2, '0')} / 04`;
    caption.textContent = screen.caption;
    document.querySelectorAll('[data-screen]').forEach(item => {
      const active = item === button;
      item.classList.toggle('selected', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }));
  const lightbox = document.getElementById('gallery-lightbox');
  document.getElementById('gallery-expand').addEventListener('click', () => {
    document.getElementById('lightbox-image').src = screens[selected].src;
    document.getElementById('lightbox-image').alt = screens[selected].alt;
    document.getElementById('lightbox-caption').textContent = screens[selected].caption;
    lightbox.showModal();
  });
  document.getElementById('lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

  const form = document.getElementById('sim-form');
  const defaults = { price: 32, cost: 9.9, packaging: 2.5, tax: 11, shipping: 6.65, fixed: 4 };
  const channels = [
    { key: 'classic', name: 'Mercado Livre Clássico', commission: .14, shipping: true, fixed: false },
    { key: 'premium', name: 'Mercado Livre Premium', commission: .19, shipping: true, fixed: false },
    { key: 'shopee', name: 'Shopee', commission: .20, shipping: false, fixed: true }
  ];
  const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const percent = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const output = document.getElementById('sim-results');
  function readValues() {
    const values = {};
    for (const key of Object.keys(defaults)) {
      const input = form.elements.namedItem(key);
      const raw = Number(input.value);
      values[key] = Number.isFinite(raw) ? Math.max(0, raw) : 0;
    }
    values.tax = Math.min(100, values.tax);
    return values;
  }
  function calculate(values, channel) {
    const commission = values.price * channel.commission;
    const taxes = values.price * values.tax / 100;
    const freight = channel.shipping ? values.shipping : 0;
    const fixed = channel.fixed ? values.fixed : 0;
    const profit = values.price - commission - taxes - freight - fixed - values.cost - values.packaging;
    return { ...channel, profit, margin: values.price > 0 ? profit / values.price * 100 : 0 };
  }
  function renderSimulation() {
    const values = readValues();
    const results = channels.map(channel => calculate(values, channel)).sort((a, b) => b.profit - a.profit);
    const winner = results[0];
    document.getElementById('winner-name').textContent = winner.name;
    const winnerValue = document.getElementById('winner-profit');
    winnerValue.textContent = currency.format(winner.profit);
    winnerValue.style.color = winner.profit >= 0 ? '#8de6b5' : '#fd879c';
    document.getElementById('winner-note').textContent = winner.profit >= 0
      ? `Margem simulada de ${percent.format(winner.margin)}% sobre o preço informado.`
      : 'Todos os canais apresentam prejuízo com os parâmetros informados.';
    output.replaceChildren();
    for (const [index, result] of results.entries()) {
      const row = document.createElement('div');
      row.className = `sim-result-row${index === 0 ? ' top' : ''}`;
      const labels = document.createElement('div');
      const name = document.createElement('strong');
      name.textContent = result.name;
      const margin = document.createElement('small');
      margin.textContent = `${percent.format(result.margin)}% de margem líquida · ${percent.format(result.commission * 100)}% de comissão ilustrativa`;
      labels.append(name, margin);
      const value = document.createElement('div');
      value.className = `result-value ${result.profit >= 0 ? 'positive' : 'negative'}`;
      value.textContent = currency.format(result.profit);
      row.append(labels, value);
      output.append(row);
    }
  }
  form.addEventListener('input', renderSimulation);
  document.getElementById('sim-reset').addEventListener('click', () => {
    for (const [key, value] of Object.entries(defaults)) form.elements.namedItem(key).value = String(value);
    renderSimulation();
  });
  renderSimulation();
})();
