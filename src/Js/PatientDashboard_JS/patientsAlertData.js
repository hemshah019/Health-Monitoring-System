// patientAlertData.js

// Define globally accessible functions
function fetchAndDisplayAlerts() {
    const alertTableBody = document.querySelector('.alerts-table tbody');
    const noAlertsPlaceholder = document.querySelector('.no-alerts');

    if (!alertTableBody) {
        console.warn("Alert table body not found. Skipping fetch.");
        return;
    }
    if (!noAlertsPlaceholder) {
        console.warn("No alerts placeholder not found.");
    }

    alertTableBody.innerHTML = '<tr><td colspan="8">Loading alerts...</td></tr>';
    if (noAlertsPlaceholder) noAlertsPlaceholder.style.display = 'none';

    fetch('/alerts/patient-alerts')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(alerts => {
            alertTableBody.innerHTML = '';

            if (alerts.length === 0) {
                if (noAlertsPlaceholder) noAlertsPlaceholder.style.display = 'block';
            } else {
                if (noAlertsPlaceholder) noAlertsPlaceholder.style.display = 'none';
                alerts.forEach(alert => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-alert-id', alert._id);
                    row.innerHTML = `
                        <td>#A${alert.Alert_ID}</td>
                        <td>${alert.Alert_Type || 'N/A'}</td>
                        <td>${alert.Current_Value || 'N/A'}</td>
                        <td>${alert.Fall_Direction || 'N/A'}</td>
                        <td>${alert.Normal_Range || 'N/A'}</td>
                        <td>${alert.displayDateTime || 'N/A'}</td>
                        <td><span class="status-badge status-${alert.Alert_Status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}">${alert.Alert_Status || 'N/A'}</span></td>
                        <td>${alert.Task_Assigned || 'No'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="delete-btn alert-delete-btn" data-id="${alert._id}">Delete</button>
                            </div>
                        </td>
                    `;
                    alertTableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching alerts:', error);
            alertTableBody.innerHTML = `<tr><td colspan="8" class="error-message">Could not load alerts. Please try again later.</td></tr>`;
            if (noAlertsPlaceholder) noAlertsPlaceholder.style.display = 'none';
        });
}

function deleteAlert(alertId, buttonElement) {
    if (!confirm(`Are you sure you want to delete alert #A${alertId}? This action cannot be undone.`)) return;

    buttonElement.disabled = true;
    const row = buttonElement.closest('tr');
    if (row) row.classList.add('deleting');

    fetch(`/alerts/${alertId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message || 'Failed to delete alert.'); });
            }
            row.remove();
            showNotification('Alert deleted successfully.', 'success');

            const alertTableBody = document.querySelector('.alerts-table tbody');
            const noAlertsPlaceholder = document.querySelector('.no-alerts');
            if (alertTableBody.children.length === 0 && noAlertsPlaceholder) {
                noAlertsPlaceholder.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error deleting alert:', error);
            showNotification(`Error: ${error.message}`, 'error');
            buttonElement.disabled = false;
            if (row) row.classList.remove('deleting');
        });
}

// Event delegation for alert actions
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAlerts();

    const alertTableBody = document.querySelector('.alerts-table tbody');
    if (alertTableBody) {
        alertTableBody.addEventListener('click', (event) => {
            const deleteButton = event.target.closest('.alert-delete-btn');
            if (deleteButton) {
                const alertId = deleteButton.dataset.id;
                deleteAlert(alertId, deleteButton);
            }
        });
    }

    const searchInput = document.querySelector('[data-search-type="alerts"]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchAlerts);
    }
});

function handleSearchAlerts(event) {
    const searchValue = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('.alerts-table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchValue) ? '' : 'none';
    });
}

function showNotification(message, type = 'success') {
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
