let projects = JSON.parse(localStorage.getItem('projects')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
let currentProjectId = localStorage.getItem('currentProjectId') || null;

document.addEventListener("DOMContentLoaded", function () {
    renderProjects();
    if (currentProjectId) {
        loadProject(currentProjectId);
    }
});

function renderTasks() {
    const columns = ['todo', 'in-progress', 'done'];

    columns.forEach(columnId => {
        const column = document.getElementById(columnId);
        column.querySelector('.task-container').innerHTML = '';

        if (tasks[currentProjectId]) {
            tasks[currentProjectId].forEach(task => {
                if (task.status === columnId) {
                    const taskElement = createTaskElement(task.content, task.id);
                    column.querySelector('.task-container').appendChild(taskElement);
                }
            });
        }
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
    if (tasks[currentProjectId]) {
        tasks[currentProjectId] = tasks[currentProjectId].filter(task => task.id !== taskId);
        updateLocalStorage();
        renderTasks();
    }
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
        if (!tasks[currentProjectId]) {
            tasks[currentProjectId] = [];
        }
        tasks[currentProjectId].push(newTask);
        updateLocalStorage();
        renderTasks();
        taskInput.value = "";
    }
}

function updateTaskStatus(taskId, newStatus) {
    if (tasks[currentProjectId]) {
        tasks[currentProjectId] = tasks[currentProjectId].map(task => {
            if (task.id === taskId) {
                return { ...task, status: newStatus };
            }
            return task;
        });
        updateLocalStorage();
    }
}

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('currentProjectId', currentProjectId);
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

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');

    const sidebarContent = document.querySelectorAll('.sidebar-content');
    if (sidebar.classList.contains('collapsed')) {
        sidebarContent.forEach(element => element.style.display = 'none');
    } else {
        sidebarContent.forEach(element => element.style.display = 'block');
    }
}

function createProject() {
    const projectName = prompt("Enter the project name:");
    if (projectName) {
        const newProject = {
            id: "project-" + Date.now(),
            name: projectName
        };
        projects.push(newProject);
        currentProjectId = newProject.id;
        tasks[currentProjectId] = [];
        updateLocalStorage();
        renderProjects();
        loadProject(currentProjectId);
    }
}

function renderProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';

    projects.forEach(project => {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        projectItem.innerText = project.name;
         projectItem.innerHTML = `
            <span class="project-name" onclick="loadProject('${project.id}')">${project.name}</span>
            <span class="delete-project-btn" onclick="deleteProject('${project.id}')">
                <i class="fas fa-trash-alt"></i>
            </span>`;
        projectItem.onclick = () => loadProject(project.id);
        projectList.appendChild(projectItem);
    });
}

function loadProject(projectId) {
    currentProjectId = projectId;
    renderTasks();
    updateLocalStorage();
}

function deleteProject(projectId) {
    projects = projects.filter(project => project.id !== projectId);
    delete tasks[projectId];
    if (currentProjectId === projectId) {
        currentProjectId = projects.length ? projects[0].id : null;
    }
    updateLocalStorage();
    renderProjects();
    if (currentProjectId) {
        loadProject(currentProjectId);
    } else {
        document.getElementById('todo').querySelector('.task-container').innerHTML = '';
        document.getElementById('in-progress').querySelector('.task-container').innerHTML = '';
        document.getElementById('done').querySelector('.task-container').innerHTML = '';
    }
}