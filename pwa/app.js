(function () {
  'use strict';

  const STORAGE_KEY = 'calories-intake';

  function getTodayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  function getEntries(dateKey) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : {};
      return Array.isArray(data[dateKey]) ? data[dateKey] : [];
    } catch (_) {
      return [];
    }
  }

  function appendEntry(dateKey, entry) {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    if (!Array.isArray(data[dateKey])) data[dateKey] = [];
    data[dateKey].push({ calories: entry.calories, protein: entry.protein ?? 0 });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function renderDashboard() {
    const todayKey = getTodayKey();
    const entries = getEntries(todayKey);
    const totalCal = entries.reduce((s, e) => s + (e.calories || 0), 0);
    const totalPro = entries.reduce((s, e) => s + (e.protein || 0), 0);

    const dateEl = document.getElementById('today-date');
    const calEl = document.getElementById('total-calories');
    const proEl = document.getElementById('total-protein');
    const listEl = document.getElementById('entries-list');

    if (dateEl) dateEl.textContent = todayKey;
    if (calEl) calEl.innerHTML = totalCal + ' <span class="unit">cal</span>';
    if (proEl) proEl.innerHTML = totalPro + ' <span class="unit">g protein</span>';

    if (listEl) {
      listEl.textContent = '';
      entries.forEach(function (e) {
        const div = document.createElement('div');
        div.className = 'entry-item';
        div.innerHTML = '<span class="calories">' + (e.calories || 0) + ' cal</span><span class="protein">' + (e.protein ?? 0) + ' g protein</span>';
        listEl.appendChild(div);
      });
    }
  }

  function openModal() {
    var overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
      overlay.setAttribute('aria-hidden', 'false');
      document.getElementById('input-calories').focus();
    }
  }

  function closeModal() {
    var overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
    }
    var form = document.getElementById('add-entry-form');
    if (form) form.reset();
  }

  function setupUI() {
    renderDashboard();

    var fab = document.getElementById('fab-add');
    if (fab) fab.addEventListener('click', openModal);

    var cancelBtn = document.getElementById('btn-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    var form = document.getElementById('add-entry-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var calInput = document.getElementById('input-calories');
        var proInput = document.getElementById('input-protein');
        var cal = parseInt(calInput.value, 10);
        var pro = proInput.value === '' ? 0 : parseInt(proInput.value, 10);
        if (isNaN(cal) || cal <= 0) return;
        if (isNaN(pro) || pro < 0) return;
        appendEntry(getTodayKey(), { calories: cal, protein: pro });
        renderDashboard();
        closeModal();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupUI);
  } else {
    setupUI();
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  }
})();
