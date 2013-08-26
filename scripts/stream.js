console.info("bob");

// SWFObject embedding to create the livestream player
// See http://www.livestream.com/userguide/index.php?title=Channel_API_2.0
flashvars = {
	channel : 'hardcore_bro'
};

params = {
	AllowScriptAccess : 'always',
	allowFullScreen : 'true'
};

swfobject.embedSWF("http://cdn.livestream.com/chromelessPlayer/v20/playerapi.swf", "livestreamPlayer", "100%", "100%", "9.0.0", "expressInstall.swf", flashvars, params);
// swfobject.embedSWF("http://cdn.livestream.com/chromelessPlayer/v20/playerapi.swf",
// "livestreamPlayer", lswidth, lsheight, "9.0.0", "expressInstall.swf",
// flashvars, params);

$(document).ready(function() {
	$("#volume-slider").slider({ range: "min" });
});
