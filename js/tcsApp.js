importScript('./tcs/js/json2.js');
importScript('./tcs/js/TweenMax.min.js');
importScript('./tcs/js/CMS.js');
importScript('./tcs/js/Configuration.js');
importScript('./tcs/js/WebSocket.js');
importScript('./tcs/js/panelConf.js');
importScript('./tcs/js/panelDebug.js');

var {ipcRenderer, remote} = require('electron');
var main = remote.require("./app.js");

	var tcsapp = {}
  var preset = {};

	tcsapp.pages = [];
	tcsapp.confKeys = ["CMD_SOCKET_ID","CMD_SOCKET_IP","CMD_SOCKET_PORT","CMS_IP","CMS_LIST","ROOT_PATH","MEDIA_SOURCE","SYNCMODE","SYNCMODE_MASTER"];
	tcsapp.previouspage = 0;
  tcsapp.currentpage = 0;

  tcsapp.isGameRunning = false;
	tcsapp.isGameReady = false;

  tcsapp.tcssocket = null;
	tcsapp.panelDebug = null;
	tcsapp.panelConf = null;

	tcsapp.appId = "au.com.thecreativeshop.mplayer";

	preset.default = "confp";
	preset.confp = {
		CMD_SOCKET_ID:1,
		CMD_SOCKET_IP:"127.0.0.1",
		CMD_SOCKET_PORT:9000,
		CMS_IP:"127.0.0.1",
		CMS_LIST:"/app/codeigniter/index.php/upload/qsrank/",
		ROOT_PATH:"C:/AMURO/Workspace/TCSVideoPlayer/media",
		MEDIA_SOURCE:"LOCAL",
		SYNCMODE:"N",
		SYNCMODE_MASTER:"N"
	};
	preset.confd = {
		CMD_SOCKET_ID:1,
		CMD_SOCKET_IP:"127.0.0.1",
		CMD_SOCKET_PORT:9000,
		CMS_IP:"127.0.0.1",
		CMS_LIST:"/app/codeigniter/index.php/upload/qsrank/",
		ROOT_PATH:"C:/AMURO/Workspace/TCSVideoPlayer/media/",
		MEDIA_SOURCE:"LOCAL",
		SYNCMODE:"N",
		SYNCMODE_MASTER:"N"
	};

	tcsapp.init = function(){

			this.panelDebug = new PanelDebug('panelDebug');
			this.panelConf = new PanelConf('panelConf');
			this.tcssocket = new TCSWebSocket();

			document.addEventListener("onConfigLoaded",()=>{

				this.panelDebug.init();
				this.panelConf.setKeys(this.confKeys);
				this.panelConf.init();

				if(confCtrl.initialReady){
					this.connectSocket();

				}else{
					this.panelConf.show();

				}
				mplayer.init();
			})

			confCtrl.storage = "local";
			confCtrl.load();
			window.addEventListener("keydown", this.keyboardlistener);
	}

	tcsapp.keyboardlistener = function(e){
	  ipcRenderer.send('keypress', event.ctrlKey , event.key);
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
