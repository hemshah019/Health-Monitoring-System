// FUNCTION FOR AUTOMATICALLY GENERATED DATE
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


// NEVIGATION
// Main navigation handler
function handleNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const dashboardContent = document.querySelector('.content:not(.patients-content)');
    const patientsContent = document.querySelector('.patients-content');
    const tasksContent = document.querySelector('.tasks-content');
    const messagesContent = document.querySelector('.messages-content');
    const alertsContent = document.querySelector('.alerts-content'); 
    const complianceContent = document.querySelector('.compliance-content'); 
    const improvementContent = document.querySelector('.improvement-content');
    const settingContent = document.querySelector('.setting-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            this.classList.add('active');

            // Hide all content sections
            const allContents = [
                dashboardContent, 
                patientsContent,
                tasksContent,
                messagesContent,
                alertsContent,
                complianceContent,
                improvementContent,
                settingContent
            ];
            
            allContents.forEach(content => {
                if (content) content.style.display = 'none';
            });

            // Show appropriate content based on which nav item was clicked
            const contentMap = {
                'Patients': patientsContent,
                'Tasks': tasksContent,
                'Messages': messagesContent,
                'Alerts': alertsContent,
                'Compliances': complianceContent,
                'Improvements': improvementContent,
                'Settings': settingContent,
                'Dashboard': dashboardContent
            };

            const clickedText = this.textContent.trim();
            if (contentMap[clickedText]) {
                contentMap[clickedText].style.display = 'block';
            } else {
                dashboardContent.style.display = 'block';
            }

            updateAllDateTexts();
        });
    });
}

// View All buttons handler
function handleViewAllButtons() {
    // Task's View All button
    const viewAllTasks = document.querySelector('.view-all-tasks');
    if (viewAllTasks) {
        viewAllTasks.addEventListener('click', function(e) {
            e.preventDefault();

            hideAllContentSections();
            document.querySelector('.tasks-content').style.display = 'block';
            
            updateActiveNavItem('Tasks');
            updateAllDateTexts();
        });
    }

    // Patients View All button
    const viewAllPatients = document.querySelector('.view-all-patients');
    if (viewAllPatients) {
        viewAllPatients.addEventListener('click', function(e) {
            e.preventDefault();
 
            hideAllContentSections();
            document.querySelector('.patients-content').style.display = 'block';
            
            updateActiveNavItem('Patients');
            updateAllDateTexts();
        });
    }
}

// Helper function to hide all content sections
function hideAllContentSections() {
    const sections = [
        '.content:not(.patients-content)',
        '.patients-content',
        '.tasks-content',
        '.messages-content',
        '.alerts-content',
        '.compliance-content',
        '.improvement-content',
        '.setting-content'
    ];
    
    sections.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.style.display = 'none';
    });
}

// Helper function to update active navigation item
function updateActiveNavItem(itemText) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.textContent.trim() === itemText) {
            item.classList.add('active');
        }
    });
}

// Date update function (mock - replace with your actual implementation)
function updateAllDateTexts() {
    const dateElements = document.querySelectorAll('[data-date]');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date().toLocaleDateString('en-US', options);
    
    dateElements.forEach(element => {
        element.textContent = today;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    handleNavigation();
    handleViewAllButtons();
    
    // Set initial active state
    const defaultNavItem = document.querySelector('.nav-item.active');
    if (!defaultNavItem && document.querySelector('.nav-item')) {
        document.querySelector('.nav-item').classList.add('active');
    }
    
    // Set initial content visibility
    if (document.querySelector('.content:not(.patients-content)')) {
        document.querySelector('.content:not(.patients-content)').style.display = 'block';
    }
});


// TOGGLEPASSWORD
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