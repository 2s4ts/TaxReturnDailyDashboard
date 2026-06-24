function dashboardManagerKey() {
  return String(window.DASHBOARD_MANAGER_KEY || "").trim();
}

function dashboardAccessKey() {
  const params = new URLSearchParams(window.location.search);
  return params.get("key") || sessionStorage.getItem("dashboardManagerKey") || "";
}

const requiredDashboardKey = dashboardManagerKey();
const providedDashboardKey = dashboardAccessKey();

if (requiredDashboardKey && providedDashboardKey !== requiredDashboardKey) {
  window.location.replace("index.html");
} else if (requiredDashboardKey) {
  sessionStorage.setItem("dashboardManagerKey", requiredDashboardKey);
}
