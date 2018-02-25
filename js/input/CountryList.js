var countrylist = {};

countrylist.countryDataParsing = function(data){
	var arr = data.split("\r\n");
	countrylist.cnames = new Array();
	countrylist.ccode = new Array();
	for(var i = 0;i<arr.length;i++){
		var strs = arr[i].split(",");
		countrylist.cnames.push(strs[0]);
		countrylist.ccode.push(strs[1]);
	}
	console.log("displayFlag : cnames "+countrylist.cnames);
	console.log("displayFlag : ccode "+countrylist.ccode);
}
countrylist.getCountryName = function(data){
  var cname = "";
  for(var i = 0;i<countrylist.ccode.length;i++){
    if(data == countrylist.ccode[i]){
      cname = countrylist.cnames[i];
      break;
    }
  }
  return cname;
}
countrylist.getCountryCode = function(data){
  var code = "";
  for(var i = 0;i<countrylist.ccode.length;i++){
    if(data == countrylist.cnames[i]){
      code = countrylist.ccode[i];
      break;
    }
  }
  return code;
}
countrylist.getCountryIndex = function(data){
  var index = -1;
  for(var i = 0;i<countrylist.ccode.length;i++){
    if(data == countrylist.cnames[i]){
      index = i;
      break;
    }
  }
  return index;
}
countrylist.loadCountrylist = function(url,obj,fnc){
  postAjax(url, {}, function(readyState,status,data){
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
  });
}

countrylist.loadCountrylist("./flags/country.txt",null,countrylist.countryDataParsing);
