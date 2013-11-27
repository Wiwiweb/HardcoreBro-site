var $mainContainer;
var $player;
var $chat;
var $ratioChangeButton;

var isRatio169 = true;
var playerWidthPercent = .69;
var chatWidthPercent = .29;
var ratio = 16 / 9;

var PLAYER_BAR_SIZE = 30;
var TWITCH_CHAT_MIN_WIDTH = 300;
var PLAYER_CHAT_SPACER = 15;

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
    var debouncedPlayerResize = _.debounce(resizePlayer, 50);
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
    console.debug("resizePlayer: mainWidth:", mainWidth);
    console.debug("resizePlayer: playerWidthPercent:", playerWidthPercent);
    var newPlayerWidth =
        Math.min(mainWidth * playerWidthPercent - PLAYER_CHAT_SPACER,
                 mainWidth - TWITCH_CHAT_MIN_WIDTH - PLAYER_CHAT_SPACER);
    console.debug("resizePlayer: newPlayerWidth:", newPlayerWidth);
    var newChatWidth =
        Math.max(mainWidth * chatWidthPercent,
                 TWITCH_CHAT_MIN_WIDTH);
    console.debug("resizePlayer: newChatWidth:", newChatWidth);
    $player.width(newPlayerWidth);
    $chat.width(newChatWidth);
    var newHeight = newPlayerWidth * (1 / ratio) + PLAYER_BAR_SIZE;
    $mainContainer.height(newHeight);
    console.debug("resizePlayer: newHeight:", newHeight);
//    console.debug(newPlayerWidth + " = " + $mainContainer.width() + " * " + playerWidthPercent);
//    console.debug(newHeight + " = " + newPlayerWidth + " * " + (1 / ratio) + " + " + PLAYER_BAR_SIZE);
}

function switchRatio() {
    set169Mode(!isRatio169);
}

function set169Mode(ratio169) {
    console.log('set169Mode');
    if (ratio169) {
        ratio = 16 / 9;
        playerWidthPercent = .69;
        chatWidthPercent = .29;
        $ratioChangeButton.text("Change to 4:3 mode");
    } else {
        ratio = 4 / 3;
        playerWidthPercent = .59;
        chatWidthPercent = .39;
        $ratioChangeButton.text("Change to 16:9 mode");
    }
    player.twitchSet169Mode(ratio169);
    isRatio169 = ratio169;
    resizePlayer();
}