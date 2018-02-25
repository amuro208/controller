<?php
//echo file_get_contents("../queues.txt");
if( $_POST["appid"] ) {
$appid = $_POST["appid"];
$quefilePath = "../queues_".$appid.".txt";

if(file_exists($quefilePath)){

}else{
	$queuefile = fopen($quefilePath, "w");
	fwrite($queuefile, '{"userqueues":[]}');
}
echo file_get_contents($quefilePath);
}
?>