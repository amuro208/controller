
const {app, BrowserWindow, ipcMain} = require('electron') // http://electron.atom.io/docs/api
var path = require('path')         // https://nodejs.org/api/path.html
var url = require('url')           // https://nodejs.org/api/url.html

var window = null;
//console.log("process.env.npm_package_config_debug : "+process.env.npm_package_config_debug);

app.on('ready', function () {

  window = new BrowserWindow({
    alwaysOnTop :false,
    width: 1080,
    height: 1080,
    frame:true,
    backgroundColor: "#111",
    show: false,
    kiosk:false
  });

  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  window.once('ready-to-show', function () {
    window.show();
    window.setSize(1080,3840);
    window.setPosition(0,0);

    //window.toggleDevTools();
  });

})

app.on('window-all-closed', function(){
	if(process.plaform!='darwin'){
	app.quit();
	}
});
