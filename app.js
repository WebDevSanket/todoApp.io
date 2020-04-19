//Selectors
const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//Event Listeners

document.addEventListener("DOMContentLoaded", getToDos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("click", filterTodo);

//Functions

function addTodo(e) {
  //Prevent form from submitting
  e.preventDefault();
  if (todoInput.value) {
    //Save to local storage
    if (saveLocalToDos(todoInput.value.toUpperCase())) {
      //Todo div
      const todoDiv = document.createElement("div");
      todoDiv.classList.add("todo");
      //Create LI
      const newTodo = document.createElement("li");
      newTodo.innerText = todoInput.value.toUpperCase();
      newTodo.classList.add("todo-item");
      todoDiv.appendChild(newTodo);

      //Check Button
      const completedButton = document.createElement("button");
      completedButton.innerHTML = ' <i class="fas fa-check"></i>';
      completedButton.classList.add("complete-btn");
      todoDiv.appendChild(completedButton);
      //Trash Button
      const trashButton = document.createElement("button");
      trashButton.innerHTML = ' <i class="fas fa-trash"></i>';
      trashButton.classList.add("trash-btn");
      todoDiv.appendChild(trashButton);

      //Notify to user
      letsNotify("add", todoInput.value.toUpperCase());
      //Append to List
      todoList.appendChild(todoDiv);
    }
    //clear input value
    todoInput.value = "";
  }
}

function deleteCheck(e) {
  const item = e.target;
  //Deleted todo
  if (item.classList[0] === "trash-btn") {
    const todo = item.parentElement;
    //Animation
    todo.classList.add("fall");
    removeLocalTodos(todo);
    document.addEventListener("transitionend", function () {
      todo.remove();
    });
  }
  //check todo
  if (item.classList[0] === "complete-btn") {
    item.parentElement.classList.toggle("completed");
    letsNotify("complete", item.parentElement.children[0].innerText);
  }
}

function filterTodo(e) {
  const todos = todoList.childNodes;
  todos.forEach(function (todo) {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
}

function saveLocalToDos(data) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  if (todos.indexOf(data) == -1) {
    todos.push(data);
    localStorage.setItem("todos", JSON.stringify(todos));
    return true;
  } else {
    return false;
  }
}

function getToDos() {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  todos.forEach(function (todo) {
    //Todo div
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");
    //Create LI
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    //Check Button
    const completedButton = document.createElement("button");
    completedButton.innerHTML = ' <i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    //Trash Button
    const trashdButton = document.createElement("button");
    trashdButton.innerHTML = ' <i class="fas fa-trash"></i>';
    trashdButton.classList.add("trash-btn");
    todoDiv.appendChild(trashdButton);
    //Append to List
    todoList.appendChild(todoDiv);
  });
}

function removeLocalTodos(data) {
  let todos;
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  let todoIndex = data.children[0].innerText;
  todos.splice(todos.indexOf(todoIndex), 1);
  //Notify to user
  letsNotify("remove", todoIndex);
  localStorage.setItem("todos", JSON.stringify(todos));
}

/** Caching with Service Worker API Start */
//STEP 1 REGISTER
// Checck the SW support
if ("serviceWorker" in navigator) {
  console.log("Service Worker Supported");
  // navigator.serviceWorker.register("sw.js");
  navigator.serviceWorker.register("sw_cache_site.js");
}
/** Caching with Service Worker API End */

/** Web Notification API Start */
function letsNotify(action = "", value = "") {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      notificationConfig(action, value);
    } else {
      Notification.requestPermission()
        .then((result) => {
          console.log(result);
          if (result === "granted") {
            notificationConfig(action, value);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}

function notificationConfig(action, value) {
  let title = "Sanket's TODO App";
  // let tStamp = Date.now() + 120000; // 2mins in future
  var bodyMsg;
  switch (action) {
    case "add":
      bodyMsg = "Added to List";
      break;
    case "delete":
    case "remove":
      bodyMsg = "Removed from List";
      break;
    case "complete":
      bodyMsg = "Task Completed";
      break;
  }
  let options = {
    body: value + " " + bodyMsg,
    data: {},
    lang: "en-US",
    icon: "./todo-icon.png",
    // timestamp: tStamp,
    vibration: 800,
  };
  let notify = new Notification(title, options);
  setTimeout(notify.close.bind(notify), 3000); // Close after 3s
}
/** Web Notification API End */
