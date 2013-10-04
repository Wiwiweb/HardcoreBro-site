var twitchMainChannel = 'Destructoid';
var twitchSecondaryChannel = 'MANvsGAME';
var twitchQuality = 'live';
var livestreamChannel = 'hardcore_bro';
var defaultVolume = 50;

var checkTwitchLoadedInterval;

var $twitchPlayer;
var $lsPlayer;
var $playPauseButton;
var $playPauseImage;
var $volumeSlider;
var $volumeSliderImage;
var $titleText;
var $channelDropdown;

//var currentPlayer = 'twitch';
var currentPlayer = 'livestream';
var currentTwitchChannel = twitchMainChannel;

jQuery.fn.center = function () {
    this.width(Math.min(this.height() * (4 / 3), this.parent().width()) + "px");
    this.css('left', Math.max(0, (this.parent().width() - this.outerWidth()) / 2) + "px");
};


$(document).ready(function () {
    console.info('ready');
    console.info(document.domain);

    $playPauseButton = $('#play-pause');
    $playPauseImage = $('#play-button-image');
    $volumeSlider = $("#volume-slider");
    $volumeSliderImage = $('#volume-button-image');
    $titleText = $('#title-text');
    $channelDropdown = $('#channel-dropdown');

    $volumeSlider.slider({
        range: "min",
        value: defaultVolume,
        animate: 100,
        slide: changeVolume
    });
    $channelDropdown.change(function () {
        channelDropdown($channelDropdown[0].value)
    });

    $twitchPlayer = $("#twitch-player");
    console.log($twitchPlayer);
    if (currentPlayer == 'twitch') {
        checkTwitchLoadedInterval = setInterval(checkTwitchLoaded, 50);
    }

    $lsPlayer = $("#livestream-player");
    console.log($lsPlayer);

    setInterval(updateTitle, 60000);

    $(window).resize(function () {
        $twitchPlayer.center()
    });
});

function checkTwitchLoaded() {
    console.log('twitch PercentLoaded: ' + $twitchPlayer[0].PercentLoaded());
    if ($twitchPlayer[0].PercentLoaded() == 100) {
        twitchInit();
        clearInterval(checkTwitchLoadedInterval);
    }
}

function twitchInit() {
    console.info("twitchInit");
    $twitchPlayer.center();
    play();
    updateTitle();
    $twitchPlayer[0].change_volume(defaultVolume)
}

function twitchCallback(e, info) {
    console.info("twitchCallback: " + e);
    if (e == 'stream_viewer_count') {
        console.info('stream_viewer_count')
    }
    if (e == 'connected') {
        console.info('connected')
    }
    if (e == 'broadcast_finished' || e == 'stream_lost') {
        console.info('broadcast_finished')
    }
}

function livestreamInit() {
    console.info("livestreamInit");
    $lsPlayer[0].load(livestreamChannel);
    $lsPlayer[0].showPlayButton(false);
    $lsPlayer[0].showPauseButton(false);
    $lsPlayer[0].showMuteButton(false);
    $lsPlayer[0].showFullscreenButton(true);
    $lsPlayer[0].showThumbnail(true);
    play();
    updateTitle();
    $lsPlayer[0].setVolume(defaultVolume / 100);
}

function livestreamCallback(e) {
    console.info("livestreamCallback: " + e);
    if (e == 'ready') {
        livestreamInit()
    } else if (e == 'connectionEvent') {
        setTimeout(updateTitle, 1000)
    } else if (e == 'playbackEvent') {
        updateTitle()
    }
}

function play() {
    console.log('play');
    if (currentPlayer == 'twitch') {
        $twitchPlayer[0].play_live(currentTwitchChannel, twitchQuality)
    } else {
        $lsPlayer[0].startPlayback();
    }
    $playPauseImage.attr('src', 'images/pause.png');
    $playPauseButton.off('click').on('click', pause);
}

function pause() {
    console.log('pause');
    if (currentPlayer == 'twitch') {
        $twitchPlayer[0].pause_video()
    } else {
        $lsPlayer[0].stopPlayback()
    }
    $playPauseImage.attr('src', 'images/play.png');
    $playPauseButton.off('click').on('click', play);
}

function changeVolume(event, ui) {
    var volume = ui.value;
    console.log('changeVolume: ' + volume);
    if (currentPlayer == 'twitch') {
        $twitchPlayer[0].change_volume(volume)
    } else {
        $lsPlayer[0].setVolume(volume / 100)
    }
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

function updateTitle() {
    if (currentPlayer == 'twitch') {
        $.getJSON('https://api.twitch.tv/kraken/streams/' + currentTwitchChannel +
            '?callback=?', function (data) {
            var text;
            if (data.stream) { // Twitch is live
                text = data.stream.channel.status;
            } else {
                text = "Channel offline.";
            }
            console.log('updateTitle: ' + text);
            $titleText.text(text);
        });
    } else {
        var text = $lsPlayer[0].getCurrentContentTitle();
        if (text != null) {
            $titleText.text(text);
        }
        console.log('updateTitle: ' + text);
    }
}

function channelDropdown(choice) {
    console.log("channelDropdown: " + choice);
    switch (choice) {
        case 'twitch1':
            currentTwitchChannel = twitchMainChannel;
            if (currentPlayer == 'twitch') {
                play();
                updateTitle();
            } else {
                changePlayer('twitch')
            }
            break;
        case 'twitch2':
            currentTwitchChannel = twitchSecondaryChannel;
            if (currentPlayer == 'twitch') {
                play();
                updateTitle();
            } else {
                changePlayer('twitch')
            }
            break;
        case 'livestream':
            changePlayer('livestream');
            break;
    }
}

function changePlayer(player) {
    console.log("changePlayer: " + player);
    if (player != currentPlayer) {
        currentPlayer = player;
        clearInterval(checkTwitchLoadedInterval);
        switch (player) {
            case 'twitch':
                $lsPlayer.hide();
                $twitchPlayer.show();
                checkTwitchLoadedInterval = setInterval(checkTwitchLoaded, 50);
                break;
            case 'livestream':
                $twitchPlayer.hide();
                $lsPlayer.show();
                break;
        }
    }
}