
importScript('./js/input/panelTerms.js');
importScript('./js/input/panelThankyou.js');

var PageRegi = function(id){
	Page.call(this,id);
  this.users = [];
	this.selectedFlag = 0;
	this.selectedUser = 0;
	this.cbChecked = [true];
	this.cbMandatory = [true];
	this.enableBtnClick = 0;

	this.forms = ["userFirstName","userLastName","userEmail","userFlag","userOption1"];
	//this.forms = ["userFirstName","userLastName","userEmail","userMobile","userFlag","userPostcode","userOption1","userOption1","userOption2","userOption3",""];
	this.terms = new PanelTerms("panelTerms");
	this.thankyou = new PanelThankyou("panelThankyou");
}

	PageRegi.prototype = Object.create(Page.prototype);
	PageRegi.prototype.constructor = PageRegi;

	PageRegi.prototype.init = function(){
		  document.addEventListener("onSocketMessage",this.onSocketMessage.bind(this),false);
			for(var i=0;i<conf.MULTI_USER;i++){
				this.users[i] = new UserData();
			}
			if(conf.MULTI_USER == 1){
				/* Not use full-popup option*/
				$$("appPageBody").innerHTML = $$("userInputBody").innerHTML;
				$$("userInputBody").innerHTML = "";
			}
			if(conf.USE_FLAG == "N"){
				$$("userFlags").innerHTML = "";
			}else{
				this.flagSetting();
			}
			this.reset();
	}

	PageRegi.prototype.ready = function(){
		this.setHeader("REGISTRATION");
	}

	PageRegi.prototype.onSocketMessage = function(e){
		if(e.detail.cmd == "USERDATA_RECEIVED"){
			$$("queuePositionNum").innerHTML = " "+e.detail.msg;
			this.thankyou.showMessage();
			this.reset();
		}
	}

	PageRegi.prototype.mouseClickOnFlag = function(e){
		this.flagSelect(parseInt(e.currentTarget.id.substring(4)));
	}
	PageRegi.prototype.flagSelect = function(n){
		if(conf.USE_FLAG == "N")return false;
		if(n != NaN){
			if(this.selectedFlag>0){
				$$("flag"+this.selectedFlag).className = "flag";
			}
			if(n>0){
				$$("flag"+n).className = "flag flag-selected";
				}
		}
		this.selectedFlag = n;
	}

	PageRegi.prototype.flagSetting = function(){
		var index = 0;
		for(var i = 0;i<conf.NUM_FLAG;i++){
			//for(var j = 0;j<3;j++){
				var flag  = document.createElement("DIV");
				var img   = document.createElement("IMG");
				var badge = document.createElement("IMG");
				var txt   = document.createElement("DIV");
				flag.className = "flag";
				img.className = "img";
				txt.className = "txt";
				badge.className = "badge";
				flag.setAttribute("id", "flag"+(index+1));
				badge.src = "./img/checked.png";
				img.src = "./img/flags/flag"+(index+1)+".png";
				txt.innerHTML = conf.FLAG_TXT[index];
				flag.appendChild(img);
				flag.appendChild(badge);
				flag.appendChild(txt);
				flag.addEventListener("mouseup",this.mouseClickOnFlag.bind(this),false);
				flag.addEventListener("touchend",this.mouseClickOnFlag.bind(this),false);
				$$("flagContainer").appendChild(flag);
				index++;
			//}

		}
	}
	PageRegi.prototype.resetUserDatas = function(){
		for(var i=0;i<conf.MULTI_USER;i++){
			var user = this.users[i];
			user.reset();
			user.print();
			this.multiUserThumbnailSetting(i);
		}
	}
	PageRegi.prototype.reset = function(){
		this.resetForms();
		this.resetUserDatas();
		this.checkSubmitAvailable();

	}
	PageRegi.prototype.checkSubmitAvailable = function(){
		if(conf.MULTI_USER == 1)return;
		var bool = true;
		for(var i=0;i<conf.MULTI_USER;i++){
			var user = this.users[i];
			if(user.check == true ){
				bool = false;
				break;
			}
		}

		$$("btn-reset").disabled = bool;
		$$("btn-submit").disabled = bool;
	}

	PageRegi.prototype.multiUserThumbnailSetting = function(n){
			if(conf.MULTI_USER == 1)return;
			var user = this.users[n];
			var thumb = $$("userBtn"+n);
			if(user.check){
				var flag1 = isNaN(parseInt(user.userFlag))?0:parseInt(user.userFlag);
				var fStr1 = "<img src = './img/flags/flag"+flag1+".png'/>";
				var nStr1 = "<input type='text' class='uname noselect' readonly='true' value="+user.userFirstName+">\
										 <input type='text' class='uname noselect' readonly='true' value="+user.userLastName+">";

				if(conf.USE_FLAG == "N"){
					fStr1 = "";
				}

				thumb.innerHTML = "\
				<div class='overlay'></div>\
				<div class='inner-single'>\
				<div class='flag-single'>"+fStr1+"</div>\
				<div class='name-single'>"+nStr1+"</div>\
				</div>";
			}else{
				thumb.innerHTML = "PLAYER1<br>Register Player";
			}
	}

	PageRegi.prototype.resetForms = function(){
		if(this.isForm("userTitle"))this.setRadioValue('userTitle',-1);
		if(this.isForm("userFirstName"))$$("userFirstName").value = "";
		if(this.isForm("userFirstName"))$$("userLastName").value = "";
		if(this.isForm("userEmail"))$$("userEmail").value = "";
		if(this.isForm("userFlag"))this.flagSelect(0);
		if(this.isForm("userMobile"))$$("userMobile").value = "";
		if(this.isForm("userPostcode"))$$("userPostcode").value = "";
		this.resetCheckBox(false);
	}

	

  PageRegi.prototype.fakeUsers = [
	{"fname":"Amuro",  "lname":"Lee",         "email":"amuro208@gmail.com",               "flag":1, "mobile":"0443399887","post":"2016"},
	{"fname":"Miyoung","lname":"Kang",        "email":"miyoung.kang@gmail.com",           "flag":2, "mobile":"0465123431","post":"2022"},
	{"fname":"Marcus", "lname":"Joy",         "email":"marcus.joy@thecreativeshop.com.au","flag":3, "mobile":"0476761123","post":"2065"},
	{"fname":"Luis",   "lname":"Youn",        "email":"yhy2015@gmail.com",                "flag":4, "mobile":"0444433334","post":"2000"},
	{"fname":"David",  "lname":"Wommelsdorff","email":"david.w@gmail.com",                  "flag":10, "mobile":"0412233432","post":"2011"},
	{"fname":"Malsook",  "lname":"Kim",         "email":"malsook@gmail.com",               "flag":6, "mobile":"0443399887","post":"2016"},
	{"fname":"Sunbum","lname":"Kang",        "email":"s.kang@gmail.com",           "flag":7, "mobile":"0465123431","post":"2022"},
	{"fname":"George", "lname":"Malaca",         "email":"g.malaca@thecreativeshop.com.au","flag":9, "mobile":"0476761123","post":"2065"},
	{"fname":"Kurt",   "lname":"Cobain",        "email":"kurt.cobain@gmail.com",                "flag":8, "mobile":"0444433334","post":"2000"},
	{"fname":"David",  "lname":"Grohl","email":"david.grohl@gmail.com",                  "flag":2, "mobile":"0412233432","post":"2011"}];

	PageRegi.prototype.defaultPunchin = function(){
		var obj = this.fakeUsers[Math.floor(Math.random() * this.fakeUsers.length)];
		if(this.isForm("userFirstName"))$$("userFirstName").value = obj.fname;
		if(this.isForm("userFirstName"))$$("userLastName").value = obj.lname;
		if(this.isForm("userEmail"))$$("userEmail").value = obj.email;
		if(this.isForm("userFlag"))this.flagSelect(obj.flag);
		if(this.isForm("userMobile"))$$("userMobile").value = obj.mobile;
		if(this.isForm("userPostcode"))$$("userPostcode").value = obj.post;

	}
	PageRegi.prototype.resetCheckBox = function(b){
		if(b){
			var user = this.users[this.selectedUser];
			for(var i=0;i<this.cbChecked.length;i++){
				$$("userOption"+(i+1)).checked =user["userOption"+(i+1)];
			}
		}else{
			for(var i=0;i<this.cbChecked.length;i++){
				$$("userOption"+(i+1)).checked =this.cbChecked[i];
			}
		}


	}
	PageRegi.prototype.openInput = function(n){
		this.selectedUser = n;
		var user = this.users[this.selectedUser];
		if(user.check){
			if(this.isForm("userFirstName"))$$("userFirstName").value = user.userFirstName;
			if(this.isForm("userFirstName"))$$("userLastName").value = user.userLastName;
			if(this.isForm("userEmail"))$$("userEmail").value = user.userEmail;
			if(this.isForm("userFlag"))this.flagSelect(user.userFlag);
			if(this.isForm("userMobile"))$$("userMobile").value = user.userMobile;
			if(this.isForm("userPostcode"))$$("userPostcode").value = user.userPostcode;
			this.resetCheckBox(true);

		}else{
			this.resetForms();
		}
		$$("userInputTitle").innerHTML = "PLAYER"+(n+1);
		openFullPopup('userInput');
	}

	PageRegi.prototype.delete = function(){
		var user = this.users[this.selectedUser];
		user.reset();
		this.resetForms();
		this.checkSubmitAvailable();
		closeFullPopup('userInput');
		this.multiUserThumbnailSetting(this.selectedUser);
	}

  PageRegi.prototype.isForm = function(s){
		if(this.forms.indexOf(s)>-1)return true;
		else return false;
	}

