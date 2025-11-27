// ============================================================================
// FTTG Solutions - Dynamic SPA Application
// Loads all content from json/app.json and renders dynamically
// ============================================================================

// ============================================================================
// SECTION 1: DATA FETCHING
// ============================================================================

const APP_JSON_PATH = 'json/app.json';
let appData = null;
let blogData = null;

async function fetchAppData() {
  try {
    console.log('📥 Fetching app data from:', APP_JSON_PATH);
    const res = await fetch(APP_JSON_PATH + '?t=' + Date.now()); // Cache bust
    if (!res.ok) throw new Error('Failed to load app.json');
    const data = await res.json();
    console.log('✅ App data loaded successfully');
    return data;
  } catch (e) {
    console.error('❌ Error loading app data:', e);
    document.getElementById('app').innerHTML = `<div class="error">Could not load app data. Please check json/app.json exists.</div>`;
    throw e;
  }
}

async function fetchBlogData() {
  try {
    console.log('📥 Fetching blog data from: json/blog.json');
    const res = await fetch('json/blog.json?t=' + Date.now());
    if (!res.ok) throw new Error('Failed to load blog.json');
    const data = await res.json();
    console.log('✅ Blog data loaded successfully');
    return data;
  } catch (e) {
    console.error('❌ Error loading blog data:', e);
    return { posts: [] };
  }
}

// ============================================================================
// SECTION 1B: FORM SERVICE
// ============================================================================

// FormService is loaded separately from js/services/FormService.js
// Handles form submission and sends data to backend API
let formService = null;

// ============================================================================
// SECTION 2: STYLING & DESIGN SYSTEM
// ============================================================================

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

// ============================================================================
// SECTION 3: LAYOUT COMPONENTS (Header & Footer)
// ============================================================================

function renderHeader(header) {
  return `<header class="bg-gradient-to-r from-blue-600 to-cyan-400 text-white sticky top-0 z-50 shadow-lg relative">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
      <a href="/" class="logo flex-shrink-0 flex items-center gap-2 hover:opacity-80 transition-opacity" onclick="navigate('/', event)">
        <span class="text-white font-bold text-lg">FTTG Solutions</span>
      </a>
      <button class="menu-toggle md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-2" id="menuToggle">
        <span class="w-6 h-0.5 bg-white rounded transition-all duration-300 origin-center"></span>
        <span class="w-6 h-0.5 bg-white rounded transition-all duration-300 origin-center"></span>
        <span class="w-6 h-0.5 bg-white rounded transition-all duration-300 origin-center"></span>
      </button>
      <nav class="hidden md:flex gap-8 items-center" id="navMenu">
        ${header.menu.map(item => {
          return `<a href="${item.url}" class="menu-link hover:text-cyan-300 transition-colors" onclick="navigate('${item.url}', event)">${item.label}</a>`;
        }).join('')}
      </nav>
      ${header.cta_enabled ? `<a href="${header.cta_url}" class="hidden md:inline-block bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-2 rounded font-semibold transition-all" onclick="navigate('${header.cta_url}', event)">${header.cta_text}</a>` : ''}
    </div>
    <nav class="hidden flex-col gap-0 bg-black/25 max-h-0 overflow-hidden transition-all duration-300 pointer-events-none absolute w-full left-0 top-full" id="mobileMenu">
      ${header.menu.map(item => {
        return `<a href="${item.url}" class="menu-link block px-4 py-3 border-b border-white/30 hover:bg-white/10 transition-colors text-right pointer-events-auto" onclick="navigate('${item.url}', event)">${item.label}</a>`;
      }).join('')}
    </nav>
  </header>`;
}

