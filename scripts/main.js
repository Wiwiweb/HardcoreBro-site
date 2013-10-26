var $mainContainer;
var $player;
var $chat;
var $ratioChangeButton;

var isRatio169 = true;
var playerWidthPercent = .69;
var ratio = 16 / 9;

var PLAYER_BAR_SIZE = 30;

$(document).ready(function () {
    $mainContainer = $('#main-container');
    $player = $('#player');
    $chat = $('#chat');
    $ratioChangeButton = $('#ratio-change');

    $ratioChangeButton.click(switchRatio);

    if(Math.random() <= 0.05) {
        $('#normal-banner').hide();
        $('#blingee-banner').show();
    }

    resizePlayer();
    var debouncedPlayerResize = _.debounce(resizePlayer, 50);
    $(window).resize(debouncedPlayerResize);
});

$(window).load(function() {
    player.$channelDropdown.change(function() {
        console.debug("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
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
    var newPlayerWidth = $mainContainer.width() * playerWidthPercent;
    console.debug(newPlayerWidth + " = " + $mainContainer.width() + " * " + playerWidthPercent);
    var newHeight = newPlayerWidth * (1 / ratio) + PLAYER_BAR_SIZE;
    console.debug(newHeight + " = " + newPlayerWidth + " * " + (1 / ratio) + " + " + PLAYER_BAR_SIZE);
    $mainContainer.height(newHeight);
}

function switchRatio() {
    set169Mode(!isRatio169);
}

function set169Mode(ratio169) {
    console.log('set169Mode');
    if (ratio169) {
        ratio = 16 / 9;
        playerWidthPercent = .69;
        $player.width("69%");
        $chat.width("29%");
        $ratioChangeButton.text("Change to 4:3 mode");
    } else {
        ratio = 4 / 3;
        playerWidthPercent = .59;
        $player.width("59%");
        $chat.width("39%");
        $ratioChangeButton.text("Change to 16:9 mode");
    }
    player.twitchSet169Mode(ratio169);
    isRatio169 = ratio169;
    resizePlayer();
}