const form = document.getElementById("todoform");
const todoInput = document.getElementById("newtodo");
const todosListEl = document.getElementById("todos-list");
const deleteAllBtn = document.getElementById("delete-all-btn");
const tabBtn = document.getElementById("tab-btn");

let todos = [];

form.addEventListener("submit", (e) => {
	e.preventDefault();

	saveTodo();
	renderTodos();
	localStorage.setItem("todos", JSON.stringify(todos));
});

const saveTodo = () => {
	const todoValue = todoInput.value;

	const isEmpty = todoValue === "";

	if (isEmpty) {
		alert("Input is empty");
	} else {
		todos.push({
			value: todoValue,
			id: Math.random(),
		});
		todoInput.value = "";
	}
	console.log(todos);
};

const renderTodos = () => {
	if (todos.length === 0) {
		todosListEl.innerHTML = `<center>No links here...</center>`;
		return;
	}
	todosListEl.innerHTML = "";

	todos.forEach((todo, index) => {
		todosListEl.innerHTML += `
		<div class="todo" id=${index}>
			
					<a class="url-link" href=${todo.value} target="_blank" rel="noopener">${todo.value}</a>
					<button data-action="delete" class="delete-todo">❌</button>

		</div>
		`;
	});
};

todosListEl.addEventListener("click", (e) => {
	const target = e.target;
	const parentElement = target.parentNode;

	if (parentElement.className !== "todo") return;

	const todo = parentElement;
	const todoId = Number(todo.id);

	const action = target.dataset.action;

	console.log(todoId, action);

	action === "delete" && deleteTodo(todoId);

	// console.log(todoId);
});

deleteAllBtn.addEventListener("click", function () {
	let confirmDelAll = confirm("Are you sure you want delete all the leads?");
	if (!confirmDelAll) return;
	localStorage.clear();
	todos = [];
	renderTodos(todos);
	console.log(todos);
});

const deleteTodo = (todoId) => {
	todos = todos.filter((todo, index) => index !== todoId);

	renderTodos();
	localStorage.setItem("todos", JSON.stringify(todos));
};

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("todos"));
if (leadsFromLocalStorage) {
	todos = leadsFromLocalStorage;
	renderTodos(todos);
}

tabBtn.addEventListener("click", function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const url = tabs[0].url;
		const newTabLink = {
			id: Math.random(),
			value: url,
		};
		todos.push(newTabLink);
		console.log(tabs[0].url);
		localStorage.setItem("todos", JSON.stringify(todos));
		renderTodos(todos);
	});
});
