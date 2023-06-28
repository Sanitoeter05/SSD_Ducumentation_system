fetch("/get_current_user_inf").then(response => response.json()).then(resul=>{
    let username = resul.u_name
    if(username){
        document.getElementById("log/reg").innerHTML = `<a class="navbar-brand mb-0 h1" href="user.html">${username}</a>`
    } else {
        document.getElementById("log/reg").innerHTML = `<a class="navbar-brand mb-0 h1" href="login.html">login!</a>`
    }
})