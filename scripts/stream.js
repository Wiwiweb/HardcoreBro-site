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

$(document).ready(function() {
    console.info('ready');

    $("#volume-slider").slider({ range: "min" });

    var twitchPlayer = document.getElementById("twitchPlayer");
    twitchPlayer.twitchCallback = function (e, info) {
        console.info('twitchCallback');
        console.info("e = " + e);
        if (e == 'stream_viewer_count') {
            console.info('stream_viewer_count')
        }
        if (e == 'connected') {
            console.info('connected')
        }
        if (e == 'broadcast_finished' || e == 'stream_lost') {
            console.info('broadcast_finished')
        }
    };
});

