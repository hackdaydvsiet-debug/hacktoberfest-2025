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
  if(svgDoc){
    // ensure SVG has an accessible title
    let titleEl = svgDoc.querySelector('title');
    if(!titleEl){
      titleEl = document.createElementNS('http://www.w3.org/2000/svg','title');
      titleEl.textContent = 'Floor 1 floorplan';
      svgDoc.insertBefore(titleEl, svgDoc.firstChild);
    }
    const titleId = 'floorplan-title';
    titleEl.id = titleId;
    svgDoc.setAttribute('aria-labelledby', titleId);
    svgDoc.setAttribute('role','img');
  }
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
  // announce to assistive tech
  infoDiv.setAttribute('aria-live','polite');
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
    li.setAttribute('role','option');
    // ensure unique id for aria-activedescendant handling
    li.id = `result-${loc.id}`;
    li.setAttribute('aria-selected','false');
    li.addEventListener('click', () => {
      showInfo(loc);
      highlightLocation(loc, true);
    });
    li.addEventListener('mouseenter', () => highlightLocation(loc,false));
    li.addEventListener('mouseleave', () => clearHighlights());
    li.tabIndex = 0;
    li.addEventListener('focus', () => {
      const idx = Array.prototype.indexOf.call(resultsList.children, li);
      highlightedIndex = idx; updateHighlightInList();
    });
    li.addEventListener('keydown', (e) => {
      if(e.key === 'Enter') { li.click(); }
    });
    resultsList.appendChild(li);
  });
}

// download sample locations JSON for contributors to edit
document.getElementById('download-data').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(locations, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'locations-sample.json'; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});


// simple fuzzy scoring: name matches weigh more, then type, then tags
function scoreMatch(q, loc){
  const t = q.toLowerCase();
  let score = 0;
  if(loc.name.toLowerCase() === t) score += 100;
  if(loc.name.toLowerCase().includes(t)) score += 50;
  if((loc.type||'').toLowerCase().includes(t)) score += 20;
  if((loc.tags||[]).join(' ').toLowerCase().includes(t)) score += 10;
  return score;
}

let currentResults = [];
let highlightedIndex = -1;

function setupSearch(){
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if(q.length===0){ currentResults = locations.slice(); renderResults(currentResults); return; }
    const scored = locations.map(l => ({l,score: scoreMatch(q,l)})).filter(x => x.score>0);
    scored.sort((a,b)=>b.score-a.score);
    currentResults = scored.map(x=>x.l);
    highlightedIndex = -1;
    renderResults(currentResults);
  });

  // keyboard navigation: up/down to move, enter to select
  searchInput.addEventListener('keydown', (e) => {
    if(currentResults.length===0) return;
    if(e.key === 'ArrowDown'){
      e.preventDefault(); highlightedIndex = Math.min(highlightedIndex+1, currentResults.length-1); updateHighlightInList();
    } else if(e.key === 'ArrowUp'){
      e.preventDefault(); highlightedIndex = Math.max(highlightedIndex-1, 0); updateHighlightInList();
    } else if(e.key === 'Enter'){
      e.preventDefault(); if(highlightedIndex>=0 && currentResults[highlightedIndex]){ const loc = currentResults[highlightedIndex]; showInfo(loc); highlightLocation(loc,true); }
    }
  });
}

function updateHighlightInList(){
  const items = resultsList.querySelectorAll('li');
  items.forEach((it, idx) => {
    if(idx === highlightedIndex){
      it.classList.add('active');
      it.setAttribute('aria-selected','true');
      resultsList.setAttribute('aria-activedescendant', it.id);
    } else {
      it.classList.remove('active');
      it.setAttribute('aria-selected','false');
    }
  });
  // keep highlighted item in view
  const active = resultsList.querySelector('li.active');
  if(active) active.scrollIntoView({block:'nearest'});
}

async function init(){
  await loadSVG();
  await loadData();
  renderResults(locations);
  renderSOS();
  // accessibility: set live regions for panels
  infoDiv.setAttribute('aria-live','polite');
  sosDiv.setAttribute('aria-live','polite');
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
