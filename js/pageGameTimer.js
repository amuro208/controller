
var PageGameTimer = function(id){
	Page.call(this,id);
	this.totalTime = 30.0;
	this.timeRemain = 0;
	this.timerId;
	this.prevTime;
}

PageGameTimer.prototype = Object.create(Page.prototype);
PageGameTimer.prototype.constructor = PageGameTimer;
PageGameTimer.prototype.init = function(){
	document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
	this.ts1 = $$("ts1");
	this.ts2 = $$("ts2");
	this.tms1 = $$("tms1");
	this.tms2 = $$("tms2");
	this.tms3 = $$("tms3");
	tcsapp.isGameRunning = false;
	tcsapp.isGameReady = false;
	tcsapp.paging(0);
}

PageGameTimer.prototype.onSocketMessage = function(e){
	console.log("onSocketMessage :: "+e.detail.cmd +":"+e.detail.msg);
	if(e.detail.cmd == "READY"){
		clearlog();
		tcsapp.isGameReady = true;
		if(this.timerId)clearInterval(this.timerId);
		this.totalTime = conf.TIMEOUT;
		this.timeRemain = this.totalTime*1000;
		this.display();
		tcsapp.paging(1);

	}else if(e.detail.cmd == "START"){
		if(tcsapp.isGameRunning)return;
		tcsapp.isGameRunning = true;
		if(this.timerId)clearInterval(this.timerId);
		this.prevTime = new Date().getTime();
		this.timerId = setInterval(this.calculateTime,30,this);

	}else if(e.detail.cmd == "STOP" || e.detail.cmd == "GAME_COMPLETE" || e.detail.cmd == "SUBMIT_ERROR"){
		if(this.timerId)clearInterval(this.timerId);
		tcsapp.isGameRunning = false;
		tcsapp.isGameReady = false;
		tcsapp.paging(0);
	}

}

PageGameTimer.prototype.calculateTime = function(_this){
	if(!tcsapp.isGameRunning)return;
	var curTime = new Date().getTime();
		_this.timeRemain -= (curTime - _this.prevTime);
		_this.prevTime = curTime;

	if(_this.timeRemain<0){
		_this.timeRemain = 0;
		tcsapp.tcssocket.send("ALL","TIMEOUT","-");
		tcsapp.isGameRunning = false;
		tcsapp.paging(2);
		clearInterval(_this.timerId);
	}else{

	}
	_this.display();

}
PageGameTimer.prototype.display = function(){

	var tm = Math.floor(this.timeRemain/(60*1000));
	var ts  = this.timeRemain%(60*1000)/1000;
	var tms = this.timeRemain%1000;

	var tsStr = ts<10?"0"+ts:""+ts;
	var tmsStr = tms<10?"00"+tms:(tms<100?"0"+tms:""+tms);
	this.ts1.innerHTML = tsStr.charAt(0);
	this.ts2.innerHTML = tsStr.charAt(1);
	this.tms1.innerHTML = tmsStr.charAt(0);
	this.tms2.innerHTML = tmsStr.charAt(1);
	this.tms3.innerHTML = tmsStr.charAt(2);

}
