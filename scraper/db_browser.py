#!/usr/bin/env python3
"""
Jednostavni web preglednik SQLite baze za scrapane naslove.
Ne zahtijeva vanjske ovisnosti - koristi samo stdlib.
Pokretanje: python3 db_browser.py
Otvaranje: http://localhost:8080

Nove značajke:
- Pokretanje scrapera direktno iz preglednika
- Pregled punog teksta u modalu s pretraživanjem
"""

import json
import os
import sqlite3
import subprocess
import sys
import time
import urllib.parse
from http.server import BaseHTTPRequestHandler, HTTPServer

DB_PATH = os.path.join(os.path.dirname(__file__), "headlines.db")
PORT = 8080

# Praćenje aktivnih scrape jobova
SCRAPE_JOBS = {}


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def escape_html(text):
    if text is None:
        return ""
    return (
        str(text)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def nl2br(text):
    return escape_html(text).replace("\n", "<br>")


CSS = """
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: #f5f5f5;
    color: #333;
    line-height: 1.6;
  }
  h1, h2 { color: #222; }
  .stats {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }
  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 16px 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    min-width: 140px;
  }
  .stat-card .number {
    font-size: 28px;
    font-weight: bold;
    color: #1a73e8;
  }
  .stat-card .label {
    color: #666;
    font-size: 14px;
  }
  .filters {
    background: white;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .filters a {
    padding: 6px 14px;
    border-radius: 20px;
    text-decoration: none;
    font-size: 14px;
    background: #e8f0fe;
    color: #1a73e8;
    transition: all 0.2s;
  }
  .filters a:hover, .filters a.active {
    background: #1a73e8;
    color: white;
  }
  table {
    width: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-collapse: collapse;
  }
  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  th {
    background: #fafafa;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    color: #666;
  }
  tr:hover { background: #f8f9fa; }
  .portal-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
  }
  .portal-jutarnji { background: #e3f2fd; color: #1565c0; }
  .portal-vecernji { background: #fce4ec; color: #c62828; }
  .portal-slobodnadalmacija { background: #e8f5e9; color: #2e7d32; }
  .portal-telegram { background: #fff3e0; color: #ef6c00; }
  .portal-default  { background: #f3e5f5; color: #6a1b9a; }
  a.link { color: #1a73e8; text-decoration: none; }
  a.link:hover { text-decoration: underline; }
  .pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
    flex-wrap: wrap;
  }
  .pagination a, .pagination span {
    padding: 8px 14px;
    border-radius: 6px;
    text-decoration: none;
    background: white;
    color: #1a73e8;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .pagination a:hover { background: #e8f0fe; }
  .pagination span.current {
    background: #1a73e8;
    color: white;
  }
  .back-btn {
    display: inline-block;
    margin-bottom: 16px;
    padding: 8px 16px;
    background: #1a73e8;
    color: white;
    text-decoration: none;
    border-radius: 6px;
  }
  .detail-box {
    background: white;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .detail-meta {
    color: #666;
    font-size: 14px;
    margin-bottom: 16px;
  }
  .detail-content {
    font-size: 16px;
    line-height: 1.8;
    color: #444;
  }
  .detail-content p {
    margin: 0 0 12px 0;
  }
  .search-box {
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 14px;
    width: 220px;
  }
  .search-btn {
    padding: 6px 16px;
    background: #1a73e8;
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
  }
  .scrape-section {
    background: white;
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .scrape-section h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #333;
  }
  .scrape-btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .scrape-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: white;
    background: #34a853;
    transition: background 0.2s;
    text-decoration: none;
    display: inline-block;
  }
  .scrape-btn:hover { background: #2e8b47; }
  .scrape-btn.all { background: #1a73e8; }
  .scrape-btn.all:hover { background: #1557b0; }
  .notification {
    background: #e8f0fe;
    border-left: 4px solid #1a73e8;
    padding: 12px 16px;
    margin-bottom: 20px;
    border-radius: 4px;
    color: #1557b0;
    font-size: 14px;
  }
  .notification.error {
    background: #fce8e8;
    border-left-color: #c62828;
    color: #c62828;
  }
  .notification.success {
    background: #e8f5e9;
    border-left-color: #2e7d32;
    color: #2e7d32;
  }
  .text-btn {
    font-size: 12px;
    color: #666;
    text-decoration: none;
    margin-left: 8px;
    cursor: pointer;
    white-space: nowrap;
  }
  .text-btn:hover { color: #1a73e8; text-decoration: underline; }

  /* Modal */
  .modal-overlay {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    z-index: 1000;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    animation: modalIn 0.2s ease-out;
  }
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(20px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .modal-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #222;
    line-height: 1.3;
  }
  .modal-close {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #666;
    line-height: 1;
    padding: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  .modal-close:hover { color: #222; background: #f5f5f5; }
  .modal-body {
    padding: 24px;
    overflow-y: auto;
    font-size: 15px;
    line-height: 1.8;
    color: #444;
  }
  .modal-body p { margin: 0 0 14px 0; }
  .modal-search {
    padding: 12px 24px;
    border-bottom: 1px solid #eee;
    background: #fafafa;
  }
  .modal-search input {
    width: 100%;
    padding: 8px 14px;
    border: 1px solid #ddd;
    border-radius: 20px;
    font-size: 14px;
    outline: none;
  }
  .modal-search input:focus { border-color: #1a73e8; }
  .highlight {
    background: #ffeb3b;
    padding: 1px 2px;
    border-radius: 2px;
  }
  .word-count {
    font-size: 12px;
    color: #888;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }
</style>
"""

MODAL_HTML = """
<div class="modal-overlay" id="modal-overlay" onclick="if(event.target===this)closeModal()">
  <div class="modal-content">
    <div class="modal-header">
      <h2 id="modal-title">Pregled teksta</h2>
      <button class="modal-close" onclick="closeModal()">&times;</button>
    </div>
    <div class="modal-search">
      <input type="text" id="modal-search" placeholder="Pretraži unutar teksta..." oninput="searchInModal(this.value)">
    </div>
    <div class="modal-body" id="modal-body">
    </div>
  </div>
</div>
<script>
let currentArticleId = null;

async function showText(id) {
    currentArticleId = id;
    const overlay = document.getElementById('modal-overlay');
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    const searchInput = document.getElementById('modal-search');
    overlay.style.display = 'flex';
    body.innerHTML = '<p>Učitavanje...</p>';
    searchInput.value = '';
    try {
        const res = await fetch('/text/' + id);
        if (!res.ok) throw new Error('Greška pri učitavanju');
        const data = await res.json();
        title.textContent = data.title || 'Bez naslova';
        body.innerHTML = (data.html || '<em>(nema teksta)</em>') +
            '<div class="word-count">Ukupno znakova: ' + (data.text ? data.text.length : 0) + '</div>';
        body.originalHTML = body.innerHTML;
    } catch (e) {
        body.innerHTML = '<p style="color:#c62828;">Greška: ' + e.message + '</p>';
        body.originalHTML = body.innerHTML;
    }
}
function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById('modal-search').value = '';
    currentArticleId = null;
}
function searchInModal(query) {
    const body = document.getElementById('modal-body');
    if (!body.originalHTML) body.originalHTML = body.innerHTML;
    if (!query) {
        body.innerHTML = body.originalHTML;
        return;
    }
    const html = body.originalHTML;
    // Remove existing highlights first
    const cleanHtml = html.replace(/<span class="highlight">(.*?)<\/span>/gi, '$1');
    const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&') + ')', 'gi');
    body.innerHTML = cleanHtml.replace(re, '<span class="highlight">$1</span>');
}
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});
</script>
"""


def render_list(
    conn, portal=None, page=1, per_page=20, search="", msg="", msg_type="info"
):
    cursor = conn.cursor()

    # Stats
    total = cursor.execute("SELECT COUNT(*) FROM headlines").fetchone()[0]
    unsent = cursor.execute(
        "SELECT COUNT(*) FROM headlines WHERE sent_to_api = 0"
    ).fetchone()[0]
    sent = cursor.execute(
        "SELECT COUNT(*) FROM headlines WHERE sent_to_api = 1"
    ).fetchone()[0]

    portals = cursor.execute(
        "SELECT portal, COUNT(*) as c FROM headlines GROUP BY portal ORDER BY c DESC"
    ).fetchall()

    # Build query
    where_clauses = []
    params = []
    if portal:
        where_clauses.append("portal = ?")
        params.append(portal)
    if search:
        where_clauses.append("(title LIKE ? OR description LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%"])

    where_sql = "WHERE " + " AND ".join(where_clauses) if where_clauses else ""

    count_sql = f"SELECT COUNT(*) FROM headlines {where_sql}"
    filtered_total = cursor.execute(count_sql, params).fetchone()[0]

    offset = (page - 1) * per_page
    rows = cursor.execute(
        f"""SELECT id, portal, title, url, description, published_at, scraped_at, sent_to_api
           FROM headlines {where_sql}
           ORDER BY scraped_at DESC LIMIT ? OFFSET ?""",
        params + [per_page, offset],
    ).fetchall()

    total_pages = (filtered_total + per_page - 1) // per_page

    html = f"<!DOCTYPE html><html><head><meta charset='utf-8'><title>Scraper Baza</title>{CSS}</head><body>"
    html += "<h1>📰 Scraper Baza</h1>"

    # Stats
    html += '<div class="stats">'
    html += f'<div class="stat-card"><div class="number">{total}</div><div class="label">Ukupno zapisa</div></div>'
    html += f'<div class="stat-card"><div class="number">{unsent}</div><div class="label">Ne poslano</div></div>'
    html += f'<div class="stat-card"><div class="number">{sent}</div><div class="label">Poslano</div></div>'
    html += "</div>"

    # Notification
    if msg:
        html += f'<div class="notification {escape_html(msg_type)}">{escape_html(msg)}</div>'

    # Scraper buttons
    supported = ["jutarnji", "vecernji", "slobodnadalmacija", "telegram"]
    html += '<div class="scrape-section">'
    html += "<h3>🚀 Pokreni scraper</h3>"
    html += '<div class="scrape-btns">'
    for p in supported:
        html += f'<a class="scrape-btn" href="/scrape?portal={p}&redirect=1" onclick="this.style.opacity=0.6;this.textContent=\'Scrapanje...\';">{p}</a>'
    html += '<a class="scrape-btn all" href="/scrape?portal=all&redirect=1" onclick="this.style.opacity=0.6;this.textContent=\'Scrapanje...\';">Scrape SVE</a>'
    html += "</div></div>"

    # Filters
    html += '<div class="filters">'
    active_all = "active" if not portal else ""
    html += f'<a href="/?page=1" class="{active_all}">Sve ({total})</a>'
    for p, c in portals:
        active = "active" if portal == p else ""
        html += f'<a href="/?portal={p}&page=1" class="portal-badge portal-{p} {active}">{p} ({c})</a>'
    html += '<form method="GET" style="display:flex;gap:8px;margin-left:auto;">'
    if portal:
        html += f'<input type="hidden" name="portal" value="{escape_html(portal)}">'
    html += f'<input type="text" name="search" class="search-box" placeholder="Pretraži naslove..." value="{escape_html(search)}">'
    html += '<button type="submit" class="search-btn">Traži</button>'
    html += "</form>"
    html += "</div>"

    # Table
    html += "<table><thead><tr><th>ID</th><th>Portal</th><th>Naslov</th><th>Objavljeno</th><th>Scrapano</th><th>Status</th></tr></thead><tbody>"
    for row in rows:
        portal_cls = (
            f"portal-{row['portal']}"
            if row["portal"]
            in ("jutarnji", "vecernji", "slobodnadalmacija", "telegram")
            else "portal-default"
        )
        status = "✅ Poslano" if row["sent_to_api"] else "⏳ Čeka"
        desc_preview = (row["description"] or "")[:200].replace("\n", " ")
        if len(row["description"] or "") > 200:
            desc_preview += "..."
        html += f"""<tr>
            <td>{row["id"]}</td>
            <td><span class="portal-badge {portal_cls}">{row["portal"]}</span></td>
            <td>
              <a class="link" href="/article/{row["id"]}">{escape_html(row["title"])}</a>
              <span class="text-btn" onclick="showText({row["id"]})">📄 Prikaži tekst</span>
              <div style="font-size:13px;color:#666;margin-top:4px;">{escape_html(desc_preview)}</div>
            </td>
            <td>{escape_html(row["published_at"] or "-")}</td>
            <td>{escape_html(row["scraped_at"][:16] if row["scraped_at"] else "-")}</td>
            <td>{status}</td>
        </tr>"""
    html += "</tbody></table>"

    # Pagination
    if total_pages > 1:
        html += '<div class="pagination">'
        if page > 1:
            qs = build_qs(portal=portal, page=page - 1, search=search)
            html += f'<a href="/?{qs}">← Prethodna</a>'
        start_page = max(1, page - 2)
        end_page = min(total_pages, page + 2)
        if start_page > 1:
            html += (
                f'<a href="/?{build_qs(portal=portal, page=1, search=search)}">1</a>'
            )
            if start_page > 2:
                html += "<span>...</span>"
        for p in range(start_page, end_page + 1):
            if p == page:
                html += f'<span class="current">{p}</span>'
            else:
                html += f'<a href="/?{build_qs(portal=portal, page=p, search=search)}">{p}</a>'
        if end_page < total_pages:
            if end_page < total_pages - 1:
                html += "<span>...</span>"
            html += f'<a href="/?{build_qs(portal=portal, page=total_pages, search=search)}">{total_pages}</a>'
        if page < total_pages:
            html += f'<a href="/?{build_qs(portal=portal, page=page + 1, search=search)}">Sljedeća →</a>'
        html += "</div>"

    html += MODAL_HTML
    html += "</body></html>"
    return html


