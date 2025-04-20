// // patientsAlertData.js - Handles fetching and displaying patient alert data

// document.addEventListener('DOMContentLoaded', function() {
//     // Check if user is logged in and get user data from session
//     const userDataString = sessionStorage.getItem('userData');
//     if (!userDataString) {
//         console.error('No user data found in session. Please login first.');
//         // Redirect to login if not logged in
//         window.location.href = '/';
//         return;
//     }

//     const userData = JSON.parse(userDataString);
//     const patientId = userData.Patient_ID;
    
//     // Initialize alerts display
//     initializeAlertsDisplay();
    
//     // Load alerts when the alerts tab/section is activated
//     const alertsTab = document.querySelector('[data-target="alerts"]');
//     if (alertsTab) {
//         alertsTab.addEventListener('click', function() {
//             loadPatientAlerts(patientId);
//         });
//     }
    
//     // If the alerts content is already visible on page load, load the data
//     const alertsContent = document.querySelector('.alerts-content');
//     if (alertsContent && window.getComputedStyle(alertsContent).display !== 'none') {
//         loadPatientAlerts(patientId);
//     }
    
//     // Setup search functionality
//     setupAlertSearch();
// });

// // Function to initialize the alerts display with current date and empty state
// function initializeAlertsDisplay() {
//     // Set the current date in the date selector
//     const dateElement = document.querySelector('[data-date]');
//     if (dateElement) {
//         const currentDate = new Date();
//         const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//         dateElement.textContent = currentDate.toLocaleDateString('en-US', options);
//     }
    
//     // Clear any existing alerts from the table
//     const alertsTableBody = document.querySelector('.alerts-table tbody');
//     if (alertsTableBody) {
//         alertsTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Loading alert data...</td></tr>';
//     }
// }

// // Function to load patient alerts from the server
// async function loadPatientAlerts(patientId) {
//     try {
//         const response = await fetch(`/alerts/patient/${patientId}`);
        
//         if (!response.ok) {
//             throw new Error(`Failed to fetch alerts: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         if (data.success) {
//             displayAlerts(data.alerts);
//         } else {
//             throw new Error(data.message || 'Failed to fetch alerts');
//         }
//     } catch (error) {
//         console.error('Error loading patient alerts:', error);
        
//         const alertsTableBody = document.querySelector('.alerts-table tbody');
//         if (alertsTableBody) {
//             alertsTableBody.innerHTML = `
//                 <tr>
//                     <td colspan="8" class="text-center">
//                         Error loading alerts. Please try again later.
//                     </td>
//                 </tr>
//             `;
//         }
//     }
// }

// // Function to display alerts in the table
// function displayAlerts(alerts) {
//     const alertsTableBody = document.querySelector('.alerts-table tbody');
    
//     if (!alertsTableBody) {
//         console.error('Alerts table body not found in DOM');
//         return;
//     }
    
//     if (!alerts || alerts.length === 0) {
//         alertsTableBody.innerHTML = `
//             <tr>
//                 <td colspan="8" class="text-center">
//                     No alerts found. You're all caught up!
//                 </td>
//             </tr>
//         `;
//         return;
//     }
    
//     // Sort alerts by date (newest first)
//     alerts.sort((a, b) => new Date(b.Alert_DateTime) - new Date(a.Alert_DateTime));
    
//     let tableContent = '';
    
//     alerts.forEach(alert => {
//         tableContent += `
//             <tr data-alert-id="${alert.Alert_ID}">
//                 <td>#A${alert.Alert_ID}</td>
//                 <td>${alert.Alert_Type}</td>
//                 <td>${alert.Current_Value}</td>
//                 <td>${alert.Normal_Range}</td>
//                 <td>${alert.Alert_DateTime}</td>
//                 <td>
//                     <span class="status-badge ${getStatusClass(alert.Alert_Status)}">
//                         ${alert.Alert_Status}
//                     </span>
//                 </td>
//                 <td>${alert.Task_Assigned}</td>
//                 <td>
//                     <div class="action-buttons">
//                         ${alert.Alert_Status !== 'Resolved' ? 
//                             `<button class="resolve-btn" onclick="resolveAlert(${alert.Alert_ID})">Resolve</button>` : 
//                             `<button class="view-details-btn" onclick="viewAlertDetails(${alert.Alert_ID})">View Details</button>`
//                         }
//                     </div>
//                 </td>
//             </tr>
//         `;
//     });
    
//     alertsTableBody.innerHTML = tableContent;
    
//     // Update pagination if needed
//     updatePagination(alerts.length);
// }

// // Function to determine status class for styling
// function getStatusClass(status) {
//     switch (status) {
//         case 'Critical':
//             return 'status-critical';
//         case 'Resolved':
//             return 'status-resolved';
//         case 'Normal':
//             return 'status-normal';
//         default:
//             return '';
//     }
// }

