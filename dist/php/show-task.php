<?php

	$dbc = mysqli_connect('localhost', 'Nevland', '93152nevland', 'todo_db')
		   or die('Error connected MySQL-server');
	$query = "SELECT * FROM task_list";
	$result = mysqli_query($dbc, $query) or die('Error connected data base');

	while ($myrow = mysqli_fetch_assoc($result)) {
		$current[] = array($myrow['id'], $myrow['task']);
	}

	$query = "SELECT * FROM completed_task";
	$result = mysqli_query($dbc, $query) or die('Error connected data base');

	while ($myrow = mysqli_fetch_assoc($result)) {
		$completed[] = array($myrow['id'], $myrow['task']);
	}

	$data = array(
		'current' => $current,
		'completed' => $completed);

	echo json_encode($data, JSON_UNESCAPED_UNICODE);
	
	mysqli_close($dbc);

?>