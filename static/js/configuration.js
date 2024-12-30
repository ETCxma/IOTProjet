document.getElementById('addCapteurForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const formData = new FormData(event.target); // Get form data
    const data = {
        reference: formData.get('reference'),
        port: formData.get('port'),
        precision: formData.get('precision'),
        unite: formData.get('unite')
    };

    // Send a POST request to the FastAPI server
    fetch('/add_capteur', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Capteur added successfully!');
            event.target.reset(); // Reset the form
            

        } else {
            alert('Failed to add capteur.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while adding the capteur.');
    });
});


var tableBodyCapteurs = document.getElementById('tableBodyCapteurs');
tableBodyCapteurs.innerHTML = '';

for (var i = 0; i < capteurs.length; i++) {

    const rowId = capteurs[i][0]+":"+capteurs[i][1]+"-"+i
    const reference = capteurs[i][0]
    const port = capteurs[i][1]
    const date_insertion = capteurs[i][2]


    // Create a new row element for the table
    const row = document.createElement('tr');
    row.innerHTML = `                                
    <td>${reference} </td>
    <td>${port} </td>
    <td>${date_insertion} </td>
    <td>
        <a href="#" class="btn btn-danger btn-sm" title="Supprimer" data-row-id="${rowId}">
            <i class="bi bi-trash"></i>
        </a>
    </td>
    `;

    // Append the newly created row to the main table body
    tableBodyCapteurs.appendChild(row);


    row.querySelector('.btn-danger').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default link behavior
        deleteCapteur(reference, port, date_insertion, row); // Call delete function
    });


}

function deleteCapteur(reference, port, date_insertion, rowElement) {
    fetch(`/delete_capteur`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            reference: reference,
            port: port,
            date_insertion: date_insertion,
        }),
    })
        .then(response => {
            if (response.ok) {
                console.log('Capteur supprimé!');
                rowElement.querySelector('td:last-child').innerHTML = `
                    <i class="bi bi-check-circle text-success" title="Deleted"></i>
                `;
                rowElement.style.opacity = '0.5'; // Optionally, dim the row to indicate deletion

            } else {
                console.error('Failed to delete the row.');
                alert('Error: Unable to delete the row from the server.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



var tableBodyHistory = document.getElementById('tableBodyHistory');
tableBodyHistory.innerHTML = '';

for (const [key, value] of Object.entries(mesures_by_capteur)) {

    // Create a new row element for the table
    var row = document.createElement('tr');
    row.innerHTML = `                                
    <td>                                                
        <button data-bs-toggle="collapse" data-bs-target="#${key}">
        ${key}
        </button>
        <div id="${key}" class="collapse">
            <table class="table table-bordered" id="table${key}">
                <thead>
                    <tr>
                        <th>Valeur mesurée</th>
                        <th>Date de mesure</th>
                        <th>Supprimer</th>
                    </tr>
                </thead>
                <tbody id="tableBody${key}">
                </tbody>
            </table>
        </div>
    </td>
    `;

    // Append the newly created row to the main table body
    tableBodyHistory.appendChild(row);

    // Get the tbody element for this specific key
    var tableBodyCapteur = document.getElementById("tableBody" + key);

    // Populate the rows for the specific table
    for (var i = 0; i < value[0].length; i++) {
        const rowId = key + "-" + i; // Unique identifier for each row
        const valeur = value[0][i]; // Capture value in a local constant
        const date = value[1][i]; // Capture date in a local constant
        const rowCapteur = document.createElement('tr');
        rowCapteur.innerHTML = `
            <td>${valeur}</td>
            <td>${date}</td>
            <td>
                <a href="#" class="btn btn-danger btn-sm" title="Supprimer" data-row-id="${rowId}">
                    <i class="bi bi-trash"></i>
                </a>
            </td>
        `;

        tableBodyCapteur.appendChild(rowCapteur);

        // Add click event listener to the trash icon
        rowCapteur.querySelector('.btn-danger').addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default link behavior
            
            deleteMesure(key, valeur, date, rowCapteur); // Call delete function
        });

    }
}

// Function to send a DELETE request to the server
function deleteMesure(capteur, valeur, date, rowElement) {
    fetch(`/delete_mesure`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            capteur: capteur,
            valeur: valeur,
            date: date,
        }),
    })
        .then(response => {
            if (response.ok) {
                console.log('Mesure supprimée!');
                rowElement.querySelector('td:last-child').innerHTML = `
                    <i class="bi bi-check-circle text-success" title="Deleted"></i>
                `;
                rowElement.style.opacity = '0.5'; // Optionally, dim the row to indicate deletion
                rowElement.offsetHeight;

            } else {
                console.error('Failed to delete the row.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
