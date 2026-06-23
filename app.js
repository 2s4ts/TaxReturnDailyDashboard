const emptyData = {
  newSales: [],
  newSales2: [],
  renewals: [],
  service: [],
  collection: [],
};

let dashboardData = structuredClone(emptyData);
let backendWarningShown = false;

const defaultTargets = {
  salesDepartmentOneName: "Sales Department 1",
  salesDepartmentTwoName: "Sales Department 2",
  newSalesRevenue: 30000,
  newSales2Revenue: 30000,
  renewalRevenue: 14000,
  serviceAnswerRate: 85,
  collectionTotal: 65000,
};

let targets = { ...defaultTargets };

const elements = {
  dashboardDate: document.querySelector("#dashboardDate"),
  refreshData: document.querySelector("#refreshData"),
  exportHtml: document.querySelector("#exportHtml"),
  dailyMark: document.querySelector("#dailyMark"),
  dailyMarkLabel: document.querySelector("#dailyMarkLabel"),
  totalRevenue: document.querySelector("#totalRevenue"),
  totalSales: document.querySelector("#totalSales"),
  totalLeads: document.querySelector("#totalLeads"),
  totalReferrals: document.querySelector("#totalReferrals"),
  totalCancellations: document.querySelector("#totalCancellations"),
  newSalesStatus: document.querySelector("#newSalesStatus"),
  newSales2Status: document.querySelector("#newSales2Status"),
  renewalsStatus: document.querySelector("#renewalsStatus"),
  serviceStatus: document.querySelector("#serviceStatus"),
  collectionStatus: document.querySelector("#collectionStatus"),
  newSalesCount: document.querySelector("#newSalesCount"),
  newSalesRevenue: document.querySelector("#newSalesRevenue"),
  newSalesLeads: document.querySelector("#newSalesLeads"),
  newSalesReferrals: document.querySelector("#newSalesReferrals"),
  newSales2Title: document.querySelector("#newSales2Title"),
  newSalesTitle: document.querySelector("#newSalesTitle"),
  newSalesFormLink: document.querySelector("#newSalesFormLink"),
  newSales2FormLink: document.querySelector("#newSales2FormLink"),
  newSales2Count: document.querySelector("#newSales2Count"),
  newSales2Revenue: document.querySelector("#newSales2Revenue"),
  newSales2Leads: document.querySelector("#newSales2Leads"),
  newSales2Referrals: document.querySelector("#newSales2Referrals"),
  renewalSalesCount: document.querySelector("#renewalSalesCount"),
  renewalRevenue: document.querySelector("#renewalRevenue"),
  renewalLeads: document.querySelector("#renewalLeads"),
  renewalReferrals: document.querySelector("#renewalReferrals"),
  serviceIncoming: document.querySelector("#serviceIncoming"),
  serviceAnswered: document.querySelector("#serviceAnswered"),
  serviceMissed: document.querySelector("#serviceMissed"),
  serviceAnswerRate: document.querySelector("#serviceAnswerRate"),
  serviceCanceled: document.querySelector("#serviceCanceled"),
  serviceDeleted: document.querySelector("#serviceDeleted"),
  serviceAnswers: document.querySelector("#serviceAnswers"),
  collectionGeneral: document.querySelector("#collectionGeneral"),
  collectionTaxReturn: document.querySelector("#collectionTaxReturn"),
  collectionTotal: document.querySelector("#collectionTotal"),
  collectionReferrals: document.querySelector("#collectionReferrals"),
  revenueTotalLabel: document.querySelector("#revenueTotalLabel"),
  revenueBars: document.querySelector("#revenueBars"),
  answerRateLabel: document.querySelector("#answerRateLabel"),
  answerRateGauge: document.querySelector("#answerRateGauge"),
  answerRateGaugeText: document.querySelector("#answerRateGaugeText"),
  serviceRiskList: document.querySelector("#serviceRiskList"),
  goalStatus: document.querySelector("#goalStatus"),
  salesDepartmentOneName: document.querySelector("#salesDepartmentOneName"),
  salesDepartmentTwoName: document.querySelector("#salesDepartmentTwoName"),
  goalNewSalesRevenue: document.querySelector("#goalNewSalesRevenue"),
  goalNewSales2Revenue: document.querySelector("#goalNewSales2Revenue"),
  goalRenewalRevenue: document.querySelector("#goalRenewalRevenue"),
  goalServiceAnswerRate: document.querySelector("#goalServiceAnswerRate"),
  goalCollectionTotal: document.querySelector("#goalCollectionTotal"),
  saveGoals: document.querySelector("#saveGoals"),
  deleteStatus: document.querySelector("#deleteStatus"),
  deleteDepartment: document.querySelector("#deleteDepartment"),
  deleteDepartmentData: document.querySelector("#deleteDepartmentData"),
};

