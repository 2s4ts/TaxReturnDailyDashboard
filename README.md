# Tax Return Daily Dashboard

Public daily dashboard for tax-return operations.

## Recommended Deployment

Use GitHub Pages:

```text
https://2s4ts.github.io/TaxReturnDailyDashboard/
```

Setup instructions are in `GITHUB_PAGES_SETUP.md`.

## Why GitHub Pages

- Free public HTTPS website hosting.
- No company computer has to stay open.
- No static IP, router, firewall, tunnel, or administrator network setup.
- Users open normal public links from desktop or mobile.

## Data Storage

GitHub Pages is static hosting. It cannot save form submissions by itself.

This project uses the included Google Apps Script backend with Google Sheets for free daily submission storage. Put the Apps Script web app URL in `config.js`:

```js
window.DASHBOARD_BACKEND_URL = "PASTE_WEB_APP_URL_HERE";
```

## Department Links

```text
https://2s4ts.github.io/TaxReturnDailyDashboard/form.html?department=newSales
https://2s4ts.github.io/TaxReturnDailyDashboard/form.html?department=renewals
https://2s4ts.github.io/TaxReturnDailyDashboard/form.html?department=service
https://2s4ts.github.io/TaxReturnDailyDashboard/form.html?department=collection
```

## Security Notes

- The public site is static HTML/CSS/JavaScript, served over HTTPS by GitHub Pages.
- A website visitor cannot run `.bat`, `.ps1`, or local server files on their computer just by opening the page.
- Do not put passwords, API secrets, or sensitive personal data in the public files.
- Forms are public by design, so anyone with a link can submit daily numbers.
