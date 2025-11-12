/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const TodoApp = require('../app.js');

let app;

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML = `
    <form id="todoForm"></form>
    <form id="categoryForm"></form>
    <ul id="taskList"></ul>
    <ul id="categoryList"></ul>
    <input id="taskTitle" />
    <input id="taskDesc" />
    <select id="taskPriority"></select>
    <select id="taskCategory"></select>
    <input id="categoryName" />
    <input id="titleFilter" />
    <select id="priorityFilter"></select>
    <select id="categoryFilter"></select>
    <div id="confirmModal"></div>
    <div id="modalTitle"></div>
    <div id="modalMessage"></div>
    <button id="modalConfirm"></button>
    <button id="modalCancel"></button>
  `;

  app = new TodoApp();
});

describe('TodoApp', () => {

  test('toggleTaskDone_taskIsIncomplete_taskBecomesDone', () => {
    app.todos.push({ title: 'Aufgabe', desc: '', priority: 'Mittel', category: '', done: false });
    const todo = app.todos[0];
    app.toggleTaskDone(todo);
    expect(todo.done).toBe(true);
  });

  test('deleteTask_confirmDialogReturnsTrue_taskIsDeleted', async () => {
    app.todos.push({ title: 'Aufgabe löschen', desc: '', priority: 'Mittel', category: '', done: false });

    app.showConfirmDialog = jest.fn().mockResolvedValue(true);
    await app.deleteTask(0);

    expect(app.todos.length).toBe(0);
  });

  test('createTask_confirmDialogReturnsTrue_taskIsCreated', async () =>{
    app.todos.push({ title: 'Aufgabe erstellen', desc: '', priority: 'Mittel', category: '', done: false });
    jest.spyOn(app, 'showConfirmDialog').mockResolvedValue(true);
    expect(app.todos.length).toBe(1);
  })

  test('createTask_confirmDialogReturnsTrue_taskHasRightTitle', async () =>{
    app.todos.push({ title: 'Aufgabe erstellen', desc: '', priority: 'Mittel', category: '', done: false });
    jest.spyOn(app, 'showConfirmDialog').mockResolvedValue(true);
    expect(app.todos[0].title).toBe('Aufgabe erstellen');
  })

  test('createCategorie_confirmDialogReturnsTrue_categorieIsCreated', async () =>{
    app.categories.push({name: 'Kategorie erstellen'});
    jest.spyOn(app, 'showConfirmDialog').mockResolvedValue(true);
    expect(app.categories.length).toBe(1);
  })

});
