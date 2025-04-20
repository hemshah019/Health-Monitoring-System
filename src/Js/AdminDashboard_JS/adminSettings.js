document.addEventListener('DOMContentLoaded', function() {
    // Get all the necessary elements
    const saveBtn = document.querySelector('.save-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const deleteAccountBtn = document.querySelector('.delete-account-btn');
    
    // Store original values when page loads
    const originalValues = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: '' // Password is empty by default for security
    };

    // Save button click handler
    saveBtn.addEventListener('click', async function() {
        try {
            // Get updated values
            const updatedData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                email: document.getElementById('email').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

            // Basic validation
            if (!updatedData.firstName || !updatedData.lastName || !updatedData.email) {
                showAlert('Please fill in all required fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(updatedData.email)) {
                showAlert('Please enter a valid email address', 'error');
                return;
            }

            // Send update request to server
            const response = await fetch('/updateAdminProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();

            if (response.ok) {
                showAlert('Your profile has been updated successfully!', 'success');
                Object.assign(originalValues, updatedData);
                document.getElementById('password').value = '';
            } else {
                showAlert(result.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('An error occurred while updating your profile', 'error');
        }
    });

    // Cancel button click handler
    cancelBtn.addEventListener('click', function() {
        // Restore original values
        document.getElementById('firstName').value = originalValues.firstName;
        document.getElementById('lastName').value = originalValues.lastName;
        document.getElementById('phoneNumber').value = originalValues.phoneNumber;
        document.getElementById('email').value = originalValues.email;
        document.getElementById('username').value = originalValues.username;
        document.getElementById('password').value = '';
        
        showAlert('Your changes have been canceled', 'info');
    });

    // Delete account button click handler
    deleteAccountBtn.addEventListener('click', function() {
        // Create confirmation modal
        const modal = document.createElement('div');
        modal.className = 'confirmation-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Confirm Account Deletion</h3>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div class="modal-actions">
                    <button class="modal-cancel-btn">Cancel</button>
                    <button class="modal-confirm-btn">Delete Account</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Add styles for the modal
        const style = document.createElement('style');
        style.textContent = `
            .confirmation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                width: 400px;
                max-width: 90%;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .modal-content h3 {
                margin-top: 0;
                color: #333;
            }
            .modal-content p {
                margin-bottom: 20px;
                color: #666;
            }
            .modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .modal-cancel-btn, .modal-confirm-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
            }
            .modal-cancel-btn {
                background-color: #f0f0f0;
                color: #333;
            }
            .modal-confirm-btn {
                background-color: #e74c3c;
                color: white;
            }
            .modal-confirm-btn:hover {
                background-color: #c0392b;
            }
        `;
        document.head.appendChild(style);

        // Handle cancel button in modal
        modal.querySelector('.modal-cancel-btn').addEventListener('click', function() {
            document.body.removeChild(modal);
            document.head.removeChild(style);
            showAlert('Account deletion canceled', 'info');
        });

        // Handle confirm button in modal
        modal.querySelector('.modal-confirm-btn').addEventListener('click', async function() {
            try {
                const response = await fetch('/deleteAdminAccount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert('Your account has been deleted successfully. Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = '/logout';
                    }, 2000);
                } else {
                    showAlert(result.message || 'Failed to delete account', 'error');
                    document.body.removeChild(modal);
                    document.head.removeChild(style);
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                showAlert('An error occurred while deleting your account', 'error');
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });
    });

    // Function to show alert messages
    function showAlert(message, type) {
        // Remove any existing alerts
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.textContent = message;

        // Add styles for the alert
        const style = document.createElement('style');
        style.textContent = `
            .custom-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }
            .custom-alert.success {
                background-color: #2ecc71;
            }
            .custom-alert.error {
                background-color: #e74c3c;
            }
            .custom-alert.info {
                background-color: #3498db;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(alert);

        // Remove alert after 3 seconds
        setTimeout(() => {
            alert.remove();
            document.head.removeChild(style);
        }, 3000);
    }
});