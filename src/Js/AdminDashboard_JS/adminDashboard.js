// JS FOR AUTOMATICALLY GENERATED DATE
// Function to format date as "Day, DD Month YYYY" (e.g., "Friday, 29th March 2025")
function formatDate(date) {
    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Add suffix to day
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
        suffix = "st";
    } else if (day === 2 || day === 22) {
        suffix = "nd";
    } else if (day === 3 || day === 23) {
        suffix = "rd";
    }

    return `${dayOfWeek}, ${day}${suffix} ${month} ${year}`;
}

// Function to update all date elements dynamically
function updateAllDateTexts() {
    const todayFormatted = formatDate(new Date());
    const dateElements = document.querySelectorAll("[data-date]");

    dateElements.forEach(element => {
        element.textContent = todayFormatted;
    });
}

// Initial update
updateAllDateTexts();

// Schedule update at midnight
function scheduleNextUpdate() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);

    const timeUntilMidnight = midnight - now;
    setTimeout(() => {
        updateAllDateTexts();
        scheduleNextUpdate();
    }, timeUntilMidnight);
}

scheduleNextUpdate();

// Optional: Update every minute (for testing purposes, can be removed)
setInterval(updateAllDateTexts, 60000);

// Clickable date selector (for future functionality)
document.querySelectorAll(".date-selector").forEach(selector => {
    selector.addEventListener("click", function() {
        alert("Date selector clicked! You can implement a date picker here.");
    });
});


// JS for navigation buttons
// Handle navigation click
const navItems = document.querySelectorAll('.nav-item');
const dashboardContent = document.querySelector('.content:not(.patients-content)');
const patientsContent = document.querySelector('.patients-content');
const tasksContent = document.querySelector('.tasks-content');
const messagesContent = document.querySelector('.messages-content');
const alertsContent = document.querySelector('.alerts-content'); 
const complianceContent = document.querySelector('.compliance-content'); 
const improvementContent = document.querySelector('.improvement-content');
const settingContent = document.querySelector('.setting-content'); 

// Update the messages content visibility
navItems.forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all nav items
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });

        // Add active class to clicked item
        this.classList.add('active');

        // Show appropriate content based on which nav item was clicked
        if (this.textContent.trim() === 'Patients') {
            dashboardContent.style.display = 'none';
            tasksContent.style.display = 'none';
            messagesContent.style.display = 'none';
            alertsContent.style.display = 'none';
            complianceContent.style.display = 'none';
            improvementContent.style.display = 'none';
            settingContent.style.display = 'none';
            patientsContent.style.display = 'block';
            updateAllDateTexts();
        } else if (this.textContent.trim() === 'Tasks') {
            dashboardContent.style.display = 'none';
            patientsContent.style.display = 'none';
            messagesContent.style.display = 'none';
            alertsContent.style.display = 'none';
            complianceContent.style.display = 'none';
            improvementContent.style.display = 'none';
            settingContent.style.display = 'none';
            tasksContent.style.display = 'block';
            updateAllDateTexts();
        } else if (this.textContent.trim() === 'Messages') {
            dashboardContent.style.display = 'none';
            patientsContent.style.display = 'none';
            tasksContent.style.display = 'none';
            alertsContent.style.display = 'none';
            complianceContent.style.display = 'none';
            improvementContent.style.display = 'none';
            settingContent.style.display = 'none';
            messagesContent.style.display = 'block';
            updateAllDateTexts();
        } else if (this.textContent.trim() === 'Alerts') {
            dashboardContent.style.display = 'none';
            patientsContent.style.display = 'none';
            tasksContent.style.display = 'none';
            messagesContent.style.display = 'none';
            complianceContent.style.display = 'none';
            improvementContent.style.display = 'none';
            settingContent.style.display = 'none';
            alertsContent.style.display = 'block'; 
            updateAllDateTexts();
        } else if (this.textContent.trim() === 'Compliances') {
            dashboardContent.style.display = 'none';
            patientsContent.style.display = 'none';
            tasksContent.style.display = 'none';
            messagesContent.style.display = 'none';
            alertsContent.style.display = 'none';
            improvementContent.style.display = 'none';
            settingContent.style.display = 'none';
            complianceContent.style.display = 'block'; 
            updateAllDateTexts();
        } else if (this.textContent.trim() === 'Improvements') {
            dashboardContent.style.display = 'none';
            patientsContent.style.display = 'none';
            tasksContent.style.display = 'none';
            messagesContent.style.display = 'none';
            alertsContent.style.display = 'none';
            complianceContent.style.display = 'none';
            settingContent.style.display = 'none';
            improvementContent.style.display = 'block';
            updateAllDateTexts();
        } else if (this.textContent.trim() === 'Settings') {
            dashboardContent.style.display = 'none';
            patientsContent.style.display = 'none';
            tasksContent.style.display = 'none';
            messagesContent.style.display = 'none';
            alertsContent.style.display = 'none';
            complianceContent.style.display = 'none';
            improvementContent.style.display = 'none';
            settingContent.style.display = 'block';
            updateAllDateTexts();
        } else if (this.textContent.trim() === 'Dashboard') {
            dashboardContent.style.display = 'block';
            patientsContent.style.display = 'none';
            tasksContent.style.display = 'none';
            messagesContent.style.display = 'none';
            alertsContent.style.display = 'none';
            complianceContent.style.display = 'none';
            improvementContent.style.display = 'none';
            settingContent.style.display = 'none';
            updateAllDateTexts();
        } else {
            // For other nav items, just show dashboard for now
            dashboardContent.style.display = 'block';
            patientsContent.style.display = 'none';
            tasksContent.style.display = 'none';
            messagesContent.style.display = 'none';
            alertsContent.style.display = 'none';
            complianceContent.style.display = 'none';
            improvementContent.style.display = 'none';
            settingContent.style.display = 'none';
        }
    });
});

