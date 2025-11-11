class TodoApp {
  constructor() {
    this.todos = [];
    this.categories = [];

    this.elements = {
      titleInput: document.querySelector('#title'),
      descInput: document.querySelector('#desc'),
      priorityInput: document.querySelector('#priority'),
      categoryInput: document.querySelector('#category'),
      categoryNameInput: document.querySelector('#categoryName'),
      titleFilter: document.querySelector('#titleFilter'),
      taskList: document.querySelector('#taskList')
    };
  }

  handleTaskSubmit(event) {
    event.preventDefault();
    const todo = {
      title: this.elements.titleInput.value,
      desc: this.elements.descInput.value,
      priority: this.elements.priorityInput.value,
      category: this.elements.categoryInput.value,
      done: false
    };
    this.todos.push(todo);
  }

  toggleTaskDone(todo) {
    todo.done = !todo.done;
  }

  async deleteTask(index) {
    const confirmed = await this.showConfirmDialog();
    if (confirmed) {
      this.todos.splice(index, 1);
    }
  }

  handleCategorySubmit(event) {
    event.preventDefault();
    const category = { name: this.elements.categoryNameInput.value };
    this.categories.push(category);
  }

  async deleteCategory(index) {
    const confirmed = await this.showConfirmDialog();
    if (confirmed) {
      const name = this.categories[index].name;
      this.categories.splice(index, 1);
      this.todos.forEach(todo => {
        if (todo.category === name) todo.category = '';
      });
    }
  }

  filterTasks() {
    const filter = this.elements.titleFilter.value.toLowerCase();
    this.elements.taskList.innerHTML = '';
    this.todos.forEach(todo => {
      if (todo.title.toLowerCase().includes(filter)) {
        const li = document.createElement('li');
        li.innerHTML = `<span class="title">${todo.title}</span>`;
        this.elements.taskList.appendChild(li);
      }
    });
  }

  async showConfirmDialog() {
    return true; // Mock für Tests
  }
}

module.exports = TodoApp;
