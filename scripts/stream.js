var twitchMainChannel = 'TGN';
var twitchSecondaryChannel = 'MANvsGAME';
var twitchQuality = 'live';
var livestreamChannel = 'hardcore_bro';
var defaultVolume = 50;
var autoswitch = true;
var paused = false;
var checkTwitchLoadedFrequency = 50;
var checkTwitchLiveFrequency = 10000;
var updateTitleFrequency = 10000;
var autoUpdateViewerCountFrequency = 5000;

var rememberedVolume = 50;

var checkTwitchLoadedInterval;
var switchIfTwitchLiveInterval;
var autoUpdateViewerCountInterval;
var scrollTextInterval = false;
var reloadTwitchOnForbiddenTimeout;

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
    $muteButton = $("#mute");
    $volumeSliderImage = $('#volume-button-image');
    $viewerCount = $('#viewer-count');
    $titleText = $('#title-text');
    $titleTextSpan = $titleText.children('span');
    $channelDropdown = $('#channel-dropdown');

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

    $twitchPlayer = $("#twitch-player");
    console.log($twitchPlayer);
    if (currentPlayer == 'twitch') {
        checkTwitchLoadedInterval = setInterval(checkTwitchLoaded,
            checkTwitchLoadedFrequency);
        reloadTwitchOnForbiddenTimeout = setTimeout(reloadTwitch, 5000);
    }

    $lsPlayer = $("#livestream-player");
    console.log($lsPlayer);

    setInterval(updateTitle, updateTitleFrequency);

    if (autoswitch) {
        switchIfTwitchLive();
        switchIfTwitchLiveInterval = setInterval(switchIfTwitchLive,
            checkTwitchLiveFrequency);
    }

    $(window).resize(function () {
        $twitchPlayer.center();
        scrollIfTooLong();
    });
});


function checkTwitchLoaded() {
    console.log('twitch PercentLoaded: ' + $twitchPlayer[0].PercentLoaded());
    if ($twitchPlayer[0].PercentLoaded() == 100) {
        twitchInit();
        clearInterval(checkTwitchLoadedInterval);
        clearTimeout(reloadTwitchOnForbiddenTimeout);
    }
}

function reloadTwitch() {
    $twitchPlayer.hide();
    $twitchPlayer.show();
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
    if (e == 'video_not_found') {
        setTimeout(switchIfTwitchLive, 3000);
    }
    if (e == 'broadcast_finished' || e == 'stream_lost' && !paused) {
        if (autoswitch == true) {
            changePlayer('livestream');
            switchIfTwitchLiveInterval =
                setInterval(switchIfTwitchLive, checkTwitchLiveFrequency);
        }
    }
    if (e == 'stream_viewer_count') {
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
    updateTitle();
    $lsPlayer[0].setVolume(defaultVolume / 100);
    updateViewerCount($lsPlayer[0].getViewerCount());
    autoUpdateViewerCountInterval = setInterval(function () {
        updateViewerCount($lsPlayer[0].getViewerCount())
    }, autoUpdateViewerCountFrequency);
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
            $titleTextSpan.text(text);
        });
    } else {
        var text = $lsPlayer[0].getCurrentContentTitle();
        if (text != null) {
            $titleTextSpan.text(text);
        }
        console.log('updateTitle: ' + text);
    }

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
    var width = text.length *7;
    $viewerCount.width(width);
    $titleText.css({left: 190 + width});
    $viewerCount.text(text);
}

function channelDropdown(choice) {
    console.log("channelDropdown: " + choice);
    switch (choice) {
        case 'auto':
            autoswitch = true;
            if (currentPlayer == 'livestream') {
                switchIfTwitchLiveInterval =
                    setInterval(switchIfTwitchLive, checkTwitchLiveFrequency);
            }
            break;
        case 'twitch1':
            if (currentTwitchChannel != twitchMainChannel ||
                currentPlayer != 'twitch') {
                currentTwitchChannel = twitchMainChannel;
                autoswitch = false;
                clearInterval(switchIfTwitchLiveInterval);
                if (currentPlayer == 'twitch') {
                    play();
                    updateTitle();
                } else {
                    changePlayer('twitch')
                }
            }
            break;
        case 'twitch2':
            if (currentTwitchChannel != twitchSecondaryChannel ||
                currentPlayer != 'twitch') {
                currentTwitchChannel = twitchSecondaryChannel;
                autoswitch = false;
                clearInterval(switchIfTwitchLiveInterval);
                if (currentPlayer == 'twitch') {
                    play();
                    updateTitle();
                } else {
                    changePlayer('twitch')
                }
            }
            break;
        case 'livestream':
            autoswitch = false;
            clearInterval(switchIfTwitchLiveInterval);
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
                reloadTwitchOnForbiddenTimeout = setTimeout(reloadTwitch, 5000);
                clearInterval(autoUpdateViewerCountInterval);
                break;
            case 'livestream':
                $twitchPlayer.hide();
                $lsPlayer.show();
                break;
        }
    }
}

function switchIfTwitchLive() {
    console.log("switchIfTwitchLive");
    $.getJSON('https://api.twitch.tv/kraken/streams/' + twitchMainChannel +
        '?callback=?', function (data) {
        if (data.stream) { // Channel is live
            console.log(twitchMainChannel + " is live, switching");
            currentTwitchChannel = twitchMainChannel;
            changePlayer('twitch');
            clearInterval(switchIfTwitchLiveInterval);
        } else {
            $.getJSON('https://api.twitch.tv/kraken/streams/' + twitchSecondaryChannel +
                '?callback=?', function (data) {
                if (data.stream) { // Channel is live
                    console.log(twitchSecondaryChannel + " is live, switching");
                    currentTwitchChannel = twitchSecondaryChannel;
                    changePlayer('twitch');
                    clearInterval(switchIfTwitchLiveInterval);
                } else {
                    changePlayer('livestream');
                }
            });
        }
    });
    console.log("end of switchIfTwitchLive");
}