PageRegi.prototype.getRadioValue = function(field){
	var radios = document.getElementsByName(field);
	var value = " ";
	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
	        value = radios[i].value;
	        break;
	    }
	}
	return value;
}
PageRegi.prototype.setRadioValue = function(field,n){
	var radios = document.getElementsByName(field);
	for (var i = 0, length = radios.length; i < length; i++) {
	    if (i == n) {
	        radios[i].checked = true;

	    }else{
				 radios[i].checked = false;
			}
	}

}

  PageRegi.prototype.punchIn = function(){

		var user = this.users[this.selectedUser];
		var value;
		if(this.isForm("userTitle")){
			value = this.getRadioValue("userTitle");
			if(value == " "){alert("Check your title");return false};
			user.userTitle = value;
		}
		if(this.isForm("userFirstName")){
			value = $$("userFirstName").value;
			if(value == "" || sutil.specialCharChk(value)){alert("Check your first name");return false};
			user.userFirstName = value;
		}
		if(this.isForm("userLastName")){
				value = $$("userLastName").value;
				if(value == "" || sutil.specialCharChk(value)){alert("Check your last name");return false};
				user.userLastName = value;
			}
		if(this.isForm("userEmail")){
				value = $$("userEmail").value;
				if(value == "" || !sutil.emailMalformedChk(value)){alert("Check your email address");return false};
				user.userEmail = value;
			}
		if(this.isForm("userFlag")){
				if(conf.USE_FLAG == "Y" && this.selectedFlag<1){alert("Please select your team");return false};
				user.userFlag = this.selectedFlag;
			}
		if(this.isForm("userMobile")){
				value = $$("userMobile").value;
				if(value == "" || !sutil.mobileMalformedChk(value)){alert("Check your mobile number");return false};
				user.userMobile = value;
			}
		if(this.isForm("userPostcode")){
				value = $$("userPostcode").value;
				if(value == "" || !sutil.postCodeformedChk(value)){alert("Check your postcode");return false};
				user.userPostcode = value;
			}
		if(this.isForm("userOption1")){
				user.userOption1 = $$("userOption1").checked;
				if(this.cbMandatory[0] && !user.userOption1){alert("Check terms and condition");return false};
			}
		if(this.isForm("userOption2")){
				user.userOption2 = $$("userOption2").checked;
				if(this.cbMandatory[1] && !user.userOption2){alert("Check terms and condition");return false};
			}
		if(this.isForm("userOption3")){
				user.userOption3 = $$("userOption3").checked;
				if(this.cbMandatory[2] && !user.userOption2){alert("Check terms and condition");return false};
			}

		user.check = true;
		if(conf.MULTI_USER > 1){
			closeFullPopup('userInput');
			this.multiUserThumbnailSetting(this.selectedUser);
		}
		this.checkSubmitAvailable();
		return true;
	}
  PageRegi.prototype.getFormValues = function(key){
		var values = "";
		for(var i = 0;i<this.users.length;i++){
			var user = this.users[i];
			values+=user[key];
			if(i<this.users.length-1){
				values+="|";
			}
		}
		console.log(this.users.length+" : "+key+" : "+values);
		return values;
	}

	PageRegi.prototype.submit = function(){
		if(conf.MULTI_USER == 1){
			if(!this.punchIn()){
				//alert("Unknown error");
				return;
			}
		}
		var userTitle = this.getFormValues("userTitle");
		var userFirstName = this.getFormValues("userFirstName");
		var userLastName = this.getFormValues("userLastName");
		var userEmail = this.getFormValues("userEmail");
		var userMobile = this.getFormValues("userMobile");
		var userFlag = this.getFormValues("userFlag");
		var userPostcode = this.getFormValues("userPostcode");
		var userOption1 = this.getFormValues("userOption1");
		var userOption2 = this.getFormValues("userOption2");
    var userOption3 = this.getFormValues("userOption3");

		tcsapp.tcssocket.send("ALL","USERDATA",userFirstName+","+userLastName+","+userEmail+","+userFlag+","+userMobile+","+userPostcode+","+userOption1+","+userOption2+","+userOption3+","+userTitle);

	}