// // Function to update pagination
// function updatePagination(totalItems) {
//     const paginationContainer = document.querySelector('[data-pagination="alerts"]');
//     if (!paginationContainer) return;
    
//     // Simple pagination logic - adjust as needed based on your requirements
//     const itemsPerPage = 10;
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
    
//     if (totalPages <= 1) {
//         paginationContainer.style.display = 'none';
//         return;
//     }
    
//     paginationContainer.style.display = 'flex';
    
//     let paginationHTML = '';
//     for (let i = 1; i <= Math.min(totalPages, 5); i++) {
//         paginationHTML += `<button class="pagination-btn ${i === 1 ? 'active' : ''}">${i}</button>`;
//     }
    
//     if (totalPages > 5) {
//         paginationHTML += `
//             <button class="pagination-btn next">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
//                     <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" fill="currentColor"/>
//                 </svg>
//             </button>
//         `;
//     }
    
//     paginationContainer.innerHTML = paginationHTML;
    
//     // Add event listeners to pagination buttons
//     document.querySelectorAll('.pagination-btn').forEach(button => {
//         button.addEventListener('click', function() {
//             if (!this.classList.contains('next')) {
//                 document.querySelectorAll('.pagination-btn').forEach(btn => btn.classList.remove('active'));
//                 this.classList.add('active');
//                 // Implement pagination logic here
//                 const page = parseInt(this.textContent);
//                 // loadPageData(page);
//             }
//         });
//     });
// }

// // Function to setup alert search functionality
// function setupAlertSearch() {
//     const searchInput = document.querySelector('.search-box input');
//     if (!searchInput) return;
    
//     searchInput.addEventListener('input', function() {
//         const searchTerm = this.value.toLowerCase();
//         const rows = document.querySelectorAll('.alerts-table tbody tr');
        
//         rows.forEach(row => {
//             const alertType = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
//             const alertStatus = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
//             const alertDateTime = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
            
//             // Check if the search term matches any of the important fields
//             if (alertType.includes(searchTerm) || 
//                 alertStatus.includes(searchTerm) || 
//                 alertDateTime.includes(searchTerm)) {
//                 row.style.display = '';
//             } else {
//                 row.style.display = 'none';
//             }
//         });
//     });
// }

// // Function to resolve an alert
// async function resolveAlert(alertId) {
//     if (!confirm('Are you sure you want to mark this alert as resolved?')) {
//         return;
//     }
    
//     try {
//         const response = await fetch(`/alerts/resolve/${alertId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 response: 'Alert manually resolved by patient'
//             })
//         });
        
//         if (!response.ok) {
//             throw new Error(`Failed to resolve alert: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         if (data.success) {
//             // Update the UI
//             const alertRow = document.querySelector(`[data-alert-id="${alertId}"]`);
//             if (alertRow) {
//                 const statusCell = alertRow.querySelector('td:nth-child(6)');
//                 const actionCell = alertRow.querySelector('td:nth-child(8) .action-buttons');
                
//                 statusCell.innerHTML = '<span class="status-badge status-resolved">Resolved</span>';
//                 actionCell.innerHTML = '<button class="view-details-btn" onclick="viewAlertDetails(' + alertId + ')">View Details</button>';
//             }
            
//             showNotification('Alert has been successfully resolved', 'success');
//         } else {
//             throw new Error(data.message || 'Failed to resolve alert');
//         }
//     } catch (error) {
//         console.error('Error resolving alert:', error);
//         showNotification('Failed to resolve alert. Please try again.', 'error');
//     }
// }

// // Function to view alert details
// function viewAlertDetails(alertId) {
//     // Implement a modal or redirect to a details page
//     alert(`View details for Alert #${alertId}\nThis functionality is not implemented yet.`);
// }

// // Function to show notifications
// function showNotification(message, type = 'info') {
//     // Check if notification container exists, if not create it
//     let notificationContainer = document.querySelector('.notification-container');
    
//     if (!notificationContainer) {
//         notificationContainer = document.createElement('div');
//         notificationContainer.className = 'notification-container';
//         document.body.appendChild(notificationContainer);
//     }
    
//     // Create notification element
//     const notification = document.createElement('div');
//     notification.className = `notification ${type}`;
//     notification.innerHTML = `
//         <div class="notification-content">
//             <span>${message}</span>
//             <button class="notification-close">&times;</button>
//         </div>
//     `;
    
//     // Add notification to container
//     notificationContainer.appendChild(notification);
    
//     // Add event listener to close button
//     notification.querySelector('.notification-close').addEventListener('click', function() {
//         notification.remove();
//     });
    
//     // Auto-remove notification after 5 seconds
//     setTimeout(() => {
//         if (notification.parentNode) {
//             notification.remove();
//         }
//     }, 5000);
// }

// // Export functions for potential use in other modules
// window.resolveAlert = resolveAlert;
// window.viewAlertDetails = viewAlertDetails;