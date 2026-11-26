(function () {
  const productList = document.querySelector('.product-list');
  if (!productList) return;

  const cards = Array.from(productList.querySelectorAll('.product-card'));
  if (!cards.length) return;

  const toolbar = productList.previousElementSibling;
  const searchInput = toolbar?.querySelector('input[type="search"]');
  const filterGroup = toolbar?.querySelector('.product-filter-group');
  const hasFilters = Boolean(toolbar && searchInput && filterGroup);

  const pageSize = 6;
  let currentPage = 1;
  let filteredCards = [...cards];

  const normalizeTag = (value) => value.trim().toLowerCase();
  const formatTag = (value) => value.trim().replace(/[-_]+/g, ' ');

  const getCardTags = (card) => {
    const explicitTags = card.getAttribute('data-tags');
    if (explicitTags) {
      return explicitTags
        .split(',')
        .map((tag) => ({ label: formatTag(tag), value: normalizeTag(tag) }))
        .filter((tag) => tag.value);
    }

    const imageAlt = card.querySelector('img')?.getAttribute('alt') || '';
    return imageAlt
      .split(/[,/]+/)
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => ({ label: formatTag(tag), value: normalizeTag(tag) }));
  };

  const renderTags = () => {
    cards.forEach((card) => {
      const info = card.querySelector('.product-info');
      if (!info || info.querySelector('.product-tags')) return;

      const tags = getCardTags(card);
      if (!tags.length) return;

      const tagsWrap = document.createElement('div');
      tagsWrap.className = 'product-tags';
      tags.forEach((tag) => {
        const tagItem = document.createElement('span');
        tagItem.className = 'product-tag';
        tagItem.textContent = tag.label;
        tagsWrap.appendChild(tagItem);
      });
      info.insertBefore(tagsWrap, info.firstChild);
    });
  };

  const buildFilterButtons = () => {
    const uniqueTags = Array.from(
      new Set(cards.flatMap((card) => getCardTags(card).map((tag) => tag.value)))
    ).sort((a, b) => a.localeCompare(b));

    const allButton = document.createElement('button');
    allButton.type = 'button';
    allButton.className = 'filter-chip active';
    allButton.dataset.tag = '';
    allButton.textContent = 'Todos';
    filterGroup.appendChild(allButton);

    uniqueTags.forEach((tagValue) => {
      const tagLabel = tagValue.charAt(0).toUpperCase() + tagValue.slice(1);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'filter-chip';
      button.dataset.tag = tagValue;
      button.textContent = tagLabel;
      filterGroup.appendChild(button);
    });

    filterGroup.addEventListener('click', (event) => {
      const target = event.target.closest('button.filter-chip');
      if (!target) return;
      filterGroup.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('active'));
      target.classList.add('active');
      currentPage = 1;
      applyFilters();
    });
  };

  const pagination = document.createElement('div');
  pagination.className = 'product-pagination';

  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.className = 'pagination-btn';
  prevButton.textContent = 'Anterior';

  const pageInfo = document.createElement('span');
  pageInfo.className = 'pagination-info';

  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.className = 'pagination-btn';
  nextButton.textContent = 'Siguiente';

  pagination.appendChild(prevButton);
  pagination.appendChild(pageInfo);
  pagination.appendChild(nextButton);
  productList.insertAdjacentElement('afterend', pagination);

  const renderPagination = () => {
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const visibleCards = new Set(filteredCards.slice(start, end));

    cards.forEach((card) => {
      card.style.display = visibleCards.has(card) ? '' : 'none';
    });

    pageInfo.textContent = `Pagina ${currentPage} de ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  };

  const applyFilters = () => {
    const query = hasFilters ? searchInput.value.trim().toLowerCase() : '';
    const activeTag = hasFilters ? filterGroup.querySelector('.filter-chip.active')?.dataset.tag || '' : '';

    filteredCards = cards.filter((card) => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const textContent = card.textContent.toLowerCase();
      const tags = getCardTags(card).map((tag) => tag.value).join(' ').toLowerCase();
      const matchesSearch = !query || title.includes(query) || textContent.includes(query);
      const matchesTag = !activeTag || tags.includes(activeTag.toLowerCase());
      return matchesSearch && matchesTag;
    });

    renderPagination();
  };

  if (hasFilters) {
    renderTags();
    buildFilterButtons();
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      applyFilters();
    });
  }

  prevButton.addEventListener('click', () => {
    if (currentPage <= 1) return;
    currentPage -= 1;
    renderPagination();
  });

  nextButton.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(filteredCards.length / pageSize));
    if (currentPage >= totalPages) return;
    currentPage += 1;
    renderPagination();
  });

  applyFilters();
})();