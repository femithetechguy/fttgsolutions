// Modular, responsive, dynamic app - loads all content from json/app.json
const APP_JSON_PATH = 'json/app.json';
let appData = null;

async function fetchAppData() {
  try {
    const res = await fetch(APP_JSON_PATH);
    if (!res.ok) throw new Error('Failed to load app.json');
    return await res.json();
  } catch (e) {
    console.error(e);
    document.getElementById('app').innerHTML = `<div class="error">Could not load app data. Please check json/app.json exists.</div>`;
    throw e;
  }
}

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

function renderHeader(header) {
  return `<header class="bg-gradient-to-r from-blue-600 to-cyan-400 text-white sticky top-0 z-50 shadow-lg">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <div class="logo flex-shrink-0">
        <img src="${header.logo}" alt="Logo" class="h-14" onerror="this.style.display='none'">
      </div>
      <button class="menu-toggle md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer" id="menuToggle">
        <span class="w-6 h-0.5 bg-white rounded transition-all duration-300"></span>
        <span class="w-6 h-0.5 bg-white rounded transition-all duration-300"></span>
        <span class="w-6 h-0.5 bg-white rounded transition-all duration-300"></span>
      </button>
      <nav class="hidden md:flex gap-8 items-center" id="navMenu">
        ${header.menu.map(item => {
          const href = item.url === '/' ? '#home' : `#${item.url.replace('/', '')}`;
          return `<a href="${href}" class="menu-link hover:text-cyan-300 transition-colors">${item.label}</a>`;
        }).join('')}
      </nav>
      ${header.cta_enabled ? `<a href="#${header.cta_url.replace('/', '')}" class="hidden md:inline-block bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2 rounded font-semibold transition-all">${header.cta_text}</a>` : ''}
    </div>
    <nav class="hidden flex-col gap-0 bg-blue-600 max-h-0 overflow-hidden transition-all duration-300" id="mobileMenu">
      ${header.menu.map(item => {
        const href = item.url === '/' ? '#home' : `#${item.url.replace('/', '')}`;
        return `<a href="${href}" class="menu-link block px-4 py-3 border-b border-blue-500 hover:bg-blue-700 transition-colors">${item.label}</a>`;
      }).join('')}
    </nav>
  </header>`;
}

function renderFooter(footer) {
  return `<footer class="bg-blue-600 text-white py-8 mt-12">
    <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="copyright text-center md:text-left">${footer.copyright}</div>
      <div class="social flex gap-6 text-xl">
        ${footer.social.map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="hover:text-cyan-400 transition-colors"><i class="bi ${s.icon}"></i></a>`).join('')}
      </div>
    </div>
  </footer>`;
}

