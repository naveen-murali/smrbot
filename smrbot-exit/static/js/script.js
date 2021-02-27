// body element.
const body = document.body;

const form = document.getElementById('reg-form');
const result = document.getElementsByClassName('result-section')
const loadingSection = document.querySelector('.loading-section');
const loadingDiv = document.querySelector('.loading-div');

const statusSection = document.querySelector('.status-section');
const statusScreen = document.querySelector('.status-screen');

const resultSection = document.querySelector('.result-section');



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
            body.classList.toggle("light");
        }, time_def);
    } else {
        body.classList.toggle("light");
    }
})();


form.addEventListener('submit', (event) => {
    event.preventDefault();
    resultSection.classList.add("result-section-active");

    
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
