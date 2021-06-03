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

let get_chart_data = () => {
    //! AJAX request
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let resData = JSON.parse(this.responseText);
            
            if(resData.data && resData.label)
                setChart(resData.data, resData.label);
            else
                console.log('--------[Chart AJAX ERORR] No data found--------');

        } else if (this.status == 404 || this.status == 403) {
            console.log('--------[Chart AJAX ERORR]--------');
        }
    };

    xhttp.open("GET", "/admin/getChartData", true);
    xhttp.send();
};

// document state checking, for callig ajax call.
document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        get_chart_data();
    }
};