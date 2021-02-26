// body element.
const body = document.body;

// form portion
const form = document.getElementById('reg-form');

// loading portion.
const loadingSection = document.querySelector('.loading-section');
const loadingDiv = document.querySelector('.loading-div');

// qr code portion.
const qrSection = document.querySelector('.qr-section');
const qrSectionDiv = document.querySelector('.qr-section div');

// status portion.
const statusSection = document.querySelector('.status-section');
const statusScreen = document.querySelector('.status-screen');
// status content.
const statusH1 = document.querySelector("#status-h1");
const statusH4 = document.querySelector("#status-h4");

// front portion.
const frontSection = document.querySelector('.front-section');
// front content.
const frontSectionH1 = document.querySelector('.front-text');

// qrcode variable.
let qr_status = {
    qr: null,
    color: '#c7c7c7'
};
// qrcode generation.
(function() {
    qr_status.qr = new QRious({
        element: document.getElementById('qr-code'),
        size: 200,
        value: 'http://127.0.0.1:3000/'
    });
})();
function generate_QR_code() {
    let qrtext = `http://127.0.0.1:3000/`;
    qr_status.qr.set({
        background: qr_status.color,
        foreground: 'black',
        size: 200,
        value: qrtext
    });
}
generate_QR_code()
// activating darkmode after 7.00 o clock.
(() => {
    let time1 = new Date();
    let time2 = new Date();

    time2.setHours(19);
    time2.setMinutes(00);
    time2.setSeconds(00);
    time2.setMilliseconds(0000);
    let time_def = time2 - time1;

    if (time_def > 0) {
        setTimeout(() => {
            if (body.classList.contains("light"))
                qr_status.color = "#777";
            else
                qr_status.color = "#c7c7c7";
            generate_QR_code();
            body.classList.toggle("light");
        }, time_def);
    } else {
        qr_status.color = "#777";
        generate_QR_code();
        body.classList.toggle("light");
    }
})();


// text to speech function.
function say(msg) {
    let speech = new SpeechSynthesisUtterance();

    speech.lang = "en-IN";
    speech.text = msg;
    speech.volume = 1;
    speech.rate = 1.07;
    speech.pitch = 1.1;
    window.speechSynthesis.speak(speech);
}

// document state checking for callig ajax
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        get_temp_Ajax();
    }
};
let get_temp_Ajax = () => {
    // console.log("ajax started");

    //! AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log("tempRead response data");
            let resData = JSON.parse(this.responseText);
            // console.log("tempRead", resData);

            if (resData.entryAllowed) {

                // generate_QR_code(resData.id);

                frontSection.classList.add("front-section-disable");
                say(resData.speechContent);
            } else {
                frontSectionH1.innerHTML = `<i class="material-icons">warning</i> <br /> ${resData.speechContent}`;
                frontSection.classList.add("warning");
                say(resData.speechContent);
                setTimeout(() => {
                    location.reload();
                }, 5000);
            }

        } else if (this.status == 404 || this.status == 403) {
            // console.log("[error]");

            frontSectionH1.innerHTML = '<i class="material-icons">warning</i><br> Some error occured, Please try again.';
            frontSection.classList.add("warning");
            say(resData.speechContent);
        }
    };

    // on time out of ajax
    // xhttp.ontimeout = (e) => {
    //     console.log("time out");
    //     console.log(Date() - dt);
    // };

    xhttp.open("GET", "/tempRead/", true);
    xhttp.send();
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = new FormData(form);
    activeLoading();
    
    //! AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let resData = JSON.parse(this.responseText);
            // console.log(resData);

            if (resData.status) {
                statusScreen.classList.remove("failed");
                statusScreen.classList.add("success");
                statusH1.textContent = "registration successfull";
                statusH4.textContent = `welcome ${resData.name}`;

                removeLoading();
                say(resData.speechContent);
                activeStatus();
                setTimeout(() => {
                    removeStatus();
                    location.reload();
                }, 5000);
            } else {
                statusScreen.classList.remove("success");
                statusScreen.classList.add("failed");
                statusH1.textContent = "registration failed";
                statusH4.textContent = `pleace try again`;

                removeLoading();
                say(resData.speechContent);
                activeStatus();
                setTimeout(() => {
                    removeStatus();
                }, 5000);
            }
        } else if (this.readyState == 3) {
            activeLoading();
        } else if (this.status == 404 && this.status == 403) {
            // console.log("[error]");

            statusScreen.classList.remove("success");
            statusScreen.classList.add("failed");
            statusH1.textContent = "registration failed";
            statusH4.textContent = `pleace try again`;

            removeLoading();
            say("You are registration is failed, please try again !");
            activeStatus();
            setTimeout(() => {
                removeStatus();
            }, 5000);
        }
    };

    xhttp.open("POST", "/register/", true);

    xhttp.send(formData);
    
})

// common loading function
let activeLoading = () => {
    loadingSection.classList.add("loading-section-active");
    loadingDiv.classList.add("loading-div-active");
};
let removeLoading = () => {
    loadingDiv.classList.remove("loading-div-active");
    setTimeout(() => {
        loadingSection.classList.remove("loading-section-active");
    }, 200);
};

// common status function
let activeStatus = () => {
    statusSection.classList.add("status-section-active");
    statusScreen.classList.add("status-screen-active");
};
let removeStatus = () => {
    statusScreen.classList.remove("status-screen-active");
    setTimeout(() => {
        statusSection.classList.remove("status-section-active");
    }, 200);
};

// loadingSection.classList.add("loading-section-active");
// setTimeout(() => {
//     loadingDiv.classList.add("loading-div-active");
// }, 50);

// setTimeout(() => {
//     loadingDiv.classList.remove("loading-div-active");
//     setTimeout(() => {
//         loadingSection.classList.remove("loading-section-active");
//     }, 50);
// }, 5000);

// setTimeout(() => { 
//     statusSection.classList.add("status-section-active");
//     setTimeout(() => {
//         statusScreen.classList.add("status-screen-active");
//     }, 50);
// }, 5001);

// setTimeout(() => {
//     statusScreen.classList.remove("status-screen-active");
//     setTimeout(() => {
//         statusSection.classList.remove("status-section-active");
//     }, 200);
// }, 10000);