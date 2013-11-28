<?php
include 'database_connect.php';
session_start();

if (isset($_POST['username'], $_POST['hashed_pass'])) {
    $username = $_POST['username'];
    $password = $_POST['hashed_pass'];

    $login = login($username, $password, $mysqli);
    if ($login == "valid") {
        header('Location: ./');
    } else {
        // Login failed
        header('Location: ./login.php?error=' . $login);
    }
} else {
    // The correct POST variables were not sent to this page.
    header('Location: ./login.php?error=invalid_request');
}


function login($username, $entered_password, $mysqli) {
    if ($stmt = $mysqli->prepare("SELECT user_id, password, salt FROM streamers WHERE username = ? LIMIT 1")) {
        $stmt->bind_param('s', $username);
        $stmt->execute();
        $stmt->store_result();
        $stmt->bind_result($user_id, $db_password, $salt); // get variables from result.
        $stmt->fetch();
        $entered_password = hash('sha512', $entered_password . $salt); // hash the password with the unique salt.

        if ($stmt->num_rows == 1) { // If the user exists

            if (checkbrute($user_id, $mysqli) == true) {
                // Account is locked
                return "account_locked";
            } else {
                if ($db_password == $entered_password) { // Password is correct
                    $user_browser = $_SERVER['HTTP_USER_AGENT'];
                    $expire = time() + (5 * 365 * 24 * 60 * 60);
                    setcookie('hcb_user_id', $user_id, $expire);
                    setcookie('hcb_username', $username, $expire);
                    setcookie('hcb_login_string', hash('sha512', $entered_password . $user_browser), $expire);
                    return "valid";
                } else {
                    // Password is not correct
                    // We record this attempt in the database
                    $now = time();
                    $mysqli->query("INSERT INTO login_attempts (user_id, time) VALUES ('$user_id', '$now')");
                    return "invalid_password";
                }
            }
        } else {
            // No user exists.
            return "invalid_user";
        }
    } else {
         // Database is not set up.
         return "database_error";
     }
}

function checkbrute($user_id, $mysqli) {
    $now = time();
    // All login attempts are counted from the past 1 hour.
    $valid_attempts = $now - (1 * 60 * 60);

    if ($stmt = $mysqli->prepare("SELECT time FROM login_attempts WHERE user_id = ? AND time > '$valid_attempts'")) {
        $stmt->bind_param('i', $user_id);
        // Execute the prepared query.
        $stmt->execute();
        $stmt->store_result();
        // If there has been more than 20 failed logins

        if ($stmt->num_rows > 20) {
            return true;
        } else {
            return false;
        }
    }
}
?>
