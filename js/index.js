const ingreso_tarea = document.querySelector("input");
const ingreso_fecha = document.querySelector(".schedule-date"); 
const add_btn = document.querySelector(".add-task-button");
const todos_list_body = document.querySelector(".todos-list-body");
const alert_message = document.querySelector(".alert-message");
const delete_all_btn = document.querySelector(".delete-all-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

window.addEventListener("DOMContentLoaded", () => {
  verTareas();
  if (!todos.length) {
    verTodasTareas([]);
  }
});

//generar id aleatorio
function idTarea() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function agregarTarea(ingreso_tarea, ingreso_fecha) {
  let task = {
    id: idTarea(),
    task: ingreso_tarea.value.length > 14 ? ingreso_tarea.value.slice(0, 14) + "..." : ingreso_tarea.value,
    dueDate: ingreso_fecha.value,
    completed: false,
    status: "pendiente",
  };
  todos.push(task);
}

ingreso_tarea.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && ingreso_tarea.value.length > 0) {
    agregarTarea(ingreso_tarea, ingreso_fecha); 
    almacenarLocal();
    ingreso_tarea.value = "";
    verTareas();
  }
});

add_btn.addEventListener("click", () => {
  if (ingreso_tarea.value === "") {
    showAlertMessage("Porfavor ingrese una nueva tarea", "error");
  } else {
    agregarTarea(ingreso_tarea, ingreso_fecha); 
    almacenarLocal();
    verTareas();
    ingreso_tarea.value = "";
    ingreso_fecha.value = ""; 
    showAlertMessage("Tarea agregada exitosamente", "exito");
  }
});

delete_all_btn.addEventListener("click", eliminarTodasTareas);

//ver todas las actividades
function verTareas() {
  todos_list_body.innerHTML = "";
  if (todos.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="5" class="text-center">No tiene tareas pendientes, felicidades!</td></tr>`;
    return;
  }

  todos.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "Sin fecha limite"}</td>
                <td>${todo.status}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarTarea('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="estado('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="eliminarTarea('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
        `;
  });
}

//almacenamiento local
function almacenarLocal() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//mostar mensaje de alerta
function showAlertMessage(message, type) {
  let alert_box = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `;
  alert_message.innerHTML = alert_box;
  alert_message.classList.remove("hide");
  alert_message.classList.add("show");
  setTimeout(() => {
    alert_message.classList.remove("show");
    alert_message.classList.add("hide");
  }, 3000);
}

//Elimnar tarea
function eliminarTarea(id) {
  todos = todos.filter((todo) => todo.id !== id);
  almacenarLocal();
  showAlertMessage("Eliminado con exito", "success");
  verTareas();
}

//editar actividad
function editarTarea(id) {
  let todo = todos.find((todo) => todo.id === id);
  ingreso_tarea.value = todo.task;
  todos = todos.filter((todo) => todo.id !== id);
  add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
  almacenarLocal();
  add_btn.addEventListener("click", () => {
    add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
    showAlertMessage("Tarea actualizada con exito", "exito");
  });
}

//eliminar todos las tareas
function eliminarTodasTareas() {
  if (todos.length > 0) {
    todos = [];
    almacenarLocal();
    showAlertMessage("Todas las tareas fueron eliminadas con exito", "exito");
    verTareas();
  } else {
    showAlertMessage("No fue posible eliminar todas las tareas", "error");
  }
}

function estado(id) {
  let todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  console.log("todo", todo);
  almacenarLocal();
  verTodasTareas(todos);
}

function filterTodos(status) {
  let filteredTodos;
  switch (status) {
    case "Todas":
      filteredTodos = todos;
      break;
    case "Pendientes":
      filteredTodos = todos.filter((todo) => !todo.completed);
      break;
    case "Completadas":
      filteredTodos = todos.filter((todo) => todo.completed);
      break;
  }
  verTodasTareas(filteredTodos);
}

function verTodasTareas(todosArray) {
  todos_list_body.innerHTML = "";
  if (todosArray.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="5" class="text-center">No tiene tareas pendientes, felicidades! </td></tr>`;
    return;
  }
  todosArray.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.dueDate || "Sin fecha limite"}</td>
                <td>${todo.completed ? "Completada" : "Pending"}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarTarea('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="estado('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="eliminarTarea('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
}
