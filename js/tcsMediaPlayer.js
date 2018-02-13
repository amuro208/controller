var mplayer = {};
mplayer.fs       = require("fs");
mplayer.mediaSource = "";
mplayer.playlist = [];
mplayer.sequenceIndex = -1;
mplayer.nextIndex = -1;
mplayer.mContainerWrapper;
mplayer.interval;// = setInterval(framecheck,30);
mplayer.timeout;
mplayer.videoPlayer;
mplayer.imgPlayer;
mplayer.currentPlayer;
mplayer.isInNetwork = false;
mplayer.istransition = false;
mplayer.vstatus;
mplayer.maxnum = 4;
mplayer.lastInsertedIndex = -1;
mplayer.interupt = true;
mplayer.hasSyncmodeMaster = false;
mplayer.init = function(){
  if(conf.MEDIA_SOURCE == "LOCAL"){
      document.addEventListener("onFilesDetected",(e)=>{
          this.onFirstFilesDetected(e.detail.files);
      });
      document.addEventListener("onNewFileDetected",(e)=>{
          this.onNewFileAdded(e.detail.file);
      });
      dm.root = conf.ROOT_PATH+"/";
      dm.maxnum = this.maxnum;
      dm.init();
  }else{

  }
  document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
  document.addEventListener("onSocketClose",this.onSocketClose.bind(this),false);
  document.addEventListener("onSocketError",this.onSocketError.bind(this),false);
  document.addEventListener("onSocketOpen",this.onSocketOpen.bind(this),false);
  this.mContainerWrapper =  $$("mContainerWrapper");
  this.vstatus = $$("vstatus");
  //this.playlist =
}

mplayer.onFirstFilesDetected = function(files){
  console.log("onFilesDetected "+files);
  this.playlist = files;
  if(this.playlist.length>0){
    this.playSequence(-1);
  }
}
mplayer.onNewFileAdded = function(newfile){
  console.log("onNewFileDetected Before "+this.playlist);


  var curIndex = this.sequenceIndex;
  var totalLen = this.playlist.length;
  var insertIndex = parseInt(curIndex)+1;

   if(totalLen >= this.maxnum){
        if(insertIndex >= totalLen){insertIndex = 0;}
       var deleteFile = conf.ROOT_PATH+"/"+this.playlist[insertIndex];
       this.fs.unlink(deleteFile,function(err){console.log("file deleted "+deleteFile+"/"+err);});
       this.playlist[insertIndex] = newfile;
   }else{
       this.playlist = this.arrayInsert(this.playlist,insertIndex,newfile);
   }


  totalLen = this.playlist.length;
  if(totalLen == 1){
    this.playSequence(-1);
  }else{
    if(this.interupt )this.dimoutCurrent(-1);
  }
  console.log("current/insert/total :: "+curIndex+"/"+insertIndex+"/"+totalLen);
  console.log("onNewFileDetected After  "+this.playlist);
  //this.lastInsertedIndex = insertIndex;
}

mplayer.arrayInsert = function(arr,index,value){
  console.log("arrayInsert :: "+arr.length+"/"+index+"/"+value);
  if(index == arr.length){
    arr.push(value);
    return arr;
  }else{
    var newarr = [];
    for(var i = 0;i<arr.length;i++){
      if(i<index){
          newarr[i] = arr[i];
      }else if(i==index){
          newarr[i] = value;
          newarr[i+1] = arr[i];
      }else{
          newarr[i+1] = arr[i];
      }
    }
    delete arr;
    return newarr;
  }

}

mplayer.minVideo = function(){
  TweenMax.to( this.mContainerWrapper,1,{width:"20%",height:"20%"});
 }
mplayer.maxVideo = function(){
  TweenMax.to( this.mContainerWrapper,1,{width:"100%",height:"100%"});
 }
mplayer.framecheck = function(){
   var logTxt = "";
   var current = this.videoPlayer.currentTime;
   var duration = this.videoPlayer.duration;
   if(duration!=NaN && duration>1.0 && current>1.0){
      logTxt =  current+"/"+duration;
      if(duration - current<1){
        clearInterval(this.interval);
        this.masterSequenceAction();
      }
   }
   this.vstatus.innerHTML = logTxt;
 }
 mplayer.imageframeCheck = function(){
   this.masterSequenceAction();
 }
