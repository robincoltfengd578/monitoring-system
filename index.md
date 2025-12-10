---
layout: default
title: Machine & Equipment Daily Monitoring
---

# 🏭 Machine or Equipment Daily Monitoring

## 📊 Daily Attendance Tracking System

### Quick Links:
- [Submit Daily Attendance](#submit-form) ↓
- [View Today's Entries](#today-entries) ↓
- [Master Employee List](#employee-list) ↓

---

## 📝 Submit Daily Attendance
<div class="form-container">
    <form id="monitoringForm">
        <div class="form-group">
            <label for="date">Date *</label>
            <input type="date" id="date" class="form-control" required>
        </div>
        
        <div class="form-group">
            <label for="shift">Shift *</label>
            <select id="shift" class="form-control" required>
                <option value="">Select Shift</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="employeeName">Employee Name *</label>
            <select id="employeeName" class="form-control" required>
                <option value="">Select Employee</option>
                <!-- Options will be loaded from Master List -->
            </select>
        </div>
        
        <div class="form-group">
            <label for="position">Position *</label>
            <select id="position" class="form-control" required>
                <option value="">Select Position</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Boiler Operator">Boiler Operator</option>
                <option value="HVAC Teamlead">HVAC Teamlead</option>
                <option value="Technician">Technician</option>
                <option value="Operator">Operator</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="attendance">Attendance Status *</label>
            <select id="attendance" class="form-control" required>
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="On-Leave">On-Leave</option>
                <option value="Late">Late</option>
                <option value="Half-Day">Half-Day</option>
            </select>
        </div>
        
        <div class="form-group">
            <label for="location">Location *</label>
            <select id="location" class="form-control" required>
                <option value="">Select Location</option>
                <!-- Options will be loaded from Locations table -->
            </select>
        </div>
        
        <button type="submit" class="btn btn-primary">Submit Entry</button>
        <button type="reset" class="btn btn-secondary">Clear Form</button>
        
        <div id="successMessage" class="alert alert-success" style="display:none; margin-top:15px;">
            ✅ Entry submitted successfully!
        </div>
    </form>
</div>

---

## 📅 Today's Entries
<div id="todayEntries">
    <p>Loading today's entries...</p>
</div>

---

## 👥 Master Employee List
<div id="employeeList">
    <p>Loading employee list...</p>
</div>

---

## 🗺️ Locations List
<div id="locationList">
    <p>Loading locations...</p>
</div>

<script src="script.js"></script>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
<style>
    body {
        font-family: Arial, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f5f5f5;
    }
    .form-container {
        background: white;
        padding: 25px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin-bottom: 30px;
    }
    .form-group {
        margin-bottom: 15px;
    }
    label {
        font-weight: 600;
        margin-bottom: 5px;
        display: block;
    }
    .form-control {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
    }
    .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-right: 10px;
        margin-top: 10px;
    }
    .btn-primary {
        background-color: #007bff;
        color: white;
    }
    .btn-secondary {
        background-color: #6c757d;
        color: white;
    }
    .table {
        width: 100%;
        margin-top: 20px;
        background: white;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .table th {
        background-color: #007bff;
        color: white;
        padding: 12px;
        text-align: left;
    }
    .table td {
        padding: 10px 12px;
        border-bottom: 1px solid #eee;
    }
    .badge {
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
    }
    .badge-present { background-color: #28a745; color: white; }
    .badge-absent { background-color: #dc3545; color: white; }
    .badge-onleave { background-color: #ffc107; color: black; }
    .badge-late { background-color: #17a2b8; color: white; }
    .section-title {
        background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin: 30px 0 20px 0;
    }
</style>
