
preset.confp = {
	CMD_SOCKET_ID:3,
	CMD_SOCKET_IP:"192.168.0.71",
	CMD_SOCKET_PORT:9000,
	CMS_EVENT_CODE:"QS",
	CMS_IP:"192.168.0.71",
	CMS_UPLOAD:"/codeigniter/index.php/upload/",
	CMS_LIST:"/codeigniter/index.php/upload/qsrank/",
	CMS_CLEAR_BOARD:"/codeigniter/index.php/upload/qsrankclear/",
	CMS_REQUEST_QUEUE:"/app/pf/tcs/requestQueue.php",
	CMS_SAVE_QUEUE:"/app/pf/tcs/saveQueue.php",
	APP_INFINITE_TEST:"N",
	TIMEOUT:30,
	USE_FLAG:"N",
	USE_CPU_OPPONENT:"N",
	FLAG_TXT:["Mercedes","Red Bull Racing","Ferrari","Force India","Williams","McLaren","Toro Rosso","Haas F1 Team","Renault","Sauber"],
	NUM_FLAG:16,
	MULTI_USER:1,
	FLAG_ROOT:"./flags/flags-normal/"
};
preset.confd = {
	CMD_SOCKET_ID:3,
	CMD_SOCKET_IP:"127.0.0.1",
	CMD_SOCKET_PORT:9000,
	CMS_EVENT_CODE:"QS",
	CMS_IP:"127.0.0.1",
	CMS_UPLOAD:"/app/pf/codeigniter/index.php/upload/",
	CMS_LIST:"/app/pf/codeigniter/index.php/upload/qsrank/",
	CMS_CLEAR_BOARD:"/app/pf/codeigniter/index.php/upload/qsrankclear/",
	CMS_REQUEST_QUEUE:"/app/pf/tcs/requestQueue.php",
	CMS_SAVE_QUEUE:"/app/pf/tcs/saveQueue.php",
	APP_INFINITE_TEST:"N",
	TIMEOUT:30,
	USE_FLAG:"N",
	USE_CPU_OPPONENT:"N",
	FLAG_TXT:["Mercedes","Red Bull Racing","Ferrari","Force India","Williams","McLaren","Toro Rosso","Haas F1 Team","Renault","Sauber"],
	NUM_FLAG:16,
	MULTI_USER:1,
	FLAG_ROOT:"./flags/flags-normal/"
};

tcsapp.appId = "au.com.thecreativeshop";


tcsapp.keyboardlistener = function(e){
	//ipcRenderer.send('keypress', event.ctrlKey , event.key);
}
tcsapp.resizelistener = function(e){
	//$$("screenRes").innerHTML = document.documentElement.clientWidth+"x"+document.documentElement.clientHeight;
}

tcsapp.thingsAfterConfigloaded = function(){
	this.paging(0);
}

	/*
			document.body.addEventListener('touchmove',function(e)
			{
				e = e || window.event;
				var target = e.target || e.srcElement;
				//in case $altNav is a class:
				if (!target.className.match(/\bscrollable\b/))
				{
						e.returnValue = false;
						e.cancelBubble = true;
						if (e.preventDefault)
						{
								e.preventDefault();
								e.stopPropagation();
						}
						return false;//or return e, doesn't matter
				}
				//target is a reference to an $altNav element here, e is the event object, go mad
			},false);
	*/
