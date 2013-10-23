var twitchMainChannel = 'TGN';
var twitchSecondaryChannel = 'MANvsGAME';
var twitchQuality = 'live';
var livestreamChannel = 'hardcore_bro';
var defaultVolume = 50;
var autoswitch = true;
var paused = false;
var previousTitle = '';

var checkTwitchLoadedFrequency = 50;
var updateLivestreamTitleFrequency = 1000;
var updateLivestreamViewerCountFrequency = 5000;
var checkTwitchLiveFrequency = 5000;
var twitchUpdateCallFrequency = 5000;

var rememberedVolume;

var checkTwitchLoadedInterval;
var reloadTwitchOnForbiddenTimeout;
var customTwitchTypeTimeout;

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
var $rightSide;
var $channelDropdown;
var $customTwitchTextbox;

// This might change via cookies in the future
var currentPlayer = 'none';
var currentTwitchChannel = twitchMainChannel;

jQuery.fn.center = function () {
    this.width(Math.min(this.height() * (4 / 3), this.parent().width()) + "px");
    this.css('left',
        Math.max(0, (this.parent().width() - this.outerWidth()) / 2) + "px");
};


$(document).ready(function () {

    // All jQuery selectors
    $playPauseButton = $('#play-pause');
    $playPauseImage = $('#play-button-image');
    $volumeSlider = $("#volume-slider");
    $muteButton = $("#mute");
    $volumeSliderImage = $('#volume-button-image');
    $viewerCount = $('#viewer-count');
    $titleText = $('#title-text');
    $titleTextSpan = $titleText.children('span');
    $rightSide = $('#right-side');
    $channelDropdown = $('#channel-dropdown');
    $customTwitchTextbox = $('#custom-twitch-textbox');
    $twitchPlayer = $("#twitch-player");
    $lsPlayer = $("#livestream-player");


    //Cookies we use
    //hcb_remembered_volume: 0-100 - 0 is none
    //hcb_mute: true/false
    //hcb_channel_dropdown: remember choice
    //hcb_custom_twitch: remember text in custom box
    var cookieVolume = $.cookie('hcb_remembered_volume');
    console.info('Cookie hcb_remembered_volume: ' + cookieVolume);
    if(typeof cookieVolume === 'undefined') {
        cookieVolume = defaultVolume;
    }
    rememberedVolume = cookieVolume;
    var initialVolume = rememberedVolume;
    var cookieMute = $.cookie('hcb_mute');
    console.info('Cookie hcb_mute: ' + cookieMute);
    if(cookieMute == 'true') {
        initialVolume = 0;
    }

    // Add events
    $volumeSlider.slider({
        range: 'min',
        value: initialVolume,
        animate: 100,
        slide: volumeSlider
    });
    changeVolumeImage(initialVolume);
    $muteButton.click(mute);
    $channelDropdown.change(function () {
        channelDropdown($channelDropdown.val())
    });
    $customTwitchTextbox.on('input', customTwitchType);

    // HTML starts with everything at display: none
    // Depending on settings, load appropriate player
    switchIfTwitchLive();

    $(window).resize(function () {
        $twitchPlayer.center();
        scrollIfTooLong();
    });
});

function loadTwitch() {
    console.debug('loadTwitch');
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
    console.debug('twitch PercentLoaded: ' + $twitchPlayer[0].PercentLoaded());
    if ($twitchPlayer[0].PercentLoaded() == 100) {
        twitchInit();
        clearInterval(checkTwitchLoadedInterval);
        clearTimeout(reloadTwitchOnForbiddenTimeout);
    }
}

function reloadTwitch() {
    console.debug('reloadTwitch');
    $twitchPlayer.hide();
    $twitchPlayer.show();
}

function twitchInit() {
    console.debug('twitchInit');
    $twitchPlayer.center();
    play();
    $twitchPlayer[0].change_volume($volumeSlider.slider('value'));
    twitchUpdateCallInterval =
        setInterval(twitchUpdateCall, twitchUpdateCallFrequency);
}

