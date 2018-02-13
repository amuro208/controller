var TCSWebSocket = function(){

	this.socket = null;
	this.CMD_SOCKET_ID = 1;
	this.CMD_SOCKET_IP = "192.168.0.2";
	this.CMD_SOCKET_PORT = 9000;

	this.reconnectId = 0;
	this.connected = false;
	this.connecting = false;
	this.isReconnectRequre = true;
	this.reconnectCnt = 0;

	this.setip = function(id,ip,port){
		this.CMD_SOCKET_ID = id;
		this.CMD_SOCKET_IP = ip;
		this.CMD_SOCKET_PORT = port;
	}

	this.connectSocket = function () {
			this.socketStatus("Connect Socket");

		if(this.connected){
			this.socketStatus("Already connected return");
			return;
		}

		if(this.socket != null) {
		  this.socketStatus("Socket already there will kill and reconnect");
			this.socket.onopen = null;
			this.socket.onmessage = null;
			this.socket.onclose = null;
			this.socket.onerror = null;
			this.socket = null;
		}


		var host = "ws://"+this.CMD_SOCKET_IP+":"+this.CMD_SOCKET_PORT; // SET THIS TO YOUR SERVER
    //this.status("Connecting to socket : "+tcssocket.CMD_SOCKET_IP+":"+tcssocket.CMD_SOCKET_PORT+" "+tcssocket.CMD_SOCKET_ID);
		try {
			this.connected = false;
			this.connecting = true;
			this.socket = new WebSocket(host);
			this.socket.ex = this;
			this.socket.onopen    = function(e){this.ex.onOpen(e)};
			this.socket.onmessage = function(e){this.ex.onMessage(e)};
			this.socket.onclose   = function(e){this.ex.onClose(e)};
			this.socket.onerror   = function(e){this.ex.onError(e)};

		}
		catch(e){
			log(e);
		}
	}

	this.onMessage = function (e){
		var packets = e.data.split("#");
		log('Recv: '+this.socket.readyState+" :: "+e.data);
		if(packets.length == 5 && packets[packets.length-1] == "EOF"){
			var to   = packets[0];
			var cmd  = packets[1];
			var from = packets[2];
			var message  = packets[3];
			//console.log("CMD : "+cmd);
			if(cmd == "DECLINED"){
				this.socketStatus("Socket DECLINED!");
				this.quit();

			}else if(cmd == "ACCEPTED"){
				var event = new CustomEvent("onSocketOpen", {
					detail: {
						msg:"onSocketOpen",
						time:new Date()
					},
					bubbles: true,
					cancelable: true
					});
				document.dispatchEvent(event);
				this.socketStatus("Socket ACCEPTED!");

			}else{
				var event = new CustomEvent("onSocketMessage", {
				detail: {to:to,cmd:cmd,from:from,msg:message,time:new Date()},
				bubbles: true,
				cancelable: true
				});
				document.dispatchEvent(event);
			}

		}
	}

	this.onOpen = function (e){

		clearTimeout(this.reconnectId);
		//this.status("Connected to socket : "+this.CMD_SOCKET_IP+":"+this.CMD_SOCKET_PORT+" "+this.CMD_SOCKET_ID);
		this.connected = true;
		this.connecting = false;
		this.reconnectCnt = 0;
		this.socket.send("CLIENT"+this.CMD_SOCKET_ID);
		this.socketStatus("Socket opened!");

	}

	this.socketStatus = function (msg){
		var event = new CustomEvent("onSocketStatus", {
			detail: {
				msg:msg,
				time:new Date()
			},
			bubbles: true,
			cancelable: true
			});
			document.dispatchEvent(event);
			//console.log("hey hey "+msg);
			log(msg);
	}

	this.onClose = function (e){
		this.connected = false;
		this.connecting = false;

		this.socketStatus("Closed!");
		this.reconnectId = setTimeout(function(ex){
				if(ex.isReconnectRequre){
					ex.socketStatus("Trying to reconnect "+this.reconnectCnt);
					ex.connectSocket();
				}
		}, 3000,this);
		this.reconnectCnt++;


		var event = new CustomEvent("onSocketClose", {
			detail: {
				msg:"onSocketClose",
				time:new Date()
			},
			bubbles: true,
			cancelable: true
			});
			document.dispatchEvent(event);
			console.log("socket closed");
	}



	this.onError = function (e){
		this.connected = false;
		this.connecting = false;
		console.log("socket error");
		//this.status("Error");
	}

	this.send = function (to,cmd,msg){
		try {
			var packet = ""+to+"#"+cmd+"#"+this.CMD_SOCKET_ID+"#"+msg+"#EOF";
			if(this.socket.readyState == 1)this.socket.send(packet);
			log('Sent: '+this.socket.readyState+" :: "+packet);
		} catch(ex) {
			log(ex);
		}
	}

	this.quit = function (){
		this.socketStatus("Try to quit!");
		clearTimeout(this.reconnectId);
		this.isReconnectRequre = false;
		if (this.socket != null && this.connected) {
			this.socketStatus("Goodbye!");
			this.socket.close();
			this.socket = null;
		}
	}
	this.connect = function (){
		clearTimeout(this.reconnectId);
		this.isReconnectRequre = true;
		this.connectSocket();
		this.socketStatus("Try to connect!");
	}

};




	// Utilities
