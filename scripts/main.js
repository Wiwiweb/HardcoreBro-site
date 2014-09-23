var $mainContainer;
var $player;
var $chat;
var $ratioChangeButton;

var isRatio169 = true;
var ratio = 16 / 9;

var PLAYER_BAR_SIZE = 30;

$(document).ready(function () {
    $mainContainer = $('#main-container');
    $player = $('#player');
    $chat = $('#chat');
    $ratioChangeButton = $('#ratio-change');

    $ratioChangeButton.click(switchRatio);

    if (Math.random() <= 0.05) {
        $('#normal-banner').hide();
        $('#blingee-banner').show();
    }

    var queryString = window.location.search;
    if (queryString != '') {
        $player.attr('src', 'stream.html' + queryString);
    }

    resizePlayer();
    $(window).resize(resizePlayer);
});

$(window).load(function () {
    player.$channelDropdown.change(function () {
        switch (player.$channelDropdown.val()) {
            case 'twitch1':
            case 'twitch2':
            case 'twitch-custom':
                set169Mode(true);
                break;
            case 'livestream':
                set169Mode(false);
                break;
        }
    });
});

function resizePlayer() {
    console.log('resizePlayer');
    var mainWidth = $mainContainer.width();
    var mainHeight = $mainContainer.height();
    var playerHeight = mainHeight - PLAYER_BAR_SIZE;
    var newPlayerWidth = playerHeight * ratio;
    var newChatWidth = mainWidth - newPlayerWidth - 10;
    console.debug("resizePlayer: newPlayerWidth:", newPlayerWidth);
    console.debug("resizePlayer: newChatWidth:", newChatWidth);
    $player.width(newPlayerWidth);
    $chat.width(newChatWidth);
}

function switchRatio() {
    set169Mode(!isRatio169);
}

function set169Mode(ratio169) {
    console.log('set169Mode');
    if (ratio169) {
        ratio = 16 / 9;
        $ratioChangeButton.text("Change to 4:3 mode");
    } else {
        ratio = 4 / 3;
        $ratioChangeButton.text("Change to 16:9 mode");
    }
    isRatio169 = ratio169;
    resizePlayer();
}

function popoutStream() {
    window.open("stream.html", "HCB Stream", "height=600, width=1066");
}

function popoutChat() {
    window.open("http://www.twitch.tv/chat/embed?channel=hardcore_bro&popout_chat=true", "HCB Chat", "height=800, width=400");
}

function brokenSteamEmoticon(image) {
    $(image).removeAttr('onerror');
    var src = $(image).attr('src');
    var split = src.split('/');
    var text = ':' + split[split.length -1] + ':';
    $(image).after(text);
    $(image).hide();
}