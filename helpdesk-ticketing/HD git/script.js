// Storage keys
const STORAGE_KEY_TICKETS = 'helpdeskTickets';
const STORAGE_KEY_ROLE = 'helpdeskRole';

// Role
let currentRole = loadRole();

// Timer
let slaIntervalId = null;

// DOM references
const roleToggleEl = document.getElementById('roleToggle');
const activeRoleBadgeEl = document.getElementById('activeRole');
const formEl = document.getElementById('ticketForm');
const ticketsContainerEl = document.getElementById('ticketsContainer');
const emptyStateEl = document.getElementById('emptyState');
const clearAllBtn = document.getElementById('clearAll');

const filterCategoryEl = document.getElementById('filterCategory');
const filterStatusEl = document.getElementById('filterStatus');
const filterPriorityEl = document.getElementById('filterPriority');
const searchTextEl = document.getElementById('searchText');
const sortByEl = document.getElementById('sortBy');

const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFileEl = document.getElementById('importFile');

const bulkBarEl = document.querySelector('.bulk-actions');
const bulkCountEl = document.getElementById('bulkCount');
const bulkStatusEl = document.getElementById('bulkStatus');
const applyBulkBtn = document.getElementById('applyBulk');

const STORAGE_KEY_SORT = 'helpdeskSortBy';
let selectedIds = new Set();

// Utilities
function loadTickets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_TICKETS)) || [];
  } catch (_) {
    return [];
  }
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY_TICKETS, JSON.stringify(tickets));
}

function loadRole() {
  const saved = localStorage.getItem(STORAGE_KEY_ROLE);
  return saved === 'Admin' ? 'Admin' : 'User';
}

function saveRole(role) {
  localStorage.setItem(STORAGE_KEY_ROLE, role);
}

function generateId() {
  const rand = Math.random().toString(36).slice(2, 8);
  return `T-${Date.now()}-${rand}`;
}