def build_qs(portal=None, page=1, search=""):
    parts = []
    if portal:
        parts.append(f"portal={urllib.parse.quote(portal)}")
    if page > 1:
        parts.append(f"page={page}")
    if search:
        parts.append(f"search={urllib.parse.quote(search)}")
    return "&".join(parts) if parts else ""


def render_detail(conn, article_id):
    cursor = conn.cursor()
    row = cursor.execute(
        "SELECT * FROM headlines WHERE id = ?", (article_id,)
    ).fetchone()
    if not row:
        return "<h1>Članak nije pronađen</h1><a href='/'>← Natrag</a>"

    portal_cls = (
        f"portal-{row['portal']}"
        if row["portal"] in ("jutarnji", "vecernji", "slobodnadalmacija", "telegram")
        else "portal-default"
    )
    status = "✅ Poslano" if row["sent_to_api"] else "⏳ Čeka slanje"
    content = row["description"] or "<em>(nema sadržaja)</em>"

    paragraphs = content.split("\n\n")
    content_html = ""
    for p in paragraphs:
        p = p.strip()
        if p:
            content_html += f"<p>{nl2br(p)}</p>\n"

    html = f"""<!DOCTYPE html><html><head><meta charset='utf-8'><title>{escape_html(row["title"])}</title>{CSS}</head><body>
    <a href="/" class="back-btn">← Natrag na listu</a>
    <div class="detail-box">
      <h1>{escape_html(row["title"])}</h1>
      <div class="detail-meta">
        <span class="portal-badge {portal_cls}">{row["portal"]}</span> &nbsp;|&nbsp;
        <strong>Status:</strong> {status} &nbsp;|&nbsp;
        <strong>Objavljeno:</strong> {escape_html(row["published_at"] or "-")} &nbsp;|&nbsp;
        <strong>Scrapano:</strong> {escape_html(row["scraped_at"][:16] if row["scraped_at"] else "-")} &nbsp;|&nbsp;
        <strong>Autor:</strong> {escape_html(row["author"] or "-")}
      </div>
      <div class="detail-content">
        {content_html}
      </div>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;">
      <div style="font-size: 14px;">
        <strong>Originalni link:</strong> <a class="link" href="{escape_html(row["url"])}" target="_blank">{escape_html(row["url"])}</a>
      </div>
    </div>
    </body></html>"""
    return html


