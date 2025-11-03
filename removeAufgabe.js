// app.js — Hauptlogik (no demo/seed code)
(function (global) {
  const LS_KEY = "tasks";

  function loadTasks() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
    catch { return []; }
  }
  function saveTasks(tasks) {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  }

  // Minimal renderer (keine Demo-Daten hier!)
  function renderRowsInto(tbodyId = "taskTbody") {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    const tasks = loadTasks();
    tbody.innerHTML = tasks.map(t => `
      <tr data-row-id="${t.id}">
        <td>${escapeHtml(t.title)}</td>
        <td><button class="delete-btn" data-id="${t.id}">🗑️ Löschen</button></td>
      </tr>
    `).join("");
  }

  // Delete: remove from storage + DOM
  function deleteTask(id) {
    const tasks = loadTasks();
    const next = tasks.filter(t => String(t.id) !== String(id));
    saveTasks(next);

    const row = document.querySelector('tr[data-row-id="' + String(id) + '"]');
    if (row) row.remove();
  }

  // One delegated click handler for all delete buttons
  function attachDeleteHandler() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".delete-btn[data-id]");
      if (!btn) return;

      const id = btn.getAttribute("data-id");
      if (confirm("Diese Aufgabe wirklich löschen?")) {
        deleteTask(id);
      }
    });
  }

  // Simple HTML escape
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Export small API
  global.TaskApp = { loadTasks, saveTasks, renderRowsInto, deleteTask, attachDeleteHandler };
})(window);
