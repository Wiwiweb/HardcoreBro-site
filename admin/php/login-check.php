<?php
function login_check($mysqli) {
    // Check if all session variables are set
    if (isset($_COOKIE['hcb_user_id'], $_COOKIE['hcb_username'], $_COOKIE['hcb_login_string'])) {
        $user_id = $_COOKIE['hcb_user_id'];
        $username = $_COOKIE['hcb_username'];
        $login_string = $_COOKIE['hcb_login_string'];
        $user_browser = $_SERVER['HTTP_USER_AGENT']; // Get the user-agent string of the user.

        if ($stmt = $mysqli->prepare("SELECT password FROM streamers WHERE user_id = ? LIMIT 1")) {
            $stmt->bind_param('i', $user_id); // Bind "$user_id" to parameter.
            $stmt->execute(); // Execute the prepared query.
            $stmt->store_result();

            if ($stmt->num_rows == 1) { // If the user exists
                $stmt->bind_result($password); // get variables from result.
                $stmt->fetch();
                $login_check = hash('sha512', $password . $user_browser);

                if ($login_check == $login_string) {
                    // Logged in
                    return true;
                }
            }
        }
    }
    return false;
}
?>