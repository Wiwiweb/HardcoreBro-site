<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<?php

$mysqli = mysqli_connect() or die("Connect failed: " . mysqli_connect_error());
$mysqli->select_db('hardcore_bro');

?>

<html>

<head>
    <title>Hardcore Bro - No casuals allowed!</title>
    <meta name="description"
          content="Streaming video games with a funny accent.">
    <meta name="keywords"
          content="video game live stream streaming feed hardcore bro">
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="css/main.css"/>
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <script type="text/javascript"
            src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript"
            src="//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.3.1/jquery.cookie.min.js"></script>
    <script type="text/javascript"
            src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js"></script>
    <script type="text/javascript"
            src="//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="scripts/main.js"></script>
    <script type="text/javascript" src="scripts/url-parameters.js"></script>
</head>

<body>
<div class="logo">
    <img id="normal-banner" src="images/banner_new.jpg" alt="Hardcore Bro"/>
    <table id="blingee-banner" cellspacing="0" cellpadding="0"
           style="display: none;">
        <tr>
            <td><img src="images/blingee1.gif"/></td>
            <td><img src="images/blingee2.gif" alt="Hardcore Bro"/></td>
            <td><img src="images/blingee3.gif"/></td>
        </tr>
    </table>
</div>

<div id="main-container">
    <iframe id="player" frameborder="0" src="stream.html"></iframe>
    <iframe id="chat" scrolling="no" frameborder="0"
            src="http://twitch.tv/chat/embed?channel=hardcore_bro&popout_chat=true"></iframe>
</div>
<div id="options">
    <b id="ratio-change">Change to 4:3 mode</b> |
    <b><a href="javascript:popoutStream()">Popout stream</a></b> |
    <b><a href="javascript:popoutChat()">Popout chat</a></b>
</div>

<div class="bottom">
    <div class="buttons col-md-4 vertical-align text-center">
        <a href="http://steamcommunity.com/groups/vohcb"><img alt="Steam Group" src="images/steam.jpg"/></a>
        <a href="../board"><img alt="Imageboard" src="images/imageboard.jpg"/></a>
    </div><!--
 --><div class="col-md-8 vertical-align">
        <strong><a href="http://steamcommunity.com/groups/vohcb#comments">Steam comments:</a></strong>

        <div id="steam-comments">
            <?
            $query = "SELECT * FROM steam_comments ORDER BY date DESC LIMIT 3";
            $result = $mysqli->query($query) or die($mysqli->error . __LINE__);
            for ($rowNo = 0; $rowNo < $result->num_rows; $rowNo++) {
                $result->data_seek($rowNo);
                $row = $result->fetch_assoc();
                createSteamComment($row);
                if ($rowNo < $result->num_rows - 1) {
                    printf('<hr>');
                }
            }
            ?>
        </div>
    </div>
</div>
</body>

</html>


<?php

function createSteamComment($row)
{
    $author = strip_tags($row['author']);
    $avatar = $row['avatar'];

    $date = strtotime($row['date']);
    $date = date('j M @ G:i', $date);
    #8 Jun @ 6:52

    $text = strip_tags($row['text']);
    $linkPattern = '/([a-z]+\:\/\/[a-z0-9\-\.]+\.[a-z]+(:[a-z0-9]*)?\/?([a-z0-9\-\._\:\?\,\'\/\\\+&%\$#\=~])*[^\.\,\)\(\s])/i';
    $linkReplace = '<a href="$1">$1</a>';
    $text = preg_replace($linkPattern, $linkReplace, $text);

    $emoticonPattern = '/:(\w+):/';
    $emoticonReplace = '<img src="http://cdn.steamcommunity.com/economy/emoticon/$1">';
    $text = preg_replace($emoticonPattern, $emoticonReplace, $text);
    ?>
    <div class="steam-comment">
        <div class="avatar">
            <img src="<? echo $avatar; ?>">
        </div>
        <div class="steam-comment-body">
            <div class="author"><span class="name"><? echo $author; ?></span> - <? echo $date; ?></div>
            <div class="text"><? echo $text; ?></div>
        </div>
    </div>
<?
}

?>