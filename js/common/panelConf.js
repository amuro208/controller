

	var PanelConf = function(id){
		Page.call(this,id);
	}

	PanelConf.prototype = Object.create(Page.prototype);
	PanelConf.prototype.constructor = PanelConf;
	PanelConf.prototype.keys = [];
	PanelConf.prototype.init = function(){

		var str = '<div class="conf-table">';
		for(var i = 0;i<this.keys.length;i++){
			str+='<div class="conf-group"><div class="conf-title">'+this.keys[i]+'</div><div class="conf-value"><input type="text" class="conf" id="'+this.keys[i]+'"  placeholder="'+this.keys[i]+'"></div></div>'
		}
		str+='</div>'
		this.dispalyObj.innerHTML = '<div class="full-popup-inner">\
		<div class="close-button" onclick="closeFullPopup(\''+this.dispalyId+'\')"></div>\
		<h1>CONFIGURATION</h1>\
		<div id="socketStatus"></div>\
		<div class="full-popup-body">'+str+'<div class="full-popup-utils">\
		    <button onclick="tcsapp.panelConf.save()"    id = "btn-save-c"    class="btn btn-sm btn-default">Save</button>\
				<button onclick="tcsapp.panelConf.load(\'confd\')"    id = "btn-load-c"    class="btn btn-sm btn-default">Preset Debug</button>\
				<button onclick="tcsapp.panelConf.load(\'confp\')"    id = "btn-load-d"    class="btn btn-sm btn-default">Preset Product</button><br>\
		    <button onclick="tcsapp.connectSocket()"                id = "btn-connect"   class="btn btn-sm btn-default">Connect</button>\
		    <button onclick="tcsapp.tcssocket.quit()"               id = "btn-quit"      class="btn btn-sm btn-default">Quit</button>\
				<button onclick="tcsapp.reload()"                       id = "btn-reload"      class="btn btn-sm btn-default">Reload</button>\
		  </div>\
		</div>';

		document.addEventListener("onSocketOpen",this.onSocketOpen.bind(this),false);
		document.addEventListener("onSocketClose",this.onSocketClose.bind(this),false);
		document.addEventListener("onSocketStatus",this.onSocketStatus.bind(this),false);

		this.load("");
	}

	PanelConf.prototype.setKeys = function (obj){
		this.keys = [];
		if(getType(obj) == "array"){
			this.keys = obj;
		}else{
			for(key in obj){
				this.keys.push(key);
			}
		}
		console.log("SET KEYS :: "+this.keys);
	}
	PanelConf.prototype.save = function (set){
		var vlen = this.keys.length;
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = this.getConfItem(key);
			conf[key] = value;
		}
		confCtrl.save();
		///ar json = JSON.stringify(config); //convert it back to json
		//fs.writeFile('configutration.json', json, 'utf8', function writeFileCallback(err){});

		console.log("new values saved to json storage");
	}

	PanelConf.prototype.load = function (set){
		var vlen = this.keys.length;
		var data = this.getConfigset(set);
		confCtrl.objCopy(data,conf);
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = data[key];
			this.setConfItem(key,value);
		}
	}
  PanelConf.prototype.getConfigset = function(set){
		var data;

		if(set == "confp"){
			data = preset.confp;
		}else if(set == "confd"){
			data = preset.confd;
		}else{
			data = conf;
		}
		return data;
	}
	PanelConf.prototype.setConfItem = function(id,value){
		if($$(id))$$(id).value = value;
	}
	PanelConf.prototype.getConfItem = function(id){
		if($$(id)!=null || $$(id)!=undefined)return $$(id).value;
		else return "";
	}
	PanelConf.prototype.onSocketOpen = function(e){
		this.hide();
	}
	PanelConf.prototype.onSocketClose = function(e){
		this.show();
	}
	PanelConf.prototype.onSocketStatus = function(e){
		$$("socketStatus").innerHTML = e.detail.msg;
	}
