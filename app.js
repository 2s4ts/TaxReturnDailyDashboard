const emptyData = {
  newSales: [],
  renewals: [],
  service: [],
  collection: [],
};

let dashboardData = structuredClone(emptyData);
let backendWarningShown = false;

const targets = {
  newSalesRevenue: 30000,
  renewalRevenue: 14000,
  serviceAnswerRate: 85,
  collectionTotal: 65000,
};

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
  renewalsStatus: document.querySelector("#renewalsStatus"),
  serviceStatus: document.querySelector("#serviceStatus"),
  collectionStatus: document.querySelector("#collectionStatus"),
  newSalesCount: document.querySelector("#newSalesCount"),
  newSalesRevenue: document.querySelector("#newSalesRevenue"),
  newSalesLeads: document.querySelector("#newSalesLeads"),
  newSalesReferrals: document.querySelector("#newSalesReferrals"),
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
  newSalesRows: document.querySelector("#newSalesRows"),
  renewalRows: document.querySelector("#renewalRows"),
  serviceRows: document.querySelector("#serviceRows"),
  collectionRows: document.querySelector("#collectionRows"),
  newSalesTable: document.querySelector("#newSalesTable"),
  renewalTable: document.querySelector("#renewalTable"),
  serviceTable: document.querySelector("#serviceTable"),
  collectionTable: document.querySelector("#collectionTable"),
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

function backendUrl() {
  return String(window.DASHBOARD_BACKEND_URL || "").trim();
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
    totalRevenue: newSalesRevenue + renewalRevenue + collectionTotal,
    totalSales: newSalesCount + renewalSalesCount,
    totalLeads: newSalesLeads + renewalLeads,
    totalReferrals: newSalesReferrals + renewalReferrals + collectionReferrals,
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
    Math.min(metrics.renewalRevenue / targets.renewalRevenue, 1.25),
    Math.min(metrics.serviceAnswerRate / targets.serviceAnswerRate, 1.25),
    Math.min(metrics.collectionTotal / targets.collectionTotal, 1.25),
  ];
  return ratios.reduce((total, ratio) => total + ratio, 0) / ratios.length;
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

