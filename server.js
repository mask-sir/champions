const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/config", (req, res) => {
  res.json({
    title: process.env.SITE_TITLE || "TEAM CHAMPIONS",
    csvUrl: process.env.CSV_URL || ""
  });
});

app.listen(PORT, () => {
  console.log(`TEAM CHAMPIONS running at http://localhost:${PORT}`);
});
