var $mainContainer;
var $player;
var $chat;

var ratio = 16 / 9;

var PLAYER_BAR_SIZE = 30;

$(document).ready(function () {
    $mainContainer = $('#main-container');
    $player = $('#player');
    $chat =

    resizePlayer();
    var debouncedPlayerResize = _.debounce(resizePlayer, 50);
    $(window).resize(debouncedPlayerResize);
});

function resizePlayer() {
    console.log('resizePlayer');
    var newHeight = $player.width() * (1/ratio) + PLAYER_BAR_SIZE;
    console.log(newHeight + "=" + $player.width() +"*"+ (1/ratio) +"+"+ PLAYER_BAR_SIZE);
    $mainContainer.height(newHeight);
}

function set169Mode(ratio169) {
    if (ratio169) {
        ratio = 16 / 9;
        $player.width("69%");
        $chat.width("29%");
    } else {
        ratio = 4 / 3;
        $player.width("59%");
        $chat.width("39%");
    }
    resizePlayer();
}