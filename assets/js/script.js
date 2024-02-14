'use strict';



// select all DOM elements

const headerTime = document.querySelector("[data-header-time]");
const menuTogglers = document.querySelectorAll("[data-menu-toggler]");
const menu = document.querySelector("[data-menu]");
const themeBtns = document.querySelectorAll("[data-theme-btn]");
const modalTogglers = document.querySelectorAll("[data-modal-toggler]");
const welcomeNote = document.querySelector("[data-welcome-note]");
const taskList = document.querySelector("[data-task-list]");
const taskInput = document.querySelector("[data-task-input]");
const modal = document.querySelector("[data-info-modal]");
let taskItem = {};
let taskRemover = {};

// store current date from build-in date object
const date = new Date();

// import task complete sound
const taskCompleteSound = new Audio("./assets/sounds/task-complete.mp3");




/**
 * convert weekday number to weekday name
 * totalParameter: 1;
 * parameterValue: <number> 0-6;
 */

const getWeekDayName = function (dayNumber) {
  switch (dayNumber) {
    case 0:
      return "Sunday";
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Satureday";
    default:
      return "Not a valid day";
  }
}



/**
 * convert month number to month name
 * totalParameter: 1;
 * parameterValue: <number> 0-11;
 */

const getMonthName = function (monthNumber) {
  switch (monthNumber) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
    default:
      return "Not a valid month";
  }
}



// store weekday name, month name & month-of-day number
const weekDayName = getWeekDayName(date.getDay());
const monthName = getMonthName(date.getMonth());
const monthOfDay = date.getDate();

// update headerTime date
headerTime.textContent = `${weekDayName}, ${monthName} ${monthOfDay}`;



/**
 * toggle active class on element
 * totalParameter: 1;
 * parameterValue: <object> elementNode;
 */

const elemToggler = function (elem) { elem.classList.toggle("active"); }



/**
 * toggle active class on multiple elements
 * totalParameter: 2;
 * parameterValue: <object> elementNode, <function> any;
 */

const addEventOnMultiElem = function (elems, event) {
  for (let i = 0; i < elems.length; i++) {
    elems[i].addEventListener("click", event);
  }
}



/**
 * create taskItem elementNode and return it
 * totalParameter: 1;
 * parameterValue: <string> any;
 */

const taskItemNode = function (taskText) {

  const createTaskItem = document.createElement("li");
  createTaskItem.classList.add("task-item");
  createTaskItem.setAttribute("data-task-item", "");

  createTaskItem.innerHTML = `
  
    <button class="item-icon" data-task-remove="complete">
      <span class="check-icon"></span>
    </button>

    <p class="item-text">${taskText}</p>

    <button class="item-action-btn" aria-label="Remove task" data-task-remove>
      <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>

  `;

  return createTaskItem;

}



/**
 * task input validation
 * totalParameter: 1;
 * parameterValue: <string> any
 */

const taskInputValidation = function (taskIsValid) {
  if (taskIsValid) {

    /**
     * if there is an existing task
     * then the new task will be added before it
     */
    if (taskList.childElementCount > 0) {
      taskList.insertBefore(taskItemNode(taskInput.value), taskItem[0]);
    } else {
      taskList.appendChild(taskItemNode(taskInput.value));
    }

    // after adding task on taskList, input field should be empty
    taskInput.value = "";

    // hide the welcome note
    welcomeNote.classList.add("hide");

    // update taskItem DOM selection
    taskItem = document.querySelectorAll("[data-task-item]");
    taskRemover = document.querySelectorAll("[data-task-remove]");

  } else {
    // if user pass any falsy value like(0, "", undefined, null, NaN)
    console.log("Please write something!");
  }
}



/**
 * if there is an existing task,
 * the welcome note will be hidden
 */

const removeWelcomeNote = function () {
  if (taskList.childElementCount > 0) {
    welcomeNote.classList.add("hide");
  } else {
    welcomeNote.classList.remove("hide");
  }
}



/**
 * removeTask when click on delete button or check button
 */

