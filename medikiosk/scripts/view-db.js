const http = require('http');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'data', 'medikiosk.db');

function openBrowser(url) {
  const platform = process.platform;
  let cmd = '';
  if (platform === 'win32') {
    cmd = `start "" "${url}"`;
  } else if (platform === 'darwin') {
    cmd = `open "${url}"`;
  } else {
    cmd = `xdg-open "${url}"`;
  }
  exec(cmd, (err) => {
    if (err) {
      console.log(`\nCould not open browser automatically. Please open: ${url}`);
    }
  });
}

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/database`, (res) => {
      resolve(res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function getDatabaseData() {
  if (!fs.existsSync(dbPath)) {
    return { tables: [], error: 'Database file not found: ' + dbPath };
  }
  const db = new Database(dbPath, { readonly: true });
  const tableNames = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")
    .all()
    .map((t) => t.name);

  const tables = tableNames.map((name) => {
    const count = db.prepare(`SELECT COUNT(*) as c FROM "${name}"`).get().c;
    const columns = db.prepare(`PRAGMA table_info("${name}")`).all();
    const rows = db.prepare(`SELECT * FROM "${name}" ORDER BY rowid DESC LIMIT 200`).all();
    return { name, count, columns, rows };
  });

  return { tables };
}

function generateStandaloneHtml() {
  const { tables } = getDatabaseData();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MediKiosk SQLite Database Explorer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    header {
      background: #1e293b;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      background: #1e3a8a;
      color: #93c5fd;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 9999px;
      border: 1px solid #2563eb;
    }
    .layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    aside {
      width: 260px;
      background: #131c2e;
      border-right: 1px solid #334155;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .table-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 600;
      font-family: monospace;
      color: #cbd5e1;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s;
    }
    .table-btn:hover {
      background: #1e293b;
      color: #fff;
    }
    .table-btn.active {
      background: #1d4ed8;
      color: #fff;
      border-color: #3b82f6;
    }
    .count {
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 9999px;
      background: #334155;
      color: #94a3b8;
    }
    .table-btn.active .count {
      background: #2563eb;
      color: #fff;
    }
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #0b1120;
    }
    .toolbar {
      padding: 12px 20px;
      background: #131c2e;
      border-bottom: 1px solid #334155;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .search-input {
      padding: 8px 14px;
      border-radius: 8px;
      background: #1e293b;
      border: 1px solid #334155;
      color: #fff;
      font-size: 13px;
      outline: none;
      width: 260px;
    }
    .search-input:focus {
      border-color: #3b82f6;
    }
    .table-wrapper {
      flex: 1;
      overflow: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 12px;
    }
    th {
      background: #1e293b;
      padding: 10px 14px;
      text-align: left;
      font-weight: 700;
      color: #93c5fd;
      border-bottom: 1px solid #334155;
      border-right: 1px solid #1e293b;
      position: sticky;
      top: 0;
      white-space: nowrap;
    }
    td {
      padding: 8px 14px;
      border-bottom: 1px solid #1e293b;
      border-right: 1px solid #1e293b;
      max-width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    tr:hover td {
      background: #1e293b55;
    }
    .null { color: #64748b; font-style: italic; }
    .btn {
      padding: 6px 14px;
      border-radius: 8px;
      background: #1e293b;
      border: 1px solid #475569;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn:hover { background: #334155; }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span style="font-size: 18px; font-weight: 800;">🏥 MediKiosk SQLite Database Explorer</span>
      <span class="badge">SQLite WAL</span>
      <span style="font-size: 12px; color: #94a3b8;">File: data/medikiosk.db</span>
    </div>
    <div>
      <button class="btn" onclick="location.reload()">↻ Refresh</button>
    </div>
  </header>
  <div class="layout">
    <aside id="tableRail"></aside>
    <main>
      <div class="toolbar">
        <div id="queryTitle" style="font-family: monospace; font-size: 13px; font-weight: 700; color: #60a5fa;"></div>
        <input type="text" id="searchBox" class="search-input" placeholder="Filter rows..." oninput="renderTable()" />
      </div>
      <div class="table-wrapper" id="tableContainer"></div>
    </main>
  </div>
  <script>
    const dbData = ${JSON.stringify(tables)};
    let currentTable = dbData[0]?.name || '';

    function init() {
      const rail = document.getElementById('tableRail');
      rail.innerHTML = '<div style="font-size:10px; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:8px;">Tables (' + dbData.length + ')</div>';
      dbData.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'table-btn ' + (t.name === currentTable ? 'active' : '');
        btn.innerHTML = '<span>' + t.name + '</span><span class="count">' + t.count + '</span>';
        btn.onclick = () => {
          currentTable = t.name;
          document.querySelectorAll('.table-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('searchBox').value = '';
          renderTable();
        };
        rail.appendChild(btn);
      });
      renderTable();
    }

    function renderTable() {
      const t = dbData.find(x => x.name === currentTable);
      if (!t) return;
      document.getElementById('queryTitle').innerText = 'SELECT * FROM ' + t.name + ' (' + t.count + ' records)';
      const q = document.getElementById('searchBox').value.toLowerCase().trim();
      const filtered = t.rows.filter(r => {
        if (!q) return true;
        return Object.values(r).some(v => String(v ?? '').toLowerCase().includes(q));
      });

      let html = '<table><thead><tr>';
      t.columns.forEach(c => {
        html += '<th>' + c.name + ' <span style="font-size:10px; opacity:0.6;">(' + c.type + ')</span></th>';
      });
      html += '</tr></thead><tbody>';

      if (filtered.length === 0) {
        html += '<tr><td colspan="' + t.columns.length + '" style="text-align:center; padding:40px; color:#64748b;">No matching rows found</td></tr>';
      } else {
        filtered.forEach(r => {
          html += '<tr>';
          t.columns.forEach(c => {
            const v = r[c.name];
            if (v === null || v === undefined) {
              html += '<td class="null">NULL</td>';
            } else {
              html += '<td title="' + String(v).replace(/"/g, '&quot;') + '">' + String(v) + '</td>';
            }
          });
          html += '</tr>';
        });
      }
      html += '</tbody></table>';
      document.getElementById('tableContainer').innerHTML = html;
    }
    init();
  </script>
</body>
</html>`;
}

