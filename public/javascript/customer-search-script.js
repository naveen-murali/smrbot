const searchByName = document.querySelector("#search-name");
const searchByNameBtn = document.querySelector("#search-name > button");
searchByNameBtn.addEventListener('click', (e) => {
    searchByName.classList.toggle("search-option-container--show");
});

const searchByFull = document.querySelector("#search-full");
const searchByFullBtn = document.querySelector("#search-full > button");
searchByFullBtn.addEventListener('click', (e) => {
    searchByFull.classList.toggle("search-option-container--show");
});

const searchByDate = document.querySelector("#search-date");
const searchByDateBtn = document.querySelector("#search-date > button");
searchByDateBtn.addEventListener('click', (e) => {
    searchByDate.classList.toggle("search-option-container--show");
});

const searchById = document.querySelector("#search-id");
const searchByIdBtn = document.querySelector("#search-id > button");
searchByIdBtn.addEventListener('click', (e) => {
    searchById.classList.toggle("search-option-container--show");
});