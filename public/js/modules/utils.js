// Utility functions module

function setCSSVars(colors) {
  if (!colors.variables) return;
  Object.entries(colors.variables).forEach(([k, v]) => {
    document.documentElement.style.setProperty(k, v);
  });
  Object.entries(colors).forEach(([k, v]) => {
    if (typeof v === 'string') {
      document.documentElement.style.setProperty(`--color-${k}`, v);
    }
  });
}

function setFonts(fonts) {
  document.documentElement.style.setProperty('--font-primary', `'${fonts.primary}'`);
  document.documentElement.style.setProperty('--font-secondary', `'${fonts.secondary}'`);
}

function route(data) {
  const page = window.location.hash.slice(1) || 'home';
  const appDiv = document.getElementById('app');
  
  console.log(`📄 Routing to page: ${page}`);
  
  let content = '';
  
  if (page === 'home') {
    content = renderHome(data.pages.home);
  } else if (page === 'services') {
    content = renderServices(data.pages.services);
  } else if (page === 'about') {
    content = renderAbout(data.pages.about);
  } else if (page === 'portfolio') {
    content = renderPortfolio(data.pages.portfolio);
  } else if (page === 'contact') {
    content = renderContact(data.pages.contact);
  } else {
    content = `<div class="text-center py-20"><h1>Page not found</h1></div>`;
  }
  
  appDiv.innerHTML = `
    ${renderHeader(data.global_components.header)}
    <main class="min-h-screen">${content}</main>
    ${renderFooter(data.global_components.footer)}
  `;
  
  if (page === 'about') setupServiceDropdown();
  if (page === 'contact') setupContactServiceDropdown();
  setupMobileMenu();
}

function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!menuToggle || !mobileMenu) {
    console.warn('⚠️ Mobile menu elements not found');
    return;
  }
  
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('max-h-96');
    const isOpen = !mobileMenu.classList.contains('hidden');
    console.log(`☰ Mobile menu ${isOpen ? 'opened' : 'closed'}`);
  });
  
  // Close menu when a link is clicked
  document.querySelectorAll('#mobileMenu .menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      console.log(`🔗 Mobile menu link clicked: ${href}`);
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('max-h-96');
    });
  });
}
