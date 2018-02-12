
var cms = {};

cms.gameApprove = function(target,obj,fnc){
  var cmsURL = "http://"+conf.CMS_IP+conf.CMS_UPLOAD;
  log("cmsURL "+cmsURL);

  postAjax(cmsURL, obj, function(readyState,status,data){
    if(readyState == 4){
        if(status == 200){
            fnc(data);
        }else if(status == 404){
          alert("404 Page Not Found");
        }else if(status == 500){
          alert("500 Internal Server Error");
        }else{
          alert("Unknown Error");
        }

    }
  }.bind(target));
}

cms.getListData = function(target,obj,fnc){

}


cms.getQueue = function(target,obj,fnc){
   var cmsURL = "http://"+conf.CMS_IP+conf.CMS_REQUEST_QUEUE;
   log("cmsURL "+cmsURL);

     postAjax(cmsURL, {}, function(readyState,status,data){
       if(readyState == 4){
           if(status == 200){
             fnc(data);
           }else if(status == 404){
             alert("404 Page Not Found");
           }else if(status == 500){
             alert("500 Internal Server Error");
           }else{
             alert("Unknown Error");
           }
       }
     }.bind(target));

}

cms.saveQueue = function(target,obj,fnc){
  var cmsURL = "http://"+conf.CMS_IP+conf.CMS_SAVE_QUEUE;

  log("cmsURL "+cmsURL);

    postAjax(cmsURL, obj, function(readyState,status,data){
      if(readyState == 4){
          if(status == 200){
              fnc(data);
          }else if(status == 404){
              alert("404 Page Not Found");
          }else if(status == 500){
              alert("500 Internal Server Error");
          }else{
              alert("Unknown Error");
          }
      }
    }.bind(target));
}

cms.clearBoard = function(target,obj,fnc){
    var cmsURL = "http://"+conf.CMS_IP+conf.CMS_CLEAR_BOARD;
    postAjax(cmsURL, {}, function(readyState,status,data){
      if(readyState == 4){
        if(status == 200){

            fnc(data);
        }else if(status == 404){
            alert("404 Page Not Found");
        }else if(status == 500){
            alert("500 Internal Server Error");
        }else{
            alert("Unknown Error");
        }
      }
    }.bind(target));

}








function getAjax(url, result) {
   var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
   xhr.open('GET', url);
   xhr.onreadystatechange = function() {
      result(xhr.readyState,xhr.status,xhr.responseText);
   };
   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   xhr.send();
   return xhr;
}
function postAjax(url, data, result) {
   var params = typeof data == 'string' ? data : Object.keys(data).map(
           function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
       ).join('&');

   var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
   xhr.open('POST', url);
   xhr.onreadystatechange = function() {
      result(xhr.readyState,xhr.status,xhr.responseText);
   };
   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
   xhr.send(params);
   return xhr;
}
