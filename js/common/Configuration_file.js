

var fs;
var conf = {};
var confCtrl = {};

confCtrl.initialReady = false;
confCtrl.localreset = function(){

}
confCtrl.compareObjects = function(obj1, obj2){
    var equal = true;
    for (i in obj1){
      if (!obj2.hasOwnProperty(i)){
          console.log("WHAT ? "+i);
          equal = false;
          break;
      }else{
        for (j in obj1[i]){
          if(!obj2[i].hasOwnProperty(j)){
            console.log("WHAT ? "+i);
            equal = false;
            break;
          }
        }
      }
    }
    return equal;
}
confCtrl.load = function(){

  if(this.storage == "local"){
    if (typeof(Storage) !== "undefined") {
      if(localStorage.getItem(tcsapp.appId) == null){
        console.log("LOCAL STORAGE NO CONFIGURATION FILE ");
        confCtrl.objCopy(preset[preset.default],conf);
        confCtrl.save();
      }else{
        var data = localStorage.getItem(tcsapp.appId);
         console.log("LOCAL STORAGE THERE IS CONFIGURATION FILE "+data);

        if(this.compareObjects(preset,JSON.parse(data))){
          console.log("STRUCTURE SAME ");
          preset =  JSON.parse(data);
          confCtrl.objCopy(preset[preset.default],conf);
          confCtrl.initialReady = true;
        }else{
          console.log("STRUCTURE DIFFERENT ");
          confCtrl.objCopy(preset[preset.default],conf);
          confCtrl.save();
        }

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
    }

  }else{
    fs = require("fs");
    fs.readFile('configutration.json', 'utf8', function readFileCallback(err, data){
      if (err){
          console.log("FILE NO CONFIGURATION FILE "+err);
          confCtrl.objCopy(preset[preset.default],conf);
          fs.writeFile('configutration.json', JSON.stringify(preset,null," "), 'utf8', function writeFileCallback(err){

          });

      } else {
          console.log("FILE THERE IS CONFIGURATION FILE "+data);
          preset =  JSON.parse(data);
          confCtrl.objCopy(preset[preset.default],conf);
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



  };



confCtrl.save = function(){
    var json = JSON.stringify(preset,null," ");
      if(this.storage == "local"){
          localStorage.setItem(tcsapp.appId,json);
      }else{
          fs.writeFile('configutration.json', json, 'utf8', function writeFileCallback(err){});
      }
    //location.reload();
}

confCtrl.objCopy = function(o1,o2){
  for(var key in o1){
    o2[key] = o1[key];
  }
}
