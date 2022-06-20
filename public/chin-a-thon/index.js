let tasksDone = 1;

let taskList = document.getElementsByClassName("goals")[0];
console.log(taskList.rows);
addDoneClasses();

async function addDoneClasses() {
	for (let i = 1; i <= tasksDone; i++) {
		await new Promise((resolve) => {
			setTimeout(resolve, 250);
		});
		let task = taskList.rows[i - 1];
		task.classList.add("done");
	}
}