function loadLivestream() {
    console.debug('loadLivestream');
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
    console.debug('turnAutoswitchOn');
    autoswitch = true;
    if (currentPlayer == 'livestream') {
        switchIfTwitchLive();
        clearInterval(switchIfTwitchLiveInterval);
        switchIfTwitchLiveInterval =
            setInterval(switchIfTwitchLive, checkTwitchLiveFrequency);
    }
}

function turnAutoswitchOff() {
    console.debug('turnAutoswitchOff');
    autoswitch = false;
    clearInterval(switchIfTwitchLiveInterval);
}

function twitchCallback(e, info) {
    console.debug('twitchCallback: ' + e);
    if (e == 'video_not_found' && autoswitch) {
        setTimeout(switchIfTwitchLive, 3000);
    }
    else if (e == 'stream_viewer_count') {
        updateViewerCount(info.stream.toString());
    }
}

function livestreamInit() {
    console.debug('livestreamInit');
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
    console.debug('livestreamCallback: ' + e);
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
    if (text != null && text != previousTitle) {
        console.info("Update Livestream title: " + text);
        previousTitle = text;
        text = '<a href="http://www.google.com/search?q='
            + encodeURIComponent(text) + '&btnI">'
            + text +
            '</a>';
        $titleTextSpan.html(text);
    }

    // Need time to update the text
    setTimeout(scrollIfTooLong, 100);
}

