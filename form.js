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
      { key: "callsReceived", label: "Calls Received Today", type: "number" },
      { key: "callsAnswered", label: "Calls Answered Today", type: "number" },
      { key: "missedCalls", label: "Missed Calls", type: "number" },
      { key: "canceledCalls", label: "Canceled Calls", type: "number" },
      { key: "deletedCalls", label: "Deleted Calls", type: "number" },
      { key: "answers", label: "Answers / Responses Sent", type: "number" },
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
  copyShareLink: document.querySelector("#copyShareLink"),
};

function todayKey() {
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
  if (backendUrl()) return todayKey();

  try {
    const response = await fetch("/api/day", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load server day.");
    const payload = await response.json();
    return payload.date || todayKey();
  } catch {
    return todayKey();
  }
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

async function copySubmission() {
  const submission = collectSubmission();
  await navigator.clipboard.writeText(JSON.stringify(submission, null, 2));
  elements.copyJson.textContent = "Copied";
  setTimeout(() => {
    elements.copyJson.textContent = "Copy data";
  }, 1500);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.left = "-9999px";
  document.body.append(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

async function getShareLink() {
  const path = `/form.html?department=${encodeURIComponent(departmentKey)}`;
  if (backendUrl()) {
    return `${window.location.origin}${path}`;
  }

  try {
    const response = await fetch(`/api/share-link?path=${encodeURIComponent(path)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not build share link.");
    const payload = await response.json();
    return payload.url || `${window.location.origin}${path}`;
  } catch {
    return `${window.location.origin}${path}`;
  }
}

async function copyShareLink() {
  const link = await getShareLink();
  await copyText(link);
  elements.copyShareLink.textContent = "Link copied";
  elements.copyShareLink.title = link;
  setTimeout(() => {
    elements.copyShareLink.textContent = "Copy share link";
  }, 1800);
}

async function submitOnline(submission) {
  const endpoint = backendUrl();

  if (endpoint) {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(submission),
    });
    return { ok: true };
  }

  if (!canUseLocalApi()) {
    throw new Error("Online backend is not configured. Add the Apps Script web app URL in config.js.");
  }

  const response = await fetch("/api/submissions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  if (!response.ok) throw new Error("The local dashboard server could not save this submission.");
  return response.json();
}

async function renderFields() {
  elements.formTitle.textContent = config.title;
  elements.entryDate.value = await currentServerDate();
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
    await submitOnline(submission);
    button.textContent = "Submitted";
    elements.departmentForm.reset();
    elements.entryDate.value = await currentServerDate();
    setTimeout(() => {
      button.disabled = false;
      button.textContent = "Submit daily numbers";
    }, 1800);
  } catch (error) {
    button.disabled = false;
    button.textContent = "Submit failed";
    window.alert(error instanceof Error ? error.message : "Could not save this submission.");
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

elements.copyShareLink.addEventListener("click", () => {
  copyShareLink().catch(() => {
    elements.copyShareLink.textContent = "Copy failed";
    setTimeout(() => {
      elements.copyShareLink.textContent = "Copy share link";
    }, 1800);
  });
});

renderFields();
