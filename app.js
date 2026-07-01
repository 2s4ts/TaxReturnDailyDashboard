const emptyData = {
  newSales: [],
  newSales2: [],
  renewals: [],
  service: [],
  collection: [],
  hr: [],
  businessDevelopment: [],
};

let dashboardData = structuredClone(emptyData);
let weeklyDashboardData = structuredClone(emptyData);
let backendWarningShown = false;

const defaultTargets = {
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

let targets = { ...defaultTargets };

const defaultLayout = {
  topMetrics: [
    "dailyMark",
    "totalRevenue",
    "totalSales",
    "totalLeads",
    "totalInsuranceReferrals",
    "totalFriendReferrals",
    "totalAbandonCalls",
    "totalNewTaxReturns",
    "totalNewHires",
    "totalSignedCompanyContracts",
  ],
  departmentMetricOrder: {
    newSales: ["sales", "revenue", "leads", "insuranceReferrals", "friendReferrals"],
    newSales2: ["sales", "revenue", "insuranceReferrals", "friendReferrals"],
    renewals: ["renewals", "revenue", "insuranceReferrals", "friendReferrals"],
    service: [
      "callsReceived",
      "callsAnswered",
      "abandonCalls",
      "answerRate",
      "missionsOpened",
      "missionsClosed",
      "newHumanChats",
      "closedHumanChats",
      "newBotChats",
      "closedBotChats",
      "insuranceReferrals",
      "friendReferrals",
    ],
    collection: ["general", "totalRevenue", "newTaxReturns", "insuranceReferrals", "friendReferrals"],
    hr: ["newCandidates", "firstInterview", "secondInterview", "newHires"],
    businessDevelopment: ["initialContact", "followUps", "setUpMeetings", "signedCompanyContracts"],
  },
};

let dashboardLayout = structuredClone(defaultLayout);

const translations = {
  he: {
    "Daily performance": "ביצועים יומיים",
    "Tax Return Operations": "תפעול החזרי מס",
    Language: "שפה",
    "Dashboard date": "תאריך לוח הבקרה",
    Refresh: "רענן",
    "Export HTML": "ייצוא HTML",
    "Daily mark": "ציון יומי",
    "Waiting for today's data": "ממתין לנתוני היום",
    "Total daily revenue": "סה\"כ הכנסה יומית",
    "Sales, renewals, and collections": "מכירות, חידושים וגבייה",
    "Total daily sales": "סה\"כ מכירות יומיות",
    "Sales departments + renewals": "מחלקות מכירות + חידושים",
    "Total leads": "סה\"כ לידים",
    "Sales department 1 leads": "לידים מחלקת מכירות 1",
    "Insurance referrals": "הפניות ביטוח",
    "Friend referrals": "הפניות חברים",
    "All departments": "כל המחלקות",
    "Abandon calls": "שיחות נטושות",
    "Customer service daily risk": "מדד סיכון יומי שירות לקוחות",
    "New tax returns": "דוחות מס חדשים",
    "Collection tracking only": "מעקב גבייה בלבד",
    Bad: "לא טוב",
    Okay: "בסדר",
    "Okay okay": "בסדר טוב",
    "Really good": "מצוין",
    Sales: "מכירות",
    Revenue: "הכנסה",
    Leads: "לידים",
    "Insurance referrals": "הפניות ביטוח",
    "Friend referrals": "הפניות חברים",
    "Renewal Sales": "מכירות חידושים",
    Renewals: "חידושים",
    "Customer Service": "שירות לקוחות",
    "Calls received": "שיחות שהתקבלו",
    "Calls answered": "שיחות שנענו",
    "Answer rate": "אחוז מענה",
    "Missions opened": "משימות שנפתחו",
    "Missions closed": "משימות שנסגרו",
    "New human chats": "צ'אטים חדשים מאדם",
    "Closed human chats": "צ'אטים שנסגרו מאדם",
    "New bot chats": "צ'אטים חדשים מבוט",
    "Closed bot chats": "צ'אטים שנסגרו מבוט",
    Collection: "גבייה",
    HR: "משאבי אנוש",
    "Business Development": "פיתוח עסקי",
    General: "כללי",
    "Total revenue": "סה\"כ הכנסה",
    "New candidates": "מועמדים חדשים",
    "First interview": "ראיון ראשון",
    "Second interview": "ראיון שני",
    "New hires": "עובדים חדשים",
    "HR tracking": "מעקב משאבי אנוש",
    "Initial contact": "יצירת קשר ראשוני",
    "Follow-ups": "מעקבים",
    "Set up meetings": "קביעת פגישות",
    "Signed company contracts": "חוזים חתומים בין חברות",
    "Business development": "פיתוח עסקי",
    "Revenue by source": "הכנסה לפי מקור",
    "Service answer rate": "אחוז מענה שירות",
    "Daily Goals": "יעדים יומיים",
    "Using saved goals": "משתמש ביעדים שמורים",
    "Sales department 1 name": "שם מחלקת מכירות 1",
    "Sales department 1 revenue goal": "יעד הכנסה מחלקת מכירות 1",
    "Sales department 2 name": "שם מחלקת מכירות 2",
    "Sales department 2 revenue goal": "יעד הכנסה מחלקת מכירות 2",
    "Renewal revenue goal": "יעד הכנסה חידושים",
    "Service answer rate goal (%)": "יעד אחוז מענה שירות (%)",
    "Collection total goal": "יעד גבייה כללי",
    "New tax refund goal": "הודעות החזר",
    "HR new hires goal": "יעד עובדים חדשים למשאבי אנוש",
    "Business signed contracts goal": "יעד חוזים חתומים בפיתוח עסקי",
    "Save goals": "שמור יעדים",
    "Fix Mistakes": "תיקון טעויות",
    "Delete selected department data": "מחיקת נתוני מחלקה נבחרת",
    Department: "מחלקה",
    "Delete data for selected date": "מחק נתונים לתאריך הנבחר",
    "Sales Department 1": "מחלקת מכירות 1",
    "Sales Department 2": "מחלקת מכירות 2",
    form: "טופס",
    "Sales Department 1 form": "טופס מחלקת מכירות 1",
    "Sales Department 2 form": "טופס מחלקת מכירות 2",
    "Renewal Sales form": "טופס מכירות חידושים",
    "Customer Service form": "טופס שירות לקוחות",
    "Collection form": "טופס גבייה",
    "HR form": "טופס משאבי אנוש",
    "Business Development form": "טופס פיתוח עסקי",
    "Collection - General": "גבייה - כללי",
    "Goals saved": "היעדים נשמרו",
    "Could not save goals": "לא ניתן לשמור יעדים",
    Saving: "שומר...",
    Refreshing: "מרענן...",
    Deleting: "מוחק...",
    "Delete failed": "המחיקה נכשלה",
    "Dashboard Layout": "פריסת לוח בקרה",
    "Drag to customize desktop view": "גרור כדי להתאים את תצוגת המחשב",
    "Top section": "אזור עליון",
    "Department order": "סדר מחלקות",
    "Save layout": "שמור פריסה",
    "Layout saved": "הפריסה נשמרה",
    "Could not save layout": "לא ניתן לשמור פריסה",
    Daily: "יומי",
    Weekly: "שבועי",
    "Work week": "שבוע עבודה",
  },
};

function languageKey() {
  return localStorage.getItem("dashboardLanguage") || "en";
}

function t(text) {
  return translations[languageKey()]?.[text] || text;
}

const elements = {
  dashboardDate: document.querySelector("#dashboardDate"),
  refreshData: document.querySelector("#refreshData"),
  exportHtml: document.querySelector("#exportHtml"),
  dailyMark: document.querySelector("#dailyMark"),
  dailyMarkLabel: document.querySelector("#dailyMarkLabel"),
  totalRevenue: document.querySelector("#totalRevenue"),
  totalSales: document.querySelector("#totalSales"),
  totalLeads: document.querySelector("#totalLeads"),
  totalInsuranceReferrals: document.querySelector("#totalInsuranceReferrals"),
  totalFriendReferrals: document.querySelector("#totalFriendReferrals"),
  totalAbandonCalls: document.querySelector("#totalAbandonCalls"),
  totalNewTaxReturns: document.querySelector("#totalNewTaxReturns"),
  totalNewHires: document.querySelector("#totalNewHires"),
  totalSignedCompanyContracts: document.querySelector("#totalSignedCompanyContracts"),
  languageSelect: document.querySelector("#languageSelect"),
  newSalesStatus: document.querySelector("#newSalesStatus"),
  newSales2Status: document.querySelector("#newSales2Status"),
  renewalsStatus: document.querySelector("#renewalsStatus"),
  serviceStatus: document.querySelector("#serviceStatus"),
  collectionStatus: document.querySelector("#collectionStatus"),
  hrStatus: document.querySelector("#hrStatus"),
  businessDevelopmentStatus: document.querySelector("#businessDevelopmentStatus"),
  newSalesCount: document.querySelector("#newSalesCount"),
  newSalesRevenue: document.querySelector("#newSalesRevenue"),
  newSalesLeads: document.querySelector("#newSalesLeads"),
  newSalesInsuranceReferrals: document.querySelector("#newSalesInsuranceReferrals"),
  newSalesFriendReferrals: document.querySelector("#newSalesFriendReferrals"),
  newSales2Title: document.querySelector("#newSales2Title"),
  newSalesTitle: document.querySelector("#newSalesTitle"),
  newSalesFormLink: document.querySelector("#newSalesFormLink"),
  newSales2FormLink: document.querySelector("#newSales2FormLink"),
  newSales2Count: document.querySelector("#newSales2Count"),
  newSales2Revenue: document.querySelector("#newSales2Revenue"),
  newSales2InsuranceReferrals: document.querySelector("#newSales2InsuranceReferrals"),
  newSales2FriendReferrals: document.querySelector("#newSales2FriendReferrals"),
  renewalSalesCount: document.querySelector("#renewalSalesCount"),
  renewalRevenue: document.querySelector("#renewalRevenue"),
  renewalInsuranceReferrals: document.querySelector("#renewalInsuranceReferrals"),
  renewalFriendReferrals: document.querySelector("#renewalFriendReferrals"),
  serviceIncoming: document.querySelector("#serviceIncoming"),
  serviceAnswered: document.querySelector("#serviceAnswered"),
  serviceAbandonCalls: document.querySelector("#serviceAbandonCalls"),
  serviceAnswerRate: document.querySelector("#serviceAnswerRate"),
  serviceMissionsOpened: document.querySelector("#serviceMissionsOpened"),
  serviceMissionsClosed: document.querySelector("#serviceMissionsClosed"),
  serviceNewHumanChats: document.querySelector("#serviceNewHumanChats"),
  serviceClosedHumanChats: document.querySelector("#serviceClosedHumanChats"),
  serviceNewBotChats: document.querySelector("#serviceNewBotChats"),
  serviceClosedBotChats: document.querySelector("#serviceClosedBotChats"),
  serviceInsuranceReferrals: document.querySelector("#serviceInsuranceReferrals"),
  serviceFriendReferrals: document.querySelector("#serviceFriendReferrals"),
  collectionGeneral: document.querySelector("#collectionGeneral"),
  collectionTotal: document.querySelector("#collectionTotal"),
  collectionNewTaxReturns: document.querySelector("#collectionNewTaxReturns"),
  collectionInsuranceReferrals: document.querySelector("#collectionInsuranceReferrals"),
  collectionFriendReferrals: document.querySelector("#collectionFriendReferrals"),
  hrNewCandidates: document.querySelector("#hrNewCandidates"),
  hrFirstInterview: document.querySelector("#hrFirstInterview"),
  hrSecondInterview: document.querySelector("#hrSecondInterview"),
  hrNewHires: document.querySelector("#hrNewHires"),
  businessInitialContact: document.querySelector("#businessInitialContact"),
  businessFollowUps: document.querySelector("#businessFollowUps"),
  businessSetUpMeetings: document.querySelector("#businessSetUpMeetings"),
  businessSignedCompanyContracts: document.querySelector("#businessSignedCompanyContracts"),
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
  goalNewTaxReturns: document.querySelector("#goalNewTaxReturns"),
  goalHrNewHires: document.querySelector("#goalHrNewHires"),
  goalBusinessSignedContracts: document.querySelector("#goalBusinessSignedContracts"),
  saveGoals: document.querySelector("#saveGoals"),
  deleteStatus: document.querySelector("#deleteStatus"),
  deleteDepartment: document.querySelector("#deleteDepartment"),
  deleteDepartmentData: document.querySelector("#deleteDepartmentData"),
  summaryGrid: document.querySelector(".summary-grid"),
  topMetricControls: document.querySelector("#topMetricControls"),
  departmentLayoutControls: document.querySelector("#departmentLayoutControls"),
  layoutStatus: document.querySelector("#layoutStatus"),
  saveLayout: document.querySelector("#saveLayout"),
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
  const amount = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
  return `₪${amount}`;
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

function localLayoutKey() {
  return "dailyDashboardLayout";
}

function getLocalLayout() {
  try {
    return JSON.parse(localStorage.getItem(localLayoutKey()) || "{}");
  } catch {
    return {};
  }
}

function saveLocalLayout(layout) {
  localStorage.setItem(localLayoutKey(), JSON.stringify(layout));
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

function dateFromKey(key) {
  const [year, month, day] = String(key || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day, 12));
}

function keyFromUtcDate(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function israelWorkWeekRange(dateKey) {
  const date = dateFromKey(dateKey) || dateFromKey(localDateKey());
  const day = date.getUTCDay();
  const start = addDays(date, -day);
  const end = addDays(start, 4);
  return {
    startDate: keyFromUtcDate(start),
    endDate: keyFromUtcDate(end),
  };
}

function getMetrics(data) {
  const newSalesCount = sum(data.newSales, "sales");
  const newSalesRevenue = sum(data.newSales, "revenue");
  const newSalesLeads = sum(data.newSales, "leads");
  const newSalesInsuranceReferrals = sumAny(data.newSales, "insuranceReferrals", "referrals");
  const newSalesFriendReferrals = sumAny(data.newSales, "friendReferrals");
  const newSales2Count = sum(data.newSales2, "sales");
  const newSales2Revenue = sum(data.newSales2, "revenue");
  const newSales2InsuranceReferrals = sumAny(data.newSales2, "insuranceReferrals", "referrals");
  const newSales2FriendReferrals = sumAny(data.newSales2, "friendReferrals");
  const renewalSalesCount = sum(data.renewals, "renewals");
  const renewalRevenue = sum(data.renewals, "revenue");
  const renewalInsuranceReferrals = sumAny(data.renewals, "insuranceReferrals", "referrals");
  const renewalFriendReferrals = sumAny(data.renewals, "friendReferrals");
  const serviceIncoming = sumAny(data.service, "callsReceived", "incoming");
  const serviceAnswered = sumAny(data.service, "callsAnswered", "answered");
  const serviceAbandonCalls = sumAny(data.service, "abandonCalls");
  const serviceMissionsOpened = sumAny(data.service, "missionsOpened");
  const serviceMissionsClosed = sumAny(data.service, "missionsClosed");
  const serviceNewHumanChats = sumAny(data.service, "newHumanChats", "newChat");
  const serviceClosedHumanChats = sumAny(data.service, "closedHumanChats", "chatClosed");
  const serviceNewBotChats = sumAny(data.service, "newBotChats");
  const serviceClosedBotChats = sumAny(data.service, "closedBotChats");
  const serviceInsuranceReferrals = sumAny(data.service, "insuranceReferrals", "referrals");
  const serviceFriendReferrals = sumAny(data.service, "friendReferrals");
  const serviceAnswerRate = serviceIncoming ? (serviceAnswered / serviceIncoming) * 100 : 0;
  const collectionGeneral = sum(data.collection, "general");
  const collectionNewTaxReturns = sumAny(data.collection, "newTaxReturns");
  const collectionInsuranceReferrals = sumAny(data.collection, "insuranceReferrals", "referrals");
  const collectionFriendReferrals = sumAny(data.collection, "friendReferrals");
  const collectionTotal = collectionGeneral;
  const hrNewCandidates = sumAny(data.hr, "newCandidates");
  const hrFirstInterview = sumAny(data.hr, "firstInterview");
  const hrSecondInterview = sumAny(data.hr, "secondInterview");
  const hrNewHires = sumAny(data.hr, "newHires");
  const businessInitialContact = sumAny(data.businessDevelopment, "initialContact");
  const businessFollowUps = sumAny(data.businessDevelopment, "followUps");
  const businessSetUpMeetings = sumAny(data.businessDevelopment, "setUpMeetings");
  const businessSignedCompanyContracts = sumAny(data.businessDevelopment, "signedCompanyContracts");

  return {
    newSalesCount,
    newSalesRevenue,
    newSalesLeads,
    newSalesInsuranceReferrals,
    newSalesFriendReferrals,
    newSales2Count,
    newSales2Revenue,
    newSales2InsuranceReferrals,
    newSales2FriendReferrals,
    renewalSalesCount,
    renewalRevenue,
    renewalInsuranceReferrals,
    renewalFriendReferrals,
    serviceIncoming,
    serviceAnswered,
    serviceAbandonCalls,
    serviceMissionsOpened,
    serviceMissionsClosed,
    serviceNewHumanChats,
    serviceClosedHumanChats,
    serviceNewBotChats,
    serviceClosedBotChats,
    serviceInsuranceReferrals,
    serviceFriendReferrals,
    serviceAnswerRate,
    collectionGeneral,
    collectionNewTaxReturns,
    collectionInsuranceReferrals,
    collectionFriendReferrals,
    collectionTotal,
    hrNewCandidates,
    hrFirstInterview,
    hrSecondInterview,
    hrNewHires,
    businessInitialContact,
    businessFollowUps,
    businessSetUpMeetings,
    businessSignedCompanyContracts,
    totalRevenue: newSalesRevenue + newSales2Revenue + renewalRevenue + collectionTotal,
    totalSales: newSalesCount + newSales2Count + renewalSalesCount,
    totalLeads: newSalesLeads,
    totalInsuranceReferrals: newSalesInsuranceReferrals + newSales2InsuranceReferrals + renewalInsuranceReferrals + serviceInsuranceReferrals + collectionInsuranceReferrals,
    totalFriendReferrals: newSalesFriendReferrals + newSales2FriendReferrals + renewalFriendReferrals + serviceFriendReferrals + collectionFriendReferrals,
  };
}

const summaryMetricLabels = {
  dailyMark: "Daily mark",
  totalRevenue: "Total daily revenue",
  totalSales: "Total daily sales",
  totalLeads: "Total leads",
  totalInsuranceReferrals: "Insurance referrals",
  totalFriendReferrals: "Friend referrals",
  totalAbandonCalls: "Abandon calls",
  totalNewTaxReturns: "New tax returns",
  totalNewHires: "New hires",
  totalSignedCompanyContracts: "Signed company contracts",
};

const departmentMetricLabels = {
  newSales: {
    sales: "Sales",
    revenue: "Revenue",
    leads: "Leads",
    insuranceReferrals: "Insurance referrals",
    friendReferrals: "Friend referrals",
  },
  newSales2: {
    sales: "Sales",
    revenue: "Revenue",
    insuranceReferrals: "Insurance referrals",
    friendReferrals: "Friend referrals",
  },
  renewals: {
    renewals: "Renewals",
    revenue: "Revenue",
    insuranceReferrals: "Insurance referrals",
    friendReferrals: "Friend referrals",
  },
  service: {
    callsReceived: "Calls received",
    callsAnswered: "Calls answered",
    abandonCalls: "Abandon calls",
    answerRate: "Answer rate",
    missionsOpened: "Missions opened",
    missionsClosed: "Missions closed",
    newHumanChats: "New human chats",
    closedHumanChats: "Closed human chats",
    newBotChats: "New bot chats",
    closedBotChats: "Closed bot chats",
    insuranceReferrals: "Insurance referrals",
    friendReferrals: "Friend referrals",
  },
  collection: {
    general: "General",
    totalRevenue: "Total revenue",
    newTaxReturns: "New tax returns",
    insuranceReferrals: "Insurance referrals",
    friendReferrals: "Friend referrals",
  },
  hr: {
    newCandidates: "New candidates",
    firstInterview: "First interview",
    secondInterview: "Second interview",
    newHires: "New hires",
  },
  businessDevelopment: {
    initialContact: "Initial contact",
    followUps: "Follow-ups",
    setUpMeetings: "Set up meetings",
    signedCompanyContracts: "Signed company contracts",
  },
};

const departmentMetricBindings = {
  newSales: {
    sales: ["newSalesCount", "number"],
    revenue: ["newSalesRevenue", "money"],
    leads: ["newSalesLeads", "number"],
    insuranceReferrals: ["newSalesInsuranceReferrals", "number"],
    friendReferrals: ["newSalesFriendReferrals", "number"],
  },
  newSales2: {
    sales: ["newSales2Count", "number"],
    revenue: ["newSales2Revenue", "money"],
    insuranceReferrals: ["newSales2InsuranceReferrals", "number"],
    friendReferrals: ["newSales2FriendReferrals", "number"],
  },
  renewals: {
    renewals: ["renewalSalesCount", "number"],
    revenue: ["renewalRevenue", "money"],
    insuranceReferrals: ["renewalInsuranceReferrals", "number"],
    friendReferrals: ["renewalFriendReferrals", "number"],
  },
  service: {
    callsReceived: ["serviceIncoming", "number"],
    callsAnswered: ["serviceAnswered", "number"],
    abandonCalls: ["serviceAbandonCalls", "number"],
    answerRate: ["serviceAnswerRate", "percent"],
    missionsOpened: ["serviceMissionsOpened", "number"],
    missionsClosed: ["serviceMissionsClosed", "number"],
    newHumanChats: ["serviceNewHumanChats", "number"],
    closedHumanChats: ["serviceClosedHumanChats", "number"],
    newBotChats: ["serviceNewBotChats", "number"],
    closedBotChats: ["serviceClosedBotChats", "number"],
    insuranceReferrals: ["serviceInsuranceReferrals", "number"],
    friendReferrals: ["serviceFriendReferrals", "number"],
  },
  collection: {
    general: ["collectionGeneral", "money"],
    totalRevenue: ["collectionTotal", "money"],
    newTaxReturns: ["collectionNewTaxReturns", "money"],
    insuranceReferrals: ["collectionInsuranceReferrals", "number"],
    friendReferrals: ["collectionFriendReferrals", "number"],
  },
  hr: {
    newCandidates: ["hrNewCandidates", "number"],
    firstInterview: ["hrFirstInterview", "number"],
    secondInterview: ["hrSecondInterview", "number"],
    newHires: ["hrNewHires", "number"],
  },
  businessDevelopment: {
    initialContact: ["businessInitialContact", "number"],
    followUps: ["businessFollowUps", "number"],
    setUpMeetings: ["businessSetUpMeetings", "number"],
    signedCompanyContracts: ["businessSignedCompanyContracts", "number"],
  },
};

function formatMetricValue(value, type) {
  if (type === "money") return money(value);
  if (type === "percent") return percent(value);
  return String(Number(value) || 0);
}

function normalizeLayout(layout = {}) {
  const next = structuredClone(defaultLayout);
  const summaryKeys = new Set(defaultLayout.topMetrics);
  const topMetrics = Array.isArray(layout.topMetrics)
    ? layout.topMetrics.filter((key) => summaryKeys.has(key))
    : [];
  next.topMetrics = topMetrics.length ? topMetrics : [...defaultLayout.topMetrics];

  const incomingDepartments = layout.departmentMetricOrder || {};
  for (const [department, defaultOrder] of Object.entries(defaultLayout.departmentMetricOrder)) {
    const valid = new Set(defaultOrder);
    const incoming = Array.isArray(incomingDepartments[department])
      ? incomingDepartments[department].filter((key) => valid.has(key))
      : [];
    next.departmentMetricOrder[department] = [
      ...incoming,
      ...defaultOrder.filter((key) => !incoming.includes(key)),
    ];
  }

  return next;
}

function applyDashboardLayout() {
  const selectedSummaryKeys = new Set(dashboardLayout.topMetrics);
  const summaryCards = Array.from(document.querySelectorAll("[data-summary-key]"));
  const cardsByKey = Object.fromEntries(summaryCards.map((card) => [card.dataset.summaryKey, card]));

  for (const card of summaryCards) {
    card.hidden = !selectedSummaryKeys.has(card.dataset.summaryKey);
  }

  for (const key of dashboardLayout.topMetrics) {
    if (cardsByKey[key]) elements.summaryGrid.append(cardsByKey[key]);
  }

  for (const [department, order] of Object.entries(dashboardLayout.departmentMetricOrder)) {
    const card = document.querySelector(`[data-department="${department}"]`);
    const container = card?.querySelector(".mini-metrics");
    if (!container) continue;
    const items = Array.from(container.querySelectorAll("[data-metric-key]"));
    const byKey = Object.fromEntries(items.map((item) => [item.dataset.metricKey, item]));
    for (const key of order) {
      if (byKey[key]) container.append(byKey[key]);
    }
  }
}

function renderWeeklyMetrics() {
  const weeklyMetrics = getMetrics(weeklyDashboardData);
  const range = israelWorkWeekRange(elements.dashboardDate.value || localDateKey());

  for (const [department, order] of Object.entries(dashboardLayout.departmentMetricOrder)) {
    const container = document.querySelector(`[data-weekly-department="${department}"]`);
    if (!container) continue;
    const bindings = departmentMetricBindings[department] || {};
    const labels = departmentMetricLabels[department] || {};
    const chips = order
      .filter((key) => bindings[key])
      .map((key) => {
        const [metricKey, type] = bindings[key];
        return `<span><b>${t(labels[key] || key)}</b><strong>${formatMetricValue(weeklyMetrics[metricKey], type)}</strong></span>`;
      })
      .join("");

    container.innerHTML = `
      <div class="weekly-title">
        <strong>${t("Weekly")}</strong>
        <small>${range.startDate} - ${range.endDate}</small>
      </div>
      <div class="weekly-chip-grid">${chips}</div>
    `;
  }
}

function canEditLayout() {
  return window.matchMedia("(min-width: 621px)").matches;
}

function departmentDisplayName(department) {
  if (department === "newSales") return targets.salesDepartmentOneName;
  if (department === "newSales2") return targets.salesDepartmentTwoName;
  if (department === "renewals") return "Renewal Sales";
  if (department === "service") return "Customer Service";
  if (department === "collection") return "Collection";
  if (department === "hr") return "HR";
  if (department === "businessDevelopment") return "Business Development";
  return department;
}

function makeSortable(list, onChange) {
  let dragged = null;

  list.addEventListener("dragstart", (event) => {
    dragged = event.target.closest("[draggable='true']");
    if (!dragged) return;
    event.dataTransfer.effectAllowed = "move";
    dragged.classList.add("is-dragging");
  });

  list.addEventListener("dragend", () => {
    dragged?.classList.remove("is-dragging");
    dragged = null;
    onChange();
  });

  list.addEventListener("dragover", (event) => {
    event.preventDefault();
    const target = event.target.closest("[draggable='true']");
    if (!dragged || !target || target === dragged || target.parentElement !== list) return;
    const rect = target.getBoundingClientRect();
    const after = event.clientY > rect.top + rect.height / 2;
    list.insertBefore(dragged, after ? target.nextSibling : target);
  });
}

function syncTopLayoutFromControls() {
  dashboardLayout.topMetrics = Array.from(elements.topMetricControls.querySelectorAll("[data-layout-key]"))
    .filter((item) => item.querySelector("input")?.checked)
    .map((item) => item.dataset.layoutKey);
  if (!dashboardLayout.topMetrics.length) dashboardLayout.topMetrics = ["dailyMark"];
  applyDashboardLayout();
}

function syncDepartmentLayoutFromControls(department, list) {
  dashboardLayout.departmentMetricOrder[department] = Array.from(list.querySelectorAll("[data-layout-key]"))
    .map((item) => item.dataset.layoutKey);
  applyDashboardLayout();
  renderWeeklyMetrics();
}

function renderLayoutControls() {
  if (!elements.topMetricControls || !canEditLayout()) return;

  elements.topMetricControls.innerHTML = "";
  const selected = new Set(dashboardLayout.topMetrics);
  const orderedTopKeys = [
    ...dashboardLayout.topMetrics,
    ...defaultLayout.topMetrics.filter((key) => !dashboardLayout.topMetrics.includes(key)),
  ];

  for (const key of orderedTopKeys) {
    const item = document.createElement("label");
    item.className = "layout-item";
    item.draggable = true;
    item.dataset.layoutKey = key;
    item.innerHTML = `
      <input type="checkbox" ${selected.has(key) ? "checked" : ""} />
      <span>${t(summaryMetricLabels[key] || key)}</span>
      <em>drag</em>
    `;
    item.querySelector("input").addEventListener("change", syncTopLayoutFromControls);
    elements.topMetricControls.append(item);
  }
  makeSortable(elements.topMetricControls, syncTopLayoutFromControls);

  elements.departmentLayoutControls.innerHTML = "";
  for (const [department, order] of Object.entries(dashboardLayout.departmentMetricOrder)) {
    const group = document.createElement("section");
    group.className = "layout-department";
    const title = document.createElement("h4");
    title.textContent = t(departmentDisplayName(department));
    const list = document.createElement("div");
    list.className = "layout-list";
    list.dataset.departmentLayout = department;

    const labels = departmentMetricLabels[department] || {};
    for (const key of order) {
      const item = document.createElement("div");
      item.className = "layout-item";
      item.draggable = true;
      item.dataset.layoutKey = key;
      item.innerHTML = `<span>${t(labels[key] || key)}</span><em>drag</em>`;
      list.append(item);
    }

    makeSortable(list, () => syncDepartmentLayoutFromControls(department, list));
    group.append(title, list);
    elements.departmentLayoutControls.append(group);
  }
}

function markerForRatio(ratio) {
  if (ratio >= 1) return { key: "great", label: t("Really good") };
  if (ratio >= 0.75) return { key: "good", label: t("Okay okay") };
  if (ratio >= 0.5) return { key: "okay", label: t("Okay") };
  return { key: "bad", label: t("Bad") };
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
    Math.min(metrics.collectionNewTaxReturns / targets.newTaxReturns, 1.25),
    Math.min(metrics.hrNewHires / targets.hrNewHires, 1.25),
    Math.min(metrics.businessSignedCompanyContracts / targets.businessSignedContracts, 1.25),
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
    newTaxReturns: Number(goals.newTaxReturns) || defaultTargets.newTaxReturns,
    hrNewHires: Number(goals.hrNewHires) || defaultTargets.hrNewHires,
    businessSignedContracts: Number(goals.businessSignedContracts) || defaultTargets.businessSignedContracts,
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
    newTaxReturns: elements.goalNewTaxReturns.value,
    hrNewHires: elements.goalHrNewHires.value,
    businessSignedContracts: elements.goalBusinessSignedContracts.value,
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
  elements.goalNewTaxReturns.value = targets.newTaxReturns;
  elements.goalHrNewHires.value = targets.hrNewHires;
  elements.goalBusinessSignedContracts.value = targets.businessSignedContracts;
}

function renderSalesLabels() {
  const salesOneName = t(targets.salesDepartmentOneName);
  const salesTwoName = t(targets.salesDepartmentTwoName);
  elements.newSalesTitle.textContent = salesOneName;
  elements.newSales2Title.textContent = salesTwoName;
  elements.newSalesFormLink.textContent = `${salesOneName} ${t("form")}`;
  elements.newSales2FormLink.textContent = `${salesTwoName} ${t("form")}`;

  const options = Array.from(elements.deleteDepartment.options);
  const salesOne = options.find((option) => option.value === "newSales");
  const salesTwo = options.find((option) => option.value === "newSales2");
  if (salesOne) salesOne.textContent = salesOneName;
  if (salesTwo) salesTwo.textContent = salesTwoName;
}

function translateStaticDashboardText() {
  document.documentElement.lang = languageKey();
  document.documentElement.dir = languageKey() === "he" ? "rtl" : "ltr";
  document.title = t("Daily performance");
  elements.languageSelect.value = languageKey();

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
        <strong>${t(row.label)}</strong>
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
    [t("Abandon calls"), `${metrics.serviceAbandonCalls}`],
    [t("Missions opened"), `${metrics.serviceMissionsOpened}`],
    [t("Missions closed"), `${metrics.serviceMissionsClosed}`],
    [t("New human chats"), `${metrics.serviceNewHumanChats}`],
    [t("Closed human chats"), `${metrics.serviceClosedHumanChats}`],
    [t("New bot chats"), `${metrics.serviceNewBotChats}`],
    [t("Closed bot chats"), `${metrics.serviceClosedBotChats}`],
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
  elements.totalInsuranceReferrals.textContent = String(metrics.totalInsuranceReferrals);
  elements.totalFriendReferrals.textContent = String(metrics.totalFriendReferrals);
  elements.totalAbandonCalls.textContent = String(metrics.serviceAbandonCalls);
  elements.totalNewTaxReturns.textContent = money(metrics.collectionNewTaxReturns);
  elements.totalNewHires.textContent = String(metrics.hrNewHires);
  elements.totalSignedCompanyContracts.textContent = String(metrics.businessSignedCompanyContracts);

  elements.newSalesCount.textContent = String(metrics.newSalesCount);
  elements.newSalesRevenue.textContent = money(metrics.newSalesRevenue);
  elements.newSalesLeads.textContent = String(metrics.newSalesLeads);
  elements.newSalesInsuranceReferrals.textContent = String(metrics.newSalesInsuranceReferrals);
  elements.newSalesFriendReferrals.textContent = String(metrics.newSalesFriendReferrals);

  elements.newSales2Count.textContent = String(metrics.newSales2Count);
  elements.newSales2Revenue.textContent = money(metrics.newSales2Revenue);
  elements.newSales2InsuranceReferrals.textContent = String(metrics.newSales2InsuranceReferrals);
  elements.newSales2FriendReferrals.textContent = String(metrics.newSales2FriendReferrals);

  elements.renewalSalesCount.textContent = String(metrics.renewalSalesCount);
  elements.renewalRevenue.textContent = money(metrics.renewalRevenue);
  elements.renewalInsuranceReferrals.textContent = String(metrics.renewalInsuranceReferrals);
  elements.renewalFriendReferrals.textContent = String(metrics.renewalFriendReferrals);

  elements.serviceIncoming.textContent = String(metrics.serviceIncoming);
  elements.serviceAnswered.textContent = String(metrics.serviceAnswered);
  elements.serviceAbandonCalls.textContent = String(metrics.serviceAbandonCalls);
  elements.serviceAnswerRate.textContent = percent(metrics.serviceAnswerRate);
  elements.serviceMissionsOpened.textContent = String(metrics.serviceMissionsOpened);
  elements.serviceMissionsClosed.textContent = String(metrics.serviceMissionsClosed);
  elements.serviceNewHumanChats.textContent = String(metrics.serviceNewHumanChats);
  elements.serviceClosedHumanChats.textContent = String(metrics.serviceClosedHumanChats);
  elements.serviceNewBotChats.textContent = String(metrics.serviceNewBotChats);
  elements.serviceClosedBotChats.textContent = String(metrics.serviceClosedBotChats);
  elements.serviceInsuranceReferrals.textContent = String(metrics.serviceInsuranceReferrals);
  elements.serviceFriendReferrals.textContent = String(metrics.serviceFriendReferrals);

  elements.collectionGeneral.textContent = money(metrics.collectionGeneral);
  elements.collectionTotal.textContent = money(metrics.collectionTotal);
  elements.collectionNewTaxReturns.textContent = money(metrics.collectionNewTaxReturns);
  elements.collectionInsuranceReferrals.textContent = String(metrics.collectionInsuranceReferrals);
  elements.collectionFriendReferrals.textContent = String(metrics.collectionFriendReferrals);

  elements.hrNewCandidates.textContent = String(metrics.hrNewCandidates);
  elements.hrFirstInterview.textContent = String(metrics.hrFirstInterview);
  elements.hrSecondInterview.textContent = String(metrics.hrSecondInterview);
  elements.hrNewHires.textContent = String(metrics.hrNewHires);

  elements.businessInitialContact.textContent = String(metrics.businessInitialContact);
  elements.businessFollowUps.textContent = String(metrics.businessFollowUps);
  elements.businessSetUpMeetings.textContent = String(metrics.businessSetUpMeetings);
  elements.businessSignedCompanyContracts.textContent = String(metrics.businessSignedCompanyContracts);

  setStatus(elements.newSalesStatus, metrics.newSalesRevenue, targets.newSalesRevenue);
  setStatus(elements.newSales2Status, metrics.newSales2Revenue, targets.newSales2Revenue);
  setStatus(elements.renewalsStatus, metrics.renewalRevenue, targets.renewalRevenue);
  setStatus(elements.serviceStatus, metrics.serviceAnswerRate, targets.serviceAnswerRate, "percent");
  setStatus(elements.collectionStatus, metrics.collectionTotal, targets.collectionTotal);
  setMarker(elements.hrStatus, targets.hrNewHires ? metrics.hrNewHires / targets.hrNewHires : 0, `${metrics.hrNewHires} / ${targets.hrNewHires}`);
  setMarker(elements.businessDevelopmentStatus, targets.businessSignedContracts ? metrics.businessSignedCompanyContracts / targets.businessSignedContracts : 0, `${metrics.businessSignedCompanyContracts} / ${targets.businessSignedContracts}`);

  elements.revenueTotalLabel.textContent = money(metrics.totalRevenue);
  renderBars([
    { label: targets.salesDepartmentOneName, value: metrics.newSalesRevenue, meta: `${metrics.newSalesCount} ${t("Sales")}` },
    { label: targets.salesDepartmentTwoName, value: metrics.newSales2Revenue, meta: `${metrics.newSales2Count} ${t("Sales")}` },
    { label: "Renewal Sales", value: metrics.renewalRevenue, meta: `${metrics.renewalSalesCount} ${t("Renewals")}` },
    { label: "Collection - General", value: metrics.collectionGeneral, meta: t("General") },
  ]);

  const answerRate = Math.min(metrics.serviceAnswerRate, 100);
  elements.answerRateLabel.textContent = `${metrics.serviceAnswered} of ${metrics.serviceIncoming}`;
  elements.answerRateGauge.style.width = `${answerRate}%`;
  elements.answerRateGaugeText.textContent = percent(answerRate);
  renderRiskList(metrics);
  applyDashboardLayout();
  renderWeeklyMetrics();
}

function normalizeSubmission(submission) {
  if (!submission || typeof submission !== "object") return null;
  const values = submission.values || {};
  const name = submission.name || "Submitted total";

  if (submission.department === "newSales") {
    return { department: submission.department, row: { name, sales: Number(values.sales) || 0, revenue: Number(values.revenue) || 0, leads: Number(values.leads) || 0, insuranceReferrals: value(values, "insuranceReferrals", "referrals"), friendReferrals: value(values, "friendReferrals") } };
  }

  if (submission.department === "newSales2") {
    return { department: submission.department, row: { name, sales: Number(values.sales) || 0, revenue: Number(values.revenue) || 0, insuranceReferrals: value(values, "insuranceReferrals", "referrals"), friendReferrals: value(values, "friendReferrals") } };
  }

  if (submission.department === "renewals") {
    return { department: "renewals", row: { name, renewals: Number(values.renewals) || 0, revenue: Number(values.revenue) || 0, insuranceReferrals: value(values, "insuranceReferrals", "referrals"), friendReferrals: value(values, "friendReferrals") } };
  }

  if (submission.department === "service") {
    const callsReceived = value(values, "callsReceived", "incoming");
    const callsAnswered = value(values, "callsAnswered", "answered");
    return {
      department: "service",
      row: {
        name,
        callsReceived,
        callsAnswered,
        abandonCalls: value(values, "abandonCalls"),
        missionsOpened: value(values, "missionsOpened"),
        missionsClosed: value(values, "missionsClosed"),
        newHumanChats: value(values, "newHumanChats", "newChat"),
        closedHumanChats: value(values, "closedHumanChats", "chatClosed"),
        newBotChats: value(values, "newBotChats"),
        closedBotChats: value(values, "closedBotChats"),
        insuranceReferrals: value(values, "insuranceReferrals", "referrals"),
        friendReferrals: value(values, "friendReferrals"),
      },
    };
  }

  if (submission.department === "collection") {
    return { department: "collection", row: { name, general: Number(values.general) || 0, newTaxReturns: Number(values.newTaxReturns) || 0, insuranceReferrals: value(values, "insuranceReferrals", "referrals"), friendReferrals: value(values, "friendReferrals") } };
  }

  if (submission.department === "hr") {
    return {
      department: "hr",
      row: {
        name,
        newCandidates: value(values, "newCandidates"),
        firstInterview: value(values, "firstInterview"),
        secondInterview: value(values, "secondInterview"),
        newHires: value(values, "newHires"),
      },
    };
  }

  if (submission.department === "businessDevelopment") {
    return {
      department: "businessDevelopment",
      row: {
        name,
        initialContact: value(values, "initialContact"),
        followUps: value(values, "followUps"),
        setUpMeetings: value(values, "setUpMeetings"),
        signedCompanyContracts: value(values, "signedCompanyContracts"),
      },
    };
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

function normalizeSubmissionListInRange(submissions, startDate, endDate) {
  const nextData = structuredClone(emptyData);
  for (const submission of submissions || []) {
    const submissionDate = dateKeyFromValue(submission.date);
    if (startDate && submissionDate < startDate) continue;
    if (endDate && submissionDate > endDate) continue;
    const normalized = normalizeSubmission(submission);
    if (!normalized) continue;
    nextData[normalized.department].push(normalized.row);
  }
  return nextData;
}

function loadJsonpOnce(url, params = {}) {
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

async function loadJsonp(url, params = {}) {
  try {
    return await loadJsonpOnce(url, params);
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    try {
      return await loadJsonpOnce(url, params);
    } catch {
      return loadIframeBackend(url, params);
    }
  }
}

function loadIframeBackend(url, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = `dailyDashboardFrame_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const iframe = document.createElement("iframe");
    const query = new URLSearchParams({
      ...params,
      transport: "iframe",
      requestId,
      _: String(Date.now()),
    });
    const separator = url.includes("?") ? "&" : "?";
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Could not load hosted dashboard data."));
    }, 12000);

    function cleanup() {
      window.clearTimeout(timeout);
      window.removeEventListener("message", handleMessage);
      iframe.remove();
    }

    function handleMessage(event) {
      if (event.source !== iframe.contentWindow) return;
      if (!event.data || event.data.source !== "dailyDashboardBackend" || event.data.requestId !== requestId) return;
      cleanup();
      if (event.data.ok === false) {
        reject(new Error(event.data.message || "Could not load hosted dashboard data."));
        return;
      }
      resolve(event.data.payload);
    }

    window.addEventListener("message", handleMessage);
    iframe.hidden = true;
    iframe.src = `${url}${separator}${query.toString()}`;
    document.body.append(iframe);
  });
}

function backendRequestUrl(url, params = {}) {
  const requestUrl = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") requestUrl.searchParams.set(key, value);
  });
  requestUrl.searchParams.set("_", String(Date.now()));
  return requestUrl.toString();
}

async function loadHostedBackend(url, params = {}) {
  try {
    const response = await fetch(backendRequestUrl(url, params), {
      cache: "no-store",
      credentials: "omit",
      mode: "cors",
    });
    if (!response.ok) throw new Error("Could not load hosted dashboard data.");
    return await response.json();
  } catch {
    return loadJsonp(url, params);
  }
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
  elements.refreshData.textContent = t("Refreshing");

  try {
    const date = elements.dashboardDate.value || await currentServerDate();
    const weekRange = israelWorkWeekRange(date);
    let payload;
    let weeklyPayload;

    if (backendUrl()) {
      [payload, weeklyPayload] = await Promise.all([
        loadHostedBackend(backendUrl(), { date }),
        loadHostedBackend(backendUrl(), weekRange),
      ]);
    } else if (canUseLocalApi()) {
      const response = await fetch(`/api/submissions?date=${encodeURIComponent(date)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Could not load dashboard data.");
      payload = await response.json();
      const weeklyResponse = await fetch(`/api/submissions?startDate=${encodeURIComponent(weekRange.startDate)}&endDate=${encodeURIComponent(weekRange.endDate)}`, { cache: "no-store" });
      weeklyPayload = weeklyResponse.ok ? await weeklyResponse.json() : payload;
    } else {
      if (!backendWarningShown) {
        backendWarningShown = true;
        window.alert("Online backend is not configured. Add the Apps Script web app URL in config.js.");
      }
      payload = { date, submissions: [] };
      weeklyPayload = { submissions: [] };
    }

    targets = normalizeGoals(payload.goals || getLocalGoals());
    dashboardLayout = normalizeLayout(payload.layout || getLocalLayout());
    saveLocalLayout(dashboardLayout);
    renderGoalInputs();
    renderSalesLabels();
    renderLayoutControls();
    dashboardData = normalizeSubmissionList(payload.submissions || [], date);
    weeklyDashboardData = normalizeSubmissionListInRange(weeklyPayload?.submissions || payload.submissions || [], weekRange.startDate, weekRange.endDate);
    elements.dashboardDate.value = dateKeyFromValue(payload.date) || date;
    renderDashboard();
  } catch (error) {
    window.alert(error instanceof Error ? error.message : "Could not load dashboard data.");
  } finally {
    elements.refreshData.disabled = false;
    elements.refreshData.textContent = t("Refresh");
  }
}

async function saveGoals() {
  const goals = readGoalsFromInputs();
  targets = goals;
  saveLocalGoals(goals);
  renderSalesLabels();
  elements.saveGoals.disabled = true;
  elements.goalStatus.textContent = t("Saving");

  try {
    await postBackend({ action: "saveGoals", goals });
    elements.goalStatus.textContent = t("Goals saved");
    renderDashboard();
  } catch (error) {
    elements.goalStatus.textContent = t("Could not save goals");
    window.alert(error instanceof Error ? error.message : "Could not save goals.");
  } finally {
    elements.saveGoals.disabled = false;
  }
}

async function saveLayout() {
  if (!canEditLayout()) {
    window.alert("Layout can only be edited from the desktop dashboard.");
    return;
  }

  dashboardLayout = normalizeLayout(dashboardLayout);
  saveLocalLayout(dashboardLayout);
  elements.saveLayout.disabled = true;
  elements.layoutStatus.textContent = t("Saving");

  try {
    await postBackend({ action: "saveLayout", layout: dashboardLayout });
    elements.layoutStatus.textContent = t("Layout saved");
    applyDashboardLayout();
    renderWeeklyMetrics();
  } catch (error) {
    elements.layoutStatus.textContent = t("Could not save layout");
    window.alert(error instanceof Error ? error.message : "Could not save layout.");
  } finally {
    elements.saveLayout.disabled = false;
  }
}

async function deleteDepartmentData() {
  const department = elements.deleteDepartment.value;
  const date = elements.dashboardDate.value || localDateKey();
  const departmentName = elements.deleteDepartment.selectedOptions[0]?.textContent || department;
  const confirmed = window.confirm(`Delete ${departmentName} data for ${date}?`);
  if (!confirmed) return;

  elements.deleteDepartmentData.disabled = true;
  elements.deleteStatus.textContent = t("Deleting");

  try {
    let result = { deleted: 0 };

    if (backendUrl()) {
      result = await loadJsonp(backendUrl(), { action: "deleteDepartment", date, department });
      if (!result.ok || result.mode !== "deleted") {
        await postBackend({ action: "deleteDepartment", date, department });
        result = { ok: true, mode: "deleted", deleted: null };
      }
    } else {
      result = await postBackend({ action: "deleteDepartment", date, department });
    }

    const deletedCount = Number.isFinite(Number(result.deleted)) ? `${Number(result.deleted)} row(s)` : "selected department data";
    elements.deleteStatus.textContent = `Deleted ${deletedCount}. Refreshing...`;
    await loadDashboardData();
    elements.deleteStatus.textContent = `Deleted ${deletedCount}`;
  } catch (error) {
    elements.deleteStatus.textContent = t("Delete failed");
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
  translateStaticDashboardText();
  targets = normalizeGoals(getLocalGoals());
  renderGoalInputs();
  renderSalesLabels();
  elements.dashboardDate.value = await currentServerDate();
  elements.exportHtml.addEventListener("click", exportHtml);
  elements.refreshData.addEventListener("click", loadDashboardData);
  elements.dashboardDate.addEventListener("change", loadDashboardData);
  elements.saveGoals.addEventListener("click", saveGoals);
  elements.saveLayout.addEventListener("click", saveLayout);
  elements.deleteDepartmentData.addEventListener("click", deleteDepartmentData);
  elements.languageSelect.addEventListener("change", () => {
    localStorage.setItem("dashboardLanguage", elements.languageSelect.value);
    window.location.reload();
  });
  await loadDashboardData();
  setInterval(loadDashboardData, 60000);
}

init();
