
importScript('./js/html2canvas.js');

var  fs = require('fs');

var edmb = {}
edmb.totalItems = 10;
edmb.itemHeight = 50;
edmb.photoId = "user_123456789";

edmb.dummyList = [{uname:"", flag:3, pos:1, score:12, user:1},
{uname:"Lewis Hamilton", flag:1, pos:2, score:12, user:0},
{uname:"Sebastian Vettel", flag:3, pos:3, score:12, user:0},
{uname:"Valtteri Bottas", flag:1, pos:4, score:12, user:0},
{uname:"Kimi Räikkönen", flag:3, pos:5, score:12, user:0},
{uname:"Daniel Ricciardo", flag:2, pos:6, score:12, user:0},
{uname:"Max Verstappen", flag:2, pos:7, score:12, user:0},
{uname:"Sergio Perez", flag:4, pos:8, score:12, user:0},
{uname:"Esteban Ocon", flag:4, pos:9, score:12, user:0},
{uname:"Carlos Sainz", flag:9, pos:10, score:12, user:0}];



edmb.init = function(){
console.log("dummyList : "+this.dummyList);
  this.itemList = $$("edmboardContainer");

  for(var i = 0;i<this.totalItems;i++){
    var item = document.createElement("DIV");
    item.id = "edmitem"+i;
      if(i == 0) item.className = "edm-list-new";
      else item.className = "edm-list";

    item.innerHTML = '<div class="inner-row"><div class="item pos"></div><div class="item team"><img class="team-flag-none" src = "./img/blank.png"></div><div class="item  uname"></div><div class="item score"></div></div>';

    this.itemList.appendChild(item);

  }
  this.display();
}

edmb.display = function(){
  for(var i = 0;i<this.totalItems;i++){
		this.setitem($$("edmitem"+i),this.dummyList[i]);
  }
}
edmb.displayEdmList = function(obj){

//  {"pos":0,"uname":userinfo[0]+(isKid?"*":""),"flag":userinfo[1],"score":0,"user":1,"item":rb.newitem};
  var uscore = obj.score;
  if(uscore == 0)uscore = 1;
  edmb.dummyList[0] = {uname:obj.uname, flag:obj.flag, pos:1, score:uscore};
  for(var i = 1;i<this.totalItems;i++){
    edmb.dummyList[i].score = Math.floor(Math.random() * (uscore-1) + 1);
  }
  edmb.dummyList.sort(edmb.sortOption);

  var pos = 1;
  var pscore = uscore;
  for(var i = 1;i<this.totalItems;i++){
    var lscore = edmb.dummyList[i].score;
    if(lscore<pscore){
      pscore = lscore;
      pos++;
    }
    edmb.dummyList[i].pos = pos;
  }
  edmb.display();
  //var element = document.getElementById("edmboard");
  // if(element.style.visibility == "hidden")element.style.visibility =  "visible";
  this.captureElement();
}
edmb.sortOption = function(a,b){
	var comparison1 = Number(b.score)-Number(a.score);
	if(comparison1 == 0){
		var comparison2 = a.uname.toLowerCase().localeCompare(b.uname.toLowerCase());
		if(comparison2 == 0){return b.uname.localeCompare(a.uname)};
		return comparison2;
	}else{
		return comparison1;
	}
}
edmb.setitem= function(item,info){
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

edmb.captureElement = function(){
  var canvases = document.getElementsByTagName("canvas");
  for(var i = 0;i<canvases.length;i++){
    document.body.removeChild(canvases[i]);
    delete canvases[i];
    console.log("canvas deleted");
  }


  var element = document.getElementById("edmboard");
  console.log("captureElement :::::::::::::: "+element.offsetWidth+"/"+element.offsetHeight);
  html2canvas(element).then(canvas => {

    document.body.appendChild(canvas);

    var img = canvas.toDataURL();
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = new Buffer(data, 'base64');
    var w = element.offsetWidth;
    var h = element.offsetHeight;
    var path = conf.ROOT_PATH+edmb.photoId+".png";
    fs.writeFile(path, buf ,(err)=>{
      if(err){
        console.log("error : "+path);
        throw err;
      }
      delete img;
      delete data;
      delete buf;
      console.log("saved first file: "+path);

        var tempCanvas=document.createElement("canvas");
        var tctx=tempCanvas.getContext("2d");
        var cw=520;
        var ch=347;
        tempCanvas.width=cw;
        tempCanvas.height=ch;
        var tctx=tempCanvas.getContext('2d');
        tctx.drawImage(canvas,0,0,w,h,0,0,cw,ch);

        var img2 = tempCanvas.toDataURL("image/jpeg",0.9);
        var data2 = img2.replace(/^data:image\/\w+;base64,/, "");
        var buf2 = new Buffer(data2, 'base64');
        var path2 = conf.ROOT_PATH+edmb.photoId+".jpg";
        fs.writeFile(path2,buf2,(err)=>{
         if(err)throw err;
         delete img2;
         delete data2;
         delete buf2;
         console.log("saved second file: "+path2);
         tcsapp.tcssocket.send("ALL","GIF_DONE","-");
         //if(element.style.visibility == "visible")element.style.visibility = "hidden";
       });
    });

    //document.body.removeChild(canvas);

 });
}
