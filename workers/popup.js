const SECOND = 1
const MINUTE = SECOND * 60
const POMODORO_TIME = MINUTE * 25

chrome.alarms.create("pomodoroTimer", {
  periodInMinutes: SECOND / MINUTE,
})

// Increment timer
chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "pomodoroTimer") {
    chrome.storage.local.get(["timer", "isRunning"], function (result) {
      if (result.isRunning) {
        let timer = result.timer + 1
        if (timer === POMODORO_TIME) {
          this.registration.showNotification("Time's Up!", {
            body: "25 minutes have passed!",
            icon: "../pomodoro.png",
          })
        }
        chrome.storage.local.set({
          timer,
        })
      }
    })
  }
})

// Initialise storage
chrome.storage.local.get(["timer", "isRunning"], function (result) {
  chrome.storage.local.set({
    timer: "timer" in result ? result.timer : 0,
    isRunning: "isRunning" in result ? result.isRunning : false,
  })
})