function renderFooter(footer) {
  return `<footer class="bg-gray-900 text-white py-12 md:py-16 mt-12">
    <div class="max-w-6xl mx-auto px-4 mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <!-- Branding Section -->
        <div class="lg:col-span-1">
          <h3 class="text-xl font-bold mb-2">fttsolutions</h3>
          <p class="text-gray-400 text-sm">${footer.tagline}</p>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h4 class="text-lg font-bold mb-4 pb-2 border-b border-gray-700">Quick Links</h4>
          <ul class="space-y-2">
            ${footer.quick_links.map(link => `<li><a href="${link.url}" class="text-gray-400 hover:text-cyan-400 transition-colors" onclick="navigate('${link.url}', event)">${link.label}</a></li>`).join('')}
          </ul>
        </div>
        
        <!-- Company -->
        <div>
          <h4 class="text-lg font-bold mb-4 pb-2 border-b border-gray-700">Company</h4>
          <ul class="space-y-2">
            ${footer.company_links.map(link => `<li><a href="${link.url}" class="text-gray-400 hover:text-cyan-400 transition-colors" onclick="navigate('${link.url}', event)">${link.label}</a></li>`).join('')}
          </ul>
        </div>
        
        <!-- Newsletter -->
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
    
    <!-- Bottom Section -->
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

// ============================================================================
// SECTION 4: PAGE RENDERING FUNCTIONS
// ============================================================================

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
            <a href="/contact" class="bg-cyan-400 hover:bg-cyan-500 text-white px-6 py-3 rounded font-semibold transition-all inline-block text-center" onclick="navigate('/contact', event)">${hero.button_text}</a>
            <a href="/services" class="border-2 border-white hover:bg-white/10 text-white px-6 py-3 rounded font-semibold transition-all inline-block text-center" onclick="navigate('/services', event)">Learn More</a>
          </div>
        </div>
        <div class="hidden md:block"></div>
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
          <a href="/portfolio" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all" onclick="navigate('/portfolio', event)">View All Projects →</a>
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
        <a href="/contact" class="bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-4 rounded font-semibold transition-all inline-block" onclick="navigate('/contact', event)">${page.cta.button_text}</a>
      </div>
    </section>
  `;
}

