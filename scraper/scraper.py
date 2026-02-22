"""
Main scraper module - backward compatibility and convenience functions.

This module provides:
1. Backward compatible imports and functions
2. Convenience wrapper for scraping portals
3. Legacy support for existing code

For new code, use:
    from scrapers import get_scraper, JutarnjiScraper, VecernjiScraper
"""

# Re-export from new modular structure
from scrapers import (
    BaseScraper,
    Article,
    JutarnjiScraper,
    VecernjiScraper,
    get_scraper,
    get_supported_portals,
)

# Also re-export internal components for backward compatibility
from scrapers.base import ResponseCache, CircuitBreaker, ProxyRotator

__all__ = [
    'BaseScraper',
    'Article',
    'JutarnjiScraper',
    'VecernjiScraper',
    'get_scraper',
    'get_supported_portals',
    'ResponseCache',
    'CircuitBreaker',
    'ProxyRotator',
    'scrape_portal',
]


def scrape_portal(
    portal_slug: str,
    max_headlines: int = 200,
    fetch_content: bool = False,
    content_filter=None,
    **kwargs
) -> list:
    """
    Backward compatible function for scraping a portal.
    
    Args:
        portal_slug: Portal name (e.g., 'jutarnji', 'vecernji')
        max_headlines: Maximum articles to fetch
        fetch_content: Whether to fetch full content (for HTML-based scrapers)
        content_filter: ContentFilter instance (optional)
        **kwargs: Additional scraper options
        
    Returns:
        List of articles as dictionaries
    """
    import db
    
    # Create appropriate scraper
    scraper = get_scraper(portal_slug, **kwargs)
    if not scraper:
        print(f"[WARN] Portal '{portal_slug}' not supported")
        return []
    
    # For Jutarnji: use time-based incremental scraping
    # For Vecernji: use ID-based (it works correctly for Vecernji)
    if portal_slug.lower() == 'jutarnji':
        since_time = db.get_last_article_time(portal_slug)
        last_id = None
    else:
        since_time = None
        last_id = db.get_last_article_id(portal_slug)
    
    try:
        # Vecernji needs fetch_content parameter
        if portal_slug.lower() == 'vecernji':
            results, newest_id = scraper.scrape(
                max_articles=max_headlines,
                content_filter=content_filter,
                since_id=last_id,
                fetch_content=fetch_content
            )
            # Save the newest ID for Vecernji
            if newest_id and newest_id != last_id:
                db.set_last_article_id(portal_slug, newest_id)
                print(f"[INFO] Updated last_article_id to {newest_id}")
        else:
            results, newest_time = scraper.scrape(
                max_articles=max_headlines,
                content_filter=content_filter,
                since_time=since_time
            )
            # Save the newest time for Jutarnji
            if newest_time and newest_time != since_time:
                db.set_last_article_time(portal_slug, newest_time)
                print(f"[INFO] Updated last_article_time to {newest_time}")
        
        scraper.print_stats()
        
        # Print filter stats if available
        if content_filter:
            content_filter.print_stats()
        
        return results
        
    except Exception as e:
        print(f"[ERROR] Error scraping {portal_slug}: {e}")
        import traceback
        traceback.print_exc()
        return []
    finally:
        scraper.close()


# Legacy alias for backward compatibility
get_article_description = lambda session, url: ""
