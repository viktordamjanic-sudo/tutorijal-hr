import type { APIRoute } from 'astro';
import Database from 'better-sqlite3';
import path from 'path';

// Read headlines from the scraper SQLite database
export const GET: APIRoute = async ({ url }) => {
    const limit = Number(url.searchParams.get('limit') || '6');
    const offset = Number(url.searchParams.get('offset') || '0');

    try {
        const dbPath = path.resolve(process.cwd(), 'scraper', 'headlines.db');
        const db = new Database(dbPath, { readonly: true });

        const rows = db.prepare(`
      SELECT id, portal, title, url, description, published_at, author, scraped_at
      FROM headlines
      WHERE portal = 'jutarnji'
      ORDER BY scraped_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset) as any[];

        const total = (db.prepare(`SELECT COUNT(*) as count FROM headlines WHERE portal = 'jutarnji'`).get() as any).count;

        db.close();

        return new Response(JSON.stringify({
            success: true,
            headlines: rows,
            total,
            limit,
            offset,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Error reading scraper DB:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Failed to read headlines',
            headlines: [],
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
