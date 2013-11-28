$(document).ready(function () {
    var $loginForm = $('#login-form');
    var $password = $('#password');

    $loginForm.submit(function() {
        var p = document.createElement("input");
        p.name = "hashed_pass";
        p.type = "hidden";
        p.value = CryptoJS.SHA512($password.val());
        $loginForm.append(p);
    });
});