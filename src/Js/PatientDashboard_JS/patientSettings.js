document.addEventListener('DOMContentLoaded', function () {
    const settingsContent = document.querySelector('.settings-content');

    const saveBtn = settingsContent?.querySelector('.save-btn');
    const cancelBtn = settingsContent?.querySelector('.cancel-btn');
    const deleteAccountBtn = settingsContent?.querySelector('.delete-account-btn');

    const getValue = id => document.getElementById(id)?.value || '';
    const setValue = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    const originalValues = {
        settings_username: getValue('settings_username'),
        firstName: getValue('firstName'),
        lastName: getValue('lastName'),
        age: getValue('age'),
        dob: getValue('dob'),
        gender: getValue('gender'),
        settings_phoneNumber: getValue('settings_phoneNumber'),
        settings_email: getValue('settings_email'),
        settings_address: getValue('settings_address'),
    };

    cancelBtn?.addEventListener('click', function () {
        Object.entries(originalValues).forEach(([id, val]) => setValue(id, val));
        showAlert('Your changes have been canceled', 'info');
    });

    saveBtn?.addEventListener('click', async function () {
        const updatedData = {
            username: getValue('settings_username'),
            firstName: getValue('firstName'),
            lastName: getValue('lastName'),
            age: getValue('age'),
            dob: getValue('dob'),
            gender: getValue('gender'),
            phoneNumber: getValue('settings_phoneNumber'),
            email: getValue('settings_email'),
            address: getValue('settings_address')
        };

        if (!updatedData.firstName || !updatedData.lastName || !updatedData.email || !updatedData.phoneNumber) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updatedData.email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }

        const phoneRegex = /^[0-9]{10,15}$/;
        if (!phoneRegex.test(updatedData.phoneNumber)) {
            showAlert('Please enter a valid phone number (10-15 digits)', 'error');
            return;
        }

        if (updatedData.age && (updatedData.age < 0 || updatedData.age > 120)) {
            showAlert('Please enter a valid age (0-120)', 'error');
            return;
        }

        try {
            const response = await fetch('/updatePatientProfile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();
            if (response.ok) {
                showAlert('Your profile has been updated successfully!', 'success');
                Object.assign(originalValues, {
                    settings_username: updatedData.username,
                    firstName: updatedData.firstName,
                    lastName: updatedData.lastName,
                    age: updatedData.age,
                    dob: updatedData.dob,
                    gender: updatedData.gender,
                    settings_phoneNumber: updatedData.phoneNumber,
                    settings_email: updatedData.email,
                    settings_address: updatedData.address,
                });
            } else {
                showAlert(result.message || 'Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showAlert('An error occurred while updating your profile', 'error');
        }
    });

    deleteAccountBtn?.addEventListener('click', function () {
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

        const style = document.createElement('style');
        style.textContent = `
            .confirmation-modal {
                position: fixed; top: 0; left: 0;
                width: 100%; height: 100%;
                background-color: rgba(0,0,0,0.5);
                display: flex; justify-content: center; align-items: center;
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
            .modal-actions {
                display: flex; justify-content: flex-end; gap: 10px;
            }
            .modal-cancel-btn, .modal-confirm-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
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

        modal.querySelector('.modal-cancel-btn').addEventListener('click', () => {
            modal.remove();
            style.remove();
            showAlert('Account deletion canceled', 'info');
        });

        modal.querySelector('.modal-confirm-btn').addEventListener('click', async () => {
            try {
                const response = await fetch('/deletePatientAccount', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                const result = await response.json();
                if (response.ok) {
                    showAlert('Account deleted. Redirecting...', 'success');
                    setTimeout(() => { window.location.href = '/logout'; }, 2000);
                } else {
                    showAlert(result.message || 'Failed to delete account', 'error');
                    modal.remove();
                    style.remove();
                }
            } catch (error) {
                console.error('Delete Error:', error);
                showAlert('Error deleting your account', 'error');
                modal.remove();
                style.remove();
            }
        });
    });

    function showAlert(message, type) {
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = `custom-alert ${type}`;
        alert.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            .custom-alert {
                position: fixed;
                top: 20px; right: 20px;
                padding: 12px 20px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            }
            .custom-alert.success { background-color: #2ecc71; }
            .custom-alert.error { background-color: #e74c3c; }
            .custom-alert.info { background-color: #3498db; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
            style.remove();
        }, 3000);
    }
});
