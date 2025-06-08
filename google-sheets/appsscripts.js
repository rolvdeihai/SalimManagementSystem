// const SHEET_ID = "1g3SBNnN_S2Vn_VfngvZ4DfKPDt1LnTVAa0u5lWjQhGs";
// const SHEET_NAME = "InventorySalim";

const SHEET_ID = "1g3SBNnN_S2Vn_VfngvZ4DfKPDt1LnTVAa0u5lWjQhGs";
const SECRET_KEY = "yoyo";
const ADMIN_PIN = "9999"; // Master admin PIN

// ========================
// API ENTRY POINT
// ========================
function doPost(e) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST'
  };

  try {
    const payload = JSON.parse(e.postData.contents);
    const { action, data, secret } = payload;

    // Verify secret
    if (secret !== SECRET_KEY) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        error: "Unauthorized"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);

    let result;
    switch(action) {
      case "LOGIN": 
        result = handleLogin(ss, data);
        break;
      case "GET_ITEMS": 
        result = getItems(ss);
        break;
      case "SEARCH_ITEMS": 
        result = searchItems(ss, data.query);
        break;
      case "ADD_ITEM": 
        result = addItem(ss, data);
        break;
      case "UPDATE_ITEM": 
        result = updateItem(ss, data);
        break;
      case "DELETE_ITEM": 
        result = deleteItem(ss, data);
        break;
      case "DEDUCT_ITEM": 
        result = deductItem(ss, data);
        break;
      case "RESTOCK_ITEM": 
        result = restockItem(ss, data);
        break;
      case "GET_EMPLOYEES": 
        result = getEmployees(ss);
        break;
      case "ADD_EMPLOYEE": 
        result = addEmployee(ss, data);
        break;
      case "UPDATE_EMPLOYEE": 
        result = updateEmployee(ss, data);
        break;
      case "DELETE_EMPLOYEE": 
        result = deleteEmployee(ss, data);
        break;
      case "GET_HISTORY": 
        result = getHistory(ss, data);
        break;
      case "UPDATE_HISTORY": 
        result = updateHistory(ss, data);
        break;
        
      case "DELETE_HISTORY": 
        result = deleteHistory(ss, data);
        break;
      default: 
        throw new Error("Invalid action");
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      data: result
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type"
    });
}

// ========================
// AUTHENTICATION
// ========================
function handleLogin(ss, { pin }) {
  const employees = getSheetData(ss, "Employees");

  // Master admin login
  if (pin === ADMIN_PIN) {
    return {
      id: "ADMIN",
      name: "Administrator",
      role: "admin"
    };
  }

  const employee = employees.find(e => {
    const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, pin);
    const hashStr = Utilities.base64Encode(hash);
    return e.pin_hash === hashStr;
  });

  if (!employee) throw new Error("Invalid PIN");

  // Update last login
  const empSheet = ss.getSheetByName("Employees");
  const rowIndex = employees.findIndex(e => e.id === employee.id) + 2;
  empSheet.getRange(rowIndex, 5).setValue(new Date());

  return {
    id: employee.id,
    name: employee.name,
    role: employee.role
  };
}

// ========================
// ITEM MANAGEMENT
// ========================
function getItems(ss) {
  return getSheetData(ss, "Items");
}

function searchItems(ss, query) {
  const items = getSheetData(ss, "Items");
  const results = items.filter(item => 
    (item.name || "").toLowerCase().includes(query.toLowerCase()) ||
    (item.category || "").toLowerCase().includes(query.toLowerCase())
  );
  return results;
}

function addItem(ss, data) {
  const sheet = ss.getSheetByName("Items");
  const items = getSheetData(ss, "Items");
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Generate new ID
  const lastId = items.length > 0
    ? Math.max(...items.map(e => parseInt((e.id || "0").replace("ITM", ""))))
    : 0;
  const newId = `ITM${String(lastId + 1).padStart(5, '0')}`;
  const now = new Date();

  // Prepare row data in the correct order
  const row = headers.map(header => {
    const key = header.toLowerCase();
    if (key === 'id') return newId;
    if (key === 'created_at' || key === 'updated_at') return now;
    return data[key] || "";
  });
  sheet.appendRow(row);

  return {
    id: newId,
    ...data,
    created_at: now,
    updated_at: now
  };
}

