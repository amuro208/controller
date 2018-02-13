

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
		    <button onclick="tcsapp.panelConf.save(\'current\')"    id = "btn-save-c"    class="btn btn-sm btn-default">Save to Current</button>\
				<button onclick="tcsapp.panelConf.save(\'default\')"    id = "btn-save-d"    class="btn btn-sm btn-default">Save to Default</button>\
				<button onclick="tcsapp.panelConf.load(\'current\')"    id = "btn-load-c"    class="btn btn-sm btn-default">Load Current</button>\
				<button onclick="tcsapp.panelConf.load(\'default\')"    id = "btn-load-d"    class="btn btn-sm btn-default">Load Default</button>\
		    <button onclick="tcsapp.connectSocket()"                id = "btn-connect"   class="btn btn-sm btn-default">Connect</button>\
		    <button onclick="tcsapp.tcssocket.quit()"               id = "btn-quit"      class="btn btn-sm btn-default">Quit</button>\
		  </div>\
		</div>';

		document.addEventListener("onSocketOpen",this.onSocketOpen.bind(this),false);
		document.addEventListener("onSocketClose",this.onSocketClose.bind(this),false);
		document.addEventListener("onSocketStatus",this.onSocketStatus.bind(this),false);

		this.load("current");
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
		var data = this.getConfigset(set);
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = this.getConfItem(key);
			data[key] = value;
		}
		confCtrl.save();
		///ar json = JSON.stringify(config); //convert it back to json
		//fs.writeFile('configutration.json', json, 'utf8', function writeFileCallback(err){});

		console.log("new values saved to json storage");
	}

	PanelConf.prototype.load = function (set){
		var vlen = this.keys.length;
		var data = this.getConfigset(set);
		for(var i = 0; i<vlen; i++){
			var key = this.keys[i];
			var value = data[key];
			this.setConfItem(key,value);
		}
		//console.log("default values ... ");
	}
  PanelConf.prototype.getConfigset = function(set){
		var data;

		if(set == "current"){
			data = preset.current;
		}else if(set == "default"){
			data = preset.default;
		}else{
			data = preset.current;
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
