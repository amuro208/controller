
var PanelDebug = function(id){
  Page.call(this,id);
  this.dispalyObj.innerHTML = '\
  <div class="full-popup-inner" style="width:90%;">\
    <div class="close-button" onclick="closeFullPopup(\''+this.dispalyId+'\')"></div>\
    <h1>DEBUG CONSOLE</h1>\
    <div class="full-popup-body">\
      <textarea  class="debug-txt-area scrollable" id="debugTxtArea"></textarea >\
    </div>\
    <div class="full-popup-utils">\
      <input id="debugInput" class="form-control" type="textbox"/>\
      <button id="debugBtnSend" onclick="tcsapp.debug.sendMessage()" class="btn btn-md btn-default">Send</button>\
      </div>\
    </div>\
  </div>';
}

PanelDebug.prototype = Object.create(Page.prototype);
PanelDebug.prototype.constructor = PanelDebug;

PanelDebug.prototype.init = function(){
  this.debugTxtArea = $$("debugTxtArea");
  this.debugInput = $$("debugInput");
}
PanelDebug.prototype.sendMessage = function (){
  if(this.debugInput){
    var msg = this.debugInput.value;
    if(!msg) {
      alert("Message can not be empty");
      return;
    }
    tcsapp.tcssocket.send("ALL","MSG",msg);
    this.debugInput.value="";
  }
}
