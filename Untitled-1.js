// // ADDING AND SUBMITTING MESSAGE, COMPLIANCE, IMPROVEMENT SECTION 
// document.addEventListener('DOMContentLoaded', function () {

//     // Add this function at the top of your script
//     function showNotification(message, type = 'success') {
//         let notificationContainer = document.getElementById('notification-container');
//         if (!notificationContainer) {
//         notificationContainer = document.createElement('div');
//         notificationContainer.id = 'notification-container';
//         document.body.appendChild(notificationContainer);
//         }
        
//         const notification = document.createElement('div');
//         notification.className = `notification ${type}`;

//         notification.innerHTML = `
//         ${message}
//         <span class="close-notification">×</span>
//         `;
        
//         // Add to container
//         notificationContainer.appendChild(notification);
        
//         // Handle close button click
//         notification.querySelector('.close-notification').addEventListener('click', function() {
//         notification.classList.add('fade-out');
//         setTimeout(() => {
//             if (notification && notification.parentNode) {
//             notification.parentNode.removeChild(notification);
//             }
//         }, 300);
//         });
        
//         // Auto-remove after 5 seconds
//         setTimeout(() => {
//         if (notification && notification.parentNode) {
//             notification.classList.add('fade-out');
//             setTimeout(() => {
//             if (notification && notification.parentNode) {
//                 notification.parentNode.removeChild(notification);
//             }
//             }, 300);
//         }
//         }, 5000);
//     }
    
//     // Add this CSS to your stylesheet
//     document.head.insertAdjacentHTML('beforeend', `
//     <style>
//         #notification-container {
//         position: fixed;
//         top: 20px;
//         right: 10px;
//         transform: translateX(-10%);
//         z-index: 9999;
//         display: flex;
//         flex-direction: column;
//         gap: 10px;
//         }
        
//         .notification {
//         padding: 12px 20px;
//         border-radius: 4px;
//         display: flex;
//         align-items: center;
//         justify-content: space-between;
//         min-width: 300px;
//         max-width: 80vw;
//         box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
//         animation: slide-in 0.3s ease-out forwards;
//         font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
//         }
        
//         .notification.success {
//         background-color: #4CAF50;
//         color: white;
//         }
        
//         .notification.error {
//         background-color: #f44336;
//         color: white;
//         }
        
//         .notification.warning {
//         background-color: #ff9800;
//         color: white;
//         }
        
//         .notification.info {
//         background-color: #2196F3;
//         color: white;
//         }
        
//         .close-notification {
//         margin-left: 15px;
//         color: white;
//         font-weight: bold;
//         font-size: 20px;
//         cursor: pointer;
//         }
        
//         .fade-out {
//         opacity: 0;
//         transition: opacity 0.3s ease-out;
//         }
        
//         @keyframes slide-in {
//         from {
//             transform: translateY(-20px);
//             opacity: 0;
//         }
//         to {
//             transform: translateY(0);
//             opacity: 1;
//         }
//         }
//     </style>
//     `);


//     // Adding Messages, Compliance, Improvement
//     const addMessageBtn = document.querySelector('.messages-actions .add-new-btn');
//     const addComplianceBtn = document.querySelector('.compliance-actions .add-new-btn');
//     const addImprovementBtn = document.querySelector('.improvement-actions .add-new-btn');
//     const messagePopup = document.getElementById('newMessagePopup');
//     const compliancePopup = document.getElementById('newCompliancePopup');
//     const improvementPopup = document.getElementById('newImprovementPopup');

//     const closeButtons = document.querySelectorAll('.close-btn, .cancel-btn[data-dismiss="popup"]');

//     function getCurrentDateTime() {
//         const now = new Date();
//         const offset = now.getTimezoneOffset();
//         const local = new Date(now.getTime() - offset * 60 * 1000);
//         return local.toISOString().slice(0, 16);
//     }

//     if (addMessageBtn) {
//         addMessageBtn.addEventListener('click', function () {
//             messagePopup.classList.add('active');
//             document.getElementById('messageDate').value = getCurrentDateTime();
//         });
//     }

//     if (addComplianceBtn) {
//         addComplianceBtn.addEventListener('click', function () {
//             compliancePopup.classList.add('active');
//             document.getElementById('complianceDate').value = getCurrentDateTime();
//         });
//     }

//     if (addImprovementBtn) {
//         addImprovementBtn.addEventListener('click', function () {
//             improvementPopup.classList.add('active');
//             document.getElementById('improvementDate').value = getCurrentDateTime();
//         });
//     }

