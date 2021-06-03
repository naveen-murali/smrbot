const smsBtn = document.querySelector(".smsBtn");

function callAJAX(id, response, error) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let resData = JSON.parse(this.responseText);
            response(id, resData);
        } else if (this.status == 404 || this.status == 403) {
            error(id);
        }
    };

    xhttp.open("GET", `/customers/customerFilter/sndSms/${id}`, true);
    xhttp.send();
}

smsBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let ids = smsBtn.getAttribute("data-ids").split(",");
    
    ids.forEach((id) => {
        sendSMS(id);
    });
});

let sendSMS = (id) => {
    let optionTD = document.getElementById(`option-${id}`);

    sendingSMS(optionTD);
    
    setTimeout(() => {
        errorSMS(optionTD);
    }, 3000);
    setTimeout(() => {
        successSMS(optionTD);
    }, 6000);
}



let sendingSMS = (optionTD) => {
    optionTD.classList.remove("SMS--error");
    optionTD.classList.add("SMS--sending");
}
let successSMS = (optionTD) => {
    optionTD.classList.remove("SMS--error");
    optionTD.classList.remove("SMS--sending");
    optionTD.classList.add("SMS--successful");
}
let errorSMS = (optionTD) => {
    optionTD.classList.remove("SMS--sending");
    optionTD.classList.add("SMS--error");
}

let AJAX_success = (id, res) => {
    console.log(id);
    console.log(res);
}
let AJAX_error = (id) => {
    console.log(`--------[AJAX ERORR id ==> ${id}]--------`);
}