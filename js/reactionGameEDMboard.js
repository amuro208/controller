
importScript('./js/html2canvas.js');

var  fs = require('fs');

var edmb = {}
edmb.totalItems = 10;
edmb.itemHeight = 50;
edmb.photoId = "user_123456789";

edmb.dummyList = [{uname:"", flag:3, pos:1, score:12, user:1},
{uname:"RICARDO MANSEL", flag:1, pos:2, score:12, user:0},
{uname:"LUIS HANSON", flag:2, pos:3, score:12, user:0},
{uname:"RICO BRADLEY", flag:3, pos:4, score:12, user:0},
{uname:"MARTHA BAILEY", flag:4, pos:5, score:12, user:0},
{uname:"FERNADO ALBERTO", flag:5, pos:6, score:12, user:0},
{uname:"CARLOS FRANK", flag:6, pos:7, score:12, user:0},
{uname:"JULIE ROBER", flag:7, pos:8, score:12, user:0},
{uname:"FRANK TAYLOR", flag:8, pos:9, score:12, user:0},
{uname:"MICHAEL ANGELO", flag:9, pos:10, score:12, user:0}];



edmb.init = function(){
console.log("dummyList : "+this.dummyList);
  this.itemList = $$("edmboardContainer");

  for(var i = 0;i<this.totalItems;i++){
    var item = document.createElement("DIV");
    item.id = "edmitem"+i;
    //if(i == 0)item.className = "edm-list new";
    //else   item.className = "edm-list";
    item.className = "edm-list";
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
edmb.displayEdmList = function(){
  //var element = document.getElementById("edmboard");
  // if(element.style.visibility == "hidden")element.style.visibility =  "visible";
  this.captureElement();
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
