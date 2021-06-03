// burger button
const burgerBTN = document.querySelector('.burger-btn');

// slide bar
const slideBar = document.querySelector('.slide-bar');

// profile icon
const profileIcon = document.querySelector('.profile-icon');

// profile section
const profileSection = document.querySelector('.profile-section');

// deseased customers input
const customersList = document.querySelector('#customersList');

// show customer numbers
const customerBtnSpan = document.querySelector('#customerBtn span');

// checkboxs
const checkboxs = document.querySelectorAll('.checkbox');

// profile section activation.
profileIcon.addEventListener('click', (event) => {
    profileSection.classList.toggle('profile-section--active');
});

// side bar activation.
burgerBTN.addEventListener('click', (event) => {
    slideBar.classList.toggle('slide-bar--active');
})

// to select more than one deceased customer.
checkboxs.forEach((checkbox) => {
    checkbox.addEventListener('click', (event) => {
        
        if (checkbox.classList.contains('checkbox--active')) {
            checkbox.classList.remove('checkbox--active');
            customerBtnSpan.textContent = parseInt(customerBtnSpan.textContent) - 1;

            customersList.value = removeCustomerID(checkbox);
        } else {
            checkbox.classList.add('checkbox--active');
            customerBtnSpan.textContent = parseInt(customerBtnSpan.textContent) + 1;

            if (customersList.value) {
                customersList.value = getCustomerValue(checkbox);
            } else {
                customersList.value = checkbox.getAttribute('data-id');
            }
        }
        console.log(customersList.value);

    });
})
function removeCustomerID(checkbox) {
    let data = customersList.value;
    let id = checkbox.getAttribute('data-id');

    if (data.includes(',')) {
        data = data.split(",");
        data.splice(data.indexOf(id), 1);
        data = data.join();
        return data
    } else {
        return ''
    }
}
function getCustomerValue(checkbox) {
    let data = customersList.value;
    let id = checkbox.getAttribute('data-id');
    
    data += "," + id;

    return data
}