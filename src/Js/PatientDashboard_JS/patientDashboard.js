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

// Dropdown functionality for navigation items
document.querySelectorAll('.nav-item-with-dropdown').forEach(item => {
    const navItem = item.querySelector('.nav-item');
    const dropdownMenu = item.querySelector('.dropdown-menu');
    
    navItem.addEventListener('click', function() {
        item.classList.toggle('open');
        dropdownMenu.classList.toggle('open');
    });
});

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

// NAVIGATION
// Content section references
const dashboardContent = document.querySelector('.content:not(.healths-content)');
const healthsContent = document.querySelector('.healths-content');
const heartRateContent = document.querySelector('.heart-rate-content');
const bodyTempContent = document.querySelector('.body-temperature-content');
const oxygenContent = document.querySelector('.oxygen-content');
const fallContent = document.querySelector('.fall-detection-content');
const analyticsContent = document.querySelector('.analytics-content');
const tasksContent = document.querySelector('.tasks-content');
const alertsContent = document.querySelector('.alerts-content');
const customerContent = document.querySelector('.customer-content');
const messagesContent = document.querySelector('.messages-content');
const compliancesContent = document.querySelector('.compliance-content');
const improvementsContent = document.querySelector('.improvement-content');
const settingsContent = document.querySelector('.settings-content');

// Nav and dropdown items
const navItems = document.querySelectorAll('.nav-item');
const dropdownHealthItems = document.querySelectorAll('.dropdown-item');
const dropdownCustomerItems = document.querySelectorAll('.dropdown-customer-item');


// Function to show selected content and hide others
function showContent(contentToShow) {
    const allContents = [
        dashboardContent,
        healthsContent,
        heartRateContent,
        bodyTempContent,
        oxygenContent,
        fallContent,
        analyticsContent,
        tasksContent,
        alertsContent,
        customerContent,
        messagesContent,
        compliancesContent,
        improvementsContent,
        settingsContent
    ];

    allContents.forEach(content => {
        content.style.display = content === contentToShow ? 'block' : 'none';
    });

    updateAllDateTexts();
}

// Utility to activate nav item + dropdown item
function setActiveNavAndSub(navLabel, dropdownIndex = null) {
    // Activate top nav (e.g., Health Vital Signs)
    navItems.forEach(navItem => {
        navItem.classList.remove('active');
        if (navItem.textContent.trim() === navLabel) {
            navItem.classList.add('active');
        }
    });

    // Activate dropdown sub-item
    dropdownHealthItems.forEach(item => item.classList.remove('sub-active'));
    if (dropdownIndex !== null && dropdownHealthItems[dropdownIndex]) {
        dropdownHealthItems[dropdownIndex].classList.add('sub-active');
    }

    // Activate dropdown sub-item
    dropdownCustomerItems.forEach(item => item.classList.remove('sub-actives'));
    if (dropdownIndex !== null && dropdownCustomerItems[dropdownIndex]) {
        dropdownCustomerItems[dropdownIndex].classList.add('sub-actives');
    }
}

// Main nav click handling
navItems.forEach(item => {
    item.addEventListener('click', function () {
        const label = this.textContent.trim();

        navItems.forEach(navItem => navItem.classList.remove('active'));
        this.classList.add('active');

        // Clear dropdown highlights
        dropdownHealthItems.forEach(drop => drop.classList.remove('sub-active'));
        dropdownCustomerItems.forEach(drop => drop.classList.remove('sub-actives'));

        if (label === 'Dashboard') {
            showContent(dashboardContent);
        } else if (label === 'Health Vital Signs') {
            showContent(healthsContent);
        } else if (label === 'Analytics') {
            showContent(analyticsContent);
        } else if (label === 'Tasks') {
            showContent(tasksContent);
        } else if (label === 'Alerts') {
            showContent(alertsContent);
        } else if (label === 'Customer Care') {
            showContent(customerContent);
        }  else if (label === 'Messages') {
            showContent(messagesContent);
        } else if (label === 'Compliances') {
            showContent(compliancesContent);
        } else if (label === 'Improvements') {
            showContent(improvementsContent);
        } else if (label === 'Settings') {
            showContent(settingsContent);
        } else {
            showContent(dashboardContent);
        }
    });
});

