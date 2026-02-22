"""
Jutarnji.hr scraper using internal JSON API.
"""

import json
import time
from typing import List, Optional, Tuple
from bs4 import BeautifulSoup

from .base import BaseScraper, Article


class JutarnjiScraper(BaseScraper):
    """
    Scraper for Jutarnji.hr using internal JSON API.
    Low-resource, fast, uses structured data.
    """
    
    PORTAL_NAME = "jutarnji"
    BASE_URL = "https://www.jutarnji.hr"
    
    # Internal API endpoints
    API_BASE = "https://www.jutarnji.hr/index.php"
    API_LATEST = f"{API_BASE}?option=com_ocm&view=itemlist&layout=latest&format=json"
    API_CATEGORY = f"{API_BASE}?option=com_ocm&view=itemlist&layout=category&format=json"
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def _parse_article(self, item: dict) -> Article:
        """Parse API item into Article."""
        # Clean HTML from fulltext
        fulltext = item.get('fulltext', '') or item.get('introtext', '')
        
        if fulltext:
            soup = BeautifulSoup(fulltext, 'html.parser')
            
            # Remove unwanted elements
            for elem in soup.find_all(['script', 'style', 'iframe', 'video', 'audio']):
                elem.decompose()
            
            # Get clean text
            clean = soup.get_text(separator='\n', strip=True)
            clean = '\n'.join(line for line in clean.split('\n') if line.strip())
            
            # Also get intro
            intro = soup.find('p')
            intro_text = intro.get_text(strip=True) if intro else clean[:200]
        else:
            clean = ""
            intro_text = ""
        
        # Author info
        author_data = item.get('author', {})
        author = author_data.get('name', '') if isinstance(author_data, dict) else str(author_data)
        
        return Article(
            id=item.get('id', ''),
            portal=self.PORTAL_NAME,
            title=item.get('title', ''),
            url=f"{self.BASE_URL}{item.get('link', '')}",
            content=clean,
            lead=intro_text,
            author=author,
            published_at=item.get('created', item.get('publish_up', '')),
            category=item.get('category_title', ''),
            scraped_at=__import__('datetime').datetime.now().isoformat()
        )
    
    def fetch_latest(self, limit: int = 200, since_time: str = None) -> Tuple[List[Article], str]:
        """
        Fetch latest articles via internal API.
        Note: API returns by ID descending, not by time! Must fetch all then filter.
        
        Args:
            limit: Maximum articles to fetch (default 200 covers ~6 hours)
            since_time: Last seen article timestamp for incremental scraping (ISO format)
            
        Returns:
            tuple: (list of new articles, newest article timestamp)
        """
        print(f"[INFO] Fetching latest {limit} articles via internal API...")
        if since_time:
            print(f"[INFO] Looking for articles newer than {since_time}")
        
        def fetch():
            # Cache-busting: add timestamp to avoid server cache
            params = {
                'limit': limit,
                '_cb': int(time.time())
            }
            resp = self._make_request(
                self.API_LATEST,
                params=params,
                use_cache=False  # Don't cache main feed
            )
            if resp:
                return resp.json()
            return None
        
        try:
            data = self.circuit_breaker.call(fetch)
            if not data or 'items' not in data:
                print("[ERROR] Invalid API response")
                return [], since_time
            
            all_articles = []
            newest_time = since_time
            
            # Parse ALL articles first (API doesn't return in time order)
            for item in data['items'][:limit]:
                article = self._parse_article(item)
                all_articles.append(article)
                
                # Track newest timestamp
                if article.published_at:
                    if not newest_time or article.published_at > newest_time:
                        newest_time = article.published_at
            
            # Now filter by time (API returns by ID, not by time!)
            new_articles = []
            if since_time:
                for article in all_articles:
                    if article.published_at and article.published_at > since_time:
                        new_articles.append(article)
            else:
                new_articles = all_articles
            
            # Sort by time for consistent ordering
            new_articles.sort(key=lambda a: a.published_at or '', reverse=True)
            
            print(f"[INFO] Found {len(new_articles)} new articles (out of {len(all_articles)} total)")
            return new_articles, newest_time
            
        except Exception as e:
            print(f"[ERROR] Circuit breaker or fetch error: {e}")
            return [], since_time
    
    def fetch_article_details(self, article_id: str) -> Optional[Article]:
        """Fetch individual article details (fallback method)."""
        # For internal API, all data is already in list endpoint
        return None
