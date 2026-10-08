let csvUrl = SITE_CONFIG.csvUrl;

document.title = SITE_CONFIG.title;
document.getElementById("pageTitle").textContent = SITE_CONFIG.title;
document.getElementById("sidebarTitle").textContent = SITE_CONFIG.title;

function parseCSV(text) {
  const rows = [];
  let row = [], value = "", quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && quoted && n === '"') { value += '"'; i++; continue; }
    if (c === '"') { quoted = !quoted; continue; }
    if (c === "," && !quoted) { row.push(value); value = ""; continue; }
    if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && n === "\n") i++;
      row.push(value); value = "";
      if (row.some(v => v.trim())) rows.push(row);
      row = []; continue;
    }
    value += c;
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  return rows;
}

async function loadData() {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");
  const table = document.getElementById("dataTable");

  loading.classList.remove("hidden");
  error.classList.add("hidden");
  table.classList.add("hidden");

  try {
    if (!csvUrl || csvUrl.includes("YOUR_SHEET_ID")) {
      throw new Error("Set your Google Sheets CSV URL in config.js");
    }

    const separator = csvUrl.includes("?") ? "&" : "?";
    const response = await fetch(`${csvUrl}${separator}_=${Date.now()}`);
    if (!response.ok) throw new Error(`CSV request failed (${response.status})`);

    const rows = parseCSV(await response.text());
    if (!rows.length) throw new Error("No data found in the CSV.");

    renderTable(rows);
    document.getElementById("lastUpdated").textContent =
      `Last fetched: ${new Date().toLocaleString()}`;

    loading.classList.add("hidden");
    table.classList.remove("hidden");
  } catch (err) {
    loading.classList.add("hidden");
    error.textContent = `Unable to load data: ${err.message}`;
    error.classList.remove("hidden");
  }
}

function renderTable(rows) {
  const head = document.getElementById("tableHead");
  const body = document.getElementById("tableBody");
  head.innerHTML = "";
  body.innerHTML = "";

  const headerRow = document.createElement("tr");
  rows[0].forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  head.appendChild(headerRow);

  rows.slice(1).forEach(row => {
    const tr = document.createElement("tr");
    rows[0].forEach((_, i) => {
      const td = document.createElement("td");
      td.textContent = row[i] || "";
      tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}

document.getElementById("refreshBtn").addEventListener("click", loadData);
loadData();
