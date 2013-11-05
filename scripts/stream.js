var twitchMainChannel = 'hardcore_bro';
var twitchSecondaryChannel = 'darianHCB';
var twitchQuality = 'live';
var livestreamChannel = 'hardcore_bro';
var defaultVolume = 50;

var checkTwitchLoadedFrequency = 50;
var updateLivestreamTitleFrequency = 1000;
var updateLivestreamViewerCountFrequency = 5000;
var checkTwitchLiveFrequency = 5000;
var twitchUpdateCallFrequency = 5000;

var rememberedVolume;
var previousTitle = '';
var currentPlayer;
var currentTwitchChannel;
var autoswitch = true;
var paused = false;
var twitch169Mode = true;

var checkTwitchLoadedInterval;
var reloadTwitchOnForbiddenTimeout;
var customTwitchTypeTimeout;
var updateLivestreamTitleInterval;
var updateLivestreamViewerCountInterval;
var switchIfTwitchLiveInterval;
var twitchUpdateCallInterval;
var scrollTextInterval = false;

var $videoContainer;
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

jQuery.fn.center = function () {
    var newWidth = this.parent().height() * (1 + (twitch169Mode * .34)) * (4 / 3);
    this.width(newWidth + "px");
    this.css('left', ((this.parent().width() - newWidth) / 2) + "px");
};

jQuery.fn.resize169 = function () {
    var newHeight = this.parent().height() * 1.34;
    this.css('top', ((this.parent().height() - newHeight) / 2) + "px");
};

jQuery.fn.hideLivestreamWatermark = function () {
    var newWidth = this.parent().width() + 300;
    this.width(newWidth + "px");
};


$(document).ready(function () {

    // All jQuery selectors
    $videoContainer = $('#video-container');
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

    // jQuery resizing
    $twitchPlayer.center();
    $lsPlayer.hideLivestreamWatermark();


    // Cookies we use
    // hcb_remembered_volume: 0-100 - 0 is none
    // hcb_mute: true/false
    // hcb_custom_twitch: remember text in custom box
    // hcb_channel_dropdown: remember choice

    var cookieVolume = $.cookie('hcb_remembered_volume');
    console.info('Cookie hcb_remembered_volume: ' + cookieVolume);
    if (typeof cookieVolume === 'undefined' || cookieVolume === null) {
        cookieVolume = defaultVolume;
    }
    rememberedVolume = cookieVolume;
    var initialVolume = rememberedVolume;
    var cookieMute = $.cookie('hcb_mute');
    console.info('Cookie hcb_mute: ' + cookieMute);
    if (cookieMute == 'true') {
        initialVolume = 0;
    }
    var cookieCustomTwitch = $.cookie('hcb_custom_twitch');
    console.info('Cookie hcb_custom_twitch: ' + cookieCustomTwitch);
    if (typeof cookieCustomTwitch !== 'undefined' && cookieCustomTwitch !== null) {
        $customTwitchTextbox.val(cookieCustomTwitch);
    }

    // If we have any URL parameter, use it
    // Otherwise, use cookies
    var urlParams = getUrlParameters();
    console.log('urlParams: ', urlParams);
    if ('main' in urlParams) {
        $channelDropdown.val('twitch1');
        channelDropdown('twitch1');
    } else if ('movie' in urlParams) {
        $channelDropdown.val('twitch2');
        channelDropdown('twitch2');
    } else if ('custom' in urlParams) {
        $channelDropdown.val('twitch-custom');
        channelDropdown('twitch-custom');
        if(urlParams['custom'].length > 0) {
            $customTwitchTextbox.val(urlParams['custom']);
        }
    } else if ('autoplay' in urlParams) {
        $channelDropdown.val('livestream');
        channelDropdown('livestream');
    } else {
        var cookieDropdown = $.cookie('hcb_channel_dropdown');
        console.info('Cookie hcb_channel_dropdown: ' + cookieDropdown);
        if (typeof cookieDropdown !== 'undefined' && cookieDropdown !== null) {
            $channelDropdown.val(cookieDropdown);
            channelDropdown(cookieDropdown);
        }
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
    if (autoswitch == true) {
        switchIfTwitchLive();
    }

    windowResize();
    var debouncedWindowResize = _.debounce(windowResize, 50);
    $(window).resize(debouncedWindowResize);

});

function windowResize() {
    console.debug('windowResize');
    if (twitch169Mode) {
        $twitchPlayer.resize169();
    }
    $twitchPlayer.center();
    $lsPlayer.hideLivestreamWatermark();
    scrollIfTooLong();
}

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
    play();
    $twitchPlayer[0].change_volume($volumeSlider.slider('value'));
    twitchUpdateCall();
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
        text = '<a href="http://www.google.com/webhp#q='
            + encodeURIComponent('site:youtube.com "' + text + '"') + '&btnI">'
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
    if (viewers == -1) {
        viewers = '-';
        postText = "Bros"
    } else if (viewers == 1) {
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
    if (currentPlayer == 'twitch') {
        twitchUpdateCall();
        // Need to pause play because of a justin tv bug
        // while switching from live to non-live
        pause();
        play();
    } else {
        changePlayer('twitch');
    }
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
            } else {
                updateViewerCount(-1);
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
    $.cookie('hcb_channel_dropdown', choice);
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
    var customTwitch = $customTwitchTextbox.val();
    console.debug('customTwitchPlayIfReal: ' + customTwitch);
    $.getJSON('https://api.twitch.tv/kraken/channels/' +
        customTwitch + '?callback=?', function (data) {
        if (data.status != 404) {
            console.info(customTwitch + " exists, switching");
            currentTwitchChannel = customTwitch;
            twitchChangeChannel();
            $.cookie('hcb_custom_twitch', customTwitch, {expires: 7});
        } else {
            console.info(customTwitch + " doesn't exist");
        }
    });
}

function twitchSet169Mode(ratio169) {
    console.debug('twitchSet169Mode: ' + ratio169);
    $twitchPlayer.css('-webkit-transition', '.2s');
    $twitchPlayer.css('transition', '.2s');
    setTimeout(function () {
        $twitchPlayer.css('-webkit-transition', '0');
        $twitchPlayer.css('transition', '0');
    }, 200);
    if (ratio169) {
        twitch169Mode = true;
        $twitchPlayer.height('134%');
        $twitchPlayer.resize169();
    }
    else {
        twitch169Mode = false;
        $twitchPlayer.height('100%');
        $twitchPlayer.css('top', 0);
    }
    $twitchPlayer.center();
}