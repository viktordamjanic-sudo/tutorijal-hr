"""
Scraper factory for creating appropriate scraper instances.
"""

from typing import Optional, Type
from .base import BaseScraper
from .jutarnji import JutarnjiScraper
from .vecernji import VecernjiScraper


# Registry of available scrapers
SCRAPER_REGISTRY = {
    'jutarnji': JutarnjiScraper,
    'vecernji': VecernjiScraper,
}


def get_scraper(portal: str, **kwargs) -> Optional[BaseScraper]:
    """
    Factory function to create appropriate scraper for a portal.
    
    Args:
        portal: Portal name (e.g., 'jutarnji', 'vecernji')
        **kwargs: Additional arguments passed to scraper constructor
        
    Returns:
        Scraper instance or None if portal not supported
    """
    portal = portal.lower().strip()
    
    scraper_class = SCRAPER_REGISTRY.get(portal)
    if not scraper_class:
        print(f"[ERROR] Unknown portal: {portal}")
        print(f"[INFO] Supported portals: {', '.join(SCRAPER_REGISTRY.keys())}")
        return None
    
    return scraper_class(**kwargs)


def get_supported_portals() -> list:
    """Get list of supported portal names."""
    return list(SCRAPER_REGISTRY.keys())


def register_scraper(name: str, scraper_class: Type[BaseScraper]):
    """
    Register a new scraper class.
    
    Args:
        name: Portal name
        scraper_class: Scraper class (must inherit from BaseScraper)
    """
    if not issubclass(scraper_class, BaseScraper):
        raise ValueError("Scraper class must inherit from BaseScraper")
    
    SCRAPER_REGISTRY[name.lower()] = scraper_class
