---
layout: default
title: Machine & Equipment Daily Monitoring
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Machine & Equipment Daily Monitoring</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #3498db;
            --success-color: #27ae60;
            --warning-color: #f39c12;
            --danger-color: #e74c3c;
        }
        
        body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .header {
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            padding: 30px 0;
            border-radius: 0 0 20px 20px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .container-custom {
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.08);
            margin-bottom: 25px;
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card-header {
            background: linear-gradient(135deg, var(--secondary-color) 0%, #2980b9 100%);
            color: white;
            border-radius: 15px 15px 0 0 !important;
            padding: 20px;
            border: none;
        }
        
        .form-control, .form-select {
            border: 2px solid #e1e5eb;
            border-radius: 10px;
            padding: 12px 15px;
            transition: all 0.3s;
        }
        
        .form-control:focus, .form-select:focus {
            border-color: var(--secondary-color);
            box-shadow: 0 0 0 0.25rem rgba(52, 152, 219, 0.25);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, var(--secondary-color) 0%, #2980b9 100%);
            border: none;
            border-radius: 10px;
            padding: 12px 30px;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
        }
        
        .table {
            border-radius: 10px;
            overflow: hidden;
        }
        
        .table thead {
            background: linear-gradient(135deg, var(--primary-color) 0%, #34495e 100%);
            color: white;
        }
        
        .badge {
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: 600;
        }
        
        .stats-card {
            background: white;
            border-radius: 15px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .stats-icon {
            font-size: 2.5rem;
            margin-bottom: 15px;
            color: var(--secondary-color);
        }
        
        .stats-number {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .stats-label {
            color: #7f8c8d;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .location-badge {
            display: inline-block;
            padding: 5px 15px;
            background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
            color: white;
            border-radius: 20px;
            font-weight: 600;
            margin: 3px;
        }
        
        .employee-card {
            background: white;
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 10px;
            border-left: 5px solid var(--secondary-color);
            transition: all 0.3s;
        }
        
        .employee-card:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .update-btn {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            border: none;
            border-radius: 8px;
            padding: 8px 20px;
            color: white;
            font-weight: 600;
            transition: all 0.3s;
        }
        
        .update-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(39, 174, 96, 0.4);
        }
        
        .modal-content {
            border-radius: 15px;
            border: none;
        }
        
        .modal-header {
            background: linear-gradient(135deg, var(--secondary-color) 0%, #2980b9 100%);
            color: white;
            border-radius: 15px 15px 0 0;
            border: none;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            color: #7f8c8d;
        }
        
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--secondary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="container-custom">
            <div class="row align-items-center">
                <div class="col-md-8">
                    <h1><i class="bi bi-speedometer2"></i> Machine & Equipment Daily Monitoring</h1>
                    <p class="lead mb-0">Real-time staff attendance and location tracking system</p>
                </div>
                <div class="col-md-4 text-end">
                    <div id="currentDateTime" class="text-white">
                        <i class="bi bi-clock"></i> Loading...
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Content -->
    <div class="container-custom">
        <!-- Stats Overview -->
        <div class="row mb-4" id="statsOverview">
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="bi bi-people-fill"></i>
                    </div>
                    <div class="stats-number" id="totalPresent">0</div>
                    <div class="stats-label">Present Today</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="bi bi-person-x-fill"></i>
                    </div>
                    <div class="stats-number" id="totalAbsent">0</div>
                    <div class="stats-label">Absent Today</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="bi bi-geo-alt-fill"></i>
                    </div>
                    <div class="stats-number" id="activeLocations">0</div>
                    <div class="stats-label">Active Locations</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stats-card">
                    <div class="stats-icon">
                        <i class="bi bi-person-badge-fill"></i>
                    </div>
                    <div class="stats-number" id="totalStaff">0</div>
                    <div class="stats-label">Total Staff</div>
                </div>
            </div>
        </div>

        <!-- Main Row -->
        <div class="row">
            <!-- Left Column: Form -->
            <div class="col-lg-5">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0"><i class="bi bi-clipboard-plus"></i> Daily Attendance Entry</h4>
                    </div>
                    <div class="card-body">
                        <form id="monitoringForm">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Date <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control" id="date" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Shift <span class="text-danger">*</span></label>
                                    <select class="form-select" id="shift" required>
                                        <option value="">Select Shift</option>
                                        <option value="Morning">Morning</option>
                                        <option value="Afternoon">Afternoon</option>
                                        <option value="Night">Night</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Employee <span class="text-danger">*</span></label>
                                    <select class="form-select" id="employeeName" required>
                                        <option value="">Select Employee</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Position</label>
                                    <input type="text" class="form-control" id="position" readonly>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Attendance <span class="text-danger">*</span></label>
                                    <select class="form-select" id="attendance" required>
                                        <option value="">Select Status</option>
                                        <option value="Present">✅ Present</option>
                                        <option value="Absent">❌ Absent</option>
                                        <option value="On-Leave">🌴 On-Leave</option>
                                        <option value="Late">⏰ Late</option>
                                        <option value="Half-Day">🕐 Half-Day</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label fw-bold">Location <span class="text-danger">*</span></label>
                                    <select class="form-select" id="location" required>
                                        <option value="">Select Location</option>
                                    </select>
                                </div>
                            </div>

                            <div class="alert alert-success d-none" id="successMessage">
                                <i class="bi bi-check-circle-fill"></i> Attendance record submitted successfully!
                            </div>

                            <div class="alert alert-danger d-none" id="errorMessage">
                                <i class="bi bi-exclamation-circle-fill"></i> <span id="errorText"></span>
                            </div>

                            <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <button type="reset" class="btn btn-outline-secondary me-2">
                                    <i class="bi bi-eraser"></i> Clear
                                </button>
                                <button type="submit" class="btn btn-primary" id="submitBtn">
                                    <i class="bi bi-send-check"></i> Submit Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Locations Card -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0"><i class="bi bi-geo-alt"></i> Available Locations</h4>
                    </div>
                    <div class="card-body">
                        <div id="locationsList" class="loading">
                            <div class="loading-spinner"></div>
                            <p>Loading locations...</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Today's Entries -->
            <div class="col-lg-7">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h4 class="mb-0"><i class="bi bi-calendar-day"></i> Today's Attendance Records</h4>
                        <button class="btn btn-sm btn-outline-light" onclick="refreshData()">
                            <i class="bi bi-arrow-clockwise"></i> Refresh
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Employee</th>
                                        <th>Position</th>
                                        <th>Shift</th>
                                        <th>Attendance</th>
                                        <th>Location</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody id="todayEntries">
                                    <tr>
                                        <td colspan="7" class="text-center">
                                            <div class="loading-spinner" style="width: 30px; height: 30px;"></div>
                                            <p class="mt-2">Loading today's entries...</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Employee Status -->
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0"><i class="bi bi-person-lines-fill"></i> Staff Overview</h4>
                    </div>
                    <div class="card-body">
                        <div class="row" id="employeeOverview">
                            <div class="col-md-12">
                                <div class="loading">
                                    <div class="loading-spinner"></div>
                                    <p>Loading staff information...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Update Modal -->
    <div class="modal fade" id="updateModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="bi bi-pencil-square"></i> Update Attendance</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="updateForm">
                        <input type="hidden" id="updateRecordId">
                        <div class="mb-3">
                            <label class="form-label fw-bold">Employee</label>
                            <input type="text" class="form-control" id="updateEmployee" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Attendance Status <span class="text-danger">*</span></label>
                            <select class="form-select" id="updateAttendance" required>
                                <option value="Present">✅ Present</option>
                                <option value="Absent">❌ Absent</option>
                                <option value="On-Leave">🌴 On-Leave</option>
                                <option value="Late">⏰ Late</option>
                                <option value="Half-Day">🕐 Half-Day</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Location <span class="text-danger">*</span></label>
                            <select class="form-select" id="updateLocation" required>
                                <option value="">Select Location</option>
                            </select>
                        </div>
                        <div class="alert alert-success d-none" id="updateSuccessMessage">
                            <i class="bi bi-check-circle-fill"></i> Record updated successfully!
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="updateAttendanceRecord()">Update</button>
                </div>
            </div>
        </div>
    </div>

 <!-- Netlify API Configuration -->
    <script>
        // Override API endpoint for Netlify
        window.NETLIFY_API_ENDPOINT = 'https://monitoringengrobico.netlify.app/.netlify/functions/airtable';
    </script>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Main Script -->
    <script src="script.js"></script>
    
</body>
</html>