def start_scraper(portal, fetch_content=False):
    """Pokreni scraper u pozadini i vrati job ID."""
    script_dir = os.path.dirname(__file__)
    cmd = [sys.executable, os.path.join(script_dir, "main.py")]

    if portal != "all":
        cmd.append(f"--portal={portal}")
    if fetch_content:
        cmd.append("--content")

    proc = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )
    job_id = f"{portal}_{int(time.time() * 1000)}"
    SCRAPE_JOBS[job_id] = {
        "portal": portal,
        "proc": proc,
        "started": time.time(),
    }

    # Cleanup old jobs
    stale = [k for k, v in SCRAPE_JOBS.items() if time.time() - v["started"] > 3600]
    for k in stale:
        del SCRAPE_JOBS[k]

    return job_id


def get_job_status(job_id):
    """Dohvati status scrape joba."""
    job = SCRAPE_JOBS.get(job_id)
    if not job:
        return None
    proc = job["proc"]
    retcode = proc.poll()
    if retcode is None:
        return {"status": "running", "portal": job["portal"], "started": job["started"]}
    elif retcode == 0:
        stdout, _ = proc.communicate()
        return {"status": "done", "portal": job["portal"], "output": stdout[-1000:]}
    else:
        stdout, _ = proc.communicate()
        return {
            "status": "error",
            "portal": job["portal"],
            "code": retcode,
            "output": stdout[-1000:],
        }


