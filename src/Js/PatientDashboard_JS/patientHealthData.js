document.addEventListener('DOMContentLoaded', () => {
    console.log("Patient Health Data Script Loaded");

    // Add this function at the top of your script
    function showNotification(message, type = 'success') {
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        notification.innerHTML = `
        ${message}
        <span class="close-notification">×</span>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Handle close button click
        notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification && notification.parentNode) {
            notification.parentNode.removeChild(notification);
            }
        }, 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.classList.add('fade-out');
            setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            }, 300);
        }
        }, 5000);
    }
    
    // Add this CSS to your stylesheet
    document.head.insertAdjacentHTML('beforeend', `
    <style>
        #notification-container {
        position: fixed;
        top: 20px;
        right: 10px;
        transform: translateX(-10%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        }
        
        .notification {
        padding: 12px 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 80vw;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        animation: slide-in 0.3s ease-out forwards;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .notification.success {
        background-color: #4CAF50;
        color: white;
        }
        
        .notification.error {
        background-color: #f44336;
        color: white;
        }
        
        .notification.warning {
        background-color: #ff9800;
        color: white;
        }
        
        .notification.info {
        background-color: #2196F3;
        color: white;
        }
        
        .close-notification {
        margin-left: 15px;
        color: white;
        font-weight: bold;
        font-size: 20px;
        cursor: pointer;
        }
        
        .fade-out {
        opacity: 0;
        transition: opacity 0.3s ease-out;
        }
        
        @keyframes slide-in {
        from {
            transform: translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
        }
    </style>
    `);

    // Heart Rate Elements
    const heartRateContent = document.querySelector('.content.heart-rate-content');
    const heartRateTableBody = document.querySelector('.heart-rate-table tbody');
    
    // SpO2 Elements
    const oxygenContent = document.querySelector('.content.oxygen-content');
    const oxygenTableBody = document.querySelector('.oxygen-table tbody');
    
    // Body Temperature Elements
    const bodyTempContent = document.querySelector('.content.body-temperature-content');
    const bodyTempTableBody = document.querySelector('.body-temperature-table tbody');

    // Fall Detection Elements
    const fallDetectionContent = document.querySelector('.content.fall-detection-content');
    const fallDetectionTableBody = document.querySelector('.fall-detection-table tbody');

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
            const dateTime = record.displayDateTime || 'N/A';
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

    // SpO2 Data Handling
    const renderSpO2Table = (data) => {
        if (!oxygenTableBody) {
            console.error("SpO2 table body not found!");
            return;
        }
        clearTable(oxygenTableBody);

        if (!data || data.length === 0) {
            oxygenTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No oxygen saturation (SpO₂) data found.</td></tr>';
            return;
        }

        data.forEach(record => {
            const row = document.createElement('tr');
            row.setAttribute('data-record-id', record.SpO2_ID);

            // Format data for display
            const currentSpO2 = record.Current_SpO2 ? `${record.Current_SpO2}%` : 'N/A';
            const averageSpO2 = record.Average_SpO2 ? `${record.Average_SpO2}%` : 'N/A';
            const normalRange = record.Normal_SpO2 || 'N/A';
            const dateTime = record.displayDateTime || 'N/A';
            const status = record.Status || 'N/A';

            const statusClass = `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;

            row.innerHTML = `
                <td>#${record.SpO2_ID}</td>
                <td>${currentSpO2}</td>
                <td>${averageSpO2}</td>
                <td>${normalRange}</td>
                <td>${dateTime}</td>
                <td><span class="${statusClass}">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="delete-btn" data-id="${record.SpO2_ID}">Delete</button>
                    </div>
                </td>
            `;
            oxygenTableBody.appendChild(row);
        });
    };
    
    // Body Temperature Data Handling
    const renderBodyTemperatureTable = (data) => {
        if (!bodyTempTableBody) {
            console.error("Body temperature table body not found!");
            return;
        }
        clearTable(bodyTempTableBody);

        if (!data || data.length === 0) {
            bodyTempTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No body temperature data found.</td></tr>';
            return;
        }

        data.forEach(record => {
            const row = document.createElement('tr');
            row.setAttribute('data-record-id', record.Temperature_ID);

            // Format data for display
            // Convert Celsius to Fahrenheit for display
            const celsiusTemp = record.Current_Temperature || 0;
            const fahrenheitTemp = (celsiusTemp * 9/5) + 32;
            
            const currentTemp = record.Current_Temperature ? 
                `${record.Current_Temperature}°C (${fahrenheitTemp.toFixed(1)}°F)` : 'N/A';
            
            const avgCelsiusTemp = record.Average_Temperature || 0;
            const avgFahrenheitTemp = (avgCelsiusTemp * 9/5) + 32;
            
            const averageTemp = record.Average_Temperature ? 
                `${record.Average_Temperature}°C (${avgFahrenheitTemp.toFixed(1)}°F)` : 'N/A';
            
            const normalRange = record.Normal_Temperature || 'N/A';
            const dateTime = record.displayDateTime || 'N/A';
            const status = record.Status || 'N/A';

            const statusClass = `status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}`;

            row.innerHTML = `
                <td>#${record.Temperature_ID}</td>
                <td>${currentTemp}</td>
                <td>${averageTemp}</td>
                <td>${normalRange}</td>
                <td>${dateTime}</td>
                <td><span class="${statusClass}">${status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="delete-btn" data-id="${record.Temperature_ID}">Delete</button>
                    </div>
                </td>
            `;
            bodyTempTableBody.appendChild(row);
        });
    };

    // Fall Detection Data Handling
    const renderFallDetectionTable = (data) => {
        if (!fallDetectionTableBody) {
            console.error("Fall detection table body not found!");
            return;
        }
        clearTable(fallDetectionTableBody);

        if (!data || data.length === 0) {
            fallDetectionTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No fall detection data found.</td></tr>';
            return;
        }

        data.forEach(record => {
            const row = document.createElement('tr');
            row.setAttribute('data-record-id', record.Fall_ID);

            // Format data for display
            const fallDetected = record.Fall_Detected || 'N/A';
            const fallDirection = record.Fall_Direction || 'N/A';
            const dateTime = record.displayDateTime || 'N/A';

            row.innerHTML = `
                <td>#${record.Fall_ID}</td>
                <td>${fallDetected}</td>
                <td>${fallDirection}</td>
                <td>${dateTime}</td>
                <td>
                    <div class="action-buttons">
                        <button class="delete-btn" data-id="${record.Fall_ID}">Delete</button>
                    </div>
                </td>
            `;
            fallDetectionTableBody.appendChild(row);
        });
    };

    // Fetch heartRate data functions
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

    // fetch SpO2 data functions
    const fetchSpO2Data = async () => {
        if (!oxygenTableBody) return;
        console.log("Fetching SpO2 data...");
        showLoading(oxygenTableBody);
    
        try {
            console.log("Making request to /health/spo2");
            const response = await fetch('/health/spo2');
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
                    errorMsg = "SpO2 API endpoint not found. Please check server configuration.";
                }
                throw new Error(errorMsg);
            }
    
            const data = await response.json();
            console.log("SpO2 data received:", data);
            renderSpO2Table(data);
    
        } catch (error) {
            console.error('Failed to fetch SpO2 data:', error);
            showError(oxygenTableBody, error.message || 'Could not load oxygen saturation data.');
        }
    };
    
    // Fetch body temperature data functions
    const fetchBodyTemperatureData = async () => {
        if (!bodyTempTableBody) return;
        console.log("Fetching body temperature data...");
        showLoading(bodyTempTableBody);
    
        try {
            console.log("Making request to /health/body-temperature");
            const response = await fetch('/health/body-temperature');
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
                    errorMsg = "Body temperature API endpoint not found. Please check server configuration.";
                }
                throw new Error(errorMsg);
            }
    
            const data = await response.json();
            console.log("Body temperature data received:", data);
            renderBodyTemperatureTable(data);
    
        } catch (error) {
            console.error('Failed to fetch body temperature data:', error);
            showError(bodyTempTableBody, error.message || 'Could not load body temperature data.');
        }
    };

    // Fetch fall detection data functions
    const fetchFallDetectionData = async () => {
        if (!fallDetectionTableBody) return;
        console.log("Fetching fall detection data...");
        showLoading(fallDetectionTableBody);

        try {
            console.log("Making request to /health/fall-detection");
            const response = await fetch('/health/fall-detection');
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
                    errorMsg = "Fall detection API endpoint not found. Please check server configuration.";
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            console.log("Fall detection data received:", data);
            renderFallDetectionTable(data);

        } catch (error) {
            console.error('Failed to fetch fall detection data:', error);
            showError(fallDetectionTableBody, error.message || 'Could not load fall detection data.');
        }
    };

    // Heart Rate Delete Handler
    const handleDeleteHeartRate = (recordId) => {
        if (!recordId) {
            console.error("No record ID provided for deletion");
            return;
        }

        const modal = document.getElementById('HeartRateDeleteConfirmModal');
        const confirmText = document.getElementById('HeartRateDeleteConfirmText');
        const confirmBtn = document.getElementById('confirmHeartRateDeleteBtn');
        const cancelBtn = document.getElementById('cancelHeartRateDeleteBtn');

        confirmText.textContent = `Are you sure you want to delete heart rate record #${recordId}?`;
        modal.style.display = 'flex';

        // Remove previous event listeners to avoid duplicates
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        // Add new event listeners
        newConfirmBtn.addEventListener('click', async () => {
            modal.style.display = 'none';
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

                console.log(`Record ${recordId} deleted successfully.`);
                showNotification(`Record #${recordId} deleted successfully.`);

                const rowToRemove = heartRateTableBody.querySelector(`tr[data-record-id="${recordId}"]`);
                if (rowToRemove) {
                    rowToRemove.remove();
                    if (heartRateTableBody.rows.length === 0) {
                        heartRateTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No heart rate data found.</td></tr>';
                    }
                } else {
                    fetchHeartRateData();
                }
            } catch (error) {
                console.error('Failed to delete heart rate record:', error);
                showNotification(`Error deleting record: ${error.message || 'Could not delete record.'}`, 'error');
            }
        });

        newCancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    };

    // SpO2 Delete Handler
    const handleDeleteSpO2 = (recordId) => {
        if (!recordId) {
            console.error("No record ID provided for deletion");
            return;
        }

        const modal = document.getElementById('SpO2DeleteConfirmModal');
        const confirmText = document.getElementById('SpO2DeleteConfirmText');
        const confirmBtn = document.getElementById('confirmSpO2DeleteBtn');
        const cancelBtn = document.getElementById('cancelSpO2DeleteBtn');

        confirmText.textContent = `Are you sure you want to delete SpO₂ record #${recordId}?`;
        modal.style.display = 'flex';

        // Remove previous event listeners to avoid duplicates
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        // Add new event listeners
        newConfirmBtn.addEventListener('click', async () => {
            modal.style.display = 'none';
            console.log(`Attempting to delete SpO₂ record: ${recordId}`);

            try {
                const response = await fetch(`/health/spo2/${recordId}`, {
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

                console.log(`Record ${recordId} deleted successfully.`);
                showNotification(`Record #${recordId} deleted successfully.`);

                const rowToRemove = oxygenTableBody.querySelector(`tr[data-record-id="${recordId}"]`);
                if (rowToRemove) {
                    rowToRemove.remove();
                    if (oxygenTableBody.rows.length === 0) {
                        oxygenTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No oxygen saturation data found.</td></tr>';
                    }
                } else {
                    fetchSpO2Data();
                }
            } catch (error) {
                console.error('Failed to delete SpO₂ record:', error);
                showNotification(`Error deleting record: ${error.message || 'Could not delete record.'}`, 'error');
            }
        });

        newCancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    };

    // Body Temperature Delete Handler
    const handleDeleteBodyTemperature = (recordId) => {
        if (!recordId) {
            console.error("No record ID provided for deletion");
            return;
        }

        const modal = document.getElementById('BodyTempDeleteConfirmModal');
        const confirmText = document.getElementById('BodyTempDeleteConfirmText');
        const confirmBtn = document.getElementById('confirmBodyTempDeleteBtn');
        const cancelBtn = document.getElementById('cancelBodyTempDeleteBtn');

        confirmText.textContent = `Are you sure you want to delete body temperature record #${recordId}?`;
        modal.style.display = 'flex';

        // Remove previous event listeners to avoid duplicates
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        // Add new event listeners
        newConfirmBtn.addEventListener('click', async () => {
            modal.style.display = 'none';
            console.log(`Attempting to delete body temperature record: ${recordId}`);

            try {
                const response = await fetch(`/health/body-temperature/${recordId}`, {
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

                console.log(`Record ${recordId} deleted successfully.`);
                showNotification(`Record #${recordId} deleted successfully.`);

                const rowToRemove = bodyTempTableBody.querySelector(`tr[data-record-id="${recordId}"]`);
                if (rowToRemove) {
                    rowToRemove.remove();
                    if (bodyTempTableBody.rows.length === 0) {
                        bodyTempTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No body temperature data found.</td></tr>';
                    }
                } else {
                    fetchBodyTemperatureData();
                }
            } catch (error) {
                console.error('Failed to delete body temperature record:', error);
                showNotification(`Error deleting record: ${error.message || 'Could not delete record.'}`, 'error');
            }
        });

        newCancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    };

    // Fall Detection Delete Handler
    const handleDeleteFallDetection = (recordId) => {
        if (!recordId) {
            console.error("No record ID provided for deletion");
            return;
        }

        const modal = document.getElementById('FallDetectionDeleteConfirmModal');
        const confirmText = document.getElementById('FallDetectionDeleteConfirmText');
        const confirmBtn = document.getElementById('confirmFallDetectionDeleteBtn');
        const cancelBtn = document.getElementById('cancelFallDetectionDeleteBtn');

        confirmText.textContent = `Are you sure you want to delete fall detection record #${recordId}?`;
        modal.style.display = 'flex';

        // Remove previous event listeners to avoid duplicates
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        // Add new event listeners
        newConfirmBtn.addEventListener('click', async () => {
            modal.style.display = 'none';
            console.log(`Attempting to delete fall detection record: ${recordId}`);

            try {
                const response = await fetch(`/health/fall-detection/${recordId}`, {
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

                console.log(`Record ${recordId} deleted successfully.`);
                showNotification(`Record #${recordId} deleted successfully.`);

                const rowToRemove = fallDetectionTableBody.querySelector(`tr[data-record-id="${recordId}"]`);
                if (rowToRemove) {
                    rowToRemove.remove();
                    if (fallDetectionTableBody.rows.length === 0) {
                        fallDetectionTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No fall detection data found.</td></tr>';
                    }
                } else {
                    fetchFallDetectionData();
                }
            } catch (error) {
                console.error('Failed to delete fall detection record:', error);
                showNotification(`Error deleting record: ${error.message || 'Could not delete record.'}`, 'error');
            }
        });

        newCancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    };

    // Set up observers to load data when content becomes visible
    // Heart Rate Observer
    if (heartRateContent && heartRateTableBody) {
        const heartRateObserver = new MutationObserver((mutationsList) => {
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

        heartRateObserver.observe(heartRateContent, { attributes: true });

        // Also consider an initial fetch if it might be visible on load
        if (heartRateContent.style.display !== 'none') {
            fetchHeartRateData();
        }
    } else {
        console.warn("Heart rate content or table body not found. Data fetching/rendering disabled.");
    }

    // SpO2 Observer
    if (oxygenContent && oxygenTableBody) {
        const oxygenObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // Check if the content is now displayed
                    const isDisplayed = oxygenContent.style.display !== 'none';
                    if (isDisplayed && oxygenTableBody.rows.length <= 1) {
                       console.log("SpO2 content visible, fetching data...");
                       fetchSpO2Data();
                    }
                }
            }
        });

        oxygenObserver.observe(oxygenContent, { attributes: true });

        // Also consider an initial fetch if it might be visible on load
        if (oxygenContent.style.display !== 'none') {
            fetchSpO2Data();
        }
    } else {
        console.warn("SpO2 content or table body not found. Data fetching/rendering disabled.");
    }
    
    // Body Temperature Observer
    if (bodyTempContent && bodyTempTableBody) {
        const bodyTempObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // Check if the content is now displayed
                    const isDisplayed = bodyTempContent.style.display !== 'none';
                    if (isDisplayed && bodyTempTableBody.rows.length <= 1) {
                       console.log("Body Temperature content visible, fetching data...");
                       fetchBodyTemperatureData();
                    }
                }
            }
        });

        bodyTempObserver.observe(bodyTempContent, { attributes: true });

        // Also consider an initial fetch if it might be visible on load
        if (bodyTempContent.style.display !== 'none') {
            fetchBodyTemperatureData();
        }
    } else {
        console.warn("Body temperature content or table body not found. Data fetching/rendering disabled.");
    }

    // Fall Detection Observer
    if (fallDetectionContent && fallDetectionTableBody) {
        const fallDetectionObserver = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    // Check if the content is now displayed
                    const isDisplayed = fallDetectionContent.style.display !== 'none';
                    if (isDisplayed && fallDetectionTableBody.rows.length <= 1) {
                    console.log("Fall Detection content visible, fetching data...");
                    fetchFallDetectionData();
                    }
                }
            }
        });

        fallDetectionObserver.observe(fallDetectionContent, { attributes: true });

        // Also consider an initial fetch if it might be visible on load
        if (fallDetectionContent.style.display !== 'none') {
            fetchFallDetectionData();
        }
    } else {
        console.warn("Fall detection content or table body not found. Data fetching/rendering disabled.");
    }

    // Event delegation for delete buttons
    // Heart Rate delete buttons
    if (heartRateTableBody) {
        heartRateTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const recordId = event.target.getAttribute('data-id');
                handleDeleteHeartRate(recordId);
            }
        });
    }

    // SpO2 delete buttons
    if (oxygenTableBody) {
        oxygenTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const recordId = event.target.getAttribute('data-id');
                handleDeleteSpO2(recordId);
            }
        });
    }
    
    // Body Temperature delete buttons
    if (bodyTempTableBody) {
        bodyTempTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const recordId = event.target.getAttribute('data-id');
                handleDeleteBodyTemperature(recordId);
            }
        });
    }

    // Fall Detection delete buttons
    if (fallDetectionTableBody) {
        fallDetectionTableBody.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-btn')) {
                const recordId = event.target.getAttribute('data-id');
                handleDeleteFallDetection(recordId);
            }
        });
    }
});