
$(document).ready(function () {
    var $loginForm = $('#login-form');
    var $password = $('#password');

    $loginForm.submit(function( event ) {
        console.debug('1');
//        event.preventDefault();
        var p = document.createElement("input");
        p.name = "hashed_pass";
        p.type = "hidden";
        p.value = CryptoJS.SHA512($password.val());
        $loginForm.append(p);

        // Make sure the plaintext password doesn't get sent.
        $password.val('');

        // Finally submit the form.
//        $loginForm.submit();
    });
});