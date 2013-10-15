<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>

<head>
	<title>Hardcore Bro - No casuals allowed!</title>
	<meta name="description" content="Streaming video games with a funny accent.">
	<meta name="keywords" content="video game live stream streaming feed hardcore bro">
	<link rel="stylesheet" media="screen" type="text/css" title="Main" href="css/main.css" />
	<link rel="icon" type="image/gif" href="../favicon.ico">
	<script type="text/javascript" src="../scripts/index.js"></script>
</head>

<?php
	$link = mysql_connect('mysql.hardcorebro.org', 'hardcorebro', '$www*tb=', false, MYSQL_CLIENT_INTERACTIVE);
	if (!$link)
		die('Could not connect: ' . mysql_error());
	mysql_select_db('hardcore_bro', $link);


	$stream = json_decode(file_get_contents("https://api.twitch.tv/kraken/streams/hardcore_bro"))->stream;
	if (is_null($stream)) {
		$isLive = false;
	} else {
		$isLive = true;
		$game = $stream->channel->game;
		$status = $stream->channel->status;
	}
?>

<body>
	<div class="logo">
		<?php
			$secret = rand(1, 100);
			if ($secret > 5) {
		?>
			<img src="../images/banner.jpg" alt="Hardcore Bro" />
		<?php
			} else {
		?>
			<table cellspacing="0" cellpadding="0"><tr>
				<td><img src="../images/blingee1.gif" /></td>
				<td><img src="../images/blingee2.gif" alt="Hardcore Bro" /></td>
				<td><img src="../images/blingee3.gif" /></td>
			</tr></table>
		<?php
			}
		?>
	</div>

	<?php
		$data = fetchSingleMySQL("messages", "content", "name", "topMessage");
		if ($data !== '') {
	?>

		<div id="message" class="dotted" onclick="hideContent('message')">
			<?php
				echo stripslashes((nl2br($data)));
			?>
			<p>
				<small>Click to remove.</small>
			</p>
		</div>

	<?php
		}
	?>

	<div id="main-container">

		<iframe id="player" frameborder="0" width="69%" height="600" src="stream.html"></iframe>

		<iframe id="chat_embed" frameborder="0" src="http://twitch.tv/chat/embed?channel=hardcore_bro"
		 width="29%" height="600"></iframe>
	</div>

	<div class="box" style="width: 800px">
		<table width="100%"><tr>
			<td><a href="http://steamcommunity.com/groups/vohcb"><img alt="Steam Group" src="../images/steam.jpg" /></a></td>
			<td><a href="../board"><img alt="Imageboard" src="../images/imageboard.jpg" /></a></td>
		</tr></table>
	</div>
</body>

</html>


<?php

	function MySQLQuery($query)
	{
		$rep = mysql_query($query);
		if (!$rep)
			die('Could not do query: ' . mysql_error());
		return $rep;
	}

	function fetchSingleMySQL($table, $column, $columnWhere, $value)
	{
		$query = "SELECT ".$column." FROM ".$table." WHERE " .$columnWhere. "='".$value."'";
		$rep = MySQLQuery($query);
		$data = mysql_fetch_array($rep);
		return $data[0];
	}
?>