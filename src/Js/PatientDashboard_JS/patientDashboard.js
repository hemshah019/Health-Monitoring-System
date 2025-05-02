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
let paginationState = {}; 
function setupPagination() {
    const itemsPerPage = 20;

    document.querySelectorAll('[data-pagination]').forEach(paginationContainer => {
        const sectionKey = paginationContainer.getAttribute('data-pagination');
        if (!paginationState[sectionKey]) paginationState[sectionKey] = 1;

        const section = paginationContainer.closest('.content');
        const table = section.querySelector('table');
        if (!table) return;

        const allRows = Array.from(table.querySelectorAll('tbody tr:not(.no-results)'));
        const totalPages = Math.ceil(allRows.length / itemsPerPage);

        paginationContainer.innerHTML = `
            <button class="pagination-btn prev">‹</button>
            <div class="page-buttons"></div>
            <button class="pagination-btn next">›</button>
        `;

        const prevButton = paginationContainer.querySelector('.pagination-btn.prev');
        const nextButton = paginationContainer.querySelector('.pagination-btn.next');
        const pageButtonsContainer = paginationContainer.querySelector('.page-buttons');

        if (paginationState[sectionKey] > totalPages) {
            paginationState[sectionKey] = totalPages;
        }

        // Generate buttons once
        renderPageButtons();
        updatePagination();

        function renderPageButtons() {
            pageButtonsContainer.innerHTML = '';

            const maxVisible = 5;
            let startPage = Math.max(1, paginationState[sectionKey] - 2);
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);

            if (endPage - startPage < maxVisible - 1) {
                startPage = Math.max(1, endPage - maxVisible + 1);
            }

            if (startPage > 1) {
                addPageButton(1);
                if (startPage > 2) addEllipsis();
            }

            for (let i = startPage; i <= endPage; i++) {
                addPageButton(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) addEllipsis();
                addPageButton(totalPages);
            }
        }

        function addPageButton(pageNum) {
            const btn = document.createElement('button');
            btn.className = 'pagination-btn';
            btn.textContent = pageNum;

            btn.addEventListener('click', () => {
                paginationState[sectionKey] = pageNum;
                updatePagination();

                // Set active state manually
                const allButtons = pageButtonsContainer.querySelectorAll('.pagination-btn');
                allButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });

            if (pageNum === paginationState[sectionKey]) {
                btn.classList.add('active');
            }

            pageButtonsContainer.appendChild(btn);
        }

        function addEllipsis() {
            const span = document.createElement('span');
            span.className = 'pagination-ellipsis';
            span.textContent = '...';
            pageButtonsContainer.appendChild(span);
        }

        function updatePagination() {
            const start = (paginationState[sectionKey] - 1) * itemsPerPage;
            const end = start + itemsPerPage;

            allRows.forEach(row => row.style.display = 'none');
            allRows.slice(start, end).forEach(row => row.style.display = '');

            // Update active state on page buttons
            const allButtons = pageButtonsContainer.querySelectorAll('.pagination-btn');
            allButtons.forEach(btn => {
                const btnPage = parseInt(btn.textContent);
                btn.classList.toggle('active', btnPage === paginationState[sectionKey]);
            });

            prevButton.disabled = paginationState[sectionKey] === 1;
            nextButton.disabled = paginationState[sectionKey] === totalPages;
        }

        prevButton.addEventListener('click', () => {
            if (paginationState[sectionKey] > 1) {
                paginationState[sectionKey]--;
                updatePagination();
            }
        });

        nextButton.addEventListener('click', () => {
            if (paginationState[sectionKey] < totalPages) {
                paginationState[sectionKey]++;
                updatePagination();
            }
        });
    });
}

// Initialize search and pagination when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupSearchFunctionality();
    setupPagination();

    let debounceTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            setupPagination();
        }, 150);
    });

    document.querySelectorAll('.content').forEach(content => {
        observer.observe(content, { childList: true, subtree: true });
    });
});

setTimeout(() => {
    const toast = document.getElementById('toast');
    if (toast) toast.style.display = 'none';
  }, 3000);