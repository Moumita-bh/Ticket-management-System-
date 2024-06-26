document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:3000/tickets';

    // Fetch and display tasks
    function fetchTasks() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const tasksTableBody = document.querySelector('#tasksTable tbody');
                tasksTableBody.innerHTML = '';
                data.forEach(task => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${task.title}</td>
                        <td>${task.description}</td>
                        <td>${task.status}</td>
                        <td>${new Date(task.dueDate).toLocaleString()}</td>
                        <td>
                            <button onclick="editTask(${task.id})">Edit</button>
                            <button onclick="deleteTask(${task.id})">Delete</button>
                        </td>
                    `;
                    tasksTableBody.appendChild(row);
                });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    }

    // Add or edit task
    document.querySelector('#taskForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const id = document.querySelector('#taskId').value;
        const title = document.querySelector('#title').value;
        const description = document.querySelector('#description').value;
        const status = document.querySelector('#status').value;
        const dueDate = document.querySelector('#dueDate').value;

        const task = { title, description, status, dueDate };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/${id}` : apiUrl;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
        .then(response => response.json())
        .then(() => {
            fetchTasks();
            document.querySelector('#taskForm').reset();
        })
        .catch(error => console.error('Error saving task:', error));
    });

    // Edit task
    window.editTask = function(id) {
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(task => {
                document.querySelector('#taskId').value = task.id;
                document.querySelector('#title').value = task.title;
                document.querySelector('#description').value = task.description;
                document.querySelector('#status').value = task.status;
                document.querySelector('#dueDate').value = new Date(task.dueDate).toISOString().slice(0, 16);
            })
            .catch(error => console.error('Error fetching task:', error));
    };

    // Delete task
    window.deleteTask = function(id) {
        fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
            .then(() => fetchTasks())
            .catch(error => console.error('Error deleting task:', error));
    };

    // Initial fetch of tasks
    fetchTasks();
});
