<?php


if( $_POST["userQueues"] ) {
    echo $_POST["userQueues"];
	$queuefile = fopen("queues.txt", "w") or die("Unable to open file!");
	$data = $_POST["userQueues"];
	fwrite($queuefile, $data);
	fclose($queuefile);
}	  
	  

?>