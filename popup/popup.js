"use strict"

const startBtn = document.querySelector("#actions__button--start")
const resetBtn = document.querySelector("#actions__button--reset")
const addBtn = document.querySelector("#actions__button--add")
const clearBtn = document.querySelector("#actions__button--clear")
const timer = document.querySelector("#timer")
const tasksElement = document.querySelector(".tasks")

let tasks = []

chrome.storage.sync.get(["tasks"], function getStorageContent(content) {
  tasks = content.tasks ? content.tasks : []
  renderTasks()
})

function updateTimer() {
  chrome.storage.local.get(["timer"], function setTimer(result) {
    const POMODORO_TIME = 25
    const TIMER_MINUTES = `${
      POMODORO_TIME - Math.ceil(result.timer / 60)
    }`.padStart(2, "0")
    let TIMER_SECONDS = "00"
    if (result.timer % 60 !== 0) {
      TIMER_SECONDS = `${60 - (result.timer % 60)}`.padStart(2, "0")
    }

    timer.textContent = `${TIMER_MINUTES}:${TIMER_SECONDS}`
  })
}

setInterval(updateTimer, 1000)

addBtn.addEventListener("click", addTask)
startBtn.addEventListener("click", toggleTimer)
clearBtn.addEventListener("click", clearTasks)
resetBtn.addEventListener("click", resetTimer)

function toggleTimer() {
  chrome.storage.local.get(["isRunning"], function setTimer(result) {
    chrome.storage.local.set(
      {
        isRunning: !result.isRunning,
      },
      function changeBtnText() {
        startBtn.textContent = `${result.isRunning ? "Start" : "Pause"} Timer`
      }
    )
  })
}

function resetTimer() {
  chrome.storage.local.set(
    {
      isRunning: false,
      timer: 0,
    },
    function resetStartBtnText() {
      startBtn.textContent = "Start Timer"
    }
  )
}

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
