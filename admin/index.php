<?php
include 'php/database-connect.php';
include 'php/login-check.php';
session_start();

if (login_check($mysqli) == true) {
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html>
</html>

<head>
	<title>Hardcore Bro - Admin</title>
	<link rel="icon" type="image/x-icon" href="../favicon.ico">
	<link rel="stylesheet" media="screen" type="text/css" title="Main"
          href="css/admin.css"/>
</head>

<body>
    <p>This is the admin page</p>
</body>

</html>

<?php
} else {
    header('Location: ./login.php?error=not_logged_in');
}
?>
