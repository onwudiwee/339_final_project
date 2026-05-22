/* filter.js — Day filter & search for Nkwa's Dublin Journal */

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('day-search');
  const tagButtons  = document.querySelectorAll('.tag-btn');
  const dayCards    = document.querySelectorAll('.day-card');
  const countEl     = document.getElementById('filter-count');
  const noResults   = document.getElementById('no-results');

  if (!searchInput) return; // only run on pages with the filter

  let activeTag = 'all';

  function normalize(str) {
    return str.toLowerCase().trim();
  }

  function filterCards() {
    const query = normalize(searchInput.value);
    let visible = 0;

    dayCards.forEach(card => {
      const title   = normalize(card.dataset.title   || '');
      const desc    = normalize(card.dataset.desc    || '');
      const tags    = normalize(card.dataset.tags    || '');
      const week    = normalize(card.dataset.week    || '');

      const matchesSearch = !query ||
        title.includes(query) ||
        desc.includes(query)  ||
        tags.includes(query)  ||
        week.includes(query);

      const matchesTag = activeTag === 'all' || tags.includes(activeTag);

      if (matchesSearch && matchesTag) {
        card.classList.remove('hidden');
        // re-trigger slide-in animation
        card.style.animation = 'none';
        // force reflow
        void card.offsetHeight;
        card.style.animation = '';
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });

    if (countEl) {
      countEl.textContent = visible === dayCards.length
        ? `${visible} days`
        : `${visible} of ${dayCards.length} days`;
    }

    if (noResults) {
      noResults.classList.toggle('visible', visible === 0);
    }
  }

  // Search input
  searchInput.addEventListener('input', filterCards);

  // Clear on Escape
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      filterCards();
    }
  });

  // Tag buttons
  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tagButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      activeTag = btn.dataset.tag;
      filterCards();
    });
  });

  // Initial count
  filterCards();
});