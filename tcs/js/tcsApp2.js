
var {ipcRenderer, remote} = require('electron');
var main = remote.require("./app.js");


importScript('./tcs/js/json2.js');
importScript('./tcs/js/TweenMax.min.js');
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

};
preset.confd = {

};

tcsapp.init = function(){
		console.log("TCS APP INITIALISED");
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

			for(i in this.pages){
				this.pages[i].init();
			}

			this.thingsAfterConfigloaded();
		})

		confCtrl.storage = "local";
		confCtrl.load();
		window.addEventListener("keydown", this.keyboardlistener);
    window.addEventListener("resize",this.resizelistener);

		for(var key in navigator){
			log("navigator."+key+":"+navigator[key]  );
		}

}
tcsapp.keyboardlistener = function(e){
	ipcRenderer.send('keypress', event.ctrlKey , event.key);
}

tcsapp.resizelistener = function(e){

}

tcsapp.thingsAfterConfigloaded = function(){

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
