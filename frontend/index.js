async function getTodoData () {
  const response = await fetch('http://localhost:4000/todos', {
    method: 'GET',
    headers: {
      Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlyZmFuQGdtYWlsLmNvbSIsImlhdCI6MTcxMjYwMTk1NX0.F6ejM3xky8msnptJkRrQMEfOziWAUWYKg2M8q9cvgaI',
    },
  });
  const todos = await response.json();
  if (todos.length > 0) {
    createToDoTable(todos);
  }
  return;
}

function createToDoTable (toDos) {
  const todoTable = document.getElementById('todoTable');
  if (todoTable) {
    todoTable.remove();
  }
  const table = document.createElement('table');
  table.setAttribute('id', 'todoTable');

  const headerRow = document.createElement('tr');
  Object.keys(toDos[0]).forEach(key => {
    const th = document.createElement('th');
    th.appendChild(document.createTextNode(key));
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  toDos.forEach(data => {
    const row = document.createElement('tr');
    Object.values(data).forEach(value => {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(value));
      row.appendChild(td);
    })
    table.appendChild(row);
  })

  document.body.appendChild(table);
  return;
}

async function createToDo () {
  const title = document.getElementById('titleInput').value.toString();
  const description = document.getElementById('descriptionInput').value.toString();
  const response = await fetch(`http://localhost:4000/todos`, {
    method: 'POST',
    body: JSON.stringify({
      "title": title,
      "description": description,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImlyZmFuQGdtYWlsLmNvbSIsImlhdCI6MTcxMjYwMTk1NX0.F6ejM3xky8msnptJkRrQMEfOziWAUWYKg2M8q9cvgaI',
    },
  });
  return response.text();
}