function updateItem(ss, itemData) {
  const itemsSheet = ss.getSheetByName("Items");
  const items = getSheetData(ss, "Items");
  const headers = itemsSheet.getRange(1, 1, 1, itemsSheet.getLastColumn()).getValues()[0];

  const itemIndex = items.findIndex(i => i.id === itemData.id);
  if (itemIndex === -1) throw new Error("Item not found");

  const row = itemIndex + 2; // +2 because header row is 1 and array index starts at 0

  // Update item properties dynamically
  Object.keys(itemData).forEach(key => {
    const colIndex = headers.findIndex(h => h.toLowerCase() === key.toLowerCase());
    if (colIndex !== -1 && key !== "id") {
      itemsSheet.getRange(row, colIndex + 1).setValue(itemData[key]);
    }
  });

  // Update updated_at timestamp
  const updatedAtCol = headers.findIndex(h => h.toLowerCase() === "updated_at");
  if (updatedAtCol !== -1) {
    itemsSheet.getRange(row, updatedAtCol + 1).setValue(new Date());
  }

  return { ...itemData, updated_at: new Date() };
}

function deleteItem(ss, { id }) {
  const itemsSheet = ss.getSheetByName("Items");
  const items = getSheetData(ss, "Items");
  const itemIndex = items.findIndex(i => i.id === id);
  if (itemIndex === -1) throw new Error("Item not found");

  itemsSheet.deleteRow(itemIndex + 2);
  return { id };
}

function deductItem(ss, { employeeId, employeeName, itemId, qty }) {
  const itemsSheet = ss.getSheetByName("Items");
  const items = getSheetData(ss, "Items");
  const headers = itemsSheet.getRange(1, 1, 1, itemsSheet.getLastColumn()).getValues()[0];

  const item = items.find(i => i.id === itemId);
  if (!item) throw new Error("Item not found");
  if (Number(item.stock) < qty) throw new Error("Insufficient stock");

  const rowIndex = items.findIndex(i => i.id === itemId) + 2;
  const stockCol = headers.findIndex(h => h.toLowerCase() === "stock") + 1;
  const updatedAtCol = headers.findIndex(h => h.toLowerCase() === "updated_at") + 1;

  itemsSheet.getRange(rowIndex, stockCol).setValue(Number(item.stock) - qty);
  if (updatedAtCol) itemsSheet.getRange(rowIndex, updatedAtCol).setValue(new Date());

  recordHistory(ss, {
    employeeId,
    employeeName,
    itemId,
    itemName: item.name,
    qty,
    action: "deduct"
  });

  return { newStock: Number(item.stock) - qty };
}

function restockItem(ss, { employeeId, employeeName, itemId, qty }) {
  const itemsSheet = ss.getSheetByName("Items");
  const items = getSheetData(ss, "Items");
  const headers = itemsSheet.getRange(1, 1, 1, itemsSheet.getLastColumn()).getValues()[0];

  const item = items.find(i => i.id === itemId);
  if (!item) throw new Error("Item not found");

  const rowIndex = items.findIndex(i => i.id === itemId) + 2;
  const stockCol = headers.findIndex(h => h.toLowerCase() === "stock") + 1;
  const updatedAtCol = headers.findIndex(h => h.toLowerCase() === "updated_at") + 1;

  itemsSheet.getRange(rowIndex, stockCol).setValue(Number(item.stock) + qty);
  if (updatedAtCol) itemsSheet.getRange(rowIndex, updatedAtCol).setValue(new Date());

  recordHistory(ss, {
    employeeId,
    employeeName,
    itemId,
    itemName: item.name,
    qty,
    action: "restock"
  });

  return { newStock: Number(item.stock) + qty };
}

// ========================
// HISTORY MANAGEMENT
// ========================
function getHistory(ss, { employeeId, limit = 50, startDate, endDate }) {
  const history = getSheetData(ss, "History");

  // Apply filters
  let filtered = history;

  if (employeeId) {
    filtered = filtered.filter(h => h.employee_id === employeeId);
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filtered = filtered.filter(h => {
      const recordDate = new Date(h.timestamp);
      return recordDate >= start && recordDate <= end;
    });
  }

  return filtered.slice(0, limit);
}

function recordHistory(ss, { employeeId, employeeName, itemId, itemName, qty, action }) {
  const historySheet = ss.getSheetByName("History");
  const historyId = Utilities.getUuid(); // Generate unique ID
  historySheet.appendRow([
    historyId,
    new Date(),
    employeeId,
    employeeName,
    itemId,
    itemName,
    qty,
    action
  ]);
  return historyId;
}

