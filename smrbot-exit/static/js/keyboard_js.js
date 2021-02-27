// keyboards.
const num_keyboard = document.querySelector('.num_keyboard');

// keyboard done.
const numKeyboard_Done = document.querySelector('.num_keyboard--done');

// all inputs.
const inputs = document.querySelectorAll('input');

inputs.forEach((input) => {
    switch (input.getAttribute('type')) {
        case 'number':
            input.addEventListener("click", (e) => {
                document.body.style.height = "120vh";
                window.scrollTo(0, document.body.scrollHeight);
                num_keyboard.classList.add("num_keyboard--active");
                num_keyboard.setAttribute("data-input", input.getAttribute('name'));
            });
            break;
    
        default:
            break;
    };
});


numKeyboard_Done.addEventListener("click", (e) => {
    num_keyboard.classList.remove("num_keyboard--active");
    document.body.style.height = "100vh";
    num_keyboard.setAttribute("data-input", "");
});

function input_key(self, board) {
    let input = [];
    switch (board) {
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
        case "num_keyboard":
            input = document.getElementsByName(num_keyboard.getAttribute('data-input'));
            input[0].value = input[0].value.slice(0, -1);
            break;
        default:
            break;
    }
};
