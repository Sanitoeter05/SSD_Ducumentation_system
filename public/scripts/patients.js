fetch("/data/patient?pat_get_inf=1&offset=0").then(results => results.json()).then(reslult =>{
    add_table(reslult)
})


function add_table(data){
    let counter = 1
    let t_body = document.getElementById("t_body")
    t_body.innerHTML = ""
    data.forEach(entry => {
        let tr = document.createElement("tr")        
        let th = document.createElement("th")
        let td = document.createElement("td")
        let th_text = document.createTextNode(counter)
        let td_text = document.createTextNode(entry.name)
        let td2 = document.createElement("td")
        let td2_text = document.createTextNode(entry.class)
        let td3 = document.createElement("td")
        let td3_b = document.createElement("button")
        let td3_b_text = document.createTextNode("inspect")

        td2.appendChild(td2_text)

        td3_b.setAttribute("type", "button")
        td3_b.setAttribute("class", "btn btn-primary")
        td3_b.setAttribute("data-bs-toggle", "modal")
        td3_b.setAttribute("data-bs-target", "#myModal")
        td3_b.appendChild(td3_b_text)
        td3.appendChild(td3_b)

        
        td.setAttribute("data-toggle", "modal")
        th.setAttribute("scope", "row")
        td.setAttribute("data-target", "#exampleModal")

        counter = counter + 1
        td.appendChild(td_text)
        td3.setAttribute("onclick", `get_inf(${entry.pid})`)

        th.appendChild(th_text)
        tr.appendChild(th)
        tr.appendChild(td)
        tr.appendChild(td2)
        tr.appendChild(td3)
        t_body.appendChild(tr)
    });
}


fetch("")

function get_inf(pid){
    let modal_head = document.getElementById("modal_head")
    let modal_body_class = document.getElementById("class")
    let modal_body_prediseases = document.getElementById("prediseases")

    fetch(`/data/patient?pid=${pid}`).then(response => response.json()).then(result=>{
        let name = result[0].name
        let klasse = result[0].class
        let pre_diseases = result[0].pre_diseases
    
        

        let modal_head_text = document.createTextNode(name)
        let modal_body_class_text = document.createTextNode(klasse)
        let modal_body_prediseases_text = document.createTextNode(pre_diseases)
        modal_head.appendChild(modal_head_text)
        modal_body_class.appendChild(modal_body_class_text)
        modal_body_prediseases.appendChild(modal_body_prediseases_text)
    })
}



function cleanup(){
    let modal_head = document.getElementById("modal_head")
    let modal_body_class = document.getElementById("class")
    let modal_body_prediseases = document.getElementById("prediseases") 
    
    modal_head.innerHTML = ""
    modal_body_class.innerHTML = ""
    modal_body_prediseases.innerHTML = ""
}