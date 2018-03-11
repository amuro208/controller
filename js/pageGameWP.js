
	var PageGame = function(id){
		Page.call(this,id);
		this.photoId = "";
		this.videoId = "";
		this.userData = {};
	}

	PageGame.prototype = Object.create(Page.prototype);
	PageGame.prototype.constructor = PageGame;

	PageGame.prototype.init = function(){
		this.isinCameraStayupProcess = false;
		this.startAfterStayupProcessDone = false;
		this.btnCancel = $$("btn-cancel");
		this.btnApprove = $$("btn-approve");
		this.btnBall = $$("btnCtrl1");
		this.iconBall = $$("btnCtrlBall");
		this.iconRnd = $$("btnCtrlRnd");
		this.iconBall.style.filter = "drop-shadow(0px 5px 10px #000)";

		document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
	}
	PageGame.prototype.ready = function(){
		tcsapp.isGameReady = true;
		this.btnCancel.disabled = false;
		this.btnApprove.disabled = true;

		if(this.isinCameraStayupProcess)this.ballBtnEnable(false);
		else this.ballBtnEnable(true);

		console.log("GAME ready");
		this.setHeader("GAME CONTROL");
	}
	PageGame.prototype.onSocketMessage = function(e){
		if(e.detail.cmd == "START"){
			tcsapp.isGameRunning = true;

		}else if(e.detail.cmd == "GAME_END"){
			this.btnApprove.disabled = false;
			tcsapp.isGameRunning = false;
			if(conf.APP_INFINITE_TEST == "Y"){
				this.approve();
			}

		}else if(e.detail.cmd == "ENCODING_DONE"){
			//setTimeout()

		}else if(e.detail.cmd == "STAYUP_PROCESS_START"){
			this.isinCameraStayupProcess = true;
			if(!tcsapp.isGameRunning){
				this.ballBtnEnable(false);
			}
		}else if(e.detail.cmd == "STAYUP_PROCESS_DONE"){
			this.isinCameraStayupProcess = false;
			if(!tcsapp.isGameRunning){
				this.ballBtnEnable(true);
				if(conf.APP_INFINITE_TEST == "Y" && this.startAfterStayupProcessDone){
					this.startAfterStayupProcessDone = false;
					tcsapp.tcssocket.send("ALL","START","-");
				}
			}
		}else if(e.detail.cmd == "STOP"){
			tcsapp.isGameRunning = false;
			tcsapp.isGameReady = false;

		}
	}

	PageGame.prototype.cancel = function(){
		if(confirm("Are you sure you want to cancel this game?")){
			tcsapp.paging(1);
			if(this.timerId)clearInterval(this.timerId);
			tcsapp.tcssocket.send("ALL","STOP","-");
		}
	}


	PageGame.prototype.userReady = function(){

		if(page_list.curUserIndex>-1 && page_list.totalUser>0){

			clearlog();

			page_list.tmpCurIndex  = page_list.curUserIndex;
			this.userData = user.queuedata.userqueues[page_list.curUserIndex];

			this.photoId = "user_"+new Date().getTime();
			this.videoId = "user_"+new Date().getTime();

			var fnames = this.userData.userFirstName.split("|");
			var lnames = this.userData.userLastName.split("|");
			var emails = this.userData.userEmail.split("|");
			var flags  = this.userData.userFlag.split("|");
			var levels = this.userData.userOption1.split("|");

			if(conf.MULTI_USER==2){


			}else{
				var flag = isNaN(parseInt(flags[0]))?0:parseInt(flags[0]);
				var fStr1 = "<img src = './img/flags/flag"+flag+".png'/>";
				var un1 = fnames[0]+" "+lnames[0];
				if(conf.USE_FLAG == "N"){
					fStr1 = "<img src = './img/flags/flag0.png'/>";
				}
				$$("userGame1").innerHTML = "<div class='user-gamecard'><div class='user-gamecard-flag'>"+fStr1+"</div><div class='uname'>"+un1+"</div></div>";
				tcsapp.tcssocket.send("ALL","READY",un1+","+flag+","+this.photoId+","+levels[0]+"|");
				$$("userGame2").style.display = "none";
			}

		  $$("gameButtons").style.display = "block";

			TweenMax.to($$("btnCtrlBall"), 0.6, {top:"0px", repeat:-1, repeatDelay:1.0, ease:Bounce.easeOut});
			$$("btnCtrlBall").style.filter = "drop-shadow(0px 5px 10px #000)";
	    $$("btnCtrlRnd").style.filter = "saturate(0)";

			tcsapp.paging(2);

			if(conf.APP_INFINITE_TEST == "Y"){
					setTimeout(function(){
					  if(this.isinCameraStayupProcess){
							this.startAfterStayupProcessDone = true;
						}else{
							tcsapp.tcssocket.send("ALL","START","-");
						}
					}.bind(this),2000);
			}
			//dispatchEvent(new PanelEvent(PanelEvent.NEXT_STEP,null,false,false));
		}else{
			alert("No user selected!");
		}
	}

	PageGame.prototype.ballBtnEnable = function(b){
		if(b){
			this.iconBall.style.top = "-33px";
			this.btnBall.style.opacity = 1;
			this.btnBall.classList.remove("disable");
			this.iconRnd.style.filter = "saturate(1)";
			TweenMax.to(this.iconBall, 0.6, {top:"0px", repeat:-1, repeatDelay:1.0, ease:Bounce.easeOut});
		}else{
			this.iconBall.style.top = "0px";
			this.btnBall.style.opacity = 0.7;
			this.btnBall.classList.add("disable");
			this.iconRnd.style.filter = "saturate(0)";
			TweenMax.killTweensOf(this.iconBall);
		}
	}

  PageGame.prototype.gameBtnControl = function(s){

		if(s == "start"){
			tcsapp.tcssocket.send("ALL","START","-");
		}else if(s == "again"){
			tcsapp.tcssocket.send("ALL","RETRY","");
		}else if(s == "level"){
			tcsapp.tcssocket.send("ALL","MODE","NORMAL");
		}else if(s == "fake"){
			tcsapp.tcssocket.send("ALL","KICK_TRACKER","1.0,0,1.0");
		}

	}

	PageGame.prototype.onResponseXML = function(data){
		var xml = parseXml(data);
		log("onResponseXML :: "+data);
		var result = xml.getElementsByTagName("result_data")[0].childNodes[0].getAttribute("status");
		if(result == "success"){
			log("SUBMIT OK");
			tcsapp.paging(1);
			tcsapp.tcssocket.send("ALL","GAME_COMPLETE","-");
			page_list.updateUserStatus();
			if(conf.APP_INFINITE_TEST == "Y"){
				setTimeout(function(){this.userReady();}.bind(this),(Math.random()*60*50+60)*1000);
			}
		}else{
			if(confirm("Error Occured : "+data)) {
				log("SUBMIT ERROR");
				tcsapp.paging(1);
				tcsapp.tcssocket.send("ALL","SUBMIT_ERROR","-");
			}
		}
		this.btnCancel.disabled = false;

	}

	PageGame.prototype.approve = function(){

		if(tcsapp.isGameRunning){alert("Game still running .. ");return;}

		this.btnCancel.disabled = true;
		this.btnApprove.disabled = true;

		var postObj = {};
		postObj.eventCode = conf.CMS_EVENT_CODE;
		postObj.videoId = this.photoId;
		postObj.userEDMTNC = this.userData.userOption2 == "true"?"Y":"N";
		//userData.videoId = this.videoId;
		//postObj.userScore = this.userScore;
		postObj.userAge = this.userData.userAge;
		postObj.userMobile = this.userData.userMobile;
		//postObj.userCountryId = this.userData.userFlag;
		postObj.userFirstName = this.userData.userFirstName;
		postObj.userLastName = this.userData.userLastName;
		postObj.userName = this.userData.userFirstName+" "+this.userData.userLastName;
		postObj.userEmail = this.userData.userEmail;
		for(var key in postObj)log(key+" : "+postObj[key]);

		cms.gameApprove(this,postObj,function(data){this.onResponseXML(data)}.bind(this));

	}
