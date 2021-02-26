// keyboards.
const keyboard = document.querySelector('.keyboard');
const num_keyboard = document.querySelector('.num_keyboard');

// keyboard done.
const keyboard_Done = document.querySelector('.keyboard--done');
const numKeyboard_Done = document.querySelector('.num_keyboard--done');

// keyboard functionality.
const capLock = document.querySelector('#capLock');
const keyboard_indcate = document.querySelector('.keyboard_key--cap-indcate');

// all inputs.
const inputs = document.querySelectorAll('input');

inputs.forEach((input) => {
    switch (input.getAttribute('type')) {
        case 'number':
            input.addEventListener("click", (e) => {
                document.body.style.height = "120vh";
                window.scrollTo(0, document.body.scrollHeight);
                keyboard.classList.remove("keyboard--active");
                num_keyboard.classList.add("num_keyboard--active");
                num_keyboard.setAttribute("data-input", input.getAttribute('name'));
            });
            break;
            
        case 'text':
            input.addEventListener("click", (e) => {
                document.body.style.height = "120vh";
                window.scrollTo(0, document.body.scrollHeight);
                num_keyboard.classList.remove("num_keyboard--active");
                keyboard.classList.add("keyboard--active");
                keyboard.setAttribute("data-input", input.getAttribute('name'));
            });
            break;
    
        default:
            break;
    };
});

let keyboard_cap = false;
function makeUpperCase(keys) {
    keys.forEach(key => {
        key.textContent = key.textContent.toUpperCase();
    });
};
function makeLowerCase(keys) {
    keys.forEach(key => {
        key.textContent = key.textContent.toLowerCase();
    });
};
capLock.addEventListener("click", (e) => {
    let keys = document.querySelectorAll(".keyboard > .txt");
    keyboard_indcate.classList.toggle('active');

    if (keyboard_cap) {
        makeLowerCase(keys);
        keyboard_cap = false;
    } else {
        makeUpperCase(keys);
        keyboard_cap = true;
    };
});
keyboard_Done.addEventListener("click", (e) => {
    keyboard.classList.remove("keyboard--active");
    document.body.style.height = "100vh";
    keyboard.setAttribute("data-input", "");
});
numKeyboard_Done.addEventListener("click", (e) => {
    num_keyboard.classList.remove("num_keyboard--active");
    document.body.style.height = "100vh";
    num_keyboard.setAttribute("data-input", "");
});

function input_key(self, board) {
    let input = [];
    switch (board) {
        case "keyboard":
            input = document.getElementsByName(keyboard.getAttribute('data-input'));
            input[0].value += self.textContent;
            break;
        case "num_keyboard":
            input = document.getElementsByName(num_keyboard.getAttribute('data-input'));
            input[0].value += self.textContent;
            break;
        default:
            break;
    }
};
function input_backspace(board) {
    let input = [];
    switch (board) {
        case "keyboard":
            input = document.getElementsByName(keyboard.getAttribute('data-input'));
            input[0].value = input[0].value.slice(0, -1);
            break;
        case "num_keyboard":
            input = document.getElementsByName(num_keyboard.getAttribute('data-input'));
            input[0].value = input[0].value.slice(0, -1);
            break;
        default:
            break;
    }
};
function input_enter() {
    let input = document.getElementsByName(keyboard.getAttribute('data-input'));
    input[0].value += "\n";
};
function input_space() {
    let input = document.getElementsByName(keyboard.getAttribute('data-input'));
    input[0].value += " ";
};
