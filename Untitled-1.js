// // Variables and elements for delete confirmation modal
// const deleteConfirmModal = document.getElementById('MessageDeleteConfirmModal');
// const confirmDeleteBtn = document.getElementById('confirmMessageDeleteBtn');
// const cancelDeleteBtn = document.getElementById('cancelMessageDeleteBtn');
// const deleteConfirmText = document.getElementById('MessageDeleteConfirmText');
// let itemToDelete = null;
// let deleteButtonElement = null;
// let deleteType = null;

// // COMPLIANCE SPECIFIC VIEW/DELETE
// const complianceContentArea = document.querySelector('.content.compliance-content');
// const complianceTableBody = complianceContentArea?.querySelector('.compliance-table tbody');
// const complianceModal = document.getElementById('complianceViewModal');
// const closeComplianceModalHeaderBtn = document.getElementById('closeComplianceModal');
// const closeComplianceModalFooterBtn = document.getElementById('closeComplianceModalBtn');
// const noCompliancePlaceholder = complianceContentArea?.querySelector('.no-compliances');

// function populateComplianceModal(compliance) {
//     if (!complianceModal || !compliance) {
//          console.error("Compliance modal or data missing for population.");
//          return;
//     }
//     const getText = (value) => value || 'N/A';
//     const getDateText = (dateValue) => dateValue ? new Date(dateValue).toLocaleString() : 'N/A';

//     document.getElementById('compliance_view_id').textContent = `#C${getText(compliance.Compliance_ID)}`;
//     document.getElementById('compliance_view_type').textContent = getText(compliance.Compliance_Type);
//     document.getElementById('compliance_view_notes').textContent = getText(compliance.Compliance_Notes);
//     document.getElementById('compliance_view_date').textContent = getDateText(compliance.Compliance_Date);
//     document.getElementById('compliance_view_status').textContent = getText(compliance.Status);
//     document.getElementById('compliance_view_feedback').textContent = getText(compliance.Admin_Feedback);
//     document.getElementById('compliance_view_response').textContent = getDateText(compliance.Feedback_Date);
// }

// async function deleteCompliance(complianceId, buttonElement) {
//     // Store references to use when the user confirms
//     itemToDelete = complianceId;
//     deleteButtonElement = buttonElement;
//     deleteType = "compliance";
    
//     // Set the confirmation text
//     deleteConfirmText.textContent = `Are you sure you want to delete compliance record #C${complianceId}? This action cannot be undone.`;
    
//     // Show the custom modal
//     deleteConfirmModal.style.display = 'flex';
// }

// async function performComplianceDeletion() {
//     if (!itemToDelete || !deleteButtonElement) return;
    
//     const complianceId = itemToDelete;
//     const buttonElement = deleteButtonElement;
//     const row = buttonElement.closest('tr');
    
//     buttonElement.disabled = true;
//     if (row) row.classList.add('deleting');

//     try {
//         const response = await fetch(`/compliances/${complianceId}`, {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' }
//         });

//         if (!response.ok && response.status !== 204) {
//             let errorMsg = `HTTP error! status: ${response.status}`;
//              try {
//                 const errorData = await response.json();
//                 errorMsg = errorData.message || errorMsg;
//             } catch (e) { /* Ignore */ }
//             throw new Error(errorMsg);
//         }

//          let result = { success: true, message: 'Compliance record deleted successfully.' };
//          if (response.status === 200) {
//              try {
//                 result = await response.json();
//              } catch (e) { console.warn("Could not parse JSON for compliance deletion."); }
//          }

//         if (result.success) {
//             console.log(`Compliance record ${complianceId} deleted successfully.`);
//              if (row) row.remove();
//             showNotification(result.message || 'Compliance record deleted.', "success");

//             if (complianceTableBody && noCompliancePlaceholder && complianceTableBody.children.length === 0) {
//                 noCompliancePlaceholder.style.display = 'block';
//             }
//         } else {
//             throw new Error(result.message || 'Deletion failed.');
//         }
//     } catch (error) {
//         console.error(`Error deleting compliance record ${complianceId}:`, error);
//         showNotification(`Error: ${error.message || 'Could not delete compliance record.'}`, "error");
//         buttonElement.disabled = false;
//          if (row) row.classList.remove('deleting');
//     }
    
//     // Reset the stored references
//     itemToDelete = null;
//     deleteButtonElement = null;
//     deleteType = null;
// }

