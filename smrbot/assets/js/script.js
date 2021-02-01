const form = document.getElementById('reg-form');

const loadingSection = document.querySelector('.loading-section');
const loadingDiv = document.querySelector('.loading-div');

const qrSection = document.querySelector('.qr-section');
const qrSectionDiv = document.querySelector('.qr-section div');

const statusSection = document.querySelector('.status-section');
const statusScreen = document.querySelector('.status-screen');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    loadingSection.classList.add("loading-section-active");
    loadingDiv.classList.add("loading-div-active");

    setTimeout(() => {
        loadingDiv.classList.remove("loading-div-active");
        setTimeout(() => {
            loadingSection.classList.remove("loading-section-active");
        }, 200);
    }, 5000);

    setTimeout(() => { 
        statusSection.classList.add("status-section-active");
        statusScreen.classList.add("status-screen-active");
    }, 5001);

    setTimeout(() => {
        statusScreen.classList.remove("status-screen-active");
        setTimeout(() => {
            statusSection.classList.remove("status-section-active");
        }, 200);
    }, 10000);
})

qrSectionDiv.addEventListener('click', (event) => {
    qrSection.classList.toggle("qr-section-active");
});