function renderHome(page) {
  const hero = page.hero;
  const features = page.sections.features;
  const services = page.sections.services_overview;
  const stats = page.sections.stats;
  return `
    <section class="bg-gradient-to-r from-slate-800 via-blue-600 to-cyan-400 py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div class="text-white">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 leading-tight">${hero.title}</h1>
          <p class="text-lg md:text-xl opacity-95 mb-8 leading-relaxed">${hero.subtitle}</p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a href="#contact" class="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded font-semibold transition-all inline-block text-center">${hero.button_text}</a>
            <a href="#services" class="border-2 border-white hover:bg-white/10 text-white px-6 py-3 rounded font-semibold transition-all inline-block text-center">Learn More</a>
          </div>
        </div>
        <div class="hidden md:block">
          <img src="https://via.placeholder.com/500x400?text=Software+Development" alt="Software Development" class="w-full h-auto" onerror="this.style.display='none'">
        </div>
      </div>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">Why Choose Us</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${features.map(f => `
            <div class="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg hover:-translate-y-2 transition-all">
              <i class="bi ${f.icon} text-4xl text-blue-600 mb-4 block"></i>
              <h3 class="text-xl font-bold text-gray-900 mb-2">${f.title}</h3>
              <p class="text-gray-600">${f.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    <section class="bg-gray-100 py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">${services.title}</h2>
        <p class="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">Comprehensive solutions tailored to your needs</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${services.items.map(s => `
            <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-200">
              <h3 class="text-xl font-bold text-gray-900 mb-3">${s.title}</h3>
              <p class="text-gray-600">${s.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          ${[
            {num: stats.clients, label: 'Clients'},
            {num: stats.projects, label: 'Projects'},
            {num: stats.countries, label: 'Countries'}
          ].map(stat => `
            <div class="bg-blue-600 text-white rounded-lg p-8">
              <div class="text-4xl md:text-5xl font-bold mb-2">${stat.num}+</div>
              <div class="text-lg opacity-90">${stat.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    <section class="bg-gradient-to-br from-gray-100 to-blue-50 py-12 md:py-20">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <p class="text-2xl font-semibold text-gray-900 mb-6">${page.cta.text}</p>
        <a href="#contact" class="bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-4 rounded font-semibold transition-all inline-block">${page.cta.button_text}</a>
      </div>
    </section>
  `;
}

function renderServices(page) {
  return `
    <section class="bg-gradient-to-r from-blue-600 to-cyan-400 py-12 md:py-20 text-white text-center">
      <h1 class="text-4xl md:text-5xl font-bold">Our Services</h1>
    </section>
    ${page.categories.map(cat => `
      <section class="py-12 md:py-20">
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">${cat.name}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${cat.services.map(s => `
              <div class="bg-white rounded-lg p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all border border-gray-200">
                <h3 class="text-xl font-bold text-gray-900 mb-3">${s.title}</h3>
                <p class="text-gray-600 mb-4">${s.description}</p>
                <ul class="space-y-2">
                  ${s.features.map(f => `<li class="text-gray-600"><span class="text-cyan-400 font-bold">✓</span> ${f}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `).join('')}
    <section class="bg-gray-50 py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">${page.process.title}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${page.process.steps.map(step => `
            <div class="bg-white rounded-lg p-6 shadow-md">
              <div class="text-4xl font-bold text-cyan-400 mb-3">${step.number}</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">${step.title}</h3>
              <p class="text-gray-600">${step.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderPortfolio(page) {
  return `
    <section class="bg-gradient-to-r from-blue-600 to-cyan-400 py-12 md:py-20 text-white text-center">
      <h1 class="text-4xl md:text-5xl font-bold">Our Portfolio</h1>
    </section>
    ${page.categories.map(cat => `
      <section class="py-12 md:py-20">
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">${cat.name}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${cat.projects.map(p => `
              <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all">
                <img src="${p.image}" alt="${p.title}" class="w-full h-48 object-cover" onerror="this.src='https://via.placeholder.com/400x300?text=${encodeURIComponent(p.title)}'">
                <div class="p-6">
                  <h3 class="text-xl font-bold text-gray-900 mb-2">${p.title}</h3>
                  <p class="text-gray-600 mb-4">${p.description}</p>
                  <div class="flex flex-wrap gap-2">
                    ${p.technologies.map(t => `<span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">${t}</span>`).join('')}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `).join('')}
  `;
}

function renderAbout(page) {
  return `
    <section class="bg-gradient-to-r from-blue-600 to-cyan-400 py-12 md:py-20 text-white text-center">
      <h1 class="text-4xl md:text-5xl font-bold">${page.hero.title}</h1>
      <p class="text-lg md:text-xl opacity-90 mt-4">${page.hero.subtitle}</p>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-4xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">${page.intro.title}</h2>
        <p class="text-gray-600 text-lg leading-relaxed">${page.intro.description}</p>
      </div>
    </section>
    <section class="bg-gray-50 py-12 md:py-20">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p class="text-gray-600 text-lg leading-relaxed">${page.mission}</p>
      </div>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          ${page.values.map(v => `
            <div class="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-all">
              <i class="bi ${v.icon} text-4xl text-cyan-400 mb-4 block"></i>
              <h3 class="text-xl font-bold text-gray-900 mb-2">${v.title}</h3>
              <p class="text-gray-600">${v.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    <section class="bg-gray-50 py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          ${page.team.map(m => `
            <div class="bg-white rounded-lg p-6 text-center shadow-md">
              <img src="${m.image}" alt="${m.name}" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" onerror="this.src='https://via.placeholder.com/300x300?text=${encodeURIComponent(m.name)}'">
              <h3 class="text-xl font-bold text-gray-900">${m.name}</h3>
              <p class="text-cyan-400 font-semibold mb-3">${m.role}</p>
              <p class="text-gray-600">${m.bio}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">${page.process.title}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          ${page.process.steps.map(step => `
            <div class="bg-blue-50 rounded-lg p-6">
              <div class="text-3xl font-bold text-cyan-400 mb-3">${step.number}</div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">${step.title}</h3>
              <p class="text-gray-600 text-sm">${step.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderBlog(page) {
  return `
    <section class="bg-gradient-to-r from-blue-600 to-cyan-400 py-12 md:py-20 text-white text-center">
      <h1 class="text-4xl md:text-5xl font-bold">Blog & Insights</h1>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          ${page.posts.map(post => `
            <article class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all mb-6">
              <img src="${post.image}" alt="${post.title}" class="w-full h-64 object-cover" onerror="this.src='https://via.placeholder.com/600x400?text=${encodeURIComponent(post.title)}'">
              <div class="p-6">
                <span class="bg-cyan-400 text-white px-3 py-1 rounded-full text-sm font-semibold">${post.category}</span>
                <h2 class="text-2xl font-bold text-gray-900 mt-3 mb-2">${post.title}</h2>
                <p class="text-gray-500 text-sm mb-4">${post.date}</p>
                <p class="text-gray-600 mb-4">${post.excerpt}</p>
                <a href="${post.link}" class="text-cyan-400 font-semibold hover:text-cyan-500 transition-colors">Read More →</a>
              </div>
            </article>
          `).join('')}
        </div>
        <aside class="space-y-6">
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
            <ul class="space-y-3">
              ${page.sidebar.popularPosts.map(post => `
                <li><a href="${post.link}" class="text-gray-600 hover:text-cyan-400 transition-colors">${post.title}</a></li>
              `).join('')}
            </ul>
          </div>
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Tags</h3>
            <div class="flex flex-wrap gap-2">
              ${page.sidebar.tags.map(tag => `<span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">${tag}</span>`).join('')}
            </div>
          </div>
        </aside>
      </div>
    </section>
  `;
}

function renderContact(page) {
  return `
    <section class="bg-gradient-to-r from-blue-600 to-cyan-400 py-12 md:py-20 text-white text-center">
      <h1 class="text-4xl md:text-5xl font-bold">${page.hero.title}</h1>
      <p class="text-lg md:text-xl opacity-90 mt-4">${page.hero.subtitle}</p>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-gray-50 rounded-lg p-8">
          <p class="text-gray-600 text-lg leading-relaxed mb-8">${page.info.description}</p>
          <div class="space-y-4">
            <p><strong class="text-gray-900">Email:</strong> <a href="mailto:${page.info.contact.email}" class="text-cyan-400 hover:text-cyan-500">${page.info.contact.email}</a></p>
            <p><strong class="text-gray-900">Location:</strong> ${page.info.contact.address}</p>
          </div>
        </div>
        <form class="bg-gray-50 rounded-lg p-8" id="contactForm">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">${page.form.title}</h2>
          ${page.form.fields.map(field => {
            if (field.type === 'textarea') {
              return `<div class="mb-6">
                <label for="${field.name}" class="block text-gray-900 font-semibold mb-2">${field.label}</label>
                <textarea id="${field.name}" name="${field.name}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" rows="5" ${field.required ? 'required' : ''}></textarea>
              </div>`;
            }
            return `<div class="mb-6">
              <label for="${field.name}" class="block text-gray-900 font-semibold mb-2">${field.label}</label>
              <input type="${field.type}" id="${field.name}" name="${field.name}" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100" ${field.required ? 'required' : ''}>
            </div>`;
          }).join('')}
          <button type="submit" class="w-full bg-cyan-400 hover:bg-cyan-500 text-white py-3 rounded-lg font-semibold transition-all">${page.form.button.text}</button>
        </form>
      </div>
    </section>
  `;
}

function renderPage(pageName, data) {
  const page = data.pages[pageName];
  if (!page) return '<div class="not-found"><h1>Page not found</h1></div>';
  
  switch (pageName) {
    case 'home': return renderHome(page);
    case 'services': return renderServices(page);
    case 'portfolio': return renderPortfolio(page);
    case 'about': return renderAbout(page);
    case 'blog': return renderBlog(page);
    case 'contact': return renderContact(page);
    default: return '<div class="not-found"><h1>Page not found</h1></div>';
  }
}

function route(data) {
  const hash = window.location.hash.replace('#', '') || 'home';
  const main = document.getElementById('app');
  main.innerHTML =
    renderHeader(data.global_components.header) +
    `<main class="main-content">${renderPage(hash, data)}</main>` +
    renderFooter(data.global_components.footer);
  
  // Add mobile menu toggle
  setupMobileMenu();
  
  // Smooth scroll to top
  window.scrollTo(0, 0);
}

function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
  });
  
  // Close menu when a link is clicked
  document.querySelectorAll('#mobileMenu .menu-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
    });
  });
}

async function initApp() {
  appData = await fetchAppData();
  setCSSVars(appData.design.colors);
  setFonts(appData.design.fonts);
  route(appData);
  window.onhashchange = () => route(appData);
}

document.addEventListener('DOMContentLoaded', initApp);
