document.addEventListener('DOMContentLoaded', () => {
    console.log("Patient Health Data Script Loaded");

    const heartRateContent = document.querySelector('.content.heart-rate-content');
    const heartRateTableBody = document.querySelector('.heart-rate-table tbody');
    const heartRateNavLink = document.querySelector('.sidebar-link[data-target="heart-rate"]');

    // --- Helper Functions ---
    const showLoading = (tbody) => {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Loading data...</td></tr>';
    };

    const showError = (tbody, message) => {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: red;">${message}</td></tr>`;
    };

    const clearTable = (tbody) => {
        tbody.innerHTML = '';
    };

    // Heart Rate Data Handling 
    const renderHeartRateTable = (data) => {
        if (!heartRateTableBody) {
            console.error("Heart rate table body not found!");
            return;
        }
        clearTable(heartRateTableBody);

        if (!data || data.length === 0) {
            heartRateTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No heart rate data found.</td></tr>';
            return;
        }

        data.forEach(record => {
            const row = document.createElement('tr');
            row.setAttribute('data-record-id', record.Heart_Rate_ID);

            // Format data for display
            const currentRate = record.Current_Heart_Rate ? `${record.Current_Heart_Rate} BPM` : 'N/A';
            const averageRate = record.Average_Heart_Rate ? `${record.Average_Heart_Rate} BPM` : 'N/A';
            const normalRange = record.Normal_Heart_Rate || 'N/A';
            const dateTime = record.Date_Time || 'N/A';
            const status = record.Status || 'N/A';

            const statusClass = `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;

            row.innerHTML = `
                <td>#${record.Heart_Rate_ID}</td>
                <td>${currentRate}</td>
                <td>${averageRate}</td>
                <td>${normalRange}</td>
                <td>${dateTime}</td>
                <td><span class="${statusClass}">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="delete-btn" data-id="${record.Heart_Rate_ID}">Delete</button>
                    </div>
                </td>
            `;
            heartRateTableBody.appendChild(row);
        });
    };

    const fetchHeartRateData = async () => {
        if (!heartRateTableBody) return;
        console.log("Fetching heart rate data...");
        showLoading(heartRateTableBody);
    
        try {
            console.log("Making request to /health/heart-rate");
            const response = await fetch('/health/heart-rate');
            console.log("Response status:", response.status);
    
            if (!response.ok) {
                let errorMsg = `Error: ${response.status} ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                    console.error("Error details:", errorData);
                } catch (e) { 
                    console.error("Failed to parse error response:", e);
                }
    
                if (response.status === 401) {
                    errorMsg = "Session expired or not logged in. Please log in again.";
                } else if (response.status === 404) {
                    errorMsg = "Heart rate API endpoint not found. Please check server configuration.";
                }
                throw new Error(errorMsg);
            }
    
            const data = await response.json();
            console.log("Heart rate data received:", data);
            renderHeartRateTable(data);
    
        } catch (error) {
            console.error('Failed to fetch heart rate data:', error);
            showError(heartRateTableBody, error.message || 'Could not load heart rate data.');
        }
    };

    const handleDeleteHeartRate = async (recordId) => {
        if (!recordId) {
            console.error("No record ID provided for deletion");
            return;
        }

        if (!confirm(`Are you sure you want to delete heart rate record #${recordId}?`)) {
            return;
        }

        console.log(`Attempting to delete heart rate record: ${recordId}`);

        try {
            const response = await fetch(`/health/heart-rate/${recordId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                let errorMsg = `Error: ${response.status} ${response.statusText}`;
                 try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) { /* Ignore parsing error */ }
                throw new Error(errorMsg);
            }

            // Deletion successful on the server
            console.log(`Record ${recordId} deleted successfully.`);
            alert(`Record #${recordId} deleted successfully.`);

            // Remove the row from the table
            const rowToRemove = heartRateTableBody.querySelector(`tr[data-record-id="${recordId}"]`);
            if (rowToRemove) {
                rowToRemove.remove();
                if (heartRateTableBody.rows.length === 0) {
                    heartRateTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No heart rate data found.</td></tr>';
                }
            } else {e
                fetchHeartRateData();
            }


        } catch (error) {
            console.error('Failed to delete heart rate record:', error);
            alert(`Error deleting record: ${error.message || 'Could not delete record.'}`);
        }
    };

    // Event Listeners
    if (heartRateContent && heartRateTableBody) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // Check if the content is now displayed
                    const isDisplayed = heartRateContent.style.display !== 'none';
                    if (isDisplayed && heartRateTableBody.rows.length <= 1) {
                       console.log("Heart Rate content visible, fetching data...");
                       fetchHeartRateData();
                    }
                }
            }
        });

        observer.observe(heartRateContent, { attributes: true });

        // Also consider an initial fetch if it might be visible on load
        if (heartRateContent.style.display !== 'none') {
            fetchHeartRateData();
        }
    } else {
        console.warn("Heart rate content or table body not found. Data fetching/rendering disabled.");
    }

    // 2. Handle clicks on delete buttons using event delegation
    if (heartRateTableBody) {
        heartRateTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const recordId = event.target.getAttribute('data-id');
                handleDeleteHeartRate(recordId);
            }
        });
    }
}); 