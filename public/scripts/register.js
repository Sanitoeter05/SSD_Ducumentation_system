function send_data(){
    let u_name = document.register_form.name.value
    let u_pass = document.register_form.password.value
    let u_email = document.register_form.email.value
    let u_role = document.register_form.role.value
    let u_b_day = document.register_form.date.value


    letdata = {'u_name': u_name, 'u_email': u_email, 'u_pass': u_pass, 'u_role': u_role, 'u_b_day': u_b_day}
    console.log(JSON.stringify(letdata))
    fetch('/data/user', { method : 'POST',  headers: {'Content-Type': 'application/json'}, body: JSON.stringify(letdata)}).then(function (result) {
            if (result.status == 201){
                console.log("succes")
            }
            else {
                console.log("fail")
            }
    })
}