const removeTask = function () {
  const parentElement = this.parentElement;
  const taskId = parentElement.getAttribute('data-task-id');

  if (this.dataset.taskRemove === 'complete') {
    parentElement.classList.add('complete');
    taskCompleteSound.play();

    setTimeout(function () {
      parentElement.remove();
      removeWelcomeNote();
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      saveTasksToLocalStorage();
    }, 250);
  } else {
    parentElement.remove();
    removeWelcomeNote();

    // Play sound when task is removed
    taskCompleteSound.play();

    // Remove the task from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Call the function to update local storage after removing the task
    saveTasksToLocalStorage();
  }
}



/**
 * addTask function
 */

const addTask = function () {

// Generate ID
  const id = Date.now().toString();

  // Create task item
  const taskItem = taskItemNode(taskInput.value);

  // Set ID on task item
  taskItem.setAttribute('data-task-id', id);

  // Save updated tasks array
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.push({
    id: id,
    text: taskInput.value
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));


  // check the task inpu validation
  taskInputValidation(taskInput.value);

  // addEventListere to all taskItem checkbox and delete button
  addEventOnMultiElem(taskRemover, removeTask);

  // Save tasks after adding
  saveTasksToLocalStorage();

  // Add event listeners to all taskItem checkbox and delete button
  attachTaskItemEventListeners();

}

// Attach event listeners to loaded task items
const attachTaskItemEventListeners = function () {
  taskItem = document.querySelectorAll("[data-task-item]");
  taskRemover = document.querySelectorAll("[data-task-remove]");
  addEventOnMultiElem(taskRemover, removeTask);
};


// Function to save tasks to local storage
// Call this function to save tasks to local storage when tasks are modified.
const saveTasksToLocalStorage = () => {
  const tasks = Array.from(taskList.children).map(taskItem => ({
    text: taskItem.querySelector('.item-text').textContent,
    completed: taskItem.classList.contains('complete'),
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// Function to load tasks from local storage
const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  tasks.forEach(task => {
    const taskItem = taskItemNode(task.text); // Remove "const" here
    taskItem.setAttribute('data-task-id', task.id);
    taskList.appendChild(taskItem);
  });
  removeWelcomeNote();

  // Attach event listeners to the newly loaded task items
  attachTaskItemEventListeners();
}



/**
 * add keypress listener on taskInput
 */

taskInput.addEventListener("keypress", function (e) {

  // addTask if user press 'Enter'
  switch (e.key) {
    case "Enter":
      addTask();
      saveTasksToLocalStorage(); // Save tasks after adding
      break;
  }

  attachTaskItemEventListeners();

});



// toggle active class on menu when click on menuBtn or dropdownLink 
const toggleMenu = function () { elemToggler(menu); }
addEventOnMultiElem(menuTogglers, toggleMenu);

// toggle active class on modal when click on dropdownLink or modal Ok button
const toggleModal = function () { elemToggler(modal); }
addEventOnMultiElem(modalTogglers, toggleModal);



/**
 * add "loaded" class on body when website is fully loaded
 */

window.addEventListener("load",  function () {
  document.body.classList.add("loaded");
  loadTasksFromLocalStorage(); // Load tasks from local storage
  attachTaskItemEventListeners(); // Attach event listeners to loaded task items
});



/**
 * change body background when click on any themeBtn
 */

const themeChanger = function () {
  // store hue value from clicked themeBtn
  const hueValue = this.dataset.hue;

  // create css custom property on root and set value from hueValue
  document.documentElement.style.setProperty("--hue", hueValue);

  // remove "active" class from all themeBtns
  for (let i = 0; i < themeBtns.length; i++) {
    if (themeBtns[i].classList.contains("active")) {
      themeBtns[i].classList.remove("active");
    }
  }

  // add "active" class on clicked themeBtn
  this.classList.add("active");
}

// add event on all themeBtns
addEventOnMultiElem(themeBtns, themeChanger);









function showTime(){
  let date = new Date();
  let h = date.getHours(); // 0 - 23
  let m = date.getMinutes(); // 0 - 59
  let s = date.getSeconds(); // 0 - 59
  let session = "AM";

  if(h === 0){
    h = 12;
  }

  if(h > 12){
    h = h - 12;
    session = "PM";
  }

  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;

  let time = h + " : " + m + " : " + s + " " + session;
  document.getElementById("MyClockDisplay").innerText = time;
  document.getElementById("MyClockDisplay").textContent = time;

  setTimeout(showTime, 1000);

}

showTime();