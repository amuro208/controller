<?php
//echo file_get_contents("../queues.txt");
if( $_GET["appid"] ) {
$appid = $_GET["appid"];
$quefilePath = "../queues_".$appid.".txt";

if(file_exists($quefilePath) == TRUE){

}else{
	$queuefile = fopen($quefilePath, "w");
	fwrite($queuefile, '{"userqueues":[]}');
}
echo file_get_contents($quefilePath);
}
?>