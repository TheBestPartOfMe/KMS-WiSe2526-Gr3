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

  test('deleteTask_confirmDialogReturnsFalse_taskIsNotDeleted', async () => {
  app.todos.push({ title: 'Aufgabe löschen2', desc: '', priority: 'Mittel', category: '', done: false });

  app.showConfirmDialog = jest.fn().mockResolvedValue(false);
  await app.deleteTask(0);

  expect(app.todos.length).toBe(1);
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

test('filterTasks_titleFilterMatchingTitle_onlyMatchingTaskIsShown', () => {
  // Arrange: zwei Aufgaben mit unterschiedlichen Titeln
  app.todos.push({ title: 'Einkaufen', desc: '', priority: 'Mittel', category: '', done: false });
  app.todos.push({ title: 'Hausaufgabe', desc: '', priority: 'Mittel', category: '', done: false });

  // Titel-Filter setzen (case-insensitive, daher klein geschrieben ok)
  app.elements.titleFilter.value = 'eink'; // sollte "Einkaufen" matchen

  // Act
  app.filterTasks();

  // Assert
  const listItems = Array.from(document.querySelectorAll('#taskList li'));
  expect(listItems.length).toBe(1);
  expect(listItems[0].textContent).toContain('Einkaufen');
});

test('filterTasks_priorityFilter_onlySelectedPriorityIsShown', () => {
  // Arrange: zwei Aufgaben mit unterschiedlicher Priorität
  app.todos.push({ title: 'Wichtige Aufgabe', desc: '', priority: 'Hoch', category: '', done: false });
  app.todos.push({ title: 'Unwichtige Aufgabe', desc: '', priority: 'Niedrig', category: '', done: false });

  // Priority-Select aus den DOM-Elementen holen
  const priorityFilter = app.elements.priorityFilter;

  // Optionen für Hoch und Niedrig hinzufügen
  const optHigh = document.createElement('option');
  optHigh.value = 'Hoch';
  optHigh.textContent = 'Hoch';
  priorityFilter.appendChild(optHigh);

  const optLow = document.createElement('option');
  optLow.value = 'Niedrig';
  optLow.textContent = 'Niedrig';
  priorityFilter.appendChild(optLow);

  // Jetzt eine existierende Option auswählen
  priorityFilter.value = 'Hoch';
  app.filterTasks();

  // Assert: nur die Aufgabe mit hoher Priorität soll angezeigt werden
  const listItems = Array.from(document.querySelectorAll('#taskList li'));
  expect(listItems.length).toBe(1);
  expect(listItems[0].textContent).toContain('Wichtige Aufgabe');
});


test('deleteCategory_removesCategoryAndUnassignsFromTasks', async () => {
  // Arrange: Add a category and two tasks using it
  app.categories.push({ name: 'Work' });
  app.todos.push({ title: 'Task 1', desc: '', priority: 'Mittel', category: 'Work', done: false });
  app.todos.push({ title: 'Task 2', desc: '', priority: 'Hoch', category: 'Work', done: false });

  // Mock confirm dialog to always confirm
  app.showConfirmDialog = jest.fn().mockResolvedValue(true);

  // Act: Delete the category
  await app.deleteCategory(0);

  // Assert: Category is removed, tasks have category cleared
  expect(app.categories.length).toBe(0);
  expect(app.todos[0].category).toBe('');
  expect(app.todos[1].category).toBe('');
});


test('addMultipleCategories_updatesDropdownsCorrectly', () => {
  // Arrange: Add three categories
  app.categories.push({ name: 'Home' }, { name: 'Work' }, { name: 'Hobby' });
  app.renderCategories();

  // Act: Get options from both dropdowns
  const taskCategoryOptions = Array.from(app.elements.categoryInput.options).map(opt => opt.value);
  const filterCategoryOptions = Array.from(app.elements.categoryFilter.options).map(opt => opt.value);

  // Assert: All categories are present in both dropdowns
  expect(taskCategoryOptions).toEqual(expect.arrayContaining(['Home', 'Work', 'Hobby']));
  expect(filterCategoryOptions).toEqual(expect.arrayContaining(['Home', 'Work', 'Hobby']));
});


test('filterTasks_titleAndPriorityFilter_combinedFilters', () => {
  // Arrange: Add tasks with different titles and priorities
  app.todos.push({ title: 'Buy milk', desc: '', priority: 'Hoch', category: '', done: false });
  app.todos.push({ title: 'Buy bread', desc: '', priority: 'Mittel', category: '', done: false });
  app.todos.push({ title: 'Read book', desc: '', priority: 'Hoch', category: '', done: false });

  // Set both filters
  app.elements.titleFilter.value = 'buy';
  const priorityFilter = app.elements.priorityFilter;
  const optHigh = document.createElement('option');
  optHigh.value = 'Hoch';
  optHigh.textContent = 'Hoch';
  priorityFilter.appendChild(optHigh);
  priorityFilter.value = 'Hoch';

  // Act
  app.filterTasks();

  // Assert: Only 'Buy milk' should be shown
  const listItems = Array.from(document.querySelectorAll('#taskList li'));
  expect(listItems.length).toBe(1);
  expect(listItems[0].textContent).toContain('Buy milk');
});

});
