var FFMPEG = {}


FFMPEG.init = function(){
  document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
//  document.addEventListener("onSocketClose",this.onSocketClose.bind(this),false);
//  document.addEventListener("onSocketStatus",this.onSocketStatus.bind(this),false);

this.spawn    = require("child_process").spawn;
this.chokidar = require('chokidar');
this.path     = require('path');
this.fs       = require("fs");


  this.NUM_INTRO = 0;
  this.NUM_OUTRO = 0;

	this.photoWidth = 1920;
	this.photoHeight = 1280;
	this.outputWidth = 620;
	this.outputHeight = 413;
	this.edmWidth = 520;
	this.edmHeight = 346;

	this.user_pid = "user_123456789";
  this.namingIndex = 0;
  this.currentProcess = "none";
  this.ffmpeg;

  this.logSocketText = $$("logSocketText");
  this.logFFmpegText = $$("logFFmpegText");
  this.userPhotoPreview = $$("userPhotoPreview").getElementsByTagName("IMG")[0];

  this.DIR_ROOT  = conf.ROOT_PATH;

  this.DIR_USER;
  this.DIR_FINAL  = this.DIR_ROOT+'/Final';
  this.DIR_TEMP   = this.DIR_ROOT+'/Temp';
  this.DIR_PRESET = this.DIR_ROOT+'/Preset';

  this.logFFmpeg(this.dirTemp);

  var watcher = this.chokidar.watch(this.DIR_TEMP, {ignored: /(^|[\/\\])\../}).on('all', (event, file) => {
      this.logFFmpeg("event : "+event);
      if(!tcsapp.isGameRunning)return;

      if(event == "add"){

        if (this.path.extname(file).toUpperCase() == ".JPG"){
            //console.log(event, file);
            var dest = this.DIR_USER+"/image-"+sutil.zeroName3(this.namingIndex)+".jpg";
            //var dest = "T:/AMURO/image-"+zeroName(namingIndex)+".jpg";
            //console.log("user  : "+dest);
            //moveFile(file,dest,function(err){console.log(err)});
            this.tweekingProcess(file,dest);
            this.namingIndex++;
        }
      }
    })

}

  //"D:/Workspace/2017/Nissan/ReActionGame/PROJECTS/Nissan";
    // One-liner for current directory, ignores .dotfiles

    // watcher.on('add', path => log(`File ${path} has been added`))
    // watcher.on('change', path => log(`File ${path} has been changed`))
    // watcher.on('unlink', path => log(`File ${path} has been removed`));
    FFMPEG.emptyLog = function(){
      this.logSocketText.innerHTML = "";
      this.logFFmpegText.innerHTML = "";
    }
    FFMPEG.logSocket = function(msg){
  	  //console.log(msg);
  	  this.logSocketText.innerHTML+="\n"+msg;
  	  this.logSocketText.scrollTop  = this.logSocketText.scrollHeight;
	    // logFFmpeg(msg);
      //console.log(msg);
  	}
    FFMPEG.logFFmpeg = function(msg){
      //console.log(msg);
      this.logFFmpegText.innerHTML+="\n"+msg;
      this.logFFmpegText.scrollTop  = this.logFFmpegText.scrollHeight;
      //console.log(msg);
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

        tcsapp.isGameReady = true;
        this.emptyLog();
        var arr = e.detail.msg.split("|")[0].split(",");
        this.cleanupTemp();
        setTimeout(this.setNewGameProcess.bind(this),100,arr[2]);

      }else if(e.detail.cmd == "START"){
        tcsapp.isGameRunning = true;


      }else if(e.detail.cmd == "STOP"){
        tcsapp.isGameRunning = false;
        tcsapp.isGameReady = false;

      }else if(e.detail.cmd == "TIMEOUT"){
		    tcsapp.isGameRunning = false;
        tcsapp.isGameReady = false;
        setTimeout(()=>{
          this.gifProcess();
        },2000);

      }else if(e.detail.cmd == "GAME_COMPLETE" || e.detail.cmd == "SUBMIT_ERROR"){

      }
    }
    FFMPEG.ffmpegInit = function(){

    }
   FFMPEG.keyboardlistener = function(e){
      switch (event.key) {
        case "r":
          tcsapp.tcssocket.send("ALL","READY","Donghoon Lee,2,12223344|");
        break;
        case "s":
          tcsapp.tcssocket.send("ALL","START","-");
        break;
        case "t":
          tcsapp.tcssocket.send("ALL","TIMEOUT","-");
        break;
        case "c":
          tcsapp.tcssocket.send("ALL","GAME_COMPLETE","-");
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

    if(this.currentProcess == "gif"){
			setTimeout(()=>{
				this.logSocket("process "+this.user_pid+": done GIF image");
				this.userEDMImage();
			},50);

		}if(this.currentProcess == "gif_p1"){
			setTimeout(()=>{
				this.logSocket("process "+this.user_pid+": done GIF HD 1");
				this.gifProcessHD1();
			},50);

		}else if(this.currentProcess == "edm"){
			setTimeout(()=>{
				this.logSocket("process "+this.user_pid+": done EDM image");
				this.overlayProcess();
			},50);

		}else if(this.currentProcess == "overlay"){
			setTimeout(()=>{
				this.logSocket("process "+this.user_pid+": done Overlay WaterMark");
				tcsapp.tcssocket.send("ALL","GIF_DONE","-");
			},50);

		}else if(this.currentProcess == "tweek"){
			var dest = this.DIR_USER+"/image-"+sutil.zeroName3(this.namingIndex-1)+".jpg";
			this.userPhotoPreview.src = dest;
			//gifPreview();
		}


      });

    }
  FFMPEG.stopProcess = function(){

	}

	FFMPEG.setNewGameProcess = function(pid)
	{
		this.namingIndex = 0;
		this.user_pid = pid;
    console.log("this.DIR_ROOT : "+  this.DIR_ROOT);
    this.DIR_USER = this.DIR_ROOT+"/Users/"+this.user_pid;
    console.log("this.DIR_USER : "+  this.DIR_USER);
		if (!this.fs.existsSync(this.DIR_USER)){
			this.fs.mkdirSync(this.DIR_USER);
		}
		this.logSocket("process "+this.user_pid+": New Game");
		//introRenamingFiles();
	}





    //var gifStart = NUM_INTRO;
    //var gifEnd = namingIndex;
    //var gifPreviewId;
    FFMPEG.gifPreview = function(){


    }
    FFMPEG.gifDisplay = function(){
      var dest = this.DIR_USER+"/image-"+zeroName(this.namingIndex-1)+".jpg";
      this.userPhotoPreview.src = dest;

    }
  FFMPEG.copyFileWithSequence = function(source,num)
    {
      for(var i = 0; i<num;i++){

          var dest = this.DIR_USER+"/image-"+zeroName(this.namingIndex)+".jpg";
          //console.log("intro : "+dest);
          this.namingIndex++;
          copyFile(source,dest,function(err){logFFmpeg(err)});
          //source.copyTo(dest,true);
      }
    }
  FFMPEG.introRenamingFiles = function()
	{
		this.logSocket("process "+this.user_pid+": introRenamingFiles");
		var source = this.DIR_PRESET+"/moods/intro.jpg";
		this.copyFileWithSequence(source,this.NUM_INTRO);
	}
	FFMPEG.outroRenamingFiles = function()
	{
		this.logSocket("process "+this.user_pid+": outroRenamingFiles");
		var source = this.DIR_PRESET+"/moods/outro.jpg";
		this.copyFileWithSequence(source,this.NUM_OUTRO);
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



  FFMPEG.isJPG = function(f){
			// if(f.exists && f.extension.toLowerCase() == "jpg"){
			// 	return true;
			// }
			return false;
		}
	FFMPEG.isPNG = function(f){
		// if(f.exists && f.extension.toLowerCase() == "png"){
		// 	return true;
		// }
		return false;
	}
	FFMPEG.userEDMImage = function(){
		this.currentProcess = "edm";
		this.logSocket("process "+this.user_pid+": make EDM image");

		var input  = this.DIR_USER+"/image-000.jpg";
		var output = this.DIR_FINAL+"/"+this.user_pid+".png";
		var wm     = this.DIR_PRESET+"/moods/overlay_wm.png";
		const options = [];
		options.push("-y");
		options.push("-i");
		options.push(input);
		options.push("-i");
		options.push(wm);
		options.push("-filter_complex");
		options.push("overlay=0:0");
		options.push("-s");
		options.push(this.edmWidth+"x"+this.edmHeight);
		options.push(output);
		this.startProcess(options);
 	}

  //var factorRot =
  //var factorScale
  //var factorPos

  FFMPEG.tweekingProcess = function(input,output){
    this.currentProcess = "tweek";

		var pr = Math.random()<0.5?-1:1;
		var cr = Math.random()/20*pr;
		var cw = this.photoWidth*0.8-Math.random()*20;
		var ch = this.photoHeight*0.8-Math.random()*20;
		//var ch2:int = cw*(SET.PH/SET.PW);
		var cx = (this.photoWidth-cw+pr*Math.random()*5)/2;
		var cy = (this.photoHeight-ch+pr*Math.random()*5)/2;

		const options = [];
		options.push("-y");
		options.push("-i");
		options.push(input);

		//options.push("-filter:v");
		//options.push("rotate="+cr+",crop="+cw+":"+ch+":"+cx+":"+cy+",scale="+outputWidth+":"+outputHeight);
    options.push("-vf");
		options.push("scale="+this.outputWidth+":"+this.outputHeight);

		options.push("-q:v");
		options.push("2");
		options.push(output);
		this.startProcess(options);

    }

/*
ffmpeg -i ./test/image-000.jpg -vf "fps=4,scale=620:-1:flags=lanczos,palettegen" -y palette.png
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse" -y output.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=1" -y output_dither_bayer_bayer_scale_1.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=2" -y output_dither_bayer_bayer_scale_2.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3" -y output_dither_bayer_bayer_scale_3.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=floyd_steinberg"     -y output_dither_floyd_steinberg.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=sierra2"             -y output_dither_sierra2.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=sierra2_4a"          -y output_dither_sierra2_4a.gif
ffmpeg -f image2 -framerate 4 -i ./test/image-%%03d.jpg -i palette.png  -lavfi "fps=4,scale=320:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=none"                -y output_dither_none.gif

*/

  FFMPEG.gifProcessHD1 = function(){
    this.currentProcess = "gif_p1";
 		this.logSocket("process "+this.user_pid+": make palette image");
 		var input = this.DIR_USER+"/image-%03d.jpg";
 		var output = this.DIR_FINAL+"/palette.png";
 		const options = [];
 		options.push("-y");
 		options.push("-v");
 		options.push("warning");
 		options.push("-i");
 		options.push(input);
    options.push("-pix_fmt");
    options.push("rgb24");
 		options.push("-vf");
 		options.push("fps=4,scale="+this.outputWidth+":-1:flags=lanczos,palettegen=stats_mode=diff");
 		options.push(output);
 		this.startProcess(options);
   }
   FFMPEG.gifProcessHD2 = function(){
     this.currentProcess = "gif";
     this.logSocket("process "+this.user_pid+": make GIF image");
     var input   = this.DIR_USER+"/image-%03d.jpg";
  	 var output2 = this.DIR_FINAL+"/palette.png";
     var output  = this.DIR_FINAL+"/"+this.user_pid+".gif";
     const options = [];
     options.push("-y");
     options.push("-v");
  		options.push("warning");
     options.push("-i");
     options.push(input);
     options.push("-i");
     options.push(input2);
     options.push("-pix_fmt");
     options.push("rgb24");
     options.push("-lavfi");
     options.push("fps=4,scale="+this.outputWidth+":-1:flags=lanczos,paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle");
     options.push(output);
     this.startProcess(options);
   }
	FFMPEG.gifProcess = function(){
		this.currentProcess = "gif";
		this.logSocket("process "+this.user_pid+": make GIF image");
		var input   = this.DIR_USER+"/image-%03d.jpg";
		var output  = this.DIR_FINAL+"/"+this.user_pid+".gif";
		const options = [];
		options.push("-y");
		options.push("-f");
		options.push("image2");
		options.push("-framerate");
		options.push("4");
		options.push("-i");
		options.push(input);
		//processArguments.push("-pix_fmt");
		//processArguments.push("rgb24");
		options.push("-vf");
		options.push("scale="+this.outputWidth+":"+this.outputHeight);
		options.push(output);
		this.startProcess(options);


		/*ffmpeg -i in.mp4 -i watermark.png -filter_complex "[0]fps=10,scale=320:-1:flags=lanczos[bg];[bg][1]overlay=W-w-5:H-h-5,palettegen" palette.png
ffmpeg -i in.mp4 -i watermark.png -i palette.png -filter_complex "[0]fps=10,scale=320:-1:flags=lanczos[bg];[bg][1]overlay=W-w-5:H-h-5[x];[x][2]paletteuse=dither=bayer:bayer_scale=3" output.gif*/
	}

	FFMPEG.gifProcess2 = function(){
		this.currentProcess = "gif";
		this.logSocket("process "+this.user_pid+": make GIF image");
    var input   = this.DIR_USER+"/image-%03d.jpg";
		var output  = this.DIR_FINAL+"/"+this.user_pid+".gif";
		const options = [];
		options.push("-y");
		options.push("-f");
		options.push("image2");
		options.push("-framerate");
		options.push("4");
		options.push("-i");
		options.push(input);
		//processArguments.push("-pix_fmt");
		//processArguments.push("rgb24");
		options.push("-vf");
		options.push("scale="+this.outputWidth+":"+this.outputHeight);
		options.push(output);
		this.startProcess(options);
	}
	FFMPEG.overlayProcess = function(){
		this.currentProcess = "overlay";
		this.logSocket("process "+this.user_pid+": make Overlay WaterMark");
    var input   = this.DIR_FINAL+"/"+this.user_pid+".gif";
		var output  = this.DIR_FINAL+"/"+this.user_pid+".gif";
		var wm = this.DIR_PRESET+"/moods/overlay_logo.png";
		const options = [];
		options.push("-y");
		options.push("-i");
		options.push(input);
		options.push("-i");
		options.push(wm);
		options.push("-filter_complex");
		options.push("overlay=0:0");
		options.push(output);
		this.startProcess(options);

	}
	FFMPEG.overlayProcess2 = function(){
		this.currentProcess = "overlay";
		this.logSocket("process "+this.user_pid+": make Overlay WaterMark");
    var input   = this.DIR_FINAL+"/"+this.user_pid+".gif";
    var output  = this.DIR_FINAL+"/"+this.user_pid+".gif";
		var wm = this.DIR_PRESET+"/moods/overlay_wm.png";
		const options = [];
		options.push("-y");
		options.push("-i");
		options.push(input);
		options.push("-vf");
		options.push('"movie='+wm+' [watermark]; [in][watermark] overlay=0:0 [out]"');
		options.push(output);
		this.startProcess(options);
	}
