const SHEET_NAME = "Daily Submissions";
const SETTINGS_SHEET_NAME = "Dashboard Settings";
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
  "abandonCalls",
  "newChat",
  "chatClosed",
  "newTaxReturns",
  "insuranceReferrals",
  "friendReferrals",
  "newCandidates",
  "firstInterview",
  "secondInterview",
  "newHires",
  "initialContact",
  "followUps",
  "setUpMeetings",
  "signedCompanyContracts",
  "missionsOpened",
  "missionsClosed",
  "missionsOpenedFromChats",
  "missionsClosedFromChats",
  "newHumanChats",
  "closedHumanChats",
  "newBotChats",
  "closedBotChats",
];
const DEFAULT_GOALS = {
  salesDepartmentOneName: "Sales Department 1",
  salesDepartmentTwoName: "Sales Department 2",
  newSalesRevenue: 30000,
  newSales2Revenue: 30000,
  renewalRevenue: 14000,
  serviceAnswerRate: 85,
  collectionTotal: 65000,
  newTaxReturns: 20,
  hrNewHires: 1,
  businessSignedContracts: 1,
};

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");

  if (payload.action === "saveGoals") {
    saveGoals_(payload.goals || {});
    return json_({ ok: true, mode: "goalsSaved", goals: getGoals_() });
  }

  if (payload.action === "deleteDepartment") {
    const deleted = deleteDepartmentRows_(payload.date, payload.department);
    return json_({ ok: true, mode: "deleted", deleted: deleted });
  }

  const sheet = getSheet_();
  const values = payload.values || {};
  const date = dateKey_(payload.date || new Date());
  const rowValues = [
    payload.submittedAt || new Date().toISOString(),
    date,
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
    number_(values.abandonCalls),
    number_(values.newChat),
    number_(values.chatClosed),
    number_(values.newTaxReturns),
    number_(values.insuranceReferrals || values.referrals),
    number_(values.friendReferrals),
    number_(values.newCandidates),
    number_(values.firstInterview),
    number_(values.secondInterview),
    number_(values.newHires),
    number_(values.initialContact),
    number_(values.followUps),
    number_(values.setUpMeetings),
    number_(values.signedCompanyContracts),
    number_(values.missionsOpened),
    number_(values.missionsClosed),
    number_(values.missionsOpenedFromChats),
    number_(values.missionsClosedFromChats),
    number_(values.newHumanChats || values.newChat),
    number_(values.closedHumanChats || values.chatClosed),
    number_(values.newBotChats),
    number_(values.closedBotChats),
  ];
  const existingRow = findExistingRow_(sheet, date, payload.department || "", payload.name || "");

  if (existingRow) {
    sheet.getRange(existingRow, 1, 1, rowValues.length).setValues([rowValues]);
    return json_({ ok: true, mode: "updated" });
  }

  sheet.appendRow(rowValues);
  return json_({ ok: true, mode: "created" });
}

function doGet(e) {
  const callback = e.parameter.callback || "";
  const action = e.parameter.action || "";
  const transport = e.parameter.transport || "";
  const requestId = e.parameter.requestId || "";
  let payload;

  if (action === "deleteDepartment") {
    const deleted = deleteDepartmentRows_(e.parameter.date, e.parameter.department);
    payload = { ok: true, mode: "deleted", deleted: deleted };
  } else {
    const date = e.parameter.date || "";
    const rows = getRows_(date);
    payload = { ok: true, submissions: rows, goals: getGoals_() };
  }

  if (transport === "iframe") {
    return iframe_(requestId, payload);
  }

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
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  sheet.getRange("B:B").setNumberFormat("@");

  return sheet;
}

function getSettingsSheet_() {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SETTINGS_SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SETTINGS_SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["key", "value"]);
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
  const requestedDate = date ? dateKey_(date) : "";

  return values
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index]])))
    .filter((row) => !requestedDate || dateKey_(row.date) === requestedDate)
    .map(rowToSubmission_);
}

function getGoals_() {
  const sheet = getSettingsSheet_();
  const values = sheet.getDataRange().getValues();
  const goals = Object.assign({}, DEFAULT_GOALS);

  for (let index = 1; index < values.length; index++) {
    const key = String(values[index][0] || "");
    if (!key) continue;
    goals[key] = stringGoalKey_(key) ? String(values[index][1] || DEFAULT_GOALS[key]) : number_(values[index][1]);
  }

  return goals;
}

