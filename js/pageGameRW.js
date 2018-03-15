
	var PageGame = function(id){
		Page.call(this,id);
		this.photoId = "";
		this.videoId = "";
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
		this.ts1 = $$("ts1");
		this.ts2 = $$("ts2");
		this.tms1 = $$("tms1");
		this.tms2 = $$("tms2");
		this.tms3 = $$("tms3");
		this.cnt1 = $$("cnt1");
		this.cnt2 = $$("cnt2");
		document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
	}
	PageGame.prototype.ready = function(){
		tcsapp.isGameReady = true;
		this.btnCancel.disabled = false;
		this.btnApprove.disabled = false;

		console.log("GAME ready");
		this.setHeader("GAME CONTROL");
	}
	PageGame.prototype.onSocketMessage = function(e){
		if(e.detail.cmd == "TIMEOUT"){
				tcsapp.isGameRunning = false;
				tcsapp.isGameReady = false;

		}else if(e.detail.cmd == "START"){
			tcsapp.isGameRunning = true;
			if(this.timerId)clearInterval(this.timerId);
			this.prevTime = new Date().getTime();
			this.timerId = setInterval(this.calculateTime,30,this);

		}else if(e.detail.cmd == "ADDPOINT"){
			this.userScore++;
			this.display();

		}else if(e.detail.cmd == "GIF_DONE"){
			this.btnApprove.disabled = false;
			if(conf.APP_INFINITE_TEST == "Y"){
				this.approve();
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

		// var docElm = document.documentElement;
		// if (docElm.requestFullscreen) {
		// 		docElm.requestFullscreen();
		// }
		// else if (docElm.mozRequestFullScreen) {
		// 		docElm.mozRequestFullScreen();
		// }
		// else if (docElm.webkitRequestFullScreen) {
		// 		docElm.webkitRequestFullScreen();
		// }
		// else if (docElm.msRequestFullscreen) {
		// 		docElm.msRequestFullscreen();
		// }


		if(page_list.curUserIndex>-1 && page_list.totalUser>0){

			clearlog();

			page_list.tmpCurIndex  = page_list.curUserIndex;
			this.userData = user.queuedata.userqueues[page_list.curUserIndex];

			this.photoId = "user_"+new Date().getTime();
			this.videoId = "user_"+new Date().getTime();

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

			this.userScore = 0;

			if(this.timerId)clearInterval(this.timerId);
			this.totalTime = conf.TIMEOUT;
			this.timeRemain = this.totalTime*1000;
			this.display();

			$$("gameInfo").style.display = "none";
			$$("gtimeout").style.display = "none";
			$$("gtimer").style.display = "block";
		  $$("gameButtons").style.display = "block";

			TweenMax.to($$("btnCtrlBall"), 0.6, {top:"0px", repeat:-1, repeatDelay:1.0, ease:Bounce.easeOut});
			$$("btnCtrlBall").style.filter = "drop-shadow(0px 5px 10px #000)";
	    $$("btnCtrlRnd").style.filter = "saturate(0)";

			tcsapp.paging(2);

			if(conf.APP_INFINITE_TEST == "Y"){
					setTimeout(function(){
						$$("gameInfo").style.display = "block";
					  $$("gameButtons").style.display = "none";
					  tcsapp.tcssocket.send("ALL","START","-");},2000);
			}
			//dispatchEvent(new PanelEvent(PanelEvent.NEXT_STEP,null,false,false));
		}else{
			alert("No user selected!");
		}
	}

  PageGame.prototype.activeBtn = function(btn,a){
		if(a)btn.classList.add("active");
		else btn.classList.remove("active");
	}


  PageGame.prototype.gameBtnControl = function(s){

		if(s == "start"){
			$$("gameInfo").style.display = "block";
			$$("gameButtons").style.display = "none";
			tcsapp.tcssocket.send("ALL","START","-");

		}else if(s == "again"){
			tcsapp.tcssocket.send("ALL","RETRY","");
		}else if(s == "level"){
			tcsapp.tcssocket.send("ALL","MODE","NORMAL");
		}else if(s == "fake"){
			tcsapp.tcssocket.send("ALL","KICK_TRACKER","1.0,0,1.0");
		}

	}


	PageGame.prototype.calculateTime = function(_this){
		var curTime = new Date().getTime();
		_this.timeRemain -= (curTime - _this.prevTime);
		_this.prevTime = curTime;
		if(_this.timeRemain<0){
			_this.timeRemain = 0;
			$$("gtimeout").style.display = "block";
			$$("gtimer").style.display = "none";
			//$$("gcounter").style.display = "none";
			clearInterval(_this.timerId);
		}
		_this.display();
	}

	PageGame.prototype.display = function(){
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

		var scoreStr = this.userScore<10?"0"+this.userScore:""+this.userScore;
		this.cnt1.innerHTML = scoreStr.charAt(0);
		this.cnt2.innerHTML = scoreStr.charAt(1);

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
		postObj.photoId = this.photoId;
		postObj.userEDMTNC1 = this.userData.userOption2 == "true"?"Y":"N";
		postObj.userEDMTNC2 = this.userData.userOption3 == "true"?"Y":"N";
		//userData.videoId = this.videoId;
		postObj.userScore = this.userScore;
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
