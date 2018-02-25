
importScript('./js/reactionGameEDMboard.js');



// ipcRenderer.send('async', 1);
// ipcRenderer.on('async-reply', (event, arg) => {
//     // Print 2
//     console.log("async-reply : "+arg);
//     // Send sync message to main process
//     let mainValue = ipcRenderer.sendSync('sync', 3);
//     // Print 4
//     console.log(mainValue);
// });
//
// // Listen for main message
// ipcRenderer.on('ping', (event, arg) => {
//     // Print 5
//     console.log("ping : "+arg);
//     // Invoke method directly on main process
//     main.pong(6);
// });


var rb = {}

rb.totalItems = 22;
rb.itemHeight = 80;
rb.newitem;
rb.olditem;
rb.lastitem;
rb.refitem;


rb.userlist;
rb.newuserScore;
rb.newuserInfo;

rb.itemList;
rb.header;
rb.footer;
rb.init = function(){
  document.addEventListener("onSocketMessage",rb.onSocketMessage);
  document.addEventListener("onSocketClose",rb.onSocketClose);
  document.addEventListener("onSocketError",rb.onSocketError);
  document.addEventListener("onSocketOpen",rb.onSocketOpen);
  window.addEventListener("keydown", rb.keyboardlistener);

  rb.itemList = $$("mContainerList");
  rb.footer = $$("mContainerFooter");

  var h = window.innerHeight - rb.itemList.offsetTop - rb.footer.offsetHeight;
  rb.totalItems = Math.round(h/rb.itemHeight);
  rb.itemList.style.height = rb.totalItems*rb.itemHeight;

  console.log("document.height : "+rb.totalItems+":"+window.innerHeight+":"+rb.itemList.offsetTop);

  for(var i = 0;i<this.totalItems;i++){
    var item = document.createElement("DIV");
    item.id = "item"+i;
    item.className = "board-list";
    item.innerHTML = '<div class="inner-row"><div class="item pos"></div><div class="item team"><img class="team-flag-none" src = "./img/blank.png"></div><div class="item  uname"></div><div class="item score"></div></div>';
    rb.itemList.appendChild(item);
    if(i == this.totalItems-1)rb.lastitem = item;
  }

  rb.newitem = document.createElement("DIV");
  rb.newitem.id = "newitem";
  rb.newitem.className = "board-newitem";
  rb.newitem.innerHTML = '<div class="inner-row"><div class="item pos"></div><div class="item team"><img class="team-flag" src = ""></div><div class="item uname"></div><div class="item score"></div></div>';

  rb.queryRanking();
}


rb.addNewUser = function(obj){
  var userinfo = obj.split("|")[0].split(",");
  var isKid = userinfo.length<4?false:(userinfo[3]=="true"?true:false);
  game.isKid = isKid;
  game.gameReady();

  var newitemIndex = rb.userlist.length;
  rb.lastitem.style.marginTop = "250px";
  if(rb.userlist.length == rb.totalItems){
		newitemIndex--;

  }else{
    rb.refitem = rb.itemList.childNodes[newitemIndex+1];
    TweenMax.to(rb.refitem,0.0,{marginTop:rb.itemHeight+"px"});
    rb.olditem = rb.refitem;
    //newitemIndex--;

  }
  edmb.photoId = userinfo[2];
  rb.itemList.appendChild(rb.newitem);
  rb.newitem.style.top = ""+(newitemIndex*rb.itemHeight)+"px";
  rb.newuserScore = 0;
  rb.newuserInfo = {"pos":0,"uname":userinfo[0]+(isKid?"*":""),"flag":userinfo[1],"score":0,"user":1,"item":rb.newitem};
  rb.userlist.push(rb.newuserInfo);
  rb.setitem(rb.newitem,rb.newuserInfo);
  //rb.refitem = null;
  //rb.olditem = null;
}


