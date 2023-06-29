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
        })
            .then((response) => response.json())
            .then((result) => {
                let username = result.u_name;
                if (username) {
                    console.log(result);
                    console.log(result.u_name);
                    document.getElementById(
                        "log/reg"
                    ).innerHTML = `<a class="navbar-brand mb-0 h1" href="user.html">${username}</a>`;
                } else {
                    null;
                }
            });
    }
}
