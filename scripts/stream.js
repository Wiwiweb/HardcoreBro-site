var twitchPlayer = null;

$(document).ready(function() {
    console.info('ready');
    console.info(document.domain);

    $("#volume-slider").slider({ range: "min" });

    setTimeout(twitchInit, 3000)
//    twitchPlayer.twitchCallback = function (e, info) {
//        console.info('twitchCallback');
//        console.info("e = " + e);
//        if (e == 'stream_viewer_count') {
//            console.info('stream_viewer_count')
//        }
//        if (e == 'connected') {
//            console.info('connected')
//        }
//        if (e == 'broadcast_finished' || e == 'stream_lost') {
//            console.info('broadcast_finished')
//        }
//    };

    function twitchInit() {
        console.info("twitchInit");
        twitchPlayer = document.getElementById("twitchPlayer");
        console.info(twitchPlayer);
    }

    $('#play-pause').click(function () {
        console.info('click');
        twitchPlayer.resume_video();
    });
});

