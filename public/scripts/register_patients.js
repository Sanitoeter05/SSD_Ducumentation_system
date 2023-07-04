function send_data(){
    let name = document.getElementById("name").value
    let klasse = document.getElementById("klasse").value
    let date = document.getElementById("date").value
    let Prediseases = document.getElementById("Prediseases").value
    let u_feedback = document.getElementById("UFeedback")

    klasse = klasse.replace(/\s/g, "")
    let myRegex = new RegExp("^(1{1}[0-3]{1}|[1-9]{1})[A-Da-d]?$")

    function Parse_class(klasse){
        return (klasse.toLowerCase() === "ivk" || myRegex.test(klasse))
    }

    if (name, klasse, date, Prediseases && Parse_class(klasse)){
        let data = {
            "name": name,
            "p_class": klasse,
            "birth_day": date,
            "pre_diseases": Prediseases
        }
        fetch("/data/patients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(result => {
            if (result.status === 201){
                u_feedback.innerHTML =
                '<div class="alert alert-success"><strong>Registration Successful!</strong></div>';
            }
            else {
                u_feedback.innerHTML =
                '<div class="alert alert-danger"><strong>Registration failed!</strong></div>';
            }
        })
    }else {
        u_feedback.innerHTML =
        '<div class="alert alert-danger"><strong>Registration failedsome fields are missing!</strong></div>';
    }
}