//     closeButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             const popup = this.closest('.popup-overlay');
//             popup.classList.remove('active');
//         });
//     });

//     document.querySelectorAll('.popup-overlay').forEach(overlay => {
//         overlay.addEventListener('click', function (e) {
//             if (e.target === this) {
//                 this.classList.remove('active');
//             }
//         });
//     });

//     // Message Submit
//     const submitMessageBtn = document.getElementById('submitMessage');
//     submitMessageBtn.addEventListener('click', async function (e) {
//         e.preventDefault();

//         const messageType = document.getElementById('messageType').value;
//         const messageContent = document.getElementById('messageContent').value;
//         const messageDate = document.getElementById('messageDate').value;

//         if (!messageType || messageContent.length < 10) {
//             showNotification("Please fill in all fields properly.");
//             return;
//         }

//         try {
//             const response = await fetch('/submit-message', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     messageType,
//                     messageContent,
//                     messageDate
//                 })
//             });

//             const result = await response.json();

//             if (result.success) {
//                 showNotification("Message submitted successfully!");
//                 document.getElementById('newMessageForm').reset();
//                 document.getElementById('newMessagePopup').classList.remove('active');
//                 fetchAndDisplayMessages();
//             } else {
//                 showNotification("Failed to submit message: " + result.message);
//             }

//         } catch (error) {
//             console.error('Error submitting message:', error);
//             showNotification("Something went wrong. Try again later.");
//         }
//     });

//     // Submit Compliance
//     const submitComplianceBtn = document.getElementById('submitCompliance');
//     submitComplianceBtn.addEventListener('click', async function (e) {
//         e.preventDefault();

//         const complianceType = document.getElementById('complianceType').value;
//         const complianceNotes = document.getElementById('complianceNotes').value;
//         const complianceDate = document.getElementById('complianceDate').value;

//         if (!complianceType || complianceNotes.length < 10) {
//             showNotification("Please fill in all fields properly.");
//             return;
//         }

//         try {
//             const response = await fetch('/submit-compliance', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     complianceType,
//                     complianceNotes,
//                     complianceDate
//                 })
//             });

//             const result = await response.json();

//             if (result.success) {
//                 showNotification("Compliance submitted successfully!");
//                 document.getElementById('newComplianceForm').reset();
//                 document.getElementById('newCompliancePopup').classList.remove('active');
//                 fetchAndDisplayCompliance();
//             } else {
//                 showNotification("Failed to submit compliance: " + result.message);
//             }

//         } catch (error) {
//             console.error('Error submitting compliance:', error);
//             showNotification("Something went wrong. Try again later.");
//         }
//     });

//     // Submit Improvement
//     const submitImprovementBtn = document.getElementById('submitImprovement');
//     submitImprovementBtn.addEventListener('click', async function (e) {
//         e.preventDefault();
    
//         const improvementCategory = document.getElementById('improvementCategory').value.trim();
//         const improvementDescription = document.getElementById('improvementDescription').value.trim();
//         const improvementDate = document.getElementById('improvementDate').value;
    
//         if (!improvementCategory || improvementDescription.length < 10) {
//             showNotification("Please fill in all fields properly. Description should be at least 10 characters.");
//             return;
//         }
    
//         try {
//             const response = await fetch('/submit-improvement', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     improvementCategory,
//                     improvementDescription,
//                     improvementDate
//                 })
//             });
    
//             const result = await response.json();
    
//             if (result.success) {
//                 showNotification("Improvement submitted successfully!");
//                 document.getElementById('newImprovementForm').reset();
//                 document.getElementById('newImprovementPopup').classList.remove('active');
//                 fetchAndDisplayImprovements();
//             } else {
//                 showNotification("Failed to submit improvement: " + result.message);
//             }
    
//         } catch (error) {
//             console.error('Error submitting improvement:', error);
//             showNotification("Something went wrong. Please try again later.");
//         }
//     });
// });

// // VIEW, DELETE, and FETCH DATA SECTION
// document.addEventListener('DOMContentLoaded', function() {

//     function closeModal(modal) {
//         if (modal) {
//             modal.classList.remove('active');
//         }
//     }

//     function openModal(modal) {
//         if (modal) {
//             modal.classList.add('active');
//         }
//     }

