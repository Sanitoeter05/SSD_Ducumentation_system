fetch("/get_current_user_inf")
    .then((response) => response.json())
    .then((resul) => {
        let username = resul.u_name;
        if (username) {
            document.getElementById(
                "log/reg"
            ).innerHTML = `<a class="navbar-brand mb-0 h1" href="user.html">${username}</a>`;
            let btn = document.getElementById("logout_btn")
            btn.setAttribute("class","btn btn-success collapse show")

        } else {
            document.getElementById(
                "log/reg"
            ).innerHTML = `<a class="navbar-brand mb-0 h1" href="login.html">login!</a>`;
        }
    });
function logout(){
    fetch("/logout").then(response =>{
        let btn = document.getElementById("logout_btn")
        if (response.status === 200){
            btn.setAttribute("class","btn btn-success collapse hide")
            window.location = "/index.html"
        }
    })
}