function saveGoals_(goals) {
  const sheet = getSettingsSheet_();
  const nextGoals = {
    salesDepartmentOneName: string_(goals.salesDepartmentOneName) || DEFAULT_GOALS.salesDepartmentOneName,
    salesDepartmentTwoName: string_(goals.salesDepartmentTwoName) || DEFAULT_GOALS.salesDepartmentTwoName,
    newSalesRevenue: number_(goals.newSalesRevenue) || DEFAULT_GOALS.newSalesRevenue,
    newSales2Revenue: number_(goals.newSales2Revenue) || DEFAULT_GOALS.newSales2Revenue,
    renewalRevenue: number_(goals.renewalRevenue) || DEFAULT_GOALS.renewalRevenue,
    serviceAnswerRate: number_(goals.serviceAnswerRate) || DEFAULT_GOALS.serviceAnswerRate,
    collectionTotal: number_(goals.collectionTotal) || DEFAULT_GOALS.collectionTotal,
    newTaxReturns: number_(goals.newTaxReturns) || DEFAULT_GOALS.newTaxReturns,
    hrNewHires: number_(goals.hrNewHires) || DEFAULT_GOALS.hrNewHires,
    businessSignedContracts: number_(goals.businessSignedContracts) || DEFAULT_GOALS.businessSignedContracts,
  };

  sheet.clearContents();
  sheet.appendRow(["key", "value"]);
  Object.keys(nextGoals).forEach(function(key) {
    sheet.appendRow([key, nextGoals[key]]);
  });
}

function deleteDepartmentRows_(date, department) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return 0;

  const requestedDate = dateKey_(date);
  const requestedDepartment = String(department || "");
  const headers = values[0];
  const dateIndex = headers.indexOf("date");
  const departmentIndex = headers.indexOf("department");
  let deleted = 0;

  for (let index = values.length - 1; index >= 1; index--) {
    const row = values[index];
    if (
      dateKey_(row[dateIndex]) === requestedDate &&
      String(row[departmentIndex]) === requestedDepartment
    ) {
      sheet.deleteRow(index + 1);
      deleted++;
    }
  }

  return deleted;
}

function findExistingRow_(sheet, date, department) {
  if (!date || !department) return 0;

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return 0;

  const headers = values[0];
  const dateIndex = headers.indexOf("date");
  const departmentIndex = headers.indexOf("department");

  for (let index = values.length - 1; index >= 1; index--) {
    const row = values[index];
    if (
      dateKey_(row[dateIndex]) === dateKey_(date) &&
      String(row[departmentIndex]) === String(department)
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
    date: dateKey_(row.date),
    department: row.department,
    name: row.name,
    values: {
      sales: number_(row.sales),
      revenue: number_(row.revenue),
      leads: number_(row.leads),
      referrals: number_(row.referrals),
      insuranceReferrals: number_(row.insuranceReferrals || row.referrals),
      friendReferrals: number_(row.friendReferrals),
      newCandidates: number_(row.newCandidates),
      firstInterview: number_(row.firstInterview),
      secondInterview: number_(row.secondInterview),
      newHires: number_(row.newHires),
      initialContact: number_(row.initialContact),
      followUps: number_(row.followUps),
      setUpMeetings: number_(row.setUpMeetings),
      signedCompanyContracts: number_(row.signedCompanyContracts),
      missionsOpened: number_(row.missionsOpened),
      missionsClosed: number_(row.missionsClosed),
      missionsOpenedFromChats: number_(row.missionsOpenedFromChats),
      missionsClosedFromChats: number_(row.missionsClosedFromChats),
      newHumanChats: number_(row.newHumanChats || row.newChat),
      closedHumanChats: number_(row.closedHumanChats || row.chatClosed),
      newBotChats: number_(row.newBotChats),
      closedBotChats: number_(row.closedBotChats),
      renewals: number_(row.renewals),
      callsReceived: number_(row.callsReceived || row.incoming),
      callsAnswered: number_(row.callsAnswered || row.answered),
      missedCalls: number_(row.missedCalls),
      canceledCalls: number_(row.canceledCalls || row.cancellations),
      deletedCalls: number_(row.deletedCalls),
      answers: number_(row.answers || row.serviceSales),
      general: number_(row.general),
      taxReturnFees: number_(row.taxReturnFees),
      abandonCalls: number_(row.abandonCalls),
      newChat: number_(row.newChat),
      chatClosed: number_(row.chatClosed),
      newTaxReturns: number_(row.newTaxReturns),
    },
  };
}

function number_(value) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function string_(value) {
  return String(value || "").trim().slice(0, 40);
}

function stringGoalKey_(key) {
  return key === "salesDepartmentOneName" || key === "salesDepartmentTwoName";
}

function dateKey_(value) {
  if (!value) return "";

  if (Object.prototype.toString.call(value) === "[object Date]" && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, "Asia/Jerusalem", "yyyy-MM-dd");
  }

  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const parsed = new Date(text);
  if (!isNaN(parsed.getTime())) {
    return Utilities.formatDate(parsed, "Asia/Jerusalem", "yyyy-MM-dd");
  }

  return text;
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function iframe_(requestId, payload) {
  const message = {
    source: "dailyDashboardBackend",
    requestId: requestId,
    payload: payload,
  };
  const html = [
    "<!doctype html><html><body>",
    "<script>",
    "window.parent.postMessage(",
    JSON.stringify(message).replace(/</g, "\\u003c"),
    ", '*');",
    "</script>",
    "</body></html>",
  ].join("");

  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
