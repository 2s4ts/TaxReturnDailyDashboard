# GitHub Pages Public Setup

This version does not need a company computer, static IP, router changes, or local server.

## Hosting

Use GitHub Pages for the website:

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save.

GitHub will publish the site at:

```text
https://2s4ts.github.io/TaxReturnDailyDashboard/
```

## Data Backend

GitHub Pages is static hosting, so it cannot save form submissions by itself. Use the included Google Apps Script backend:

1. Create a Google Sheet.
2. Open `Extensions` -> `Apps Script`.
3. Paste the code from `apps-script/Code.gs`.
4. Deploy as a web app.
5. Set access to `Anyone with the link`.
6. Copy the web app URL.
7. Paste it into `config.js`:

```js
window.DASHBOARD_BACKEND_URL = "PASTE_WEB_APP_URL_HERE";
```

## Public Links

After GitHub Pages is enabled:

```text
https://2s4ts.github.io/TaxReturnDailyDashboard/
https://2s4ts.github.io/TaxReturnDailyDashboard/form.html?department=newSales
https://2s4ts.github.io/TaxReturnDailyDashboard/form.html?department=renewals
https://2s4ts.github.io/TaxReturnDailyDashboard/form.html?department=service
https://2s4ts.github.io/TaxReturnDailyDashboard/form.html?department=collection
```

## Fixing Mistakes

If someone submits wrong numbers, they should open the same department form again, use the same date and same name, and submit the corrected numbers.

The Apps Script backend replaces the previous row for the same `date + department + name`, so the dashboard uses the corrected data without manually deleting rows.

## Security

- Visitors receive only static HTML, CSS, and JavaScript from GitHub Pages.
- Browsers do not execute `.bat`, `.ps1`, or server files from the website.
- The Apps Script endpoint accepts dashboard submissions only as plain JSON data.
- No private server credentials are exposed in the browser.
- Because the forms are public, anyone with the link can submit data. That matches the public daily-dashboard requirement, but the sheet should not be used for sensitive personal data.
