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

// Global Variables for Delete Alert
let alertToDelete = null;
let deleteAlertButton = null;

// Open Delete Modal
function openAlertDeleteModal(alertId, buttonElement) {
    alertToDelete = alertId;
    deleteAlertButton = buttonElement;

    const modal = document.getElementById('alertDeleteConfirmModal');
    const confirmText = document.getElementById('alertDeleteConfirmText');
    confirmText.textContent = `Are you sure you want to delete alert #A${alertId}? This action cannot be undone.`;

    modal.style.display = 'flex';
}

// Close Delete Modal
function closeAlertDeleteModal() {
    const modal = document.getElementById('alertDeleteConfirmModal');
    modal.style.display = 'none';
    alertToDelete = null;
    deleteAlertButton = null;
}

// Perform Alert Deletion
function performAlertDeletion() {
    const alertId = alertToDelete;
    const buttonElement = deleteAlertButton;

    if (!alertId || !buttonElement) return;

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
        })
        .finally(() => {
            closeAlertDeleteModal();
        });
}

// Modal Button Event Handlers
const confirmAlertDeleteBtn = document.getElementById('confirmAlertDeleteBtn');
const cancelAlertDeleteBtn = document.getElementById('cancelAlertDeleteBtn');

confirmAlertDeleteBtn.addEventListener('click', performAlertDeletion);
cancelAlertDeleteBtn.addEventListener('click', closeAlertDeleteModal);

document.getElementById('alertDeleteConfirmModal').addEventListener('click', (e) => {
    if (e.target.id === 'alertDeleteConfirmModal') {
        closeAlertDeleteModal();
    }
});

// Existing Event Delegation (update to use modal trigger)
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAlerts();

    const alertTableBody = document.querySelector('.alerts-table tbody');
    if (alertTableBody) {
        alertTableBody.addEventListener('click', (event) => {
            const deleteButton = event.target.closest('.alert-delete-btn');
            if (deleteButton) {
                const alertId = deleteButton.dataset.id;
                openAlertDeleteModal(alertId, deleteButton);
            }
        });
    }
});

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
