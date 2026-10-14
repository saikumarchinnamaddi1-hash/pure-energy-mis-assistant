const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf8");

  return parse(content, {
    columns: (headers) => headers.map((h) => h.trim().replace(/^\uFEFF/, "")),
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_column_count: true,
  });
}

function writeReconciliation(rows) {
  const reportPath = path.join(
    __dirname,
    "../reports/reconciliation.csv"
  );

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });

  const escapeCsv = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const lines = [
    ["lead_id", "action", "reason"].join(","),
    ...rows.map((row) =>
      [row.lead_id, row.action, row.reason]
        .map(escapeCsv)
        .join(",")
    ),
  ];

  fs.writeFileSync(reportPath, lines.join("\n") + "\n", "utf8");

  return reportPath;
}

module.exports = { readCsv, writeReconciliation };