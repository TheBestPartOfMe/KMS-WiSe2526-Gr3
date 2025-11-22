const categoryNameInput = document.getElementById('categoryName');
const categoryForm = document.getElementById('categoryForm');

const categories = JSON.parse(localStorage.getItem('categories') || '[]');

function saveCategories () {
  localStorage.setItem('categories', JSON.stringify(categories));
}

categoryForm.onsubmit = e => {
  e.preventDefault();

  const name = categoryNameInput.value.trim();

  if (!name) return;

  categories.push({ name });
  saveCategories();
  categoryNameInput.value = '';

  renderCategories?.();
};
