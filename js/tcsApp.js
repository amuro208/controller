importScript('./tcs/js/json2.js');
importScript('./tcs/js/TweenMax.min.js');
importScript('./tcs/js/CMS.js');
importScript('./tcs/js/Configuration.js');
importScript('./tcs/js/WebSocket.js');
importScript('./tcs/js/panelConf.js');
importScript('./tcs/js/panelDebug.js');


var tcsapp = {}
var preset = {};

tcsapp.pages = [];
tcsapp.confKeys = [];

tcsapp.previouspage = 0;
tcsapp.currentpage = 0;
tcsapp.isGameRunning = false;
tcsapp.isGameReady = false;

tcsapp.tcssocket = null;
tcsapp.panelDebug = null;
tcsapp.panelConf = null;
tcsapp.appId = "au.com.thecreativeshop";

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

tcsapp.init = function(){

		this.panelDebug = new PanelDebug('panelDebug');
		this.panelConf = new PanelConf('panelConf');
		this.panelConf.setKeys(this.confKeys);
		this.tcssocket = new TCSWebSocket();


		document.addEventListener("onConfigLoaded",()=>{
			this.panelDebug.init();
			this.panelConf.init();
			if(confCtrl.initialReady){
				this.connectSocket();

			}else{
				this.panelConf.show();
			}

			for(i in this.pages){
				this.pages[i].init();
			}
			this.paging(0);
		})
		confCtrl.load();

		for(var key in navigator){
			log("navigator."+key+":"+navigator[key]  );
		}

		window.addEventListener("resize",()=>{
			$$("screenRes").innerHTML = document.documentElement.clientWidth+"x"+document.documentElement.clientHeight;
		});


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




if(navigator.platform.indexOf("Linux")>-1){
	document.addEventListener("mousedown", function (e) {
				var docElm = document.documentElement;
				if (docElm.requestFullscreen) {
						docElm.requestFullscreen();
				}
				else if (docElm.mozRequestFullScreen) {
						docElm.mozRequestFullScreen();
				}
				else if (docElm.webkitRequestFullScreen) {
						docElm.webkitRequestFullScreen();
				}
				else if (docElm.msRequestFullscreen) {
						docElm.msRequestFullscreen();
				}
	});

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
