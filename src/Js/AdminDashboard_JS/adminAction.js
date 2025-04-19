document.addEventListener('DOMContentLoaded', () => {

    // --- Helper function to update status badge ---
    function updateStatusBadge(tableSelector, itemId, newStatus) {
        const buttonInRow = document.querySelector(`${tableSelector} button[data-id="${itemId}"]`);
        if (!buttonInRow) {
            console.warn(`Could not find button for item ID ${itemId} in table ${tableSelector} to update status.`);
            return;
        }
        const row = buttonInRow.closest('tr');
        if (!row) {
            console.warn(`Could not find table row for item ID ${itemId} using button.`);
            return;
        }

        // Find the status badge span using the data-field attribute
        const statusBadge = row.querySelector('span[data-field="status-badge"]');
        if (!statusBadge) {
            console.warn(`Could not find status badge span in row for item ID ${itemId}.`);
            return;
        }

        // Update the text content
        statusBadge.textContent = newStatus;

        // Update the CSS class
        const statusClass = `status-${newStatus.toLowerCase().replace(/ /g, '-')}`;
        statusBadge.className = `status-badge ${statusClass}`;

        console.log(`Updated status badge for item ID ${itemId} to: ${newStatus}`);
    }


    // MESSAGES VIEW MODAL
    const messageModal = document.getElementById('messageViewModal');
    const closeMessageModalBtn = document.getElementById('closeMessageModal');
    const closeMessageModalFooterBtn = document.getElementById('closeMessageModalBtn');
    const messageViewButtons = document.querySelectorAll('.message-view-btn');

    // Function to populate the VIEW modal with fetched data
    function populateMessageModal(data) {
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            try {
                return dayjs(dateString).isValid() ? dayjs(dateString).format('DD-MM-YYYY h:mm A') : dateString;
            } catch (e) {
                return dateString;
            }
        };

        document.getElementById('message_view_id').textContent = `#M${data.Message_ID}`;
        document.getElementById('message_view_patient_name').textContent = data.patientFullName || 'Unknown Patient';
        document.getElementById('message_view_type').textContent = data.Message_Type || 'N/A';
        document.getElementById('message_view_content').textContent = data.Message_Content || 'N/A';
        document.getElementById('message_view_datetime').textContent = formatDate(data.Message_Sent_DateTime);
        document.getElementById('message_view_response').textContent = data.Admin_Response || 'Not Yet Responded';
        document.getElementById('message_view_responsedate').textContent = formatDate(data.Response_Date);
        document.getElementById('message_view_status').textContent = data.Status || 'N/A';

        // Optionally update status badge class
        const statusBadge = document.getElementById('message_view_status');
        if (statusBadge) {
             statusBadge.className = `info-field-value status-badge status-${(data.Status || '').toLowerCase().replace(' ', '-')}`;
        }
    }

    // Add click listeners to all VIEW buttons
    messageViewButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const messageId = this.getAttribute('data-id');
            if (!messageId) return;

            console.log(`Fetching details for message ID: ${messageId}`);
            try {
                const response = await fetch(`/admin/messages/${messageId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const messageData = await response.json();
                console.log('Received message data:', messageData);

                populateMessageModal(messageData);
                messageModal.classList.add('active');

            } catch (error) {
                console.error('Error fetching message details:', error);
                alert(`Failed to load message details: ${error.message}`);
            }
        });
    });

    // Close Message VIEW modal handlers
    function closeViewModal() {
        messageModal.classList.remove('active');
    }
    closeMessageModalBtn.addEventListener('click', closeViewModal);
    closeMessageModalFooterBtn.addEventListener('click', closeViewModal);
    messageModal.addEventListener('click', function(e) {
        if (e.target === messageModal) {
            closeViewModal();
        }
    });


    // MESSAGE RESPONSE MODAL
    const messageResponseModal = document.getElementById('messageResponseModal');
    const closeMessageResponseModal = document.getElementById('closeMessageResponseModal');
    const cancelMessageResponse = document.getElementById('cancelMessageResponse');
    const messageResponseButtons = document.querySelectorAll('.message-response-btn');
    const messageResponseForm = document.getElementById('messageResponseForm');

    // Function to populate the RESPONSE form with fetched data
    function populateMessageResponseForm(data) {
         const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            try {
                return dayjs(dateString).isValid() ? dayjs(dateString).format('DD-MM-YYYY h:mm A') : dateString;
            } catch (e) {
                return dateString;
            }
        };

        document.getElementById('response_message_id').value = `#M${data.Message_ID}`;
        document.getElementById('response_patient_name').value = data.patientFullName || 'Unknown Patient';
        document.getElementById('response_message_type').value = data.Message_Type || 'N/A';
        document.getElementById('response_message_content').value = data.Message_Content || 'N/A';
        document.getElementById('response_message_date').value = formatDate(data.Message_Sent_DateTime);
        document.getElementById('admin_response').value = data.Admin_Response || '';
        document.getElementById('response_status').value = data.Status || 'Pending';

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('response_date').value = data.Response_Date
            ? new Date(data.Response_Date).toISOString().split('T')[0]
            : today;
    }

    // Add click listeners to all RESPONSE buttons
    messageResponseButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const messageId = this.getAttribute('data-id');
            if (!messageId) return;

            console.log(`Fetching details for response form, message ID: ${messageId}`);
            try {
                const response = await fetch(`/admin/messages/${messageId}`);
                if (!response.ok) {
                     const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const messageData = await response.json();

                // Populate and show the modal
                populateMessageResponseForm(messageData);
                messageResponseModal.classList.add('active');

            } catch (error) {
                console.error('Error fetching message details for response form:', error);
                alert(`Failed to load message details for response: ${error.message}`);
            }
        });
    });

    // Close Message RESPONSE modal handlers
    function closeResponseModal() {
         messageResponseModal.classList.remove('active');
         messageResponseForm.reset();
    }
    closeMessageResponseModal.addEventListener('click', closeResponseModal);
    cancelMessageResponse.addEventListener('click', closeResponseModal);
    messageResponseModal.addEventListener('click', function(e) {
        if (e.target === messageResponseModal) {
            closeResponseModal();
        }
    });

    // Handle RESPONSE form submission
    messageResponseForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const messageIdInput = document.getElementById('response_message_id').value;
        const messageId = messageIdInput.replace('#M', '');

        const formData = {
            admin_response: document.getElementById('admin_response').value,
            response_status: document.getElementById('response_status').value,
            response_date: document.getElementById('response_date').value,
        };

        console.log(`Submitting response for message ID: ${messageId}`);

        try {
            const response = await fetch(`/admin/messages/respond/${messageId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            alert('Response submitted successfully!');

            const newStatus = result.updatedMessage.Status;
            updateStatusBadge('.messages-table', messageId, newStatus);
            closeResponseModal();
            // location.reload();

        } catch (error) {
            console.error('Error submitting response:', error);
            alert(`Failed to submit response: ${error.message}`);
        }
    });

    // MESSAGE DELETE ACTION
    const messageDeleteButtons = document.querySelectorAll('.message-delete-btn');

    messageDeleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const messageId = this.getAttribute('data-id');
            if (!messageId) return;

            if (!confirm(`Are you sure you want to delete message #M${messageId}? This action cannot be undone.`)) {
                return;
            }

            console.log(`Attempting to delete message ID: ${messageId}`);
            try {
                const response = await fetch(`/admin/messages/${messageId}`, {
                    method: 'DELETE',
                });

                const result = await response.json();

                if (!response.ok) {
                     throw new Error(result.message || `HTTP error! status: ${response.status}`);
                }

                alert(result.message || 'Message deleted successfully!');

                // Remove the table row from the UI
                const row = this.closest('tr');
                if (row) {
                    row.remove();
                     const tbody = document.querySelector('.messages-table tbody');
                     if (tbody && tbody.children.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No messages found.</td></tr>';
                     }
                } else {
                    location.reload();
                }

            } catch (error) {
                 console.error('Error deleting message:', error);
                alert(`Failed to delete message: ${error.message}`);
            }
        });
    });

    // COMPLIANCE VIEW MODAL
    const complianceModal = document.getElementById('complianceViewModal');
    const closeComplianceModal = document.getElementById('closeComplianceModal');
    const closeComplianceBtn = document.getElementById('closeComplianceModalBtn');
    const complianceViewButtons = document.querySelectorAll('.compliance-view-btn');

    // Function to populate the Compliance VIEW modal
    function populateComplianceModal(data) {
        const formatDate = (dateString) => {
             if (!dateString) return 'N/A';
            try {
                return dayjs(dateString).isValid() ? dayjs(dateString).format('DD-MM-YYYY h:mm A') : dateString;
            } catch (e) { return dateString; }
        };

        document.getElementById('compliance_view_id').textContent = `#C${data.Compliance_ID}`;
        document.getElementById('compliance_view_patient_name').textContent = data.patientFullName || 'Unknown Patient';
        document.getElementById('compliance_view_patient_email').textContent = data.patientEmail || 'N/A';
        document.getElementById('compliance_view_notes').textContent = data.Compliance_Notes || 'N/A';
        document.getElementById('compliance_view_status').textContent = data.Status || 'N/A';
        document.getElementById('compliance_view_date').textContent = formatDate(data.Compliance_Date);
        document.getElementById('compliance_view_response').textContent = formatDate(data.Feedback_Date);
        document.getElementById('compliance_view_feedback').textContent = data.Admin_Feedback || 'No Feedback Yet';
    }

    // Add click listeners to all Compliance VIEW buttons
    complianceViewButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const complianceId = this.getAttribute('data-id');
            if (!complianceId) return;

            console.log(`Fetching details for compliance ID: ${complianceId}`);
            try {
                const response = await fetch(`/admin/compliances/${complianceId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const complianceData = await response.json();
                console.log('Received compliance data:', complianceData);

                populateComplianceModal(complianceData);
                complianceModal.classList.add('active');

            } catch (error) {
                console.error('Error fetching compliance details:', error);
                alert(`Failed to load compliance details: ${error.message}`);
            }
        });
    });

    // Close Compliance VIEW modal handlers
    function closeComplianceViewModal() {
        complianceModal.classList.remove('active');
    }
    closeComplianceModal.addEventListener('click', closeComplianceViewModal);
    closeComplianceBtn.addEventListener('click', closeComplianceViewModal);
    complianceModal.addEventListener('click', function(e) {
        if (e.target === complianceModal) {
            closeComplianceViewModal();
        }
    });


    // COMPLIANCE FEEDBACK MODAL (RESPONSE)
    const complianceResponseModal = document.getElementById('complianceResponseModal');
    const closeComplianceResponseModal = document.getElementById('closeComplianceResponseModal');
    const cancelComplianceResponse = document.getElementById('cancelComplianceResponse');
    const complianceResponseButtons = document.querySelectorAll('.compliance-response-btn');
    const complianceResponseForm = document.getElementById('complianceResponseForm');

     // Function to populate the Compliance FEEDBACK form
    function populateComplianceResponseForm(data) {
        const formatDate = (dateString) => {
             if (!dateString) return 'N/A';
            try {
                return dayjs(dateString).isValid() ? dayjs(dateString).format('DD-MM-YYYY h:mm A') : dateString;
            } catch (e) { return dateString; }
        };

        document.getElementById('response_compliance_id').value = `#C${data.Compliance_ID}`;
        document.getElementById('response_compliance_patient').value = data.patientFullName || 'Unknown Patient';
        document.getElementById('response_compliance_notes').value = data.Compliance_Notes || 'N/A';
        document.getElementById('response_compliance_date').value = formatDate(data.Compliance_Date);

        // Pre-fill feedback if it exists
        document.getElementById('admin_feedback').value = data.Admin_Feedback || '';

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('feedback_date').value = data.Feedback_Date
             ? new Date(data.Feedback_Date).toISOString().split('T')[0]
             : today;
    }

    // Add click listeners to all Compliance FEEDBACK buttons
    complianceResponseButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const complianceId = this.getAttribute('data-id');
            if (!complianceId) return;

            console.log(`Fetching details for compliance feedback form, ID: ${complianceId}`);
            try {
                const response = await fetch(`/admin/compliances/${complianceId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const complianceData = await response.json();

                populateComplianceResponseForm(complianceData);
                complianceResponseModal.classList.add('active');

            } catch (error) {
                console.error('Error fetching compliance details for feedback form:', error);
                alert(`Failed to load compliance details for feedback: ${error.message}`);
            }
        });
    });

    // Close Compliance FEEDBACK modal handlers
    function closeComplianceResponseModalFunc() {
        complianceResponseModal.classList.remove('active');
        complianceResponseForm.reset();
    }
    closeComplianceResponseModal.addEventListener('click', closeComplianceResponseModalFunc);
    cancelComplianceResponse.addEventListener('click', closeComplianceResponseModalFunc);
    complianceResponseModal.addEventListener('click', function(e) {
        if (e.target === complianceResponseModal) {
            closeComplianceResponseModalFunc();
        }
    });

    // Handle Compliance FEEDBACK form submission
    complianceResponseForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const complianceIdInput = document.getElementById('response_compliance_id').value;
        const complianceId = complianceIdInput.replace('#C', '');

         // Read the selected status from the dropdown
        const selectedStatus = document.getElementById('compliance_status').value;

        const formData = {
            admin_feedback: document.getElementById('admin_feedback').value,
            compliance_status: selectedStatus,
            feedback_date: document.getElementById('feedback_date').value,
        };

        console.log(`Submitting feedback for compliance ID: ${complianceId} with status: ${selectedStatus}`);

        try {
            const response = await fetch(`/admin/compliances/feedback/${complianceId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            alert(result.message || 'Feedback submitted successfully!');

            const newStatus = result.updatedCompliance.Status;
            updateStatusBadge('.compliance-table', complianceId, newStatus); 
            closeComplianceResponseModalFunc();
            // location.reload();

        } catch (error) {
            console.error('Error submitting compliance feedback:', error);
            alert(`Failed to submit feedback: ${error.message}`);
        }
    });

    // COMPLIANCE DELETE ACTION
    const complianceDeleteButtons = document.querySelectorAll('.compliance-delete-btn');

    complianceDeleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const complianceId = this.getAttribute('data-id');
            if (!complianceId) return;

            if (!confirm(`Are you sure you want to delete compliance record #C${complianceId}? This action cannot be undone.`)) {
                return;
            }

            console.log(`Attempting to delete compliance ID: ${complianceId}`);
            try {
                const response = await fetch(`/admin/compliances/${complianceId}`, {
                    method: 'DELETE',
                });

                const result = await response.json();
                if (!response.ok) {
                     throw new Error(result.message || `HTTP error! status: ${response.status}`);
                }
                alert(result.message || 'Compliance record deleted successfully!');

                const row = this.closest('tr');
                if (row) {
                    row.remove();
                    const tbody = document.querySelector('.compliance-table tbody');
                    if (tbody && tbody.children.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No compliance records found.</td></tr>';
                    }
                } else {
                    location.reload();
                }

            } catch (error) {
                 console.error('Error deleting compliance record:', error);
                alert(`Failed to delete compliance record: ${error.message}`);
            }
        });
    });

    // IMPROVEMENT VIEW MODAL
    const improvementModal = document.getElementById('improvementViewModal');
    const closeImprovementModal = document.getElementById('closeImprovementModal');
    const closeImprovementBtn = document.getElementById('closeImprovementModalBtn');
    const improvementViewButtons = document.querySelectorAll('.improvement-view-btn');

    // Function to populate the Improvement VIEW modal
    function populateImprovementModal(data) {
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            try {
                return dayjs(dateString).isValid() ? dayjs(dateString).format('DD-MM-YYYY h:mm A') : dateString;
            } catch (e) { return dateString; }
        };
        const formatImplementationDate = (dateString) => {
            if (!dateString) return '-';
            try {
                const date = dayjs(dateString);
                return date.isValid() ? date.format('DD-MM-YYYY') : '-';
            } catch (e) {
                console.error("Error formatting implementation date for display:", e);
                return '-';
            }
        }

        document.getElementById('improvement_view_id').textContent = `#I${data.Improvement_ID}`;
        document.getElementById('improvement_view_submitted_by').textContent = data.patientFullName || 'Unknown Patient';
        document.getElementById('improvement_view_email').textContent = data.patientEmail || 'N/A';
        document.getElementById('improvement_view_category').textContent = data.Category || 'N/A';
        document.getElementById('improvement_view_description').textContent = data.Suggestion_Description || 'N/A';
        document.getElementById('improvement_view_date').textContent = formatDate(data.Date_Submitted);
        document.getElementById('improvement_view_status').textContent = data.Status || 'N/A';
        document.getElementById('improvement_view_response').textContent = data.Admin_Response || 'No Response Yet';

        console.log('Raw Implementation_Date in populateImprovementModal:', data.Implementation_Date); // Add for debugging
        document.getElementById('improvement_view_implementation_date').textContent = formatImplementationDate(data.Implementation_Date);
    }

    // Add click listeners to all Improvement VIEW buttons
    improvementViewButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const improvementId = this.getAttribute('data-id');
            if (!improvementId) return;

            console.log(`Fetching details for improvement ID: ${improvementId}`);
            try {
                const response = await fetch(`/admin/improvements/${improvementId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const improvementData = await response.json();
                console.log('Received improvement data:', improvementData);

                populateImprovementModal(improvementData);
                improvementModal.classList.add('active');

            } catch (error) {
                console.error('Error fetching improvement details:', error);
                alert(`Failed to load improvement details: ${error.message}`);
            }
        });
    });

    // Close Improvement VIEW modal handlers
    function closeImprovementViewModal() {
        improvementModal.classList.remove('active');
    }
    closeImprovementModal.addEventListener('click', closeImprovementViewModal);
    closeImprovementBtn.addEventListener('click', closeImprovementViewModal);
    improvementModal.addEventListener('click', function(e) {
        if (e.target === improvementModal) {
            closeImprovementViewModal();
        }
    });


    // IMPROVEMENT RESPONSE MODAL
    const improvementResponseModal = document.getElementById('improvementResponseModal');
    const closeImprovementResponseModal = document.getElementById('closeImprovementResponseModal');
    const cancelImprovementResponse = document.getElementById('cancelImprovementResponse');
    const improvementResponseButtons = document.querySelectorAll('.improvement-response-btn');
    const improvementResponseForm = document.getElementById('improvementResponseForm');

     // Function to populate the Improvement RESPONSE form
    function populateImprovementResponseForm(data) {
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            try {
                return dayjs(dateString).isValid() ? dayjs(dateString).format('DD-MM-YYYY h:mm A') : dateString;
            } catch (e) { return dateString; }
        };

        // const formatImplementationDate = (dateString) => {
        //      if (!dateString) return '';
        //      try {
        //          const date = dayjs(dateString);
        //          return date.isValid() ? date.format('YYYY-MM-DD') : '';
        //      } catch (e) { return ''; }
        // };

        document.getElementById('response_improvement_id').value = `#I${data.Improvement_ID}`;
        document.getElementById('response_improvement_submitter').value = data.patientFullName || 'Unknown Patient';
        document.getElementById('response_improvement_category').value = data.Category || 'N/A';
        document.getElementById('response_improvement_description').value = data.Suggestion_Description || 'N/A';
        document.getElementById('response_improvement_date').value = formatDate(data.Date_Submitted);

        // Pre-fill existing response data
        document.getElementById('improvement_response').value = data.Admin_Response || '';
        document.getElementById('improvement_status').value = data.Status || 'Pending';
        document.getElementById('implementation_date').value = data.Implementation_Date
        ? new Date(data.Implementation_Date).toISOString().split('T')[0] : ''; 
    }

    // Add click listeners to all Improvement RESPONSE buttons
    improvementResponseButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const improvementId = this.getAttribute('data-id');
            if (!improvementId) return;

            console.log(`Fetching details for improvement response form, ID: ${improvementId}`);
            try {
                const response = await fetch(`/admin/improvements/${improvementId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const improvementData = await response.json();

                console.log('Received improvement data object:', improvementData);
                // Check the specific property value and type
                console.log('Value of improvementData.Implementation_Date:', improvementData.Implementation_Date);
                console.log('Type of improvementData.Implementation_Date:', typeof improvementData.Implementation_Date);

                populateImprovementResponseForm(improvementData);
                improvementResponseModal.classList.add('active');

            } catch (error) {
                console.error('Error fetching improvement details for response form:', error);
                alert(`Failed to load improvement details for response: ${error.message}`);
            }
        });
    });

    // Close Improvement RESPONSE modal handlers
    function closeImprovementResponseModalFunc() {
        improvementResponseModal.classList.remove('active');
        improvementResponseForm.reset();
    }
    closeImprovementResponseModal.addEventListener('click', closeImprovementResponseModalFunc);
    cancelImprovementResponse.addEventListener('click', closeImprovementResponseModalFunc);
    improvementResponseModal.addEventListener('click', function(e) {
        if (e.target === improvementResponseModal) {
            closeImprovementResponseModalFunc();
        }
    });

    // Handle Improvement RESPONSE form submission
    improvementResponseForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const improvementIdInput = document.getElementById('response_improvement_id').value;
        const improvementId = improvementIdInput.replace('#I', '');
        const implementationDateValue = document.getElementById('implementation_date').value;

        const formData = {
            improvement_response: document.getElementById('improvement_response').value,
            improvement_status: document.getElementById('improvement_status').value,
            implementation_date: implementationDateValue || null,
        };

        console.log(`Submitting response for improvement ID: ${improvementId}`, formData);

        try {
            const response = await fetch(`/admin/improvements/respond/${improvementId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }

            alert(result.message || 'Response submitted successfully!');

            const newStatus = result.updatedImprovement.Status; // Get new status from response
            updateStatusBadge('.improvement-table', improvementId, newStatus); 

            closeImprovementResponseModalFunc();
            // location.reload();

        } catch (error) {
            console.error('Error submitting improvement response:', error);
            alert(`Failed to submit response: ${error.message}`);
        }
    });

    // IMPROVEMENT DELETE ACTION
    const improvementDeleteButtons = document.querySelectorAll('.improvement-delete-btn');
    improvementDeleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const improvementId = this.getAttribute('data-id');
            if (!improvementId) return;

            if (!confirm(`Are you sure you want to delete improvement suggestion #I${improvementId}? This action cannot be undone.`)) {
                return;
            }

            console.log(`Attempting to delete improvement ID: ${improvementId}`);
            try {
                const response = await fetch(`/admin/improvements/${improvementId}`, {
                    method: 'DELETE',
                });

                const result = await response.json();
                if (!response.ok) {
                     throw new Error(result.message || `HTTP error! status: ${response.status}`);
                }
                alert(result.message || 'Improvement suggestion deleted successfully!');

                const row = this.closest('tr');
                if (row) {
                    row.remove();
                    const tbody = document.querySelector('.improvement-table tbody');
                    if (tbody && tbody.children.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px;">No improvement suggestions found.</td></tr>';
                    }
                } else {
                    location.reload();
                }

            } catch (error) {
                 console.error('Error deleting improvement suggestion:', error);
                alert(`Failed to delete improvement suggestion: ${error.message}`);
            }
        });
    });


    // PATIENT VIEW MODAL
    const patientModal = document.getElementById('patientViewModal');
    const closePatientModalBtn = document.getElementById('closePatientModal');
    const closePatientModalFooterBtn = document.getElementById('closePatientModalBtn');
    const patientViewButtons = document.querySelectorAll('.patient-view-btn');
    const patientDeleteButtons = document.querySelectorAll('.patient-delete-btn');

    // Helper to format dates (similar to others, ensure dayjs is available)
    const formatPatientDate = (dateString, format = 'DD-MM-YYYY') => {
        if (!dateString) return 'N/A';
        try {
            const date = dayjs(dateString);
            return date.isValid() ? date.format(format) : 'Invalid Date';
        } catch (e) {
            return dateString;
        }
    };
     const formatPatientEnrollmentDate = (dateString) => {
        if (!dateString) return 'N/A';

        if (typeof dateString === 'string' && dateString.includes(',')) {
            return dateString;
        }
        try {
            const date = dayjs(dateString);
             return date.isValid() ? date.format('dddd, D MMMM YYYY h:mm A') : 'Invalid Date';
        } catch (e) {
            return dateString;
        }
    };


    // Function to populate the Patient VIEW modal
    function populatePatientModal(data) {
        document.getElementById('view_patient_id').textContent = `#P${data.Patient_ID || 'N/A'}`;
        document.getElementById('view_username').textContent = data.Username || 'N/A';
        document.getElementById('view_first_name').textContent = data.First_Name || 'N/A';
        document.getElementById('view_last_name').textContent = data.Last_Name || 'N/A';
        document.getElementById('view_age').textContent = data.Age ? `${data.Age} years` : 'N/A';
        document.getElementById('view_dob').textContent = formatPatientDate(data.Date_Of_Birth);
        document.getElementById('view_gender').textContent = data.Gender || 'N/A';
        document.getElementById('view_phone').textContent = data.Phone_Number || 'N/A';
        document.getElementById('view_email').textContent = data.Email || 'N/A';
        document.getElementById('view_address').textContent = data.Address || 'N/A';
        document.getElementById('view_status').textContent = 'Enrolled';
        document.getElementById('view_date').textContent = formatPatientEnrollmentDate(data.Enrollment_DateTime);
    }

    // Add click listeners to all Patient VIEW buttons
    patientViewButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const patientId = this.getAttribute('data-id');
            if (!patientId) return;

            console.log(`Fetching details for patient ID: ${patientId}`);
            try {
                const response = await fetch(`/admin/patients/${patientId}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
                }
                const patientData = await response.json();
                console.log('Received patient data:', patientData);

                populatePatientModal(patientData);
                patientModal.classList.add('active');

            } catch (error) {
                console.error('Error fetching patient details:', error);
                alert(`Failed to load patient details: ${error.message}`);
            }
        });
    });

    // Close Patient VIEW modal handlers
    function closePatientViewModal() {
        patientModal.classList.remove('active');
    }
    closePatientModalBtn.addEventListener('click', closePatientViewModal);
    closePatientModalFooterBtn.addEventListener('click', closePatientViewModal);
    patientModal.addEventListener('click', function(e) {
        if (e.target === patientModal) {
            closePatientViewModal();
        }
    });

    // PATIENT DELETE ACTION
    patientDeleteButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const patientId = this.getAttribute('data-id');
            if (!patientId) return;

            if (!confirm(`Are you sure you want to delete patient #P${patientId}? This action cannot be undone.`)) {
                return;
            }

            console.log(`Attempting to delete patient ID: ${patientId}`);
            try {
                const response = await fetch(`/admin/patients/${patientId}`, {
                    method: 'DELETE',
                });

                const result = await response.json();

                if (!response.ok) {
                     throw new Error(result.message || `HTTP error! status: ${response.status}`);
                }
                alert(result.message || 'Patient deleted successfully!');

                // Remove the table row from the UI
                const row = this.closest('tr');
                if (row) {
                    row.remove();
                    const tbody = document.querySelector('.patients-table tbody');
                    if (tbody && tbody.children.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">No patients found.</td></tr>';
                    }
                } else {
                    console.warn("Could not find row to remove, reloading page as fallback.");
                    location.reload();
                }

            } catch (error) {
                 console.error('Error deleting patient:', error);
                alert(`Failed to delete patient: ${error.message}`);
            }
        });
    });
});