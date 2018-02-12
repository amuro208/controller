var user = {};

user.queuedata =
{
  "userqueues":[]
}

var UserData = function() {
    this.userTitle = "";
    this.userFirstName = "";
    this.userLastName = "";
    this.userEmail = "";
    this.userFlag = -1;
    this.userMobile = "";
    this.userPostcode = "";
    this.userOption1 = false;
    this.userOption2 = false;
    this.userOption3 = false;
    this.check = false;

    this.reset = function(){
      this.userTitle = "";
      this.userFirstName = "";
      this.userLastName = "";
      this.userEmail = "";
      this.userFlag = -1;
      this.userMobile = "";
      this.userPostcode = "";
      this.userOption1 = false;
      this.userOption2 = false;
      this.userOption3 = false;
      this.check = false;
    }

    this.print = function(){
      log("User Info : "+this.userTitle+":"+this.userFirstName+":"+this.userLastName+":"+this.userEmail+":"+this.userFlag+":"+this.userMobile+":"+this.userPostcode+":"+this.userOption1+":"+this.userOption2+":"+this.userOption3+":"+this.check);
    }

}
