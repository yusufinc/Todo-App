let todoList = [];
if (localStorage.getItem("todoList") !== null) {
  todoList = JSON.parse(localStorage.getItem("todoList"));
}
const taskInput = document.querySelector("#txtTaskName");
const btnClear = document.querySelector("#btnClear");
const filters = document.querySelectorAll(".filters span");

let editID;
let isEditTask = false;
displayTask("all");
function displayTask(filter) {
  ul = document.getElementById("task-list");
  ul.innerHTML = "";
  if (todoList.length == 0) {
    ul.innerHTML = "<p class='p-3 m-0'>Görev Listeniz Boş!</p>";
  } else {
    for (let task of todoList) {
      let completed = task.durum == "completed" ? "checked" : "";
      if (filter == task.durum || filter == "all") {
        let li = `<li class="task list-group-item d-flex justify-content-between align-items-center">
    <div class="form-check d-flex">
        <input class="form-check-input" onclick="updateStatus(this)" type="checkbox" id="${task.id}" ${completed} />
        <label class="form-check-label ${completed}" for="${task.id}"> ${task.gorevAdi}</label>
    </div>
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-dark">
            <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#"> <i class="fa-solid fa-trash"></i> Sil</a></li>
            <li><a onclick='editTask(${task.id},"${task.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen-to-square"></i> Düzenle</a></li>
        </ul>
    </div>
</li>
`;
        ul.insertAdjacentHTML("beforeend", li);
      }
    }
  }
}

let btnEkle = document
  .querySelector("#btnAddNewTask")
  .addEventListener("click", newTask);

document
  .querySelector("#btnAddNewTask")
  .addEventListener("keypress", function () {
    if ((event.key = "Enter")) {
      document.getElementById("btnAddNewTask").click();
    }
  });

let btnSil = document
  .querySelector("#btnClear")
  .addEventListener("click", clearTask);

for (let span of filters) {
  span.addEventListener("click", function () {
    document.querySelector("span.active").classList.remove("active");
    span.classList.add("active");
    displayTask(span.id);
  });
}

function newTask(event) {
  if (taskInput.value.trim() !== "") {
    if (isEditTask) {
      //güncelleme
      for (let task of todoList) {
        if (task.id == editID) {
          task.gorevAdi = taskInput.value;
        }
        isEditTask = false;
      }
    } else {
      //ekleme
      todoList.push({
        id: todoList.length + 1,
        gorevAdi: taskInput.value,
        durum: "pending",
      });
    }

    taskInput.value = "";
    displayTask(document.querySelector("span.active").id);
    localStorage.setItem("todoList", JSON.stringify(todoList));
  } else {
    alert("bir görev ekleyiniz");
    taskInput.value = "";
  }

  event.preventDefault();
}

function clearTask(event) {
  todoList = [];
  localStorage.setItem("todoList", JSON.stringify(todoList));
  displayTask(document.querySelector("span.active").id);
  event.preventDefault();
}

function deleteTask(id) {
  let deletedID = todoList.findIndex(function (todo) {
    return todo.id == id;
  });

  todoList.splice(deletedID, 1);
  localStorage.setItem("todoList", JSON.stringify(todoList)); // Local storage'ı güncelle
  displayTask(document.querySelector("span.active").id);
}

function editTask(taskID, taskName) {
  editID = taskID;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  taskInput.classList.add("active");
}

btnClear.addEventListener("click", function () {
  todoList.splice(0, todoList.length);
  displayTask();
});

function updateStatus(selectedTask) {
  let label = selectedTask.nextElementSibling;
  let durum;
  if (selectedTask.checked) {
    label.classList.add("checked");
    durum = "completed";
  } else {
    label.classList.remove("checked");
    durum = "pending";
  }

  for (let task of todoList) {
    if (task.id == selectedTask.id) {
      task.durum = durum;
    }
  }

  displayTask(document.querySelector("span.active").id);
  localStorage.setItem("todoList", JSON.stringify(todoList));
}
