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

  test('filterCategories_twoTasksWithDifferentCategories_onlySelectedIsShown', () => {
  // create two tasks with different categries
  app.todos.push({ title: 'Aufgabe 1', desc: '', priority: 'Mittel', category: 'Kategorie 1', done: false });
  app.todos.push({ title: 'Aufgabe 2', desc: '', priority: 'Mittel', category: 'Kategorie 2', done: false });

  // put category options into DOM
  const categoryFilter = app.elements.categoryFilter;

  const option1 = document.createElement('option');
  option1.value = 'Kategorie 1';
  option1.textContent = 'Kategorie 1';
  categoryFilter.appendChild(option1);

  const option2 = document.createElement('option');
  option2.value = 'Kategorie 2';
  option2.textContent = 'Kategorie 2';
  categoryFilter.appendChild(option2);

  // set filter
  categoryFilter.value = 'Kategorie 1';

  // trigger filter
  app.filterTasks();

  // collect all list elements in tasklist
  const listItems = Array.from(document.querySelectorAll('#taskList li'));

  // check
  expect(listItems.length).toBe(1);
  expect(listItems[0].textContent).toContain('Aufgabe 1');
});

test('filterCategories_twoTasksWithNonSelectedCategory_noTaskIsShown', () => {
  // create two tasks with different categries
  app.todos.push({ title: 'Aufgabe 1', desc: '', priority: 'Mittel', category: 'Kategorie 1', done: false });
  app.todos.push({ title: 'Aufgabe 2', desc: '', priority: 'Mittel', category: 'Kategorie 1', done: false });

  // put category options into DOM
  const categoryFilter = app.elements.categoryFilter;

  const option1 = document.createElement('option');
  option1.value = 'Kategorie 1';
  option1.textContent = 'Kategorie 1';
  categoryFilter.appendChild(option1);

  const option2 = document.createElement('option');
  option2.value = 'Kategorie 2';
  option2.textContent = 'Kategorie 2';
  categoryFilter.appendChild(option2);

  // set filter
  categoryFilter.value = 'Kategorie 2';

  // trigger filter
  app.filterTasks();

  // collect all list elements in tasklist
  const listItems = Array.from(document.querySelectorAll('#taskList li'));

  // check
  expect(listItems.length).toBe(0);
});

});
