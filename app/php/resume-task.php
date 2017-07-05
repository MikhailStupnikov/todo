<?php

	$task_text = $_GET['tasktext'];
	$task_id = $_GET['taskvalue'];

	$dbc = mysqli_connect('localhost', 'Nevland', '93152nevland', 'todo_db')
		   or die('Error connected MySQL-server');

	$query = "INSERT INTO task_list (id, task) VALUES ('$task_id', '$task_text')";
	mysqli_query($dbc, $query) or die('Error connected data base');

	$query = "DELETE FROM completed_task WHERE id = $task_id";
	mysqli_query($dbc, $query) or die('Error connected data base');

	echo 'success';

	mysqli_close($dbc);

?>