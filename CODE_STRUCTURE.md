# FTTG Solutions - Code Structure

## Overview
This is a dynamic Single Page Application (SPA) that loads all content from `json/app.json` and renders pages on the fly using vanilla JavaScript and Tailwind CSS.

## Application Structure

### Main File: `js/app.js`

The application is organized into 6 main sections:

#### SECTION 1: DATA FETCHING
- `fetchAppData()` - Fetches and parses the JSON data from `json/app.json`
- Includes error handling and cache busting

#### SECTION 2: STYLING & DESIGN SYSTEM
- `setCSSVars(colors)` - Applies color variables from design config to CSS
- `setFonts(fonts)` - Sets font families globally

#### SECTION 3: LAYOUT COMPONENTS
- `renderHeader(header)` - Renders the sticky header with navigation
- `renderFooter(footer)` - Renders the footer with links and social media

#### SECTION 4: PAGE RENDERING FUNCTIONS
- `renderHome(page)` - Home page with hero, features, portfolio showcase
- `renderServices(page)` - Services page with categories and process flow
- `renderPortfolio(page)` - Portfolio page listing all projects
- `renderAbout(page)` - About page with company info and team
- `renderBlog(page)` - Blog listing with sidebar
- `renderContact(page)` - Contact form with information

#### SECTION 5: EVENT HANDLERS
- `openProjectModal(link, title)` - Opens project preview in a modal
- `closeProjectModal(event)` - Closes the modal
- `setupServiceDropdown()` - Handles service selection on About page
- `setupContactServiceDropdown()` - Handles service dropdown in Contact form
- `setupMobileMenu()` - Toggles mobile navigation menu

#### SECTION 6: ROUTING & APP INITIALIZATION
- `route(data)` - Main router that renders pages based on URL hash
- `initApp()` - Initializes the application on page load

### JSON Configuration: `json/app.json`

All content is stored in a single JSON file with the following structure:
- **design** - Color scheme, fonts, and styling configuration
- **features** - Feature flags for functionality
- **global_components** - Header, footer, and shared components
- **pages** - All page content (home, services, portfolio, about, blog, contact)

## How It Works

1. **Initialization**: When the page loads, `DOMContentLoaded` event triggers `initApp()`
2. **Data Loading**: `fetchAppData()` retrieves content from `json/app.json`
3. **Design Application**: CSS variables and fonts are applied to the page
4. **Routing**: The `route()` function determines which page to render based on the URL hash
5. **Rendering**: Appropriate render function creates HTML and inserts it into the DOM
6. **Interactivity**: Event handlers set up for mobile menu, dropdowns, and modals

## URL Structure

- `#home` - Home page
- `#services` - Services page
- `#portfolio` - Portfolio page
- `#about` - About page
- `#blog` - Blog page
- `#contact` - Contact page

## Modular Design

The application is designed for easy maintenance:
- All content is externalized to JSON - **no hard-coded values**
- Rendering functions are clearly separated from logic
- Event handlers are organized by feature
- Each page render function is self-contained and includes all HTML

## Performance Considerations

- Single fetch of JSON data on app initialization
- Dynamic rendering prevents need for separate HTML files
- CSS is applied once at startup
- Mobile-first responsive design with Tailwind CSS

## Adding New Features

1. **New Page**: Add entry to `json/app.json` under `pages`, create `renderNewPage()` function, add route case
2. **New Component**: Create `renderComponent()` function and include it in relevant pages
3. **New Styling**: Add to design config in `json/app.json`
4. **New Interaction**: Create handler function and attach to elements in render functions

## Dependencies

- **Tailwind CSS** (CDN) - Styling framework
- **Bootstrap Icons** - Icon library
- **Vanilla JavaScript** - No frameworks required

## Browser Support

Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge)

---

For questions or modifications, refer to the specific section in `js/app.js`