//     // MESSAGE SPECIFIC
//     const messageContentArea = document.querySelector('.content.messages-content');
//     const messageTableBody = messageContentArea?.querySelector('.messages-table tbody');
//     const messageModal = document.getElementById('messageViewModal');
//     const closeMessageModalBtn = document.getElementById('closeMessageModal');
//     const closeMessageModalFooterBtn = document.getElementById('closeMessageModalBtn');
//     const noMessagesPlaceholder = messageContentArea?.querySelector('.no-messages');

//     // Function to fetch all messages for the patient
//     async function fetchAndDisplayMessages() {
//         if (!messageTableBody || !noMessagesPlaceholder) {
//              console.error("Message table body or placeholder not found.");
//              return;
//         }

//         messageTableBody.innerHTML = '<tr><td colspan="6">Loading messages...</td></tr>';
//         noMessagesPlaceholder.style.display = 'none';

//         try {
//             const response = await fetch('/messages'); 
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const messages = await response.json();

//             messageTableBody.innerHTML = ''; 

//             if (messages.length === 0) {
//                 noMessagesPlaceholder.style.display = 'block';
//             } else {
//                 noMessagesPlaceholder.style.display = 'none';
//                 messages.forEach(msg => {
//                     const row = document.createElement('tr');
//                     row.setAttribute('data-message-id', msg.Message_ID);
//                     row.innerHTML = `
//                         <td>#M${msg.Message_ID}</td>
//                         <td>${msg.Message_Type || 'N/A'}</td>
//                         <td>${msg.Message_Content}</td>
//                         <td>${msg.Message_Sent_DateTime || 'N/A'}</td>
//                         <td><span class="status-badge status-${msg.Status?.toLowerCase() || 'unknown'}">${msg.Status || 'N/A'}</span></td>
//                         <td>
//                             <div class="action-buttons">
//                                 <button class="view-btn message-view-btn" data-id="${msg.Message_ID}">View</button>
//                                 <button class="delete-btn message-delete-btn" data-id="${msg.Message_ID}">Delete</button>
//                             </div>
//                         </td>
//                     `;
//                     messageTableBody.appendChild(row);
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//             messageTableBody.innerHTML = `<tr><td colspan="6" class="error-message">Could not load messages. Please try again later.</td></tr>`;
//             noMessagesPlaceholder.style.display = 'none';
//         }
//     }

//     // Function to populate the message view modal
//     function populateMessageModal(message) {
//         if (!messageModal || !message) return;

//         // Helper to safely get text content
//         const getText = (value) => value || 'N/A';

//         document.getElementById('message_view_id').textContent = `#M${getText(message.Message_ID)}`;
//         document.getElementById('message_view_type').textContent = getText(message.Message_Type);
//         document.getElementById('message_view_content').textContent = getText(message.Message_Content);
//         document.getElementById('message_view_datetime').textContent = getText(message.Message_Sent_DateTime);
//         document.getElementById('message_view_status').textContent = getText(message.Status);
//         document.getElementById('message_view_response').textContent = getText(message.Admin_Response);
//         document.getElementById('message_view_responsedate').textContent = getText(message.Response_Date);
//     }

//     // Function to handle message deletion
//     async function deleteMessage(messageId, buttonElement) {
//         if (!confirm(`Are you sure you want to delete message #M${messageId}? This action cannot be undone.`)) {
//             return;
//         }
    
//         buttonElement.disabled = true;
//         const row = buttonElement.closest('tr');
//         row?.classList.add('deleting');
    
//         try {
//             const response = await fetch(`/messages/${messageId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
    
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }
            
//             const result = await response.json(); 
    
//             if (result.success) {
//                 console.log(`Message ${messageId} deleted successfully.`);
//                 row?.remove();
//                 alert(result.message || 'Message deleted.');
                
//                 if (messageTableBody && messageTableBody.children.length === 0) {
//                     noMessagesPlaceholder.style.display = 'block';
//                 }
//             } else {
//                 throw new Error(result.message || 'Unknown error occurred');
//             }
//         } catch (error) {
//             console.error(`Error deleting message ${messageId}:`, error);
//             alert(`Error: ${error.message || 'Could not delete message. Please try again.'}`);
//             buttonElement.disabled = false;
//             row?.classList.remove('deleting');
//         }
//     }

//     messageTableBody?.addEventListener('click', async (event) => {
//         const viewButton = event.target.closest('.message-view-btn');
//         const deleteButton = event.target.closest('.message-delete-btn');

//         if (viewButton) {
//             const messageId = viewButton.dataset.id;
//             console.log('View button clicked for ID:', messageId);
//             if (!messageId) return;

