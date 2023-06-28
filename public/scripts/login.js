function login(){
    console.log()
    let u_email = document.login_form.u_email.value
    let u_pass = document.login_form.u_password
    console.log(u_email, u_pass)
    if (u_email, u_pass){
        payload = [{'u_email': u_email, 'u_pass': u_pass, "login": true}]
        fetch('/data/user', { method : 'POST',  headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)}).then(function (result) {
            if (result.status === 200){
                let username = result.u_name
                document.getElementById("log/reg").innerHTML = `<a class="navbar-brand mb-0 h1" href="user.html">${username}</a>`
            }
        })

    }
}