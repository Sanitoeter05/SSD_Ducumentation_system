function send_data() {
    let u_name = document.register_form.name.value;
    let u_pass = document.register_form.password.value;
    let u_email = document.register_form.email.value;
    let u_role = document.register_form.role.value;
    let u_b_day = document.register_form.date.value;
    let letdata = {
        u_name: u_name,
        u_email: u_email,
        u_pass: u_pass,
        u_role: u_role,
        u_b_day: u_b_day,
    };
    fetch("/data/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(letdata),
    }).then(function (result) {
        let u_feedback = document.getElementById("UFeedback");
        if (result.status == 201) {
            u_feedback.innerHTML =
                '<div class="alert alert-success"><strong>Registration Successful!</strong></div>';
            u_email = "";
            u_pass = "";
            u_name = "";
            u_role = "";
            u_b_day = "";
        } else if (result.status === 400) {
            u_feedback.innerHTML =
                '<div class="alert alert-danger"><strong>Registration failed!</strong></div>';
        } else if (result.status === 409)
            u_feedback.innerHTML =
                '<div class="alert alert-danger"><strong>Email alredy exist!</strong></div>';
        else {
            u_feedback.innerHTML =
                '<div class="alert alert-warning"><strong>Internal Server error!</strong></div>';
        }
    });
}
