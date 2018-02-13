importScript('./js/common/json2.js');
importScript('./js/common/TweenMax.min.js');
importScript('./js/common/CMS.js');
importScript('./js/common/Configuration.js');
importScript('./js/common/WebSocket.js');
importScript('./js/common/panelConf.js');
importScript('./js/common/panelDebug.js');


var {ipcRenderer, remote} = require('electron');
var main = remote.require("./app.js");

var tcsapp = {}
var preset = {};

tcsapp.pages = [];
tcsapp.confKeys =  ["CMD_SOCKET_ID","CMD_SOCKET_IP","CMD_SOCKET_PORT","CMS_IP","CMS_CLEAR_BOARD","CMS_LIST","ROOT_PATH","APP_INFINITE_TEST"];

tcsapp.previouspage = 0;
tcsapp.currentpage = 0;
tcsapp.isGameRunning = false;
tcsapp.isGameReady = false;

tcsapp.tcssocket = null;
tcsapp.panelDebug = null;
tcsapp.panelConf = null;
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


tcsapp.init = function(){

		this.panelDebug = new PanelDebug('panelDebug');
		this.panelConf  = new PanelConf('panelConf');
		this.tcssocket  = new TCSWebSocket();

		document.addEventListener("onConfigLoaded",()=>{
			this.panelDebug.init();
			this.panelConf.setKeys(this.confKeys);
			this.panelConf.init();

			if(confCtrl.initialReady){
				this.connectSocket();

			}else{
				this.panelConf.show();

			}
			game.init();
			setTimeout(function(){
				rb.init();
				ql.init();
				edmb.init();
			},100);

		});
		confCtrl.storage = "local";
		confCtrl.load();
}


	tcsapp.connectSocket = function(){
		this.tcssocket.setip(conf.CMD_SOCKET_ID,conf.CMD_SOCKET_IP,conf.CMD_SOCKET_PORT);
		this.tcssocket.connect();
	}

	tcsapp.reload = function(){
		location.reload();
	}

	tcsapp.paging = function(n){
	//log(":::::::::::::::::::::"+$$(pages[0]));
		for(i in this.pages){
			var page = this.pages[i];
			if(i == n){
				page.ready();
				page.show();
				page.start();
			}else{
				page.stop();
				page.hide();
				page.clear();
			}
		}

		this.previouspage = this.currentpage;
		this.currentpage = n;
	}


	/*
			document.body.addEventListener('touchmove',function(e)
			{
				e = e || window.event;
				var target = e.target || e.srcElement;
				//in case $altNav is a class:
				if (!target.className.match(/\bscrollable\b/))
				{
						e.returnValue = false;
						e.cancelBubble = true;
						if (e.preventDefault)
						{
								e.preventDefault();
								e.stopPropagation();
						}
						return false;//or return e, doesn't matter
				}
				//target is a reference to an $altNav element here, e is the event object, go mad
			},false);
	*/
