var $mainContainer;
var $player;

$(document).ready(function () {
    $mainContainer = $('#main-container');
    $player = $('#player');

    resizePlayer();
    $(window).resize(resizePlayer);
});

function resizePlayer() {
    console.log('resizePlayer');
    var newHeight = $player.width() * (9/16);
    $mainContainer.height(newHeight);
}