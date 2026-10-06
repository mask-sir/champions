# TEAM CHAMPIONS

A simple Vivo Team data portal that reads live data from a Google Sheets CSV export.

## Setup

1. Install Node.js.
2. Copy `.env.example` to `.env`.
3. Edit `.env`:

```env
SITE_TITLE=TEAM CHAMPIONS
CSV_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
```

4. Install dependencies:

```bash
npm install
```

5. Start locally:

```bash
npm start
```

6. Open http://localhost:3000

## Google Sheets

Make the Google Sheet available for CSV export and use:

`https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv`

The website fetches the CSV when it loads and includes a cache-buster so the Refresh button requests fresh data.

## Future expansion

The sidebar is prepared for VBA Details and additional sections. More dashboards, filters, rankings, authentication, and Vivo-specific branding can be added later.