function renderServices(page) {
  return `
    <section class="bg-white py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-0">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p class="text-gray-600 text-lg">Comprehensive solutions tailored to your needs</p>
        </div>
      </div>
    </section>
    ${page.categories.map((cat, idx) => `
      <section class="${idx === 0 ? '-mt-8 md:-mt-12' : ''} py-0 md:py-0 ${page.categories.indexOf(cat) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">>
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">${cat.name}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${cat.services.map(s => `
              <div class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100">
                <div class="bg-gradient-to-r from-blue-600 to-cyan-400 h-32 flex items-center justify-center">
                  <i class="${s.icon} text-white" style="font-size: 56px;"></i>
                </div>
                <div class="p-8">
                  <h3 class="text-xl font-bold text-gray-900 mb-3">${s.title}</h3>
                  <p class="text-gray-600 mb-6 text-sm leading-relaxed">${s.description}</p>
                  <ul class="space-y-3">
                    ${s.features.map(f => `<li class="text-gray-700 text-sm flex items-start gap-2"><span class="text-cyan-400 font-bold text-lg leading-none mt-0.5">✓</span> <span>${f}</span></li>`).join('')}
                  </ul>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `).join('')}
    <section class="bg-gray-50 py-12 md:py-20">
      <style>
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-card {
          animation: slideIn 0.6s ease-out forwards;
        }
        .step-card:nth-child(1) { animation-delay: 0.1s; }
        .step-card:nth-child(2) { animation-delay: 0.2s; }
        .step-card:nth-child(3) { animation-delay: 0.3s; }
        .step-card:nth-child(4) { animation-delay: 0.4s; }
        .arrow {
          display: none;
        }
        @media (min-width: 1024px) {
          .arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #5B6AFF;
            font-size: 28px;
            font-weight: bold;
          }
        }
      </style>
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">${page.process.title}</h2>
        <div class="hidden lg:flex items-stretch justify-center gap-0">
          ${page.process.steps.map((step, idx) => `
            <div class="flex flex-col flex-1">
              <div class="step-card bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all border-2 border-blue-600 h-full">
                <div class="text-5xl font-bold text-blue-600 mb-4">${step.number}</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">${step.title}</h3>
                <p class="text-gray-600">${step.description}</p>
              </div>
              ${idx < page.process.steps.length - 1 ? '<div class="arrow">→</div>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6">
          ${page.process.steps.map(step => `
            <div class="step-card bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all border-2 border-blue-600">
              <div class="text-5xl font-bold text-blue-600 mb-4">${step.number}</div>
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
  // Flatten all projects from all categories
  const allProjects = page.categories.flatMap(cat => 
    cat.projects.map(p => ({...p, category: cat.name}))
  );
  
  return `
    <section class="bg-white py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 text-center mb-16">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
        <p class="text-gray-600 text-lg">Real projects we've delivered for our clients</p>
      </div>
      
      <div class="max-w-7xl mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          ${allProjects.map(p => `
            <div class="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border border-gray-100">
              <div class="bg-gradient-to-r from-blue-600 to-cyan-400 h-40 flex items-center justify-center">
                <i class="${p.icon} text-white" style="font-size: 64px;"></i>
              </div>
              <div class="p-8">
                <div class="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">${p.category}</div>
                <h3 class="text-2xl font-bold text-gray-900 mb-3">${p.title}</h3>
                <p class="text-gray-600 mb-6 leading-relaxed">${p.description}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                  ${p.technologies.map(t => `<span class="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm font-semibold">${t}</span>`).join('')}
                </div>
                <button onclick="openProjectModal('${p.link}', '${p.title}')" class="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer">View Project →</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderAbout(page) {
  // Build flat list of all services
  const allServices = [];
  if (page.categories) {
    page.categories.forEach(cat => {
      cat.services.forEach(svc => {
        allServices.push(svc.title);
      });
    });
  }
  
  return `
    <section class="bg-gradient-to-r from-blue-600 to-cyan-400 py-12 md:py-20 text-white text-center">
      <h1 class="text-4xl md:text-5xl font-bold">${page.hero.title}</h1>
      <p class="text-lg md:text-xl opacity-90 mt-4">${page.hero.subtitle}</p>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div class="flex items-start gap-6">
            <i class="bi bi-building text-5xl text-blue-600 flex-shrink-0 mt-2"></i>
            <div>
              <h2 class="text-3xl font-bold text-gray-900 mb-4">${page.intro.title}</h2>
              <p class="text-gray-600 text-lg leading-relaxed">${page.intro.description}</p>
            </div>
          </div>
          <div>
            <div class="flex items-center gap-3 mb-4">
              <i class="bi bi-target text-5xl text-cyan-400"></i>
              <h2 class="text-3xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p class="text-gray-600 text-lg leading-relaxed">${page.mission}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="bg-blue-50 py-12 md:py-20">
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
        <div class="flex flex-wrap justify-center gap-8">
          ${page.team.map(m => `
            <div class="w-full md:w-96 bg-white rounded-lg p-8 text-center shadow-md">
              <img src="${m.image}" alt="${m.name}" class="w-56 h-56 rounded-full mx-auto mb-6 object-cover" style="object-position: center 20%;">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">${m.name}</h3>
              <p class="text-cyan-400 font-semibold mb-4 text-lg">${m.role}</p>
              <p class="text-gray-600 text-base">${m.bio}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
    <section class="py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-12">${page.process.title}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
          ${page.posts.map(post => {
            const postId = post.link ? post.link.split('/').pop() : null;
            console.log(`📰 Blog post: title="${post.title}" link="${post.link}" → id="${postId}"`);
            return `
            <article class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all mb-6">
              <img src="${post.image}" alt="${post.title}" class="w-full h-64 object-cover bg-gray-300" onerror="this.style.display='none'">
              <div class="p-6">
                <span class="bg-cyan-400 text-white px-3 py-1 rounded-full text-sm font-semibold">${post.category}</span>
                <h2 class="text-2xl font-bold text-gray-900 mt-3 mb-2">${post.title}</h2>
                <p class="text-gray-500 text-sm mb-4">${post.date}</p>
                <p class="text-gray-600 mb-4">${post.excerpt}</p>
                <button onclick="openBlogModal('${postId}')" class="text-cyan-400 font-semibold hover:text-cyan-500 transition-colors bg-none border-none cursor-pointer">Read More →</button>
              </div>
            </article>
          `;
          }).join('')}
        </div>
        <aside class="space-y-6">
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Popular Posts</h3>
            <ul class="space-y-3">
              ${page.sidebar.popularPosts.map((post, idx) => {
                const postId = post.link ? post.link.split('/').pop() : null;
                console.log(`📌 Popular post ${idx}: link="${post.link}" → id="${postId}"`);
                return `<li><button onclick="openBlogModal('${postId}')" class="text-gray-600 hover:text-cyan-400 transition-colors bg-none border-none cursor-pointer text-left">${post.title}</button></li>`;
              }).join('')}
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
    <section class="bg-white py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get In Touch</h1>
        <p class="text-gray-600 text-lg">Contact us to discuss your project</p>
      </div>
      
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Contact Form -->
        <form class="bg-gray-50 rounded-lg p-8" id="contactForm">
          ${(() => {
            const allServices = [];
            if (appData && appData.pages && appData.pages.services && appData.pages.services.categories) {
              appData.pages.services.categories.forEach(cat => {
                cat.services.forEach(svc => {
                  allServices.push(svc.title);
                });
              });
            }
            return page.form.fields.map(field => {
              if (field.name === 'subject') {
                return `<div class="mb-6">
                  <label for="${field.name}" class="block text-gray-900 font-semibold mb-2">${field.label}</label>
                  <select id="${field.name}" name="${field.name}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" ${field.required ? 'required' : ''}>
                    <option value="">-- Select a Service --</option>
                    ${allServices.map(svc => `<option value="${svc}">${svc}</option>`).join('')}
                    <option value="__custom">+ Add Custom Service</option>
                  </select>
                  <input type="text" id="customSubject" placeholder="Enter custom service..." class="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 hidden" />
                </div>`;
              }
              if (field.type === 'textarea') {
                return `<div class="mb-6">
                  <label for="${field.name}" class="block text-gray-900 font-semibold mb-2">${field.label}</label>
                  <textarea id="${field.name}" name="${field.name}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" rows="5" ${field.required ? 'required' : ''}></textarea>
                </div>`;
              }
              return `<div class="mb-6">
                <label for="${field.name}" class="block text-gray-900 font-semibold mb-2">${field.label}</label>
                <input type="${field.type}" id="${field.name}" name="${field.name}" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" ${field.required ? 'required' : ''}>
              </div>`;
            }).join('');
          })()}
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold uppercase tracking-wider transition-all">${page.form.button.text}</button>
        </form>
        
        <!-- Contact Information -->
        <div class="bg-gray-50 rounded-lg p-8">
          <h3 class="text-lg font-bold text-gray-900 mb-6">Contact Information</h3>
          
          <div class="space-y-6">
            <!-- Address -->
            <div class="flex gap-4">
              <div class="text-2xl text-gray-400 flex-shrink-0">📍</div>
              <div>
                <p class="text-gray-900 font-semibold whitespace-pre-line">${page.info.contact.address}</p>
              </div>
            </div>
            
            <!-- Email -->
            <div class="flex gap-4">
              <div class="text-2xl text-gray-400 flex-shrink-0">✉️</div>
              <div>
                <a href="mailto:${page.info.contact.email}" class="text-gray-900 hover:text-blue-600 transition-colors">${page.info.contact.email}</a>
              </div>
            </div>
            
            <!-- Phone -->
            <div class="flex gap-4">
              <div class="text-2xl text-gray-400 flex-shrink-0">📞</div>
              <div>
                <a href="tel:${page.info.contact.phone.replace(/\D/g, '')}" class="text-blue-600 hover:text-blue-700 transition-colors">${page.info.contact.phone}</a>
              </div>
            </div>
          </div>
          
          <!-- Social Links -->
          <div class="mt-8 pt-8 border-t border-gray-300">
            <p class="text-gray-600 font-semibold mb-4">Follow Us</p>
            <div class="flex gap-6 text-3xl">
              ${page.info.social ? Object.entries(page.info.social).map(([platform, url]) => {
                const iconMap = {
                  'twitter': 'bi-twitter',
                  'instagram': 'bi-instagram',
                  'facebook': 'bi-facebook',
                  'linkedin': 'bi-linkedin'
                };
                return `<a href="${url}" target="_blank" rel="noopener" class="text-gray-600 hover:text-blue-600 transition-colors"><i class="bi ${iconMap[platform] || 'bi-link'}"></i></a>`;
              }).join('') : ''}
            </div>
          </div>
        </div>
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

function openBlogModal(postId) {
  console.log(`📖 Opening blog modal for post: ${postId}`);
  
  if (!blogData || !blogData.posts) {
    console.error('❌ Blog data not loaded');
    return;
  }
  
  const post = blogData.posts.find(p => p.id === postId);
  if (!post) {
    console.error(`❌ Blog post not found: ${postId}`);
    return;
  }
  
  // Create or reuse modal
  let blogModal = document.getElementById('blogModal');
  if (!blogModal) {
    blogModal = document.createElement('div');
    blogModal.id = 'blogModal';
    document.body.appendChild(blogModal);
  }
  
  // Parse markdown content (simple converter)
  const parseMarkdown = (md) => {
    return md
      .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-4">$1</h1>')
      .replace(/^\- (.*?)$/gm, '<li class="ml-4 text-gray-700">$1</li>')
      .replace(/(\r\n|\n|\r){2,}/gm, '</p><p class="text-gray-700 mb-4">')
      .replace(/\*\*(.*?)\*\*/gm, '<strong class="font-bold">$1</strong>');
  };
  
  // Set modal content
  blogModal.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onclick="if(event.target === this) closeBlogModal()">
      <div class="bg-white rounded-lg w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start flex-shrink-0">
          <div class="flex-1 pr-4">
            <span class="bg-cyan-400 text-white px-3 py-1 rounded-full text-sm font-semibold">${post.category}</span>
            <h1 class="text-3xl font-bold text-gray-900 mt-3 mb-2">${post.title}</h1>
            <p class="text-gray-500 text-sm">${post.date} · ${post.readTime}</p>
          </div>
          <button onclick="closeBlogModal()" class="text-gray-400 hover:text-gray-600 text-2xl font-bold flex-shrink-0">×</button>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1">
          ${post.author ? `
            <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" onerror="this.style.display='none'">
              <div>
                <p class="font-semibold text-gray-900">${post.author.name}</p>
                <p class="text-sm text-gray-600">${post.author.bio}</p>
              </div>
            </div>
          ` : ''}
          
          <div class="prose prose-sm max-w-none text-gray-700">
            ${parseMarkdown(post.content)}
          </div>
          
          ${post.tags ? `
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex flex-wrap gap-2">
                ${post.tags.map(tag => `<span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">${tag}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  console.log(`✅ Blog modal opened: ${post.title}`);
}

function closeBlogModal() {
  console.log('❌ Closing blog modal');
  const blogModal = document.getElementById('blogModal');
  if (blogModal) {
    blogModal.remove();
  }
  document.body.style.overflow = 'auto';
}

// ============================================================================
// SECTION 6: ROUTING & APP INITIALIZATION
// ============================================================================

function navigate(path, event) {
  // Prevent default link behavior
  if (event) event.preventDefault();
  
  // Normalize path
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\//, '')}`;
  
  console.log(`🔀 Navigate called: ${path} → ${normalizedPath}`);
  
  // Only navigate if it's a different path
  if (window.location.pathname === normalizedPath) {
    console.log(`ℹ️ Already on this page, skipping navigation`);
    return;
  }
  
  // Update browser history and navigate
  console.log(`📍 Pushing state to history: ${normalizedPath}`);
  window.history.pushState({ path: normalizedPath }, '', normalizedPath);
  route(appData);
}

function route(data) {
  // Get page from URL path (clean URLs)
  let path = window.location.pathname;
  // Remove leading/trailing slashes and get the page name
  let page = path.replace(/^\/|\/$/g, '') || 'home';
  
  console.log(`🔗 Route function called`);
  console.log(`🔗 Current pathname: ${path}`);
  console.log(`🔗 Extracted page: ${page}`);
  const main = document.getElementById('app');
  try {
    main.innerHTML =
      renderHeader(data.global_components.header) +
      `<main class="main-content">${renderPage(page, data)}</main>` +
      renderFooter(data.global_components.footer);
    console.log(`📄 Page rendered: ${page}`);
  } catch (e) {
    console.error(`❌ Error rendering page '${page}':`, e);
  }
  
  // Add mobile menu toggle
  setupMobileMenu();
  
  // Setup page-specific features
  if (page === 'about') {
    setupServiceDropdown();
  }
  
  // Smooth scroll to top
  window.scrollTo(0, 0);
}

// ============================================================================
// SECTION 5: EVENT HANDLERS & INTERACTIVE FEATURES
// ============================================================================

function openProjectModal(link, title) {
  console.log(`🖼️ Opening project modal for: ${title}`);
  let modal = document.getElementById('projectModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'projectModal';
    modal.innerHTML = `
      <div id="projectModalBackdrop" class="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onclick="closeProjectModal(event)">
        <div class="bg-white rounded-lg w-[95vw] h-[90vh] flex flex-col" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between p-4 border-b bg-gray-50 flex-shrink-0">
            <h2 id="projectModalTitle" class="text-xl font-bold text-gray-900"></h2>
            <button onclick="closeProjectModal()" class="text-gray-900 hover:text-red-600 hover:bg-red-100 p-2 rounded-lg transition-all" title="Close">
              <i class="bi bi-x text-3xl"></i>
            </button>
          </div>
          <div class="flex-1 overflow-auto">
            <iframe id="projectIframe" src="" title="Project Preview" class="w-full h-full border-none" loading="lazy"></iframe>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  document.getElementById('projectModalTitle').textContent = title;
  document.getElementById('projectIframe').src = link;
  modal.style.display = 'flex';
  
  // Prevent body scroll and layout shift when modal opens
  document.body.style.overflow = 'hidden';
  console.log(`📺 Project modal opened for: ${title}`);
}

function closeProjectModal(event) {
  if (event && event.target.id !== 'projectModalBackdrop') return;
  const modal = document.getElementById('projectModal');
  if (modal) {
    modal.style.display = 'none';
    document.getElementById('projectIframe').src = '';
    
    // Restore body scroll when modal closes
    document.body.style.overflow = 'auto';
    console.log('🔙 Project modal closed');
  }
}

function setupServiceDropdown() {
  const dropdown = document.getElementById('serviceDropdown');
  const customInput = document.getElementById('customServiceInput');
  const submitBtn = document.getElementById('serviceSubmitBtn');
  const message = document.getElementById('serviceMessage');
  
  if (!dropdown || !submitBtn) return;
  
  dropdown.addEventListener('change', (e) => {
    console.log(`📋 Service dropdown changed: ${e.target.value}`);
    if (e.target.value === '__custom') {
      customInput.classList.remove('hidden');
      customInput.focus();
      message.innerHTML = '';
    } else {
      customInput.classList.add('hidden');
    }
  });
  
  submitBtn.addEventListener('click', () => {
    const selected = dropdown.value;
    const customValue = customInput.value.trim();
    const finalService = selected === '__custom' ? customValue : selected;
    
    if (!finalService) {
      message.innerHTML = '<span class="text-red-500">❌ Please select or enter a service</span>';
      console.warn('⚠️ No service selected or entered');
      return;
    }
    
    console.log(`✅ Service submitted: ${finalService}`);
    message.innerHTML = `<span class="text-green-500 font-semibold">✅ Thanks! We'll be in touch about "${finalService}"</span>`;
    
    // Reset form
    setTimeout(() => {
      dropdown.value = '';
      customInput.value = '';
      customInput.classList.add('hidden');
      message.innerHTML = '';
    }, 2000);
  });
}

function setupMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!menuToggle || !mobileMenu) {
    console.warn('⚠️ Mobile menu elements not found');
    return;
  }
  
  menuToggle.addEventListener('click', () => {
    const spans = menuToggle.querySelectorAll('span');
    const isOpen = mobileMenu.classList.contains('hidden');
    
    if (isOpen) {
      // Opening animation
      mobileMenu.classList.remove('hidden');
      // Trigger reflow to ensure transition plays
      void mobileMenu.offsetHeight;
      mobileMenu.classList.remove('max-h-0', 'pointer-events-none');
      mobileMenu.classList.add('max-h-96', 'pointer-events-auto');
      
      // Animate hamburger to X
      spans[0].style.transform = 'rotate(45deg) translateY(11px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-11px)';
      console.log('📂 Mobile menu opening...');
    } else {
      // Closing animation
      mobileMenu.classList.remove('max-h-96', 'pointer-events-auto');
      mobileMenu.classList.add('max-h-0', 'pointer-events-none');
      
      // Reset hamburger icon
      spans[0].style.transform = 'rotate(0) translateY(0)';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'rotate(0) translateY(0)';
      
      // Hide after transition
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
      console.log('📁 Mobile menu closing...');
    }
  });
  
  // Close menu when a link is clicked
  document.querySelectorAll('#mobileMenu .menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      console.log(`🔗 Mobile menu link clicked: ${href}`);
      
      // Trigger closing animation
      mobileMenu.classList.remove('max-h-96', 'pointer-events-auto');
      mobileMenu.classList.add('max-h-0', 'pointer-events-none');
      
      // Reset hamburger icon
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = 'rotate(0) translateY(0)';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'rotate(0) translateY(0)';
      
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 300);
    });
  });
}

