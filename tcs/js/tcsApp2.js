importScript('./tcs/js/tcsApp.js');

var {ipcRenderer, remote} = require('electron');
var main = remote.require("./app.js");

tcsapp.keyboardlistener = function(e){
	ipcRenderer.send('keypress', event.ctrlKey , event.key);
}
