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
        if (content) {
            content.style.display = content === contentToShow ? 'block' : 'none';
        }
    });
}

// Utility to activate nav item + dropdown item
function setActiveNavAndSub(navLabel, dropdownIndex = null, dropdownType = null) {
    // Activate top nav
    navItems.forEach(navItem => {
        navItem.classList.remove('active');
        if (navItem.textContent.trim() === navLabel) {
            navItem.classList.add('active');
        }
    });

    // Clear all dropdown highlights first
    if (dropdownHealthItems) {
        dropdownHealthItems.forEach(item => item.classList.remove('sub-active'));
    }
    if (dropdownCustomerItems) {
        dropdownCustomerItems.forEach(item => item.classList.remove('sub-actives'));
    }

    // Activate the correct dropdown item based on type
    if (dropdownType === 'health') {
        if (dropdownIndex !== null && dropdownHealthItems[dropdownIndex]) {
            dropdownHealthItems[dropdownIndex].classList.add('sub-active');
        }
    } else if (dropdownType === 'customer') {
        if (dropdownIndex !== null && dropdownCustomerItems[dropdownIndex]) {
            dropdownCustomerItems[dropdownIndex].classList.add('sub-actives');
        }
    }
}

// Helper function to activate specific analytics tab
function activateAnalyticsTab(tabId) {
    const tabLink = document.querySelector(`.analytics-tabs .tab-link[data-tab="${tabId}"]`);
    const tabPanel = document.getElementById(tabId);
    
    if (tabLink && tabPanel) {
        // Remove active class from all tabs and panels
        document.querySelectorAll('.analytics-tabs .tab-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.analytics-tabs .tab-panel').forEach(p => p.classList.remove('active'));
        
        // Add active class to selected tab and panel
        tabLink.classList.add('active');
        tabPanel.classList.add('active');
    }
}

// Initialize navigation
function initNavigation() {
    // Main nav click handling
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const label = this.textContent.trim();
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');

            // Clear dropdown highlights
            dropdownHealthItems?.forEach(drop => drop.classList.remove('sub-active'));
            dropdownCustomerItems?.forEach(drop => drop.classList.remove('sub-actives'));

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
            } else if (label === 'Settings') {
                showContent(settingsContent);
            }
        });
    });

    // Health Vital Signs dropdown items
    dropdownHealthItems?.forEach((item, index) => {
        item.addEventListener('click', () => {
            const contents = [heartRateContent, bodyTempContent, oxygenContent, fallContent];
            if (contents[index]) {
                showContent(contents[index]);
                setActiveNavAndSub('Health Vital Signs', index, 'health');
            }
        });
    });

    // Customer Care dropdown items
    dropdownCustomerItems?.forEach((item, index) => {
        item.addEventListener('click', () => {
            const contents = [messagesContent, compliancesContent, improvementsContent];
            if (contents[index]) {
                showContent(contents[index]);
                setActiveNavAndSub('Customer Care', index, 'customer');
            }
        });
    });

    // Analytics section program cards
    document.querySelector('.program-card.heart-rate')?.addEventListener('click', () => {
        showContent(analyticsContent);
        setActiveNavAndSub('Analytics');
        activateAnalyticsTab('heart-rate-tab');
    });

    document.querySelector('.program-card.temperature')?.addEventListener('click', () => {
        showContent(analyticsContent);
        setActiveNavAndSub('Analytics');
        activateAnalyticsTab('temperature-tab');
    });

    document.querySelector('.program-card.oxygen')?.addEventListener('click', () => {
        showContent(analyticsContent);
        setActiveNavAndSub('Analytics');
        activateAnalyticsTab('oxygen-tab');
    });

    document.querySelector('.program-card.fall-detection')?.addEventListener('click', () => {
        showContent(analyticsContent);
        setActiveNavAndSub('Analytics');
        activateAnalyticsTab('fall-detection-tab');
    });

    // Customer Care section program cards
    document.querySelector('.program-card.messages')?.addEventListener('click', () => {
        showContent(messagesContent);
        setActiveNavAndSub('Customer Care', 0, 'customer');
    });

    document.querySelector('.program-card.compliances')?.addEventListener('click', () => {
        showContent(compliancesContent);
        setActiveNavAndSub('Customer Care', 1, 'customer');
    });

    document.querySelector('.program-card.improvements')?.addEventListener('click', () => {
        showContent(improvementsContent);
        setActiveNavAndSub('Customer Care', 2, 'customer');
    });

    // View All buttons
    document.querySelectorAll('.view-all').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.dashboard-section');
            if (section) {
                const title = section.querySelector('h2')?.textContent.trim();
                if (title === 'Analytics') {
                    showContent(analyticsContent);
                    setActiveNavAndSub('Analytics');
                } else if (title === 'Customer Care') {
                    showContent(customerContent);
                    setActiveNavAndSub('Customer Care');
                } else if (title === "My Task's") {
                    showContent(tasksContent);
                    setActiveNavAndSub('Tasks');
                }
            }
        });
    });

    // Initialize analytics tabs
    const tabLinks = document.querySelectorAll('.analytics-tabs .tab-link');
    tabLinks?.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            activateAnalyticsTab(tabId);
        });
    });

    // Show dashboard by default
    showContent(dashboardContent);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initNavigation);

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

