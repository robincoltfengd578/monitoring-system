# Machine & Equipment Daily Monitoring System

A real-time attendance tracking system for staff monitoring across multiple locations.

## Features
- ✅ Real-time attendance submission
- ✅ Update existing attendance records
- ✅ Today's entries display with filtering
- ✅ Staff overview by status
- ✅ Location management
- ✅ Statistics dashboard
- ✅ Mobile responsive design

## Setup Instructions

### 1. Airtable Configuration
- **Base ID**: `app9mHFvaq9FDA4Up`
- **API Key**: `pat9ecL1akCTHawn0`
- **Tables**:
  - Attendance: `tblP5q2DtT7SlhBVI`
  - Locations: `tblZAfFjASubUgBSc`
  - Employees: `tbJ3ew4URTGRzdHT`

### 2. GitHub Setup
1. Create new repository
2. Upload all 3 files:
   - `index.html`
   - `script.js`
   - `README.md` (optional)
3. Enable GitHub Pages:
   - Settings → Pages → Source: main branch

### 3. Access the System
Visit: `https://[your-username].github.io/[repository-name]`

## Table Structure

### Attendance Monitoring
- Date (Date)
- Shift (Single Select: Morning/Afternoon/Night)
- Employee Name (Single Line Text)
- Position (Single Line Text)
- Attendance (Single Select: Present/Absent/On-Leave/Late/Half-Day)
- Location (Single Select)

### Locations
- Code (Single Line Text: D-1, D-2, etc.)
- Location (Single Line Text: Disney 1, etc.)
- Supervisor (Link to Employees)

### Master List
- Employee Name (Single Line Text)
- Position (Single Select)
- Status (Single Select: Active/Inactive)
- Location (Link to Locations)
- Supervisor (Link to Employees)

## Security Notes
⚠️ API key is exposed in client-side code. For production:
- Use environment variables
- Implement a proxy server
- Use limited-scope API key

## Support
For issues or questions, check browser console for errors.
