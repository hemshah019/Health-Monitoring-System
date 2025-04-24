// Define these functions globally so they can be called from anywhere
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

// Global fetch functions that can be accessed from anywhere
function fetchAndDisplayMessages() {
    const messageTableBody = document.querySelector('.messages-table tbody');
    const noMessagesPlaceholder = document.querySelector('.no-messages');

    if (!messageTableBody) {
        console.warn("Message table body not found. Skipping fetch.");
        return;
    }
     if (!noMessagesPlaceholder) {
        console.warn("No messages placeholder not found.");
    }


    messageTableBody.innerHTML = '<tr><td colspan="6">Loading messages...</td></tr>';
    if (noMessagesPlaceholder) noMessagesPlaceholder.style.display = 'none';

    fetch('/messages')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(messages => {
            messageTableBody.innerHTML = '';

            if (messages.length === 0) {
                if (noMessagesPlaceholder) noMessagesPlaceholder.style.display = 'block';
            } else {
                 if (noMessagesPlaceholder) noMessagesPlaceholder.style.display = 'none';
                messages.forEach(msg => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-message-id', msg.Message_ID);
                    row.innerHTML = `
                        <td>#M${msg.Message_ID}</td>
                        <td>${msg.Message_Type || 'N/A'}</td>
                        <td>${msg.Message_Content ? (msg.Message_Content.length > 50 ? msg.Message_Content.substring(0, 50) + '...' : msg.Message_Content) : 'N/A'}</td>
                        <td>${msg.Message_Sent_DateTime || 'N/A'}</td>
                        <td><span class="status-badge status-${msg.Status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}">${msg.Status || 'N/A'}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="view-btn message-view-btn" data-id="${msg.Message_ID}">View</button>
                                <button class="delete-btn message-delete-btn" data-id="${msg.Message_ID}">Delete</button>
                            </div>
                        </td>
                    `;
                    messageTableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
            messageTableBody.innerHTML = `<tr><td colspan="6" class="error-message">Could not load messages. Please try again later.</td></tr>`;
            if (noMessagesPlaceholder) noMessagesPlaceholder.style.display = 'none';
        });
}

function fetchAndDisplayCompliance() {
    const complianceTableBody = document.querySelector('.compliance-table tbody');
    const noCompliancePlaceholder = document.querySelector('.no-compliances');

    if (!complianceTableBody) {
        console.warn("Compliance table body not found. Skipping fetch.");
        return;
    }
    if (!noCompliancePlaceholder) {
        console.warn("No compliance placeholder not found.");
    }

    complianceTableBody.innerHTML = '<tr><td colspan="6">Loading compliance records...</td></tr>';
    if (noCompliancePlaceholder) noCompliancePlaceholder.style.display = 'none';

    fetch('/compliances')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(complianceRecords => {
            complianceTableBody.innerHTML = '';

            if (complianceRecords.length === 0) {
                if (noCompliancePlaceholder) noCompliancePlaceholder.style.display = 'block';
            } else {
                if (noCompliancePlaceholder) noCompliancePlaceholder.style.display = 'none';
                complianceRecords.forEach(record => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-compliance-id', record.Compliance_ID);
                    row.innerHTML = `
                        <td>#C${record.Compliance_ID}</td>
                        <td>${record.Compliance_Type || 'N/A'}</td>
                        <td>${record.Compliance_Notes ? (record.Compliance_Notes.length > 50 ? record.Compliance_Notes.substring(0, 50) + '...' : record.Compliance_Notes) : 'N/A'}</td>
                        <td>${record.Compliance_Date || 'N/A'}</td>
                        <td><span class="status-badge status-${record.Status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}">${record.Status || 'N/A'}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="view-btn compliance-view-btn" data-id="${record.Compliance_ID}">View</button>
                                <button class="delete-btn compliance-delete-btn" data-id="${record.Compliance_ID}">Delete</button>
                            </div>
                        </td>
                    `;
                    complianceTableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching compliance records:', error);
            complianceTableBody.innerHTML = `<tr><td colspan="6" class="error-message">Could not load compliance records. Please try again later.</td></tr>`;
            if (noCompliancePlaceholder) noCompliancePlaceholder.style.display = 'none';
        });
}

function fetchAndDisplayImprovements() {
    const improvementTableBody = document.querySelector('.improvement-table tbody');
    const noImprovementPlaceholder = document.querySelector('.no-improvements');

    if (!improvementTableBody) {
        console.warn("Improvement table body not found. Skipping fetch.");
        return;
    }
     if (!noImprovementPlaceholder) {
        console.warn("No improvement placeholder not found.");
    }


    improvementTableBody.innerHTML = '<tr><td colspan="6">Loading improvement records...</td></tr>';
    if (noImprovementPlaceholder) noImprovementPlaceholder.style.display = 'none';

    fetch('/improvements')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(improvements => {
            improvementTableBody.innerHTML = '';

            if (improvements.length === 0) {
                if (noImprovementPlaceholder) noImprovementPlaceholder.style.display = 'block';
            } else {
                 if (noImprovementPlaceholder) noImprovementPlaceholder.style.display = 'none';
                improvements.forEach(imp => {
                    const row = document.createElement('tr');
                    row.setAttribute('data-improvement-id', imp.Improvement_ID);
                    row.innerHTML = `
                        <td>#I${imp.Improvement_ID}</td>
                        <td>${imp.Category || 'N/A'}</td>
                        <td>${imp.Suggestion_Description ? (imp.Suggestion_Description.length > 50 ? imp.Suggestion_Description.substring(0, 50) + '...' : imp.Suggestion_Description) : 'N/A'}</td>
                        <td>${imp.Date_Submitted || 'N/A'}</td>
                        <td><span class="status-badge status-${imp.Status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'}">${imp.Status || 'N/A'}</span></td>
                        <td>
                            <div class="action-buttons">
                                <button class="view-btn improvement-view-btn" data-id="${imp.Improvement_ID}">View</button>
                                <button class="delete-btn improvement-delete-btn" data-id="${imp.Improvement_ID}">Delete</button>
                            </div>
                        </td>
                    `;
                    improvementTableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching improvements:', error);
            improvementTableBody.innerHTML = `<tr><td colspan="6" class="error-message">Could not load improvements. Please try again later.</td></tr>`;
            if (noImprovementPlaceholder) noImprovementPlaceholder.style.display = 'none';
        });
}

// Task Functions
function fetchAndDisplayTasks() {
    const taskTableBody = document.querySelector('.tasks-table tbody');
    const noTasksPlaceholder = document.querySelector('.no-tasks');

    if (!taskTableBody) {
        console.warn("Task table body not found.");
        return;
    }

    taskTableBody.innerHTML = '<tr><td colspan="7">Loading tasks...</td></tr>';
    if (noTasksPlaceholder) noTasksPlaceholder.style.display = 'none';

    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            taskTableBody.innerHTML = '';
            if (tasks.length === 0) {
                if (noTasksPlaceholder) noTasksPlaceholder.style.display = 'block';
            } else {
                if (noTasksPlaceholder) noTasksPlaceholder.style.display = 'none';
                tasks.forEach(task => {
                    const alertType = task.alertDetails?.Alert_Type || 'N/A';
                    const alertDateTime = task.alertDetails?.displayDateTime || 'N/A';
                
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>#T${task.Task_ID}</td>
                        <td>${alertType}</td>
                        <td>${task.Task_Name || 'N/A'}</td>
                        <td>${task.Task_Priority || 'N/A'}</td>
                        <td>${alertDateTime}</td>
                        <td>${task.Completion_Time || 'N/A'}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="view-btn task-view-btn" data-id="${task.Task_ID}">View</button>
                                <button class="delete-btn task-delete-btn" data-id="${task.Task_ID}">Delete</button>
                            </div>
                        </td>
                    `;
                    taskTableBody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching tasks:', error);
            taskTableBody.innerHTML = `<tr><td colspan="7">Could not load tasks. Please try again later.</td></tr>`;
        });
}


function getCurrentDateTime() {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
    }
}

function openModal(modal) {
    if (modal) {
        modal.classList.add('active');
    }
}

// Add notification styles and DOMContentLoaded logic
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('notification-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
            #notification-container {
                position: fixed;
                top: 20px;
                right: 10px;
                /* transform: translateX(-10%); Removed as it pushes container off-screen slightly */
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                align-items: flex-end; /* Align items to the right */
            }

            .notification {
                padding: 12px 20px;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 250px; /* Adjusted min-width */
                max-width: 80vw;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                animation: slide-in 0.3s ease-out forwards;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                font-size: 14px;
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
                line-height: 1; /* Ensure 'x' aligns better */
            }

            .fade-out {
                opacity: 0;
                transition: opacity 0.3s ease-out;
            }

            @keyframes slide-in {
                from {
                    transform: translateX(100%); /* Slide in from the right */
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            /* Styling for deleting state */
            tr.deleting {
                opacity: 0.5;
                pointer-events: none;
                background-color: #ffebee; /* Light red background */
            }
            tr.deleting td {
                text-decoration: line-through;
            }
            /* Style for status badges */
            .status-badge {
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 0.8em;
                font-weight: 500;
                text-transform: capitalize;
                color: #fff;
            }

            .status-pending { background-color: #ff9800; } /* Orange */
            .status-submitted { background-color: #ff9800; } /* Orange */
            .status-received { background-color: #2196f3; } /* Blue */
            .status-under-review { background-color: #9c27b0; } /* Purple */
            .status-action-required { background-color: #f44336; } /* Red */
            .status-addressed { background-color: #4caf50; } /* Green */
            .status-completed { background-color: #4caf50; } /* Green */
            .status-implemented { background-color: #4caf50; } /* Green */
            .status-closed { background-color: #607d8b; } /* Grey */
            .status-rejected { background-color: #f44336; } /* Red */
            .status-unknown { background-color: #9e9e9e; } /* Grey */
            .status-n-a { background-color: #9e9e9e; } /* Grey */
        `;
        document.head.appendChild(styleSheet);
    }


    // Add New Item Popups
    const addMessageBtn = document.querySelector('.messages-actions .add-new-btn');
    const addComplianceBtn = document.querySelector('.compliance-actions .add-new-btn');
    const addImprovementBtn = document.querySelector('.improvement-actions .add-new-btn');
    const messagePopup = document.getElementById('newMessagePopup');
    const compliancePopup = document.getElementById('newCompliancePopup');
    const improvementPopup = document.getElementById('newImprovementPopup');

    const closeButtons = document.querySelectorAll('.close-btn, .cancel-btn[data-dismiss="popup"]');

    if (addMessageBtn && messagePopup) {
        addMessageBtn.addEventListener('click', function () {
            openModal(messagePopup);
            const dateInput = document.getElementById('messageDate');
            if (dateInput) dateInput.value = getCurrentDateTime();
        });
    }

    if (addComplianceBtn && compliancePopup) {
        addComplianceBtn.addEventListener('click', function () {
            openModal(compliancePopup);
            const dateInput = document.getElementById('complianceDate');
             if (dateInput) dateInput.value = getCurrentDateTime();
        });
    }

    if (addImprovementBtn && improvementPopup) {
        addImprovementBtn.addEventListener('click', function () {
            openModal(improvementPopup);
             const dateInput = document.getElementById('improvementDate');
             if (dateInput) dateInput.value = getCurrentDateTime();
        });
    }

    // Generic close handlers for all popups
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const popup = this.closest('.popup-overlay');
            if(popup) closeModal(popup);
        });
    });

    document.querySelectorAll('.popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });

    // Form Submissions
    // Message Submit
    const submitMessageBtn = document.getElementById('submitMessage');
    const messageForm = document.getElementById('newMessageForm');
    if (submitMessageBtn && messageForm) {
        submitMessageBtn.addEventListener('click', async function (e) {
            e.preventDefault();

            const messageType = document.getElementById('messageType')?.value;
            const messageContent = document.getElementById('messageContent')?.value;
            const messageDate = document.getElementById('messageDate')?.value;

            if (!messageType || !messageContent || messageContent.length < 10 || !messageDate) {
                showNotification("Please fill in all fields properly. Content needs minimum 10 characters.", "error");
                return;
            }

            submitMessageBtn.disabled = true;
            submitMessageBtn.textContent = 'Submitting...';

            try {
                const response = await fetch('/submit-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messageType, messageContent, messageDate })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification("Message submitted successfully!", "success");
                    messageForm.reset();
                    closeModal(messagePopup);
                    fetchAndDisplayMessages();
                } else {
                    showNotification("Failed to submit message: " + (result.message || 'Unknown error'), "error");
                }

            } catch (error) {
                console.error('Error submitting message:', error);
                showNotification("Network error or server issue. Please try again later.", "error");
            } finally {
                 submitMessageBtn.disabled = false;
                 submitMessageBtn.textContent = 'Submit Message';
            }
        });
    } else {
        console.warn('Message submission button or form not found.');
    }

    // Submit Compliance
    const submitComplianceBtn = document.getElementById('submitCompliance');
    const complianceForm = document.getElementById('newComplianceForm');
    if (submitComplianceBtn && complianceForm) {
        submitComplianceBtn.addEventListener('click', async function (e) {
            e.preventDefault();

            const complianceType = document.getElementById('complianceType')?.value;
            const complianceNotes = document.getElementById('complianceNotes')?.value;
            const complianceDate = document.getElementById('complianceDate')?.value;

            if (!complianceType || !complianceNotes || complianceNotes.length < 10 || !complianceDate) {
                showNotification("Please fill in all fields properly. Notes need minimum 10 characters.", "error");
                return;
            }

            submitComplianceBtn.disabled = true;
            submitComplianceBtn.textContent = 'Submitting...';

            try {
                const response = await fetch('/submit-compliance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ complianceType, complianceNotes, complianceDate })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification("Compliance submitted successfully!", "success");
                    complianceForm.reset();
                    closeModal(compliancePopup);
                    fetchAndDisplayCompliance();
                } else {
                    showNotification("Failed to submit compliance: " + (result.message || 'Unknown error'), "error");
                }

            } catch (error) {
                console.error('Error submitting compliance:', error);
                showNotification("Network error or server issue. Please try again later.", "error");
            } finally {
                submitComplianceBtn.disabled = false;
                submitComplianceBtn.textContent = 'Submit Compliance';
            }
        });
    } else {
         console.warn('Compliance submission button or form not found.');
    }

    // Submit Improvement
    const submitImprovementBtn = document.getElementById('submitImprovement');
    const improvementForm = document.getElementById('newImprovementForm');
    if (submitImprovementBtn && improvementForm) {
        submitImprovementBtn.addEventListener('click', async function (e) {
            e.preventDefault();

            const improvementCategory = document.getElementById('improvementCategory')?.value.trim();
            const improvementDescription = document.getElementById('improvementDescription')?.value.trim();
            const improvementDate = document.getElementById('improvementDate')?.value;

            if (!improvementCategory || !improvementDescription || improvementDescription.length < 10 || !improvementDate) {
                showNotification("Please fill in all fields properly. Description needs minimum 10 characters.", "error");
                return;
            }

            submitImprovementBtn.disabled = true;
            submitImprovementBtn.textContent = 'Submitting...';

            try {
                const response = await fetch('/submit-improvement', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ improvementCategory, improvementDescription, improvementDate })
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification("Improvement submitted successfully!", "success");
                    improvementForm.reset();
                    closeModal(improvementPopup);
                    fetchAndDisplayImprovements();
                } else {
                    showNotification("Failed to submit improvement: " + (result.message || 'Unknown error'), "error");
                }

            } catch (error) {
                console.error('Error submitting improvement:', error);
                showNotification("Network error or server issue. Please try again later.", "error");
            } finally {
                 submitImprovementBtn.disabled = false;
                 submitImprovementBtn.textContent = 'Submit Improvement';
            }
        });
    } else {
         console.warn('Improvement submission button or form not found.');
    }

    // View and Delete Logic

    // MESSAGE SPECIFIC VIEW/DELETE
    const messageContentArea = document.querySelector('.content.messages-content');
    const messageTableBody = messageContentArea?.querySelector('.messages-table tbody');
    const messageModal = document.getElementById('messageViewModal');
    const closeMessageModalHeaderBtn = document.getElementById('closeMessageModal');
    const closeMessageModalFooterBtn = document.getElementById('closeMessageModalBtn');
    const noMessagesPlaceholder = messageContentArea?.querySelector('.no-messages');

    // Custom delete confirmation modal elements
    const messageDeleteConfirmModal = document.getElementById('MessageDeleteConfirmModal');
    const confirmMessageDeleteBtn = document.getElementById('confirmMessageDeleteBtn');
    const cancelMessageDeleteBtn = document.getElementById('cancelMessageDeleteBtn');
    const messageDeleteConfirmText = document.getElementById('MessageDeleteConfirmText');
    let messageToDelete = null;
    let deleteButtonElement = null;

    function populateMessageModal(message) {
        if (!messageModal || !message) {
            console.error("Message modal or data missing for population.");
            return;
        }
        const getText = (value) => value || 'N/A';
        const getDateText = (dateValue) => dateValue ? new Date(dateValue).toLocaleString() : 'N/A';

        document.getElementById('message_view_id').textContent = `#M${getText(message.Message_ID)}`;
        document.getElementById('message_view_type').textContent = getText(message.Message_Type);
        document.getElementById('message_view_content').textContent = getText(message.Message_Content);
        document.getElementById('message_view_datetime').textContent = getDateText(message.Message_Sent_DateTime);
        document.getElementById('message_view_status').textContent = getText(message.Status);
        document.getElementById('message_view_response').textContent = getText(message.Admin_Response);
        document.getElementById('message_view_responsedate').textContent = getDateText(message.Response_Date);
    }

    async function deleteMessage(messageId, buttonElement) {
        // Store references to use when the user confirms
        messageToDelete = messageId;
        deleteButtonElement = buttonElement;
        
        messageDeleteConfirmText.textContent = `Are you sure you want to delete message #M${messageId}? This action cannot be undone.`;
        messageDeleteConfirmModal.style.display = 'flex';
    }

    async function performMessageDeletion() {
        if (!messageToDelete || !deleteButtonElement) return;
        
        const messageId = messageToDelete;
        const buttonElement = deleteButtonElement;
        const row = buttonElement.closest('tr');
        
        buttonElement.disabled = true;
        if (row) row.classList.add('deleting');
    
        try {
            const response = await fetch(`/messages/${messageId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
    
            // Check if response is OK, even if it doesn't contain JSON (like a 204 No Content)
            if (!response.ok && response.status !== 204) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }
    
            // If response is OK (200 or 204), assume success or parse JSON if available
            let result = { success: true, message: 'Message deleted successfully.' };
            if (response.status === 200) {
                try {
                    result = await response.json();
                } catch (e) {
                    console.warn("Could not parse JSON response for message deletion, but status was OK.");
                }
            }
    
            if (result.success) {
                console.log(`Message ${messageId} deleted successfully.`);
                if (row) row.remove();
                showNotification(result.message || 'Message deleted.', "success");
    
                // Check if table is empty after deletion
                if (messageTableBody && noMessagesPlaceholder && messageTableBody.children.length === 0) {
                    noMessagesPlaceholder.style.display = 'block';
                }
            } else {
                throw new Error(result.message || 'Deletion failed for an unknown reason.');
            }
        } catch (error) {
            console.error(`Error deleting message ${messageId}:`, error);
            showNotification(`Error: ${error.message || 'Could not delete message. Please try again.'}`, "error");
            buttonElement.disabled = false;
            if (row) row.classList.remove('deleting');
        }
        
        // Reset the stored references
        messageToDelete = null;
        deleteButtonElement = null;
    }

    if (messageTableBody && messageModal) {
        messageTableBody.addEventListener('click', async (event) => {
            const viewButton = event.target.closest('.message-view-btn');
            const deleteButton = event.target.closest('.message-delete-btn');

            if (viewButton) {
                const messageId = viewButton.dataset.id;
                console.log('View message button clicked for ID:', messageId);
                if (!messageId) return;

                viewButton.disabled = true;
                try {
                    const response = await fetch(`/messages/${messageId}`);
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                        throw new Error(errorData.message);
                    }
                    const messageDetails = await response.json();
                    populateMessageModal(messageDetails);
                    openModal(messageModal);
                } catch (error) {
                    console.error('Error fetching message details:', error);
                    showNotification(`Could not load message details: ${error.message}`, "error");
                } finally {
                    viewButton.disabled = false;
                }
            }

            if (deleteButton) {
                const messageId = deleteButton.dataset.id;
                console.log('Delete message button clicked for ID:', messageId);
                if (!messageId) return;
                await deleteMessage(messageId, deleteButton);
            }
        });

        // Close Message modal handlers
        closeMessageModalHeaderBtn?.addEventListener('click', () => closeModal(messageModal));
        closeMessageModalFooterBtn?.addEventListener('click', () => closeModal(messageModal));
        messageModal.addEventListener('click', (e) => {
            if (e.target === messageModal) {
                closeModal(messageModal);
            }
        });

        // Add event listeners for the confirmation modal buttons
        confirmMessageDeleteBtn.addEventListener('click', async () => {
            messageDeleteConfirmModal.style.display = 'none';
            await performMessageDeletion();
        });

        cancelMessageDeleteBtn.addEventListener('click', () => {
            messageDeleteConfirmModal.style.display = 'none';
            messageToDelete = null;
            deleteButtonElement = null;
        });

        // Add a click handler for the modal background to close it
        messageDeleteConfirmModal.addEventListener('click', (e) => {
            if (e.target === messageDeleteConfirmModal) {
                messageDeleteConfirmModal.style.display = 'none';
                messageToDelete = null;
                deleteButtonElement = null;
            }
        });

    } else {
        console.warn('Message table body or view modal not found.');
    }


    // COMPLIANCE SPECIFIC VIEW/DELETE
    const complianceContentArea = document.querySelector('.content.compliance-content');
    const complianceTableBody = complianceContentArea?.querySelector('.compliance-table tbody');
    const complianceModal = document.getElementById('complianceViewModal');
    const closeComplianceModalHeaderBtn = document.getElementById('closeComplianceModal');
    const closeComplianceModalFooterBtn = document.getElementById('closeComplianceModalBtn');
    const noCompliancePlaceholder = complianceContentArea?.querySelector('.no-compliances');

    // Custom delete confirmation modal elements
    const complianceDeleteConfirmModal = document.getElementById('ComplianceDeleteConfirmModal');
    const confirmComplianceDeleteBtn = document.getElementById('confirmComplianceDeleteBtn');
    const cancelComplianceDeleteBtn = document.getElementById('cancelComplianceDeleteBtn');
    const complianceDeleteConfirmText = document.getElementById('ComplianceDeleteConfirmText');
    let complianceToDelete = null;
    let complianceDeleteButton = null;

    function populateComplianceModal(compliance) {
        if (!complianceModal || !compliance) {
            console.error("Compliance modal or data missing for population.");
            return;
        }
        const getText = (value) => value || 'N/A';
        const getDateText = (dateValue) => dateValue ? new Date(dateValue).toLocaleString() : 'N/A';

        document.getElementById('compliance_view_id').textContent = `#C${getText(compliance.Compliance_ID)}`;
        document.getElementById('compliance_view_type').textContent = getText(compliance.Compliance_Type);
        document.getElementById('compliance_view_notes').textContent = getText(compliance.Compliance_Notes);
        document.getElementById('compliance_view_date').textContent = getDateText(compliance.Compliance_Date);
        document.getElementById('compliance_view_status').textContent = getText(compliance.Status);
        document.getElementById('compliance_view_feedback').textContent = getText(compliance.Admin_Feedback);
        document.getElementById('compliance_view_response').textContent = getDateText(compliance.Feedback_Date);
    }

    async function deleteCompliance(complianceId, buttonElement) {
        complianceToDelete = complianceId;
        complianceDeleteButton = buttonElement;

        complianceDeleteConfirmText.textContent = `Are you sure you want to delete compliance record #C${complianceId}? This action cannot be undone.`;
        complianceDeleteConfirmModal.style.display = 'flex';
    }

    async function performComplianceDeletion() {
        if (!complianceToDelete || !complianceDeleteButton) return;

        const complianceId = complianceToDelete;
        const buttonElement = complianceDeleteButton;
        const row = buttonElement.closest('tr');

        buttonElement.disabled = true;
        if (row) row.classList.add('deleting');

        try {
            const response = await fetch(`/compliances/${complianceId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok && response.status !== 204) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }

            let result = { success: true, message: 'Compliance record deleted successfully.' };
            if (response.status === 200) {
                try {
                    result = await response.json();
                } catch (e) {
                    console.warn("Could not parse JSON response for compliance deletion.");
                }
            }

            if (result.success) {
                console.log(`Compliance ${complianceId} deleted successfully.`);
                if (row) row.remove();
                showNotification(result.message || 'Compliance record deleted.', "success");

                if (complianceTableBody && noCompliancePlaceholder && complianceTableBody.children.length === 0) {
                    noCompliancePlaceholder.style.display = 'block';
                }
            } else {
                throw new Error(result.message || 'Deletion failed for an unknown reason.');
            }
        } catch (error) {
            console.error(`Error deleting compliance ${complianceId}:`, error);
            showNotification(`Error: ${error.message || 'Could not delete compliance. Please try again.'}`, "error");
            buttonElement.disabled = false;
            if (row) row.classList.remove('deleting');
        }

        complianceToDelete = null;
        complianceDeleteButton = null;
    }

    if (complianceTableBody && complianceModal) {
        complianceTableBody.addEventListener('click', async (event) => {
            const viewButton = event.target.closest('.compliance-view-btn');
            const deleteButton = event.target.closest('.compliance-delete-btn');

            if (viewButton) {
                const complianceId = viewButton.dataset.id;
                console.log('View compliance button clicked for ID:', complianceId);
                if (!complianceId) return;

                viewButton.disabled = true;
                try {
                    const response = await fetch(`/compliances/${complianceId}`);
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                        throw new Error(errorData.message);
                    }
                    const complianceDetails = await response.json();
                    populateComplianceModal(complianceDetails);
                    openModal(complianceModal);
                } catch (error) {
                    console.error('Error fetching compliance details:', error);
                    showNotification(`Could not load compliance details: ${error.message}`, "error");
                } finally {
                    viewButton.disabled = false;
                }
            }

            if (deleteButton) {
                const complianceId = deleteButton.dataset.id;
                console.log('Delete compliance button clicked for ID:', complianceId);
                if (!complianceId) return;
                await deleteCompliance(complianceId, deleteButton);
            }
        });

        // Close Compliance modal handlers
        closeComplianceModalHeaderBtn?.addEventListener('click', () => closeModal(complianceModal));
        closeComplianceModalFooterBtn?.addEventListener('click', () => closeModal(complianceModal));
        complianceModal.addEventListener('click', (e) => {
            if (e.target === complianceModal) {
                closeModal(complianceModal);
            }
        });

        // Compliance delete confirmation modal events
        confirmComplianceDeleteBtn.addEventListener('click', async () => {
            complianceDeleteConfirmModal.style.display = 'none';
            await performComplianceDeletion();
        });

        cancelComplianceDeleteBtn.addEventListener('click', () => {
            complianceDeleteConfirmModal.style.display = 'none';
            complianceToDelete = null;
            complianceDeleteButton = null;
        });

        complianceDeleteConfirmModal.addEventListener('click', (e) => {
            if (e.target === complianceDeleteConfirmModal) {
                complianceDeleteConfirmModal.style.display = 'none';
                complianceToDelete = null;
                complianceDeleteButton = null;
            }
        });
    } else {
        console.warn('Compliance table body or view modal not found.');
    }

    // IMPROVEMENT SPECIFIC VIEW/DELETE
    const improvementContentArea = document.querySelector('.content.improvement-content');
    const improvementTableBody = improvementContentArea?.querySelector('.improvement-table tbody');
    const improvementModal = document.getElementById('improvementViewModal');
    const closeImprovementModalHeaderBtn = document.getElementById('closeImprovementModal');
    const closeImprovementModalFooterBtn = document.getElementById('closeImprovementModalBtn');
    const noImprovementPlaceholder = improvementContentArea?.querySelector('.no-improvements');

    // Custom delete confirmation modal elements for Improvement
    const improvementDeleteConfirmModal = document.getElementById('ImprovementDeleteConfirmModal');
    const confirmImprovementDeleteBtn = document.getElementById('confirmImprovementDeleteBtn');
    const cancelImprovementDeleteBtn = document.getElementById('cancelImprovementDeleteBtn');
    const improvementDeleteConfirmText = document.getElementById('ImprovementDeleteConfirmText');
    let improvementToDelete = null;
    let deleteImprovementButtonElement = null;

    function populateImprovementModal(improvement) {
        if (!improvementModal || !improvement) {
            console.error("Improvement modal or data missing for population.");
            return;
        }
        const getText = (value) => value || 'N/A';
        const getDateText = (dateValue) => dateValue ? new Date(dateValue).toLocaleString() : 'N/A';

        document.getElementById('improvement_view_id').textContent = `#I${getText(improvement.Improvement_ID)}`;
        document.getElementById('improvement_view_type').textContent = getText(improvement.Improvement_Type);
        document.getElementById('improvement_view_notes').textContent = getText(improvement.Improvement_Notes);
        document.getElementById('improvement_view_date').textContent = getDateText(improvement.Improvement_Date);
        document.getElementById('improvement_view_status').textContent = getText(improvement.Status);
        document.getElementById('improvement_view_feedback').textContent = getText(improvement.Admin_Feedback);
        document.getElementById('improvement_view_response').textContent = getDateText(improvement.Feedback_Date);
    }

    async function deleteImprovement(improvementId, buttonElement) {
        improvementToDelete = improvementId;
        deleteImprovementButtonElement = buttonElement;

        improvementDeleteConfirmText.textContent = `Are you sure you want to delete improvement #I${improvementId}? This action cannot be undone.`;
        improvementDeleteConfirmModal.style.display = 'flex';
    }

    async function performImprovementDeletion() {
        if (!improvementToDelete || !deleteImprovementButtonElement) return;

        const improvementId = improvementToDelete;
        const buttonElement = deleteImprovementButtonElement;
        const row = buttonElement.closest('tr');

        buttonElement.disabled = true;
        if (row) row.classList.add('deleting');

        try {
            const response = await fetch(`/improvements/${improvementId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok && response.status !== 204) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) { /* Ignore */ }
                throw new Error(errorMsg);
            }

            let result = { success: true, message: 'Improvement deleted successfully.' };
            if (response.status === 200) {
                try {
                    result = await response.json();
                } catch (e) {
                    console.warn("Could not parse JSON response for improvement deletion.");
                }
            }

            if (result.success) {
                console.log(`Improvement ${improvementId} deleted successfully.`);
                if (row) row.remove();
                showNotification(result.message || 'Improvement deleted.', "success");

                if (improvementTableBody && noImprovementPlaceholder && improvementTableBody.children.length === 0) {
                    noImprovementPlaceholder.style.display = 'block';
                }
            } else {
                throw new Error(result.message || 'Deletion failed.');
            }
        } catch (error) {
            console.error(`Error deleting improvement ${improvementId}:`, error);
            showNotification(`Error: ${error.message || 'Could not delete improvement.'}`, "error");
            buttonElement.disabled = false;
            if (row) row.classList.remove('deleting');
        }

        // Reset references
        improvementToDelete = null;
        deleteImprovementButtonElement = null;
    }

    if (improvementTableBody && improvementModal) {
        improvementTableBody.addEventListener('click', async (event) => {
            const viewButton = event.target.closest('.improvement-view-btn');
            const deleteButton = event.target.closest('.improvement-delete-btn');

            if (viewButton) {
                const improvementId = viewButton.dataset.id;
                console.log('View improvement button clicked for ID:', improvementId);
                if (!improvementId) return;

                viewButton.disabled = true;
                try {
                    const response = await fetch(`/improvements/${improvementId}`);
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
                        throw new Error(errorData.message);
                    }
                    const improvementDetails = await response.json();
                    populateImprovementModal(improvementDetails);
                    openModal(improvementModal);
                } catch (error) {
                    console.error('Error fetching improvement details:', error);
                    showNotification(`Could not load improvement details: ${error.message}`, "error");
                } finally {
                    viewButton.disabled = false;
                }
            }

            if (deleteButton) {
                const improvementId = deleteButton.dataset.id;
                console.log('Delete improvement button clicked for ID:', improvementId);
                if (!improvementId) return;
                await deleteImprovement(improvementId, deleteButton);
            }
        });

        // Close Improvement modal handlers
        closeImprovementModalHeaderBtn?.addEventListener('click', () => closeModal(improvementModal));
        closeImprovementModalFooterBtn?.addEventListener('click', () => closeModal(improvementModal));
        improvementModal.addEventListener('click', (e) => {
            if (e.target === improvementModal) {
                closeModal(improvementModal);
            }
        });

        // Confirm and cancel delete modal
        confirmImprovementDeleteBtn.addEventListener('click', async () => {
            improvementDeleteConfirmModal.style.display = 'none';
            await performImprovementDeletion();
        });

        cancelImprovementDeleteBtn.addEventListener('click', () => {
            improvementDeleteConfirmModal.style.display = 'none';
            improvementToDelete = null;
            deleteImprovementButtonElement = null;
        });

        improvementDeleteConfirmModal.addEventListener('click', (e) => {
            if (e.target === improvementDeleteConfirmModal) {
                improvementDeleteConfirmModal.style.display = 'none';
                improvementToDelete = null;
                deleteImprovementButtonElement = null;
            }
        });

    } else {
        console.warn('Improvement table body or view modal not found.');
    }

    // View Task Modal Logic
    const taskContentArea = document.querySelector('.tasks-content'); 
    const taskTableBody = document.querySelector('.tasks-table tbody');
    const taskModal = document.getElementById('taskViewModal');
    const closeTaskModalBtn = document.getElementById('closeTaskModal');
    const closeTaskModalFooterBtn = document.getElementById('closeTaskModalBtn');

    const taskDeleteConfirmModal = document.getElementById('taskDeleteConfirmModal');
    const confirmTaskDeleteBtn = document.getElementById('confirmtaskDeleteBtn');
    const cancelTaskDeleteBtn = document.getElementById('canceltaskDeleteBtn');
    const taskDeleteConfirmText = document.getElementById('taskDeleteConfirmText');

    let taskToDelete = null;

    function populateTaskModal(task) {
        const alert = task.alertDetails || {}; 

        document.getElementById('task_view_alert_type').textContent = alert.Alert_Type || 'N/A';
        document.getElementById('task_view_current_value').textContent = alert.Current_Value || 'N/A';
        document.getElementById('task_view_normal_range').textContent = alert.Normal_Range || 'N/A';
        document.getElementById('task_view_alert_datetime').textContent = alert.displayDateTime  || 'N/A';
        document.getElementById('task_view_fallDetectionValue').textContent = alert.Fall_Direction || 'N/A';

        document.getElementById('task_view_task_name').textContent = task.Task_Name || 'N/A';
        document.getElementById('task_view_task_priority').innerHTML = `<span class="priority-badge priority-${task.Task_Priority?.toLowerCase()}">${task.Task_Priority}</span>`;
        document.getElementById('task_view_task_date').textContent = task.displayDateTime || 'N/A';
        document.getElementById('task_view_completion_time').textContent = task.Completion_Time || 'N/A';
        document.getElementById('task_view_task_description').textContent = task.Task_Description || 'N/A';
    }

    if (taskTableBody && taskModal) {
        taskTableBody.addEventListener('click', async (event) => {
            const viewButton = event.target.closest('.task-view-btn');
            const deleteButton = event.target.closest('.task-delete-btn');

            if (viewButton) {
                const taskId = viewButton.dataset.id;
                viewButton.disabled = true;
                try {
                    const response = await fetch(`/tasks/${taskId}`);
                    if (!response.ok) throw new Error('Failed to fetch task details');
                    const taskDetails = await response.json();
                    populateTaskModal(taskDetails);
                    taskModal.classList.add('active');
                } catch (error) {
                    console.error('Error fetching task details:', error);
                    showNotification('Could not load task details.', 'error');
                } finally {
                    viewButton.disabled = false;
                }
            }

            if (deleteButton) {
                taskToDelete = deleteButton.dataset.id;
                taskDeleteConfirmText.textContent = `Are you sure you want to delete task #T${taskToDelete}? This action cannot be undone.`;
                taskDeleteConfirmModal.style.display = 'flex';
            }
        });

        closeTaskModalBtn?.addEventListener('click', () => taskModal.classList.remove('active'));
        closeTaskModalFooterBtn?.addEventListener('click', () => taskModal.classList.remove('active'));
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) taskModal.classList.remove('active');
        });

        confirmTaskDeleteBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`/tasks/${taskToDelete}`, { method: 'DELETE' });
                const result = await response.json();
                if (result.success) {
                    showNotification(result.message, 'success');
                    fetchAndDisplayTasks();
                    fetchAndDisplayAlerts();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                showNotification('Could not delete task.', 'error');
            } finally {
                taskDeleteConfirmModal.style.display = 'none';
                taskToDelete = null;
            }
        });

        cancelTaskDeleteBtn.addEventListener('click', () => {
            taskDeleteConfirmModal.style.display = 'none';
            taskToDelete = null;
        });

        taskDeleteConfirmModal.addEventListener('click', (e) => {
            if (e.target === taskDeleteConfirmModal) {
                taskDeleteConfirmModal.style.display = 'none';
                taskToDelete = null;
            }
        });
    }


    // Initial Data Fetching
    if (messageContentArea) {
        console.log("Fetching initial messages...");
        fetchAndDisplayMessages();
    }
    if (complianceContentArea) {
         console.log("Fetching initial compliance records...");
        fetchAndDisplayCompliance();
    }
    if (improvementContentArea) {
         console.log("Fetching initial improvements...");
        fetchAndDisplayImprovements();
    }
    if (taskContentArea) {
        console.log("Fetching initial tasks...");
        fetchAndDisplayTasks();
    }

});