// SEARCH
// Search functionality for all sections
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".search-box input").forEach(input => {
        input.addEventListener("keyup", function () {
            const searchTerm = this.value.toLowerCase();
            const tableClass = this.dataset.table;
            const searchFields = this.dataset.fields.split(",");

            const rows = document.querySelectorAll(`.${tableClass} tbody tr`);

            rows.forEach(row => {
                let match = false;

                searchFields.forEach((field, index) => {
                    let cell = field === "first" 
                        ? row.querySelector(`td:first-child`) 
                        : row.querySelector(`td:nth-child(${index + 1})`); 

                    if (cell && cell.textContent.toLowerCase().includes(searchTerm)) {
                        match = true;
                    }
                });

                row.style.display = match ? "" : "none";
            });
        });
    });
});

// PAGINATION
// Function to handle pagination for all sections
function handlePagination() {
    document.querySelectorAll('.pagination').forEach(pagination => {
        pagination.addEventListener('click', function(event) {
            const button = event.target.closest('.pagination-btn');
            if (!button || button.classList.contains('next')) return;

            // Remove 'active' class from all buttons in the same pagination section
            pagination.querySelectorAll('.pagination-btn').forEach(btn => btn.classList.remove('active'));

            // Add 'active' class to the clicked button
            button.classList.add('active');

            // Get section name from data attribute
            const section = pagination.getAttribute('data-pagination');
            console.log(`Pagination clicked for ${section}, page ${button.textContent}`);
            
            // Load data based on section and page number (To be implemented)
        });
    });
}

// Initialize pagination handling
handlePagination();


// TOGGLEPASSWORD
// This function is for hiding the password and showing the password.
function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const eyeOpen = document.getElementById('eye-open');
    const eyeBall = document.getElementById('eye-open-ball');
    const eyeClosed = document.getElementById('eye-closed');

    if (passwordField.type === "password") {
        passwordField.type = "text";  
        eyeOpen.style.display = "block";  
        eyeBall.style.display = "block";  
        eyeClosed.style.display = "block"; 
    } else {
        passwordField.type = "password"; 
        eyeOpen.style.display = "block"; 
        eyeBall.style.display = "block"; 
        eyeClosed.style.display = "none"; 
    }
}

