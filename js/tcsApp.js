
preset.confp = {
	CMD_SOCKET_ID:3,
	CMD_SOCKET_IP:"192.168.0.2",
	CMD_SOCKET_PORT:9000,
	CMS_EVENT_CODE:"QS",
	CMS_IP:"192.168.0.2",
	CMS_UPLOAD:"/codeigniter/index.php/upload/",
	CMS_LIST:"/codeigniter/index.php/upload/qsrank/",
	CMS_CLEAR_BOARD:"/codeigniter/index.php/upload/qsrankclear/",
	CMS_REQUEST_QUEUE:"/app/f1/requestQueue.php",
	CMS_SAVE_QUEUE:"/app/f1/saveQueue.php",
	APP_INFINITE_TEST:"N",
	TIMEOUT:30,
	USE_FLAG:"Y",
	USE_CPU_OPPONENT:"N",
	FLAG_TXT:["Mercedes","Red Bull Racing","Ferrari","Force India","Williams","McLaren","Toro Rosso","Haas F1 Team","Renault","Sauber"],
	NUM_FLAG:10,
	MULTI_USER:1
};
preset.confd = {
	CMD_SOCKET_ID:3,
	CMD_SOCKET_IP:"127.0.0.1",
	CMD_SOCKET_PORT:9000,
	CMS_EVENT_CODE:"QS",
	CMS_IP:"127.0.0.1",
	CMS_UPLOAD:"/app/f1/codeigniter/index.php/upload/",
	CMS_LIST:"/app/f1/codeigniter/index.php/upload/qsrank/",
	CMS_CLEAR_BOARD:"/app/f1/codeigniter/index.php/upload/qsrankclear/",
	CMS_REQUEST_QUEUE:"/app/f1/requestQueue.php",
	CMS_SAVE_QUEUE:"/app/f1/saveQueue.php",
	APP_INFINITE_TEST:"N",
	TIMEOUT:30,
	USE_FLAG:"Y",
	USE_CPU_OPPONENT:"N",
	FLAG_TXT:["Mercedes","Red Bull Racing","Ferrari","Force India","Williams","McLaren","Toro Rosso","Haas F1 Team","Renault","Sauber"],
	NUM_FLAG:10,
	MULTI_USER:1
};

tcsapp.appId = "au.com.thecreativeshop";


tcsapp.keyboardlistener = function(e){
	ipcRenderer.send('keypress', event.ctrlKey , event.key);
}
tcsapp.resizelistener = function(e){
//$$("screenRes").innerHTML = document.documentElement.clientWidth+"x"+document.documentElement.clientHeight;
}

tcsapp.thingsAfterConfigloaded = function(){
	game.init();
	setTimeout(function(){
		rb.init();
		ql.init();
		edmb.init();
	},100);
}

tcsapp.confKeys =  ["CMD_SOCKET_ID","CMD_SOCKET_IP","CMD_SOCKET_PORT","CMS_IP","CMS_CLEAR_BOARD","CMS_LIST","ROOT_PATH","APP_INFINITE_TEST"];
tcsapp.appId = "au.com.thecreativeshop.f1.leaderboard";
preset.default = "confp";
preset.confp = {
	CMD_SOCKET_ID:1,
	CMD_SOCKET_IP:"192.168.0.2",
	CMD_SOCKET_PORT:9000,
	CMS_IP:"192.168.0.2",
	CMS_CLEAR_BOARD:"/codeigniter/index.php/upload/qsrankclear/",
	CMS_LIST:"/codeigniter/index.php/upload/qsrank/",
	ROOT_PATH:"C:/PROJECTS/F1/Repository/Final/",
	APP_INFINITE_TEST:"N"
};
preset.confd = {
	CMD_SOCKET_ID:1,
	CMD_SOCKET_IP:"127.0.0.1",
	CMD_SOCKET_PORT:9000,
	CMS_IP:"127.0.0.1",
	CMS_CLEAR_BOARD:"/app/f1/codeigniter/index.php/upload/qsrankclear/",
	CMS_LIST:"/app/f1/codeigniter/index.php/upload/qsrank/",
	ROOT_PATH:"C:/AMURO/Workspace/F1/ReActionGame/PROJECTS/F1/Repository/Final/",
	APP_INFINITE_TEST:"N"
};
