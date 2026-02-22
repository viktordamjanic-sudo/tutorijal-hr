#!/usr/bin/env python3
"""
Glavni pokretač scrapera s podrškom za batch processing i API slanje.
"""

import json
import os
import sys
from datetime import datetime, timezone

from scraper import scrape_portal, get_supported_portals
from config import (
    PORTALS, BEARER_TOKEN, API_URL,
    FILTER_MODE, EXCLUDE_PATTERNS, ALLOW_PATTERNS,
    ACTIVE_FILTER_SETS, VECERNJI_EXCLUDE_PATTERNS
)
from content_filter import ContentFilter, create_filter_from_names
import db


def create_content_filter(portal: str = None):
    """
    Kreiraj content filter prema konfiguraciji.
    
    Args:
        portal: Portal name for portal-specific filters
        
    Returns:
        ContentFilter instance ili None
    """
    if FILTER_MODE == "none":
        return None
    
    cf = ContentFilter()
    
    # Dodaj predefinirane filter setove
    if ACTIVE_FILTER_SETS:
        cf = create_filter_from_names(ACTIVE_FILTER_SETS)
    
    # Dodaj ručno definirane patterne (portal-specific)
    if portal == "vecernji":
        # Use Vecernji-specific filters
        cf.add_rules_from_config(VECERNJI_EXCLUDE_PATTERNS)
    elif FILTER_MODE == "blacklist":
        cf.add_rules_from_config(EXCLUDE_PATTERNS)
    elif FILTER_MODE == "whitelist":
        cf.add_rules_from_config(ALLOW_PATTERNS)
    
    return cf


def main():
    """Glavna funkcija za pokretanje scrapera."""
    
    # Provjeri argumente
    fetch_content = "--content" in sys.argv or "-c" in sys.argv
    dry_run = "--dry-run" in sys.argv
    
    # Specifični portal (opcionalno)
    specific_portal = None
    for arg in sys.argv:
        if arg.startswith("--portal="):
            specific_portal = arg.split("=")[1].strip()
    
    print("=" * 70)
    print(f"🗞️  NOVINA SCRAPER - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    print(f"\n📰 Supported portals: {', '.join(get_supported_portals())}")
    
    # [DISABLED] robots.txt check
    pass
    
    # Scrape svaki portal
    total_scraped = 0
    
    portals_to_scrape = [specific_portal] if specific_portal else PORTALS.keys()
    
    for portal_slug in portals_to_scrape:
        if portal_slug not in PORTALS:
            print(f"❌ Unknown portal: {portal_slug}")
            continue
        
        portal_config = PORTALS[portal_slug]
        
        # Skip disabled portals
        if not portal_config.get("enabled", True):
            print(f"⏭️  Skipping disabled portal: {portal_slug}")
            continue
        
        print(f"\n🔍 Scraping portal: {portal_slug} ({portal_config.get('name', portal_slug)})")
        print("-" * 50)
        
        # Kreiraj content filter za ovaj portal
        content_filter = create_content_filter(portal_slug)
        if content_filter:
            print(f"🔄 Filter mode: {FILTER_MODE} | Rules: {len(content_filter.rules)}")
        
        try:
            # Use portal-specific settings
            max_headlines = portal_config.get("limit", 50)
            portal_fetch_content = fetch_content or portal_config.get("fetch_content", False)
            
            headlines = scrape_portal(
                portal_slug=portal_slug,
                max_headlines=max_headlines,
                fetch_content=portal_fetch_content,
                content_filter=content_filter
            )
            
            print(f"✅ Scraped {len(headlines)} headlines from {portal_slug}")
            
            if headlines:
                # Prikaži uzorak
                print("\n📰 Sample headlines:")
                for h in headlines[:3]:
                    desc_preview = h['description'][:60] + "..." if h['description'] and len(h['description']) > 60 else (h['description'] or "(no description)")
                    print(f"   • {h['title'][:60]}...")
                    print(f"     └─ {desc_preview}")
                
                if not dry_run:
                    # Spremi u bazu
                    saved_count = db.save_headlines(headlines)
                    print(f"💾 Saved {saved_count} new headlines to database")
                    total_scraped += saved_count
                else:
                    print("🏃 Dry-run mode: Not saving to database")
                    total_scraped += len(headlines)
                    
        except Exception as e:
            print(f"❌ Error scraping {portal_slug}: {e}")
            import traceback
            traceback.print_exc()
    
    # API slanje (ako je konfigurirano)
    if not dry_run and BEARER_TOKEN and BEARER_TOKEN != "dummy":
        print("\n📤 Checking for unsent headlines...")
        unsent = db.get_unsent_headlines()
        
        if unsent:
            print(f"📤 Sending {len(unsent)} headlines to API...")
            
            try:
                import requests
                
                # Transformiraj podatke u format koji API očekuje
                headlines_for_api = []
                for item in unsent:
                    headline = {
                        "portal": item["portal"],
                        "title": item["title"],
                        "url": item["url"],
                        "published_at": item.get("published_at") or datetime.now(timezone.utc).isoformat(),
                    }
                    # Dodaj opcionalna polja
                    if item.get("author"):
                        headline["author"] = item["author"]
                    # U bazi je 'description', API očekuje 'content'
                    if item.get("description"):
                        headline["content"] = item["description"]
                    
                    headlines_for_api.append(headline)
                
                # Kreiraj payload prema API specifikaciji
                payload = {
                    "version": 1,
                    "source": "jutarnji-scraper",
                    "scraped_at": datetime.now(timezone.utc).isoformat(),
                    "headlines": headlines_for_api
                }
                
                session = requests.Session()
                session.headers["Authorization"] = f"Bearer {BEARER_TOKEN}"
                session.headers["Content-Type"] = "application/json"
                
                resp = session.post(
                    API_URL,
                    json=payload,
                    timeout=30
                )
                
                if resp.status_code == 200:
                    db.mark_sent(unsent)
                    print(f"✅ Successfully sent {len(unsent)} headlines to API")
                else:
                    print(f"❌ API error: {resp.status_code} - {resp.text[:200]}")
                    
            except Exception as e:
                print(f"❌ Error sending to API: {e}")
                import traceback
                traceback.print_exc()
        else:
            print("📭 No unsent headlines to send")
    else:
        if dry_run:
            print("\n🏃 Dry-run: Skipping API send")
        else:
            print("\n🔑 No BEARER_TOKEN configured, skipping API send")
    
    # Izvještaj
    print("\n" + "=" * 70)
    print(f"📊 SUMMARY: Total headlines processed: {total_scraped}")
    print("=" * 70)
    
    # Show per-portal stats
    stats = db.get_stats()
    if stats.get("by_portal"):
        print("\n📈 By portal:")
        for portal, count in stats["by_portal"].items():
            print(f"   {portal}: {count}")
    
    return total_scraped


if __name__ == "__main__":
    # Prikaži pomoć
    if "--help" in sys.argv or "-h" in sys.argv:
        print("""
Usage: python main.py [options]

Options:
  -c, --content       Dohvati sadržaj svakog članka (sporije, ali potpunije)
  --dry-run           Pokreni bez spremanja u bazu ili slanja na API
  --portal=NAME       Scrape samo specifični portal (npr. --portal=jutarnji)
  -h, --help          Prikaži ovu pomoć

Primjeri:
  python main.py                  # Svi portali
  python main.py --portal=jutarnji  # Samo Jutarnji
  python main.py --portal=vecernji  # Samo Večernji
  python main.py -c --dry-run      # Test sa sadržajem
        """)
        sys.exit(0)
    
    main()
