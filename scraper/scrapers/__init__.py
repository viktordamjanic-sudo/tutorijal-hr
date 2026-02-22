"""
Modular scraper package for multiple news portals.

Usage:
    from scrapers import get_scraper, JutarnjiScraper, VecernjiScraper
    
    # Create scraper by name
    scraper = get_scraper('jutarnji')
    
    # Or instantiate directly
    scraper = JutarnjiScraper()
    
    # Scrape articles
    articles, newest_id = scraper.scrape(max_articles=50)
"""

from .base import BaseScraper, Article
from .jutarnji import JutarnjiScraper
from .vecernji import VecernjiScraper
from .factory import get_scraper, get_supported_portals, register_scraper

__all__ = [
    'BaseScraper',
    'Article',
    'JutarnjiScraper',
    'VecernjiScraper',
    'get_scraper',
    'get_supported_portals',
    'register_scraper',
]

__version__ = '2.0.0'
