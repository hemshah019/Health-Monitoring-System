document.addEventListener('DOMContentLoaded', () => {
    fetchAlerts();
});

async function fetchAlerts() {
    try {
        const response = await fetch('/alerts/generate-heart-rate-alerts', {
            method: 'POST'
        });
        const data = await response.json();
        const alerts = data.alerts || [];

        const tableBody = document.querySelector('.alerts-table tbody');
        tableBody.innerHTML = '';

        alerts.forEach(alert => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>#${alert.Alert_ID}</td>
                <td>${alert.Alert_Type}</td>
                <td>${alert.Current_Value}</td>
                <td>${alert.Normal_Range}</td>
                <td>${new Date(alert.Alert_DateTime).toLocaleString()}</td>
                <td>${alert.Alert_Status}</td>
                <td>${alert.Task_Assigned}</td>
                <td>
                    <div class="action-buttons">
                        <button class="delete-btn" data-id="${alert.Alert_ID}">Delete</button>
                    </div>
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
}
