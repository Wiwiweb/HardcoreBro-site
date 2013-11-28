<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>

<head>
	<title>Hardcore Bro - Login</title>
	<link rel="icon" type="image/x-icon" href="../favicon.ico">
	<link rel="stylesheet" media="screen" type="text/css" title="Main"
          href="css/login.css"/>
    <script type="text/javascript"
            src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
	<script type="text/javascript" src="scripts/sha512.js"></script>
	<script type="text/javascript" src="scripts/login.js"></script>
</head>

<body>
<div id="login-container">
    <p>Login:</p>
    <form action="process_login.php" method="post" id="login-form">
       <label for="username">Username:</label>
          <input type="text" name="username" id="username" /><br />
       <label for="password">Password:</label>
          <input type="password" name="password" id="password"/><br />
       <input type="submit" value="Login">
    </form>
</div>
</body>

</html>