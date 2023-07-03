
fetch("/data/user").then(results => results.json()).then(reslult =>{
    let counter = 0
    let t_body = document.getElementById("t_body")
    reslult.forEach(entry => {
        let tr = document.createElement("tr")        
        let th = document.createElement("th")
        let td = document.createElement("td")
        let th_text = document.createTextNode(counter)
        let td_text = document.createTextNode(entry.u_name)
        let td2 = document.createElement("td")
        let td2_b = document.createElement("button")
        let td2_b_text = document.createTextNode("inspect")

        td2_b.setAttribute("type", "button")
        td2_b.setAttribute("class", "btn btn-primary")
        td2_b.setAttribute("data-bs-toggle", "modal")
        td2_b.setAttribute("data-bs-target", "#myModal")
        td2_b.appendChild(td2_b_text)
        td2.appendChild(td2_b)

        
        td.setAttribute("data-toggle", "modal")
        th.setAttribute("scope", "row")
        td.setAttribute("data-target", "#exampleModal")

        counter = counter + 1
        td.appendChild(td_text)
        td2.setAttribute("onclick", `get_inf(${entry.uid})`)

        th.appendChild(th_text)
        tr.appendChild(th)
        tr.appendChild(td)
        tr.appendChild(td2)
        t_body.appendChild(tr)
    });
})



function get_inf(uid){
    let modal_head = document.getElementById("modal_head")
    let modal_body_email = document.getElementById("email")
    let modal_body_role = document.getElementById("role")

    fetch(`/data/user?uid=${uid}`).then(response => response.json()).then(result=>{
        let u_name = result.u_name
        let u_roles = result.string_agg
        let u_email = result.u_email

        let u_role = u_roles.split(", ")
        
        let modal_head_text = document.createTextNode(u_name)
        let modal_body_email_text = document.createTextNode(u_email)
        let modal_body_role_text = document.createTextNode(u_role)
        
         
        modal_head.appendChild(modal_head_text)
        modal_body_email.appendChild(modal_body_email_text)
        modal_body_role.appendChild(modal_body_role_text)

    })
}
function cleanup(){
    let modal_head = document.getElementById("modal_head")
    let modal_body_email = document.getElementById("email")
    let modal_body_role = document.getElementById("role")    
    
    modal_head.innerHTML = ""
    modal_body_email.innerHTML = ""
    modal_body_role.innerHTML = ""
}