rb.addScore = function(){
  rb.newuserScore++;
  rb.newuserInfo.score = rb.newuserScore;
  rb.userlist.sort(rb.sortOption);

//  console.log(rb.userlist);
  var pos = 1;
  var score = rb.userlist[0].score;

  for(var i=0;i<rb.userlist.length;i++){
    if(score == rb.userlist[i].score){

    }else{
      pos++;
      score = rb.userlist[i].score;
    }
    rb.userlist[i].item.getElementsByClassName("pos")[0].innerHTML = ""+pos;
  }
  rb.newitem.getElementsByClassName("score")[0].innerHTML = ""+rb.newuserScore;



  var uindex = rb.userlist.indexOf(rb.newuserInfo);
  console.log("uindex : "+uindex);
  if(uindex<rb.userlist.length-1){
  	var targetY = uindex*rb.itemHeight;
    //console.log("targetY : "+targetY+"/"+rb.newitem.offsetTop+"::::::"+rb.itemList.offsetTop);
  	if(targetY != rb.newitem.offsetTop){
  		for(var i = 0;i<rb.itemList.childNodes.length;i++){
  			var item = rb.itemList.childNodes[i];
  			if(item.id != undefined){
  				if(item.offsetTop == targetY){
  				 rb.refitem = item;
  				 break;
  				}
  			}
  		}
  		if(rb.olditem){
  		  TweenMax.to(rb.olditem,0.3,{marginTop:"0px"});
  		}
  		TweenMax.to(rb.newitem,0.3,{top:(targetY)+"px"});
  		if(rb.refitem){
  			TweenMax.to(rb.refitem,0.3,{marginTop:rb.itemHeight+"px"});
  			rb.olditem = rb.refitem;
  		}
  	}

  }
}


rb.sortOption = function(a,b){
	var comparison1 = Number(b.score)-Number(a.score);
	if(comparison1 == 0){
		var comparison2 = a.uname.toLowerCase().localeCompare(b.uname.toLowerCase());
		if(comparison2 == 0){return b.uname.localeCompare(a.uname)};
		return comparison2;
	}else{
		return comparison1;
	}
}
rb.setitem= function(item,info){
	var img = item.getElementsByTagName("IMG")[0];
	  if(info == null){
  		img.className = "team-flag-none";
  		img.src   = "./img/blank.png";
  		item.getElementsByClassName("pos")[0].innerHTML   = "";
  		item.getElementsByClassName("score")[0].innerHTML = "";
  		item.getElementsByClassName("uname")[0].innerHTML = "";
	  }else{
  		img.className = "team-flag";
  		img.src = "./img/flags/flag"+(parseInt(info.flag))+".png";
  		item.getElementsByClassName("pos")[0].innerHTML   = ""+info.pos;
  		item.getElementsByClassName("score")[0].innerHTML = ""+info.score;
  		item.getElementsByClassName("uname")[0].innerHTML = ""+info.uname;
	  }
	}

rb.keyboardlistener = function(e){
  ipcRenderer.send('keypress', event.ctrlKey , event.key);
  //console.log("event.key : "+event.key);
  //main.pong(event.key);
  switch (event.key) {
    case "r":
      if(tcsapp.isGameReady || tcsapp.isGameRunning){
          return false;
      }
      tcsapp.tcssocket.send("ALL","READY","Donghoon Lee,2,12223344|");
    break;
    case "s":
      if(!tcsapp.isGameReady || tcsapp.isGameRunning)return false;
      tcsapp.tcssocket.send("ALL","START","-");
    break;
    case "t":
      if(!tcsapp.isGameRunning)return false;
      tcsapp.tcssocket.send("ALL","TIMEOUT","-");
    break;
    case "c":
      //if(!tcsapp.isGameRunning)return false;
      tcsapp.tcssocket.send("ALL","STOP","-");
    break;
	case "l":
      //if(!tcsapp.isGameRunning)return false;
      tcsapp.tcssocket.send("ALL","BOARD_CLEARD","-");
    break;
    case "q":
      var qlist = {"userqueues":[]};
          qlist.userqueues.push({"uname":"Amuro Lee","flag":2});
          qlist.userqueues.push({"uname":"Miyoung Kang","flag":3});
          qlist.userqueues.push({"uname":"Gundam 78","flag":4});
          qlist.userqueues.push({"uname":"Macross 83","flag":5});
          qlist.userqueues.push({"uname":"Nadia 76","flag":6});
      var jstr = JSON.stringify(qlist);
      tcsapp.tcssocket.send("ALL","QUEUE_LIST",jstr);
      break;
    case "ArrowUp":
      if(!tcsapp.isGameRunning)return false;
      sound.whitle_short.play();
      rb.addScore();
      tcsapp.tcssocket.send("ALL","ADDPOINT","-");
    break;

  }
}



