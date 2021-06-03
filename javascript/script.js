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

// creating chart.
function setChart(data, label) {
    // creating graph using chartJs.
    let ctx = document.getElementById('myChart').getContext('2d');
    let chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: label,
            datasets: [{
                label: 'Number of customers',
                pointBackgroundColor: 'rgba(2, 226, 150, 1)',
                pointBorderColor: 'rgb(255, 255, 255)',
                pointBorderWidth: 1,
                pointRadius: 3,
                pointHoverBorderWidth: 2.5,
                pointHoverRadius: 5,
                backgroundColor: 'rgba(31, 112, 87, 0.75)',
                lineTension: 0.2,
                borderColor: 'rgba(2, 226, 150, 1)',
                pointHitRadius: 100,
                data: data
            }]
        },

        // Configuration options go here
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    gridLines: {
                        color: "rgba(255, 255, 255, 0.414)"
                    },
                    ticks: {
                        beginAtZero: true,
                        fontColor: "#CCC",
                        fontSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Customers',
                        fontColor: '#CCC',
                        fontSize: 12,
                        fontFamily: 'Open Sans'
                    }
                }],
                xAxes: [{
                    gridLines: {
                        color: "rgba(255, 255, 255, 0.1)"
                    },
                    ticks: {
                        fontColor: "#CCC",
                        fontSize: 10
                    },
                    scaleLabel: {
                        display: true,
                        labelString: `Date [ 2021 ]`,
                        fontColor: '#CCC',
                        fontSize: 12,
                        fontFamily: 'Open Sans'
                    }
                }]
            },
            legend: {
                display: false
            },
            events: ['mousemove'],
            gridLines: {
                color: ['rgba(0, 0, 0, 0.1)']
            },
        }
    });
};
// setChart([1, 10, 5, 2, 20, 30, 45], ['12-2-2021', '13-2-2021', '14-2-2021', '15-2-2021', '16-2-2021', '17-2-2021', '18-2-2021']);

// to select more than one customers
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