const departmentForms = {
  newSales: {
    title: "New Sales Daily Form",
    filePrefix: "new-sales",
    fields: [
      { key: "sales", label: "Total Sales", type: "number" },
      { key: "revenue", label: "Total Revenue Collected", type: "money" },
      { key: "leads", label: "New Leads Generated", type: "number" },
      { key: "referrals", label: "Insurance Referrals Created", type: "number" },
    ],
  },
  renewals: {
    title: "Renewal Sales Daily Form",
    filePrefix: "renewal-sales",
    fields: [
      { key: "renewals", label: "Total Renewal Sales", type: "number" },
      { key: "revenue", label: "Total Renewal Revenue", type: "money" },
      { key: "leads", label: "Renewal Leads Generated", type: "number" },
      { key: "referrals", label: "Renewal Insurance Referrals Created", type: "number" },
    ],
  },
  service: {
    title: "Customer Service Daily Form",
    filePrefix: "customer-service",
    fields: [
      { key: "incoming", label: "Incoming Calls / Missions Received", type: "number" },
      { key: "answered", label: "Calls Answered", type: "number" },
      { key: "cancellations", label: "Daily Cancellations", type: "number" },
      { key: "serviceSales", label: "Sales Generated via Service", type: "number" },
    ],
  },
  collection: {
    title: "Collection Daily Form",
    filePrefix: "collection",
    fields: [
      { key: "general", label: "General Money Collected", type: "money" },
      { key: "referrals", label: "Referrals Generated", type: "number" },
      { key: "taxReturnFees", label: "Revenue from Successful Tax Returns", type: "money" },
    ],
  },
};

const params = new URLSearchParams(window.location.search);
const departmentKey = params.get("department") || "newSales";
const config = departmentForms[departmentKey] || departmentForms.newSales;

const elements = {
  formTitle: document.querySelector("#formTitle"),
  entryDate: document.querySelector("#entryDate"),
  personName: document.querySelector("#personName"),
  fieldGrid: document.querySelector("#fieldGrid"),
  departmentForm: document.querySelector("#departmentForm"),
  copyJson: document.querySelector("#copyJson"),
};

function backendUrl() {
  return String(window.DASHBOARD_BACKEND_URL || "").trim();
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function numberValue(key) {
  const input = document.querySelector(`[name="${key}"]`);
  return Number(input?.value || 0) || 0;
}

function collectSubmission() {
  const values = {};
  for (const field of config.fields) {
    values[field.key] = numberValue(field.key);
  }

  return {
    version: 1,
    department: departmentKey,
    date: elements.entryDate.value,
    name: elements.personName.value.trim() || config.title,
    values,
    submittedAt: new Date().toISOString(),
  };
}

function downloadSubmission(submission) {
  const json = JSON.stringify(submission, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  const safeName = submission.name.replace(/[^a-z0-9\u0590-\u05ff]+/gi, "-").replace(/^-+|-+$/g, "") || "department";

  link.href = url;
  link.download = `${config.filePrefix}-${safeName}-${submission.date || todayKey()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copySubmission() {
  const submission = collectSubmission();
  await navigator.clipboard.writeText(JSON.stringify(submission, null, 2));
  elements.copyJson.textContent = "Copied";
  setTimeout(() => {
    elements.copyJson.textContent = "Copy data";
  }, 1500);
}

async function submitOnline(submission) {
  const endpoint = backendUrl();
  if (!endpoint) return false;

  await fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(submission),
  });
  return true;
}

function renderFields() {
  elements.formTitle.textContent = config.title;
  elements.entryDate.value = todayKey();
  elements.fieldGrid.innerHTML = "";

  for (const field of config.fields) {
    const label = document.createElement("label");
    label.innerHTML = `
      <span>${field.label}</span>
      <input name="${field.key}" type="number" min="0" step="${field.type === "money" ? "0.01" : "1"}" value="0" required />
    `;
    elements.fieldGrid.append(label);
  }
}

elements.departmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submission = collectSubmission();
  const button = elements.departmentForm.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = "Sending...";

  try {
    const sentOnline = await submitOnline(submission);
    if (sentOnline) {
      button.textContent = "Submitted";
      elements.departmentForm.reset();
      elements.entryDate.value = todayKey();
      setTimeout(() => {
        button.disabled = false;
        button.textContent = "Submit daily numbers";
      }, 1800);
      return;
    }

    downloadSubmission(submission);
    button.disabled = false;
    button.textContent = "Submit daily numbers";
  } catch (error) {
    button.disabled = false;
    button.textContent = "Submit failed";
    setTimeout(() => {
      button.textContent = "Submit daily numbers";
    }, 1800);
  }
});

elements.copyJson.addEventListener("click", () => {
  copySubmission().catch(() => {
    elements.copyJson.textContent = "Copy failed";
  });
});

renderFields();
