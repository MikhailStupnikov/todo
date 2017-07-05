<?php

	$task_text = $_GET['tasktext'];

	$dbc = mysqli_connect('localhost', 'Nevland', '93152nevland', 'todo_db')
		   or die('Error connected MySQL-server');

	$query = "INSERT INTO task_list (task) VALUES ('$task_text')";
	mysqli_query($dbc, $query) or die('Error connected data base');

	$id = mysqli_insert_id($dbc);

	echo $id;

	mysqli_close($dbc);

?>