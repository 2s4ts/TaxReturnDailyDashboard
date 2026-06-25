const departmentForms = {
  newSales: {
    title: "Sales Department 1 Daily Form",
    filePrefix: "sales-department-1",
    fields: [
      { key: "sales", label: "Total Sales", type: "number" },
      { key: "revenue", label: "Total Revenue Collected", type: "money" },
      { key: "leads", label: "New Leads Generated", type: "number" },
      { key: "insuranceReferrals", label: "Insurance Referrals Created", type: "number" },
      { key: "friendReferrals", label: "Friend Referrals Created", type: "number" },
    ],
  },
  newSales2: {
    title: "Sales Department 2 Daily Form",
    filePrefix: "sales-department-2",
    fields: [
      { key: "sales", label: "Total Sales", type: "number" },
      { key: "revenue", label: "Total Revenue Collected", type: "money" },
      { key: "insuranceReferrals", label: "Insurance Referrals Created", type: "number" },
      { key: "friendReferrals", label: "Friend Referrals Created", type: "number" },
    ],
  },
  renewals: {
    title: "Renewal Sales Daily Form",
    filePrefix: "renewal-sales",
    fields: [
      { key: "renewals", label: "Total Renewal Sales", type: "number" },
      { key: "revenue", label: "Total Renewal Revenue", type: "money" },
      { key: "insuranceReferrals", label: "Insurance Referrals Created", type: "number" },
      { key: "friendReferrals", label: "Friend Referrals Created", type: "number" },
    ],
  },
  service: {
    title: "Customer Service Daily Form",
    filePrefix: "customer-service",
    fields: [
      { key: "callsReceived", label: "Calls Received Today", type: "number" },
      { key: "callsAnswered", label: "Calls Answered Today", type: "number" },
      { key: "abandonCalls", label: "Abandon Calls", type: "number" },
      { key: "missionsOpened", label: "Missions opened", type: "number" },
      { key: "missionsClosed", label: "Missions closed", type: "number" },
      { key: "newHumanChats", label: "New human chats", type: "number" },
      { key: "closedHumanChats", label: "Closed human chats", type: "number" },
      { key: "newBotChats", label: "New bot chats", type: "number" },
      { key: "closedBotChats", label: "Closed bot chats", type: "number" },
      { key: "insuranceReferrals", label: "Insurance Referrals Created", type: "number" },
      { key: "friendReferrals", label: "Friend Referrals Created", type: "number" },
    ],
  },
  collection: {
    title: "Collection Daily Form",
    filePrefix: "collection",
    fields: [
      { key: "general", label: "General Money Collected", type: "money" },
      { key: "insuranceReferrals", label: "Insurance Referrals Created", type: "number" },
      { key: "friendReferrals", label: "Friend Referrals Created", type: "number" },
      { key: "newTaxReturns", label: "New Tax Returns For Customer", type: "money" },
    ],
  },
  hr: {
    title: "HR Daily Form",
    filePrefix: "hr",
    fields: [
      { key: "newCandidates", label: "New candidates", type: "number" },
      { key: "firstInterview", label: "First interview", type: "number" },
      { key: "secondInterview", label: "Second interview", type: "number" },
      { key: "newHires", label: "New hires", type: "number" },
    ],
  },
  businessDevelopment: {
    title: "Business Development Daily Form",
    filePrefix: "business-development",
    fields: [
      { key: "initialContact", label: "Initial contact", type: "number" },
      { key: "followUps", label: "Follow-ups", type: "number" },
      { key: "setUpMeetings", label: "Set up meetings", type: "number" },
      { key: "signedCompanyContracts", label: "Sign contracts between companies", type: "number" },
    ],
  },
};

