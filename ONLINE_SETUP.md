# Online Setup

This makes the department forms work from any computer or phone.

## One-Time Google Setup

1. Open Google Sheets.
2. Create a blank spreadsheet named:
   `Tax Return Daily Dashboard Submissions`
3. In the spreadsheet, click:
   `Extensions` -> `Apps Script`
4. Delete the starter code.
5. Paste the full code from:
   `apps-script/Code.gs`
6. Click `Save`.
7. Click `Deploy` -> `New deployment`.
8. Click the gear icon and choose:
   `Web app`
9. Set:
   - Description: `Daily dashboard submissions`
   - Execute as: `Me`
   - Who has access: `Anyone with the link`
10. Click `Deploy`.
11. Copy the `Web app URL`.

## Add The Backend URL

Open `config.js` and paste the URL:

```js
window.DASHBOARD_BACKEND_URL = "PASTE_WEB_APP_URL_HERE";
```

## Department Links After Hosting

When this project is hosted, each department gets a normal web link:

```text
https://YOUR_SITE/form.html?department=newSales
https://YOUR_SITE/form.html?department=renewals
https://YOUR_SITE/form.html?department=service
https://YOUR_SITE/form.html?department=collection
```

## Dashboard Workflow

1. Department heads submit their daily numbers.
2. Management opens the dashboard.
3. Management selects the dashboard date.
4. Management clicks `Load online data`.
5. Management exports the locked HTML result.
