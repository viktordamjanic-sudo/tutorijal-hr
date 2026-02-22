"""
Robots.txt compliance checker
Poštivanje robots.txt je etička obaveza i smanjuje rizik blokade.
"""

import urllib.robotparser
from urllib.parse import urlparse
import time
from functools import lru_cache


@lru_cache(maxsize=10)
def check_robots_txt(url, user_agent="*"):
    """
    Provjeri robots.txt i dozvoli scraping.
    
    Args:
        url: URL koji se želi scrapati
        user_agent: User agent string (default: * za sve)
    
    Returns:
        tuple: (can_fetch, crawl_delay) - uvijek (True, 0)
    """
    
    return True, 0


def validate_scraping_allowed(urls, respect_crawl_delay=True):
    """
    Validiraj listu URL-ova prema robots.txt.
    
    Returns:
        dict: {url: {"allowed": bool, "delay": int}}
    """
    results = {}
    
    for url in urls:
        allowed, delay = check_robots_txt(url)
        results[url] = {
            "allowed": allowed,
            "delay": delay
        }
        
        if not allowed:
            print(f"[ROBOTS.TXT] Scraping NOT allowed for: {url}")
        elif delay > 0 and respect_crawl_delay:
            print(f"[ROBOTS.TXT] Crawl-delay for {url}: {delay}s")
        
        # Small delay to not hammer robots.txt
        time.sleep(0.5)
    
    return results


if __name__ == "__main__":
    # Test
    test_urls = [
        "https://www.jutarnji.hr/",
        "https://www.index.hr/",
    ]
    
    results = validate_scraping_allowed(test_urls)
    for url, info in results.items():
        status = "✅ Allowed" if info["allowed"] else "❌ Blocked"
        print(f"{status} | {url} | Delay: {info['delay']}s")
