
	var PageUserList = function(id){
		Page.call(this,id);
		this.curUserIndex = 0;
		this.tmpCurIndex = -1;
		this.totalUser = 0;
	  this.tw;
		this.cw;
		this.isScrolling = false;
		this.mouseDown = false;
		this.scrollPrevX = 0;

		/*display elements*/
		this.blockUtils = null;
		this.containerWrapper = null;
		this.containerCropFrame = null;
		this.containerInner = null;
		this.btnReady = null;
		this.screenRes = null;
		this.userStatusUsers = null;
		this.userStatusScroll = null;
		this.thumbStyles = ["normal","skipped","dimmed"];


	}


	PageUserList.prototype = Object.create(Page.prototype);
  PageUserList.prototype.constructor = PageUserList;
	PageUserList.prototype.init = function(){

		document.addEventListener('touchmove',function(e)
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
		
		this.blockUtils         = $$("blockUtils");
		this.containerWrapper   = $$("thumbContainerWrapper");
		this.containerCropFrame = $$("thumbContainerCropFrame");
		this.containerInner 	  = $$("thumbContainerInner");

		this.btnReady				  = $$("btn-ready");
		this.screenRes        = $$("screenRes");
		this.userStatusUsers      = $$("userStatusUsers");
		this.userStatusScroll     = $$("userStatusScroll");
		this.tw               = 244;
		document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
		document.addEventListener('mouseup',this.scrollEnd.bind(this),false);
		document.addEventListener('touchend',this.scrollEnd.bind(this),false);
		this.containerWrapper.addEventListener('mousedown', this.scrollStart.bind(this),false);
		this.containerWrapper.addEventListener('touchstart', this.scrollStart.bind(this),false);
		this.containerWrapper.addEventListener('mousemove',this.scrolling.bind(this),false);
		this.containerWrapper.addEventListener('touchmove',this.scrolling.bind(this),false);

		this.btnReady.disabled = true;

		this.blockUtils.innerHTML = '<div class="hidden-button rt" onclick="toggleOnOff(\'utilBtns\')" alt = "Toggle Utils"></div>\
    <div id = "utilBtns" style="display:none; z-index:1001; position:absolute; width:200px; top:55px; right:0px; text-align:right">\
      <button onclick="page_list.saveQueueAtServer()"     class="btn btn-sm btn-default" style="width:160px;">Save user queues</button><br>\
      <button onclick="page_list.deleteQueue(true)"       class="btn btn-sm btn-default" style="width:160px;">Delete user queues</button><br>\
      <button onclick="page_list.clearBoard()"            class="btn btn-sm btn-default" style="width:160px;">Clear Leader board</button>\
    </div>';

		cms.getQueue(this,{"appid":tcsapp.appId},function(data){
			this.initUserQueueWithData(data);
		}.bind(this));
		//document.documentElement.style.position = "fixed";
		//document.documentElement.style.overFlow = "hidden";
		//document.body.style.position = "fixed";
		//document.body.style.overFlow = "hidden";
		//this.screenRes.innerHTML = window.innerWidth+":"+window.innerHeight;
	}

	PageUserList.prototype.ready = function(){
		this.setHeader("USER QUEUE");
	}
  /*Socket Message*/
	PageUserList.prototype.onSocketMessage = function(e){
		if(e.detail.cmd == "USERDATA"){
			this.addUserData(e.detail.msg);
			tcsapp.tcssocket.send("ALL","USERDATA_RECEIVED",this.getNumberInQueue());
		}
	}
	/*Get UserQueue*/
	// PageUserList.prototype.getQueueFromLocalStorage = function(){
	// 	if (typeof(Storage) !== "undefined") {
	// 		this.initUserQueueWithData(localStorage.getItem(tcsapp.appId+".userqueues"));
	// 	}
	// }
	PageUserList.prototype.getQueueFromServer = function(){
		if(confirm("Are you sure you want to bring user queues from server?")){
			  this.deleteQueueUI();
 	 			cms.getQueue(this,{"appid":tcsapp.appId},function(data){
					this.initUserQueueWithData(data);
				}.bind(this));
			//}
		}
  }

	/*Initialise UserQueue*/
	PageUserList.prototype.initUserQueueWithData = function(data){
		console.log("initUserQueueWithData : "+data);
		if(data != null){
			user.queuedata = JSON.parse(data);
			for(var i = 0;i<user.queuedata.userqueues.length;i++){
				if(user.queuedata.userqueues[i] == null){
					user.queuedata.userqueues.splice(i,1);
				}else{
					this.addThumbnail(user.queuedata.userqueues[i]);
				}
			}
			this.totalUser = user.queuedata.userqueues.length;
			this.setCurUserIndex();
			this.thumbnailOrdering();
			this.displayStatus();
		}
		this.getNumberInQueue();
	}

	PageUserList.prototype.saveQueueAtServer = function(){
		  var obj = {userQueues:JSON.stringify(user.queuedata),appid:tcsapp.appId};
			cms.saveQueue(this,obj,function(){
			 console.log("Queue Saved!"+obj);
		 }.bind(this));
	}

	// PageUserList.prototype.saveQueueAtLocalStorage = function(){
	// 	var jstr = JSON.stringify(user.queuedata);
	// 	localStorage.setItem(tcsapp.appId+".userqueues", jstr );
	// }

	PageUserList.prototype.clearBoard = function(){
		  if(confirm("Are you sure you want to reset this leader board?")){
						cms.clearBoard(this,{},function(data){
					  tcsapp.tcssocket.send("ALL","BOARD_CLEARD","-");
				}.bind(this));
		}
	}
  PageUserList.prototype.deleteQueueUI = function(chk){
		for(var i = 0;i<user.queuedata.userqueues.length;i++){
			this.deleteThumbnail(user.queuedata.userqueues[i]);
		}
		user.queuedata.userqueues = [];
		this.totalUser = 0;
		this.setCurUserIndex();
		this.displayStatus();
	}
	PageUserList.prototype.deleteQueue = function(chk){
		var bool = true;
		if(chk)bool = confirm("Are you sure you want to delete user queues?");
		if(bool){
			this.deleteQueueUI();
			this.saveQueueAtServer();
		}
	}

	/*Manipulates UserData*/

	PageUserList.prototype.addUserData = function(info){
			var uinfos = info.split(",");
			var uobj = {"status":0,
			"userFirstName":uinfos[0],
			"userLastName":uinfos[1],
			"userEmail":uinfos[2],
			"userFlag":uinfos[3],
			"userMobile":uinfos[4],
			"userPostcode":uinfos[5],
			"userOption1":uinfos[6],
			"userOption2":uinfos[7],
			"userOption3":uinfos[8],
			"userTitle":uinfos[9],
			"thumb":null};
			user.queuedata.userqueues.push(uobj);
			this.saveQueueAtServer();
			//this.saveQueueAtLocalStorage();
			this.totalUser = user.queuedata.userqueues.length;
			this.addThumbnail(uobj);
			if(this.currentpage == 1){
				this.setCurUserIndex();
				this.thumbnailOrdering();
			}
			this.displayStatus();
	}

	PageUserList.prototype.deleteThumbnail = function(obj){
		if(obj && obj.thumb){
			this.containerInner.removeChild(obj.thumb);
		}
		var cn = this.containerInner.children;
		this.containerInner.style.width = cn.length*this.tw+"px";
	}

	PageUserList.prototype.addThumbnail = function(obj){
		log("addThumbnail : "+user.queuedata.userqueues.length);
			var thumb = document.createElement("DIV");

			//thumb.add
			if(obj != null){
				//userFirstName,userLastName,userEmail,userFlag,userMobile,userPostcode,userOption1,userOption2
				var fnames = obj.userFirstName.split("|");
				var lnames = obj.userLastName.split("|");
				var flags  = obj.userFlag.split("|");
				var levels = obj.userOption1.split("|");

				if(conf.MULTI_USER==2){
					console.log("isNaN(parseInt(flags[1])) ::: "+isNaN(parseInt(flags[1])));
					var flag1 = isNaN(parseInt(flags[0]))?0:parseInt(flags[0]);
					var flag2 = isNaN(parseInt(flags[1]))?0:parseInt(flags[1]);
					var fStr1="";
					var fStr2="";
					var nStr1="";
					var nStr2="";


					if(flag1 == 0){
						if(conf.USE_CPU_OPPONENT == "Y"){
							fStr1 = "<img src = './img/flags/flag0.png'/>";
							nStr1 = "<input type='text' class='uname noselect ' readonly='true' value='CPU'>";
						}else{
							fStr1 = "";
							nStr1 = "";
						}
					}else{
						fStr1 = "<img src = './img/flags/flag"+flag1+".png'/>";
						nStr1 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[0]+">\
										 <input type='text' class='uname noselect' readonly='true' value="+lnames[0]+">";
					}

					if(flag2 == 0){
						if(conf.USE_CPU_OPPONENT == "Y"){
							fStr2 = "<img src = './img/flags/flag0.png'/>";
							nStr2 = "<input type='text' class='uname noselect ' readonly='true' value='CPU'>";
						}else{
							fStr2 = "";
							nStr2 = "";
						}
					}else{
						fStr2 = "<img src = './img/flags/flag"+flag2+".png'/>";
						nStr2 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[1]+">\
										 <input type='text' class='uname noselect' readonly='true' value="+lnames[1]+">";
					}

					if(conf.USE_FLAG == "N"){
						fStr1 = "<img src = './img/flags/flag0.png'/>";
						fStr2 = "<img src = './img/flags/flag0.png'/>";
					}

					thumb.innerHTML = "\
					<div class='overlay'></div>\
					<div class='inner-multi'>\
					<div class='flag-multi'>"+fStr1+"</div>\
					<div class='name-multi'>"+nStr1+"</div>\
					</div>\
					<div class='line'></div>\
					<div class='inner-multi'>\
					<div class='flag-multi'>"+fStr2+"</div>\
					<div class='name-multi'>"+nStr2+"</div>\
					</div>";


				}else{
					var flag1 = isNaN(parseInt(flags[0]))?0:parseInt(flags[0]);

					if(flag1 == 0){
							flag1 = 1;
							fnames[0] = "none";
							lnames[0] = "";
							levels[0] = "false";
							//return;
					}

					var fStr1 = "<img src = './img/flags/flag"+flag1+".png'/><br><span>"+conf.FLAG_TXT[flag1-1]+"</span>";
					var nStr1 = "<input type='text' class='uname noselect' readonly='true' value="+fnames[0]+">\
											 <input type='text' class='uname noselect' readonly='true' value="+lnames[0]+(levels[0]=="true"?"*":"")+">";

					if(conf.USE_FLAG == "N"){
 						fStr1 = "<img src = './img/flags/flag0.png'/>";
 					}

					thumb.innerHTML = "\
					<div class='overlay'></div>\
					<div class='inner-single'>\
					<div class='flag-single'>"+fStr1+"</div>\
					<div class='name-single'>"+nStr1+"</div>\
					</div>";
				}

				 obj.thumb = thumb;
				 this.thumbnailStyle(thumb,this.thumbStyles[obj.status]);

			}else{
				 this.thumbnailStyle(thumb,"normal");
			}

			this.containerInner.appendChild(thumb);
			var cn = this.containerInner.children;
			this.containerInner.style.width = cn.length*this.tw+"px";

			this.thumbnailOrdering();
			this.displayStatus();
			//log("thumbContainerWrapper : "+this.containerInner.style.left+" :: "+cn.length);

	}

	PageUserList.prototype.thumbnailStyle = function(thumb,style){
			     if(style == "normal") {thumb.className = "thumb-item";}
			else if(style == "active") {thumb.className = "thumb-item thumb-item-active";}
			else if(style == "dimmed") {thumb.className = "thumb-item thumb-item-dimmed";}
			else if(style == "skipped"){thumb.className = "thumb-item thumb-item-skipped";}
		}
	PageUserList.prototype.thumbnailOrdering = function(){
		if(this.curUserIndex>-1 && this.curUserIndex<user.queuedata.userqueues.length){
			var centerThumb = user.queuedata.userqueues[this.curUserIndex].thumb;
			var thumbX     = centerThumb.offsetLeft;
			var thumbWidth = centerThumb.offsetWidth;
			var innerWidth = this.containerInner.offsetWidth;

			for(var i = 0;i<user.queuedata.userqueues.length;i++){
				var thumb = user.queuedata.userqueues[i].thumb;
				if(thumb){
					if(thumb == centerThumb){
						this.thumbnailStyle(thumb,"active");
					}else{
						 //console.log("user.queuedata.userqueues[i].status : "+user.queuedata.userqueues[i].status+"::"+thumbStyles[user.queuedata.userqueues[i].status]);
						 this.thumbnailStyle(thumb,this.thumbStyles[user.queuedata.userqueues[i].status]);
					}
				}

			}
			TweenMax.to(this.containerInner,0.5,{left:-(thumbX-20)+"px",ease:Power2.easeOut});
		}
	}




	PageUserList.prototype.displayStatus = function(){
		this.totalUser = user.queuedata.userqueues.length;
		if(this.totalUser>0)this.btnReady.disabled = false;
		this.userStatusUsers.innerHTML = "current user : "+(this.curUserIndex+1)+"/"+this.totalUser;
		this.userStatusScroll.innerHTML = "scrolling : "+this.isScrolling+" x:"+this.scrollPrevX;
	}

	PageUserList.prototype.updateUserStatus = function(){
		if(this.tmpCurIndex>-1){
			var cntPassed = 0;
			var needToDelete = -1;
			var uobj;
			var maxQueue = 10;
			var cntQueue = 0;

			var qlist = {"userqueues":[]}

			for(var i=0;i<user.queuedata.userqueues.length;i++){
				uobj = user.queuedata.userqueues[i];
				if(i < this.tmpCurIndex && uobj.status == 0){
					uobj.status = 1;
					this.thumbnailStyle(uobj.thumb,"skipped");
				}
				if(i == this.tmpCurIndex){
					uobj.status = 2;
					this.thumbnailStyle(uobj.thumb,"dimmed");
					qlist.userqueues.push({"uname":(uobj.userFirstName+" "+uobj.userLastName),"flag":uobj.userFlag});
				}
				if(uobj.status == 2){
					if(needToDelete<0)needToDelete = i;
					cntPassed++;
				}

				if(i > this.tmpCurIndex && uobj.status=="0" && cntQueue<maxQueue){
					qlist.userqueues.push({"uname":(uobj.userFirstName+" "+uobj.userLastName),"flag":uobj.userFlag});
					cntQueue++;
				}

			}

			if(cntQueue>0){
				var jstr = JSON.stringify(qlist);
				tcsapp.tcssocket.send("ALL","QUEUE_LIST",jstr);
			}

			this.tmpCurIndex = -1;
			if(cntPassed>20 && needToDelete>-1){
				this.deleteThumbnail(user.queuedata.userqueues[needToDelete]);
				user.queuedata.userqueues.splice(needToDelete,1);
			}
			this.totalUser = user.queuedata.userqueues.length;
			this.saveQueueAtServer();
			this.setCurUserIndex();
			this.thumbnailOrdering();
			this.displayStatus();
		}
	}



/* SCROLL */

	PageUserList.prototype.pointerEventToXY = function(e){
		 var out = {x:0, y:0};
		 if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
			 var touch = e.touches[0] || e.changedTouches[0];
			 out.x = touch.pageX;
			 out.y = touch.pageY;
		 } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
			 out.x = e.pageX;
			 out.y = e.pageY;
		 }
		 return out;
	 };

	 PageUserList.prototype.scrollToUser = function(n){
 			this.curUserIndex = this.curUserIndex+n;
 			if(this.curUserIndex<0)this.curUserIndex = 0;
 			if(this.curUserIndex>=user.queuedata.userqueues.length)this.curUserIndex=user.queuedata.userqueues.length-1;
 			if(n==0)this.setCurUserIndex();
 			this.thumbnailOrdering();
 			this.displayStatus();

 	}
	PageUserList.prototype.scrollStart = function(e){
		var p = this.pointerEventToXY(e);
		this.scrollPrevX = parseInt(p.x);
		this.mouseDown = true;
		this.displayStatus();
	}
	PageUserList.prototype.scrollEnd = function(e){
		console.log("scrollEnd : "+e);
		if(this.mouseDown && this.isScrolling)this.calIndexInMiddle();
		this.isScrolling = false;
		this.mouseDown = false;
		this.displayStatus();
	}
	PageUserList.prototype.scrolling = function(e){
		if(this.mouseDown){
			this.isScrolling = true;
			//this.displayStatus();
			var p = this.pointerEventToXY(e);
			this.scrollSpeed = parseInt(p.x)-this.scrollPrevX;
			this.scroll(this.scrollSpeed);
			this.scrollPrevX = parseInt(p.x);
		}
	}

	PageUserList.prototype.scroll = function(n){
		var l = parseInt(this.containerInner.style.left) ;
		this.containerInner.style.left = (l+n)+"px";
	}
	PageUserList.prototype.currentUserSetting = function(){

	}
	PageUserList.prototype.calIndexInMiddle = function(){
		var l = parseInt(this.containerInner.style.left) ;
		this.curUserIndex = Math.floor(((l+this.scrollSpeed*5)*-1+this.tw/2)/this.tw);
		console.log("this.curUserIndex : "+this.curUserIndex);
		if(isNaN(this.curUserIndex))this.curUserIndex = 0;
		if(this.curUserIndex>=user.queuedata.userqueues.length){
			this.curUserIndex=user.queuedata.userqueues.length-1;
		}
		if(this.curUserIndex<0)this.curUserIndex = 0;
		//	console.log("this.curUserIndex 2 : "+this.curUserIndex);
		this.thumbnailOrdering();
		this.displayStatus();
	}

	PageUserList.prototype.setCurUserIndex = function(){
			this.curUserIndex = this.totalUser-1;
			for(var i=0;i<user.queuedata.userqueues.length;i++){
				if(user.queuedata.userqueues[i] && user.queuedata.userqueues[i].status == 0){
					this.curUserIndex = i;
					break;
				}
			}
			if(this.curUserIndex<0)this.curUserIndex = 0;
		}

	PageUserList.prototype.getNumberInQueue = function(){
		var q = 0;
			for(var i = 0;i<user.queuedata.userqueues.length;i++){
				if(parseInt(user.queuedata.userqueues[i].status) == 0){
					q++;
				}
			}
			console.log("getNumberInQueue : "+q);
			return q;
	}


  //getAjax('http://foo.bar/?p1=1&p2=Hello+World', function(data){ console.log(data); });
	// example request
	//postAjax('http://foo.bar/', 'p1=1&p2=Hello+World', function(data){ console.log(data); });

	// example request with data object
	//postAjax('http://foo.bar/', { p1: 1, p2: 'Hello World' }, function(data){ console.log(data); });