// LOGOUT SECTION
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


// SEARCH FUNCTIONALITY
function setupSearchFunctionality() {
    // Search functionality for all tables
    document.querySelectorAll('.search-box input').forEach(searchInput => {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableContainer = this.closest('.content').querySelector('table');
            
            if (!tableContainer) return;
            
            const rows = tableContainer.querySelectorAll('tbody tr');
            let visibleRows = 0;
            
            rows.forEach(row => {
                const rowText = row.textContent.toLowerCase();
                if (rowText.includes(searchTerm)) {
                    row.style.display = '';
                    visibleRows++;
                } else {
                    row.style.display = 'none';
                }
            });
            
            // Show "no results" message if no rows match
            const noResultsRow = tableContainer.querySelector('tbody .no-results');
            if (visibleRows === 0) {
                if (!noResultsRow) {
                    const tr = document.createElement('tr');
                    tr.className = 'no-results';
                    tr.innerHTML = `<td colspan="${tableContainer.querySelectorAll('thead th').length}">No matching records found</td>`;
                    tableContainer.querySelector('tbody').appendChild(tr);
                }
            } else if (noResultsRow) {
                noResultsRow.remove();
            }
        });
    });
}

// PAGINATION FUNCTIONALITY
function setupPagination() {
    const itemsPerPage = 10;
    
    document.querySelectorAll('[data-pagination]').forEach(paginationContainer => {
        const table = paginationContainer.closest('.content').querySelector('table');
        if (!table) return;
        
        const paginationButtons = paginationContainer.querySelectorAll('.pagination-btn');
        const nextButton = paginationContainer.querySelector('.pagination-btn.next');
        const prevButton = paginationContainer.querySelector('.pagination-btn.prev');
        
        let currentPage = 1;
        
        function updatePagination() {
            const rows = Array.from(table.querySelectorAll('tbody tr:not(.no-results)'));
            const totalPages = Math.ceil(rows.length / itemsPerPage);
            
            // Hide all rows
            rows.forEach(row => row.style.display = 'none');
            
            // Show rows for current page
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            
            rows.slice(startIndex, endIndex).forEach(row => {
                row.style.display = '';
            });
            
            // Update pagination buttons
            paginationButtons.forEach(button => {
                button.classList.remove('active');
                if (button.textContent === currentPage.toString()) {
                    button.classList.add('active');
                }
                
                // Show/hide numbered buttons based on current page
                const pageNum = parseInt(button.textContent);
                if (!isNaN(pageNum)) {
                    if (pageNum <= 3 || pageNum >= totalPages - 2 || 
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                        button.style.display = '';
                    } else {
                        button.style.display = 'none';
                    }
                    
                    // Show ellipsis for gaps
                    if (pageNum === 4 && currentPage > 4) {
                        button.style.display = '';
                        button.innerHTML = '...';
                        button.disabled = true;
                    } else if (pageNum === totalPages - 3 && currentPage < totalPages - 3) {
                        button.style.display = '';
                        button.innerHTML = '...';
                        button.disabled = true;
                    }
                }
            });
            
            // Enable/disable next/prev buttons
            if (prevButton) {
                prevButton.disabled = currentPage === 1;
            }
            if (nextButton) {
                nextButton.disabled = currentPage === totalPages || totalPages === 0;
            }
        }
        
        // Numbered page buttons
        paginationButtons.forEach(button => {
            if (!button.classList.contains('next') && !button.classList.contains('prev')) {
                button.addEventListener('click', () => {
                    if (!isNaN(parseInt(button.textContent))) {
                        currentPage = parseInt(button.textContent);
                        updatePagination();
                    }
                });
            }
        });
        
        // Next button
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                const rows = table.querySelectorAll('tbody tr:not(.no-results)');
                const totalPages = Math.ceil(rows.length / itemsPerPage);
                
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                }
            });
        }
        
        // Previous button (if exists)
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            });
        }
        
        // Initial pagination setup
        updatePagination();
    });
}

// Initialize search and pagination when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupSearchFunctionality();
    setupPagination();
    
    // Re-run pagination when content changes
    const observer = new MutationObserver(() => {
        setupPagination();
    });
    
    document.querySelectorAll('.content').forEach(content => {
        observer.observe(content, { childList: true, subtree: true });
    });
});

setTimeout(() => {
    const toast = document.getElementById('toast');
    if (toast) toast.style.display = 'none';
  }, 3000);