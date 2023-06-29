fetch("/data/user?count=1")
    .then((response) => response.json())
    .then((result) => {
        document.getElementById("Sanis").innerHTML = result[0].count;
    });
fetch("/data/protocol")
    .then((response) => response.json())
    .then((result) => {
        document.getElementById("protocols").innerHTML = result[0].count;
    });
fetch("/data/patient?count=1")
    .then((response) => response.json())
    .then((result) => {
        document.getElementById("patients").innerHTML = result[0].count;
    });

fetch("/get_current_user_inf")
    .then((response) => response.json())
    .then((resul) => {
        let username = resul.u_name;
        if (username) {
            document.getElementById(
                "log/reg"
            ).innerHTML = `<a class="navbar-brand mb-0 h1" href="user.html">${username}</a>`;
            let sanis = document.getElementById("sanis-image-b")
            sanis.setAttribute("class", "card-img-top img-fluid bg-info")
        } else {
            document.getElementById(
                "log/reg"
            ).innerHTML = `<a class="navbar-brand mb-0 h1" href="login.html">login!</a>`;
        }
    });