<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>

<head>
	<title>Hardcore Bro - No casuals allowed!</title>
	<meta name="description" content="Streaming video games with a funny accent.">
	<meta name="keywords" content="video game live stream streaming feed hardcore bro">
	<link rel="stylesheet" media="screen" type="text/css" title="Main" href="css/main.css" />
	<link rel="icon" type="image/x-icon" href="favicon.ico">
	<script type="text/javascript"
                src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.3.1/jquery.cookie.min.js"></script>
    <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js"></script>
	<script type="text/javascript" src="scripts/main.js"></script>
</head>

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

	<div id="main-container">

		<iframe id="player" frameborder="0" src="stream.html"></iframe>

		<iframe id="chat" frameborder="0" src="http://twitch.tv/chat/embed?channel=hardcore_bro&popout_chat=true"></iframe>
	</div>

	<div class="box" style="width: 800px">
		<table width="100%"><tr>
			<td><a href="http://steamcommunity.com/groups/vohcb"><img alt="Steam Group" src="../images/steam.jpg" /></a></td>
			<td><a href="../board"><img alt="Imageboard" src="../images/imageboard.jpg" /></a></td>
		</tr></table>
	</div>
</body>

</html>