rb.onSocketOpen = function(e){

}
rb.onSocketError = function(e){

}
rb.onSocketClose = function(e){

}
rb.onSocketMessage = function(e){
  console.log("e.detail.cmd : "+e.detail.cmd+":"+e.detail.msg);
  console.log("rb.tcsapp.isGameRunning : "+tcsapp.isGameRunning);
  if(e.detail.cmd == "READY"){
	   $$("debugTxtArea").innerHTML = "";
      if(tcsapp.isGameReady || tcsapp.isGameRunning){
          tcsapp.tcssocket.send("ALL","STOP","-");
          return false;

      }
      tcsapp.isGameReady = true;
	    ql.hideQueueList();
      rb.addNewUser(e.detail.msg);


    }else if(e.detail.cmd == "START"){
      if(tcsapp.isGameRunning || !tcsapp.isGameReady)return false;
         tcsapp.isGameRunning = true;
         game.gameStart();

    }else if(e.detail.cmd == "STOP"){
      //if(!tcsapp.isGameReady)return false;
      tcsapp.isGameRunning = false;
      tcsapp.isGameReady = false;
      game.gameStop();

      for(var i=0;i<rb.userlist.length;i++){
        rb.userlist[i].item.getElementsByClassName("pos")[0].innerHTML = ""+rb.userlist[i].pos;
      }
      var uindex = rb.userlist.indexOf(rb.newuserInfo);
      rb.userlist.splice(uindex,1);

      rb.resetNewItem();
      //rb.queryRanking();

    }else if(e.detail.cmd == "TIMEOUT"){
      if(!tcsapp.isGameRunning || !tcsapp.isGameReady)return false;
      tcsapp.isGameRunning = false;
      game.timeout();
      edmb.displayEdmList(rb.newuserInfo);

    }else if(e.detail.cmd == "BOARD_CLEARD"){
	  log("BOARD_CLEARD");
      rb.resetNewItem();
      rb.queryRanking();

    }else if(e.detail.cmd == "GAME_COMPLETE"){
      rb.resetNewItem();
      rb.queryRanking();

    }else if(e.detail.cmd == "QUEUE_LIST"){
      ql.showQueueList(e.detail.msg);
    }
}
rb.resetNewItem = function(){
  if(rb.newitem.parentElement != null){
    for(var i = 0;i<rb.itemList.childNodes.length;i++){
		var item = rb.itemList.childNodes[i];
		//console.log("item.id : "+item.id);
		if(item.id != undefined){
			//console.log("item.style.top : "+item.id+":"+item.style.marginTop);
			if(parseInt(item.style.marginTop) > 0){
				TweenMax.to(item,0.3,{marginTop:"0px",ease:Power2.easeOut});
				item.style.display = "block";
			}
		}

	}
    rb.itemList.removeChild(rb.newitem);
  }
  rb.refitem = null;
  rb.olditem = null;
  tcsapp.isGameReady = false;
}

rb.queryRanking = function(){
    log("queryRanking : "+"http://"+conf.CMS_IP+conf.CMS_LIST);
    postAjax("http://"+conf.CMS_IP+conf.CMS_LIST, {}, function(readyState,status,data){
      log("readyState : "+readyState);
      log("status : "+status);
      log("data : "+data);
      if(readyState == 4){
          if(status == 200){
              rb.onResponseXML(data);
          }else if(status == 404){
              alert("Page Not Found");
              log("404");
          }else if(status == 500){
              alert("Server Error");
              log("500");
          }
      }
    });
}
// rb.clearRanking = function(){
//     postAjax("http://"+conf.CMS_IP+conf.CMS_CLEAR, userData, function(readyState,status,data){
//       log("readyState : "+readyState);
//       log("status : "+status);
//       log("data : "+data);
//       if(readyState == 4){
//           if(status == 200){
//               rb.onResponseClearRancking(data);
//           }else if(status == 404){
//               alert("Page Not Found");
//               log("404");
//           }else if(status == 500){
//               alert("Server Error");
//               log("500");
//           }
//       }
//     });
// }
// rb.onResponseClearRancking = function(data){
//   rb.queryRanking();
// }

rb.onResponseXML = function(data){
  var xml = parseXml(data);
  var list = xml.getElementsByTagName("rank");
  if(rb.userlist != null)delete   rb.userlist;

  rb.userlist = new Array();//xml.getElementsByTagName("rank");

  if(list.length>0){
	  var score = parseInt(list[0].getAttribute("score"));
	  var pos = 1;

	  for(var i = 0;i<list.length;i++){
		if(i<this.totalItems){
			var s = parseInt(list[i].getAttribute("score"));
			if(score == s){

			}else{
				pos++;
				score = s;
				//list[i].getAttribute("no")
			}
			rb.userlist[i] = {"pos":pos,"opos":list[i].getAttribute("no"),"uname":list[i].getAttribute("name"),"flag":list[i].getAttribute("country"),"score":list[i].getAttribute("score"),"user":0,item:null};
		}
	  }
	  rb.userlist.sort(rb.sortOption);
  }
  for(var i = 0;i<this.totalItems;i++){
	  if(i<rb.userlist.length){
		rb.userlist[i].item = $$("item"+i);
		rb.setitem($$("item"+i),rb.userlist[i]);

	  }else{
		rb.setitem($$("item"+i),null);
	  }


  }

}
