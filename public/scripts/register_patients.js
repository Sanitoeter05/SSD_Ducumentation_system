function send_data(){
    let name = document.getElementById("name")
    let klasse = document.getElementById("klasse")
    let date = document.getElementById("date")
    let Prediseases = document.getElementById("Prediseases")
    let u_feedback = document.getElementById("UFeedback")

    let klasse_boot = klasse.value.replace(/\s/g, "")
    let myRegex = new RegExp("^(1{1}[0-3]{1}|[1-9]{1})[A-Da-d]?$")

    function Parse_class(klasse){
        return (klasse.toLowerCase() === "ivk" || myRegex.test(klasse))
    }

    if(!name.value){
        name.setAttribute("class", "form-control mb-1 bg-danger")
    }else{
        name.setAttribute("class", "form-control mb-1")
    }

    if(!klasse_boot){
        klasse.setAttribute("class", "form-control mb-1 bg-danger")
    } else{
        klasse.setAttribute("class", "form-control mb-1")
    }
    if(klasse_boot && !Parse_class(klasse_boot)){
        klasse.setAttribute("class", "form-control mb-1 bg-warning")
    } else if (klasse_boot&&Parse_class(klasse_boot)){
        klasse.setAttribute("class", "form-control mb-1")
    }
    if(!date.value){
        date.setAttribute("class", "form-control mb-1 bg-danger")
    }else {
        date.setAttribute("class", "form-control mb-1")
    }
    if(!Prediseases.value){
        Prediseases.setAttribute("class", "form-control mb-1 bg-danger")
    } else {
        Prediseases.setAttribute("class", "form-control mb-1")

    }

    if (name.value, klasse, date.value, Prediseases.value && Parse_class(klasse_boot)){
        let data = {
            "name": name.value,
            "p_class": klasse_boot,
            "birth_day": date.value,
            "pre_diseases": Prediseases.value
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
    }
}