// LOGOUT
// Get elements
const logoutButton = document.getElementById('logout-button');
const logoutDialog = document.getElementById('logout-dialog');
const cancelButton = document.getElementById('cancel-logout');
const confirmButton = document.getElementById('confirm-logout');

// Show dialog when logout button is clicked
logoutButton.addEventListener('click', function() {
    logoutDialog.style.display = 'flex';
});

// Hide dialog when cancel button is clicked
cancelButton.addEventListener('click', function() {
    logoutDialog.style.display = 'none';
});

// Handle logout confirmation
confirmButton.addEventListener('click', function() {
    window.location.href = '/auth/logout';
    logoutDialog.style.display = 'none';
});

// Close dialog when clicking outside
logoutDialog.addEventListener('click', function(event) {
    if (event.target === logoutDialog) {
        logoutDialog.style.display = 'none';
    }
});

// POPUP FORM
// Task form
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const taskPopup = document.getElementById('taskPopup');
    const closePopup = document.querySelector('.close-popup');
    const addTaskButtons = document.querySelectorAll('.tasks-btn');
    const searchInput = document.getElementById('searchTasks');
    const healthAlertForm = document.getElementById('healthAlertForm');
    const resetBtn = document.getElementById('resetBtn');
    
    // Function to show popup and fill patient data
    function showTaskPopup(patientId, patientName, patientAge) {
        // Fill patient data in the form
        document.getElementById('patientId').value = patientId;
        document.getElementById('patientName').value = patientName;
        document.getElementById('patientAge').value = patientAge;
        
        // Set current datetime for alert and completion time
        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);
        document.getElementById('alertDateTime').value = formattedDateTime;
        document.getElementById('completionTime').value = formattedDateTime;
        
        // Show the popup
        taskPopup.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to hide popup
    function hideTaskPopup() {
        taskPopup.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Add event listeners to all "Add Tasks" buttons
    addTaskButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get patient data from the table row
            const row = this.closest('tr');
            const patientId = this.getAttribute('data-id');
            const patientName = row.querySelector('.patient-name span').textContent;
            const patientAge = row.cells[2].textContent;
            
            showTaskPopup(patientId, patientName, patientAge);
        });
    });
    
    // Close popup when clicking close button or outside the form
    closePopup.addEventListener('click', hideTaskPopup);
    taskPopup.addEventListener('click', function(e) {
        if (e.target === taskPopup) {
            hideTaskPopup();
        }
    });
    
    // Close popup when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && taskPopup.style.display === 'flex') {
            hideTaskPopup();
        }
    });
    
    // Reset form when clicking reset button
    resetBtn.addEventListener('click', function() {
        healthAlertForm.reset();
    });
    
    // Handle form submission
    healthAlertForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = new FormData(this);
        const taskData = Object.fromEntries(formData.entries());
        
        // Here you would typically send the data to your server
        console.log('Task data to be submitted:', taskData);
        
        // For demo purposes, we'll add the task to the table
        addTaskToTable(taskData);
        
        // Close the popup and reset the form
        hideTaskPopup();
        this.reset();
        
        // Show success message
        alert('Task added successfully!');
    });
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('.tasks-table tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
    
    // Function to add a new task to the table (demo only)
    function addTaskToTable(taskData) {
        const tbody = document.querySelector('.tasks-table tbody');
        const newRow = document.createElement('tr');
        
        // Format dates for display
        const alertDate = new Date(taskData.alertDateTime);
        const completionDate = new Date(taskData.completionTime);
        
        const formattedAlertDate = alertDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');
        
        const formattedCompletionDate = completionDate.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');
        
        // Determine priority class
        const priorityClass = taskData.taskPriority === 'High' ? 'priority-high' : 
                            taskData.taskPriority === 'Critical' ? 'priority-critical' : '';
        
        newRow.innerHTML = `
            <td>#${taskData.patientId}</td>
            <td>
                <div class="patient-name">
                    <span>${taskData.patientName}</span>
                </div>
            </td>
            <td>${taskData.patientAge}</td>
            <td>${taskData.alertType}</td>
            <td>${taskData.taskName}</td>
            <td><span class="${priorityClass}">${taskData.taskPriority}</span></td>
            <td>${formattedAlertDate}</td>
            <td>${formattedCompletionDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" data-id="${taskData.patientId}">View</button>
                    <button class="tasks-btn" data-id="${taskData.patientId}">Add Tasks</button>
                    <button class="delete-btn" data-id="${taskData.patientId}">Delete</button>
                </div>
            </td>
        `;
        
        tbody.prepend(newRow);
        
        // Add event listener to the new "Add Tasks" button
        newRow.querySelector('.tasks-btn').addEventListener('click', function() {
            const row = this.closest('tr');
            const patientId = this.getAttribute('data-id');
            const patientName = row.querySelector('.patient-name span').textContent;
            const patientAge = row.cells[2].textContent;
            
            showTaskPopup(patientId, patientName, patientAge);
        });
    }
    
    // Set current date in the header
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('tasksDateText').textContent = currentDate.toLocaleDateString('en-US', options);
});