//             try {
//                 const response = await fetch(`/messages/${messageId}`);
//                 if (!response.ok) {
//                      const errorData = await response.json();
//                      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//                 }
//                 const messageDetails = await response.json();
//                 populateMessageModal(messageDetails);
//                 openModal(messageModal);
//             } catch (error) {
//                 console.error('Error fetching message details:', error);
//                 showNotification(`Could not load message details: ${error.message}`);
//             }
//         }

//         if (deleteButton) {
//             const messageId = deleteButton.dataset.id;
//              console.log('Delete button clicked for ID:', messageId);
//             if (!messageId) return;
//             await deleteMessage(messageId, deleteButton);
//         }
//     });

//     // Close Message modal handlers
//     closeMessageModalBtn?.addEventListener('click', () => closeModal(messageModal));
//     closeMessageModalFooterBtn?.addEventListener('click', () => closeModal(messageModal));
//     messageModal?.addEventListener('click', (e) => { 
//         if (e.target === messageModal) {
//             closeModal(messageModal);
//         }
//     });

//     if (messageContentArea && messageTableBody) {
//         fetchAndDisplayMessages();
//     }

//     // COMPLIANCE SPECIFIC
//     const complianceContentArea = document.querySelector('.content.compliance-content');
//     const complianceTableBody = complianceContentArea?.querySelector('.compliance-table tbody');
//     const complianceModal = document.getElementById('complianceViewModal');
//     const closeComplianceModalBtn = document.getElementById('closeComplianceModal');
//     const closeComplianceModalFooterBtn = document.getElementById('closeComplianceModalBtn');
//     const noCompliancePlaceholder = complianceContentArea?.querySelector('.no-compliances');

//     // Function to fetch all compliance records
//     async function fetchAndDisplayCompliance() {
//         if (!complianceTableBody || !noCompliancePlaceholder) {
//             console.error("Compliance table body or placeholder not found.");
//             return;
//         }

//         complianceTableBody.innerHTML = '<tr><td colspan="6">Loading compliance records...</td></tr>';
//         noCompliancePlaceholder.style.display = 'none';

//         try {
//             const response = await fetch('/compliances'); 
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const complianceRecords = await response.json();

//             complianceTableBody.innerHTML = ''; 

//             if (complianceRecords.length === 0) {
//                 noCompliancePlaceholder.style.display = 'block';
//             } else {
//                 noCompliancePlaceholder.style.display = 'none';
//                 complianceRecords.forEach(record => {
//                     const row = document.createElement('tr');
//                     row.setAttribute('data-compliance-id', record.Compliance_ID);
//                     row.innerHTML = `
//                         <td>#C${record.Compliance_ID}</td>
//                         <td>${record.Compliance_Type || 'N/A'}</td>
//                         <td>${record.Compliance_Notes}</td>
//                         <td>${record.Compliance_Date || 'N/A'}</td>
//                         <td><span class="status-badge status-${record.Status?.toLowerCase() || 'unknown'}">${record.Status || 'N/A'}</span></td>
//                         <td>
//                             <div class="action-buttons">
//                                 <button class="view-btn compliance-view-btn" data-id="${record.Compliance_ID}">View</button>
//                                 <button class="delete-btn compliance-delete-btn" data-id="${record.Compliance_ID}">Delete</button>
//                             </div>
//                         </td>
//                     `;
//                     complianceTableBody.appendChild(row);
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching compliance records:', error);
//             complianceTableBody.innerHTML = `<tr><td colspan="6" class="error-message">Could not load compliance records. Please try again later.</td></tr>`;
//             noCompliancePlaceholder.style.display = 'none';
//         }
//     }

//     // Function to populate the compliance view modal
//     function populateComplianceModal(compliance) {
//         if (!complianceModal || !compliance) return;

//         // Helper to safely get text content
//         const getText = (value) => value || 'N/A';

//         document.getElementById('compliance_view_id').textContent = `#C${getText(compliance.Compliance_ID)}`;
//         document.getElementById('compliance_view_type').textContent = getText(compliance.Compliance_Type);
//         document.getElementById('compliance_view_notes').textContent = getText(compliance.Compliance_Notes);
//         document.getElementById('compliance_view_date').textContent = getText(compliance.Compliance_Date);
//         document.getElementById('compliance_view_status').textContent = getText(compliance.Status);
//         document.getElementById('compliance_view_feedback').textContent = getText(compliance.Admin_Feedback);
//         document.getElementById('compliance_view_response').textContent = getText(compliance.Feedback_Date);
//     }

