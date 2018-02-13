var ql = {}
ql.totalItems = 5;
ql.itemHeight = 80;
ql.newitem;
ql.refitem;
ql.userlist;
ql.newuserScore;
ql.newuserInfo;
ql.refindex = -1;
ql.refitem;
ql.queueContainer;
ql.queueListContainer;
ql.init = function(){

  ql.queueContainer = $$("queueContainer");
  ql.queueListContainer = $$("queueListContainer");

  for(var i = 0;i<this.totalItems;i++){
    var item = document.createElement("DIV");
    item.id = "qitem"+i;
    item.className = "queue-list";
    item.innerHTML = '<div class="inner-row"><div class="item team"><img class="team-flag-none" src = "./img/blank.png"></div><div class="item uname"></div></div>';
    ql.queueListContainer.appendChild(item);
  }
}

ql.showQueueList = function(msg){
  rb.footer.style.display = "none";
  	var list = JSON.parse(msg);
  	var cnt = 0;
  	for(var i = 0;i<this.totalItems;i++){
  		var item = $$("qitem"+i);
  		if(item){
        var info = list.userqueues[i];
        if(i<list.userqueues.length){
          info = list.userqueues[i];
        }else{
          info = {"uname":" ","flag":-1};
        }

  			var flag = parseInt(info.flag);
  			var img = item.getElementsByTagName("IMG")[0];
  			if(flag<0){
  				img.className = "team-flag-none";
  				img.src = "./img/blank.png";

  			}else{
  				img.className = "team-flag";
  				img.src   = "./img/flags/flag"+(parseInt(info.flag)+1)+".png";
  			}

  			item.getElementsByClassName("uname")[0].innerHTML = ""+info.uname;
  			cnt++;
  		}
  	}
  	ql.queueListContainer.style.top = "0px";
  	var h = this.itemHeight*this.totalItems;
  	TweenMax.to(ql.queueContainer,0.3,{height:h+"px",ease:Power2.easeOut});
  	TweenMax.to(ql.queueListContainer,0.3,{delay:0.6,top:"-"+this.itemHeight+"px",ease:Power2.easeOut});

  	setTimeout(function(){
  		ql.hideQueueList();
  	},3000);

}
ql.hideQueueList = function(){
	TweenMax.to(ql.queueContainer,0.3,{height:"0px",ease:Power2.easeOut,onComplete:function(){
    rb.footer.style.display = "block";
  }});
}
