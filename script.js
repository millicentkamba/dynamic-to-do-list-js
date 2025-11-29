// script.js
document.addEventListener('DOMContentLoaded', function() {

    // Select DOM elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // In-memory tasks array (keeps sync with localStorage)
    let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    /**
     * Adds a task to the DOM and optionally saves it to localStorage.
     * If taskText is not provided, it will read from the input field.
     * @param {string} [taskTextArg] - The task text to add.
     * @param {boolean} [save=true] - Whether to save this addition to localStorage.
     */
    function addTask(taskTextArg, save = true) {
        // Determine the task text source
        const taskText = (typeof taskTextArg === 'string') ? taskTextArg.trim() : taskInput.value.trim();

        // If there's no text (and this call originated from the UI), alert and stop
        if (taskText === "") {
            // Only alert if the call was initiated from user input (no arg provided)
            if (typeof taskTextArg !== 'string') {
                alert("Please enter a task.");
            }
            return;
        }

        // Create a new li element and set its text
        const li = document.createElement('li');
        li.textContent = taskText;

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = "Remove";
        removeBtn.classList.add('remove-btn'); // use classList.add as requested

        // Remove task when clicked: remove from DOM and update localStorage/tasks array
        removeBtn.onclick = function() {
            // Remove from DOM
            taskList.removeChild(li);

            // Remove one occurrence of this task from tasks array (first match)
            const index = tasks.indexOf(taskText);
            if (index > -1) {
                tasks.splice(index, 1);
                localStorage.setItem('tasks', JSON.stringify(tasks));
            }
        };

        // Append remove button to the li, then li to ul
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // If requested, save the new task to localStorage and update tasks array
        if (save) {
            tasks.push(taskText);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        // Clear the input field if the task was added from the input
        if (typeof taskTextArg !== 'string') {
            taskInput.value = "";
        }
    }

    /**
     * Loads tasks from localStorage and populates the task list in the DOM.
     * Uses addTask(taskText, false) to avoid double-saving.
     */
    function loadTasks() {
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        // Ensure in-memory tasks matches stored tasks
        tasks = storedTasks.slice();

        storedTasks.forEach(taskText => {
            addTask(taskText, false); // false => do not save again to localStorage
        });
    }

    // Attach event listeners as requested

    // Add task on button click
    addButton.addEventListener('click', addTask);

    // Add task when pressing Enter key inside input
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Load tasks from localStorage on startup
    loadTasks();
});