function scrollIfTooLong() {
    if ($titleTextSpan.width() >= $titleTextSpan.parent().width()) {
        console.debug('start scrolling');
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
    console.debug('updateViewerCount: ' + viewers);
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

function twitchChangeChannel() {
    console.debug("twitchChangeChannel: " + currentTwitchChannel);
    changePlayer('twitch');
    twitchUpdateCall();
}

function changePlayer(player) {
    console.debug("changePlayer: " + player);
    if (player != currentPlayer) {
        currentPlayer = player;
        clearInterval(checkTwitchLoadedInterval);
        switch (player) {
            case 'twitch':
                loadTwitch();
                break;
            case 'livestream':
                loadLivestream();
                break;
        }
    } else {
        play();
    }
}

// While twitch is not on, check if any twitch channel goes live
function switchIfTwitchLive() {
    console.debug('switchIfTwitchLive');
    $.getJSON('https://api.twitch.tv/kraken/streams/' + twitchMainChannel +
        '?callback=?', function (data) {
        if (data.stream) { // Channel is live
            console.info(twitchMainChannel + " is live, switching");
            currentTwitchChannel = twitchMainChannel;
            twitchChangeChannel();
        } else {
            $.getJSON('https://api.twitch.tv/kraken/streams/' +
                twitchSecondaryChannel + '?callback=?', function (data) {
                if (data.stream) { // Channel is live
                    console.info(twitchSecondaryChannel + " is live, switching");
                    currentTwitchChannel = twitchSecondaryChannel;
                    twitchChangeChannel();
                } else {
                    changePlayer('livestream');
                }
            });
        }
    });
}

// While twitch is on, update text, viewercount, and check live status
function twitchUpdateCall() {
    console.debug('twitchUpdateCall for channel ' + currentTwitchChannel);
    $.getJSON('https://api.twitch.tv/kraken/streams/' + currentTwitchChannel +
        '?callback=?', function (data) {
        var text;
        if (data.stream) {
            // Twitch is live, update text and viewercount
            text = data.stream.channel.status;
            updateViewerCount(data.stream.viewers);
        }
        else {
            // Twitch went offline, check if other channel is live, and switch
            console.info(currentTwitchChannel + " is offline");
            text = "Channel offline.";
            if (autoswitch) {
                var otherChannel = currentTwitchChannel == twitchMainChannel ?
                    twitchSecondaryChannel : twitchMainChannel;
                $.getJSON('https://api.twitch.tv/kraken/streams/' + otherChannel +
                    '?callback=?', function (data) {
                    if (data.stream) {
                        console.info(otherChannel + " is live, switching");
                        twitchChangeChannel();
                    } else {
                        console.info("No twitch channel is live," +
                            " switching to livestream");
                        changePlayer('livestream');
                    }
                });
            }
        }
        if (previousTitle != text) {
            console.info("Update Twitch title: " + text);
            previousTitle = text;
            $titleTextSpan.text(text);
            setTimeout(scrollIfTooLong, 100);
        }
    });
}


function play() {
    console.debug('play');
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
    console.debug('pause');
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
    $.cookie('hcb_remembered_volume', rememberedVolume);
    changeVolume(rememberedVolume);
}

function changeVolume(volume) {
    console.debug('changeVolume: ' + volume);
    if (currentPlayer == 'twitch') {
        $twitchPlayer[0].change_volume(volume)
    } else {
        $lsPlayer[0].setVolume(volume / 100)
    }
    changeVolumeImage(volume);
}

function changeVolumeImage(volume) {
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
    console.debug('mute');
    var volume;
    if ($volumeSlider.slider('value') == 0) {
        if (rememberedVolume == 0) {
            rememberedVolume = defaultVolume;
        }
        volume = rememberedVolume;
        $.cookie('hcb_mute', 'false');
    } else {
        volume = 0
        $.cookie('hcb_mute', 'true');
    }
    changeVolume(volume);
    $volumeSlider.slider('value', volume);
}

function channelDropdown(choice) {
    console.debug('channelDropdown: ' + choice);
    if (choice == 'auto') {
        turnAutoswitchOn();
    } else {
        turnAutoswitchOff();
        switch (choice) {
            case 'twitch1':
                if (currentTwitchChannel != twitchMainChannel ||
                    currentPlayer != 'twitch') {
                    currentTwitchChannel = twitchMainChannel;
                    twitchChangeChannel();
                }
                break;
            case 'twitch2':
                if (currentTwitchChannel != twitchSecondaryChannel ||
                    currentPlayer != 'twitch') {
                    currentTwitchChannel = twitchSecondaryChannel;
                    twitchChangeChannel();
                }
                break;
            case 'twitch-custom':
                if (currentTwitchChannel != $customTwitchTextbox.val() ||
                    currentPlayer != 'twitch') {
                    customTwitchPlayIfReal();
                }
                break;
            case 'livestream':
                changePlayer('livestream');
                break;
        }
    }
    toggleCustomTwitchTextbox();
}

function toggleCustomTwitchTextbox() {
    console.debug('toggleCustomTwitchTextbox');
    if ($channelDropdown.val() == 'twitch-custom') {
        // Turn on
        $rightSide.width(360);
        $titleText.css({right: 360});
        scrollIfTooLong();
        $customTwitchTextbox.show();
    } else {
        // Turn off
        $rightSide.width(180);
        $titleText.css({right: 180});
        scrollIfTooLong();
        $customTwitchTextbox.hide();
    }
}

function customTwitchType() {
    console.debug('customTwitchType: ' + $customTwitchTextbox.val());
    clearTimeout(customTwitchTypeTimeout);
    customTwitchTypeTimeout = setTimeout(customTwitchPlayIfReal, 500);
}

function customTwitchPlayIfReal() {
    console.debug('customTwitchPlayIfReal: ' + $customTwitchTextbox.val());
    $.getJSON('https://api.twitch.tv/kraken/channels/' +
        $customTwitchTextbox.val() + '?callback=?', function (data) {
        if (data.status != 404) {
            console.info($customTwitchTextbox.val() + " exists, switching");
            currentTwitchChannel = $customTwitchTextbox.val();
            twitchChangeChannel();
        } else {
            console.info($customTwitchTextbox.val() + " doesn't exist");
        }
    });
}