// Vital Boxes Click Events of Health Vital Signs
document.querySelector('.vital-box.heart-rate-box')?.addEventListener('click', () => {
    showContent(heartRateContent);
    setActiveNavAndSub('Health Vital Signs', 0);
});

document.querySelector('.vital-box.temp-box')?.addEventListener('click', () => {
    showContent(bodyTempContent);
    setActiveNavAndSub('Health Vital Signs', 1);
});

document.querySelector('.vital-box.oxygen-box')?.addEventListener('click', () => {
    showContent(oxygenContent);
    setActiveNavAndSub('Health Vital Signs', 2);
});

document.querySelector('.vital-box.fall-box')?.addEventListener('click', () => {
    showContent(fallContent);
    setActiveNavAndSub('Health Vital Signs', 3);
});

// Customer Care Boxes Click Events
document.querySelector('.vital-box.messages-box')?.addEventListener('click', () => {
    showContent(messagesContent);
    setActiveNavAndSub('Customer Care', 0);
});

document.querySelector('.vital-box.compliances-box')?.addEventListener('click', () => {
    showContent(compliancesContent);
    setActiveNavAndSub('Customer Care', 1);
});

document.querySelector('.vital-box.improvements-box')?.addEventListener('click', () => {
    showContent(improvementsContent);
    setActiveNavAndSub('Customer Care', 2);
});

// Dropdown Menu Items Click Events for Health Vital Signs
dropdownHealthItems[0]?.addEventListener('click', () => {
    showContent(heartRateContent);
    setActiveNavAndSub('Health Vital Signs', 0);
});

dropdownHealthItems[1]?.addEventListener('click', () => {
    showContent(bodyTempContent);
    setActiveNavAndSub('Health Vital Signs', 1);
});

dropdownHealthItems[2]?.addEventListener('click', () => {
    showContent(oxygenContent);
    setActiveNavAndSub('Health Vital Signs', 2);
});

dropdownHealthItems[3]?.addEventListener('click', () => {
    showContent(fallContent);
    setActiveNavAndSub('Health Vital Signs', 3);
});

// Dropdown Menu Items Click Events of Customer Care
dropdownCustomerItems[0]?.addEventListener('click', () => {
    showContent(messagesContent);
    setActiveNavAndSub('Customer Care', 0);
});

dropdownCustomerItems[1]?.addEventListener('click', () => {
    showContent(compliancesContent);
    setActiveNavAndSub('Customer Care', 1);
});

dropdownCustomerItems[2]?.addEventListener('click', () => {
    showContent(improvementsContent);
    setActiveNavAndSub('Customer Care', 2);
});

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

// Logout Section
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


