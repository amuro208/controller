const {app, BrowserWindow, ipcMain} = require('electron') // http://electron.atom.io/docs/api
var path = require('path')         // https://nodejs.org/api/path.html
var url = require('url')           // https://nodejs.org/api/url.html

var window = null;
//console.log("process.env.npm_package_config_debug : "+process.env.npm_package_config_debug);
var debug = false;
debug = process.env.npm_package_config_debug=="false"?false:true;
//console.log("process.env.debug : "+process.env.tcsdebug);
// exports.pong = arg => {
//     //Print 6
//     console.log("pong : "+arg);
// }
//
// ipcMain.on('async', (event, arg) => {
//     // Print 1
//     console.log("async "+arg);
//     // Reply on async message from renderer process
//     event.sender.send('async-reply', 2);
// });
//
// ipcMain.on('sync', (event, arg) => {
//     // Print 3
//     console.log("sync "+arg);
//     // Send value synchronously back to renderer process
//     event.returnValue = 4;
//     // Send async message to renderer process
//     window.webContents.send('ping', 5);
// });
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
/*
var SerialPort = require('serialport');
   var port = new SerialPort('COM3', {baudRate: 9600,  'disconnectedCallback': function () {
     console.log("DEVICE: Disconnected.");
     }}, false);


    const Readline = SerialPort.parsers.Readline;
    const parser = new Readline();
    port.pipe(parser);
    parser.on('data', onData);
    port.write('ARDUINO PLEASE RESPOND\n');
    port.on('open', onPortOpen);
    port.on('close', onClose);
    port.on('error', onError);




    //var ipcMain = require('electron').ipcMain;
    ipcMain.on("arduinoCommand",function(event,data){
      //port.write(data+"\n");
      port.write(data+'\n', function(error, results) {
            if(error){
                console.log(error);
                //Handle Error
            }
            if(results){
                console.log(results);
                //Handle Error
            }

                console.log("Write : " + data);
                // uncomment below line to close the port internally after writing.
                //port.close();


        });
    })
    function onPortOpen(){
        console.log("YESSIR THE PORT IS OPEN COS CAPS");
    }

    var strBuff = "";
    function onData(d)
    {
      for(var i = 0;i<d.length;i++){
        //console.log("typeof(d) :: "+typeof(d));
				if(d.charCodeAt(i) == 13){
					strBuff.substring(0,strBuff.length-1);
          window.webContents.send('arduinoData', strBuff);
					strBuff = "";
				}else{
					strBuff+=d.charAt(i);
				}
			}
    }

    function onClose(){
        console.log("Port is closed, yo");
    }
    function onError(err){
        console.log("Something went horribly wrong : "+err.message);
    }

*/





// Wait until the app is ready
app.on('ready', function () {
  // Create a new window
  if(debug){
    window = new BrowserWindow({
      alwaysOnTop :false,
      width: 1080,
      height: 1080,
      frame:true,
      titleBarStyle: 'hidden',
      backgroundColor: "#111",
      show: false,
      kiosk:false
    });
  }else{
    window = new BrowserWindow({
      alwaysOnTop :true,
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