// Sample patient data
const patientData = {
    "P1001": {
        patientId: "#P1001",
        firstName: "John",
        lastName: "Doe",
        age: "68 years",
        dob: "05-06-1955",
        email: "john.doe@example.com",
        phone: "(555) 123-4567",
        gender: "Male",
        address: "123 Main St, Anytown, CA 91234",
        username: "johndoe123"
    },
    "P1002": {
        patientId: "#P1002",
        firstName: "Sarah",
        lastName: "Johnson",
        age: "45 years",
        dob: "12-10-1978",
        email: "sarah.j@example.com",
        phone: "(555) 987-6543",
        gender: "Female",
        address: "456 Oak St, Sometown, NY 10001",
        username: "sarahj"
    }
};

// Sample task data
const taskData = {
    "T1001": {
        // Patient Details
        patientId: "#P1001",
        patientName: "John Doe",
        patientAge: "68 years",
        contactInfo: "(555) 123-4567 | john.doe@example.com",
        
        // Health Alert Details
        alertType: "Heart Rate",
        currentValue: "110 BPM",
        normalRange: "60-100 BPM",
        alertDateTime: "16-01-2023 10:30 AM",
        
        // Task Assignment Details
        taskName: "Rest for 10 minutes",
        taskDescription: "Patient should stop any physical activity and rest in a seated or lying position for at least 10 minutes. Monitor heart rate after rest period and report if still elevated.",
        taskPriority: "High",
        completionTime: "16-01-2023 11:00 AM"
    }
};

