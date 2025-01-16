// DOM Elements
const flowContainer = document.getElementById('flowContainer');
const dynamicForm = document.getElementById('dynamicForm');

// Function: Add a new category block in Admin Panel
function addCategory() {
    const div = document.createElement('div');
    div.className = 'flow-item';
    div.innerHTML = `
        <label>Category:</label>
        <input type="text" name="category[]" required>
        <label>Subcategories (comma-separated):</label>
        <input type="text" name="subcategories[]" required>
        <label>Script:</label>
        <textarea name="scripts[]" rows="2"></textarea>
        <button type="button" class="removeCategory">Remove</button>
    `;
    flowContainer.appendChild(div);

    // Add event listener to remove button
    div.querySelector('.removeCategory').addEventListener('click', () => div.remove());
}

// Add event listener for "Add Category"
document.getElementById('addCategory').addEventListener('click', addCategory);

// Save Flow and Generate Customer Form
document.getElementById('customFlowForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const flow = [];
    const categories = formData.getAll('category[]');
    const subcategories = formData.getAll('subcategories[]');
    const scripts = formData.getAll('scripts[]');

    categories.forEach((category, index) => {
        flow.push({
            category,
            subcategories: subcategories[index].split(',').map(s => s.trim()),
            script: scripts[index],
        });
    });

    // Save flow to local storage
    localStorage.setItem('customFlow', JSON.stringify(flow));
    alert('Flow saved!');

    // Generate the dynamic form
    generateForm(flow);
});

// Load saved flow and populate Admin Panel
const savedFlow = JSON.parse(localStorage.getItem('customFlow') || '[]');
savedFlow.forEach(data => {
    addCategory();
    const lastCategory = flowContainer.lastChild;
    lastCategory.querySelector('input[name="category[]"]').value = data.category;
    lastCategory.querySelector('input[name="subcategories[]"]').value = data.subcategories.join(', ');
    lastCategory.querySelector('textarea[name="scripts[]"]').value = data.script;
});

// Generate Dynamic Form for Customer Care Team
function generateForm(flow) {
    dynamicForm.innerHTML = '';
    flow.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <label>${item.category}:</label>
            <select name="${item.category}">
                <option value="">-- Select --</option>
                ${item.subcategories.map(sub => `<option value="${sub}">${sub}</option>`).join('')}
            </select>
            <p>Script: ${item.script}</p>
        `;
        dynamicForm.appendChild(div);
    });
}

// Initial generation of the form (if flow exists)
if (savedFlow.length > 0) {
    generateForm(savedFlow);
}