class Handler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

    def send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

    def redirect_with_msg(self, path, msg, msg_type="info"):
        sep = "&" if "?" in path else "?"
        self.send_response(302)
        self.send_header(
            "Location", f"{path}{sep}msg={urllib.parse.quote(msg)}&msg_type={msg_type}"
        )
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        qs = urllib.parse.parse_qs(parsed.query)

        conn = get_db()

        try:
            if parsed.path == "/":
                portal = qs.get("portal", [None])[0]
                page = int(qs.get("page", ["1"])[0])
                search = qs.get("search", [""])[0]
                msg = qs.get("msg", [""])[0]
                msg_type = qs.get("msg_type", ["info"])[0]
                body = render_list(
                    conn,
                    portal=portal,
                    page=page,
                    search=search,
                    msg=msg,
                    msg_type=msg_type,
                )
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(body.encode("utf-8"))

            elif parsed.path.startswith("/article/"):
                try:
                    article_id = int(parsed.path.split("/")[2])
                except (IndexError, ValueError):
                    self.send_response(404)
                    self.end_headers()
                    return
                body = render_detail(conn, article_id)
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.end_headers()
                self.wfile.write(body.encode("utf-8"))

            elif parsed.path.startswith("/text/"):
                try:
                    article_id = int(parsed.path.split("/")[2])
                except (IndexError, ValueError):
                    self.send_json({"error": "Invalid ID"}, 400)
                    return
                cursor = conn.cursor()
                row = cursor.execute(
                    "SELECT title, description FROM headlines WHERE id = ?",
                    (article_id,),
                ).fetchone()
                if not row:
                    self.send_json({"error": "Not found"}, 404)
                    return

                text = row["description"] or ""
                paragraphs = text.split("\n\n")
                html_parts = []
                for p in paragraphs:
                    p = p.strip()
                    if p:
                        html_parts.append(f"<p>{nl2br(p)}</p>")
                html_content = (
                    "\n".join(html_parts) if html_parts else "<em>(nema teksta)</em>"
                )

                self.send_json(
                    {
                        "id": article_id,
                        "title": row["title"],
                        "text": text,
                        "html": html_content,
                    }
                )

            elif parsed.path == "/scrape":
                portal = qs.get("portal", [""])[0]
                redirect = qs.get("redirect", ["0"])[0] == "1"
                fetch_content = qs.get("content", ["0"])[0] == "1"

                if not portal:
                    if redirect:
                        self.redirect_with_msg("/", "Nije odabran portal", "error")
                    else:
                        self.send_json({"error": "Missing portal"}, 400)
                    return

                job_id = start_scraper(portal, fetch_content=fetch_content)

                if redirect:
                    self.redirect_with_msg(
                        "/", f"Scraper '{portal}' pokrenut", "success"
                    )
                else:
                    self.send_json(
                        {
                            "job_id": job_id,
                            "portal": portal,
                            "status": "started",
                        }
                    )

            elif parsed.path == "/scrape/status":
                job_id = qs.get("job", [""])[0]
                if job_id:
                    status = get_job_status(job_id)
                    if status:
                        self.send_json(status)
                    else:
                        self.send_json({"error": "Job not found"}, 404)
                else:
                    active = {}
                    for k, v in SCRAPE_JOBS.items():
                        proc = v["proc"]
                        is_running = proc.poll() is None
                        active[k] = {
                            "portal": v["portal"],
                            "status": "running" if is_running else "finished",
                            "started": v["started"],
                        }
                    self.send_json(active)

            else:
                self.send_response(404)
                self.end_headers()
        finally:
            conn.close()


def main():
    server = HTTPServer(("", PORT), Handler)
    print(f"=" * 50)
    print(f"🌐 Preglednik baze pokrenut!")
    print(f"   URL: http://localhost:{PORT}")
    print(f"   Baza: {DB_PATH}")
    print(f"   Zaustavi: Ctrl+C")
    print(f"=" * 50)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n⛔ Server zaustavljen.")


if __name__ == "__main__":
    main()
