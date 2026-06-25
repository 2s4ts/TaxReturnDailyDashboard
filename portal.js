const portalTranslations = {
  he: {
    "Daily entry portal": "כניסה יומית למחלקות",
    "Choose your department form": "בחרו את טופס המחלקה",
    Language: "שפה",
    "Open your department form and submit today's numbers.": "פתחו את טופס המחלקה ושלחו את המספרים של היום.",
    "Sales Department 1": "מחלקת מכירות 1",
    "Sales Department 2": "מחלקת מכירות 2",
    "Renewal Sales": "מכירות חידושים",
    "Customer Service": "שירות לקוחות",
    Collection: "גבייה",
    HR: "משאבי אנוש",
    "Business Development": "פיתוח עסקי",
    "Daily Form": "טופס יומי",
  },
};

function portalLanguageKey() {
  return localStorage.getItem("dashboardLanguage") || "en";
}

function portalText(text) {
  return portalTranslations[portalLanguageKey()]?.[text] || text;
}

function setPortalLanguage() {
  const language = portalLanguageKey();
  document.documentElement.lang = language;
  document.documentElement.dir = language === "he" ? "rtl" : "ltr";
  document.querySelector("#languageSelect").value = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = portalText(element.dataset.i18n);
  });
}

function backendUrl() {
  return String(window.DASHBOARD_BACKEND_URL || "").trim();
}

function loadJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = `dailyPortalCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
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
      reject(new Error("Could not load portal settings."));
    };

    script.src = `${url}${separator}${query.toString()}`;
    document.body.append(script);
  });
}

async function loadPortalSettings() {
  if (!backendUrl()) return;

  try {
    const payload = await loadJsonp(backendUrl());
    const goals = payload.goals || {};
    const salesOne = document.querySelector("#newSalesFormLink strong");
    const salesTwo = document.querySelector("#newSales2FormLink strong");
    if (goals.salesDepartmentOneName && salesOne) salesOne.textContent = goals.salesDepartmentOneName;
    if (goals.salesDepartmentTwoName && salesTwo) salesTwo.textContent = goals.salesDepartmentTwoName;
  } catch {
    // The portal still works with default department names if settings are unavailable.
  }
}

document.querySelector("#languageSelect").addEventListener("change", (event) => {
  localStorage.setItem("dashboardLanguage", event.target.value);
  setPortalLanguage();
  loadPortalSettings();
});

setPortalLanguage();
loadPortalSettings();
