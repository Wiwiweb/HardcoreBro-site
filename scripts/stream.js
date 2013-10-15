var twitchMainChannel = 'hardcore_bro';
var twitchSecondaryChannel = 'nisan88';
var twitchQuality = 'live';
var livestreamChannel = 'hardcore_bro';
var defaultVolume = 50;
var autoswitch = true;
var paused = false;

var checkTwitchLoadedFrequency = 50;
var updateLivestreamTitleFrequency = 1000;
var updateLivestreamViewerCountFrequency = 5000;
var checkTwitchLiveFrequency = 5000;
var twitchUpdateCallFrequency = 5000;

var rememberedVolume = 50;

var checkTwitchLoadedInterval;
var reloadTwitchOnForbiddenTimeout;

var updateLivestreamTitleInterval;
var updateLivestreamViewerCountInterval;
var switchIfTwitchLiveInterval;
var twitchUpdateCallInterval;
var scrollTextInterval = false;

var $twitchPlayer;
var $lsPlayer;
var $playPauseButton;
var $playPauseImage;
var $volumeSlider;
var $volumeSliderImage;
var $muteButton;
var $viewerCount;
var $titleText;
var $titleTextSpan;
var $channelDropdown;

// This might change via cookies in the future
var currentPlayer = 'none';
var currentTwitchChannel = twitchMainChannel;

jQuery.fn.center = function () {
    this.width(Math.min(this.height() * (4 / 3), this.parent().width()) + "px");
    this.css('left',
        Math.max(0, (this.parent().width() - this.outerWidth()) / 2) + "px");
};


$(document).ready(function () {
    console.info('ready');
    console.info(document.domain);

    // All jQuery selectors
    $playPauseButton = $('#play-pause');
    $playPauseImage = $('#play-button-image');
    $volumeSlider = $("#volume-slider");
    $muteButton = $("#mute");
    $volumeSliderImage = $('#volume-button-image');
    $viewerCount = $('#viewer-count');
    $titleText = $('#title-text');
    $titleTextSpan = $titleText.children('span');
    $channelDropdown = $('#channel-dropdown');
    $twitchPlayer = $("#twitch-player");
    $lsPlayer = $("#livestream-player");

    // Add events
    $volumeSlider.slider({
        range: "min",
        value: defaultVolume,
        animate: 100,
        slide: volumeSlider
    });
    $muteButton.click(mute);
    $channelDropdown.change(function () {
        channelDropdown($channelDropdown[0].value)
    });

    // HTML starts with everything at display: none
    // Depending on settings, load appropriate player
    switchIfTwitchLive();

    $(window).resize(function () {
        $twitchPlayer.center();
        scrollIfTooLong();
    });
});

function loadTwitch() {
    console.info("loadTwitch");
    $lsPlayer.hide();
    $twitchPlayer.show();
    clearInterval(updateLivestreamTitleInterval);
    clearInterval(updateLivestreamViewerCountInterval);
    clearInterval(switchIfTwitchLiveInterval);
    checkTwitchLoadedInterval =
        setInterval(checkTwitchLoaded, checkTwitchLoadedFrequency);
    reloadTwitchOnForbiddenTimeout = setTimeout(reloadTwitch, 5000);
}

function checkTwitchLoaded() {
    console.log('twitch PercentLoaded: ' + $twitchPlayer[0].PercentLoaded());
    if ($twitchPlayer[0].PercentLoaded() == 100) {
        twitchInit();
        clearInterval(checkTwitchLoadedInterval);
        clearTimeout(reloadTwitchOnForbiddenTimeout);
    }
}

function reloadTwitch() {
    console.info("reloadTwitch");
    $twitchPlayer.hide();
    $twitchPlayer.show();
}

function twitchInit() {
    console.info("twitchInit");
    $twitchPlayer.center();
    play();
    $twitchPlayer[0].change_volume($volumeSlider.slider('value'));
    twitchUpdateCallInterval =
        setInterval(twitchUpdateCall, twitchUpdateCallFrequency);
}

