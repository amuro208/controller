const {app, BrowserWindow, ipcMain} = require('electron') // http://electron.atom.io/docs/api
var path = require('path')         // https://nodejs.org/api/path.html
var url = require('url')           // https://nodejs.org/api/url.html
var argLen = process.argv.length;
console.log("process.argv.debug : "+process.argv[argLen-1]);
var debug = false;
if(process.argv[argLen-1] == "d"){
  debug = true;
}

var window = null;

ipcMain.on('keypress', (event, ctrl,key) => {
    // Print 1
    console.log("keypress "+ctrl+":"+key);

    if(ctrl){
      switch(key){
        case "f":
        if(debug){
          debug = false;
          window.setSize(1080,1920);
          window.setAlwaysOnTop(true);
          window.closeDevTools();
          window.setKiosk(true);


        }else{
          debug = true;
          window.setKiosk(false);
          window.setAlwaysOnTop(false);
          window.openDevTools();
        }

        break;
      }
    }
    // Reply on async message from renderer process
    //event.sender.send('async-reply', 2);
});


app.on('ready', function () {
  // Create a new window
  if(debug){
    window = new BrowserWindow({
      alwaysOnTop :false,
      x:100,
      y:0,
      width: 1080,
      height: 1920,
      frame:true,
      titleBarStyle: 'hidden',
      backgroundColor: "#111",
      show: false,
      kiosk:false
    });
  }else{
    window = new BrowserWindow({
      alwaysOnTop :true,
      x:0,
      y:0,
      width: 1080,
      height: 1920,
      frame:false,
      titleBarStyle: 'hidden',
      backgroundColor: "#111",
      show: false,
      kiosk:true
    });
  }



  //window.setAutoHideMenuBar(true);
  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Show window when page is ready
  window.once('ready-to-show', function () {
    window.show();
    window.setSize(1080,1920);
    window.setPosition(0,0);

	  //window.toggleDevTools();
  })
/*
  globalShortcut.register('CommandOrControl+F', () => {
  //  console.log("window.getFullScreen()) : "+window.getFullScreen());
    if(window.isFullScreen()){
      window.setFullScreen(false);
      window.setSize(1080,3840);

      //window.setMenu();

    }else{
      window.setFullScreen(true);
      window.setSize(1080,3840);
      //window.setMenu(null);
    }
  })
*/


})







app.on('window-all-closed', function(){
	if(process.plaform!='darwin'){
	app.quit();
	}
});
