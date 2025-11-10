function render() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = `${todo.title} (${todo.priority})`;

    const desc = document.createElement('div');
    desc.className = 'desc';
    desc.textContent = todo.desc;

    const actions = document.createElement('div');
    actions.className = 'actions';
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Löschen";
    deleteBtn.onclick = () => {
      todos = todos.filter(t => t.title !== todo.title);
      save();
      render();
    };
    actions.appendChild(deleteBtn); 

    li.appendChild(title);
    li.appendChild(desc);
    li.appendChild(actions);
    list.appendChild(li);
  });
}
