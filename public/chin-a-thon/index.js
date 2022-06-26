let tasksDone = [1, 2, 3,4];

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
