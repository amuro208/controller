
preset.confp = {
	CMD_SOCKET_ID:2,
	CMD_SOCKET_IP:"192.168.0.21",
	CMD_SOCKET_PORT:9000,
	ROOT_PATH:"C:/PROJECTS/PacificFair/Repository",
	FINAL_PATH:"C:/PROJECTS/PacificFair/Repository/Final",
	AUDIO:"Desktop Microphone (Studio - Microsoft LifeCam.)",
	BR:"3000k",
	PRESET:"medium",
	CRF:"20"
};
preset.confd = {
	CMD_SOCKET_ID:2,
	CMD_SOCKET_IP:"127.0.0.1",
	CMD_SOCKET_PORT:9000,
	ROOT_PATH:"C:/AMURO/Workspace/PacificFair/VirtualKick/Repository",
	FINAL_PATH:"C:/AMURO/Workspace/PacificFair/VirtualKick/Repository/Final",
	AUDIO:"Desktop Microphone (Studio - Microsoft LifeCam.)",
	BR:"3000k",
	PRESET:"medium",
	CRF:"20"
};
preset.default = "confp";

tcsapp.appId = "au.com.thecreativeshop.pf.ffmpeg-gif";
tcsapp.confKeys =  ["CMD_SOCKET_ID","CMD_SOCKET_IP","CMD_SOCKET_PORT","ROOT_PATH","FINAL_PATH","AUDIO","BR","PRESET","CRF"];

tcsapp.thingsAfterConfigloaded = function(){
	FFMPEG.init();
	window.addEventListener('keydown', FFMPEG.keyboardlistener);
}