function loadLivestream() {
    console.info("loadLivestream");
    $twitchPlayer.hide();
    $lsPlayer.show();
    clearInterval(twitchUpdateCallInterval);
    if (autoswitch) {
        switchIfTwitchLive();
        clearInterval(switchIfTwitchLiveInterval);
        switchIfTwitchLiveInterval =
            setInterval(switchIfTwitchLive, checkTwitchLiveFrequency);
    }
}

function turnAutoswitchOn() {
    autoswitch = true;
    if (currentPlayer == 'livestream') {
        switchIfTwitchLive();
        clearInterval(switchIfTwitchLiveInterval);
        switchIfTwitchLiveInterval =
            setInterval(switchIfTwitchLive, checkTwitchLiveFrequency);
    }
}

function turnAutoswitchOff() {
    autoswitch = false;
    if (currentPlayer == 'livestream') {
        clearInterval(switchIfTwitchLiveInterval);
    }
}

function twitchCallback(e, info) {
    console.info("twitchCallback: " + e);
    if (e == 'video_not_found' && autoswitch) {
        setTimeout(switchIfTwitchLive, 3000);
    }
    else if (e == 'stream_viewer_count') {
        updateViewerCount(info.stream.toString());
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
    $lsPlayer[0].setVolume($volumeSlider.slider('value') / 100);
    updateViewerCount($lsPlayer[0].getViewerCount());
    updateLivestreamViewerCountInterval = setInterval(function () {
        updateViewerCount($lsPlayer[0].getViewerCount())
    }, updateLivestreamViewerCountFrequency);
    updateLivestreamTitle();
    updateLivestreamTitleInterval =
        setInterval(updateLivestreamTitle, updateLivestreamTitleFrequency);

}

function livestreamCallback(e) {
    console.info("livestreamCallback: " + e);
    if (e == 'ready') {
        livestreamInit();
    } else if (e == 'connectionEvent') {
        setTimeout(updateLivestreamTitle, 1000);
    } else if (e == 'playbackEvent') {
        updateLivestreamTitle();
    }
}

function updateLivestreamTitle() {
    var text = $lsPlayer[0].getCurrentContentTitle();
    if (text != null) {
        $titleTextSpan.text(text);
    }
    console.log('updateLivestreamTitle: ' + text);

    // Need time to update the text
    setTimeout(scrollIfTooLong, 100);
}

function scrollIfTooLong() {
    if ($titleTextSpan.width() >= $titleTextSpan.parent().width()) {
        console.log('start scrolling');
        if (!scrollTextInterval) {
            scrollTextInterval = setInterval(scrollText, 50);
        }
    } else {
        clearInterval(scrollTextInterval);
        scrollTextInterval = false;
        $titleTextSpan.css({left: 0});
    }
}

function scrollText() {
    var width = $titleTextSpan.width();
    var left = $titleTextSpan.position().left - 1;
    left = -left > width ? width : left;
    $titleTextSpan.css({left: left});
}

function updateViewerCount(viewers) {
    console.log('updateViewerCount: ' + viewers);
    var postText;
    if (viewers == 1) {
        postText = "Bro"
    } else if (viewers <= 50) {
        postText = "Bros"
    } else if (viewers <= 100) {
        postText = "Bros!"
    } else {
        postText = "Bros!!"
    }
    var text = viewers + ' ' + postText;
    var width = text.length * 8;
    $viewerCount.width(width);
    $titleText.css({left: 190 + width});
    $viewerCount.text(text);
}

function changePlayer(player) {
    console.log("changePlayer: " + player);
    if (player != currentPlayer) {
        currentPlayer = player;
        clearInterval(checkTwitchLoadedInterval);
        switch (player) {
            case 'twitch':
                loadTwitch();
                clearInterval(updateLivestreamViewerCountInterval);
                break;
            case 'livestream':
                $twitchPlayer.hide();
                $lsPlayer.show();
                break;
        }
    } else {
        play();
    }
}

// While twitch is not on, check if any twitch channel goes live
function switchIfTwitchLive() {
    console.log("switchIfTwitchLive");
    $.getJSON('https://api.twitch.tv/kraken/streams/' + twitchMainChannel +
        '?callback=?', function (data) {
        if (data.stream) { // Channel is live
            console.log(twitchMainChannel + " is live, switching");
            currentTwitchChannel = twitchMainChannel;
            changePlayer('twitch');
        } else {
            $.getJSON('https://api.twitch.tv/kraken/streams/' +
                twitchSecondaryChannel + '?callback=?', function (data) {
                if (data.stream) { // Channel is live
                    console.log(twitchSecondaryChannel + " is live, switching");
                    currentTwitchChannel = twitchSecondaryChannel;
                    changePlayer('twitch');
                } else {
                    changePlayer('livestream');
                }
            });
        }
    });
}

// While twitch is on, update text, viewercount, and check live status
function twitchUpdateCall() {
    console.log('twitchUpdateCall for channel ' + currentTwitchChannel);
    $.getJSON('https://api.twitch.tv/kraken/streams/' + currentTwitchChannel +
        '?callback=?', function (data) {
        if (data.stream) {
            // Twitch is live, update text and viewercount
            $titleTextSpan.text(data.stream.channel.status);
            setTimeout(scrollIfTooLong, 100);
            updateViewerCount(data.stream.viewers);
        }
        else {
            // Twitch went offline, check if other channel is live, and switch
            console.log(twitchMainChannel + " is offline");
            var otherChannel = currentTwitchChannel == twitchMainChannel ?
                twitchSecondaryChannel : twitchMainChannel;
            $.getJSON('https://api.twitch.tv/kraken/streams/' + otherChannel +
                '?callback=?', function (data) {
                if (data.stream) {
                    console.log(otherChannel + " is live, switching");
                    currentTwitchChannel = otherChannel;
                    twitchUpdateCall();
                } else {
                    console.log("no twitch channel is live," +
                        " switching to livestream");
                    changePlayer('livestream');
                }
            });
        }
    });
}


function play() {
    console.log('play');
    paused = false;
    if (currentPlayer == 'twitch') {
        $twitchPlayer[0].play_live(currentTwitchChannel, twitchQuality)
    } else {
        $lsPlayer[0].startPlayback();
    }
    changeVolume($volumeSlider.slider('value'));
    $playPauseImage.attr('src', 'images/pause.png');
    $playPauseButton.off('click').on('click', pause);
}

function pause() {
    console.log('pause');
    paused = true;
    if (currentPlayer == 'twitch') {
        $twitchPlayer[0].pause_video()
    } else {
        $lsPlayer[0].stopPlayback()
    }
    $playPauseImage.attr('src', 'images/play.png');
    $playPauseButton.off('click').on('click', play);
}

function volumeSlider(event, ui) {
    rememberedVolume = ui.value;
    changeVolume(ui.value);
}

function changeVolume(volume) {
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

function mute() {
    console.log('mute');
    var volume;
    if ($volumeSlider.slider('value') == 0) {
        if (rememberedVolume == 0) {
            rememberedVolume = defaultVolume;
        }
        volume = rememberedVolume;
    } else {
        volume = 0
    }
    changeVolume(volume);
    $volumeSlider.slider('value', volume);
}

function channelDropdown(choice) {
    console.log("channelDropdown: " + choice);
    switch (choice) {
        case 'auto':
            turnAutoswitchOn();
            break;
        case 'twitch1':
            if (currentTwitchChannel != twitchMainChannel ||
                currentPlayer != 'twitch') {
                turnAutoswitchOff();
                currentTwitchChannel = twitchMainChannel;
                if (currentPlayer == 'twitch') {
                    play();
                    twitchUpdateCall();
                } else {
                    changePlayer('twitch');
                }
            }
            break;
        case 'twitch2':
            if (currentTwitchChannel != twitchSecondaryChannel ||
                currentPlayer != 'twitch') {
                turnAutoswitchOff();
                currentTwitchChannel = twitchSecondaryChannel;
                if (currentPlayer == 'twitch') {
                    play();
                    twitchUpdateCall();
                } else {
                    changePlayer('twitch');
                }
            }
            break;
        case 'livestream':
            turnAutoswitchOff();
            changePlayer('livestream');
            break;
    }
}