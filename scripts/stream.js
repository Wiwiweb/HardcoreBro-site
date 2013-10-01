var twitchChannel = 'Destructoid';
var twitchQuality = 'live';

jQuery.fn.center = function () {
    this.width(Math.min(this.height() * (4 / 3), this.parent().width()) + "px");
    this.css('left', Math.max(0, (this.parent().width() - this.outerWidth()) / 2) + "px");
};


$(document).ready(function () {
    console.info('ready');
    console.info(document.domain);

    var $playPauseButton = $('#play-pause');
    var $playPauseImage = $('#play-button-image');
    var $volumeSlider = $("#volume-slider");
    $volumeSlider.slider({ range: "min" });
    var $volumeSliderImage = $('#volume-button-image');


    var $twitchPlayer = $("#twitch-player");
    console.log($twitchPlayer[0]);
    var checkTwitchLoadedInterval = setInterval(checkTwitchLoaded, 50);

    function checkTwitchLoaded() {
        console.log('twitch PercentLoaded: ' + $twitchPlayer[0].PercentLoaded());
        if ($twitchPlayer[0].PercentLoaded() == 100) {
            twitchInit();
            clearInterval(checkTwitchLoadedInterval);
        }
    }

    function twitchInit() {
        console.info("twitchInit");
        console.info($twitchPlayer);
        $twitchPlayer.center();
        play();
        $volumeSlider.on('slide', changeVolume);
    }

    $twitchPlayer[0].twitchCallback = function (e, info) {
        console.info("twitchCallback = " + e);
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

    function play() {
        console.log('play');
        $twitchPlayer[0].play_live(twitchChannel, twitchQuality);
        $playPauseImage.attr('src', 'images/pause.png');
        $playPauseButton.off('click').on('click', pause);
    }

    function pause() {
        console.log('pause');
        $twitchPlayer[0].pause_video();
        $playPauseImage.attr('src', 'images/play.png');
        $playPauseButton.off('click').on('click', play);
    }

    function changeVolume(event, ui) {
        var volume = ui.value;
        console.log('changeVolume: ' + volume);
        $twitchPlayer[0].change_volume(volume);
        if (volume > 80) {
            $volumeSliderImage.attr('src', 'images/volume_high.png')
        } else if (volume > 40) {
            $volumeSliderImage.attr('src', 'images/volume_mid.png')
        } else if (volume > 0) {
            $volumeSliderImage.attr('src', 'images/volume_low.png')
        } else {
            $volumeSliderImage.attr('src', 'images/volume_mute.png')
        }
    }

//    $('#play-pause').click(function () {
//        console.info('play-pause');
//        $twitchPlayer.resume_video();
//    });
//
//    $('#volume').click(function () {
//        console.info('volume');
//        $twitchPlayer.mute();
//    });
//
    $(window).resize(function () {
        $twitchPlayer.center()
    });

});