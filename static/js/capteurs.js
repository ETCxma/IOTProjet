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

// var tableBody = document.getElementById('tableBody');
// tableBody.innerHTML = '';
// mesures_by_capteurs.forEach(function (entry) {
//     var row = document.createElement('tr');
//     row.innerHTML = `
//         <td>${entry[1]}</td>
//         <td>${entry.consommation} kWh</td>
//         <td>${entry.montant.toFixed(2)} €</td>
//     `;
//     tableBody.appendChild(row);
// });

// <td>${key}</td>
var tableBody = document.getElementById('tableBody');
tableBody.innerHTML = '';

for (const [key, value] of Object.entries(mesures_by_capteur)) {
    console.log(key, value);
    var row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <button data-bs-toggle="collapse" data-bs-target="#collapse${key}">
            ${key}
            </button>
            <div id="collapse${key}" class="collapse">
                <canvas id="Chart${key}"></canvas>
            </div> 
        </td>
        <td>${value[0][value[0].length - 1]} </td>
        <td>${value[1][value[1].length - 1]} </td>
    `;
    tableBody.appendChild(row);

    var ctx = document.getElementById(`Chart${key}`).getContext('2d');

    var consommationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: value[1], // Mois
            datasets: [{
                label: 'Mesure',
                data: value[0], // Données de consommation
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

  }