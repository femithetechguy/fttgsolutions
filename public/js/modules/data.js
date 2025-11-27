// Data fetching module
const APP_JSON_PATH = 'json/app.json';
let appData = null;

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