function updateHistory(ss, { id, qty, action }) {
  const historySheet = ss.getSheetByName("History");
  const history = getSheetData(ss, "History");

  const recordIndex = history.findIndex(h => h.id === id);
  if (recordIndex === -1) throw new Error("History record not found");

  const row = recordIndex + 2; // +2 for header row and 1-based index
  const headers = historySheet.getRange(1, 1, 1, historySheet.getLastColumn()).getValues()[0];

  if (qty !== undefined) {
    const qtyCol = headers.findIndex(h => h.toLowerCase() === "qty") + 1;
    if (qtyCol > 0) historySheet.getRange(row, qtyCol).setValue(qty);
  }

  if (action) {
    const actionCol = headers.findIndex(h => h.toLowerCase() === "action") + 1;
    if (actionCol > 0) historySheet.getRange(row, actionCol).setValue(action);
  }

  return { success: true, message: "History updated" };
}

function deleteHistory(ss, { id }) {
  const historySheet = ss.getSheetByName("History");
  const history = getSheetData(ss, "History");

  const recordIndex = history.findIndex(h => h.id === id);
  if (recordIndex === -1) throw new Error("History record not found");

  historySheet.deleteRow(recordIndex + 2); // +2 for header row and 1-based index

  return { success: true, message: "History record deleted" };
}

// ========================
// EMPLOYEE MANAGEMENT
// ========================
function getEmployees(ss) {
  const employees = getSheetData(ss, "Employees");
  return employees.map(e => ({
    id: e.id,
    name: e.name,
    role: e.role,
    last_login: e.last_login
  }));
}

function addEmployee(ss, { name, pin, role = "employee" }) {
  const sheet = ss.getSheetByName("Employees");
  const employees = getSheetData(ss, "Employees");
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Generate ID
  const lastId = employees.length > 0 
    ? Math.max(...employees.map(e => parseInt((e.id || "0").replace("EMP", "")))) 
    : 0;
  const newId = `EMP${String(lastId + 1).padStart(5, '0')}`;

  // Hash PIN
  const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, pin);
  const hashStr = Utilities.base64Encode(hash);

  // Prepare row data in the correct order
  const row = headers.map(header => {
    const key = header.toLowerCase();
    if (key === 'id') return newId;
    if (key === 'name') return name;
    if (key === 'pin_hash') return hashStr;
    if (key === 'role') return role;
    if (key === 'last_login') return "";
    return "";
  });

  sheet.appendRow(row);

  return { id: newId };
}

function updateEmployee(ss, employeeData) {
  const employeesSheet = ss.getSheetByName("Employees");
  const employees = getSheetData(ss, "Employees");
  const headers = employeesSheet.getRange(1, 1, 1, employeesSheet.getLastColumn()).getValues()[0];

  const empIndex = employees.findIndex(e => e.id === employeeData.id);
  if (empIndex === -1) throw new Error("Employee not found");

  const row = empIndex + 2; // +2 because header row is 1 and array index starts at 0

  // Update employee properties dynamically
  Object.keys(employeeData).forEach(key => {
    if (key === "pin" && employeeData.pin) {
      const pinColIndex = headers.findIndex(h => h.toLowerCase() === "pin_hash");
      if (pinColIndex !== -1) {
        const hash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, employeeData.pin);
        const hashStr = Utilities.base64Encode(hash);
        employeesSheet.getRange(row, pinColIndex + 1).setValue(hashStr);
      }
    } else {
      const colIndex = headers.findIndex(h => h.toLowerCase() === key.toLowerCase());
      if (colIndex !== -1 && key !== "id") {
        employeesSheet.getRange(row, colIndex + 1).setValue(employeeData[key]);
      }
    }
  });

  return { ...employeeData };
}

function deleteEmployee(ss, { id }) {
  const employeesSheet = ss.getSheetByName("Employees");
  const employees = getSheetData(ss, "Employees");
  const empIndex = employees.findIndex(e => e.id === id);
  if (empIndex === -1) throw new Error("Employee not found");

  employeesSheet.deleteRow(empIndex + 2);
  return { id };
}

// ========================
// HELPER FUNCTIONS
// ========================
function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  const [headers, ...data] = sheet.getDataRange().getValues();

  return data.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      // Convert to lowercase and replace spaces with underscores
      const key = header.toLowerCase().replace(/\s+/g, '_');
      obj[key] = row[index];
    });
    return obj;
  });
}