const alertData = {
    "A2001": {
        alertId: "#A2001",
        patientName: "John Doe",
        alertType: "High Blood Pressure",
        currentValue: "160/100 mmHg",
        normalRange: "120/80 mmHg",
        datetime: "17-01-2023",
        status: "Unresolved",
        taskAssigned: "Yes"
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // PATIENT MODAL
    const patientModal = document.getElementById('patientViewModal');
    const closePatientModalBtn = document.getElementById('closePatientModal');
    const closePatientModalFooterBtn = document.getElementById('closePatientModalBtn');
    const patientViewButtons = document.querySelectorAll('.patient-view-btn');
    
    // Function to populate the patient modal
    function populatePatientModal(patientId) {
        const patient = patientData[patientId];
        
        if (patient) {
            document.getElementById('view_patient_id').textContent = patient.patientId;
            document.getElementById('view_first_name').textContent = patient.firstName;
            document.getElementById('view_last_name').textContent = patient.lastName;
            document.getElementById('view_age').textContent = patient.age;
            document.getElementById('view_dob').textContent = patient.dob;
            document.getElementById('view_email').textContent = patient.email;
            document.getElementById('view_phone').textContent = patient.phone;
            document.getElementById('view_gender').textContent = patient.gender;
            document.getElementById('view_address').textContent = patient.address;
            document.getElementById('view_username').textContent = patient.username;
        }
    }
    
    // Patient view button click handlers
    patientViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const patientId = this.getAttribute('data-id');
            populatePatientModal(patientId);
            patientModal.classList.add('active');
        });
    });
    
    // Close patient modal handlers
    closePatientModalBtn.addEventListener('click', function() {
        patientModal.classList.remove('active');
    });
    
    closePatientModalFooterBtn.addEventListener('click', function() {
        patientModal.classList.remove('active');
    });
    
    // Close patient modal when clicking outside
    patientModal.addEventListener('click', function(e) {
        if (e.target === patientModal) {
            patientModal.classList.remove('active');
        }
    });

    // TASK MODAL
    const taskModal = document.getElementById('taskViewModal');
    const closeTaskModalBtn = document.getElementById('closeTaskModal');
    const closeTaskModalFooterBtn = document.getElementById('closeTaskModalBtn');
    const taskViewButtons = document.querySelectorAll('.task-view-btn');
    
    // Function to populate the task modal
    function populateTaskModal(taskId) {
        const task = taskData[taskId];
        
        if (task) {
            // Populate Patient Details
            document.getElementById('task_view_patient_id').textContent = task.patientId;
            document.getElementById('task_view_patient_name').textContent = task.patientName;
            document.getElementById('task_view_patient_age').textContent = task.patientAge;
            document.getElementById('task_view_contact_info').textContent = task.contactInfo;
            
            // Populate Health Alert Details
            document.getElementById('task_view_alert_type').textContent = task.alertType;
            document.getElementById('task_view_current_value').textContent = task.currentValue;
            document.getElementById('task_view_normal_range').textContent = task.normalRange;
            document.getElementById('task_view_alert_datetime').textContent = task.alertDateTime;
            
            // Populate Task Assignment Details
            document.getElementById('task_view_task_name').textContent = task.taskName;
            document.getElementById('task_view_task_description').textContent = task.taskDescription;
            
            // Update priority badge
            const priorityElement = document.getElementById('task_view_task_priority');
            priorityElement.innerHTML = '';
            
            const priorityBadge = document.createElement('span');
            priorityBadge.className = `priority-badge priority-${task.taskPriority.toLowerCase()}`;
            priorityBadge.textContent = task.taskPriority;
            priorityElement.appendChild(priorityBadge);
            
            document.getElementById('task_view_completion_time').textContent = task.completionTime;
        }
    }
    
    // Task view button click handlers
    taskViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-id');
            populateTaskModal(taskId);
            taskModal.classList.add('active');
        });
    });
    
    // Close task modal handlers
    closeTaskModalBtn.addEventListener('click', function() {
        taskModal.classList.remove('active');
    });
    
    closeTaskModalFooterBtn.addEventListener('click', function() {
        taskModal.classList.remove('active');
    });
    
    // Close task modal when clicking outside
    taskModal.addEventListener('click', function(e) {
        if (e.target === taskModal) {
            taskModal.classList.remove('active');
        }
    });

    // ALERTS MODAL
    const alertModal = document.getElementById('alertViewModal');
    const closeAlertModalBtn = document.getElementById('closeAlertModal');
    const closeAlertModalFooterBtn = document.getElementById('closeAlertModalBtn');
    const alertViewButtons = document.querySelectorAll('.alert-view-btn');

    function populateAlertModal(alertId) {
        const alert = alertData[alertId];
        
        if (alert) {
            document.getElementById('alert_view_id').textContent = alert.alertId;
            document.getElementById('alert_view_patient_name').textContent = alert.patientName;
            document.getElementById('alert_view_type').textContent = alert.alertType;
            document.getElementById('alert_view_current_value').textContent = alert.currentValue;
            document.getElementById('alert_view_normal_range').textContent = alert.normalRange;
            document.getElementById('alert_view_datetime').textContent = alert.datetime;
            document.getElementById('alert_view_status').textContent = alert.status;
            document.getElementById('alert_view_task_assigned').textContent = alert.taskAssigned;
        }
    }

    // Alert view button click handlers
    alertViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alertId = this.getAttribute('data-id');
            populateAlertModal(alertId);
            alertModal.classList.add('active'); // Show modal
        });
    });

    // Close alert modal handlers
    closeAlertModalBtn.addEventListener('click', function() {
        alertModal.classList.remove('active'); // Hide modal
    });

    closeAlertModalFooterBtn.addEventListener('click', function() {
        alertModal.classList.remove('active'); // Hide modal
    });

    // Close alert modal when clicking outside
    alertModal.addEventListener('click', function(e) {
        if (e.target === alertModal) {
            alertModal.classList.remove('active');
        }
    });
});


