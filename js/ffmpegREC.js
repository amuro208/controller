var FFMPEG = {}


FFMPEG.init = function(){
  document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
  this.spawn    = require("child_process").spawn;
  this.chokidar = require('chokidar');
  this.path     = require('path');
  this.fs       = require("fs");
	//this.photoWidth = 1920;
	//this.photoHeight = 1280;
	this.outputWidth = 960;
	this.outputHeight = 540;
	this.edmWidth = 520;
	this.edmHeight = 346;

	this.user_pid = "user_123456789";
  //this.namingIndex = 0;
  this.currentProcess = "none";
  this.recordIndex = 0;
  this.recordTotal = 3;
  this.isrecording = false;
  this.ffmpeg;
  this.startTime;
  this.kickTime;
  this.stopTime;

  this.logSocketText = $$("logSocketText");
  this.logFFmpegText = $$("logFFmpegText");
  //this.userPhotoPreview = $$("userPhotoPreview").getElementsByTagName("IMG")[0];

  this.DIR_ROOT  = conf.ROOT_PATH;
  this.DIR_USER;
  this.DIR_FINAL  = conf.FINAL_PATH;
  this.DIR_TEMP   = this.DIR_ROOT+'/Temp';
  this.DIR_PRESET = this.DIR_ROOT+'/Preset';

  this.logFFmpeg(this.dirTemp);

  var watcher = this.chokidar.watch(this.DIR_TEMP, {ignored: /(^|[\/\\])\../}).on('all', (event, file) => {
      this.logFFmpeg("event : "+event);
      if(!tcsapp.isGameRunning)return;

      if(event == "add"){

        if (this.path.extname(file).toUpperCase() == ".JPG"){

        }
      }
    })
}

    FFMPEG.emptyLog = function(){
      this.logSocketText.innerHTML = "";
      this.logFFmpegText.innerHTML = "";
    }
    FFMPEG.logSocket = function(msg){
  	  this.logSocketText.innerHTML+="\n"+msg;
  	  this.logSocketText.scrollTop  = this.logSocketText.scrollHeight;
  	}
    FFMPEG.logFFmpeg = function(msg){
      this.logFFmpegText.innerHTML+="\n"+msg;
      this.logFFmpegText.scrollTop  = this.logFFmpegText.scrollHeight;
    }

    FFMPEG.onSocketOpen = function(e){

    }
    FFMPEG.onSocketError = function(e){

    }
    FFMPEG.onSocketClose = function(e){

    }
    FFMPEG.onSocketMessage = function(e){
      if(e.detail.cmd!="ADDPOINT")this.logSocket("message : "+e.detail.cmd+":"+e.detail.msg);


      if(e.detail.cmd == "READY"){
        //logFFmpeg(this.dirTemp);
        this.recordIndex = 0;
        tcsapp.isGameReady = true;
        tcsapp.isGameRunning = true;
        this.emptyLog();
        var arr = e.detail.msg.split("|")[0].split(",");
        this.cleanupTemp();
        setTimeout(this.setNewGameProcess.bind(this),100,arr[2]);

      }else if(e.detail.cmd == "BALL_ENABLE"){
        this.recordIndex = parseInt(e.detail.msg);
        console.log("this.recordIndex : "+this.recordIndex);

      }else if(e.detail.cmd == "BALL_READY"){
        if(!this.isrecording){
          this.startTime = new Date().getTime();
          console.log("startTime : "+this.startTime);
          this.startRecording2();
        }
      }else if(e.detail.cmd == "KICK_TRACKER"){
        this.kickTime = new Date().getTime();
        console.log("kickTime : "+this.kickTime);

      }else if(e.detail.cmd == "STOP_RECORDING"){
        this.stopTime = new Date().getTime();
        console.log("stopTime : "+this.stopTime);
        this.stopRecording();


      }else if(e.detail.cmd == "STOP"){
        tcsapp.isGameRunning = false;
        tcsapp.isGameReady = false;
        if(this.ffmpeg)this.stopProcess();

      }else if(e.detail.cmd == "GAME_END"){
        //tcsapp.isGameRunning = false;
        //tcsapp.isGameReady = false;
        this.concatProcess();

      }else if(e.detail.cmd == "GAME_COMPLETE" || e.detail.cmd == "SUBMIT_ERROR"){

      }
    }
    FFMPEG.ffmpegInit = function(){

    }
   FFMPEG.keyboardlistener = function(e){
      switch (event.key) {
        case "r":
          tcsapp.tcssocket.send("ALL","READY","Donghoon Lee,au,user_12223344|");
        break;
        case "b":
          tcsapp.tcssocket.send("ALL","BALL_READY", (FFMPEG.recordIndex+1));
        break;
        case "k":
          tcsapp.tcssocket.send("ALL","KICK_TRACKER","-");
        break;
        case "s":
          tcsapp.tcssocket.send("ALL","STOP_RECORDING","-");
        break;
        case "e":
          tcsapp.tcssocket.send("ALL","GAME_END","-");
        break;

      }
    }

  FFMPEG.startProcess = function(options){
      this.ffmpeg = this.spawn(this.DIR_ROOT+'/ffmpeg.exe',options);
      this.ffmpeg.stdout.on('data', (data) => {
        this.logFFmpeg("ff stdout : " + data);
      });

      this.ffmpeg.stderr.on('data', (data) => {
        this.logFFmpeg("ff stderr : " + data);
      });

      this.ffmpeg.on('close', (code) => {
        this.logFFmpeg("ff close : " + code);

        if(this.currentProcess == "recording"){
    			this.trimVideo();

    		}else if(this.currentProcess == "edm"){
    			setTimeout(()=>{
    				this.logSocket("process "+this.user_pid+": done EDM image");
    				tcsapp.tcssocket.send("ALL","ENCORDING_DONE","-");
    			},50);

    		}else if(this.currentProcess == "trim"){
          this.isrecording = false;
          console.log("this.currentProcess : trim done");

    		}else if(this.currentProcess == "concat"){
          this.userEDMImage();
        }


      });

    }
  FFMPEG.stopProcess = function(){

	}

	FFMPEG.setNewGameProcess = function(pid)
	{
		this.recordIndex = 0;
		this.user_pid = pid;
    //console.log("this.DIR_ROOT : "+  this.DIR_ROOT);
    this.DIR_USER = this.DIR_ROOT+"/Users/"+this.user_pid;
    //console.log("this.DIR_USER : "+  this.DIR_USER);
		if (!this.fs.existsSync(this.DIR_USER)){
			this.fs.mkdirSync(this.DIR_USER);
		}
		this.logSocket("process "+this.user_pid+": New Game");
		//introRenamingFiles();
	}

  FFMPEG.cleanupTemp = function()
    {
      this.logSocket("process "+this.user_pid+": cleanupTemp");
      var fileArr;
      var p = this.DIR_TEMP;
      this.fs.readdir(p, function (err, files) {
          if (err) {
              throw err;
          }
          files.map(function (file) {
              return FFMPEG.path.join(p, file);
          }).filter(function (file) {
              return FFMPEG.fs.statSync(file).isFile();
          }).forEach(function (file) {
              //console.log("%s (%s)", file, path.extname(file));
              var source = file;
              FFMPEG.deleteFile(source,function(){});
          });
      });
    }

  FFMPEG.copyFile = function(source, target, cb) {
        var cbCalled = false;

        var rd = fs.createReadStream(source);
        var wr = fs.createWriteStream(target);
        rd.on("error", done);
        wr.on("error", done);
        wr.on("close", function(ex) {
          done();
        });
        rd.pipe(wr);

        function done(err) {
          if (!cbCalled) {
            cb(err);
            cbCalled = true;
          }
        }
      }
  FFMPEG.moveFile = function(source, target, cb) {
      var exec = require('child_process').exec;
      exec('move '+source+' '+target, function(err, stdout, stderr) {
        if (err) {
            logFFmpeg("moveFile err : "+err);
            cb(err);
            return;
          }
          logFFmpeg("moveFile stdout : "+stdout);
          logFFmpeg("moveFile stderr : "+stderr);
       });
    }
  FFMPEG.deleteFile = function(source, cb) {
      FFMPEG.fs.stat(source, function (err, stats) {
         FFMPEG.logFFmpeg(stats);//here we got all information of file in stats variable
         if (err) {
             return  FFMPEG.logFFmpeg(err);
         }
         FFMPEG.fs.unlink(source,function(err){
              if(err) return  FFMPEG.logFFmpeg(err);
              cb();
         });
      });
    }


	FFMPEG.userEDMImage = function(){
		this.currentProcess = "edm";
		this.logSocket("process "+this.user_pid+": make EDM image");

		var input  = this.DIR_FINAL+"/"+this.user_pid+".mp4";
		var output = this.DIR_FINAL+"/"+this.user_pid+"_edm.png";
		var wm     = this.DIR_PRESET+"/moods/overlay_wm.png";
		const options = [];

    options.push("-y");
			options.push("-ss");
			options.push("01.000");
			options.push("-i");
			options.push(input);
			options.push("-i");
			options.push(wm);
			options.push("-filter_complex");
			options.push("overlay=0:0,scale=520:-1");
			options.push("-q:v");
			options.push("2");
			options.push("-vframes");
			options.push("1");
      options.push(output);
		this.startProcess(options);
 	}

  FFMPEG.startRecording2 = function(){
    this.currentProcess = "recording";
    this.logSocket("process "+this.user_pid+": startRecording");
    var output = this.DIR_USER+"/rec"+this.recordIndex+".mp4";
    const options = [];
    options.push("-y");
    options.push("-rtbufsize");
    options.push("100M");
    options.push("-f");
    options.push("dshow");
    options.push("-i");
    options.push("audio="+conf.AUDIO);
    options.push("-f");
    options.push("gdigrab");
    options.push("-i");
    options.push("desktop");
    options.push("-framerate");
    options.push("25");
    options.push("-s");
    options.push("960x540");
    options.push("-c:v");
    options.push("libx264");
    options.push("-b:v");
    options.push(conf.BR);
    options.push("-preset");
    options.push(conf.PRESET);
    options.push("-tune");
    options.push("zerolatency");
    options.push("-crf");
    options.push(conf.CRF);
    options.push("-pix_fmt");
    options.push("yuv420p");
    options.push(output);
    this.startProcess(options);
    this.isrecording = true;
   }
  FFMPEG.startRecording = function(){
    this.currentProcess = "recording";
 		this.logSocket("process "+this.user_pid+": startRecording");
 		var output = this.DIR_USER+"/rec"+this.recordIndex+".mp4";
 		const options = [];
 		options.push("-y");
 		options.push("-rtbufsize");
 		options.push("100M");
 		options.push("-f");
 		options.push("gdigrab");
    options.push("-i");
    options.push("desktop");
 		options.push("-framerate");
 		options.push("25");
    options.push("-s");
 		options.push("960x540");
    options.push("-c:v");
 		options.push("libx264");
    options.push("-b:v");
		options.push("3000k");
    options.push("-preset");
 		options.push("medium");
    options.push("-tune");
 		options.push("zerolatency");
    options.push("-crf");
 		options.push("20");
    options.push("-pix_fmt");
 		options.push("yuv420p");
 		options.push(output);
 		this.startProcess(options);
    this.isrecording = true;
   }
    FFMPEG.trimVideo = function(){
      this.currentProcess = "trim";
      var input = this.DIR_USER+"/rec"+this.recordIndex+".mp4";
      var output = this.DIR_USER+"/rec"+this.recordIndex+"_.mp4";
      const options = [];
      options.push("-y");
			options.push("-i");
			options.push(input);

    //  var curTime:int = new Date().time - int(SET.CAPTURE_OPTIONS.DELAY_AT_CAPTURE_DONE);
      var duration = this.stopTime-this.startTime;
      var readytime = this.kickTime-this.startTime-1300;
      var kicktime = this.stopTime-this.kickTime;
      var startTime = readytime;
			var endTime = duration;

      if(startTime<0)startTime = 0;

      var startStr = this.timeToduration(startTime);
			var endStr = this.timeToduration(endTime);

			var trimingStr = ""+startStr+":"+endStr;
			var size = "960x540";
			console.log("trimRamnge :::::: "+trimingStr);

			options.push("-filter_complex");
			options.push("[0:v] trim="+trimingStr+",setpts=PTS-STARTPTS[v],[0:a]atrim="+trimingStr+",asetpts=PTS-STARTPTS[a]");
			options.push("-r");
			options.push("25");
			options.push("-s");
			options.push(size);
			options.push("-map");
			options.push("[v]");
			options.push("-map");
			options.push("[a]");
      options.push(output);
      this.startProcess(options);
      this.isrecording = true;

    }

  FFMPEG.makeConcatFile = function(){
    var concatStr = "";
    concatStr+="file "+"'rec1_.mp4"+"'\n";
    concatStr+="file "+"'rec2_.mp4"+"'\n";
    concatStr+="file "+"'rec3_.mp4"+"'\n";
    var input = this.DIR_USER+"/concat.txt";
    this.fs.writeFile(input, concatStr, 'utf8', function writeFileCallback(err){});
  }
  FFMPEG.concatProcess = function(){
      this.makeConcatFile();
			this.currentProcess = "concat";
      var input = this.DIR_USER+"/concat.txt";
			var output = this.DIR_FINAL+"/"+this.user_pid+".mp4";
      const options = [];
			options.push("-y");
      options.push("-safe");
      options.push("0");
			options.push("-f");
			options.push("concat");
			options.push("-i");
			options.push(input);
			options.push("-c");
			options.push("copy");
			options.push(output);
      this.startProcess(options);

  }
   FFMPEG.stopRecording = function(){
     if(this.ffmpeg && this.isrecording){
            this.ffmpeg.stdin.setEncoding('utf-8');
            this.ffmpeg.stdout.pipe(process.stdout);
            this.ffmpeg.stdin.write("q\n");
            this.ffmpeg.stdin.end();
            this.isrecording = false;
     	}
   }

   FFMPEG.timeToduration = function(n){
			var s = Math.floor(n/1000);
			var m = n%1000;

			var ss = "";
			var ms = "";

			if(s<10)ss="0"+s;
			else ss=""+s;

			if(m<10)ms="00"+m;
			else if(m<100)ms="0"+m;
			else ms=""+m;

			var str = "";
			str+=(ss+".");
			str+=(ms);
      console.log("timeToDur :::: "+str+"("+n+","+s+","+m+","+ss+","+ms+")");
			return str;
		}
