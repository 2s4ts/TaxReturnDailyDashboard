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

const targets = {
  newSalesRevenue: 30000,
  renewalRevenue: 14000,
  serviceAnswerRate: 85,
  collectionTotal: 65000,
};

const elements = {
  dashboardDate: document.querySelector("#dashboardDate"),
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

  for (const row of rows) {
    const tr = document.createElement("tr");
    const cells = rowBuilder(row);
    tr.innerHTML = cells.map((cell, index) => `<td data-label="${labels[index]}">${cell}</td>`).join("");
    tbody.append(tr);
  }
}

function renderDashboard() {
  const metrics = getMetrics(sampleData);

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

  const newSalesRows = [...sampleData.newSales].sort((a, b) => b.revenue - a.revenue);
  const renewalRows = [...sampleData.renewals].sort((a, b) => b.revenue - a.revenue);
  const serviceRows = [...sampleData.service].sort((a, b) => b.answered - a.answered);
  const collectionRows = [...sampleData.collection].sort((a, b) => b.general + b.taxReturnFees - (a.general + a.taxReturnFees));

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

function exportHtml() {
  const html = `<!doctype html>\n${document.documentElement.outerHTML}`;
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
  renderDashboard();
}

init();