// // IMPROVEMENT SPECIFIC VIEW/DELETE
// const improvementContentArea = document.querySelector('.content.improvement-content');
// const improvementTableBody = improvementContentArea?.querySelector('.improvement-table tbody');
// const improvementModal = document.getElementById('improvementViewModal');
// const closeImprovementModalHeaderBtn = document.getElementById('closeImprovementModal');
// const closeImprovementModalFooterBtn = document.getElementById('closeImprovementModalBtn');
// const noImprovementPlaceholder = improvementContentArea?.querySelector('.no-improvements');

// function populateImprovementModal(improvement) {
//     if (!improvementModal || !improvement) {
//         console.error("Improvement modal or data missing for population.");
//         return;
//     }
//     const getText = (value) => value || 'N/A';
//     const getDateText = (dateValue) => dateValue ? new Date(dateValue).toLocaleString() : 'N/A';

//     document.getElementById('improvement_view_id').textContent = `#I${getText(improvement.Improvement_ID)}`;
//     document.getElementById('improvement_view_category').textContent = getText(improvement.Category);
//     document.getElementById('improvement_view_description').textContent = getText(improvement.Suggestion_Description);
//     document.getElementById('improvement_view_date').textContent = getDateText(improvement.Date_Submitted);
//     document.getElementById('improvement_view_status').textContent = getText(improvement.Status);
//     document.getElementById('improvement_view_response').textContent = getText(improvement.Admin_Response);
//     document.getElementById('improvement_view_implementation_date').textContent = getDateText(improvement.Implementation_Date);
// }

// async function deleteImprovement(improvementId, buttonElement) {
//     // Store references to use when the user confirms
//     itemToDelete = improvementId;
//     deleteButtonElement = buttonElement;
//     deleteType = "improvement";
    
//     // Set the confirmation text
//     deleteConfirmText.textContent = `Are you sure you want to delete improvement #I${improvementId}? This action cannot be undone.`;
    
//     // Show the custom modal
//     deleteConfirmModal.style.display = 'flex';
// }

// async function performImprovementDeletion() {
//     if (!itemToDelete || !deleteButtonElement) return;
    
//     const improvementId = itemToDelete;
//     const buttonElement = deleteButtonElement;
//     const row = buttonElement.closest('tr');
    
//     buttonElement.disabled = true;
//     if (row) row.classList.add('deleting');

//     try {
//         const response = await fetch(`/improvements/${improvementId}`, {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' }
//         });

//          if (!response.ok && response.status !== 204) {
//             let errorMsg = `HTTP error! status: ${response.status}`;
//             try {
//                 const errorData = await response.json();
//                 errorMsg = errorData.message || errorMsg;
//             } catch (e) { /* Ignore */ }
//             throw new Error(errorMsg);
//         }

//          let result = { success: true, message: 'Improvement suggestion deleted successfully.' };
//          if (response.status === 200) {
//              try {
//                  result = await response.json();
//              } catch (e) { console.warn("Could not parse JSON for improvement deletion.");}
//          }

//         if (result.success) {
//             console.log(`Improvement ${improvementId} deleted successfully.`);
//             if (row) row.remove();
//             showNotification(result.message || 'Improvement deleted.', "success");

//             if (improvementTableBody && noImprovementPlaceholder && improvementTableBody.children.length === 0) {
//                 noImprovementPlaceholder.style.display = 'block';
//             }
//         } else {
//             throw new Error(result.message || 'Deletion failed.');
//         }
//     } catch (error) {
//         console.error(`Error deleting improvement ${improvementId}:`, error);
//         showNotification(`Error: ${error.message || 'Could not delete improvement.'}`, "error");
//         buttonElement.disabled = false;
//         if (row) row.classList.remove('deleting');
//     }
    
//     // Reset the stored references
//     itemToDelete = null;
//     deleteButtonElement = null;
//     deleteType = null;
// }

// // MESSAGE SPECIFIC VIEW/DELETE
// const messageContentArea = document.querySelector('.content.messages-content');
// const messageTableBody = messageContentArea?.querySelector('.messages-table tbody');
// const messageModal = document.getElementById('messageViewModal');
// const closeMessageModalHeaderBtn = document.getElementById('closeMessageModal');
// const closeMessageModalFooterBtn = document.getElementById('closeMessageModalBtn');
// const noMessagesPlaceholder = messageContentArea?.querySelector('.no-messages');

// function populateMessageModal(message) {
//     if (!messageModal || !message) {
//         console.error("Message modal or data missing for population.");
//         return;
//     }
//     const getText = (value) => value || 'N/A';
//     const getDateText = (dateValue) => dateValue ? new Date(dateValue).toLocaleString() : 'N/A';

