const mapRoot = document.getElementById('map');
const resultsList = document.getElementById('results');
const searchInput = document.getElementById('search');
const infoDiv = document.getElementById('info');
const sosDiv = document.getElementById('sos-contacts');

let locations = [];
let contacts = [];
let svgDoc = null;

async function loadSVG() {
  const res = await fetch('assets/floor1.svg');
  const text = await res.text();
  mapRoot.innerHTML = text;
  svgDoc = mapRoot.querySelector('svg');
}

async function loadData() {
  const [locRes, sosRes] = await Promise.all([
    fetch('data/locations.json'),
    fetch('data/emergency.json')
  ]);
  locations = await locRes.json();
  contacts = await sosRes.json();
}

function renderSOS() {
  sosDiv.innerHTML = '';
  contacts.forEach(c => {
    const el = document.createElement('div');
    el.className = 'contact';
    el.innerHTML = `<b>${c.type}</b>${c.name} — <a href="tel:${c.phone}">${c.phone}</a><div>${c.notes||''}</div>`;
    sosDiv.appendChild(el);
  });
}

function showInfo(loc) {
  infoDiv.innerHTML = `<h3>${loc.name}</h3><div>${loc.type}</div><p>${loc.desc||''}</p><div class="access-badge">Accessibility: ${loc.accessibility||'n/a'}</div>`;
}

function clearHighlights() {
  if(!svgDoc) return;
  locations.forEach(l => {
    const el = svgDoc.getElementById(l.svgId);
    if(el) {
      el.classList.remove('room-highlight','room-selected');
    }
  });
}

function highlightLocation(loc, selected=false) {
  if(!svgDoc) return;
  clearHighlights();
  const el = svgDoc.getElementById(loc.svgId);
  if(el) {
    el.classList.add(selected? 'room-selected' : 'room-highlight');
    // scroll into view only if the SVG is larger than container
    el.scrollIntoView({behavior:'smooth',block:'center',inline:'center'});
  }
}

function renderResults(list) {
  resultsList.innerHTML = '';
  if(list.length===0){
    resultsList.innerHTML = '<li>No matches</li>';
    return;
  }
  list.forEach(loc => {
    const li = document.createElement('li');
    li.textContent = `${loc.name} — ${loc.type}`;
    li.addEventListener('click', () => {
      showInfo(loc);
      highlightLocation(loc, true);
    });
    li.addEventListener('mouseenter', () => highlightLocation(loc,false));
    li.addEventListener('mouseleave', () => clearHighlights());
    resultsList.appendChild(li);
  });
}

function fuzzyMatch(q, loc){
  const t = q.toLowerCase();
  return loc.name.toLowerCase().includes(t) || (loc.type||'').toLowerCase().includes(t) || (loc.tags||[]).join(' ').toLowerCase().includes(t);
}

function setupSearch(){
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if(q.length===0){ renderResults(locations); return; }
    const matches = locations.filter(l => fuzzyMatch(q,l));
    renderResults(matches);
  });
}

async function init(){
  await loadSVG();
  await loadData();
  renderResults(locations);
  renderSOS();
  setupSearch();
  // attach click handlers to svg elements to show info
  if(svgDoc){
    locations.forEach(l => {
      const el = svgDoc.getElementById(l.svgId);
      if(el) el.addEventListener('click', () => { showInfo(l); highlightLocation(l,true); });
    });
  }
}

init().catch(err => {
  console.error(err);
  document.getElementById('map').textContent = 'Failed to load map';
});
