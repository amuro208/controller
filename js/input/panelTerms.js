var PanelTerms = function(id){
  Page.call(this,id);
  this.dispalyObj.style.zIndex = 100000;
  this.init();
}

PanelTerms.prototype = Object.create(Page.prototype);
PanelTerms.prototype.constructor = PanelTerms;
PanelTerms.prototype.init = function(){
  this.termslist = [
  '<iframe src="./terms/Terms.docx"                 width="95%" height="100%" style="border: none;overflow:hidden"></iframe>',
  '<iframe src="http://www.nissan.com.au/Privacy"   width="95%" height="100%" style="border: none;overflow:hidden"></iframe>'];

  this.dispalyObj.innerHTML = '<div class="full-popup-inner">\
  <div class="close-button" onclick="closeFullPopup(\''+this.dispalyId+'\')"></div>\
    <ul id="termsTab" class="terms-tab" role="">\
      <li onclick="page_regi.terms.tabActionTerms(0)" class="terms-tab-item">Terms and Conditions</li>\
      <li onclick="page_regi.terms.tabActionTerms(1)" class="terms-tab-item">Privacy Policy</li>\
      <!--li onclick="page_regi.terms.tabActionTerms(2)" class="terms-tab-item">Check out</li-->\
    </ul>\
    <div id="termsFrame" class="terms-body-frame scrollable"></div>\
  </div>';
}

PanelTerms.prototype.tabActionTerms = function(n){
  var src = this.termslist[n];
  $$("termsFrame").innerHTML = src;
  var tab = $$("termsTab");

  for(var i = 0;i<tab.children.length;i++){
    if(i == n){
      console.log("tab.children. active : "+i+"/"+tab.children.length);
      tab.children[i].className = "terms-tab-item terms-tab-item-active";
    }else {
      tab.children[i].className = "terms-tab-item";
    }
  }
}
PanelTerms.prototype.showTerms = function(n){
  openFullPopup(this.dispalyId);
  this.tabActionTerms(n);
}