// VIEW DATA
// Sample task data
const taskData = {
    "T1001": {                
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

const messageData = {
    "M2001": {
        messageId: "#M2001",
        messageType: "Inquiry",
        messageContent: "What should I do if my heart rate remains high?",
        datetime: "17-01-2023",
        adminResponse: "Follow relaxation exercises",
        adminResponseDate: "18-01-2023",
        status: "Resolved"
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

const complianceData = {
    "C1001": {
        complianceId: "#C1001",
        complianceType: "Medication Plan",
        notes: "Followed prescribed medication plan",
        date: "20-01-2023",
        status: "Unresolved",
        responseDate: "21-01-2023",
        adminFeedback: "Good job maintaining your medication schedule"
    }
};

const improvementData = {
    "I1001": {
        improvementId: "#I1001",
        category: "System Improvement",
        description: "Enhance dashboard responsiveness",
        dateSubmitted: "10-01-2023",
        status: "Pending",
        adminResponse: "Thank you for your suggestion. We'll review it.",
        implementationDate: "-"
    }
};

document.addEventListener('DOMContentLoaded', function() {

    // TASK MODAL
    const taskModal = document.getElementById('taskViewModal');
    const closeTaskModalBtn = document.getElementById('closeTaskModal');
    const closeTaskModalFooterBtn = document.getElementById('closeTaskModalBtn');
    const taskViewButtons = document.querySelectorAll('.task-view-btn');
    
    // Function to populate the task modal
    function populateTaskModal(taskId) {
        const task = taskData[taskId];
        
        if (task) {
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


    // MESSAGES MODAL
    const messageModal = document.getElementById('messageViewModal');
    const closeMessageModalBtn = document.getElementById('closeMessageModal');
    const closeMessageModalFooterBtn = document.getElementById('closeMessageModalBtn');
    const messageViewButtons = document.querySelectorAll('.message-view-btn');
        
    function populateMessageModal(messageId) {
        const message = messageData[messageId];
        
        if (message) {
            document.getElementById('message_view_id').textContent = message.messageId;
            document.getElementById('message_view_type').textContent = message.messageType;
            document.getElementById('message_view_content').textContent = message.messageContent;
            document.getElementById('message_view_datetime').textContent = message.datetime;
            document.getElementById('message_view_response').textContent = message.adminResponse;
            document.getElementById('message_view_responsedate').textContent = message.adminResponseDate;
            document.getElementById('message_view_status').textContent = message.status;
        }
    }

    // Message view button click handlers
    messageViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const messageId = this.getAttribute('data-id');
            populateMessageModal(messageId);
            messageModal.classList.add('active');
        });
    });

    // Close Message modal handlers
    closeMessageModalBtn.addEventListener('click', function() {
        messageModal.classList.remove('active');
    });

    closeMessageModalFooterBtn.addEventListener('click', function() {
        messageModal.classList.remove('active');
    });
    
    // Close Message modal when clicking outside
    messageModal.addEventListener('click', function(e) {
        if (e.target === messageModal) {
            messageModal.classList.remove('active');
        }
    });


    // COMPLIANCE MODAL 
    const complianceModal = document.getElementById('complianceViewModal');
    const closeComplianceModal = document.getElementById('closeComplianceModal');
    const closeComplianceBtn = document.getElementById('closeComplianceModalBtn');
    const complianceViewButtons = document.querySelectorAll('.compliance-view-btn');
        
    function populateComplianceModal(complianceId) {
    const compliance = complianceData[complianceId];
    
        if (compliance) { 
            document.getElementById('compliance_view_id').textContent = compliance.complianceId;
            document.getElementById('compliance_view_type').textContent = compliance.complianceType;
            document.getElementById('compliance_view_notes').textContent = compliance.notes;
            document.getElementById('compliance_view_date').textContent = compliance.date;
            document.getElementById('compliance_view_status').textContent = compliance.status;
            document.getElementById('compliance_view_response').textContent = compliance.responseDate;
            document.getElementById('compliance_view_feedback').textContent = compliance.adminFeedback;
        }
    }

    // compliance view button click handlers
    complianceViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const complianceId = this.getAttribute('data-id');
            populateComplianceModal(complianceId);
            complianceModal.classList.add('active');
        });
    });

    // Close compliance modal handlers
    closeComplianceModal.addEventListener('click', function() {
        complianceModal.classList.remove('active');
    });

    closeComplianceBtn.addEventListener('click', function() {
        complianceModal.classList.remove('active');
    });
    
    // Close compliance modal when clicking outside
    complianceModal.addEventListener('click', function(e) {
        if (e.target === complianceModal) {
            complianceModal.classList.remove('active');
        }
    });

    // IMPROVEMENT MODAL
    const improvementModal = document.getElementById('improvementViewModal');
    const closeImprovementModal = document.getElementById('closeImprovementModal');
    const closeImprovementBtn = document.getElementById('closeImprovementModalBtn');
    const improvementViewButtons = document.querySelectorAll('.improvement-view-btn');

    function populateImprovementModal(improvementId) {
        const improvement = improvementData[improvementId];
        
        if (improvement) {
            document.getElementById('improvement_view_id').textContent = improvement.improvementId;
            document.getElementById('improvement_view_category').textContent = improvement.category;
            document.getElementById('improvement_view_description').textContent = improvement.description;
            document.getElementById('improvement_view_date').textContent = improvement.dateSubmitted;
            document.getElementById('improvement_view_status').textContent = improvement.status;
            document.getElementById('improvement_view_response').textContent = improvement.adminResponse;
            document.getElementById('improvement_view_implementation_date').textContent = improvement.implementationDate;
        }
    }

    // Improvement view button click handlers
    improvementViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const improvementId = this.getAttribute('data-id');
            populateImprovementModal(improvementId);
            improvementModal.classList.add('active');
        });
    });

    // Close improvement modal handlers
    closeImprovementModal.addEventListener('click', function() {
        improvementModal.classList.remove('active');
    });

    closeImprovementBtn.addEventListener('click', function() {
        improvementModal.classList.remove('active');
    });

    // Close improvement modal when clicking outside
    improvementModal.addEventListener('click', function(e) {
        if (e.target === improvementModal) {
            improvementModal.classList.remove('active');
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const addMessageBtn = document.querySelector('.messages-actions .add-new-btn');
    const addComplianceBtn = document.querySelector('.compliance-actions .add-new-btn');
    const addImprovementBtn = document.querySelector('.improvement-actions .add-new-btn');
    const messagePopup = document.getElementById('newMessagePopup');
    const compliancePopup = document.getElementById('newCompliancePopup');
    const improvementPopup = document.getElementById('newImprovementPopup');

    const closeButtons = document.querySelectorAll('.close-btn, .cancel-btn[data-dismiss="popup"]');

    function getCurrentDateTime() {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const local = new Date(now.getTime() - offset * 60 * 1000);
        return local.toISOString().slice(0, 16);
    }

    if (addMessageBtn) {
        addMessageBtn.addEventListener('click', function () {
            messagePopup.classList.add('active');
            document.getElementById('messageDate').value = getCurrentDateTime();
        });
    }

    if (addComplianceBtn) {
        addComplianceBtn.addEventListener('click', function () {
            compliancePopup.classList.add('active');
            document.getElementById('complianceDate').value = getCurrentDateTime();
        });
    }

    if (addImprovementBtn) {
        addImprovementBtn.addEventListener('click', function () {
            improvementPopup.classList.add('active');
            document.getElementById('improvementDate').value = getCurrentDateTime();
        });
    }

    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const popup = this.closest('.popup-overlay');
            popup.classList.remove('active');
        });
    });

    document.querySelectorAll('.popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });

    // Message Submit
    const submitMessageBtn = document.getElementById('submitMessage');
    submitMessageBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const messageType = document.getElementById('messageType').value;
        const messageContent = document.getElementById('messageContent').value;
        const messageDate = document.getElementById('messageDate').value;

        if (!messageType || messageContent.length < 10) {
            alert("Please fill in all fields properly.");
            return;
        }

        try {
            const response = await fetch('/submit-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messageType,
                    messageContent,
                    messageDate
                })
            });

            const result = await response.json();

            if (result.success) {
                alert("Message submitted successfully!");
                document.getElementById('newMessageForm').reset();
                document.getElementById('newMessagePopup').classList.remove('active');
                // Optionally refresh messages list here
            } else {
                alert("Failed to submit message: " + result.message);
            }

        } catch (error) {
            console.error('Error submitting message:', error);
            alert("Something went wrong. Try again later.");
        }
    });

    // Submit Compliance
    const submitComplianceBtn = document.getElementById('submitCompliance');
    submitComplianceBtn.addEventListener('click', async function (e) {
        e.preventDefault();

        const complianceType = document.getElementById('complianceType').value;
        const complianceNotes = document.getElementById('complianceNotes').value;
        const complianceDate = document.getElementById('complianceDate').value;

        if (!complianceType || complianceNotes.length < 10) {
            alert("Please fill in all fields properly.");
            return;
        }

        try {
            const response = await fetch('/submit-compliance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    complianceType,
                    complianceNotes,
                    complianceDate
                })
            });

            const result = await response.json();

            if (result.success) {
                alert("Compliance submitted successfully!");
                document.getElementById('newComplianceForm').reset();
                document.getElementById('newCompliancePopup').classList.remove('active');
                // Optionally refresh compliances list here
            } else {
                alert("Failed to submit compliance: " + result.message);
            }

        } catch (error) {
            console.error('Error submitting compliance:', error);
            alert("Something went wrong. Try again later.");
        }
    });

    // Submit Improvement
    const submitImprovementBtn = document.getElementById('submitImprovement');
    submitImprovementBtn.addEventListener('click', async function (e) {
        e.preventDefault();
    
        const improvementCategory = document.getElementById('improvementCategory').value.trim();
        const improvementDescription = document.getElementById('improvementDescription').value.trim();
        const improvementDate = document.getElementById('improvementDate').value;
    
        if (!improvementCategory || improvementDescription.length < 10) {
            alert("Please fill in all fields properly. Description should be at least 10 characters.");
            return;
        }
    
        try {
            const response = await fetch('/submit-improvement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    improvementCategory,
                    improvementDescription,
                    improvementDate
                })
            });
    
            const result = await response.json();
    
            if (result.success) {
                alert("Improvement submitted successfully!");
                document.getElementById('newImprovementForm').reset();
                document.getElementById('newImprovementPopup').classList.remove('active');
                fetchImprovements();
            } else {
                alert("Failed to submit improvement: " + result.message);
            }
    
        } catch (error) {
            console.error('Error submitting improvement:', error);
            alert("Something went wrong. Please try again later.");
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    // Fetch Messages
    function fetchMessages() {
        fetch('/messages')
            .then(response => response.json())
            .then(data => {
                const tbody = document.querySelector('.messages-table tbody');
                const noMessagesDiv = document.querySelector('.no-messages');
                tbody.innerHTML = '';

                if (data.length === 0) {
                    noMessagesDiv.style.display = 'block';
                    document.querySelector('.messages-table').style.display = 'none';
                } else {
                    noMessagesDiv.style.display = 'none';
                    document.querySelector('.messages-table').style.display = 'table';

                    data.forEach(message => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>#M${message.Message_ID ?? '----'}</td>
                            <td>${message.Message_Type}</td>
                            <td>${message.Message_Content}</td>
                            <td>${message.Message_Sent_DateTime}</td>
                            <td>${message.Status}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="view-btn message-view-btn" data-id="${message.Message_ID}">View</button>
                                    <button class="delete-btn" data-id="${message.Message_ID}">Delete</button>
                                </div>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading messages:', error);
            });
    }

    // Fetch Compliance
    function fetchCompliances() {
        fetch('/compliances')
            .then(response => {
                console.log('Server Response for Compliances:', response);
                return response.json();
            })
            .then(data => {
                console.log('Compliance Data:', data); // Log the fetched data
                const tbody = document.querySelector('.compliance-table tbody');
                const noCompliancesDiv = document.querySelector('.no-compliances');
                tbody.innerHTML = '';
    
                if (data.length === 0) {
                    noCompliancesDiv.style.display = 'block';
                    document.querySelector('.compliance-table').style.display = 'none';
                } else {
                    noCompliancesDiv.style.display = 'none';
                    document.querySelector('.compliance-table').style.display = 'table';
    
                    data.forEach(compliance => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>#C${compliance.Compliance_ID ?? '----'}</td>
                            <td>${compliance.Compliance_Type}</td>
                            <td>${compliance.Compliance_Notes}</td>
                            <td>${compliance.Compliance_Date}</td>
                            <td>${compliance.Status}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="view-btn compliance-view-btn" data-id="${compliance.Compliance_ID}">View</button>
                                    <button class="delete-btn" data-id="${compliance.Compliance_ID}">Delete</button>
                                </div>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading compliances:', error);
            });
    }
    
    // Fetch Improvements
    function fetchImprovements() {
        fetch('/improvements')
            .then(response => {
                console.log('Server Response for Improvements:', response);
                return response.json();
            })
            .then(data => {
                console.log('Improvement Data:', data);
                const tbody = document.querySelector('.improvement-table tbody');
                const noImprovementsDiv = document.querySelector('.no-improvements');
                tbody.innerHTML = '';

                if (data.length === 0) {
                    noImprovementsDiv.style.display = 'block';
                    document.querySelector('.improvement-table').style.display = 'none';
                } else {
                    noImprovementsDiv.style.display = 'none';
                    document.querySelector('.improvement-table').style.display = 'table';

                    data.forEach(improvement => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>#I${improvement.Improvement_ID ?? '----'}</td>
                            <td>${improvement.Category}</td>
                            <td>${improvement.Suggestion_Description}</td>
                            <td>${improvement.Date_Submitted}</td>
                            <td>${improvement.Status}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="view-btn improvement-view-btn" data-id="${improvement.Improvement_ID}">View</button>
                                    <button class="delete-btn" data-id="${improvement.Improvement_ID}">Delete</button>
                                </div>
                            </td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('Error loading improvements:', error);
            });
    }
    fetchMessages();
    fetchCompliances();
    fetchImprovements();
});


