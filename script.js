// ============================================
// NETLIFY API CONFIGURATION
// ============================================
const NETLIFY_CONFIG = 'monitoringengrobico.netlify.app' {
    // Netlify function endpoint
    API_ENDPOINT: '/api/airtable',
    
    // Tables mapping
    TABLES: {
        ATTENDANCE: 'attendance',
        LOCATIONS: 'locations',
        EMPLOYEES: 'employees'
    }
};

// Common headers for API requests
const API_HEADERS = {
    'Content-Type': 'application/json'
};

// Helper function to call Netlify function
async function callNetlifyFunction(table, action = 'list', data = {}, recordId = null, filter = null) {
    try {
        let url = `${NETLIFY_CONFIG.API_ENDPOINT}?table=${table}&action=${action}`;
        
        if (recordId) {
            url += `&recordId=${recordId}`;
        }
        
        if (filter) {
            url += `&filter=${encodeURIComponent(filter)}`;
        }
        
        const options = {
            method: action === 'list' ? 'GET' : action === 'create' ? 'POST' : 'PATCH',
            headers: API_HEADERS
        };
        
        if (action !== 'list') {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(url, options);
        
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Netlify function error:', error);
        throw error;
    }
}

// ============================================
// GLOBAL VARIABLES
// ============================================
let allEmployees = [];
let allLocations = [];
let currentDate = new Date().toISOString().split('T')[0];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    document.getElementById('date').value = currentDate;
    
    // Initialize date/time display
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Load all data
    initializeData();
    
    // Setup form submission
    setupForm();
    
    // Auto-refresh data every 30 seconds
    setInterval(loadAllData, 30000);
});

// Update current date/time display
function updateDateTime() {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    document.getElementById('currentDateTime').innerHTML = 
        `<i class="bi bi-clock"></i> ${dateStr} | ${timeStr}`;
}

// ============================================
// DATA INITIALIZATION
// ============================================
async function initializeData() {
    try {
        // Load employees and locations first (for dropdowns)
        await Promise.all([
            loadEmployees(),
            loadLocations()
        ]);
        
        // Then load today's data
        await loadAllData();
        
        console.log('System initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize system. Please refresh the page.');
    }
}

