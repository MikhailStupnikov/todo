<?php

	$done_tasks = json_decode($_GET['donetasks']);

	$dbc = mysqli_connect('localhost', 'Nevland', '93152nevland', 'todo_db')
		   or die('Error connected MySQL-server');

	foreach ($done_tasks as $delete_id) {
		$query = "DELETE FROM task_list WHERE id = $delete_id";
		mysqli_query($dbc, $query) or die('Error connected data base');
	}

	mysqli_close($dbc);

?>