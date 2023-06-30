function login() {
    console.log();
    let u_email = document.login_form.u_email.value;
    let u_pass = document.login_form.u_password.value;
    console.log(u_email, u_pass);
    if ((u_email, u_pass)) {
        let payload = { u_email: u_email, u_pass: u_pass, login: "1" };
        fetch("/data/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).then(function (result) {
            if (result.status === 200) {
                document.getElementById("UFeedback").innerHTML =
                    '<div class="alert alert-success"><strong>Login Successful!</strong></div>';
                u_email.value = "";
                u_pass.value = "";
                fetch("/get_current_user_inf")
                    .then((response) => response.json())
                    .then((results) => {
                        let username = results.u_name;
                        document.getElementById(
                            "log/reg"
                        ).innerHTML = `<a class="navbar-brand mb-0 h1" href="user.html">${username}</a>`;
                    });
            } else if (result.status === 401) {
                document.getElementById("UFeedback").innerHTML =
                    '<div class="alert alert-danger"><strong>Login failed!</strong></div>';
                u_email.value = "";
                u_pass.value = "";
            } else {
                document.getElementById("UFeedback").innerHTML =
                    '<div class="alert alert-warning"><strong>Internal Server error!</strong></div>';
            }
        });
    }
}
