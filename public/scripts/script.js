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