function renderTable(tbody, rows, labels, rowBuilder) {
  tbody.innerHTML = "";

  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="${labels.length}">No submissions saved for this department on this date.</td></tr>`;
    return;
  }

  for (const row of rows) {
    const tr = document.createElement("tr");
    const cells = rowBuilder(row);
    tr.innerHTML = cells.map((cell, index) => `<td data-label="${labels[index]}">${cell}</td>`).join("");
    tbody.append(tr);
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
  setStatus(elements.renewalsStatus, metrics.renewalRevenue, targets.renewalRevenue);
  setStatus(elements.serviceStatus, metrics.serviceAnswerRate, targets.serviceAnswerRate, "percent");
  setStatus(elements.collectionStatus, metrics.collectionTotal, targets.collectionTotal);

  elements.revenueTotalLabel.textContent = money(metrics.totalRevenue);
  renderBars([
    { label: "New Sales", value: metrics.newSalesRevenue, meta: `${metrics.newSalesCount} sales` },
    { label: "Renewal Sales", value: metrics.renewalRevenue, meta: `${metrics.renewalSalesCount} renewals` },
    { label: "Collection - General", value: metrics.collectionGeneral, meta: "General collection" },
    { label: "Collection - Tax-return fees", value: metrics.collectionTaxReturn, meta: "Successful returns" },
  ]);

  const answerRate = Math.min(metrics.serviceAnswerRate, 100);
  elements.answerRateLabel.textContent = `${metrics.serviceAnswered} of ${metrics.serviceIncoming}`;
  elements.answerRateGauge.style.width = `${answerRate}%`;
  elements.answerRateGaugeText.textContent = percent(answerRate);
  renderRiskList(metrics);

  const newSalesRows = [...dashboardData.newSales].sort((a, b) => b.revenue - a.revenue);
  const renewalRows = [...dashboardData.renewals].sort((a, b) => b.revenue - a.revenue);
  const serviceRows = [...dashboardData.service].sort((a, b) => value(b, "callsAnswered", "answered") - value(a, "callsAnswered", "answered"));
  const collectionRows = [...dashboardData.collection].sort((a, b) => b.general + b.taxReturnFees - (a.general + a.taxReturnFees));

  elements.newSalesRows.textContent = `${newSalesRows.length} people`;
  elements.renewalRows.textContent = `${renewalRows.length} people`;
  elements.serviceRows.textContent = `${serviceRows.length} people`;
  elements.collectionRows.textContent = `${collectionRows.length} people`;

  renderTable(elements.newSalesTable, newSalesRows, ["Salesperson", "Sales", "Revenue", "Leads", "Referrals"], (row) => [
    row.name,
    row.sales,
    money(row.revenue),
    row.leads,
    row.referrals,
  ]);

  renderTable(elements.renewalTable, renewalRows, ["Salesperson", "Renewals", "Revenue", "Leads", "Referrals"], (row) => [
    row.name,
    row.renewals,
    money(row.revenue),
    row.leads,
    row.referrals,
  ]);

  renderTable(elements.serviceTable, serviceRows, ["Representative", "Received", "Answered", "Missed", "Answer rate", "Canceled", "Deleted", "Answers"], (row) => [
    row.name,
    value(row, "callsReceived", "incoming"),
    value(row, "callsAnswered", "answered"),
    value(row, "missedCalls") || Math.max(value(row, "callsReceived", "incoming") - value(row, "callsAnswered", "answered"), 0),
    percent(value(row, "callsReceived", "incoming") ? (value(row, "callsAnswered", "answered") / value(row, "callsReceived", "incoming")) * 100 : 0),
    value(row, "canceledCalls", "cancellations"),
    value(row, "deletedCalls"),
    value(row, "answers", "serviceSales"),
  ]);

  renderTable(elements.collectionTable, collectionRows, ["Collector", "General", "Tax-return fees", "Total", "Referrals"], (row) => [
    row.name,
    money(row.general),
    money(row.taxReturnFees),
    money(row.general + row.taxReturnFees),
    row.referrals,
  ]);
}

function normalizeSubmission(submission) {
  if (!submission || typeof submission !== "object") return null;
  const values = submission.values || {};
  const name = submission.name || "Submitted total";

  if (submission.department === "newSales") {
    return { department: "newSales", row: { name, sales: Number(values.sales) || 0, revenue: Number(values.revenue) || 0, leads: Number(values.leads) || 0, referrals: Number(values.referrals) || 0 } };
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

function normalizeSubmissionList(submissions) {
  const nextData = structuredClone(emptyData);
  for (const submission of submissions || []) {
    const normalized = normalizeSubmission(submission);
    if (!normalized) continue;
    nextData[normalized.department].push(normalized.row);
  }
  return nextData;
}

function loadJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `dailyDashboardCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
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

    script.src = `${url}${separator}date=${encodeURIComponent(elements.dashboardDate.value || localDateKey())}&callback=${encodeURIComponent(callbackName)}`;
    document.body.append(script);
  });
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

    dashboardData = normalizeSubmissionList(payload.submissions || []);
    elements.dashboardDate.value = payload.date || date;
    renderDashboard();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Could not load dashboard data.");
  } finally {
    elements.refreshData.disabled = false;
    elements.refreshData.textContent = "Refresh";
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
  elements.dashboardDate.value = await currentServerDate();
  elements.exportHtml.addEventListener("click", exportHtml);
  elements.refreshData.addEventListener("click", loadDashboardData);
  elements.dashboardDate.addEventListener("change", loadDashboardData);
  await loadDashboardData();
  setInterval(loadDashboardData, 60000);
}

init();
