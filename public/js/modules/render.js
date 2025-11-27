// Render functions module - Contains all page rendering logic

function renderHeader(header) {
  return `<header class="bg-gradient-to-r from-blue-600 to-cyan-400 text-white sticky top-0 z-50 shadow-lg">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="#home" class="logo flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img src="${header.logo}" alt="Logo" class="h-14" onerror="this.nextElementSibling.style.display='block'">
        <span class="text-white font-bold text-lg hidden">FTTG Solutions</span>
      </a>
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
    <nav class="hidden flex-col gap-0 bg-transparent max-h-0 overflow-hidden transition-all duration-300 pointer-events-none" id="mobileMenu">
      ${header.menu.map(item => {
        const href = item.url === '/' ? '#home' : `#${item.url.replace('/', '')}`;
        return `<a href="${href}" class="menu-link block px-4 py-3 border-b border-white/30 hover:bg-white/10 transition-colors text-right pointer-events-auto">${item.label}</a>`;
      }).join('')}
    </nav>
  </header>`;
}

function renderFooter(footer) {
  return `<footer class="bg-gray-900 text-white py-12 md:py-16 mt-12">
    <div class="max-w-6xl mx-auto px-4 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div class="lg:col-span-1">
          <h3 class="text-xl font-bold mb-2">fttsolutions</h3>
          <p class="text-gray-400 text-sm">${footer.tagline}</p>
        </div>
        <div>
          <h4 class="text-lg font-bold mb-4 pb-2 border-b border-gray-700">Quick Links</h4>
          <ul class="space-y-2">
            ${footer.quick_links.map(link => `<li><a href="${link.url}" class="text-gray-400 hover:text-cyan-400 transition-colors">${link.label}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h4 class="text-lg font-bold mb-4 pb-2 border-b border-gray-700">Company</h4>
          <ul class="space-y-2">
            ${footer.company_links.map(link => `<li><a href="${link.url}" class="text-gray-400 hover:text-cyan-400 transition-colors">${link.label}</a></li>`).join('')}
          </ul>
        </div>
        <div class="lg:col-span-2">
          <h4 class="text-lg font-bold mb-4 pb-2 border-b border-gray-700">${footer.newsletter.title}</h4>
          <p class="text-gray-400 text-sm mb-4">${footer.newsletter.description}</p>
          <div class="flex gap-2">
            <input type="email" placeholder="${footer.newsletter.placeholder}" class="flex-1 px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400">
            <button class="bg-cyan-400 hover:bg-cyan-500 text-gray-900 font-bold px-4 py-2 rounded transition-all">${footer.newsletter.button_text}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="border-t border-gray-700 pt-8">
      <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="text-center md:text-left text-gray-400 text-sm">${footer.copyright}</div>
        <div class="social flex gap-6 text-lg">
          ${footer.social.map(s => `<a href="${s.url}" target="_blank" rel="noopener" class="text-gray-400 hover:text-cyan-400 transition-colors"><i class="bi ${s.icon}"></i></a>`).join('')}
        </div>
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
    <section class="bg-white py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Our Recent Work</h2>
          <p class="text-gray-600 text-lg">Showcasing the projects we're proud of</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          ${appData && appData.pages && appData.pages.portfolio && appData.pages.portfolio.categories ? 
            appData.pages.portfolio.categories
              .flatMap(cat => cat.projects.map(p => ({...p, category: cat.name})))
              .slice(0, 2)
              .map(p => `
                <div class="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100">
                  <div class="bg-gradient-to-r from-blue-600 to-cyan-400 h-40 flex items-center justify-center">
                    <i class="${p.icon} text-white" style="font-size: 56px;"></i>
                  </div>
                  <div class="p-6">
                    <div class="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-2">${p.category}</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">${p.title}</h3>
                    <p class="text-gray-600 text-sm mb-4">${p.description}</p>
                    <button onclick="openProjectModal('${p.link}', '${p.title}')" class="text-blue-600 hover:text-blue-700 font-semibold text-sm cursor-pointer">View Project →</button>
                  </div>
                </div>
              `).join('')
            : ''}
        </div>
        <div class="text-center">
          <a href="#portfolio" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all">View All Projects →</a>
        </div>
      </div>
    </section>
    <section class="bg-white py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">${services.title}</h2>
          <p class="text-gray-600 text-lg">${services.subtitle}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          ${services.items.map(s => `
            <div class="bg-gray-50 rounded-lg p-6 hover:shadow-lg hover:-translate-y-2 transition-all text-center group">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-4 group-hover:bg-blue-50">
                <i class="bi ${s.icon} text-3xl text-blue-600"></i>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">${s.title}</h3>
              <p class="text-gray-600 text-sm">${s.description}</p>
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

// Note: renderServices, renderPortfolio, renderAbout, renderBlog, renderContact functions are in the original app.js
// They are too long to include here but follow the same pattern
// Include them from the current app.js file
