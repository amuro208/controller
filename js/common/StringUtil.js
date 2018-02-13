var sutil = {}

sutil.zeroName3 = function(n){
  var nStr="";
  if(n<10){
    nStr = "00"+n;
  }else if(n<100){
    nStr = "0"+n;
  }else{
    nStr = ""+n;
  }
  return nStr;
}
sutil.zeroName2 = function(n){
  var nStr="";
  if(n<10){
    nStr = "0"+n;
  }else {
    nStr = ""+n;
  }
  return nStr;
}

/* String Utils*/

sutil.specialCharChk = function(str) {
  var regExpPattern = /[*|\":<>[\]{}`\\()';,#@&$]/;
  //var regExpPattern = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g
  return regExpPattern.test(str);
}

sutil.emailMalformedChk = function(emailStr) {
  var regExpPattern = /^[0-9a-zA-Z][-._a-zA-Z0-9]*@([0-9a-zA-Z][-._0-9a-zA-Z]*\.)+[a-zA-Z]{2,4}$/;
  return regExpPattern.test(emailStr);
}

sutil.mobileMalformedChk = function(str) {
  var result = true;
  if(str.length!=10) result = false;
  for(var i = 0; i<str.length; i++){
    var chkCode = str.charCodeAt(i);
    if(chkCode<48 || chkCode>57){
      if(chkCode != 45){
        result = false;
        break;
      }
    }
  }
  return result;
}

sutil.postCodeformedChk = function(str) {
  if(str.length!=4) return false;
  for(var i = 0; i<str.length ; i++){
    if(str.charCodeAt(i)<48 || str.charCodeAt(i) >57){
      return false;
    }
  }
  return true;
}

sutil.hiddenText = function(str) {
  var arr = new Array();
  for(var i = 0;i<str.length;i++){
    if(str.charAt(i) == "-"){
      arr.push("-");
    }else{
      arr.push("*");
    }
  }
  return toStr(arr);
}


sutil.mobileNumberWithRule = function(str,isBackKey) {
  var arr = new Array();
  var j;
  var i;
  var index;
  var tmpStr = "";
  for(i=0;i<str.length;i++){
    for(j = 0;j<_mobileCheckRule.length;j++){
      index = _mobileCheckRule[j];
      if(i == index){
        if(!isBackKey || isBackKey && str.length>index)
          arr.push("-");
        continue;
      }
    }
    arr.push(str.charAt(i));
  }
  return tmpStr = toStr(arr);
}

sutil._mobileCheckRule;
sutil.mobileCheckRule = function(str){
  var arr = new Array();
  var n = 0;
  for(var i=0;i<str.length;i++){
    if(str.charAt(i) == "-"){
      arr.push(i-n);
      n++;
    }
  }
  this._mobileCheckRule =  arr;
}

sutil.toStr = function(arr)
{
  var str = "";
  for(var k=0;k<arr.length;k++)
  {
    str+=arr[k];
  }
  return str;
}
