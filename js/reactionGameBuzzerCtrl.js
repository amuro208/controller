
	var ipcRender;
	var game = {}
	var sound = {};
	// try{
	//         ipcRender = require('electron').ipcRenderer;
	//         ipcRender.on('arduinoData', function(event, data){
	//         console.log("arduinoData : "+data);
	//         game.onArduinoData(data);
	//       });
	//       //ipcRender.send("arduinoCommand","STRAT :: ");
	// }catch(e){
	//     console.log(e);
	// }
	//


	var net = require('net');
	var arduino = new net.Socket();

	game.init = function(){
	console.log("arduino.connect(5331, '127.0.0.1')");
		arduino.connect(5331, 'localhost', function() {
		  console.log("arduino.connect callback");
		  log('Connected');
		  //arduino.write('Hello, server! Love, Client.\n');
		});
		sound.background = new Audio('./sound/f1_idle.mp3');
		sound.background.loop = true;
		sound.background.volume =.8;

		sound.startloop = new Audio('./sound/f1_start_loop.mp3');
		sound.startloop.volume =.4;
		//sound.startloop.loop = true;
		sound.whitle = new Audio('./sound/whitle.mp3');
		sound.whitle.volume =.4;

		sound.whitle_short = new Audio('./sound/f1_beep2.mp3');
		sound.whitle_short.volume =.5;

		//sound.success = new Audio('./sound/success.mp3');
	}

	var strBuff = "";

	arduino.on('data', function(d) {
	  var data = ""+d;
	//  console.log('Received: ' + data);
	  for(var i = 0;i<data.length;i++){
	  //  console.log("data.charCodeAt("+i+")"+data.charAt(i)+"("+data.charCodeAt(i)+")");
		if(data.charCodeAt(i) == 13){
		  strBuff.substring(0,strBuff.length-1);
		  game.onArduinoData(strBuff);
		  strBuff = "";
		}else{
		  if(data.charCodeAt(i) > 0)strBuff+=data.charAt(i);
		}
	  }
	});

	arduino.on('close', function() {
	  log('Connection closed');
	});

	game.currentOn = 0;
	game.panning;
	game.seqCurrent;
	game.gameLevel = 0;
	game.numButton = 7;
	game.disables;
	game.rId = 0;

	game.sendToArduino = function(s) {
	   log("sendToArduino : "+s );
	   arduino.write(s+'\n');
	   //ipcRender.send("arduinoCommand",s);
	}
	game.testLED = function(){

	}
	game.onArduinoConnected = function(e){


	}
	game.onArduinoClose = function(e){

	}
	game.setLevel = function (l){
		gameLevel = l;
	}
	game.onArduinoData = function(data){
		log("What I get : "+data.trim());
		if(data.trim() == ("bf"+game.currentOn)){
			if(tcsapp.isGameRunning){
				game.rId = setTimeout(game.randomOn,20);
				if(rb.newuserScore>5 &&   rb.newuserScore%10 == 0){
					//sound.success.play();
				}
			}
		}else if(data.trim() == ("bd"+game.currentOn)){
			if(tcsapp.isGameRunning){
				sound.whitle_short.play();
				tcsapp.tcssocket.send("ALL","ADDPOINT","-");
				rb.addScore();
			}
		}
	}


	game.randomOn = function(){
		if(tcsapp.isGameRunning){
			game.currentOn = parseInt(game.seqCurrent[game.seqNow]);
			game.sendToArduino("bo"+game.currentOn);
			game.seqNow++;
			if(game.seqNow == game.seqTotal)game.seqNow = 0;
			if(conf.APP_INFINITE_TEST == "Y"){
			  setTimeout(function(){
			  if(tcsapp.isGameRunning)game.sendToArduino("bf"+game.currentOn);
			  },Math.floor(Math.random() * 900) + 50);
			}
		}
	}
	game.allOn = function(){
		game.sendToArduino("onAll");
	}
	game.allOff = function(){
		game.sendToArduino("offAll");
	}

	game.randonNum = function(){
		return Math.ceil(Math.random()*7);
	}

	game.onArduinoError = function(e){
		//trace(e);
	}

	game.seqTotal = 0;
	game.seqNow = 0;
	game.isKid = false;
	game.gameReady = function(){
		log("gameReady WHY1");
		game.seqCurrent = game.generateRandomSequence();//String(seqList.item[Math.ceil(Math.random()*(seqList.item.length()-1))]).split(",");
		log("SEQUENCE : "+game.seqCurrent);
		game.seqTotal = game.seqCurrent.length;
		game.seqNow = 0;
		setTimeout(game.allOn,100);
		setTimeout(game.allOff,500);
		clearTimeout(game.rId);
		sound.background.play();
	}
	game.generateRandomSequence = function(){
		log("generateRandomSequence WHY1");
		var arr = [];
		var pr = 0;

		game.disables = [];//SET.DISABLE.split(",");
		//trace("disables : "+disables);
		for(var i = 0;i<50;i++){
			var r = 0;
			do{
				if(game.isKid){
					r = Math.ceil(Math.random()*5)+2;

				}else{
					r = Math.ceil(Math.random()*game.numButton);
				}

			}while(pr>0 && r==pr || game.isDisableNumber(r));
			//trace(r);
			arr.push(r);
			pr = r;
		}
		//log("isKid "+kid+" ::: "+arr);
		return arr;
	}
	game.isDisableNumber = function(n){
		for(var i = 0;i<game.disables.length;i++){
			if(parserInt(game.disables[i]) == n){
				return true;
			}
		}
		return false;
	}
	game.gameStart = function(){

		game.currentOn = 0;
		game.randomOn();
		sound.background.pause();
		sound.startloop.currentTime = 0;
		sound.startloop.play();

	}
	game.timeout = function(force){
		clearTimeout(game.rId);
		//sound.background.pause();

		sound.whitle.play();
		setTimeout(function(){
			game.allOff();
			sound.startloop.pause();
		},1000);
	}
	game.gameStop = function(){
		clearTimeout(game.rId);
		sound.background.pause();
		sound.startloop.pause();
		game.allOff();
	}
