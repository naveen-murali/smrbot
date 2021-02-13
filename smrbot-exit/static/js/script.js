// form portion
const form = document.getElementById('reg-form');

// status content.
const statusH1 = document.querySelector("#status-h1");
const statusH4 = document.querySelector("#status-h4");

// loading portion.
const loadingSection = document.querySelector('.loading-section');
const loadingDiv = document.querySelector('.loading-div');

// qr code portion.
const qrSection = document.querySelector('.qr-section');
const qrSectionDiv = document.querySelector('.qr-section div');

// status portion.
const statusSection = document.querySelector('.status-section');
const statusScreen = document.querySelector('.status-screen');

// status portion.
const homeSection = document.querySelector('.home-section');
const homeSectionDiv = document.querySelector('.home-section-div');

// text to speech function.
function say(msg) {
    let speech = new SpeechSynthesisUtterance();

    // speech.voice = voices[9]
    speech.lang = "hi-IN";
    // speech.voiceURI = "Google हिन्दी";
    speech.text = msg;
    speech.volume = 1;
    speech.rate = 1.07;
    speech.pitch = 1.1;
    window.speechSynthesis.speak(speech);
  }
  

// document state checking
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {

        console.log(document.readyState);
        getAjax();

    }
};
let getAjax = () => {
    console.log("ajax started");
    let dt = Date();

    //! AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            console.log("response data");
            let resData = JSON.parse(this.responseText);
            console.log(resData);

            homeSectionDiv.classList.remove("home-section-div-active");
            say(resData.speechContent);
            setTimeout(() => {
                homeSection.classList.remove("home-section-active");
            }, 200);

        } else if (this.readyState == 3) {

            console.log("loading")

        } else if (this.status == 404 && this.status == 403) {

            console.log("[error]");

        }
    };

    // on time out of ajax
    xhttp.ontimeout = (e) => {
        console.log("time out");
        console.log(Date() - dt);
    };

    xhttp.open("GET", "/tempRead/", true);
    xhttp.send();
};


// form submitting event listner.
form.addEventListener('submit', (event) => {
    event.preventDefault();
    let formData = new FormData(form);

    activeLoading();

    //! AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let resData = JSON.parse(this.responseText);
            console.log(resData);

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
                    location.reload()
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
            console.log("[error]");

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
    // xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhttp.send(formData);
});


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

// qr-code section toggling.
qrSectionDiv.addEventListener('click', (event) => {
    qrSection.classList.toggle("qr-section-active");
});
