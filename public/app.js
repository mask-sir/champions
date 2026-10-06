let csvUrl = "";

async function loadConfig() {
  const response = await fetch("/config");
  const config = await response.json();

  csvUrl = config.csvUrl;
  document.title = config.title;
  document.getElementById("pageTitle").textContent = config.title;
  document.getElementById("sidebarTitle").textContent = config.title;

  loadData();
}

function parseCSV(text) {
  const rows = [];
  let row = [], value = "", insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i], next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"'; i++; continue;
    }
    if (char === '"') { insideQuotes = !insideQuotes; continue; }

    if (char === "," && !insideQuotes) {
      row.push(value); value = ""; continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(value); value = "";
      if (row.some(cell => cell.trim() !== "")) rows.push(row);
      row = []; continue;
    }

    value += char;
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
    if (!csvUrl) throw new Error("CSV_URL is not configured.");

    const response = await fetch(
      `${csvUrl}${csvUrl.includes("?") ? "&" : "?"}_=${Date.now()}`
    );

    if (!response.ok) throw new Error("CSV request failed.");

    const rows = parseCSV(await response.text());
    if (!rows.length) throw new Error("No data found.");

    renderTable(rows);

    document.getElementById("lastUpdated").textContent =
      `Last fetched: ${new Date().toLocaleString()}`;

    loading.classList.add("hidden");
    table.classList.remove("hidden");
  } catch (err) {
    console.error(err);
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

  const headers = rows[0];
  const headerRow = document.createElement("tr");

  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  head.appendChild(headerRow);

  rows.slice(1).forEach(row => {
    const tr = document.createElement("tr");

    headers.forEach((_, index) => {
      const td = document.createElement("td");
      td.textContent = row[index] || "";
      tr.appendChild(td);
    });

    body.appendChild(tr);
  });
}

document.getElementById("refreshBtn").addEventListener("click", loadData);
loadConfig();