//     document.getElementById('message_view_id').textContent = `#M${getText(message.Message_ID)}`;
//     document.getElementById('message_view_type').textContent = getText(message.Message_Type);
//     document.getElementById('message_view_content').textContent = getText(message.Message_Content);
//     document.getElementById('message_view_datetime').textContent = getDateText(message.Message_Sent_DateTime);
//     document.getElementById('message_view_status').textContent = getText(message.Status);
//     document.getElementById('message_view_response').textContent = getText(message.Admin_Response);
//     document.getElementById('message_view_responsedate').textContent = getDateText(message.Response_Date);
// }

// async function deleteMessage(messageId, buttonElement) {
//     // Store references to use when the user confirms
//     itemToDelete = messageId;
//     deleteButtonElement = buttonElement;
//     deleteType = "message";
    
//     // Set the confirmation text
//     deleteConfirmText.textContent = `Are you sure you want to delete message #M${messageId}? This action cannot be undone.`;
    
//     // Show the custom modal
//     deleteConfirmModal.style.display = 'flex';
// }

// async function performMessageDeletion() {
//     if (!itemToDelete || !deleteButtonElement) return;
    
//     const messageId = itemToDelete;
//     const buttonElement = deleteButtonElement;
//     const row = buttonElement.closest('tr');
    
//     buttonElement.disabled = true;
//     if (row) row.classList.add('deleting');

//     try {
//         const response = await fetch(`/messages/${messageId}`, {
//             method: 'DELETE',
//             headers: { 'Content-Type': 'application/json' }
//         });

//         // Check if response is OK, even if it doesn't contain JSON (like a 204 No Content)
//         if (!response.ok && response.status !== 204) {
//             let errorMsg = `HTTP error! status: ${response.status}`;
//             try {
//                 const errorData = await response.json();
//                 errorMsg = errorData.message || errorMsg;
//             } catch (e) { }
//             throw new Error(errorMsg);
//         }

//         // If response is OK (200 or 204), assume success or parse JSON if available
//         let result = { success: true, message: 'Message deleted successfully.' };
//         if (response.status === 200) {
//             try {
//                 result = await response.json();
//             } catch (e) {
//                 console.warn("Could not parse JSON response for message deletion, but status was OK.");
//             }
//         }

//         if (result.success) {
//             console.log(`Message ${messageId} deleted successfully.`);
//             if (row) row.remove();
//             showNotification(result.message || 'Message deleted.', "success");

//             // Check if table is empty after deletion
//             if (messageTableBody && noMessagesPlaceholder && messageTableBody.children.length === 0) {
//                 noMessagesPlaceholder.style.display = 'block';
//             }
//         } else {
//             throw new Error(result.message || 'Deletion failed for an unknown reason.');
//         }
//     } catch (error) {
//         console.error(`Error deleting message ${messageId}:`, error);
//         showNotification(`Error: ${error.message || 'Could not delete message. Please try again.'}`, "error");
//         buttonElement.disabled = false;
//         if (row) row.classList.remove('deleting');
//     }
    
//     // Reset the stored references
//     itemToDelete = null;
//     deleteButtonElement = null;
//     deleteType = null;
// }

// // Event listeners for all content areas
// if (messageTableBody && messageModal) {
//     messageTableBody.addEventListener('click', async (event) => {
//         const viewButton = event.target.closest('.message-view-btn');
//         const deleteButton = event.target.closest('.message-delete-btn');

//         if (viewButton) {
//             const messageId = viewButton.dataset.id;
//             console.log('View message button clicked for ID:', messageId);
//             if (!messageId) return;

//             viewButton.disabled = true;
//             try {
//                 const response = await fetch(`/messages/${messageId}`);
//                 if (!response.ok) {
//                     const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
//                     throw new Error(errorData.message);
//                 }
//                 const messageDetails = await response.json();
//                 populateMessageModal(messageDetails);
//                 openModal(messageModal);
//             } catch (error) {
//                 console.error('Error fetching message details:', error);
//                 showNotification(`Could not load message details: ${error.message}`, "error");
//             } finally {
//                 viewButton.disabled = false;
//             }
//         }

//         if (deleteButton) {
//             const messageId = deleteButton.dataset.id;
//             console.log('Delete message button clicked for ID:', messageId);
//             if (!messageId) return;
//             await deleteMessage(messageId, deleteButton);
//         }
//     });

