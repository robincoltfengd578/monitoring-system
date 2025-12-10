// ============================================
// AIRTABLE CONFIGURATION
// ============================================
const AIRTABLE_CONFIG = {
    // Replace with your actual Airtable credentials
    API_KEY: 'pat9ecL1akCTHawn0', // From Airtable Account > Generate API Key
    BASE_ID: 'app9mHFvaq9FDA4Up', // Your Base ID from Airtable URL
    
    // Table IDs from your Airtable
    TABLES: {
        ATTENDANCE: 'tblP5q2DtT7SlhBVI', // Attendance Monitoring table
        EMPLOYEES: 'tbJ3ew4URTGRzdHT', // Staff Members / Master List table
        LOCATIONS: 'tblZAfFjASubUgBSc' // Locations table (replace with actual)
    } 
};

// API URLs
const API_URLS = {
    ATTENDANCE: `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.TABLES.ATTENDANCE}`,
    EMPLOYEES: `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.TABLES.EMPLOYEES}`,
    LOCATIONS: `https://api.airtable.com/v0/${AIRTABLE_CONFIG.BASE_ID}/${AIRTABLE_CONFIG.TABLES.LOCATIONS}`
};

// Common headers for Airtable API
const API_HEADERS = {
    'Authorization': `Bearer ${AIRTABLE_CONFIG.API_KEY}`,
    'Content-Type': 'application/json'
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
    
    // Load all data
    initializeData();
    
    // Setup form submission
    setupFormSubmission();
});

// ============================================
// DATA INITIALIZATION
// ============================================
async function initializeData() {
    try {
        // Load data in parallel
        await Promise.all([
            loadEmployeeDropdown(),
            loadLocationDropdown(),
            loadTodayEntries(),
            loadEmployeeList(),
            loadLocationList()
        ]);
        
        console.log('All data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please refresh the page.');
    }
}

// ============================================
// FORM HANDLING
// ============================================
function setupFormSubmission() {
    const form = document.getElementById('monitoringForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            "Date": document.getElementById('date').value,
            "Shift": document.getElementById('shift').value,
            "Employee Name": document.getElementById('employeeName').value,
            "Position": document.getElementById('position').value,
            "Attendance": document.getElementById('attendance').value,
            "Location": document.getElementById('location').value
        };
        
        // Validate form
        if (!validateForm(formData)) {
            return;
        }
        
        // Submit to Airtable
        try {
            await submitToAirtable(formData);
            
            // Show success message
            showSuccessMessage();
            
            // Reset form (but keep today's date)
            form.reset();
            document.getElementById('date').value = new Date().toISOString().split('T')[0];
            
            // Reload today's entries
            await loadTodayEntries();
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('Error submitting form. Please try again.');
        }
    });
}

function validateForm(data) {
    for (const key in data) {
        if (!data[key]) {
            alert(`Please fill in ${key}`);
            return false;
        }
    }
    return true;
}

async function submitToAirtable(data) {
    const response = await fetch(API_URLS.ATTENDANCE, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ fields: data })
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}

function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    message.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        message.style.display = 'none';
    }, 3000);
}

