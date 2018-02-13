

var fs = require("fs");
var conf = {};
var preset = {};
preset.current = {};
preset.default = {};

var confCtrl = {};
confCtrl.initialReady = false;
confCtrl.load = function(){
  fs.readFile('configutration.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log("NO CONFIGURATION FILE "+err);
        confCtrl.objCopy(conf,preset.current);
        confCtrl.objCopy(conf,preset.default);
        var json = JSON.stringify(preset,null ," "); //convert it back to json
        fs.writeFile('configutration.json', json, 'utf8', function writeFileCallback(err){}); // write it back
    } else {
        console.log("THERE IS CONFIGURATION FILE "+data);
        preset =  JSON.parse(data);
        confCtrl.objCopy(preset.current,conf);
        confCtrl.initialReady = true;

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

  });
}

confCtrl.save = function(){
    var json = JSON.stringify(preset,null," ");
    fs.writeFile('configutration.json', json, 'utf8', function writeFileCallback(err){});
    this.objCopy(preset.current,conf);
    location.reload();
}

confCtrl.objCopy = function(o1,o2){
  for(var key in o1){
    o2[key] = o1[key];
  }
}