async function initApp() {
  console.log('🚀 App initializing...');
  appData = await fetchAppData();
  blogData = await fetchBlogData();
  appDataHash = JSON.stringify(appData);
  console.log('🎨 Applying design system...');
  setCSSVars(appData.design.colors);
  setFonts(appData.design.fonts);
  console.log('📍 Setting up routing...');
  
  // Handle 404.html redirect for clean URLs
  if (sessionStorage.redirect) {
    const redirectPath = sessionStorage.redirect;
    console.log(`📡 Processing 404.html redirect to: ${redirectPath}`);
    delete sessionStorage.redirect;
    // Update browser history to reflect the correct URL
    window.history.replaceState({}, '', redirectPath);
  }
  
  route(appData);
  
  // Initialize FormService if FormService class is available
  if (typeof FormService !== 'undefined') {
    formService = new FormService({
      formSelector: '#contactForm',
      apiEndpoint: '/api/send-email'  // Update this to your backend endpoint
    });
    
    // Initialize form service
    await formService.init();
    console.log('✅ FormService initialized');
  } else {
    console.warn('⚠️ FormService class not found. Make sure FormService.js is loaded.');
  }
  
  // Listen for popstate (browser back/forward)
  window.addEventListener('popstate', () => {
    console.log('⏪ Browser back/forward button triggered');
    route(appData);
  });
  console.log('✅ App initialization complete');
}

// ============================================================================
// APPLICATION BOOTSTRAP
// ============================================================================

document.addEventListener('DOMContentLoaded', initApp);