// NOTIFICATION
// Notification Panel Toggle
const notificationToggle = document.getElementById('notificationToggle');
const notificationPanel = document.getElementById('notificationPanel');
const overlay = document.getElementById('overlay');
const closeNotifications = document.getElementById('closeNotifications');
const clearNotifications = document.getElementById('clearNotifications');
const notificationContent = document.getElementById('notificationContent');
const emptyNotifications = document.getElementById('emptyNotifications');
const notificationBadge = document.getElementById('notificationBadge');

// Toggle notification panel
notificationToggle.addEventListener('click', function() {
    notificationPanel.classList.toggle('open');
    overlay.classList.toggle('open');
});

// Close notification panel
closeNotifications.addEventListener('click', function() {
    notificationPanel.classList.remove('open');
    overlay.classList.remove('open');
});

// Close when clicking on overlay
overlay.addEventListener('click', function() {
    notificationPanel.classList.remove('open');
    overlay.classList.remove('open');
});

// Clear all notifications
clearNotifications.addEventListener('click', function() {
    notificationContent.style.display = 'none';
    emptyNotifications.style.display = 'flex';
    notificationBadge.textContent = '0';
    notificationBadge.style.display = 'none';
});

// Sample function to add a new notification (for demonstration)
function addNotification(title, message, iconType = 'info') {
    if (emptyNotifications.style.display === 'flex') {
        emptyNotifications.style.display = 'none';
        notificationContent.style.display = 'block';
    }
    
    // Create new notification element
    const newNotification = document.createElement('div');
    newNotification.className = 'notification-item';
    
    // Set icon based on type
    let iconPath = '';
    switch(iconType) {
        case 'heart':
            iconPath = '<path d="M20.5 4.5c-2.49 0-4.24 1.55-5.5 3.09C13.24 6.05 11.49 4.5 9 4.5 5.78 4.5 3 7.1 3 10.32c0 2.21 1.02 4.21 2.39 5.76 1.33 1.5 3.07 2.77 4.86 4.09l1.25.89c.34.25.8.25 1.14 0l1.25-.89c1.79-1.32 3.53-2.59 4.86-4.09 1.37-1.55 2.39-3.55 2.39-5.76C21 7.1 18.22 4.5 15 4.5z"/>';
            break;
        case 'medication':
            iconPath = '<path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>';
            break;
        case 'appointment':
            iconPath = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>';
            break;
        default:
            iconPath = '<path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>';
    }
    
    // Set notification content
    newNotification.innerHTML = `
        <div class="notification-icon-small">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${iconPath}</svg>
        </div>
        <div class="notification-text">
            <h4>${title}</h4>
            <p>${message}</p>
            <div class="notification-time">Just now</div>
        </div>
    `;
    
    // Add to top of notifications
    notificationContent.insertBefore(newNotification, notificationContent.firstChild);
    
    // Update badge count
    const currentCount = parseInt(notificationBadge.textContent) || 0;
    notificationBadge.textContent = currentCount + 1;
    notificationBadge.style.display = 'flex';
}

// Close notification panel when pressing Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && notificationPanel.classList.contains('open')) {
        notificationPanel.classList.remove('open');
        overlay.classList.remove('open');
    }
});