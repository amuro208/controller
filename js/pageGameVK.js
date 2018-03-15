
	var PageGame = function(id){
		Page.call(this,id);
		this.photoId = "";
		this.totalTime = 30.0;
		this.timeRemain = 0;
		this.userScore = 0;;
		this.timerId;
		this.prevTime;
		this.userData = {};

	}

	PageGame.prototype = Object.create(Page.prototype);
	PageGame.prototype.constructor = PageGame;

	PageGame.prototype.init = function(){
		this.btnCancel = $$("btn-cancel");
		this.btnApprove = $$("btn-approve");
		this.btnBall = $$("btnCtrl1");
		this.iconBall = $$("btnCtrlBall");
		this.iconRnd = $$("btnCtrlRnd");
		this.iconBall.style.filter = "drop-shadow(0px 5px 10px #000)";
		document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
		window.addEventListener("keydown", this.keyboardlistener.bind(this));
	}
	PageGame.prototype.ready = function(){
		tcsapp.isGameReady = true;
		this.btnCancel.disabled = false;
		this.btnApprove.disabled = true;
		this.currKickIndex = 0;
    //this.btnBall.disabled = true;
		this.ballBtnEnable(false);
		this.setHeader("GAME CONTROL");
	}
	PageGame.prototype.keyboardlistener = function(e){
		console.log("keyboardlistener : "+e.key);
		if(e.key == "b"){
			this.ballBtnEnable(true);
		}
		if(e.key == "k"){
			this.ballBtnEnable(false);
		}
	}
	PageGame.prototype.onSocketMessage = function(e){
		console.log("onSocketMessage ??????  ::::::::::::::::::::::: "+e.detail);
		if(e.detail.cmd == "READY"){
			 tcsapp.isGameRunning = true;


		}else if(e.detail.cmd == "BALL_ENABLE"){
			//this.userScore++;
			//this.display();
			this.currKickIndex = e.detail.msg;
			this.ballBtnEnable(true);

			if(conf.APP_INFINITE_TEST == "Y"){
			  setTimeout(function(){tcsapp.tcssocket.send("ALL","BALL_READY","-")},5000);
				setTimeout(function(){tcsapp.tcssocket.send("ALL","KICK_TRACKER","1.0,0,1.0")},8000);
			}

		}else if(e.detail.cmd == "GAME_END"){
			//this.btnApprove.disabled = false;
			//if(conf.APP_INFINITE_TEST == "Y"){
			//	this.approve();
			//}

		}else if(e.detail.cmd == "KICK_TRACKER"){
			this.ballBtnEnable(false);
			//this.btnApprove.disabled = false;
			//if(conf.APP_INFINITE_TEST == "Y"){
			//	this.approve();
			//}

		}else if(e.detail.cmd == "GAME_RESULT"){
			tcsapp.isGameRunning = false;
			tcsapp.tcssocket.send("ALL","GAME_END","-");
			setTimeout(function(){this.btnApprove.disabled = false;}.bind(this),2000);

			if(conf.APP_INFINITE_TEST == "Y"){
				setTimeout(this.approve.bind(this),6000);
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
			page_list.updateUserStatus();
		}
	}


	PageGame.prototype.userReady = function(){

		if(page_list.curUserIndex>-1 && page_list.totalUser>0){

			clearlog();

			page_list.tmpCurIndex  = page_list.curUserIndex;
			this.userData = user.queuedata.userqueues[page_list.curUserIndex];

			this.photoId = "user_"+new Date().getTime();

			var fnames = this.userData.userFirstName.split("|");
			var lnames = this.userData.userLastName.split("|");
			var emails = this.userData.userEmail.split("|");
			var flags  = this.userData.userCountry.split("|");

			var levels = ["false","false"];//this.userData.userOption1.split("|");

			var fstr = [];
			var fnum = [];
			var nstr = [];
			var totalUser = 0;
			var validUser = 0;
			for(var i = 0; i<conf.MULTI_USER; i++){
				if(fnames[i]==""){
					if(conf.USE_CPU_OPPONENT == "Y"){
						fstr[i] = "<img src = '"+conf.FLAG_ROOT+"xx.png'/>";
						nstr[i] = "CPU";
						totalUser++;
					}else{
						fstr[i] = "";
						nstr[i] = "";
					}
					fnum[i] = 0;

				}else{
					var flag = flags[i];
					 totalUser++;
					 validUser = i;
					 fnum[i] = flag;
					 fstr[i] = "<img src = '"+conf.FLAG_ROOT+flag+".png'/>";
					 nstr[i] = fnames[i]+" "+lnames[i];
				}
			}

			if(totalUser==2){
				$$("userGame1").style.display = "inline-block";
				$$("userGame2").style.display = "inline-block";
				$$("userVS").style.display = "inline-block";
				$$("userGame1").innerHTML = "<div class='user-gamecard'><div class='user-gamecard-flag'>"+fstr[0]+"</div><div class='uname'>"+nstr[0]+(levels[0]=="true"?"*":"")+"</div></div>";
				$$("userGame2").innerHTML = "<div class='user-gamecard'><div class='user-gamecard-flag'>"+fstr[1]+"</div><div class='uname'>"+nstr[1]+(levels[1]=="true"?"*":"")+"</div></div>";
			}else{
				$$("userGame1").style.display = "inline-block";
				$$("userGame1").innerHTML = "<div class='user-gamecard'><div class='user-gamecard-flag'>"+fstr[validUser]+"</div><div class='uname'>"+nstr[validUser]+(levels[validUser]=="true"?"*":"")+"</div></div>";
				$$("userGame2").style.display = "none";
				$$("userVS").style.display = "none";
			}

			tcsapp.tcssocket.send("ALL","READY",nstr[0]+","+fnum[0]+","+this.photoId+","+levels[0]+"|"+nstr[1]+","+fnum[1]+","+this.photoId+","+levels[1]);

		  $$("gameButtons").style.display = "block";

			this.ballBtnEnable(false);

			tcsapp.paging(2);

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

		if(s == "again"){
			tcsapp.tcssocket.send("ALL","RETRY","");
		}else if(s == "ball"){
			tcsapp.tcssocket.send("ALL","BALL_READY","-");
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
				setTimeout(function(){this.userReady();}.bind(this),6000);
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
		postObj.userEDMTNC1 = this.userData.userOption2 == "true"?"Y":"N";
		postObj.userEDMTNC2 = this.userData.userOption3 == "true"?"Y":"N";
		//userData.videoId = this.videoId;
		postObj.userScore = 100;
		//postObj.userTitle = this.userData.userTitle;
		postObj.userCountryId = this.userData.userCountry;
		postObj.userPostcode = this.userData.userPostcode;
		postObj.userFirstName = this.userData.userFirstName;
		postObj.userLastName = this.userData.userLastName;
		postObj.userName = this.userData.userFirstName+" "+this.userData.userLastName;
		postObj.userEmail = this.userData.userEmail;
		for(var key in postObj)log(key+" : "+postObj[key]);

		cms.gameApprove(this,postObj,function(data){this.onResponseXML(data)}.bind(this));

	}
