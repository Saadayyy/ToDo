let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

document.addEventListener("DOMContentLoaded", function () {
    renderTasks();
});

function renderTasks() {
    const columns = ['todo', 'in-progress', 'done'];

    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        column.querySelector('.task-container').innerHTML = '';

        tasks.forEach(task => {
            if (task.status === columnId) {
                const taskElement = createTaskElement(task.content, task.id);
                column.querySelector('.task-container').appendChild(taskElement);
            }
        });
    });
}

function createTaskElement(content, id) {
    const taskId = id;
    const task = document.createElement("div");
    task.id = taskId;
    task.className = "task";
    task.draggable = true;
    task.innerHTML = `
        <span class="task-content">${content}</span>
        <span class="delete-btn" onclick="deleteTask('${taskId}')">
            <i class="fas fa-trash-alt"></i>
        </span>`;
    task.addEventListener("dragstart", drag);
    return task;
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    updateLocalStorage();
    renderTasks();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function drop(event, columnId) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    if (draggedElement) {
        const taskStatus = columnId;
        updateTaskStatus(data, taskStatus);
        event.target.querySelector('.task-container').appendChild(draggedElement);
    }
}

function capitalizeInput(input) {
    input.value = input.value.toUpperCase();
}

function addTask(columnId) {
    const taskInput = document.getElementById('taskInput');
    const taskContent = taskInput.value.trim();
    if (taskContent !== "") {
        const newTask = {
            id: "task-" + Date.now(),
            content: taskContent,
            status: columnId
        };
        tasks.push(newTask);
        updateLocalStorage();
        renderTasks();
        taskInput.value = "";
    }
}

function updateTaskStatus(taskId, newStatus) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, status: newStatus };
        }
        return task;
    });
    updateLocalStorage();
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.getElementById('start-virtual-mouse').addEventListener('click', () => {
    fetch('/start-virtual-mouse', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                console.log('Virtual mouse started');
            } else {
                console.error('Failed to start virtual mouse');
            }
        })
        .catch(error => console.error('Error:', error));
});

document.getElementById('stop-virtual-mouse').addEventListener('click', () => {
    fetch('/stop-virtual-mouse', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                console.log('Virtual mouse stopped');
            } else {
                console.error('Failed to stop virtual mouse');
            }
        })
        .catch(error => console.error('Error:', error));
});
