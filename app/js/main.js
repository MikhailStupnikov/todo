var model = {
	loadTask: function() {
		var request = new XMLHttpRequest();
		request.open('GET', 'php/show-task.php');
		request.onload = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				var tasks = JSON.parse(request.responseText);
				if (tasks != null) {
					for (var i = 0; i < tasks.length; i++) {
						controller.loadTaskComplete(tasks, i);
					}
				}
			} else if (request.status >= 400) {
				alert(request.responseText);
			}
		};
		request.send();
	},
	addTask: function() {
		var request = new XMLHttpRequest();
		request.open('GET', 'php/add-task.php?tasktext=' + view.taskText.value);
		request.onload = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				controller.addTaskComplete(request.responseText);
			} else if (request.status >= 400) {
				alert(request.responseText);
			}
		};
		request.send();
	},
	removeTask: function() {
		var request = new XMLHttpRequest(),
			markItem = document.querySelectorAll('input:checked'),
			doneTasks = [];
		for (var i = 0; i < markItem.length; i++) {
			doneTasks.push(markItem[i].value);
		}
		doneTasks = JSON.stringify(doneTasks);
		request.open('GET', 'php/remove-task.php?donetasks=' + doneTasks);
		request.send();
		for (var i = markItem.length - 1; i >= 0; i--) {
			controller.removeDone(markItem[i].parentElement);
		}
	},
	checkForm: function (event) {
		event.preventDefault();
		if (view.taskText.value.trim() !== '') {
			this.addTask();
		}
	}
};

var view = {
	formEntry: document.getElementById('form-entry'),
	taskText: document.getElementById('task-text'),
	taskList: document.getElementById('task-list'),
	btnDone: document.getElementById('btn-done'),
	showTask: function(tasks, i) {
		var itemTask = new crElem(tasks[i][0]);

		itemTask.elemCheckBox.setAttribute('name', 'todelete[]');

		itemTask.elemSpan.innerHTML = tasks[i][1];
		itemTask.elem.appendChild(itemTask.elemCheckBox);
		itemTask.elem.appendChild(itemTask.elemSpan);
		
		this.taskList.appendChild(itemTask.elem);
	},
	newTask: function(answer) {
		var itemTask = new crElem(answer);

		itemTask.elemSpan.innerHTML = view.taskText.value;
		itemTask.elem.appendChild(itemTask.elemCheckBox);
		itemTask.elem.appendChild(itemTask.elemSpan);
		this.taskList.appendChild(itemTask.elem);
		view.taskText.value = '';
	},
	hideTask: function(elem) {
		this.taskList.removeChild(elem);
	}
};

var controller = {
	setUpListener: function() {
		window.addEventListener('load', model.loadTask);
		view.formEntry.addEventListener('submit', model.checkForm.bind(model));
		view.btnDone.addEventListener('click', model.removeTask);
	},
	loadTaskComplete: function(tasks, i) {
		view.showTask(tasks, i);
	},
	addTaskComplete: function(answer) {
		view.newTask(answer);
	},
	removeDone: function(elem) {
		view.hideTask(elem);
	}
};

controller.setUpListener();

function crElem(value) {
	this.elem = document.createElement('li');
	this.elemCheckBox = document.createElement('input');
	this.elemSpan = document.createElement('span');

	this.elemCheckBox.setAttribute('type', 'checkbox');
	this.elemCheckBox.setAttribute('value', value);
}