const SHEET_NAME = "Daily Submissions";
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

  sheet.appendRow([
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
  ]);

  return json_({ ok: true });
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
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  return sheet;
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
