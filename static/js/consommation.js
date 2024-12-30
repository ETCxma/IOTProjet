// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawCharts);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawCharts() {

  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'types');
  data.addColumn('number', '');
  data.addRows(
    factures_proportion["consommation"]
  );

  // Set chart options
  var options = {'title':"Porportion de la consommation d'énergie",
                 'width':800,
                 'height':400};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);


    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'types');
    data.addColumn('number', '');
    data.addRows(
        factures_proportion["montant"]
    );
  
    // Set chart options
    var options = {'title':"Porportion du montant des factures",
                   'width':800,
                   'height':400};
  
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div2'));
    chart.draw(data, options);
}


var ctx = document.getElementById('ChartElectriciteConso').getContext('2d');
var consommationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: factures_by_type["electricité"][2], // Mois
        datasets: [{
            label: 'Consommation d\'énergie (kWh)',
            data: factures_by_type["electricité"][1], // Données de consommation
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        }
    }
});
var ctx = document.getElementById('ChartElectriciteCout').getContext('2d');
var consommationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: factures_by_type["electricité"][2], // Mois
        datasets: [{
            label: 'Montant payé (€)',
            data: factures_by_type["electricité"][0], // Données de consommation
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        }
    }
});


var ctx = document.getElementById('ChartEauConso').getContext('2d');
var consommationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: factures_by_type["eau"][2], // Mois
        datasets: [{
            label: 'Consommation d\'énergie (kWh)',
            data: factures_by_type["eau"][1], // Données de consommation
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        }
    }
});
var ctx = document.getElementById('ChartEauCout').getContext('2d');
var consommationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: factures_by_type["eau"][2], // Mois
        datasets: [{
            label: 'Montant payé (€)',
            data: factures_by_type["eau"][0], // Données de consommation
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        }
    }
});

var ctx = document.getElementById('ChartGazConso').getContext('2d');
var consommationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: factures_by_type["gaz"][2], // Mois
        datasets: [{
            label: 'Consommation d\'énergie (kWh)',
            data: factures_by_type["gaz"][1], // Données de consommation
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        }
    }
});
var ctx = document.getElementById('ChartGazCout').getContext('2d');
var consommationChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: factures_by_type["gaz"][2], // Mois
        datasets: [{
            label: 'Montant payé (€)',
            data: factures_by_type["gaz"][0], // Données de consommation
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        }
    }
});
// var ctx = document.getElementById('ChartTemperature').getContext('2d');
// var consommationChart = new Chart(ctx, {
//     type: 'line',
//     data: {
//         labels: temperature[1], // Mois
//         datasets: [{
//             label: 'Consommation d\'énergie (kWh)',
//             data: temperature[0], // Données de consommation
//             borderColor: 'rgba(75, 192, 192, 1)',
//             backgroundColor: 'rgba(75, 192, 192, 0.2)',
//             borderWidth: 1
//         }]
//     },
//     options: {
//         responsive: true,
//         plugins: {
//             legend: {
//                 position: 'top',
//             },
//             tooltip: {
//                 mode: 'index',
//                 intersect: false,
//             }
//         }
//     }
// });