//     // Function to handle compliance record deletion
//     async function deleteCompliance(complianceId, buttonElement) {
//         if (!confirm(`Are you sure you want to delete compliance record #C${complianceId}? This action cannot be undone.`)) {
//             return;
//         }

//         buttonElement.disabled = true;
//         const row = buttonElement.closest('tr');
//         row?.classList.add('deleting');

//         try {
//             const response = await fetch(`/compliances/${complianceId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }
            
//             const result = await response.json(); 

//             if (result.success) {
//                 console.log(`Compliance record ${complianceId} deleted successfully.`);
//                 row?.remove();
//                 alert(result.message || 'Compliance record deleted.');
                
//                 if (complianceTableBody && complianceTableBody.children.length === 0) {
//                     noCompliancePlaceholder.style.display = 'block';
//                 }
//             } else {
//                 throw new Error(result.message || 'Unknown error occurred');
//             }
//         } catch (error) {
//             console.error(`Error deleting compliance record ${complianceId}:`, error);
//             alert(`Error: ${error.message || 'Could not delete compliance record. Please try again.'}`);
//             buttonElement.disabled = false;
//             row?.classList.remove('deleting');
//         }
//     }

//     complianceTableBody?.addEventListener('click', async (event) => {
//         const viewButton = event.target.closest('.compliance-view-btn');
//         const deleteButton = event.target.closest('.compliance-delete-btn');

//         if (viewButton) {
//             const complianceId = viewButton.dataset.id;
//             console.log('View button clicked for compliance ID:', complianceId);
//             if (!complianceId) return;

//             try {
//                 const response = await fetch(`/compliances/${complianceId}`);
//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//                 }
//                 const complianceDetails = await response.json();
//                 populateComplianceModal(complianceDetails);
//                 openModal(complianceModal);
//             } catch (error) {
//                 console.error('Error fetching compliance details:', error);
//                 showNotification(`Could not load compliance details: ${error.message}`);
//             }
//         }

//         if (deleteButton) {
//             const complianceId = deleteButton.dataset.id;
//             console.log('Delete button clicked for compliance ID:', complianceId);
//             if (!complianceId) return;
//             await deleteCompliance(complianceId, deleteButton);
//         }
//     });

//     // Close Compliance modal handlers
//     closeComplianceModalBtn?.addEventListener('click', () => closeModal(complianceModal));
//     closeComplianceModalFooterBtn?.addEventListener('click', () => closeModal(complianceModal));
//     complianceModal?.addEventListener('click', (e) => { 
//         if (e.target === complianceModal) {
//             closeModal(complianceModal);
//         }
//     });

//     if (complianceContentArea && complianceTableBody) {
//         fetchAndDisplayCompliance();
//     }

//     // IMPROVEMENT SPECIFIC
//     const improvementContentArea = document.querySelector('.content.improvement-content');
//     const improvementTableBody = improvementContentArea?.querySelector('.improvement-table tbody');
//     const improvementModal = document.getElementById('improvementViewModal');
//     const closeImprovementModalBtn = document.getElementById('closeImprovementModal');
//     const closeImprovementModalFooterBtn = document.getElementById('closeImprovementModalBtn');
//     const noImprovementPlaceholder = improvementContentArea?.querySelector('.no-improvements');

//     // Function to fetch all improvement records
//     async function fetchAndDisplayImprovements() {
//         if (!improvementTableBody || !noImprovementPlaceholder) {
//             console.error("Improvement table body or placeholder not found.");
//             return;
//         }

//         improvementTableBody.innerHTML = '<tr><td colspan="6">Loading improvement records...</td></tr>';
//         noImprovementPlaceholder.style.display = 'none';

//         try {
//             const response = await fetch('/improvements'); 
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             const improvements = await response.json();

//             improvementTableBody.innerHTML = ''; 

