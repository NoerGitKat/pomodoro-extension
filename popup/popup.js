"use strict"

const startBtn = document.querySelector("#actions__button--start")
const addBtn = document.querySelector("#actions__button--add")
const clearBtn = document.querySelector("#actions__button--clear")
const tasksElement = document.querySelector(".tasks")

let tasks = []

chrome.storage.sync.get(["tasks"], function getStorageContent(content) {
  tasks = content.tasks ? content.tasks : []
  renderTasks()
})

addBtn.addEventListener("click", addTask)
clearBtn.addEventListener("click", clearTasks)

function renderTask(taskNumber) {
  const taskRow = document.createElement("article")
  const deleteBtn = document.createElement("input")
  const text = document.createElement("input")

  text.type = "text"
  text.placeholder = "Enter a task..."
  text.value = tasks[taskNumber]
  text.addEventListener("change", function assignTaskValue() {
    tasks[taskNumber] = text.value
    saveTasks()
  })

  deleteBtn.type = "button"
  deleteBtn.value = "x"
  deleteBtn.addEventListener("click", function removeTask() {
    deleteTask(taskNumber)
  })

  taskRow.appendChild(text)
  taskRow.appendChild(deleteBtn)

  const taskContainer = document.querySelector(".tasks")
  taskContainer.appendChild(taskRow)
}

function addTask() {
  const taskNumber = tasks.length
  tasks.push("")
  renderTask(taskNumber)
  saveTasks()
}

function deleteTask(taskNumber) {
  tasks.splice(taskNumber, 1)
  renderTasks()
  saveTasks()
}

function renderTasks() {
  tasksElement.innerHTML = ""
  tasks.forEach(function rerenderTask(_taskContent, taskNumber) {
    console.log("taskNumber is", taskNumber)
    renderTask(taskNumber)
  })
}

function clearTasks() {
  tasksElement.innerHTML = ""
  tasks.splice(0, tasks.length)
  saveTasks()
}

function saveTasks() {
  chrome.storage.sync.set({
    tasks,
  })
}
