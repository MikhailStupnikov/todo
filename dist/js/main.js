var model = {
	loadTask: function() {
		var request = new XMLHttpRequest();
		request.open('GET', 'php/show-task.php');
		request.onload = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				try {
					var tasksObj = JSON.parse(request.responseText);
				} catch(err) {
					alert(request.responseText);
				}
				if (tasksObj.current != null) {
					for (var i = 0; i < tasksObj.current.length; i++) {
						controller.loadTaskComplete(view.taskListCurrent, tasksObj.current, i);
					}
				}
				if (tasksObj.completed != null) {
					for (var i = 0; i < tasksObj.completed.length; i++) {
						controller.loadTaskComplete(view.taskListCompleted, tasksObj.completed, i);
					}
				}
			} else if (request.status >= 400) {
				alert(request.status + ': ' + request.statusText);
			}
		};
		request.send();
	},
	addTask: function() {
		var request = new XMLHttpRequest();
		request.open('GET', 'php/add-task.php?tasktext=' + view.taskText.value);
		request.onload = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				if (isNaN(+request.responseText)) {
					alert(request.responseText);
				} else {
					controller.addTaskComplete(request.responseText);	
				}
			} else if (request.status >= 400) {
				alert(request.status + ': ' + request.statusText);
			}
		};
		request.send();
	},
	removeTask: function() {
		var request = new XMLHttpRequest(),
			markItem = view.taskListCompleted.querySelectorAll('input:checked'),
			doneTasks = [];
		for (var i = 0; i < markItem.length; i++) {
			doneTasks.push(markItem[i].value);
		}
		doneTasks = JSON.stringify(doneTasks);
		request.open('GET', 'php/remove-task.php?donetasks=' + doneTasks);
		request.onload = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				if (request.responseText === 'success') {
					for (var i = markItem.length - 1; i >= 0; i--) {
						controller.removeTaskComplete(markItem[i].parentElement, view.taskListCompleted);
					}
				} else {
					alert(request.responseText);
				}
			} else if (request.status >= 400) {
				alert(request.status + ': ' + request.statusText);
			}
		};
		request.send();
	},
	changeTable: function(itemTask, file, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', 'php/' + file + '.php?tasktext=' + itemTask.elemSpan.innerHTML + '&taskvalue=' + itemTask.elemCheckBox.value);
		request.onload = function() {
			if ((request.readyState === 4) && (request.status === 200)) {
				if (request.responseText !== 'success') {
					alert(request.responseText);
				} else {
					callback.call(view);
				}
			} else if (request.status >= 400) {
				alert(request.status + ': ' + request.statusText);
			}
		};
		request.send();
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
	taskListCurrent: document.getElementById('task-list-current'),
	taskListCompleted: document.getElementById('task-list-completed'),
	btnDone: document.getElementById('btn-done'),
	btnDel: document.getElementById('btn-del'),
	btnCompleted: document.getElementById('btn-completed'),
	btnResume: document.getElementById('btn-resume'),
	markItem: [],
	parElem: [],
	fillElem: function(obj, value) {
		obj.elemSpan.innerHTML = value;
		obj.elem.appendChild(obj.elemCheckBox);
		obj.elem.appendChild(obj.elemSpan);
	},
	showTask: function(list, tasks, i) {
		var itemTask = new crElem(tasks[i][0]);
		itemTask.elemCheckBox.setAttribute('name', 'todelete[]');
		this.fillElem(itemTask, tasks[i][1]);
		list.appendChild(itemTask.elem);
	},
	newTask: function(answer) {
		var itemTask = new crElem(answer);
		this.fillElem(itemTask, this.taskText.value);
		this.taskListCurrent.appendChild(itemTask.elem);
		view.taskText.value = '';
	},
	hideTask: function(elem, list) {
		list.removeChild(elem);
	},
	moveTask: function(mainList, taskListOne, taskListTwo) {
		var markItem = mainList.querySelectorAll('input:checked');
		for (var i = 0; i < markItem.length; i++) {
			var itemTask = new crElem(markItem[i].value);
			this.fillElem(itemTask, markItem[i].nextElementSibling.innerHTML);
			if (taskListOne === this.taskListCompleted) {
				(function() {
					var j = i,
						nodeTask = itemTask;
					controller.moveTaskStart(nodeTask, 'complete-task', function() {
						taskListOne.appendChild(nodeTask.elem);
						this.hideTask(markItem[j].parentElement, taskListTwo);
					});
				})();
			} else if (taskListOne === this.taskListCurrent) {
				(function() {
					var j = i,
						nodeTask = itemTask;
					controller.moveTaskStart(nodeTask, 'resume-task', function() {
						taskListOne.appendChild(nodeTask.elem);
						this.hideTask(markItem[j].parentElement, taskListTwo);
					});
				})();
			}
		}
	},
	changeTaskList: function() {
		var listCurrent = this.taskListCurrent,
			listCompleted = this.taskListCompleted;
		if (getComputedStyle(listCurrent).display == 'block') {
			listCurrent.classList.remove('show');
			listCurrent.classList.add('hide');
			listCompleted.classList.remove('hide');
			listCompleted.classList.add('show');
// 			listCurrent.style.display = 'none';
// 			listCompleted.style.display = 'block';
			
			this.btnDone.classList.remove('show');
			this.btnDone.classList.add('hide');
			this.btnDel.classList.remove('hide');
			this.btnDel.classList.add('show');
			this.btnResume.classList.remove('hide');
			this.btnResume.classList.add('show');
			this.btnResume.classList.remove('hide');
			this.btnResume.classList.add('show');
// 			this.btnDel.style.display = 'block';
// 			this.btnDone.style.display = 'none';
// 			this.btnResume.style.display = 'block';
			
			this.btnCompleted.innerHTML = 'Текущие';
		} else {
			listCurrent.classList.remove('hide');
			listCurrent.classList.add('show');
			listCompleted.classList.remove('show');
			listCompleted.classList.add('hide');
// 			listCurrent.style.display = 'block';
// 			listCompleted.style.display = 'none';
			
			this.btnDone.classList.remove('hide');
			this.btnDone.classList.add('show');
			this.btnDel.classList.remove('show');
			this.btnDel.classList.add('hide');	
			this.btnResume.classList.remove('show');
			this.btnResume.classList.add('hide');
// 			this.btnDel.style.display = 'none';
// 			this.btnDone.style.display = 'inline-block';
// 			this.btnResume.style.display = 'none';
			
			this.btnCompleted.innerHTML = 'Завершенные';
		}
	}
};

var controller = {
	setUpListener: function() {
		window.addEventListener('load', model.loadTask);
		view.formEntry.addEventListener('submit', model.checkForm.bind(model));
		view.btnDone.addEventListener('click', view.moveTask.bind(view, view.taskListCurrent, view.taskListCompleted, view.taskListCurrent)),
		view.btnDel.addEventListener('click', model.removeTask),
		view.btnCompleted.addEventListener('click', view.changeTaskList.bind(view)),
		view.btnResume.addEventListener('click', view.moveTask.bind(view, view.taskListCompleted, view.taskListCurrent, view.taskListCompleted));
	},
	loadTaskComplete: function(list, tasks, i) {
		view.showTask(list, tasks, i);
	},
	addTaskComplete: function(answer) {
		view.newTask(answer);
	},
	removeTaskComplete: function(elem, list) {
		view.hideTask(elem, list);
	},
	moveTaskStart: function(itemTask, file, callback) {
		model.changeTable(itemTask, file, callback);
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