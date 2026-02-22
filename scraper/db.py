import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), "headlines.db")

conn = sqlite3.connect(db_path, check_same_thread=False)
conn.row_factory = sqlite3.Row

# Create table
conn.execute("""
  CREATE TABLE IF NOT EXISTS headlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    portal TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    description TEXT,
    published_at TEXT,
    author TEXT,
    scraped_at TEXT DEFAULT CURRENT_TIMESTAMP,
    sent_to_api BOOLEAN DEFAULT 0
  )
""")

# Migration: add description column if it doesn't exist
try:
    conn.execute("ALTER TABLE headlines ADD COLUMN description TEXT")
    conn.commit()
    print("[DB] Migration applied: added 'description' column")
except sqlite3.OperationalError:
    # Column already exists
    pass

# Migration: add last_article_time column to scrape_state
try:
    conn.execute("ALTER TABLE scrape_state ADD COLUMN last_article_time TEXT")
    conn.commit()
    print("[DB] Migration applied: added 'last_article_time' column")
except sqlite3.OperationalError:
    # Column already exists
    pass

# Create scrape_state table for tracking last seen ID and time
conn.execute("""
    CREATE TABLE IF NOT EXISTS scrape_state (
        portal TEXT PRIMARY KEY,
        last_article_id TEXT,
        last_article_time TEXT,
        scraped_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
""")
conn.commit()


def get_last_article_id(portal):
    """Dohvati zadnji viđeni article ID za portal."""
    row = conn.execute(
        "SELECT last_article_id FROM scrape_state WHERE portal = ?",
        (portal,)
    ).fetchone()
    return row["last_article_id"] if row else None


def get_last_article_time(portal):
    """Dohvati zadnje viđeno vrijeme objave za portal."""
    row = conn.execute(
        "SELECT last_article_time FROM scrape_state WHERE portal = ?",
        (portal,)
    ).fetchone()
    return row["last_article_time"] if row else None


def set_last_article_id(portal, article_id):
    """Spremi zadnji viđeni article ID."""
    from datetime import datetime
    conn.execute(
        """INSERT OR REPLACE INTO scrape_state (portal, last_article_id, scraped_at)
           VALUES (?, ?, ?)""",
        (portal, article_id, datetime.now().isoformat())
    )
    conn.commit()


def set_last_article_time(portal, article_time):
    """Spremi zadnje viđeno vrijeme objave."""
    from datetime import datetime
    conn.execute(
        """INSERT OR REPLACE INTO scrape_state (portal, last_article_time, scraped_at)
           VALUES (?, ?, ?)""",
        (portal, article_time, datetime.now().isoformat())
    )
    conn.commit()


def save_headlines(headlines):
    """
    Spremi naslove u bazu. Vraća broj novih naslova.
    Koristi 'content' ako postoji, inače 'description'.
    """
    from datetime import datetime
    cursor = conn.cursor()
    new_count = 0
    now = datetime.now().isoformat()
    
    for h in headlines:
        # Koristi content (puni tekst) ako postoji, inače description
        content = h.get("content") or h.get("description") or ""
        
        cursor.execute(
            """
            INSERT OR IGNORE INTO headlines (portal, title, url, published_at, author, description, scraped_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (h["portal"], h["title"], h["url"], h.get("published_at"), h.get("author"), content, now),
        )
        if cursor.rowcount > 0:
            new_count += 1
    
    conn.commit()
    print(f"Saved {new_count} new headlines ({len(headlines) - new_count} duplicates skipped)")
    return new_count


def get_unsent_headlines():
    cursor = conn.execute("SELECT * FROM headlines WHERE sent_to_api = 0")
    return [dict(row) for row in cursor.fetchall()]


def mark_sent(headlines):
    urls = [h["url"] for h in headlines]
    placeholders = ",".join("?" for _ in urls)
    conn.execute(
        f"UPDATE headlines SET sent_to_api=1 WHERE url IN ({placeholders})", urls
    )
    conn.commit()


def get_stats():
    """Dohvati statistiku iz baze."""
    cursor = conn.cursor()
    
    total = cursor.execute("SELECT COUNT(*) FROM headlines").fetchone()[0]
    unsent = cursor.execute("SELECT COUNT(*) FROM headlines WHERE sent_to_api = 0").fetchone()[0]
    sent = cursor.execute("SELECT COUNT(*) FROM headlines WHERE sent_to_api = 1").fetchone()[0]
    
    by_portal = cursor.execute(
        "SELECT portal, COUNT(*) as count FROM headlines GROUP BY portal"
    ).fetchall()
    
    return {
        "total": total,
        "unsent": unsent,
        "sent": sent,
        "by_portal": {row["portal"]: row["count"] for row in by_portal}
    }


if __name__ == "__main__":
    stats = get_stats()
    print(f"Database stats: {stats}")
