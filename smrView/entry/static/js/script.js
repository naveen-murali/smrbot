// body element.
const body = document.querySelector("body");

const form = document.getElementById('reg-form');

const loadingSection = document.querySelector('.loading-section');
const loadingDiv = document.querySelector('.loading-div');

const qrSection = document.querySelector('.qr-section');
const qrSectionDiv = document.querySelector('.qr-section div');

const statusSection = document.querySelector('.status-section');
const statusScreen = document.querySelector('.status-screen');


// qrcode generation.
let qr_status = {
    qr: null,
    color: '#c7c7c7'
};
(function() {
        qr_status.qr = new QRious({
        element: document.getElementById('qr-code'),
        size: 200,
        value: 'https://github.com/naveen-murali'
    });
})();
function generate_QR_code(id) {
    let qrtext = `http://127.0.0.1:3000/${id}`;
    qr_status.qr.set({
        background: qr_status.color,
        foreground: 'black',
        size: 200,
        value: qrtext
    });
}
generate_QR_code('21313');

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
        
            generate_QR_code('21313');
            body.classList.toggle("light");
        }, time_def);
    } else {
        qr_status.color = "#777";
        body.classList.toggle("light");
        generate_QR_code('21313');
    }
})();


form.addEventListener('submit', (event) => {
    event.preventDefault();

    loadingSection.classList.add("loading-section-active");
    setTimeout(() => {
        loadingDiv.classList.add("loading-div-active");
    }, 50);

    setTimeout(() => {
        loadingDiv.classList.remove("loading-div-active");
        setTimeout(() => {
            loadingSection.classList.remove("loading-section-active");
        }, 50);
    }, 5000);

    setTimeout(() => { 
        statusSection.classList.add("status-section-active");
        setTimeout(() => {
            statusScreen.classList.add("status-screen-active");
        }, 50);
    }, 5001);

    setTimeout(() => {
        statusScreen.classList.remove("status-screen-active");
        setTimeout(() => {
            statusSection.classList.remove("status-section-active");
        }, 200);
    }, 10000);
})
