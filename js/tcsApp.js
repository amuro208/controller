
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
	},100);
}

tcsapp.confKeys =  ["CMD_SOCKET_ID","CMD_SOCKET_IP","CMD_SOCKET_PORT","CMS_IP","CMS_CLEAR_BOARD","CMS_LIST","ROOT_PATH","APP_INFINITE_TEST"];
tcsapp.appId = "au.com.thecreativeshop.pf.leaderboard";
preset.default = "confp";
preset.confp = {
	CMD_SOCKET_ID:1,
	CMD_SOCKET_IP:"192.168.0.71",
	CMD_SOCKET_PORT:9000,
	CMS_IP:"192.168.0.71",
	CMS_CLEAR_BOARD:"/codeigniter/index.php/upload/qsrankclear/",
	CMS_LIST:"/codeigniter/index.php/upload/qsrank/",
	ROOT_PATH:"C:/PROJECTS/PacificFair/Repository/",
	APP_INFINITE_TEST:"N"
};
preset.confd = {
	CMD_SOCKET_ID:1,
	CMD_SOCKET_IP:"127.0.0.1",
	CMD_SOCKET_PORT:9000,
	CMS_IP:"127.0.0.1",
	CMS_CLEAR_BOARD:"/app/pf/tcs/codeigniter/index.php/upload/qsrankclear/",
	CMS_LIST:"/app/pf/tcs/codeigniter/index.php/upload/qsrank/",
	ROOT_PATH:"C:/AMURO/Workspace/PacificFair/ReactionWall/Repository/",
	APP_INFINITE_TEST:"N"
};