// ============================================
// DROPDOWN LOADING
// ============================================
async function loadEmployeeDropdown() {
    try {
        const response = await fetch(`${API_URLS.EMPLOYEES}?view=Grid%20view`, {
            headers: API_HEADERS
        });
        
        if (response.ok) {
            const data = await response.json();
            const select = document.getElementById('employeeName');
            
            // Clear existing options (except first)
            select.innerHTML = '<option value="">Select Employee</option>';
            
            // Add employee options
            data.records.forEach(record => {
                const employeeName = record.fields['Employee Name'];
                if (employeeName) {
                    const option = document.createElement('option');
                    option.value = employeeName;
                    option.textContent = employeeName;
                    select.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error('Error loading employees:', error);
    }
}

async function loadLocationDropdown() {
    try {
        const response = await fetch(API_URLS.LOCATIONS, {
            headers: API_HEADERS
        });
        
        if (response.ok) {
            const data = await response.json();
            const select = document.getElementById('location');
            
            // Clear existing options (except first)
            select.innerHTML = '<option value="">Select Location</option>';
            
            // Add location options
            data.records.forEach(record => {
                const location = record.fields['Location'] || record.fields['Code'];
                if (location) {
                    const option = document.createElement('option');
                    option.value = location;
                    option.textContent = location;
                    select.appendChild(option);
                }
            });
        }
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

// ============================================
// TODAY'S ENTRIES DISPLAY
// ============================================
async function loadTodayEntries() {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Filter formula for today's entries
        const filterFormula = encodeURIComponent(`DATESTR({Date}) = '${today}'`);
        const url = `${API_URLS.ATTENDANCE}?filterByFormula=${filterFormula}&sort[0][field]=Shift&sort[0][direction]=asc`;
        
        const response = await fetch(url, {
            headers: API_HEADERS
        });
        
        if (response.ok) {
            const data = await response.json();
            displayTodayEntries(data.records);
        }
    } catch (error) {
        console.error('Error loading today entries:', error);
        document.getElementById('todayEntries').innerHTML = 
            '<p class="text-danger">Error loading entries</p>';
    }
}

function displayTodayEntries(records) {
    const container = document.getElementById('todayEntries');
    
    if (!records || records.length === 0) {
        container.innerHTML = '<p>No entries for today yet.</p>';
        return;
    }
    
    let html = `
        <div class="section-title">
            <h4>📋 Today's Attendance (${records.length} entries)</h4>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Shift</th>
                    <th>Status</th>
                    <th>Location</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    records.forEach(record => {
        const fields = record.fields;
        html += `
            <tr>
                <td>${formatTime(fields.Date)}</td>
                <td>${fields['Employee Name'] || ''}</td>
                <td>${fields.Position || ''}</td>
                <td>${fields.Shift || ''}</td>
                <td><span class="badge badge-${getAttendanceClass(fields.Attendance)}">${fields.Attendance || ''}</span></td>
                <td>${fields.Location || ''}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// ============================================
// EMPLOYEE LIST DISPLAY
// ============================================
async function loadEmployeeList() {
    try {
        const response = await fetch(`${API_URLS.EMPLOYEES}?view=Grid%20view`, {
            headers: API_HEADERS
        });
        
        if (response.ok) {
            const data = await response.json();
            displayEmployeeList(data.records);
        }
    } catch (error) {
        console.error('Error loading employee list:', error);
    }
}

function displayEmployeeList(records) {
    const container = document.getElementById('employeeList');
    
    let html = `
        <div class="section-title">
            <h4>👥 Staff Members (${records.length})</h4>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">
    `;
    
    records.forEach(record => {
        const fields = record.fields;
        html += `
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <h6 style="margin: 0 0 5px 0;">${fields['Employee Name'] || 'Unnamed'}</h6>
                <p style="color: #666; margin: 0; font-size: 14px;">
                    Position: ${fields.Position || 'Not specified'}<br>
                    ID: ${record.id.substring(0, 8)}...
                </p>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// ============================================
// LOCATION LIST DISPLAY
// ============================================
async function loadLocationList() {
    try {
        const response = await fetch(API_URLS.LOCATIONS, {
            headers: API_HEADERS
        });
        
        if (response.ok) {
            const data = await response.json();
            displayLocationList(data.records);
        }
    } catch (error) {
        console.error('Error loading location list:', error);
    }
}

function displayLocationList(records) {
    const container = document.getElementById('locationList');
    
    let html = `
        <div class="section-title">
            <h4>🗺️ Locations</h4>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th>Code</th>
                    <th>Location Name</th>
                    <th>Supervisor</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    records.forEach(record => {
        const fields = record.fields;
        html += `
            <tr>
                <td><strong>${fields.Code || ''}</strong></td>
                <td>${fields.Location || ''}</td>
                <td>${fields['A Supervisor'] || fields.Supervisor || ''}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getAttendanceClass(status) {
    if (!status) return 'secondary';
    
    const statusMap = {
        'Present': 'present',
        'Absent': 'absent',
        'On-Leave': 'onleave',
        'Late': 'late',
        'Half-Day': 'warning'
    };
    
    return statusMap[status] || 'secondary';
}

// Auto-update every 30 seconds
setInterval(loadTodayEntries, 30000);
