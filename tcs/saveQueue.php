<?php


if( $_POST["userQueues"] ) {
	$appid = $_POST["appid"];
	$queuefile = fopen("../queues_".$appid.".txt", "w") or die("Unable to open file!");
	$data = $_POST["userQueues"];
	fwrite($queuefile, $data);
	fclose($queuefile);
	echo "queue saved at queues_".$appid.".txt";
}	  
?>