async function loadAllData() {
    try {
        await Promise.all([
            loadTodayEntries(),
            loadStats(),
            loadEmployeeOverview()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function refreshData() {
    showLoading();
    loadAllData();
}

function showLoading() {
    const entriesTable = document.getElementById('todayEntries');
    if (entriesTable) {
        entriesTable.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="loading-spinner" style="width: 30px; height: 30px; margin: 0 auto;"></div>
                    <p class="mt-2">Refreshing data...</p>
                </td>
            </tr>
        `;
    }
}

// ============================================
// EMPLOYEES MANAGEMENT
// ============================================
async function loadEmployees() {
    try {
        const data = await callNetlifyFunction(
            NETLIFY_CONFIG.TABLES.EMPLOYEES,
            'list',
            { view: 'Grid view' }
        );
        
        allEmployees = data.records.map(record => ({
            id: record.id,
            name: record.fields['Employee Name'] || '',
            position: record.fields['Position'] || '',
            status: record.fields['Status'] || 'Active',
            location: record.fields['Location'] || '',
            supervisor: record.fields['Supervisor'] || ''
        }));
        
        // Populate employee dropdown
        populateEmployeeDropdown();
        
        // Update total staff count
        document.getElementById('totalStaff').textContent = allEmployees.length;
        
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

function populateEmployeeDropdown() {
    const dropdown = document.getElementById('employeeName');
    dropdown.innerHTML = '<option value="">Select Employee</option>';
    
    // Filter only active employees
    const activeEmployees = allEmployees.filter(emp => emp.status === 'Active');
    
    activeEmployees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.name;
        option.textContent = `${employee.name} (${employee.position})`;
        option.dataset.position = employee.position;
        dropdown.appendChild(option);
    });
    
    // Auto-fill position when employee is selected
    dropdown.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        if (selectedOption.dataset.position) {
            document.getElementById('position').value = selectedOption.dataset.position;
        }
    });
}

// ============================================
// LOCATIONS MANAGEMENT
// ============================================
async function loadLocations() {
    try {
        const data = await callNetlifyFunction(
            NETLIFY_CONFIG.TABLES.LOCATIONS,
            'list'
        );
        
        allLocations = data.records.map(record => ({
            id: record.id,
            code: record.fields['Code'] || '',
            name: record.fields['Location'] || '',
            supervisor: record.fields['Supervisor'] || ''
        }));
        
        // Populate location dropdowns
        populateLocationDropdown('location');
        populateLocationDropdown('updateLocation');
        
        // Display locations list
        displayLocationsList();
        
        // Update active locations count
        document.getElementById('activeLocations').textContent = allLocations.length;
        
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

function populateLocationDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">Select Location</option>';
    
    allLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location.code;
        option.textContent = `${location.code} - ${location.name}`;
        dropdown.appendChild(option);
    });
}

function displayLocationsList() {
    const container = document.getElementById('locationsList');
    
    let html = '<div class="row">';
    allLocations.forEach(location => {
        html += `
            <div class="col-md-6 mb-2">
                <div class="location-badge">
                    <strong>${location.code}</strong><br>
                    <small>${location.name}</small>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    container.innerHTML = html;
}

// ============================================
// FORM SUBMISSION
// ============================================
function setupForm() {
    const form = document.getElementById('monitoringForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Disable submit button to prevent double submission
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Submitting...';
        
        // Hide previous messages
        hideMessages();
        
        // Validate form
        if (!validateForm()) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send-check"></i> Submit Entry';
            return;
        }
        
        // Prepare data
        const formData = {
            "Date": document.getElementById('date').value,
            "Shift": document.getElementById('shift').value,
            "Employee Name": document.getElementById('employeeName').value,
            "Position": document.getElementById('position').value,
            "Attendance": document.getElementById('attendance').value,
            "Location": document.getElementById('location').value,
            "Timestamp": new Date().toISOString()
        };
        
        try {
            // Submit via Netlify function
            const response = await callNetlifyFunction(
                NETLIFY_CONFIG.TABLES.ATTENDANCE,
                'create',
                { fields: formData }
            );
            
            // Show success message
            document.getElementById('successMessage').classList.remove('d-none');
            
            // Reset form
            form.reset();
            document.getElementById('date').value = currentDate;
            document.getElementById('position').value = '';
            
            // Reload today's entries
            await loadAllData();
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                document.getElementById('successMessage').classList.add('d-none');
            }, 3000);
            
        } catch (error) {
            console.error('Submission error:', error);
            showError('Failed to submit. Please try again.');
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send-check"></i> Submit Entry';
        }
    });
}

function validateForm() {
    const requiredFields = ['date', 'shift', 'employeeName', 'attendance', 'location'];
    
    for (const fieldId of requiredFields) {
        const field = document.getElementById(fieldId);
        if (!field.value) {
            showError(`Please fill in ${fieldId.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            field.focus();
            return false;
        }
    }
    
    return true;
}

function hideMessages() {
    document.getElementById('successMessage').classList.add('d-none');
    document.getElementById('errorMessage').classList.add('d-none');
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    document.getElementById('errorText').textContent = message;
    errorElement.classList.remove('d-none');
    
    setTimeout(() => {
        errorElement.classList.add('d-none');
    }, 5000);
}

// ============================================
// TODAY'S ENTRIES
// ============================================
async function loadTodayEntries() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const filterFormula = `DATESTR({Date}) = '${today}'`;
        
        const data = await callNetlifyFunction(
            NETLIFY_CONFIG.TABLES.ATTENDANCE,
            'list',
            {},
            null,
            filterFormula
        );
        
        displayTodayEntries(data.records);
        
    } catch (error) {
        console.error('Error loading today entries:', error);
        document.getElementById('todayEntries').innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle"></i> Error loading entries
                </td>
            </tr>
        `;
    }
}

function displayTodayEntries(records) {
    const container = document.getElementById('todayEntries');
    
    if (!records || records.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="bi bi-inbox"></i> No attendance records for today
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    
    records.forEach(record => {
        const fields = record.fields;
        const time = fields.Timestamp ? formatTime(fields.Timestamp) : '';
        
        html += `
            <tr>
                <td>${time}</td>
                <td><strong>${fields['Employee Name'] || ''}</strong></td>
                <td>${fields.Position || ''}</td>
                <td><span class="badge bg-info">${fields.Shift || ''}</span></td>
                <td>
                    <span class="badge bg-${getAttendanceColor(fields.Attendance)}">
                        ${getAttendanceIcon(fields.Attendance)} ${fields.Attendance || ''}
                    </span>
                </td>
                <td><span class="badge bg-secondary">${fields.Location || ''}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="openUpdateModal('${record.id}', '${fields['Employee Name']}', '${fields.Attendance}', '${fields.Location}')">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                </td>
            </tr>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// UPDATE ATTENDANCE (COLUMN TYPE UPDATE)
// ============================================
function openUpdateModal(recordId, employeeName, attendance, location) {
    document.getElementById('updateRecordId').value = recordId;
    document.getElementById('updateEmployee').value = employeeName;
    document.getElementById('updateAttendance').value = attendance;
    document.getElementById('updateLocation').value = location;
    
    const modal = new bootstrap.Modal(document.getElementById('updateModal'));
    modal.show();
}

async function updateAttendanceRecord() {
    const recordId = document.getElementById('updateRecordId').value;
    const newAttendance = document.getElementById('updateAttendance').value;
    const newLocation = document.getElementById('updateLocation').value;
    
    if (!newAttendance || !newLocation) {
        alert('Please fill all fields');
        return;
    }
    
    const updateData = {
        fields: {
            "Attendance": newAttendance,
            "Location": newLocation,
            "Last Updated": new Date().toISOString()
        }
    };
    
    try {
        await callNetlifyFunction(
            NETLIFY_CONFIG.TABLES.ATTENDANCE,
            'update',
            { fields: updateData },
            recordId
        );
        
        // Show success message
        document.getElementById('updateSuccessMessage').classList.remove('d-none');
        
        // Reload today's entries
        setTimeout(async () => {
            await loadAllData();
            
            // Hide modal after 1.5 seconds
            setTimeout(() => {
                bootstrap.Modal.getInstance(document.getElementById('updateModal')).hide();
                document.getElementById('updateSuccessMessage').classList.add('d-none');
            }, 1500);
        }, 1000);
        
    } catch (error) {
        console.error('Update error:', error);
        alert('Failed to update. Please try again.');
    }
}

// ============================================
// STATISTICS
// ============================================
async function loadStats() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const filterFormula = `DATESTR({Date}) = '${today}'`;
        
        const data = await callNetlifyFunction(
            NETLIFY_CONFIG.TABLES.ATTENDANCE,
            'list',
            {},
            null,
            filterFormula
        );
        
        calculateStats(data.records);
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function calculateStats(records) {
    let presentCount = 0;
    let absentCount = 0;
    let uniqueLocations = new Set();
    
    records.forEach(record => {
        const attendance = record.fields.Attendance;
        const location = record.fields.Location;
        
        if (attendance === 'Present') {
            presentCount++;
        } else if (attendance === 'Absent') {
            absentCount++;
        }
        
        if (location) {
            uniqueLocations.add(location);
        }
    });
    
    // Update stats display
    document.getElementById('totalPresent').textContent = presentCount;
    document.getElementById('totalAbsent').textContent = absentCount;
    document.getElementById('activeLocations').textContent = uniqueLocations.size;
}

// ============================================
// EMPLOYEE OVERVIEW
// ============================================
async function loadEmployeeOverview() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const filterFormula = `DATESTR({Date}) = '${today}'`;
        
        const data = await callNetlifyFunction(
            NETLIFY_CONFIG.TABLES.ATTENDANCE,
            'list',
            {},
            null,
            filterFormula
        );
        
        displayEmployeeOverview(data.records);
        
    } catch (error) {
        console.error('Error loading employee overview:', error);
    }
}

function displayEmployeeOverview(records) {
    const container = document.getElementById('employeeOverview');
    
    if (!records || records.length === 0) {
        container.innerHTML = `
            <div class="col-md-12 text-center text-muted">
                <i class="bi bi-person-slash"></i> No attendance records for today
            </div>
        `;
        return;
    }
    
    // Group by attendance status
    const groupedByStatus = {};
    records.forEach(record => {
        const status = record.fields.Attendance || 'Unknown';
        if (!groupedByStatus[status]) {
            groupedByStatus[status] = [];
        }
        groupedByStatus[status].push(record);
    });
    
    let html = '';
    for (const [status, employees] of Object.entries(groupedByStatus)) {
        html += `
            <div class="col-md-4 mb-3">
                <div class="employee-card">
                    <h6 class="mb-2">
                        <span class="badge bg-${getAttendanceColor(status)} me-2">
                            ${getAttendanceIcon(status)}
                        </span>
                        ${status}
                        <span class="badge bg-dark float-end">${employees.length}</span>
                    </h6>
                    <div class="employee-list" style="max-height: 150px; overflow-y: auto;">
        `;
        
        employees.forEach(record => {
            html += `
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span>${record.fields['Employee Name'] || 'Unknown'}</span>
                    <small class="badge bg-secondary">${record.fields.Location || ''}</small>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatTime(dateTimeString) {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function getAttendanceColor(status) {
    const colors = {
        'Present': 'success',
        'Absent': 'danger',
        'On-Leave': 'warning',
        'Late': 'info',
        'Half-Day': 'primary'
    };
    return colors[status] || 'secondary';
}

function getAttendanceIcon(status) {
    const icons = {
        'Present': '✅',
        'Absent': '❌',
        'On-Leave': '🌴',
        'Late': '⏰',
        'Half-Day': '🕐'
    };
    return icons[status] || '';
}

// ============================================
// ERROR HANDLING
// ============================================
// Handle API errors
function handleApiError(response) {
    if (response.status === 401) {
        showError('Unauthorized: Please check your configuration');
    } else if (response.status === 403) {
        showError('Forbidden: You don\'t have permission to access this resource');
    } else if (response.status === 404) {
        showError('Not Found: The requested resource was not found');
    } else if (response.status === 429) {
        showError('Too Many Requests: Please wait before trying again');
    } else {
        showError(`API Error: ${response.status}`);
    }
}

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', error);
    showError('An unexpected error occurred. Please refresh the page.');
    return true;
};