function formatRemaining(ms) {
  const sign = ms < 0 ? '-' : '';
  const t = Math.abs(ms);
  const totalSeconds = Math.floor(t / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${sign}${hh}:${mm}:${ss}`;
}

function now() { return Date.now(); }

// Core actions
function createTicket(data) {
  const createdAt = now();
  const slaHours = Number(data.slaHours) || 24;
  const dueAt = createdAt + slaHours * 60 * 60 * 1000;
  const ticket = {
    id: generateId(),
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    priority: data.priority,
    status: 'Open',
    slaHours,
    createdAt,
    dueAt,
    assignedTo: '',
    escalated: false,
    history: [
      { action: 'Ticket created', at: createdAt }
    ]
  };

  const tickets = loadTickets();
  tickets.unshift(ticket);
  saveTickets(tickets);
  renderTickets();
}

function updateStatus(ticketId, newStatus) {
  const tickets = loadTickets();
  const t = tickets.find(x => x.id === ticketId);
  if (!t) return;
  if (t.status === newStatus) return;
  t.status = newStatus;
  t.history.push({ action: `Status changed to ${newStatus}`, at: now() });
  if (newStatus !== 'Escalated') {
    t.escalated = false; // allow future escalations only if status moves away from Escalated
  }
  saveTickets(tickets);
  renderTickets();
}

function assignTicket(ticketId, person) {
  const value = (person || '').trim();
  if (!value) return;
  const tickets = loadTickets();
  const t = tickets.find(x => x.id === ticketId);
  if (!t) return;
  t.assignedTo = value;
  t.history.push({ action: `Assigned to ${value}`, at: now() });
  saveTickets(tickets);
  renderTickets();
}

function deleteTicket(ticketId) {
  const tickets = loadTickets();
  const next = tickets.filter(x => x.id !== ticketId);
  saveTickets(next);
  renderTickets();
}

function clearAllTickets() {
  saveTickets([]);
  renderTickets();
}

// Rendering
function renderTickets() {
  let tickets = loadTickets();

  // Filters
  const fc = (filterCategoryEl && filterCategoryEl.value) || '';
  const fs = (filterStatusEl && filterStatusEl.value) || '';
  const fp = (filterPriorityEl && filterPriorityEl.value) || '';
  const q = (searchTextEl && searchTextEl.value.trim().toLowerCase()) || '';

  let filtered = tickets.filter(t => {
    const categoryOk = !fc || t.category === fc;
    const statusOk = !fs || t.status === fs;
    const priorityOk = !fp || t.priority === fp;
    const text = `${t.title} ${t.description}`.toLowerCase();
    const searchOk = !q || text.includes(q);
    return categoryOk && statusOk && priorityOk && searchOk;
  });

  // Sorting
  const sortBy = (sortByEl && sortByEl.value) || localStorage.getItem(STORAGE_KEY_SORT) || 'created_desc';
  if (sortByEl && !sortByEl.value) sortByEl.value = sortBy;
  const priorityRank = { Critical: 4, High: 3, Medium: 2, Low: 1 };
  filtered = filtered.slice().sort((a,b) => {
    if (sortBy === 'created_asc') return a.createdAt - b.createdAt;
    if (sortBy === 'created_desc') return b.createdAt - a.createdAt;
    if (sortBy === 'sla_asc') return (a.dueAt - now()) - (b.dueAt - now());
    if (sortBy === 'sla_desc') return (b.dueAt - now()) - (a.dueAt - now());
    if (sortBy === 'priority_desc') return (priorityRank[b.priority]||0) - (priorityRank[a.priority]||0);
    if (sortBy === 'priority_asc') return (priorityRank[a.priority]||0) - (priorityRank[b.priority]||0);
    return 0;
  });

  ticketsContainerEl.innerHTML = '';
  emptyStateEl.classList.toggle('hidden', filtered.length !== 0);

  for (const t of filtered) {
    const card = document.createElement('div');
    card.className = 'ticket-card';
    card.dataset.id = t.id;

    const priorityClass = {
      Low: 'priority-low',
      Medium: 'priority-medium',
      High: 'priority-high',
      Critical: 'priority-critical'
    }[t.priority] || '';

    const remainingMs = t.dueAt - now();
    const isOverdue = remainingMs < 0;

    card.innerHTML = `
      <div class="ticket-header">
        <div class="ticket-select">
          <input type="checkbox" class="select-ticket" data-id="${t.id}" ${selectedIds.has(t.id) ? 'checked' : ''} ${currentRole !== 'Admin' ? 'disabled' : ''} />
          <h3 class="ticket-title" data-field="title" data-id="${t.id}">${escapeHtml(t.title)}</h3>
        </div>
        <div class="badges">
          <span class="badge ${priorityClass}">Priority: ${t.priority}</span>
          <span class="badge">Category: ${t.category}</span>
          <span class="badge status">Status: <strong>${t.status}</strong></span>
          ${isOverdue ? '<span class="badge overdue">OVERDUE</span>' : ''}
        </div>
      </div>
      <p class="ticket-desc" data-field="description" data-id="${t.id}">${escapeHtml(t.description)}</p>
      <div class="ticket-meta">
        <div class="left">
          <span class="countdown" data-countdown="${t.id}">${formatRemaining(remainingMs)} left</span>
          <span class="assigned">${t.assignedTo ? `• Assigned to ${escapeHtml(t.assignedTo)}` : '• Unassigned'}</span>
        </div>
        <div class="right">
          <button class="history-toggle" data-action="toggle-history" data-id="${t.id}">View History</button>
        </div>
      </div>
      <div class="ticket-actions" data-admin-only>
        <button class="btn small" data-action="assign" data-id="${t.id}">Assign</button>
        <select data-action="change-status" data-id="${t.id}">
          ${['Open','In Progress','Resolved','Closed','Escalated'].map(s => `<option ${s===t.status?'selected':''}>${s}</option>`).join('')}
        </select>
        <button class="btn small edit" data-action="edit" data-id="${t.id}">Edit</button>
        <button class="btn small save hidden" data-action="save-edit" data-id="${t.id}">Save</button>
        <button class="btn small cancel hidden" data-action="cancel-edit" data-id="${t.id}">Cancel</button>
        <button class="btn small danger" data-action="delete" data-id="${t.id}">Delete</button>
      </div>
      <div class="history" id="history-${t.id}">
        <ul>
          ${t.history.map(h => `<li>${formatDateTime(h.at)} — ${escapeHtml(h.action)}</li>`).join('')}
        </ul>
      </div>
    `;

    ticketsContainerEl.appendChild(card);
  }

  applyRolePermissions();
  updateBulkBar();
}

function applyRolePermissions() {
  const adminControls = document.querySelectorAll('[data-admin-only]');
  adminControls.forEach(el => {
    el.style.display = currentRole === 'Admin' ? 'flex' : 'none';
  });
  activeRoleBadgeEl.textContent = `${currentRole} Mode`;
  if (roleToggleEl) roleToggleEl.checked = currentRole === 'Admin';
  // Bulk bar visibility mirrors admin rights
  if (bulkBarEl) bulkBarEl.style.display = currentRole === 'Admin' ? 'flex' : 'none';
}

// SLA timers
function updateSLATimers() {
  const tickets = loadTickets();
  let mutated = false;
  const nowTs = now();

  for (const t of tickets) {
    const remaining = t.dueAt - nowTs;
    const el = document.querySelector(`[data-countdown="${t.id}"]`);
    if (el) {
      el.textContent = `${formatRemaining(remaining)} left`;
    }
    if (remaining < 0 && t.status !== 'Resolved' && t.status !== 'Closed' && t.status !== 'Escalated') {
      t.status = 'Escalated';
      t.escalated = true;
      t.history.push({ action: 'Auto-escalated: SLA breached', at: nowTs });
      mutated = true;
    }
  }

  if (mutated) {
    saveTickets(tickets);
    renderTickets();
  } else {
    // If no mutation, still update OVERDUE badges visibility
    const all = document.querySelectorAll('.ticket-card');
    all.forEach(card => {
      const id = card.dataset.id;
      const t = tickets.find(x => x.id === id);
      if (!t) return;
      const overdueNow = t.dueAt - nowTs < 0;
      const has = card.querySelector('.badge.overdue');
      if (overdueNow && !has) {
        const badges = card.querySelector('.badges');
        if (badges) {
          const span = document.createElement('span');
          span.className = 'badge overdue';
          span.textContent = 'OVERDUE';
          badges.appendChild(span);
        }
      }
    });
  }
}

// Helpers
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDateTime(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

// Event wiring
document.addEventListener('DOMContentLoaded', () => {
  // Initialize role UI
  applyRolePermissions();
  if (roleToggleEl) {
    roleToggleEl.addEventListener('change', () => {
      currentRole = roleToggleEl.checked ? 'Admin' : 'User';
      saveRole(currentRole);
      applyRolePermissions();
    });
  }

  // Form submission
  if (formEl) {
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(formEl);
      const title = String(fd.get('title') || '').trim();
      const description = String(fd.get('description') || '').trim();
      if (!title || !description) return;
      createTicket({
        title,
        description,
        category: String(fd.get('category') || 'Other'),
        priority: String(fd.get('priority') || 'Low'),
        slaHours: Number(fd.get('slaHours') || 24)
      });
      formEl.reset();
      document.getElementById('slaHours').value = 24;
    });
  }

  // Filters
  [filterCategoryEl, filterStatusEl, filterPriorityEl, searchTextEl, sortByEl].forEach(el => {
    if (!el) return;
    const evt = el.tagName === 'INPUT' ? 'input' : 'change';
    el.addEventListener(evt, () => {
      if (el === sortByEl) {
        localStorage.setItem(STORAGE_KEY_SORT, sortByEl.value);
      }
      renderTickets();
    });
  });

  // Clear all
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (currentRole !== 'Admin') return;
      const go = confirm('Delete ALL tickets? This cannot be undone.');
      if (go) clearAllTickets();
    });
  }

  // Delegated actions on tickets container
  if (ticketsContainerEl) {
    ticketsContainerEl.addEventListener('click', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');
      if (!action || !id) {
        // handle history toggle on nested text
        const closestToggle = target.closest('[data-action="toggle-history"]');
        if (closestToggle) {
          const tid = closestToggle.getAttribute('data-id');
          toggleHistory(tid);
        }
        // handle selecting checkbox via click bubble
        const cb = target.closest('.select-ticket');
        if (cb && cb.getAttribute('data-id')) {
          const tid = cb.getAttribute('data-id');
          const checked = cb.checked;
          if (checked) selectedIds.add(tid); else selectedIds.delete(tid);
          updateBulkBar();
        }
        return;
      }

      if (action === 'assign') {
        if (currentRole !== 'Admin') return;
        const person = prompt('Assign to (name):');
        assignTicket(id, person || '');
      }
      if (action === 'delete') {
        if (currentRole !== 'Admin') return;
        const go = confirm('Delete this ticket?');
        if (go) deleteTicket(id);
      }
      if (action === 'toggle-history') {
        toggleHistory(id);
      }
      if (action === 'edit') {
        if (currentRole !== 'Admin') return;
        enterEditMode(id);
      }
      if (action === 'save-edit') {
        if (currentRole !== 'Admin') return;
        saveEdit(id);
      }
      if (action === 'cancel-edit') {
        if (currentRole !== 'Admin') return;
        exitEditMode(id, true);
      }
    });

    ticketsContainerEl.addEventListener('change', (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const action = target.getAttribute('data-action');
      const id = target.getAttribute('data-id');
      if (action === 'change-status' && id) {
        if (currentRole !== 'Admin') return;
        const select = target;
        const newStatus = select.value;
        updateStatus(id, newStatus);
      }
      // selection via change event
      if (target.classList.contains('select-ticket')) {
        const tid = target.getAttribute('data-id');
        if (target.checked) selectedIds.add(tid); else selectedIds.delete(tid);
        updateBulkBar();
      }
    });
  }

  // First render
  renderTickets();

  // SLA interval (every minute)
  updateSLATimers();
  if (slaIntervalId) clearInterval(slaIntervalId);
  slaIntervalId = setInterval(updateSLATimers, 60 * 1000);

  // Export/Import
  if (exportBtn) exportBtn.addEventListener('click', exportTickets);
  if (importBtn && importFileEl) {
    importBtn.addEventListener('click', () => importFileEl.click());
    importFileEl.addEventListener('change', handleImportFile);
  }

  // Bulk actions
  if (applyBulkBtn && bulkStatusEl) {
    applyBulkBtn.addEventListener('click', () => {
      if (currentRole !== 'Admin') return;
      const status = bulkStatusEl.value;
      if (!status) return;
      const tickets = loadTickets();
      let changed = false;
      tickets.forEach(t => {
        if (selectedIds.has(t.id) && t.status !== status) {
          t.status = status;
          t.history.push({ action: `Status changed to ${status} (bulk)`, at: now() });
          changed = true;
        }
      });
      if (changed) {
        saveTickets(tickets);
        renderTickets();
      }
    });
  }
});

function toggleHistory(ticketId) {
  const el = document.getElementById(`history-${ticketId}`);
  if (!el) return;
  const visible = getComputedStyle(el).display !== 'none';
  el.style.display = visible ? 'none' : 'block';
}

// Inline edit helpers
function enterEditMode(ticketId) {
  const card = document.querySelector(`.ticket-card[data-id="${ticketId}"]`);
  if (!card) return;
  const titleEl = card.querySelector('[data-field="title"]');
  const descEl = card.querySelector('[data-field="description"]');
  const editBtn = card.querySelector('[data-action="edit"]');
  const saveBtn = card.querySelector('[data-action="save-edit"]');
  const cancelBtn = card.querySelector('[data-action="cancel-edit"]');
  if (titleEl && descEl) {
    titleEl.contentEditable = 'true';
    descEl.contentEditable = 'true';
    titleEl.focus();
  }
  if (editBtn && saveBtn && cancelBtn) {
    editBtn.classList.add('hidden');
    saveBtn.classList.remove('hidden');
    cancelBtn.classList.remove('hidden');
  }
}

function exitEditMode(ticketId, revert) {
  const card = document.querySelector(`.ticket-card[data-id="${ticketId}"]`);
  if (!card) return;
  const titleEl = card.querySelector('[data-field="title"]');
  const descEl = card.querySelector('[data-field="description"]');
  const editBtn = card.querySelector('[data-action="edit"]');
  const saveBtn = card.querySelector('[data-action="save-edit"]');
  const cancelBtn = card.querySelector('[data-action="cancel-edit"]');
  if (titleEl && descEl) {
    titleEl.contentEditable = 'false';
    descEl.contentEditable = 'false';
    if (revert) {
      // reload from storage
      const t = loadTickets().find(x => x.id === ticketId);
      if (t) {
        titleEl.textContent = t.title;
        descEl.textContent = t.description;
      }
    }
  }
  if (editBtn && saveBtn && cancelBtn) {
    editBtn.classList.remove('hidden');
    saveBtn.classList.add('hidden');
    cancelBtn.classList.add('hidden');
  }
}

function saveEdit(ticketId) {
  const card = document.querySelector(`.ticket-card[data-id="${ticketId}"]`);
  if (!card) return;
  const titleEl = card.querySelector('[data-field="title"]');
  const descEl = card.querySelector('[data-field="description"]');
  const newTitle = (titleEl && titleEl.textContent || '').trim();
  const newDesc = (descEl && descEl.textContent || '').trim();
  if (!newTitle || !newDesc) { alert('Title and description cannot be empty.'); return; }
  const tickets = loadTickets();
  const t = tickets.find(x => x.id === ticketId);
  if (!t) return;
  if (t.title !== newTitle) t.history.push({ action: `Title edited`, at: now() });
  if (t.description !== newDesc) t.history.push({ action: `Description edited`, at: now() });
  t.title = newTitle;
  t.description = newDesc;
  saveTickets(tickets);
  exitEditMode(ticketId, false);
  renderTickets();
}

// Export / Import
function exportTickets() {
  const tickets = loadTickets();
  const blob = new Blob([JSON.stringify(tickets, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `helpdesk-tickets-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function handleImportFile(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error('Invalid file format');
      const existing = loadTickets();
      const map = new Map(existing.map(t => [t.id, t]));
      let imported = 0;
      data.forEach(obj => {
        if (!obj || typeof obj !== 'object') return;
        if (!obj.id) obj.id = generateId();
        obj.createdAt = Number(obj.createdAt || now());
        obj.slaHours = Number(obj.slaHours || 24);
        obj.dueAt = Number(obj.dueAt || (obj.createdAt + obj.slaHours*3600*1000));
        obj.title = String(obj.title || 'Untitled');
        obj.description = String(obj.description || '');
        obj.category = String(obj.category || 'Other');
        obj.priority = String(obj.priority || 'Low');
        obj.status = String(obj.status || 'Open');
        obj.assignedTo = String(obj.assignedTo || '');
        obj.escalated = Boolean(obj.escalated);
        obj.history = Array.isArray(obj.history) ? obj.history : [];
        map.set(obj.id, obj);
        imported += 1;
      });
      const merged = Array.from(map.values()).sort((a,b) => b.createdAt - a.createdAt);
      saveTickets(merged);
      renderTickets();
      alert(`Imported ${imported} tickets.`);
    } catch (err) {
      alert('Failed to import: ' + err.message);
    } finally {
      importFileEl.value = '';
    }
  };
  reader.readAsText(file);
}

function updateBulkBar() {
  if (!bulkBarEl || !bulkCountEl) return;
  bulkCountEl.textContent = `${selectedIds.size} selected`;
}