async function main() {
  console.log('='.repeat(70));
  console.log('  MEDIKIOSK SQLITE DATABASE EXPLORER');
  console.log('  Database File: ' + dbPath);
  console.log('='.repeat(70));

  // Check if Next.js dev server is running on port 3000
  const isNextRunning = await checkPort(3000);

  if (isNextRunning) {
    const url = 'http://localhost:3000/database';
    console.log('\n\x1b[32m[✓] Active Next.js server detected on port 3000.\x1b[0m');
    console.log(`\x1b[36m[✓] Launching database explorer in browser:\x1b[0m ${url}\n`);
    openBrowser(url);

    // Print summary to terminal
    const { tables } = getDatabaseData();
    console.log('Tables in database:');
    tables.forEach((t) => {
      console.log(`  - ${t.name.padEnd(20)} (${t.count} records)`);
    });
    console.log('\n' + '='.repeat(70));
  } else {
    // Start standalone local server
    const port = 3333;
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(generateStandaloneHtml());
    });

    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(`\n\x1b[32m[✓] Standalone database viewer started on port ${port}.\x1b[0m`);
      console.log(`\x1b[36m[✓] Launching database explorer in browser:\x1b[0m ${url}\n`);
      console.log('Press Ctrl+C in terminal to stop the database viewer.\n');
      openBrowser(url);

      const { tables } = getDatabaseData();
      console.log('Tables in database:');
      tables.forEach((t) => {
        console.log(`  - ${t.name.padEnd(20)} (${t.count} records)`);
      });
      console.log('\n' + '='.repeat(70));
    });
  }
}

main().catch(console.error);
