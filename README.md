# TEAM CHAMPIONS — GitHub Pages

Static version for:

https://mask-sir.github.io/champions/

## Configure the Google Sheet

Edit `config.js`:

```js
const SITE_CONFIG = {
  title: "TEAM CHAMPIONS",
  csvUrl: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv"
};
```

The sheet must be publicly accessible for CSV export.

## GitHub Pages

Push these files to the `main` branch and configure GitHub Pages:

Settings → Pages → Deploy from a branch → `main` → `/ (root)`.

The site will be available at:

https://mask-sir.github.io/champions/

## Local preview

Node.js installed:

```bash
npm start
```

Then open:

http://localhost:3000

No Express server or `.env` is required for GitHub Pages. `config.js` is intentionally public because the CSV URL is consumed by the browser.
