var tcsapp = {}

tcsapp.pages = [];
tcsapp.confKeys = [];
tcsapp.previouspage = 0;
tcsapp.currentpage = 0;

tcsapp.isGameRunning = false;
tcsapp.isGameReady = false;

tcsapp.tcssocket = null;
tcsapp.panelDebug = null;
tcsapp.panelConf = null;



tcsapp.init = function(){

		conf = {
			CMD_SOCKET_ID:1,
			CMD_SOCKET_IP:"127.0.0.1",
			CMD_SOCKET_PORT:9000,
			ROOT_PATH:"C:/AMURO/Workspace/TCSVideoPlayer/media"
		};

		this.panelDebug = new PanelDebug('panelDebug');
		this.panelConf = new PanelConf('panelConf');
		this.tcssocket = new TCSWebSocket();

		document.addEventListener("onConfigLoaded",()=>{
			this.panelDebug.init();
			this.panelConf.setKeys(conf);
			this.panelConf.init();

			if(confCtrl.initialReady){
				this.connectSocket();

			}else{
				this.panelConf.show();

			}
			FFMPEG.init();
			window.addEventListener('keydown', FFMPEG.keyboardlistener);
		})

		confCtrl.load();
}


tcsapp.connectSocket = function(){
	this.tcssocket.setip(conf.CMD_SOCKET_ID,conf.CMD_SOCKET_IP,conf.CMD_SOCKET_PORT);
	this.tcssocket.connect();
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
