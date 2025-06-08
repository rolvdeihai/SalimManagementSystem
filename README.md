# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


## Inventory Management System - User Guide

### Overview
This system helps track inventory items and manage employee deductions. It consists of:
1. **Web Admin Dashboard** - For managers
2. **Mobile App** - For employees
3. **Google Sheets Backend** - Stores all data

### 🌟 Administrator Guide

#### 1. Accessing the Dashboard
1. Go to: `https://[your-username].github.io/[repo-name]`
2. Login with:
   - **Admin PIN**: `9999` (master admin)
   - **Employee PIN**: Your personal 4-digit PIN

#### 2. Managing Items
**Add New Item:**
1. Go to Items → Click "Add New Item"
2. Fill details:
   - Name: Laptop Dell
   - Category: Electronics
   - Stock: 50
   - Min Stock: 5 (triggers alerts)
3. Click "Save Item"

**Update Stock:**
1. Find item in list
2. Click edit (✏️) icon
3. Adjust stock quantity
4. Click "Save"

**Low Stock Alerts:**
- Items below min stock appear in red on Dashboard
- "Low Stock" card shows count of critical items

#### 3. Managing Employees
**Add Employee:**
1. Go to Employees → "Add New Employee"
2. Enter:
   - Name: John Doe
   - PIN: 1234 (4-digit number)
   - Role: employee or admin
3. Click "Save Employee"

**Employee Permissions:**
| Role       | Access                              |
|------------|-------------------------------------|
| admin      | Full access to all features         |
| employee   | Only mobile app functions           |

**Reset PIN:**
1. Find employee → Click edit
2. Enter new PIN
3. Click "Save"

#### 4. Viewing History
**Filter Options:**
- Date range (Today/7 Days/30 Days)
- Action type (Deductions/Restocks)
- Employee name

**Correct Mistakes:**
1. Find incorrect record
2. Click edit (✏️)
3. Adjust quantity/action type
4. Add note: "Corrected miscount"
5. Click "Update"

#### 5. System Settings
**Configure:**
1. API URL: `https://script.google.com/...` (auto-filled)
2. Low Stock Threshold: Default=5
3. Email Alerts: Add your email to receive notifications

---

### 📱 Employee Mobile App Guide

#### 1. First-Time Setup
1. Download "Expo Go" from App Store/Play Store
2. Scan QR code from admin (changes per session)
3. App automatically loads

#### 2. Daily Login
1. Enter your 4-digit PIN
   - Example: `1234` for John Doe
2. Press "Login"

#### 3. Deducting Items
**Single Item:**
1. Select item from list
2. Enter quantity
3. Tap "Deduct Item"

**Multiple Items (Batch):**
1. Tap barcode icon 📷
2. Scan items one by one
3. Enter total quantity
4. Tap "Deduct All"

#### 4. Viewing Your History
1. Go to History tab
2. Shows your last 50 actions
3. Filter by date range

#### 5. Finding Items
1. Use search bar at top
2. Search by name or category
3. Shows real-time stock levels

---

### 🔒 Security & PIN Management

#### PIN Rules:
- 4-digit numbers only (no letters)
- Don't use obvious combinations (1111/1234)
- Admin should reset PINs every 90 days

#### Admin PINs:
- Master Admin: `9999` (configure in Apps Script)
- Personal Admin PIN: Set via employee management

#### Employee PINs:
- Created by admin during employee setup
- Changed via admin dashboard

---

### ⚠️ Troubleshooting Guide

| Issue                          | Solution                                  |
|--------------------------------|-------------------------------------------|
| Can't login to mobile app      | 1. Check internet connection<br>2. Ask admin to reset PIN |
| Item stock not updating        | 1. Refresh app<br>2. Confirm deduction succeeded |
| "Insufficient stock" error     | 1. Check current stock<br>2. Ask admin to restock |
| History shows wrong employee   | Admin can edit history record             |
| Barcode scanner not working    | 1. Allow camera access<br>2. Clean lens<br>3. Ensure good lighting |

---

### 🚨 Emergency Procedures

**Locked Out of Admin Dashboard:**
1. Use master PIN: `9999`
2. Reset your personal PIN via Employees page

**Employee Left Company:**
1. Go to Employees
2. Delete employee account
3. Create new PIN for replacement

**Critical Data Error:**
1. Go to History
2. Find incorrect record
3. Edit or delete the record
4. Add admin note explaining correction

---

### Best Practices
1. **Daily Checks:**
   - Review low stock items
   - Verify recent deductions
2. **Monthly Audit:**
   - Compare physical stock vs digital records
   - Generate history report (filter by month)
3. **Employee Training:**
   - Always scan barcodes when available
   - Report low stock through app comments
   - Log out after each session

### Support Contact
For urgent issues:  
📞 IT Support: +1 (555) 123-4567  
✉️ Email: support@inventoryapp.com  

---

> **Note**: All data is stored in a private Google Sheet. Only authorized users with the secret key can access the API. Never share your PIN or login credentials.