//     // Close Message modal handlers
//     closeMessageModalHeaderBtn?.addEventListener('click', () => closeModal(messageModal));
//     closeMessageModalFooterBtn?.addEventListener('click', () => closeModal(messageModal));
//     messageModal.addEventListener('click', (e) => {
//         if (e.target === messageModal) {
//             closeModal(messageModal);
//         }
//     });
// }

// if (complianceTableBody && complianceModal) {
//     complianceTableBody.addEventListener('click', async (event) => {
//         const viewButton = event.target.closest('.compliance-view-btn');
//         const deleteButton = event.target.closest('.compliance-delete-btn');

//         if (viewButton) {
//             const complianceId = viewButton.dataset.id;
//             console.log('View compliance button clicked for ID:', complianceId);
//             if (!complianceId) return;

//              viewButton.disabled = true;
//             try {
//                 const response = await fetch(`/compliances/${complianceId}`);
//                 if (!response.ok) {
//                     const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
//                     throw new Error(errorData.message);
//                 }
//                 const complianceDetails = await response.json();
//                 populateComplianceModal(complianceDetails);
//                 openModal(complianceModal);
//             } catch (error) {
//                 console.error('Error fetching compliance details:', error);
//                 showNotification(`Could not load compliance details: ${error.message}`, "error");
//             } finally {
//                  viewButton.disabled = false;
//             }
//         }

//         if (deleteButton) {
//             const complianceId = deleteButton.dataset.id;
//             console.log('Delete compliance button clicked for ID:', complianceId);
//             if (!complianceId) return;
//             await deleteCompliance(complianceId, deleteButton);
//         }
//     });

//     // Close Compliance modal handlers
//     closeComplianceModalHeaderBtn?.addEventListener('click', () => closeModal(complianceModal));
//     closeComplianceModalFooterBtn?.addEventListener('click', () => closeModal(complianceModal));
//      complianceModal.addEventListener('click', (e) => {
//         if (e.target === complianceModal) {
//             closeModal(complianceModal);
//         }
//     });
// }

// if (improvementTableBody && improvementModal) {
//     improvementTableBody.addEventListener('click', async (event) => {
//         const viewButton = event.target.closest('.improvement-view-btn');
//         const deleteButton = event.target.closest('.improvement-delete-btn');

//         if (viewButton) {
//             const improvementId = viewButton.dataset.id;
//             console.log('View improvement button clicked for ID:', improvementId);
//             if (!improvementId) return;

//             viewButton.disabled = true;
//             try {
//                 const response = await fetch(`/improvements/${improvementId}`);
//                  if (!response.ok) {
//                     const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
//                     throw new Error(errorData.message);
//                 }
//                 const improvementDetails = await response.json();
//                 populateImprovementModal(improvementDetails);
//                 openModal(improvementModal);
//             } catch (error) {
//                 console.error('Error fetching improvement details:', error);
//                 showNotification(`Could not load improvement details: ${error.message}`, "error");
//             } finally {
//                 viewButton.disabled = false;
//             }
//         }

//         if (deleteButton) {
//             const improvementId = deleteButton.dataset.id;
//             console.log('Delete improvement button clicked for ID:', improvementId);
//             if (!improvementId) return;
//             await deleteImprovement(improvementId, deleteButton);
//         }
//     });

//     // Close Improvement modal handlers
//     closeImprovementModalHeaderBtn?.addEventListener('click', () => closeModal(improvementModal));
//     closeImprovementModalFooterBtn?.addEventListener('click', () => closeModal(improvementModal));
//      improvementModal.addEventListener('click', (e) => {
//         if (e.target === improvementModal) {
//             closeModal(improvementModal);
//         }
//     });
// }

// // Common confirmation modal event handlers
// confirmDeleteBtn?.addEventListener('click', async () => {
//     // Hide the modal first
//     deleteConfirmModal.style.display = 'none';
    
//     // Perform the appropriate deletion based on type
//     if (deleteType === "message") {
//         await performMessageDeletion();
//     } else if (deleteType === "compliance") {
//         await performComplianceDeletion();
//     } else if (deleteType === "improvement") {
//         await performImprovementDeletion();
//     }
// });

// cancelDeleteBtn?.addEventListener('click', () => {
//     // Just hide the modal and reset the references
//     deleteConfirmModal.style.display = 'none';
//     itemToDelete = null;
//     deleteButtonElement = null;
//     deleteType = null;
// });

// // Add a click handler for the modal background to close it
// deleteConfirmModal?.addEventListener('click', (e) => {
//     if (e.target === deleteConfirmModal) {
//         deleteConfirmModal.style.display = 'none';
//         itemToDelete = null;
//         deleteButtonElement = null;
//         deleteType = null;
//     }
// });