mplayer.masterSequenceAction = function(){
   if(conf.SYNCMODE){
     if(this.isInNetwork){
       if(conf.SYNCMODE_MASTER){
         tcsapp.tcssocket.send("ALL","SEQUENCE_PLAY",(parseInt(this.sequenceIndex)+1));
       }
     }else{
       this.dimoutCurrent(-1);
     }
   }else{
     this.dimoutCurrent(-1);
   }
 }


mplayer.dimoutCurrent = function(n){
   this.istransition = true;
   clearInterval(this.interval);
   clearTimeout(this.timeout);
   this.nextIndex = n;
   TweenMax.to(this.currentPlayer,0.9,{opacity:"0",onComplete:()=>{
     if(this.currentPlayer){
       if(this.videoPlayer == this.currentPlayer){
          this.videoPlayer.pause();
          this.mContainerWrapper.removeChild(this.videoPlayer);
          delete this.videoPlayer;
       }else{
          this.mContainerWrapper.removeChild(this.imgPlayer);
          delete this.imgPlayer;
       }
     }

     this.playSequence(this.nextIndex);

   }});
   //setTimeout(this.playSequence.bind(this),1000,n);
 }


 mplayer.playSequence = function(n){
   console.log("playSequence :: "+n);

   if(n == undefined) n = 0;

   if(n<0){
     this.sequenceIndex++;
   }else{
     this.sequenceIndex = n;
   }
   if(this.sequenceIndex == this.playlist.length)this.sequenceIndex = 0;

   //if(this.lastInsertedIndex == this.sequenceIndex)this.lastInsertedIndex = -1;

   var mediaUrl = this.playlist[this.sequenceIndex];
   var ext = mediaUrl.substring(mediaUrl.lastIndexOf(".")+1).toUpperCase();
   if(ext == "MP4"){
     this.videoPlayer = document.createElement("video");
     this.videoPlayer.src = conf.ROOT_PATH+"/"+mediaUrl;
     this.videoPlayer.load();
     this.videoPlayer.play();
     this.videoPlayer.volume = 0.0;
     TweenMax.from(this.videoPlayer,1,{opacity:"0"});
     this.interval = setInterval(this.framecheck.bind(this),30);
     this.currentPlayer = this.videoPlayer;
     this.mContainerWrapper.appendChild(this.currentPlayer);
     console.log("this.videoPlayer.src : "+this.videoPlayer.src);

   }else{
     this.imgPlayer = document.createElement("img");
     this.imgPlayer.src = conf.ROOT_PATH+"/"+mediaUrl;
     TweenMax.from(this.imgPlayer,1,{opacity:"0"});
     this.timeout = setTimeout(this.imageframeCheck.bind(this),5000);
     this.currentPlayer = this.imgPlayer;
     this.mContainerWrapper.appendChild(this.currentPlayer);
     console.log("this.imgPlayer.src : "+this.imgPlayer.src);
   }

 }

 mplayer.onSocketOpen = function(e){
   this.isInNetwork = true;
 }
 mplayer.onSocketError = function(e){
   this.isInNetwork = false;
 }
 mplayer.onSocketClose = function(e){
   this.isInNetwork = false;
 }
mplayer.onSocketMessage = function(e){
  console.log("e.detail.cmd : "+e.detail.cmd+":"+e.detail.msg);
  if(e.detail.cmd == "SEQUENCE_PLAY"){
      this.dimoutCurrent(parseInt(e.detail.msg));

  }else if(e.detail.cmd == "IS_MASTER_CONNECTED"){
    if(conf.SYNCMODE && conf.SYNCMODE_MASTER){
      tcsapp.tcssocket.send("ALL","MASTER_STATUS","Y");
    }
  }else if(e.detail.cmd == "MASTER_STATUS"){
    if(conf.SYNCMODE){
      this.hasSyncmodeMaster = true;
    }
  }
}
