// Send sms button.
const smsBtn = document.querySelector(".smsBtn");

// getting userid
const userId = document.querySelector('.table-div').getAttribute('data-userId');

// ajax global function.
function callAJAX(id, optionID) {
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let resData = JSON.parse(this.responseText);
            AJAX_success(id, optionID, resData);

        } else if (this.status == 404) {
            AJAX_error(id);
            errorSMS(optionID);
            setTimeout(() => process.exit(1));
        }
    };

    xhttp.open("GET", `/admin/customers/sndSms/${id}/${userId}`, true);
    xhttp.send();
}


// calling ajax by all the ids of filtered customer throughthe click of Send sms BUTTON.
smsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to send all SMS at once??")) {
        let ids = smsBtn.getAttribute("data-ids").split(",");

        if (ids.includes("")) ids.splice(ids.indexOf(""), 1);
        
        ids.forEach((id) => {
            let optionTD = document.getElementById(`option-${id}`);
            sendingSMS(optionTD);
            setTimeout(() => callAJAX(id, optionTD));
        });
    }
});


// calls when the individulaly sending sms.
let sendSMS = (id) => {
    if (confirm("Are you want to send SMS to this customer??")) {
        let optionTD = document.getElementById(`option-${id}`);
        sendingSMS(optionTD)
        setTimeout(() => callAJAX(id, optionTD, AJAX_success, AJAX_error));
    }
}


// call in ajax
let AJAX_success = (id, optionID, resData) => {

    if (resData.status) {
        successSMS(optionID);

        let dataId = smsBtn.getAttribute("data-ids").split(",");
        dataId.splice(dataId.indexOf(id), 1);
        smsBtn.setAttribute("data-ids", dataId.join(","));

        if (dataId.length == 1)
            setTimeout(() => alert("SMS is send to all the cusromers successfully"), 200);
    } else {
        errorSMS(optionID);

        alert(`Couldn't send SMS to, \n Name: ${resData.name}\n Phone: ${resData.phone}`);
    }

}
let AJAX_error = (id) => {
    console.log(`--------[AJAX ERORR id ==> ${id}]--------`);
}


// call to change status.
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