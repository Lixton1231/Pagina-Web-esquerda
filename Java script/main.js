document.addEventListener('DOMContentLoaded', () => {
  const setupDelayedMenu = (container, menu) => {
    let closeTimeout;
    const keepOpen = () => {
      clearTimeout(closeTimeout);
      container.classList.add('menu-open');
    };
    const closeLater = () => {
      closeTimeout = setTimeout(() => container.classList.remove('menu-open'), 2000);
    };

    [container, menu].forEach((element) => {
      element.addEventListener('pointerenter', keepOpen);
      element.addEventListener('pointerleave', closeLater);
    });
  };

  document.querySelectorAll('.nav-links > li').forEach((item) => {
    const menu = item.querySelector('.dropdown-menu');
    if (menu) setupDelayedMenu(item, menu);
  });

  const langSwitcher = document.querySelector('.lang-switcher');
  const langMenu = langSwitcher?.querySelector('.lang-menu');
  if (langSwitcher && langMenu) setupDelayedMenu(langSwitcher, langMenu);

  const langButtons = document.querySelectorAll('[data-lang-option]');
  const langLabel = document.querySelector('[data-lang-label]');
  let currentLang = localStorage.getItem('lang') || 'es';
  const updateLanguage = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n-es], [data-i18n-ca]').forEach((el) => {
      const text = lang === 'ca' ? el.getAttribute('data-i18n-ca') : el.getAttribute('data-i18n-es');
      if (text) el.textContent = text;
    });
    if (langLabel) langLabel.textContent = lang === 'ca' ? 'CA' : 'ES';
    localStorage.setItem('lang', lang);
  };
  langButtons.forEach((button) => button.addEventListener('click', () => updateLanguage(button.dataset.langOption)));
  updateLanguage(currentLang);
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('.carousel-dots span'));
  let slideIndex = 0;
  const showSlide = (index) => {
    slides.forEach((slide, idx) => slide.classList.toggle('active', idx === index));
    dots.forEach((dot, idx) => dot.classList.toggle('active', idx === index));
  };
  if (slides.length) {
    setInterval(() => { slideIndex = (slideIndex + 1) % slides.length; showSlide(slideIndex); }, 8000);
    showSlide(slideIndex);
  }
});
