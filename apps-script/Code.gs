const SHEET_NAME = "Daily Submissions";
const SPREADSHEET_ID_PROPERTY = "DASHBOARD_SPREADSHEET_ID";
const HEADERS = [
  "submittedAt",
  "date",
  "department",
  "name",
  "sales",
  "revenue",
  "leads",
  "referrals",
  "renewals",
  "callsReceived",
  "callsAnswered",
  "missedCalls",
  "canceledCalls",
  "deletedCalls",
  "answers",
  "general",
  "taxReturnFees",
];

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  const sheet = getSheet_();
  const values = payload.values || {};
  const rowValues = [
    payload.submittedAt || new Date().toISOString(),
    payload.date || "",
    payload.department || "",
    payload.name || "",
    number_(values.sales),
    number_(values.revenue),
    number_(values.leads),
    number_(values.referrals),
    number_(values.renewals),
    number_(values.callsReceived || values.incoming),
    number_(values.callsAnswered || values.answered),
    number_(values.missedCalls),
    number_(values.canceledCalls || values.cancellations),
    number_(values.deletedCalls),
    number_(values.answers || values.serviceSales),
    number_(values.general),
    number_(values.taxReturnFees),
  ];
  const existingRow = findExistingRow_(sheet, payload.date || "", payload.department || "", payload.name || "");

  if (existingRow) {
    sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
    return json_({ ok: true, mode: "updated" });
  }

  sheet.appendRow(rowValues);
  return json_({ ok: true, mode: "created" });
}

function doGet(e) {
  const callback = e.parameter.callback || "";
  const date = e.parameter.date || "";
  const rows = getRows_(date);
  const payload = { ok: true, submissions: rows };

  if (callback) {
    return ContentService.createTextOutput(`${callback}(${JSON.stringify(payload)});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return json_(payload);
}

function getSheet_() {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
}

function getSpreadsheet_() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty(SPREADSHEET_ID_PROPERTY);

  if (existingId) {
    return SpreadsheetApp.openById(existingId);
  }

  const spreadsheet = SpreadsheetApp.create("Tax Return Daily Dashboard Submissions");
  properties.setProperty(SPREADSHEET_ID_PROPERTY, spreadsheet.getId());
  return spreadsheet;
}

function getRows_(date) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();

  return values
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])))
    .filter((row) => !date || String(row.date) === String(date))
    .map(rowToSubmission_);
}

function findExistingRow_(sheet, date, department, name) {
  if (!date || !department || !name) return 0;

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return 0;

  const headers = values[0];
  const dateIndex = headers.indexOf("date");
  const departmentIndex = headers.indexOf("department");
  const nameIndex = headers.indexOf("name");

  for (let index = values.length - 1; index >= 1; index--) {
    const row = values[index];
    if (
      String(row[dateIndex]) === String(date) &&
      String(row[departmentIndex]) === String(department) &&
      String(row[nameIndex]).trim().toLowerCase() === String(name).trim().toLowerCase()
    ) {
      return index + 1;
    }
  }

  return 0;
}

function rowToSubmission_(row) {
  return {
    version: 1,
    submittedAt: row.submittedAt,
    date: row.date,
    department: row.department,
    name: row.name,
    values: {
      sales: number_(row.sales),
      revenue: number_(row.revenue),
      leads: number_(row.leads),
      referrals: number_(row.referrals),
      renewals: number_(row.renewals),
      callsReceived: number_(row.callsReceived || row.incoming),
      callsAnswered: number_(row.callsAnswered || row.answered),
      missedCalls: number_(row.missedCalls),
      canceledCalls: number_(row.canceledCalls || row.cancellations),
      deletedCalls: number_(row.deletedCalls),
      answers: number_(row.answers || row.serviceSales),
      general: number_(row.general),
      taxReturnFees: number_(row.taxReturnFees),
    },
  };
}

function number_(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
