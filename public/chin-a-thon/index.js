let tasksDone = [1];

let taskList = document.getElementsByClassName("goals")[0];
console.log(taskList.rows);
addDoneClasses();

async function addDoneClasses() {
  for (let i = 0; i <= tasksDone.length; i++) {
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
    let taskDone = tasksDone[i];
    let task = taskList.rows[taskDone - 1];
    task.classList.add("done");
  }
}

// Countdown Timer

let x = setInterval(() => {
  let days = document.getElementById("days");
  let hours = document.getElementById("hours");
  let minutes = document.getElementById("minutes");
  let seconds = document.getElementById("seconds");
  let targetDate = new Date("2022-12-02T18:00:00Z").getTime();

  let now = new Date().getTime();

  let distance = now - targetDate;

  let d = Math.floor(distance / (1000 * 60 * 60 * 24));
  let h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let s = Math.floor((distance % (1000 * 60)) / 1000);

  days.innerHTML = d;
  hours.innerHTML = h;
  minutes.innerHTML = m;
  seconds.innerHTML = s;
}, 1000);
