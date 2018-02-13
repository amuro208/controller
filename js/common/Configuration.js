

var fs;
var conf = {};
var confCtrl = {};

confCtrl.initialReady = false;
confCtrl.storage = "local";
confCtrl.load = function(){

  if(this.storage == "local"){
    if (typeof(Storage) !== "undefined") {
      if(localStorage.getItem(tcsapp.appId) == null){
        console.log("NO CONFIGURATION FILE ");
        confCtrl.objCopy(preset.confp,conf);
        confCtrl.save();
      }else{
        var data = localStorage.getItem(tcsapp.appId);
          console.log("THERE IS CONFIGURATION FILE "+data);
        var obj =  JSON.parse(data);
        confCtrl.objCopy(obj,conf);
        confCtrl.initialReady = true;
      }
    }

  }else{
    fs = require("fs");
    fs.readFile('configutration.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log("NO CONFIGURATION FILE "+err);
          confCtrl.objCopy(preset.confp,conf);
          confCtrl.save();
      } else {
          console.log("THERE IS CONFIGURATION FILE "+data);
          var obj =  JSON.parse(data);
          confCtrl.objCopy(obj,conf);
          confCtrl.initialReady = true;

      }
    });
  }

    var event = new CustomEvent("onConfigLoaded", {
      detail: {
        msg:"onConfigLoaded",
        time:new Date()
      },
      bubbles: true,
      cancelable: true
      });
    document.dispatchEvent(event);

  };


confCtrl.save = function(){
    var json = JSON.stringify(conf,null," ");
      if(this.storage == "local"){
          localStorage.setItem(tcsapp.appId,json);
      }else{
          fs.writeFile('configutration.json', json, 'utf8', function writeFileCallback(err){});
      }
    location.reload();
}

confCtrl.objCopy = function(o1,o2){
  for(var key in o1){
    o2[key] = o1[key];
  }
}
