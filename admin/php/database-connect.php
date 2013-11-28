<?php
define("HOST", "mysql.hardcorebro.org"); // The host you want to connect to.
define("USER", "hcb_login"); // The database username.
define("PASSWORD", "Secret.terrible.captain"); // The database password.
define("DATABASE", "hardcore_bro"); // The database name.
$mysqli = new mysqli(HOST, USER, PASSWORD, DATABASE);
?>