function sum(rows, key) {
  return rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);
}

function value(row, ...keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return Number(row[key]) || 0;
    }
  }
  return 0;
}

function sumAny(rows, ...keys) {
  return rows.reduce((total, row) => total + value(row, ...keys), 0);
}

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ILS",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(value).replace("ILS", "ILS ");
}

function percent(value) {
  return `${Math.round(value)}%`;
}

function localDateKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function dateKeyFromValue(value) {
  if (!value) return "";

  if (typeof value === "string") {
    const simpleDate = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (simpleDate) return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jerusalem",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function backendUrl() {
  return String(window.DASHBOARD_BACKEND_URL || "").trim();
}

function localGoalsKey() {
  return "dailyDashboardGoals";
}

function getLocalGoals() {
  try {
    return JSON.parse(localStorage.getItem(localGoalsKey()) || "{}");
  } catch {
    return {};
  }
}

function saveLocalGoals(goals) {
  localStorage.setItem(localGoalsKey(), JSON.stringify(goals));
}

function canUseLocalApi() {
  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

async function currentServerDate() {
  if (backendUrl() || !canUseLocalApi()) return localDateKey();

  try {
    const response = await fetch("/api/day", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load server day.");
    const payload = await response.json();
    return payload.date || localDateKey();
  } catch {
    return localDateKey();
  }
}

function getMetrics(data) {
  const newSalesCount = sum(data.newSales, "sales");
  const newSalesRevenue = sum(data.newSales, "revenue");
  const newSalesLeads = sum(data.newSales, "leads");
  const newSalesReferrals = sum(data.newSales, "referrals");
  const newSales2Count = sum(data.newSales2, "sales");
  const newSales2Revenue = sum(data.newSales2, "revenue");
  const newSales2Leads = sum(data.newSales2, "leads");
  const newSales2Referrals = sum(data.newSales2, "referrals");
  const renewalSalesCount = sum(data.renewals, "renewals");
  const renewalRevenue = sum(data.renewals, "revenue");
  const renewalLeads = sum(data.renewals, "leads");
  const renewalReferrals = sum(data.renewals, "referrals");
  const serviceIncoming = sumAny(data.service, "callsReceived", "incoming");
  const serviceAnswered = sumAny(data.service, "callsAnswered", "answered");
  const enteredMissedCalls = sumAny(data.service, "missedCalls");
  const serviceMissed = enteredMissedCalls || Math.max(serviceIncoming - serviceAnswered, 0);
  const serviceCancellations = sumAny(data.service, "canceledCalls", "cancellations");
  const serviceDeleted = sumAny(data.service, "deletedCalls");
  const serviceAnswers = sumAny(data.service, "answers", "serviceSales");
  const serviceAnswerRate = serviceIncoming ? (serviceAnswered / serviceIncoming) * 100 : 0;
  const collectionGeneral = sum(data.collection, "general");
  const collectionTaxReturn = sum(data.collection, "taxReturnFees");
  const collectionReferrals = sum(data.collection, "referrals");
  const collectionTotal = collectionGeneral + collectionTaxReturn;

  return {
    newSalesCount,
    newSalesRevenue,
    newSalesLeads,
    newSalesReferrals,
    newSales2Count,
    newSales2Revenue,
    newSales2Leads,
    newSales2Referrals,
    renewalSalesCount,
    renewalRevenue,
    renewalLeads,
    renewalReferrals,
    serviceIncoming,
    serviceAnswered,
    serviceMissed,
    serviceCancellations,
    serviceDeleted,
    serviceAnswers,
    serviceAnswerRate,
    collectionGeneral,
    collectionTaxReturn,
    collectionReferrals,
    collectionTotal,
    totalRevenue: newSalesRevenue + newSales2Revenue + renewalRevenue + collectionTotal,
    totalSales: newSalesCount + newSales2Count + renewalSalesCount,
    totalLeads: newSalesLeads + newSales2Leads + renewalLeads,
    totalReferrals: newSalesReferrals + newSales2Referrals + renewalReferrals + collectionReferrals,
  };
}

function markerForRatio(ratio) {
  if (ratio >= 1) return { key: "great", label: "Really good" };
  if (ratio >= 0.75) return { key: "good", label: "Okay okay" };
  if (ratio >= 0.5) return { key: "okay", label: "Okay" };
  return { key: "bad", label: "Bad" };
}

function setMarker(element, ratio, detail) {
  const marker = markerForRatio(ratio);
  element.textContent = marker.label;
  element.className = `marker marker-${marker.key}`;
  element.title = detail;
}

function setStatus(element, value, target, unit = "money") {
  const ratio = target ? value / target : 0;
  const detail = unit === "percent" ? `${percent(value)} / ${percent(target)}` : `${money(value)} / ${money(target)}`;
  setMarker(element, ratio, detail);
}

function weightedDailyRatio(metrics) {
  const ratios = [
    Math.min(metrics.newSalesRevenue / targets.newSalesRevenue, 1.25),
    Math.min(metrics.newSales2Revenue / targets.newSales2Revenue, 1.25),
    Math.min(metrics.renewalRevenue / targets.renewalRevenue, 1.25),
    Math.min(metrics.serviceAnswerRate / targets.serviceAnswerRate, 1.25),
    Math.min(metrics.collectionTotal / targets.collectionTotal, 1.25),
  ];
  return ratios.reduce((total, ratio) => total + ratio, 0) / ratios.length;
}

function normalizeGoals(goals = {}) {
  return {
    salesDepartmentOneName: String(goals.salesDepartmentOneName || defaultTargets.salesDepartmentOneName).trim() || defaultTargets.salesDepartmentOneName,
    salesDepartmentTwoName: String(goals.salesDepartmentTwoName || defaultTargets.salesDepartmentTwoName).trim() || defaultTargets.salesDepartmentTwoName,
    newSalesRevenue: Number(goals.newSalesRevenue) || defaultTargets.newSalesRevenue,
    newSales2Revenue: Number(goals.newSales2Revenue) || defaultTargets.newSales2Revenue,
    renewalRevenue: Number(goals.renewalRevenue) || defaultTargets.renewalRevenue,
    serviceAnswerRate: Number(goals.serviceAnswerRate) || defaultTargets.serviceAnswerRate,
    collectionTotal: Number(goals.collectionTotal) || defaultTargets.collectionTotal,
  };
}

function readGoalsFromInputs() {
  return normalizeGoals({
    salesDepartmentOneName: elements.salesDepartmentOneName.value,
    salesDepartmentTwoName: elements.salesDepartmentTwoName.value,
    newSalesRevenue: elements.goalNewSalesRevenue.value,
    newSales2Revenue: elements.goalNewSales2Revenue.value,
    renewalRevenue: elements.goalRenewalRevenue.value,
    serviceAnswerRate: elements.goalServiceAnswerRate.value,
    collectionTotal: elements.goalCollectionTotal.value,
  });
}

function renderGoalInputs() {
  elements.salesDepartmentOneName.value = targets.salesDepartmentOneName;
  elements.salesDepartmentTwoName.value = targets.salesDepartmentTwoName;
  elements.goalNewSalesRevenue.value = targets.newSalesRevenue;
  elements.goalNewSales2Revenue.value = targets.newSales2Revenue;
  elements.goalRenewalRevenue.value = targets.renewalRevenue;
  elements.goalServiceAnswerRate.value = targets.serviceAnswerRate;
  elements.goalCollectionTotal.value = targets.collectionTotal;
}

function renderSalesLabels() {
  elements.newSalesTitle.textContent = targets.salesDepartmentOneName;
  elements.newSales2Title.textContent = targets.salesDepartmentTwoName;
  elements.newSalesFormLink.textContent = `${targets.salesDepartmentOneName} form`;
  elements.newSales2FormLink.textContent = `${targets.salesDepartmentTwoName} form`;

  const options = Array.from(elements.deleteDepartment.options);
  const salesOne = options.find((option) => option.value === "newSales");
  const salesTwo = options.find((option) => option.value === "newSales2");
  if (salesOne) salesOne.textContent = targets.salesDepartmentOneName;
  if (salesTwo) salesTwo.textContent = targets.salesDepartmentTwoName;
}

function renderDailyMark(metrics) {
  const ratio = weightedDailyRatio(metrics);
  const marker = markerForRatio(ratio);
  elements.dailyMark.textContent = percent(ratio * 100);
  elements.dailyMarkLabel.textContent = marker.label;
  elements.dailyMark.closest(".metric-card").className = `metric-card daily-mark-card marker-card-${marker.key}`;
}

function renderBars(rows) {
  const largest = Math.max(...rows.map((row) => row.value), 1);
  elements.revenueBars.innerHTML = "";

  for (const row of rows) {
    const wrapper = document.createElement("div");
    wrapper.className = "bar-row";
    wrapper.innerHTML = `
      <div class="bar-label">
        <strong>${row.label}</strong>
        <span class="bar-meta">${row.meta}</span>
      </div>
      <div class="bar-track"><div style="width: ${Math.max((row.value / largest) * 100, 3)}%"></div></div>
      <div class="bar-value">${money(row.value)}</div>
    `;
    elements.revenueBars.append(wrapper);
  }
}

function renderRiskList(metrics) {
  const risks = [
    ["Missed calls", `${metrics.serviceMissed} today`],
    ["Canceled calls", `${metrics.serviceCancellations} today`],
    ["Deleted calls", `${metrics.serviceDeleted} today`],
    ["Answers / responses", `${metrics.serviceAnswers} sent`],
  ];

  elements.serviceRiskList.innerHTML = "";
  for (const [label, value] of risks) {
    const item = document.createElement("div");
    item.className = "risk-item";
    item.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
    elements.serviceRiskList.append(item);
  }
}

function renderDashboard() {
  const metrics = getMetrics(dashboardData);

  renderDailyMark(metrics);
  elements.totalRevenue.textContent = money(metrics.totalRevenue);
  elements.totalSales.textContent = String(metrics.totalSales);
  elements.totalLeads.textContent = String(metrics.totalLeads);
  elements.totalReferrals.textContent = String(metrics.totalReferrals);
  elements.totalCancellations.textContent = String(metrics.serviceCancellations);

  elements.newSalesCount.textContent = String(metrics.newSalesCount);
  elements.newSalesRevenue.textContent = money(metrics.newSalesRevenue);
  elements.newSalesLeads.textContent = String(metrics.newSalesLeads);
  elements.newSalesReferrals.textContent = String(metrics.newSalesReferrals);

  elements.newSales2Count.textContent = String(metrics.newSales2Count);
  elements.newSales2Revenue.textContent = money(metrics.newSales2Revenue);
  elements.newSales2Leads.textContent = String(metrics.newSales2Leads);
  elements.newSales2Referrals.textContent = String(metrics.newSales2Referrals);

  elements.renewalSalesCount.textContent = String(metrics.renewalSalesCount);
  elements.renewalRevenue.textContent = money(metrics.renewalRevenue);
  elements.renewalLeads.textContent = String(metrics.renewalLeads);
  elements.renewalReferrals.textContent = String(metrics.renewalReferrals);

  elements.serviceIncoming.textContent = String(metrics.serviceIncoming);
  elements.serviceAnswered.textContent = String(metrics.serviceAnswered);
  elements.serviceMissed.textContent = String(metrics.serviceMissed);
  elements.serviceAnswerRate.textContent = percent(metrics.serviceAnswerRate);
  elements.serviceCanceled.textContent = String(metrics.serviceCancellations);
  elements.serviceDeleted.textContent = String(metrics.serviceDeleted);
  elements.serviceAnswers.textContent = String(metrics.serviceAnswers);

  elements.collectionGeneral.textContent = money(metrics.collectionGeneral);
  elements.collectionTaxReturn.textContent = money(metrics.collectionTaxReturn);
  elements.collectionTotal.textContent = money(metrics.collectionTotal);
  elements.collectionReferrals.textContent = String(metrics.collectionReferrals);

  setStatus(elements.newSalesStatus, metrics.newSalesRevenue, targets.newSalesRevenue);
  setStatus(elements.newSales2Status, metrics.newSales2Revenue, targets.newSales2Revenue);
  setStatus(elements.renewalsStatus, metrics.renewalRevenue, targets.renewalRevenue);
  setStatus(elements.serviceStatus, metrics.serviceAnswerRate, targets.serviceAnswerRate, "percent");
  setStatus(elements.collectionStatus, metrics.collectionTotal, targets.collectionTotal);

  elements.revenueTotalLabel.textContent = money(metrics.totalRevenue);
  renderBars([
    { label: targets.salesDepartmentOneName, value: metrics.newSalesRevenue, meta: `${metrics.newSalesCount} sales` },
    { label: targets.salesDepartmentTwoName, value: metrics.newSales2Revenue, meta: `${metrics.newSales2Count} sales` },
    { label: "Renewal Sales", value: metrics.renewalRevenue, meta: `${metrics.renewalSalesCount} renewals` },
    { label: "Collection - General", value: metrics.collectionGeneral, meta: "General collection" },
    { label: "Collection - Tax-return fees", value: metrics.collectionTaxReturn, meta: "Successful returns" },
  ]);

  const answerRate = Math.min(metrics.serviceAnswerRate, 100);
  elements.answerRateLabel.textContent = `${metrics.serviceAnswered} of ${metrics.serviceIncoming}`;
  elements.answerRateGauge.style.width = `${answerRate}%`;
  elements.answerRateGaugeText.textContent = percent(answerRate);
  renderRiskList(metrics);
}

function normalizeSubmission(submission) {
  if (!submission || typeof submission !== "object") return null;
  const values = submission.values || {};
  const name = submission.name || "Submitted total";

  if (submission.department === "newSales" || submission.department === "newSales2") {
    return { department: submission.department, row: { name, sales: Number(values.sales) || 0, revenue: Number(values.revenue) || 0, leads: Number(values.leads) || 0, referrals: Number(values.referrals) || 0 } };
  }

  if (submission.department === "renewals") {
    return { department: "renewals", row: { name, renewals: Number(values.renewals) || 0, revenue: Number(values.revenue) || 0, leads: Number(values.leads) || 0, referrals: Number(values.referrals) || 0 } };
  }

  if (submission.department === "service") {
    const callsReceived = value(values, "callsReceived", "incoming");
    const callsAnswered = value(values, "callsAnswered", "answered");
    const missedCalls = value(values, "missedCalls") || Math.max(callsReceived - callsAnswered, 0);
    return {
      department: "service",
      row: {
        name,
        callsReceived,
        callsAnswered,
        missedCalls,
        canceledCalls: value(values, "canceledCalls", "cancellations"),
        deletedCalls: value(values, "deletedCalls"),
        answers: value(values, "answers", "serviceSales"),
      },
    };
  }

  if (submission.department === "collection") {
    return { department: "collection", row: { name, general: Number(values.general) || 0, taxReturnFees: Number(values.taxReturnFees) || 0, referrals: Number(values.referrals) || 0 } };
  }

  return null;
}

function normalizeSubmissionList(submissions, date) {
  const nextData = structuredClone(emptyData);
  for (const submission of submissions || []) {
    if (date && dateKeyFromValue(submission.date) !== date) continue;
    const normalized = normalizeSubmission(submission);
    if (!normalized) continue;
    nextData[normalized.department].push(normalized.row);
  }
  return nextData;
}

function loadJsonp(url, params = {}) {
  return new Promise((resolve, reject) => {
    const callbackName = `dailyDashboardCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const query = new URLSearchParams({
      ...params,
      _: String(Date.now()),
      callback: callbackName,
    });
    const separator = url.includes("?") ? "&" : "?";

    window[callbackName] = (payload) => {
      delete window[callbackName];
      script.remove();
      resolve(payload);
    };

    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error("Could not load hosted dashboard data."));
    };

    script.src = `${url}${separator}${query.toString()}`;
    document.body.append(script);
  });
}

async function postBackend(payload) {
  const endpoint = backendUrl();

  if (endpoint) {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { ok: true };
  }

  if (!canUseLocalApi()) {
    throw new Error("Online backend is not configured. Add the Apps Script web app URL in config.js.");
  }

  const response = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("The local dashboard server could not save this change.");
  return response.json();
}

async function loadDashboardData() {
  elements.refreshData.disabled = true;
  elements.refreshData.textContent = "Refreshing...";

  try {
    const date = elements.dashboardDate.value || await currentServerDate();
    let payload;

    if (backendUrl()) {
      payload = await loadJsonp(backendUrl());
    } else if (canUseLocalApi()) {
      const response = await fetch(`/api/submissions?date=${encodeURIComponent(date)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load dashboard data.");
      payload = await response.json();
    } else {
      if (!backendWarningShown) {
        backendWarningShown = true;
        window.alert("Online backend is not configured. Add the Apps Script web app URL in config.js.");
      }
      payload = { date, submissions: [] };
    }

    targets = normalizeGoals(payload.goals || getLocalGoals());
    renderGoalInputs();
    renderSalesLabels();
    dashboardData = normalizeSubmissionList(payload.submissions || [], date);
    elements.dashboardDate.value = dateKeyFromValue(payload.date) || date;
    renderDashboard();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Could not load dashboard data.");
  } finally {
    elements.refreshData.disabled = false;
    elements.refreshData.textContent = "Refresh";
  }
}

async function saveGoals() {
  const goals = readGoalsFromInputs();
  targets = goals;
  saveLocalGoals(goals);
  renderSalesLabels();
  elements.saveGoals.disabled = true;
  elements.goalStatus.textContent = "Saving...";

  try {
    await postBackend({ action: "saveGoals", goals });
    elements.goalStatus.textContent = "Goals saved";
    renderDashboard();
  } catch (error) {
    elements.goalStatus.textContent = "Could not save goals";
    window.alert(error instanceof Error ? error.message : "Could not save goals.");
  } finally {
    elements.saveGoals.disabled = false;
  }
}

async function deleteDepartmentData() {
  const department = elements.deleteDepartment.value;
  const date = elements.dashboardDate.value || localDateKey();
  const departmentName = elements.deleteDepartment.selectedOptions[0]?.textContent || department;
  const confirmed = window.confirm(`Delete ${departmentName} data for ${date}?`);
  if (!confirmed) return;

  elements.deleteDepartmentData.disabled = true;
  elements.deleteStatus.textContent = "Deleting...";

  try {
    let result = { deleted: 0 };

    if (backendUrl()) {
      result = await loadJsonp(backendUrl(), { action: "deleteDepartment", date, department });
      if (!result.ok || result.mode !== "deleted") {
        throw new Error("The hosted backend is not updated yet. Redeploy the Apps Script code, then try delete again.");
      }
    } else {
      result = await postBackend({ action: "deleteDepartment", date, department });
    }

    elements.deleteStatus.textContent = `Deleted ${Number(result.deleted) || 0} row(s). Refreshing...`;
    await loadDashboardData();
    elements.deleteStatus.textContent = `Deleted ${Number(result.deleted) || 0} row(s)`;
  } catch (error) {
    elements.deleteStatus.textContent = "Delete failed";
    window.alert(error instanceof Error ? error.message : "Could not delete department data.");
  } finally {
    elements.deleteDepartmentData.disabled = false;
  }
}

function exportHtml() {
  const clone = document.documentElement.cloneNode(true);
  clone.querySelectorAll("script").forEach((script) => script.remove());
  clone.querySelectorAll("input").forEach((input) => {
    if (input.type === "date") input.setAttribute("value", input.value);
  });
  clone.querySelector("#exportHtml")?.remove();
  clone.querySelector("#refreshData")?.remove();
  const html = `<!doctype html>\n${clone.outerHTML}`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `tax-return-daily-dashboard-${elements.dashboardDate.value || localDateKey()}.html`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function init() {
  targets = normalizeGoals(getLocalGoals());
  renderGoalInputs();
  renderSalesLabels();
  elements.dashboardDate.value = await currentServerDate();
  elements.exportHtml.addEventListener("click", exportHtml);
  elements.refreshData.addEventListener("click", loadDashboardData);
  elements.dashboardDate.addEventListener("change", loadDashboardData);
  elements.saveGoals.addEventListener("click", saveGoals);
  elements.deleteDepartmentData.addEventListener("click", deleteDepartmentData);
  await loadDashboardData();
  setInterval(loadDashboardData, 60000);
}

init();