//             if (improvements.length === 0) {
//                 noImprovementPlaceholder.style.display = 'block';
//             } else {
//                 noImprovementPlaceholder.style.display = 'none';
//                 improvements.forEach(imp => {
//                     const row = document.createElement('tr');
//                     row.setAttribute('data-improvement-id', imp.Improvement_ID);
//                     row.innerHTML = `
//                         <td>#I${imp.Improvement_ID}</td>
//                         <td>${imp.Category || 'N/A'}</td>
//                         <td>${imp.Suggestion_Description}</td>
//                         <td>${imp.Date_Submitted || 'N/A'}</td>
//                         <td><span class="status-badge status-${imp.Status?.toLowerCase() || 'unknown'}">${imp.Status || 'N/A'}</span></td>
//                         <td>
//                             <div class="action-buttons">
//                                 <button class="view-btn improvement-view-btn" data-id="${imp.Improvement_ID}">View</button>
//                                 <button class="delete-btn improvement-delete-btn" data-id="${imp.Improvement_ID}">Delete</button>
//                             </div>
//                         </td>
//                     `;
//                     improvementTableBody.appendChild(row);
//                 });
//             }
//         } catch (error) {
//             console.error('Error fetching improvements:', error);
//             improvementTableBody.innerHTML = `<tr><td colspan="6" class="error-message">Could not load improvements. Please try again later.</td></tr>`;
//             noImprovementPlaceholder.style.display = 'none';
//         }
//     }

//     // Function to populate the improvement view modal
//     function populateImprovementModal(improvement) {
//         if (!improvementModal || !improvement) return;

//         // Helper to safely get text content
//         const getText = (value) => value || 'N/A';

//         document.getElementById('improvement_view_id').textContent = `#I${getText(improvement.Improvement_ID)}`;
//         document.getElementById('improvement_view_category').textContent = getText(improvement.Category);
//         document.getElementById('improvement_view_description').textContent = getText(improvement.Suggestion_Description);
//         document.getElementById('improvement_view_date').textContent = getText(improvement.Date_Submitted);
//         document.getElementById('improvement_view_status').textContent = getText(improvement.Status);
//         document.getElementById('improvement_view_response').textContent = getText(improvement.Admin_Response);
//         document.getElementById('improvement_view_implementation_date').textContent = getText(improvement.Implementation_Date);
//     }

//     // Function to handle improvement deletion
//     async function deleteImprovement(improvementId, buttonElement) {
//         if (!confirm(`Are you sure you want to delete improvement #I${improvementId}? This action cannot be undone.`)) {
//             return;
//         }

//         buttonElement.disabled = true;
//         const row = buttonElement.closest('tr');
//         row?.classList.add('deleting');

//         try {
//             const response = await fetch(`/improvements/${improvementId}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//             }
            
//             const result = await response.json(); 

//             if (result.success) {
//                 console.log(`Improvement ${improvementId} deleted successfully.`);
//                 row?.remove();
//                 alert(result.message || 'Improvement deleted.');
                
//                 if (improvementTableBody && improvementTableBody.children.length === 0) {
//                     noImprovementPlaceholder.style.display = 'block';
//                 }
//             } else {
//                 throw new Error(result.message || 'Unknown error occurred');
//             }
//         } catch (error) {
//             console.error(`Error deleting improvement ${improvementId}:`, error);
//             alert(`Error: ${error.message || 'Could not delete improvement. Please try again.'}`);
//             buttonElement.disabled = false;
//             row?.classList.remove('deleting');
//         }
//     }

//     improvementTableBody?.addEventListener('click', async (event) => {
//         const viewButton = event.target.closest('.improvement-view-btn');
//         const deleteButton = event.target.closest('.improvement-delete-btn');

//         if (viewButton) {
//             const improvementId = viewButton.dataset.id;
//             console.log('View button clicked for improvement ID:', improvementId);
//             if (!improvementId) return;

//             try {
//                 const response = await fetch(`/improvements/${improvementId}`);
//                 if (!response.ok) {
//                     const errorData = await response.json();
//                     throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//                 }
//                 const improvementDetails = await response.json();
//                 populateImprovementModal(improvementDetails);
//                 openModal(improvementModal);
//             } catch (error) {
//                 console.error('Error fetching improvement details:', error);
//                 showNotification(`Could not load improvement details: ${error.message}`);
//             }
//         }

//         if (deleteButton) {
//             const improvementId = deleteButton.dataset.id;
//             console.log('Delete button clicked for improvement ID:', improvementId);
//             if (!improvementId) return;
//             await deleteImprovement(improvementId, deleteButton);
//         }
//     });

//     // Close Improvement modal handlers
//     closeImprovementModalBtn?.addEventListener('click', () => closeModal(improvementModal));
//     closeImprovementModalFooterBtn?.addEventListener('click', () => closeModal(improvementModal));
//     improvementModal?.addEventListener('click', (e) => { 
//         if (e.target === improvementModal) {
//             closeModal(improvementModal);
//         }
//     });

//     if (improvementContentArea && improvementTableBody) {
//         fetchAndDisplayImprovements();
//     }
// });