const emptyData = {
  newSales: [],
  renewals: [],
  service: [],
  collection: [],
};

const sampleData = {
  newSales: [
    { name: "Salesperson A", sales: 8, revenue: 14200, leads: 21, referrals: 4 },
    { name: "Salesperson B", sales: 6, revenue: 10850, leads: 18, referrals: 3 },
    { name: "Salesperson C", sales: 4, revenue: 7200, leads: 12, referrals: 2 },
  ],
  renewals: [
    { name: "Renewal Rep A", renewals: 5, revenue: 8100, leads: 9, referrals: 2 },
    { name: "Renewal Rep B", renewals: 3, revenue: 4700, leads: 7, referrals: 1 },
    { name: "Renewal Rep C", renewals: 2, revenue: 2800, leads: 4, referrals: 1 },
  ],
  service: [
    { name: "Service Rep A", incoming: 58, answered: 52, cancellations: 2, serviceSales: 3 },
    { name: "Service Rep B", incoming: 44, answered: 36, cancellations: 1, serviceSales: 1 },
    { name: "Service Rep C", incoming: 39, answered: 32, cancellations: 3, serviceSales: 2 },
  ],
  collection: [
    { name: "Collector A", general: 18400, taxReturnFees: 22600, referrals: 5 },
    { name: "Collector B", general: 9700, taxReturnFees: 14400, referrals: 2 },
    { name: "Collector C", general: 6200, taxReturnFees: 8600, referrals: 1 },
  ],
};

let dashboardData = structuredClone(sampleData);

const targets = {
  newSalesRevenue: 30000,
  renewalRevenue: 14000,
  serviceAnswerRate: 85,
  collectionTotal: 65000,
};

const elements = {
  dashboardDate: document.querySelector("#dashboardDate"),
  importSubmissions: document.querySelector("#importSubmissions"),
  loadOnlineData: document.querySelector("#loadOnlineData"),
  exportHtml: document.querySelector("#exportHtml"),
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
  serviceAnswerRate: document.querySelector("#serviceAnswerRate"),
  serviceSales: document.querySelector("#serviceSales"),
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

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function backendUrl() {
  return String(window.DASHBOARD_BACKEND_URL || "").trim();
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
  const serviceIncoming = sum(data.service, "incoming");
  const serviceAnswered = sum(data.service, "answered");
  const serviceCancellations = sum(data.service, "cancellations");
  const serviceSales = sum(data.service, "serviceSales");
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
    serviceCancellations,
    serviceSales,
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

function setStatus(element, value, target, unit = "money") {
  const ratio = target ? value / target : 0;
  const label = ratio >= 1 ? "On target" : `${Math.round(ratio * 100)}% of target`;
  element.textContent = label;
  element.classList.toggle("warning", ratio < 0.75);
  element.title = unit === "percent" ? `${percent(value)} / ${percent(target)}` : `${money(value)} / ${money(target)}`;
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
  const unanswered = Math.max(metrics.serviceIncoming - metrics.serviceAnswered, 0);
  const risks = [
    ["Unanswered workload", `${unanswered} calls / missions`],
    ["Cancellations", `${metrics.serviceCancellations} today`],
    ["Sales via service", `${metrics.serviceSales} generated`],
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
    tbody.innerHTML = `<tr><td colspan="${labels.length}">No daily files imported for this department.</td></tr>`;
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
  elements.serviceAnswerRate.textContent = percent(metrics.serviceAnswerRate);
  elements.serviceSales.textContent = String(metrics.serviceSales);

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
  const serviceRows = [...dashboardData.service].sort((a, b) => b.answered - a.answered);
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

  renderTable(elements.serviceTable, serviceRows, ["Representative", "Incoming", "Answered", "Answer rate", "Cancellations", "Service sales"], (row) => [
    row.name,
    row.incoming,
    row.answered,
    percent(row.incoming ? (row.answered / row.incoming) * 100 : 0),
    row.cancellations,
    row.serviceSales,
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
    return { department: "service", row: { name, incoming: Number(values.incoming) || 0, answered: Number(values.answered) || 0, cancellations: Number(values.cancellations) || 0, serviceSales: Number(values.serviceSales) || 0 } };
  }

  if (submission.department === "collection") {
    return { department: "collection", row: { name, general: Number(values.general) || 0, taxReturnFees: Number(values.taxReturnFees) || 0, referrals: Number(values.referrals) || 0 } };
  }

  return null;
}

async function importSubmissions(fileList) {
  const nextData = structuredClone(emptyData);

  for (const file of Array.from(fileList || [])) {
    const text = await file.text();
    const normalized = normalizeSubmission(JSON.parse(text));
    if (!normalized) continue;
    nextData[normalized.department].push(normalized.row);
  }

  dashboardData = nextData;
  renderDashboard();
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
      reject(new Error("Could not load online dashboard data."));
    };

    script.src = `${url}${separator}action=data&date=${encodeURIComponent(elements.dashboardDate.value || todayKey())}&callback=${encodeURIComponent(callbackName)}`;
    document.body.append(script);
  });
}

async function loadOnlineData() {
  const endpoint = backendUrl();
  if (!endpoint) {
    window.alert("Online backend is not configured yet. Paste the Google Apps Script web app URL into config.js.");
    return;
  }

  elements.loadOnlineData.disabled = true;
  elements.loadOnlineData.textContent = "Loading...";

  try {
    const payload = await loadJsonp(endpoint);
    dashboardData = normalizeSubmissionList(payload.submissions || []);
    renderDashboard();
    elements.loadOnlineData.textContent = "Loaded";
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Could not load online dashboard data.");
    elements.loadOnlineData.textContent = "Load online data";
  } finally {
    setTimeout(() => {
      elements.loadOnlineData.disabled = false;
      elements.loadOnlineData.textContent = "Load online data";
    }, 1200);
  }
}

function exportHtml() {
  const clone = document.documentElement.cloneNode(true);
  clone.querySelectorAll("script").forEach((script) => script.remove());
  clone.querySelectorAll("input").forEach((input) => {
    if (input.type === "date") input.setAttribute("value", input.value);
    if (input.type === "file") input.closest("label")?.remove();
  });
  clone.querySelector("#exportHtml")?.remove();
  const html = `<!doctype html>\n${clone.outerHTML}`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.download = `tax-return-daily-dashboard-${elements.dashboardDate.value || todayKey()}.html`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function init() {
  elements.dashboardDate.value = todayKey();
  elements.exportHtml.addEventListener("click", exportHtml);
  elements.importSubmissions.addEventListener("change", (event) => {
    importSubmissions(event.target.files).catch((error) => {
      window.alert(error instanceof Error ? error.message : "Could not import the daily files.");
    });
    event.target.value = "";
  });
  elements.loadOnlineData.addEventListener("click", loadOnlineData);
  renderDashboard();
}

init();
