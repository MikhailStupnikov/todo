<?php

	$dbc = mysqli_connect('localhost', 'Nevland', '93152nevland', 'todo_db')
		   or die('Error connected MySQL-server');
	$query = "SELECT * FROM task_list";
	$result = mysqli_query($dbc, $query) or die('Error connected data base');

	while ($myrow = mysqli_fetch_assoc($result)) {
		$data[] = array($myrow['id'], $myrow['task']);
	}

	echo json_encode($data, JSON_UNESCAPED_UNICODE);
	
	mysqli_close($dbc);

?>