const translations = {
  he: {
    "Daily Department Form": "טופס מחלקה יומי",
    "Daily department entry": "הזנת מחלקה יומית",
    "Department Form": "טופס מחלקה",
    "Copy share link": "העתק קישור לשיתוף",
    "All department forms": "כל טפסי המחלקות",
    Date: "תאריך",
    "Department head / person": "מנהל מחלקה / שם",
    Name: "שם",
    "Submit daily numbers": "שלח נתונים יומיים",
    "Copy data": "העתק נתונים",
    Copied: "הועתק",
    "Copy failed": "העתקה נכשלה",
    "Link copied": "הקישור הועתק",
    "Copy share link": "העתק קישור לשיתוף",
    Sending: "שולח...",
    Submitted: "נשלח",
    "Submit failed": "השליחה נכשלה",
    "How it works": "איך זה עובד",
    "Fill today's numbers.": "ממלאים את המספרים של היום.",
    "Click Submit daily numbers.": "לוחצים על שלח נתונים יומיים.",
    "If the same person submits again for the same date and department, the old row is replaced.": "אם שולחים שוב לאותו תאריך ומחלקה, הנתונים הישנים מוחלפים.",
    "At Israel midnight, new submissions automatically go into the new day.": "בחצות לפי שעון ישראל, הנתונים עוברים אוטומטית ליום החדש.",
    "Sales Department 1 Daily Form": "טופס יומי מחלקת מכירות 1",
    "Sales Department 2 Daily Form": "טופס יומי מחלקת מכירות 2",
    "Renewal Sales Daily Form": "טופס יומי מכירות חידושים",
    "Customer Service Daily Form": "טופס יומי שירות לקוחות",
    "Collection Daily Form": "טופס יומי גבייה",
    "HR Daily Form": "טופס יומי משאבי אנוש",
    "Business Development Daily Form": "טופס יומי פיתוח עסקי",
    "Sales Department 1": "מחלקת מכירות 1",
    "Sales Department 2": "מחלקת מכירות 2",
    "Daily Form": "טופס יומי",
    "Total Sales": "סה\"כ מכירות",
    "Total Revenue Collected": "סה\"כ הכנסות שנגבו",
    "New Leads Generated": "לידים חדשים",
    "Insurance Referrals Created": "הפניות ביטוח",
    "Friend Referrals Created": "הפניות חברים",
    "Total Renewal Sales": "סה\"כ חידושים",
    "Total Renewal Revenue": "סה\"כ הכנסות חידושים",
    "Calls Received Today": "שיחות שהתקבלו היום",
    "Calls Answered Today": "שיחות שנענו היום",
    "Abandon Calls": "שיחות נטושות",
    "Missions opened": "משימות שנפתחו",
    "Missions closed": "משימות שנסגרו",
    "New human chats": "צ'אטים חדשים מאדם",
    "Closed human chats": "צ'אטים שנסגרו מאדם",
    "New bot chats": "צ'אטים חדשים מבוט",
    "Closed bot chats": "צ'אטים שנסגרו מבוט",
    "General Money Collected": "כסף כללי שנגבה",
    "New Tax Returns For Customer": "דוחות מס חדשים ללקוח",
    "New candidates": "מועמדים חדשים",
    "First interview": "ראיון ראשון",
    "Second interview": "ראיון שני",
    "New hires": "עובדים חדשים",
    "Initial contact": "יצירת קשר ראשוני",
    "Follow-ups": "מעקבים",
    "Set up meetings": "קביעת פגישות",
    "Sign contracts between companies": "חתימת חוזים בין חברות",
  },
};

function languageKey() {
  return localStorage.getItem("dashboardLanguage") || "en";
}

function t(text) {
  return translations[languageKey()]?.[text] || text;
}

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
  languageSelect: document.querySelector("#languageSelect"),
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

function applyGoalLabels(goals = {}) {
  if (departmentKey === "newSales" && goals.salesDepartmentOneName) {
    config.title = languageKey() === "he" ? `${t("Daily Form")} ${t(goals.salesDepartmentOneName)}` : `${goals.salesDepartmentOneName} Daily Form`;
  }

  if (departmentKey === "newSales2" && goals.salesDepartmentTwoName) {
    config.title = languageKey() === "he" ? `${t("Daily Form")} ${t(goals.salesDepartmentTwoName)}` : `${goals.salesDepartmentTwoName} Daily Form`;
  }
}

function loadJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `dailyFormCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const separator = url.includes("?") ? "&" : "?";
    const query = new URLSearchParams({
      _: String(Date.now()),
      callback: callbackName,
    });

    window[callbackName] = (payload) => {
      delete window[callbackName];
      script.remove();
      resolve(payload);
    };

    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error("Could not load form settings."));
    };

    script.src = `${url}${separator}${query.toString()}`;
    document.body.append(script);
  });
}

async function loadFormSettings() {
  if (!backendUrl()) return;

  try {
    const payload = await loadJsonp(backendUrl());
    applyGoalLabels(payload.goals || {});
  } catch {
    // The form can still submit with its default title if settings are unavailable.
  }
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
  elements.copyJson.textContent = t("Copied");
  setTimeout(() => {
    elements.copyJson.textContent = t("Copy data");
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
  const url = new URL("form.html", window.location.href);
  url.searchParams.set("department", departmentKey);
  const path = `${url.pathname}${url.search}`;

  if (backendUrl()) {
    return url.href;
  }

  try {
    const response = await fetch(`/api/share-link?path=${encodeURIComponent(path)}`, { cache: "no-store" });
    if (!response.ok) throw new Error("Could not build share link.");
    const payload = await response.json();
    return payload.url || url.href;
  } catch {
    return url.href;
  }
}

async function copyShareLink() {
  const link = await getShareLink();
  await copyText(link);
  elements.copyShareLink.textContent = t("Link copied");
  elements.copyShareLink.title = link;
  setTimeout(() => {
    elements.copyShareLink.textContent = t("Copy share link");
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
  document.documentElement.lang = languageKey();
  document.documentElement.dir = languageKey() === "he" ? "rtl" : "ltr";
  document.title = t("Daily Department Form");
  elements.formTitle.textContent = t(config.title);
  elements.entryDate.value = await currentServerDate();
  elements.fieldGrid.innerHTML = "";

  for (const field of config.fields) {
    const label = document.createElement("label");
    label.innerHTML = `
      <span>${t(field.label)}</span>
      <input name="${field.key}" type="number" min="0" step="${field.type === "money" ? "0.01" : "1"}" value="0" required />
    `;
    elements.fieldGrid.append(label);
  }
}

function translateStaticFormText() {
  const textNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeValue.trim()) textNodes.push(node);
    node = walker.nextNode();
  }

  for (const textNode of textNodes) {
    const text = textNode.nodeValue.trim();
    const translated = t(text);
    if (translated !== text) textNode.nodeValue = textNode.nodeValue.replace(text, translated);
  }

  elements.personName.placeholder = t("Name");
  elements.languageSelect.value = languageKey();
}

elements.departmentForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submission = collectSubmission();
  const button = elements.departmentForm.querySelector("button[type='submit']");
  button.disabled = true;
  button.textContent = `${t("Sending")}`;

  try {
    await submitOnline(submission);
    button.textContent = t("Submitted");
    elements.departmentForm.reset();
    elements.entryDate.value = await currentServerDate();
    setTimeout(() => {
      button.disabled = false;
      button.textContent = t("Submit daily numbers");
    }, 1800);
  } catch (error) {
    button.disabled = false;
    button.textContent = t("Submit failed");
    window.alert(error instanceof Error ? error.message : "Could not save this submission.");
    setTimeout(() => {
      button.textContent = t("Submit daily numbers");
    }, 1800);
  }
});

elements.copyJson.addEventListener("click", () => {
  copySubmission().catch(() => {
    elements.copyJson.textContent = t("Copy failed");
  });
});

elements.copyShareLink.addEventListener("click", () => {
  copyShareLink().catch(() => {
    elements.copyShareLink.textContent = t("Copy failed");
    setTimeout(() => {
      elements.copyShareLink.textContent = t("Copy share link");
    }, 1800);
  });
});

elements.languageSelect.addEventListener("change", () => {
  localStorage.setItem("dashboardLanguage", elements.languageSelect.value);
  window.location.reload();
});

translateStaticFormText();
loadFormSettings().finally(renderFields);
